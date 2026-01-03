# OAuth Flow Diagrams

## 1. Discord OAuth Flow (Custom Backend)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ BROWSER (Frontend)                                                       │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 1. User clicks "Discord" button
       │ handleOAuthSignIn('discord')
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ LoginPage.tsx                                                            │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ <Button onClick={() => handleOAuthSignIn('discord')}>           │   │
│ │   Discord                                                        │   │
│ │ </Button>                                                        │   │
│ └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 2. Calls AuthContext.signInWithDiscord()
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ AuthContext.tsx                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ const signInWithDiscord = async () => {                         │   │
│ │   const result = await supabase.auth.signInWithOAuth({         │   │
│ │     provider: 'discord',                                        │   │
│ │     options: {                                                  │   │
│ │       redirectTo: window.location.origin + '/auth/callback'     │   │
│ │     }                                                           │   │
│ │   });                                                           │   │
│ │ }                                                               │   │
│ └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 3. Redirects to Discord Login Page
       │    https://discord.com/oauth/authorize?client_id=XXX&...
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ DISCORD OAUTH SERVER                                                     │
│                                                                          │
│ User logs in and authorizes permissions                                 │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 4. Discord redirects back with authorization code
       │    https://localhost:5173/auth/discord/callback?code=XXX&state=YYY
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ DiscordCallbackPage.tsx                                                  │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Extract code from URL:                                           │   │
│ │ const code = searchParams.get('code');                           │   │
│ │                                                                  │   │
│ │ Call backend to exchange code:                                   │   │
│ │ await fetch('/api/auth/discord/exchange', {                      │   │
│ │   method: 'POST',                                                │   │
│ │   body: JSON.stringify({ code, state })                         │   │
│ │ });                                                              │   │
│ └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 5. POST to backend with authorization code
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js/Python/etc)                                            │
│                                                                          │
│ POST /api/auth/discord/exchange                                         │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Step 1: Exchange code for access token                           │   │
│ │ POST https://discord.com/api/oauth2/token {                      │   │
│ │   client_id, client_secret, code, grant_type                     │   │
│ │ } → { access_token, ... }                                        │   │
│ │                                                                  │   │
│ │ Step 2: Fetch Discord user profile                              │   │
│ │ GET https://discord.com/api/users/@me {                          │   │
│ │   Authorization: Bearer access_token                             │   │
│ │ } → { id, username, email, avatar, ... }                        │   │
│ │                                                                  │   │
│ │ Step 3: Create/update user in Supabase                          │   │
│ │ supabase.from('users').upsert({                                 │   │
│ │   email, username, discord_id, avatar_url, role: 'user'         │   │
│ │ })                                                               │   │
│ │                                                                  │   │
│ │ Step 4: Return user data and session                             │   │
│ │ { user, session, isNewUser }                                     │   │
│ └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 6. Return to frontend with user data
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ DiscordCallbackPage.tsx (continued)                                      │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Receive response from backend                                    │   │
│ │ Set Supabase session with tokens                                 │   │
│ │ Fetch user profile                                               │   │
│ │ Redirect to /profile                                             │   │
│ └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ 7. User authenticated and logged in
       │
       ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ ProfilePage.tsx                                                          │
│                                                                          │
│ User profile displayed with Discord data:                               │
│ - Username from Discord                                                 │
│ - Avatar from Discord                                                   │
│ - Email from Discord                                                    │
│ - Member badge for Discord users                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Supabase OAuth Flow (GitHub/Google)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ BROWSER                                                                   │
│                                                                           │
│ 1. Click "GitHub" or "Google" button                                     │
│    AuthContext.signInWithGithub() or signInWithGoogle()                  │
└──────────────────────────────────────────────────────────────────────────┘
         │
         │ 2. Call Supabase Auth
         │ supabase.auth.signInWithOAuth({
         │   provider: 'github' | 'google',
         │   options: { redirectTo: '/auth/callback' }
         │ })
         │
         ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ OAUTH PROVIDER (GitHub or Google)                                        │
│                                                                           │
│ User logs in and authorizes permissions                                  │
└──────────────────────────────────────────────────────────────────────────┘
         │
         │ 3. Provider redirects to Supabase
         │    https://supabase-project.supabase.co/auth/v1/callback
         │
         ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ SUPABASE AUTH SERVER                                                     │
