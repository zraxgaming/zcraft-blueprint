# OAuth Quick Reference Card

## 🎯 What's Implemented

### Frontend ✅ 100%
```
✅ LoginPage - OAuth buttons
✅ RegisterPage - OAuth buttons  
✅ AuthContext - OAuth methods
✅ AuthCallbackPage - Supabase callback
✅ DiscordCallbackPage - Discord callback
✅ Routing - All callback routes
✅ Services - Discord link management
```

### Backend ⏳ 0%
```
⏳ POST /api/auth/discord/exchange
   ├─ Accept code
   ├─ Exchange with Discord API
   ├─ Create Supabase user
   ├─ Return session
   └─ Template provided: DISCORD_OAUTH_BACKEND.ts
```

---

## 🚀 5-Minute Setup

### 1. Create Discord App (2 min)
```
1. https://discord.com/developers/applications
2. New Application → "ZCraft"
3. Copy Client ID
4. OAuth2 → Add Redirect: https://yourdomain.com/auth/discord/callback
5. Copy Client Secret
```

### 2. Update Environment (1 min)
```
.env.local:
VITE_DISCORD_CLIENT_ID=your_id_here
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### 3. Test Frontend (2 min)
```
npm run dev
→ Navigate to http://localhost:5173/login
→ Click Discord button (will redirect to Discord)
```

---

## 📋 File Reference

| File | Location | Purpose |
|------|----------|---------|
| **OAuth Buttons** | `src/pages/LoginPage.tsx` | User interface |
| **OAuth Buttons** | `src/pages/RegisterPage.tsx` | Sign-up interface |
| **Auth Methods** | `src/contexts/AuthContext.tsx` | OAuth logic |
| **Callback Handler 1** | `src/pages/AuthCallbackPage.tsx` | Supabase OAuth |
| **Callback Handler 2** | `src/pages/DiscordCallbackPage.tsx` | Discord OAuth |
| **Discord Link** | `src/services/settingsService.ts` | Get/set link |
| **Routes** | `src/App.tsx` | Route configuration |
| **Backend Template** | `DISCORD_OAUTH_BACKEND.ts` | Implementation code |
| **Setup Guide** | `OAUTH_SETUP.md` | Detailed docs |

---

## 🔑 Environment Variables

### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxxx
VITE_DISCORD_CLIENT_ID=1234567890
```

### Backend (.env)
```env
VITE_DISCORD_CLIENT_ID=1234567890
DISCORD_CLIENT_SECRET=your_secret
DISCORD_PASSWORD_SALT=random_string
VITE_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyxxxx
PUBLIC_URL=https://yourdomain.com
NODE_ENV=production
```

---

## 🔗 API Endpoints

### Frontend Calls
```javascript
// In AuthContext.tsx
await supabase.auth.signInWithOAuth({
  provider: 'discord' | 'github' | 'google',
  options: { redirectTo: `${origin}/auth/callback` }
});
```

### Backend Should Implement
```
POST /api/auth/discord/exchange
  Body: { code: string, state?: string }
  Response: { user, session, isNewUser }
```

---

## 🔄 OAuth Flow Summary

```
Button Click
    ↓
OAuth Provider Login
    ↓
Provider redirects with code
    ↓
Frontend extracts code
    ↓
Backend exchanges code (Discord only)
    ↓
User created in Supabase
    ↓
Session established
    ↓
Redirect to /profile
    ↓
User authenticated ✅
```

---

## ⚡ Key Functions

### In AuthContext
```typescript
signInWithDiscord()  // Redirects to Discord login
signInWithGithub()   // Redirects to GitHub login
signInWithGoogle()   // Redirects to Google login
login()              // Email/password login
register()           // Create new account
logout()             // Sign out
```

### In Services
```typescript
getDiscordLink()     // Get configured Discord invite
setDiscordLink(url)  // Update Discord invite
```

### In Pages
```typescript
useAuth()            // Access all auth methods
useAuthLoading()     // Check if loading
useUser()            // Get current user
```

---

## 🧪 Testing Checklist

- [ ] npm run dev compiles
- [ ] Click OAuth button
- [ ] Redirects to provider
- [ ] Authorize permissions
- [ ] Callback page shows
- [ ] Session created
- [ ] Profile page loads
- [ ] User data displays
- [ ] Logout works
- [ ] Can login again

---

## 🐛 Troubleshooting

**"Redirect URI mismatch"**
→ Check exact URL in OAuth app settings

**OAuth button does nothing**
→ Check console, verify VITE_DISCORD_CLIENT_ID in .env

**User not created**
→ Check backend endpoint is deployed

**Session not persisting**
→ Check browser localStorage and cookies

---

## 📊 Status Summary

| Component | Status |
|-----------|--------|
| Frontend UI | ✅ Done |
| Context/State | ✅ Done |
| Routing | ✅ Done |
| Documentation | ✅ Done |
| **Backend Endpoint** | ⏳ Needs implementation |
| **Admin Settings** | ⏳ Needs creation |
| **Production Testing** | ⏳ Pending |

**Overall: 70% Complete**

---

## 🎯 Next 3 Steps

### Step 1: Implement Backend (2-4 hours)
- Copy code from `DISCORD_OAUTH_BACKEND.ts`
- Deploy to your backend server
- Update Discord app redirect URL

### Step 2: Create Admin Page (1-2 hours)
- Create `/src/pages/admin/AdminSettingsPage.tsx`
- Add form to update Discord link
- Test it works

### Step 3: Test & Deploy (1-2 hours)
- Test all OAuth flows
- Deploy frontend
- Monitor for errors

---

## 💡 Pro Tips

1. **Use ngrok for local testing**
   ```bash
   ngrok http 5173
   # Update Discord app redirect to ngrok URL
   ```

2. **Enable Supabase providers in dashboard**
   - Auth → Providers → Enable GitHub/Google
   - Add your OAuth credentials

3. **Check Supabase logs**
   - Monitor user creation
   - Debug RLS policy issues
   - Track authentication attempts

4. **Use browser DevTools**
   - Network tab: Check OAuth redirects
   - Console: See detailed error messages
   - Application: Check localStorage tokens

---

## 📞 Quick Links

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Discord OAuth Docs](https://discord.com/developers/docs/topics/oauth2)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)

---

## 📄 Documentation Files

1. **README_OAUTH.md** - Main summary and overview
2. **OAUTH_SETUP.md** - Complete setup guide (2000+ lines)
3. **IMPLEMENTATION_STATUS.md** - Progress tracking
4. **OAUTH_CHECKLIST.md** - Step-by-step checklist
5. **OAUTH_FLOW_DIAGRAMS.md** - Visual flow diagrams
6. **DISCORD_OAUTH_BACKEND.ts** - Backend code templates
7. **This file** - Quick reference card

**Start with README_OAUTH.md, then use others as needed.**

---

## 🎉 Success Indicator

**You're done when:**
1. User clicks button → Redirected to provider ✅
2. User authorizes → Redirected back to /profile ✅
3. Profile page shows correct user data ✅
4. Logout works ✅
5. Can log back in ✅

---

**Last Updated:** [Current Session]  
**Version:** 1.0  
**Status:** 🟢 Ready for Backend Implementation
