# OAuth Setup Guide for ZCraft

## Overview
This application supports complete OAuth authentication with three providers:
1. **Discord** - Via Discord OAuth2 or Supabase Auth
2. **GitHub** - Via Supabase Auth
3. **Google** - Via Supabase Auth

## OAuth Flow Architecture

### 1. Supabase OAuth Providers (GitHub & Google)

**Flow:**
```
User clicks "GitHub" or "Google" button
    ↓
AuthContext.signInWithGithub() / signInWithGoogle()
    ↓
Supabase redirects to configured callback URL
    ↓
/auth/callback route → AuthCallbackPage
    ↓
AuthCallbackPage checks session and redirects to /profile or /login
```

**Configuration in Supabase:**
1. Go to Supabase Project Settings → Authentication → Providers
2. Enable GitHub:
   - Create GitHub OAuth App at https://github.com/settings/developers
   - Set Authorization callback URL to: `https://yourdomain.com/auth/callback`
   - Add Client ID and Client Secret to Supabase

3. Enable Google:
   - Create Google OAuth App at https://console.cloud.google.com
   - Set Authorized redirect URIs to: `https://yourdomain.com/auth/callback`
   - Add Client ID and Client Secret to Supabase

**Callback Handler:**
- File: `src/pages/AuthCallbackPage.tsx`
- Waits for Supabase session to be established
- Fetches user profile from database
- Redirects to profile or login based on auth state

### 2. Discord OAuth (Custom Flow)

**Flow:**
```
User clicks "Discord" button
    ↓
AuthContext.signInWithDiscord()
    ↓
Redirects to Discord OAuth authorize URL with client_id, redirect_uri, scopes
    ↓
User approves permissions
    ↓
Discord redirects to /auth/discord/callback with authorization code
    ↓
DiscordCallbackPage extracts code
    ↓
Backend: /api/auth/discord/exchange endpoint
    ├─ Exchanges code for access token with Discord
    ├─ Fetches Discord user profile
    └─ Calls Supabase to create/update user
    ↓
Frontend receives user data and creates Supabase session
    ↓
User authenticated and redirected to /profile
```

**Configuration:**

1. **Create Discord Application:**
   - Go to https://discord.com/developers/applications
   - Click "New Application"
   - Name it "ZCraft"
   - Copy the Client ID
   - Under "OAuth2" → "General", set Redirect URLs to:
     ```
     https://yourdomain.com/auth/callback
     ```
   - Copy the Client Secret

2. **Environment Variables:**
   ```
   VITE_DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here (backend only)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Backend Endpoint (Needs Implementation):**
   - Endpoint: `POST /api/auth/discord/exchange`
   - Receives: `{ code: string, state?: string }`
   - Returns: Authenticated user data with Supabase session tokens
   - Implementation: See section below

### 3. Backend Implementation for Discord

Create `backend/routes/auth.ts` or similar:

```typescript
import { discordOAuth } from '../services/discord';
import { supabase } from '../config/supabase';

export async function exchangeDiscordCode(code: string) {
  try {
    // 1. Exchange code for Discord tokens
    const tokens = await discordOAuth.getAccessToken(code);
    
    // 2. Fetch Discord user profile
    const discordUser = await discordOAuth.getUserProfile(tokens.access_token);
    
    // 3. Create or update user in Supabase
    const { data, error } = await supabase.from('users').upsert({
      email: discordUser.email,
      username: discordUser.username,
      discord_id: discordUser.id,
      avatar_url: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
      role: 'user',
      created_at: new Date().toISOString(),
    }, {
      onConflict: 'discord_id'
    });
    
    if (error) throw error;
    
    // 4. Create Supabase session for the user
    const { data: sessionData } = await supabase.auth.signInWithPassword({
      email: discordUser.email,
      password: generateSecurePassword() // Use hashed Discord ID
    });
    
    return {
      user: data,
      session: sessionData
    };
  } catch (error) {
    throw new Error(`Discord OAuth failed: ${error.message}`);
  }
}

