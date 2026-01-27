# Webhook Integration Guide

## What Are Event Webhooks?

**Event webhooks** are HTTP POST requests automatically sent to external URLs when specific actions occur in your application. They enable real-time notifications and integrations with other services.

### Key Concepts:

- **Event**: An action that happens (e.g., "a new event is created")
- **Webhook**: A URL that receives a POST request with event data
- **Silent Failure**: If a webhook URL fails, the app continues normally without errors

### Common Use Cases:

1. **Discord/Slack Notifications** - Post announcements when things happen
2. **Email Alerts** - Send emails when important events occur
3. **External Logging** - Track all changes in a separate logging system
4. **Automation** - Trigger actions in other services (Zapier, Make, etc.)
5. **Data Sync** - Keep external databases synchronized
6. **Analytics** - Send event data to analytics platforms

### Example Webhook Flow:

```
User creates an event
    ↓
Application detects creation
    ↓
Sends HTTP POST to: https://discord.com/api/webhooks/...
    ↓
Discord receives and posts to channel
    ↓
Users see notification in Discord
```

## Configuration

All webhook URLs are configured via environment variables in the `.env` file. Each event type has its own configuration variable.

### Environment Variables

```dotenv
# ========== EVENT WEBHOOKS ==========
# Triggered when events are created, updated, deleted, or registered
VITE_WEBHOOK_EVENT_CREATED=https://example.com/webhooks/event/created
VITE_WEBHOOK_EVENT_UPDATED=https://example.com/webhooks/event/updated
VITE_WEBHOOK_EVENT_DELETED=https://example.com/webhooks/event/deleted
VITE_WEBHOOK_EVENT_REGISTERED=https://example.com/webhooks/event/registered
VITE_WEBHOOK_EVENT_UNREGISTERED=https://example.com/webhooks/event/unregistered

# ========== FORUM WEBHOOKS ==========
# Triggered when forums, posts, or replies are created, updated, or deleted
VITE_WEBHOOK_FORUM_CREATED=https://example.com/webhooks/forum/created
VITE_WEBHOOK_FORUM_UPDATED=https://example.com/webhooks/forum/updated
VITE_WEBHOOK_FORUM_DELETED=https://example.com/webhooks/forum/deleted
VITE_WEBHOOK_FORUM_POST_CREATED=https://example.com/webhooks/forum/post/created
VITE_WEBHOOK_FORUM_POST_UPDATED=https://example.com/webhooks/forum/post/updated
VITE_WEBHOOK_FORUM_POST_DELETED=https://example.com/webhooks/forum/post/deleted
VITE_WEBHOOK_FORUM_REPLY_CREATED=https://example.com/webhooks/forum/reply/created
VITE_WEBHOOK_FORUM_REPLY_UPDATED=https://example.com/webhooks/forum/reply/updated
VITE_WEBHOOK_FORUM_REPLY_DELETED=https://example.com/webhooks/forum/reply/deleted

# ========== CHANGELOG WEBHOOKS ==========
# Triggered when changelogs are created, updated, or deleted
VITE_WEBHOOK_CHANGELOG_CREATED=https://example.com/webhooks/changelog/created
VITE_WEBHOOK_CHANGELOG_UPDATED=https://example.com/webhooks/changelog/updated
VITE_WEBHOOK_CHANGELOG_DELETED=https://example.com/webhooks/changelog/deleted

# ========== NEWS WEBHOOKS ==========
VITE_WEBHOOK_NEWS_CREATED=https://example.com/webhooks/news/created
VITE_WEBHOOK_NEWS_UPDATED=https://example.com/webhooks/news/updated
VITE_WEBHOOK_NEWS_DELETED=https://example.com/webhooks/news/deleted
VITE_WEBHOOK_NEWS_VIEWED=https://example.com/webhooks/news/viewed

# ========== WIKI WEBHOOKS ==========
VITE_WEBHOOK_WIKI_CREATED=https://example.com/webhooks/wiki/created
VITE_WEBHOOK_WIKI_UPDATED=https://example.com/webhooks/wiki/updated
VITE_WEBHOOK_WIKI_DELETED=https://example.com/webhooks/wiki/deleted
VITE_WEBHOOK_WIKI_VIEWED=https://example.com/webhooks/wiki/viewed

# ========== USER/AUTH WEBHOOKS ==========
VITE_WEBHOOK_USER_REGISTERED=https://example.com/webhooks/user/registered
VITE_WEBHOOK_USER_LOGIN=https://example.com/webhooks/user/login
VITE_WEBHOOK_USER_PROFILE_UPDATED=https://example.com/webhooks/user/profile-updated
```

