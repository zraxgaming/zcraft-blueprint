# ZCraft Blueprint - Complete SQL Schema

## Overview
This file contains the complete, production-ready SQL schema for the ZCraft Blueprint project with comprehensive failsafes.

## File Location
**File**: `supabase_complete.sql`

## Key Features

### ✅ Failsafe Mechanisms
- **IF NOT EXISTS clauses** on all CREATE statements (tables, indexes, extensions, policies, triggers)
- **DROP POLICY IF EXISTS** before creating policies to avoid conflicts
- **DROP TRIGGER IF EXISTS** before creating triggers for clean updates
- **ON CONFLICT DO UPDATE** for seed data to handle existing records gracefully

### 📊 Complete Table Structure

#### Users & Roles
- `users` - User profiles and accounts
- `user_roles` - Granular role management (helper, moderator, admin, owner, etc.)

#### Content Management
- `news` - Server announcements and news articles
- `forums` - Forum categories
- `forum_posts` - Forum threads/posts
- `forum_replies` - Forum post replies
- `wiki` - Knowledge base and documentation
- `changelogs` - Version history and release notes ✨ (NEW)
- `events` - Server events (legacy support)

#### System
- `admin_settings` - Configuration and settings

### 🔒 Security Features
- Row Level Security (RLS) enabled on all tables
- Role-based access control (owner, admin, moderator, helper, player, user)
- Granular permission policies for each resource
- Settings filtering to prevent exposing sensitive keys

### 📈 Performance
- **70+ indexes** for optimized query performance
- Indexes on foreign keys, commonly filtered fields, and sorting columns
- Indexes on newly added changelogs table (version, type, released_at)

### ⏰ Automatic Timestamps
- `updated_at` triggers on all tables with modifications
- Automatic timestamp updates on changes

### 🎯 New Features (Recent Updates)

#### Changelogs Table
```sql
- version (UNIQUE)
- title
- description
- changes (TEXT array)
- type (feature|fix|improvement|patch)
- released_at (DATE)
```

#### Updated Admin Settings
- `java_ip` - Java Edition IP
- `bedrock_ip` - Bedrock Edition IP
- `server_port` - Port for both editions
- `discord_link` - Discord invite (discord.z-craft.xyz)
- All settings with conflict handling

#### Enhanced User Roles
- Now supports: user, player, helper, moderator, admin, owner
- Separate `user_roles` table for granular management

### 🔧 Deployment Instructions

1. **In Supabase SQL Editor**:
   ```sql
   -- Copy entire content from supabase_complete.sql
   -- Paste into Supabase SQL Editor
   -- Click "Execute"
   ```

2. **Safe to Run Multiple Times**:
   - All CREATE statements use `IF NOT EXISTS`
   - All DROP statements check existence first
   - Seed data uses `ON CONFLICT` handling
   - Can be safely run repeatedly without errors

3. **Database Will**:
   - Create missing tables
   - Add missing indexes
   - Set up RLS policies
   - Trigger functions
   - Initialize settings with latest values

### 📋 Default Settings Initialized
- Server IPs: `play.zcraftmc.xyz:11339` (Java), `bedrock.zcraftmc.xyz:11339` (Bedrock)
- Discord: `https://discord.z-craft.xyz`
- Status: `https://status.z-craft.xyz`
- Store: `https://store.z-craft.xyz`
- All feature flags: registration enabled, email verification enabled, etc.

### 🛡️ Role Hierarchy
1. **owner** - Full system access (highest)
2. **admin** - Can manage all content and settings
3. **moderator** - Can create content, moderate forums
4. **helper** - Limited moderation roles
5. **player** - Regular player role
6. **user** - Default user role

### 🔄 RLS Policy Pattern
- **Public reads** for user profiles, news, forums, changelogs
- **Auth-required for creation** - Must be authenticated user
- **Author edits own content** - News, forum posts
- **Admin management** - Forums, settings, deletions
- **Moderator support** - Content moderation, some deletions

### 📝 Table Comments & Documentation
All tables and key columns include SQL comments for clarity and team documentation.

## Compatibility
- ✅ Supabase PostgreSQL
- ✅ PostgreSQL 13+
- ✅ Works with existing Supabase auth system
- ✅ Compatible with all TypeScript/React frontend code

## Notes
- This schema replaces the original `supabase.sql`
- Can be imported directly into any Supabase project
- Includes migration path from old Events to new Changelogs
- All Discord links point to `discord.z-craft.xyz`
- All server IPs updated to `zcraftmc.xyz` with port `11339`