// Helper to exchange authorization code for access token
async function getAccessToken(code: string) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.PUBLIC_URL}/auth/callback`
    })
  });
  
  if (!response.ok) throw new Error('Failed to get Discord access token');
  return response.json();
}

// Helper to fetch Discord user profile
async function getUserProfile(accessToken: string) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch Discord profile');
  return response.json();
}
```

## Frontend Integration

### Login Page (`src/pages/LoginPage.tsx`)
- OAuth button grid with Discord, GitHub, Google
- Each button calls `handleOAuthSignIn(provider)`
- Loading state managed with `oauthLoading` state variable
- Error handling via toast notifications

### Register Page (`src/pages/RegisterPage.tsx`)
- Same 3-provider OAuth grid below form
- Users can sign up with OAuth or email
- Optional fields for OAuth users

### Callback Pages

**AuthCallbackPage.tsx** - Generic Supabase callback:
```typescript
- Checks `useAuthLoading()` from AuthContext
- Waits for Supabase session
- Fetches user profile
- Redirects appropriately
```

**DiscordCallbackPage.tsx** - Discord-specific callback:
```typescript
- Extracts authorization code from URL
- Calls backend /api/auth/discord/exchange
- Creates Supabase session
- Fetches user profile
- Redirects to /profile
```

## Admin Discord Link Configuration

**Route:** `/admin/settings`

The admin can set the Discord server invite link via the admin panel. This link is:
1. Stored in `admin_settings` table with key `discord_link`
2. Retrieved by `/discord` route (DiscordRedirectPage)
3. Users are redirected to the configured Discord server

**Implementation:**
```typescript
// Set Discord link
await settingsService.setDiscordLink('https://discord.gg/xpfJW7ZZAt');

// Get Discord link (when accessing /discord)
const link = await settingsService.getDiscordLink();
window.location.href = link; // Redirect
```

## Database Schema

```sql
-- Users table with OAuth fields
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  minecraft_username VARCHAR,
  discord_id VARCHAR UNIQUE,
  github_id VARCHAR UNIQUE,
  google_id VARCHAR UNIQUE,
  avatar_url VARCHAR,
  role VARCHAR DEFAULT 'user', -- user, moderator, admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin settings for Discord link
CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Local Development Testing

1. **For Supabase OAuth (GitHub/Google):**
   - Use localhost redirect: `http://localhost:5173/auth/callback`
   - Update OAuth app settings accordingly
   - Test in browser: Click GitHub/Google button

2. **For Discord OAuth:**
   - Set up ngrok to expose local backend: `ngrok http 3001`
   - Update Discord app redirect to: `https://your-ngrok-url/auth/callback`
   - Update frontend env: `VITE_DISCORD_REDIRECT_URI=https://your-ngrok-url/auth/callback`

## Scopes Requested

- **GitHub:** `user:email` (read user profile and email)
- **Google:** `openid email profile` (basic profile)
- **Discord:** `identify email` (user ID, username, email)

## Security Considerations

1. **Never expose Discord Client Secret** - Keep in backend only
2. **CSRF Protection** - Use state parameter in OAuth URLs
3. **HTTPS Required** - All OAuth redirects must use HTTPS in production
4. **Token Expiry** - Handle refresh tokens for long-lived sessions
5. **RLS Policies** - Database enforces user data isolation

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OAuth callback shows blank page | Check if route exists in App.tsx routes |
| "Redirect URI mismatch" error | Verify exact redirect URL in OAuth app settings |
| Discord user not created | Ensure backend endpoint is deployed and working |
| Session not persisting | Check Supabase session storage and browser cookies |

## Next Steps

1. ✅ OAuth button UI (Complete - Discord, GitHub, Google)
2. ✅ Supabase OAuth flow (Complete - Generic callback handler)
3. ✅ Discord OAuth button (Complete - Handler created)
4. ⏳ Backend `/api/auth/discord/exchange` endpoint (Pending)
5. ⏳ Admin settings page (Pending)
6. ⏳ Replace mock data with real Supabase queries (Pending)