## Webhook Events

### Event Webhooks

#### EVENT_CREATED
Triggered when a new event is created.

**Payload:**
```json
{
  "event": "event_created",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "eventId": "event-uuid",
    "title": "Event Title",
    "date": "2026-02-15T14:00:00Z",
    "location": "Downtown Hall",
    "description": "Event description"
  }
}
```

#### EVENT_UPDATED
Triggered when an event is updated.

**Payload:**
```json
{
  "event": "event_updated",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "eventId": "event-uuid",
    "title": "Event Title",
    "date": "2026-02-15T14:00:00Z",
    "location": "Downtown Hall",
    "updates": {
      "title": "New Title"
    }
  }
}
```

#### EVENT_DELETED
Triggered when an event is deleted.

**Payload:**
```json
{
  "event": "event_deleted",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "eventId": "event-uuid",
    "title": "Event Title",
    "date": "2026-02-15T14:00:00Z",
    "location": "Downtown Hall"
  }
}
```

#### EVENT_REGISTERED
Triggered when a user registers for an event.

**Payload:**
```json
{
  "event": "event_registered",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "eventId": "event-uuid",
    "title": "Event Title",
    "registeredCount": 25,
    "maxPlayers": 50
  }
}
```

#### EVENT_UNREGISTERED
Triggered when a user unregisters from an event.

**Payload:**
```json
{
  "event": "event_unregistered",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "eventId": "event-uuid",
    "title": "Event Title",
    "registeredCount": 24
  }
}
```

### Forum Webhooks

#### FORUM_CREATED
Triggered when a new forum is created.

**Payload:**
```json
{
  "event": "forum_created",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "forumId": "forum-uuid",
    "title": "General Discussion",
    "slug": "general-discussion",
    "category": "General",
    "description": "A place to discuss anything"
  }
}
```

#### FORUM_UPDATED
Triggered when a forum is updated.

**Payload:**
```json
{
  "event": "forum_updated",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "forumId": "forum-uuid",
    "title": "General Discussion",
    "category": "General",
    "updates": {
      "description": "Updated description"
    }
  }
}
```

#### FORUM_DELETED
Triggered when a forum is deleted.

#### FORUM_POST_CREATED
Triggered when a new forum post is created.

**Payload:**
```json
{
  "event": "forum_post_created",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "postId": "post-uuid",
    "forumId": "forum-uuid",
    "authorId": "user-uuid",
    "title": "Post Title",
    "content": "Post content here"
  }
}
```

#### FORUM_POST_UPDATED
Triggered when a forum post is updated.

#### FORUM_POST_DELETED
Triggered when a forum post is deleted.

#### FORUM_REPLY_CREATED, FORUM_REPLY_UPDATED, FORUM_REPLY_DELETED
Similar to post webhooks but triggered for replies to forum posts.

### Changelog Webhooks

#### CHANGELOG_CREATED
**When**: A new changelog entry is created
**Use case**: Post release notes to Discord, email users, or update external documentation

**Payload:**
```json
{
  "event": "changelog_created",
  "timestamp": "2026-01-27T16:00:00.000Z",
  "data": {
    "changelogId": "changelog-uuid",
    "version": "1.2.0",
    "title": "New Features Release",
    "type": "feature",
    "releasedAt": "2026-01-27T12:00:00Z",
    "changes": [
      "Added new event system",
      "Improved forum performance",
      "Fixed bug in news page"
    ]
  }
}
```