│                                                                           │
│ - Exchanges code for access token                                        │
│ - Creates Supabase user if new                                           │
│ - Generates session tokens                                               │
│ - Redirects to frontend callback URL                                     │
└──────────────────────────────────────────────────────────────────────────┘
         │
         │ 4. Supabase redirects back
         │    https://localhost:5173/auth/callback
         │    (Session tokens in URL fragment)
         │
         ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ AuthCallbackPage.tsx                                                      │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ 1. Check useAuthLoading() state                                   │  │
│ │ 2. Wait for session to be established                             │  │
│ │ 3. Fetch user profile from database                               │  │
│ │ 4. Redirect to /profile if authenticated                          │  │
│ │ 5. Redirect to /login if not authenticated                        │  │
│ └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ ProfilePage.tsx                                                           │
│                                                                           │
│ User is authenticated with GitHub/Google account                         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Complete Authentication Flow with All Providers

```
┌─────────────────────────────────────────────────────────────────┐
│ User visits /login                                              │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────┬─────────────────────┬──────────────────┐
         │                     │                     │                  │
         ↓                     ↓                     ↓                  ↓
    [Discord]            [GitHub]              [Google]         [Email/Pass]
   ┌──────────┐         ┌──────────┐          ┌──────────┐      ┌──────────┐
   │ OAuth    │         │ OAuth    │          │ OAuth    │      │ Form     │
   │ Button   │         │ Button   │          │ Button   │      │ Submit   │
   └──────────┘         └──────────┘          └──────────┘      └──────────┘
         │                   │                     │                  │
         │ Custom Backend    │ Supabase Auth      │ Supabase Auth    │ Supabase
         │ /api/auth/...     │ /auth/callback     │ /auth/callback   │ signIn
         │                   │                     │                  │
         └──────────────────┬┴─────────────────────┴──────────────────┘
                            │
                            ↓
              ┌──────────────────────────────┐
              │ Supabase Session Created     │
              │ - Access Token               │
              │ - Refresh Token              │
              │ - Expires In                 │
              └──────────────────────────────┘
                            │
                            ↓
              ┌──────────────────────────────┐
              │ User Profile Fetched         │
              │ - ID, Email, Username        │
              │ - Avatar, Role, etc.         │
              └──────────────────────────────┘
                            │
                            ↓
              ┌──────────────────────────────┐
              │ Session Stored in            │
              │ - Browser LocalStorage       │
              │ - Context State              │
              │ - Cookie (if configured)     │
              └──────────────────────────────┘
                            │
                            ↓
              ┌──────────────────────────────┐
              │ Redirect to /profile         │
              │ or Home if already authenticated
              └──────────────────────────────┘
                            │
                            ↓
            ┌───────────────────────────────────┐
            │ User fully authenticated           │
            │ Can access protected routes        │
            │ Profile page shows user data       │
            │ Admin pages visible if admin       │
            └───────────────────────────────────┘
```

---

## 4. Data Flow from OAuth to Database

```
┌─────────────────────────────────────┐
│ OAuth Provider                      │
│ (Discord/GitHub/Google)             │
│                                     │
│ Returns:                            │
│ - user.id (provider_id)             │
│ - user.username                     │
│ - user.email                        │
│ - user.avatar_url                   │
│ - user.name                         │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│ Backend Processing                  │
│                                     │
│ Maps to database fields:            │
│ - discord_id / github_id / google_id│
│ - username                          │
│ - email                             │
│ - avatar_url                        │
│ - minecraft_username (optional)     │
│ - role (default: 'user')            │
└─────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────────────┐
│ Supabase Database                              │
│                                                │
│ users table:                                   │
│ ┌──────────────────────────────────────────┐  │
│ │ id (UUID)                                │  │
│ │ email (unique)                           │  │
│ │ username (unique)                        │  │
│ │ discord_id (unique, nullable)            │  │
│ │ github_id (unique, nullable)             │  │
│ │ google_id (unique, nullable)             │  │
│ │ minecraft_username (nullable)            │  │
│ │ avatar_url (nullable)                    │  │
│ │ role (user|moderator|admin)              │  │
│ │ created_at, updated_at                   │  │
│ └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────────────┐
│ Frontend Access                                │
│                                                │
│ ProfilePage reads from:                        │
│ - AuthContext (cached)                         │
│ - Supabase Real-time (updated)                 │
│                                                │
│ Displays:                                      │
│ - User avatar                                  │
│ - Username                                     │
│ - Email                                        │
│ - Member since (created_at)                    │
│ - Role badge                                   │
│ - OAuth provider icon                          │
└────────────────────────────────────────────────┘
```