#### CHANGELOG_UPDATED
**When**: A changelog entry is edited

**Payload:**
```json
{
  "event": "changelog_updated",
  "timestamp": "2026-01-27T16:15:00.000Z",
  "data": {
    "changelogId": "changelog-uuid",
    "version": "1.2.0",
    "title": "New Features Release",
    "type": "feature",
    "updates": {
      "description": "Updated description"
    }
  }
}
```

#### CHANGELOG_DELETED
**When**: A changelog entry is removed

**Payload:**
```json
{
  "event": "changelog_deleted",
  "timestamp": "2026-01-27T16:30:00.000Z",
  "data": {
    "changelogId": "changelog-uuid",
    "version": "1.2.0",
    "title": "New Features Release",
    "type": "feature"
  }
}
```

### News Webhooks

#### NEWS_CREATED
Triggered when a new news article is created.

**Payload:**
```json
{
  "event": "news_created",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "articleId": "article-uuid",
    "title": "Breaking News",
    "slug": "breaking-news",
    "authorId": "user-uuid",
    "excerpt": "Brief summary of the news"
  }
}
```

#### NEWS_UPDATED
Triggered when a news article is updated.

#### NEWS_DELETED
Triggered when a news article is deleted.

#### NEWS_VIEWED
Triggered when a news article is viewed.

**Payload:**
```json
{
  "event": "news_viewed",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "articleId": "article-uuid",
    "title": "Breaking News",
    "slug": "breaking-news",
    "views": 156
  }
}
```

### Wiki Webhooks

#### WIKI_CREATED
Triggered when a new wiki article is created.

**Payload:**
```json
{
  "event": "wiki_created",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "articleId": "article-uuid",
    "title": "Getting Started",
    "slug": "getting-started",
    "category": "Guides",
    "authorId": "user-uuid"
  }
}
```

#### WIKI_UPDATED
Triggered when a wiki article is updated.

#### WIKI_DELETED
Triggered when a wiki article is deleted.

#### WIKI_VIEWED
Triggered when a wiki article is viewed.

### User/Auth Webhooks

#### USER_REGISTERED
Triggered when a new user registers.

**Payload:**
```json
{
  "event": "user_registered",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "userId": "user-uuid",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2026-01-27T12:00:00.000Z"
  }
}
```

#### USER_LOGIN
Triggered when a user logs in.

**Payload:**
```json
{
  "event": "user_login",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "userId": "user-uuid",
    "email": "user@example.com",
    "lastSignInAt": "2026-01-27T12:00:00.000Z"
  }
}
```

#### USER_PROFILE_UPDATED
Triggered when a user updates their profile.

**Payload:**
```json
{
  "event": "user_profile_updated",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "data": {
    "userId": "user-uuid",
    "email": "user@example.com",
    "updatedFields": ["username", "bio"],
    "updates": {
      "username": "new_username",
      "bio": "New bio"
    }
  }
}
```

## Webhook Payload Structure

All webhooks follow a consistent structure:

```typescript
interface WebhookPayload {
  event: WebhookEvent;        // The event type (e.g., "event_created")
  timestamp: string;          // ISO 8601 timestamp of when the event occurred
  data: Record<string, any>;  // Event-specific data
}
```

## Usage

### Setting Up Webhook URLs

1. Open your `.env` file
2. Add the webhook URL for each event type you want to receive notifications for:
   ```
   VITE_WEBHOOK_EVENT_CREATED=https://your-domain.com/webhooks/events
   VITE_WEBHOOK_NEWS_CREATED=https://your-domain.com/webhooks/news
   ```
3. Restart the application for changes to take effect

### Webhook URL Format

- Webhook URLs should be absolute URLs (include protocol, e.g., `https://`)
- URLs can point to any external service
- Common patterns include:
  - Discord webhooks: `https://discordapp.com/api/webhooks/...`
  - Slack webhooks: `https://hooks.slack.com/services/...`
  - Custom APIs: `https://your-api.com/webhooks/...`