---

## 5. Session Management Flow

```
┌──────────────────────────────────┐
│ 1. OAuth Complete                │
│ - Backend returns tokens         │
│ - Frontend receives response     │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ 2. Session Created               │
│ - Access Token (short-lived)     │
│ - Refresh Token (long-lived)     │
│ - User ID                        │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ 3. Stored in Browser             │
│ - LocalStorage (session tokens)  │
│ - Context State (user data)      │
│ - Cookies (if configured)        │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ 4. Persists Across Reloads       │
│ - User stays logged in           │
│ - Profile visible on return      │
│ - No need to re-authenticate     │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ 5. Token Refresh (Automatic)     │
│ - Access token expires           │
│ - Refresh token used to get new  │
│ - User session continues         │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ 6. Logout Clears Session         │
│ - Remove tokens                  │
│ - Clear context state            │
│ - Clear localStorage             │
│ - Redirect to login              │
└──────────────────────────────────┘
```

---

## 6. Admin Discord Link Configuration

```
┌──────────────────────────────────┐
│ Admin Dashboard                  │
│ /admin/settings                  │
└──────────────────────────────────┘
         │
         │ Admin enters:
         │ "https://discord.gg/abc123"
         │
         ↓
┌──────────────────────────────────────────┐
│ AdminSettingsPage.tsx                    │
│                                          │
│ Call:                                    │
│ await settingsService.setDiscordLink()   │
└──────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ settingsService.ts                       │
│                                          │
│ INSERT/UPDATE admin_settings:            │
│ { key: 'discord_link', value: '...' }    │
└──────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ Supabase Database                        │
│ admin_settings table                     │
│ ┌──────────────────────────────────────┐ │
│ │ id | key           | value           │ │
│ │ 1  | discord_link  | discord.gg/...  │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ User visits /discord                     │
│                                          │
│ DiscordRedirectPage:                     │
│ 1. Fetch discord_link from settings      │
│ 2. window.location.href = link           │
│ 3. Redirect to Discord server            │
└──────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ User Discord Server                      │
│                                          │
│ User redirected to configured server     │
│ Can join and participate                 │
└──────────────────────────────────────────┘
```

---

## 7. Error Handling Flow

```
┌──────────────────────────────────────┐
│ OAuth Flow Error                     │
└──────────────────────────────────────┘
         │
         ├─────────────────┬──────────────────┬──────────────┐
         │                 │                  │              │
         ↓                 ↓                  ↓              ↓
   Invalid Code    User Denied       Provider Down     Network Error
         │                 │                  │              │
         └─────────────────┼──────────────────┼──────────────┘
                           │
                           ↓
                  ┌──────────────────┐
                  │ Catch Error in:  │
                  │ - Callback Page  │
                  │ - AuthContext    │
                  │ - handleOAuthSignIn
                  └──────────────────┘
                           │
                           ↓
                  ┌──────────────────────┐
                  │ Show Toast Error:    │
                  │ "Discord sign-in     │
                  │  failed: [reason]"   │
                  └──────────────────────┘
                           │
                           ↓
                  ┌──────────────────────┐
                  │ Reset Loading State  │
                  │ Clear oauthLoading   │
                  │ Enable buttons again │
                  └──────────────────────┘
                           │
                           ↓
                  ┌──────────────────────┐
                  │ User Can Retry       │
                  │ Click button again   │
                  │ Try different method │
                  │ Use email/password   │
                  └──────────────────────┘
```

---

**These diagrams show the complete OAuth flow from user interaction to database storage to final authentication.**

Save this file for reference during implementation!