### Best Practices

1. **Error Handling**: Webhooks fail silently. Ensure your webhook endpoint is reliable and handles the requests properly.

2. **Signature Verification**: For security, consider adding signature verification in your webhook receiver. The webhook service sends requests as plain JSON POSTs.

3. **Retry Logic**: The webhook system doesn't include built-in retries. Implement retry logic on your endpoint if needed.

4. **Timeouts**: Webhook requests timeout after the standard fetch timeout. Ensure your endpoint responds quickly.

5. **Filtering**: Not all events need to be received. Only configure webhooks for events you care about.

6. **Performance**: Webhook sending is non-blocking and won't slow down the application, even if the webhook endpoint is slow.

## Testing Webhooks

You can test webhooks using:

1. **RequestBin** - Create a temporary webhook endpoint at https://requestbin.com/
2. **Webhook.cool** - Another temporary webhook testing service
3. **Postman** - Use Postman's webhooks feature
4. **Your own server** - Set up a local endpoint to test

Example test URL format:
```
VITE_WEBHOOK_EVENT_CREATED=https://webhook.cool/unique-identifier
```

## Troubleshooting

### Webhooks aren't being sent

1. **Check the URL**: Ensure the webhook URL is configured correctly in `.env`
2. **Verify the event**: Make sure you're triggering the action that sends the webhook
3. **Check your endpoint**: Ensure your webhook endpoint is reachable and returns a 2xx status code
4. **Browser console**: No errors are logged for failed webhooks (by design), so test your endpoint independently

### My webhook endpoint isn't receiving requests

1. **Test connectivity**: Try hitting your endpoint from another service
2. **URL is public**: Ensure your webhook URL is publicly accessible
3. **CORS**: If testing locally, CORS might block the request
4. **Firewall**: Check if your firewall blocks outgoing requests

## Files Modified

- `src/services/webhookService.ts` - New webhook service implementation
- `src/services/changelogService.ts` - NEW - Changelog service with webhooks
- `.env` - Added webhook configuration variables
- `src/services/eventService.ts` - Integrated event webhooks
- `src/services/forumService.ts` - Integrated forum webhooks
- `src/services/newsService.ts` - Integrated news webhooks
- `src/services/wikiService.ts` - Integrated wiki webhooks
- `src/services/settingsService.ts` - Added webhook import
- `src/contexts/AuthContext.tsx` - Integrated user/auth webhooks

## Advanced Usage

### Programmatic Webhook Sending

You can manually send webhooks using the webhook service:

```typescript
import { sendWebhook, WebhookEvent } from '@/services/webhookService';

// Send a single webhook
await sendWebhook(WebhookEvent.EVENT_CREATED, {
  eventId: '123',
  title: 'My Event',
  date: '2026-02-15T14:00:00Z',
});

// Send multiple webhooks in parallel
import { sendWebhooks } from '@/services/webhookService';

await sendWebhooks([
  { 
    event: WebhookEvent.NEWS_CREATED, 
    data: { articleId: '123', title: 'News' } 
  },
  { 
    event: WebhookEvent.NEWS_VIEWED, 
    data: { articleId: '456', views: 10 } 
  }
]);

// Check if a webhook is configured
import { isWebhookConfigured } from '@/services/webhookService';

if (isWebhookConfigured(WebhookEvent.EVENT_CREATED)) {
  // Webhook is configured
}
```

### Custom Event Types

To add custom webhook events:

1. Add the event to the `WebhookEvent` enum in `webhookService.ts`
2. Add the corresponding `.env` variable
3. Call `sendWebhook()` where needed

```typescript
// In webhookService.ts
export enum WebhookEvent {
  // ... existing events
  CUSTOM_EVENT = 'custom_event',
}

// In your code
await sendWebhook(WebhookEvent.CUSTOM_EVENT, {
  customData: 'value'
});
```
