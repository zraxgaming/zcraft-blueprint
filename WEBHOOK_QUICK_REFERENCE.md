# Webhook Quick Reference

## What Are Webhooks? 🪝

**Webhooks** automatically send your app's data to external services when events happen. They're like notifications for your application events.

### Simple Analogy:
```
Traditional: You check the website for updates
Webhook: The website tells you when updates happen
```

## All Webhook Events

### Event Webhooks (5 events)
- `EVENT_CREATED` - New event announced
- `EVENT_UPDATED` - Event details changed
- `EVENT_DELETED` - Event removed
- `EVENT_REGISTERED` - User registered for event
- `EVENT_UNREGISTERED` - User removed registration

### Forum Webhooks (9 events)
- `FORUM_CREATED` - New forum category
- `FORUM_UPDATED` - Forum details changed
- `FORUM_DELETED` - Forum removed
- `FORUM_POST_CREATED` - New discussion post
- `FORUM_POST_UPDATED` - Post edited
- `FORUM_POST_DELETED` - Post removed
- `FORUM_REPLY_CREATED` - New reply
- `FORUM_REPLY_UPDATED` - Reply edited
- `FORUM_REPLY_DELETED` - Reply removed

### Changelog Webhooks (3 events)
- `CHANGELOG_CREATED` - New version released
- `CHANGELOG_UPDATED` - Release notes edited
- `CHANGELOG_DELETED` - Changelog removed

### News Webhooks (4 events)
- `NEWS_CREATED` - New article published
- `NEWS_UPDATED` - Article edited
- `NEWS_DELETED` - Article removed
- `NEWS_VIEWED` - Article read

### Wiki Webhooks (4 events)
- `WIKI_CREATED` - New wiki article
- `WIKI_UPDATED` - Article edited
- `WIKI_DELETED` - Article removed
- `WIKI_VIEWED` - Article viewed

### User/Auth Webhooks (3 events)
- `USER_REGISTERED` - New user signed up
- `USER_LOGIN` - User logged in
- `USER_PROFILE_UPDATED` - User updated their info

## Setup in 3 Steps

### Step 1: Get a webhook URL
- **Discord**: Right-click channel → Integrations → Webhooks
- **Slack**: Create incoming webhook in App Directory
- **Custom API**: Any HTTPS endpoint you control
- **Testing**: Use https://requestbin.com/ temporarily

### Step 2: Add to `.env`
```bash
VITE_WEBHOOK_EVENT_CREATED=https://discord.com/api/webhooks/xxx/yyy
VITE_WEBHOOK_CHANGELOG_CREATED=https://your-api.com/webhooks/changelog
```

### Step 3: Restart your app
```bash
npm run dev
# or
yarn dev
```

## Webhook Payload Format

Every webhook has this structure:
```json
{
  "event": "event_created",
  "timestamp": "2026-01-27T12:34:56.000Z",
  "data": {
    "eventId": "123",
    "title": "My Event",
    "date": "2026-02-15T14:00:00Z"
  }
}
```

## Common Use Cases

### Discord Announcements
Post to Discord when new events are created:
```
VITE_WEBHOOK_EVENT_CREATED=https://discordapp.com/api/webhooks/...
```
→ Users see event announcement in Discord channel

### Release Notifications
Send to Slack when a changelog is published:
```
VITE_WEBHOOK_CHANGELOG_CREATED=https://hooks.slack.com/services/...
```
→ Team gets notified about new releases

### Email Alerts
Forward to email service when forum posts are created:
```
VITE_WEBHOOK_FORUM_POST_CREATED=https://your-email-api.com/webhooks
```
→ Subscribers get email notifications

### Analytics
Track all events in analytics platform:
```
VITE_WEBHOOK_EVENT_CREATED=https://analytics.example.com/events
VITE_WEBHOOK_NEWS_CREATED=https://analytics.example.com/events
VITE_WEBHOOK_CHANGELOG_CREATED=https://analytics.example.com/events
```

### Zapier/Make Automation
Trigger complex workflows:
```
VITE_WEBHOOK_USER_REGISTERED=https://hooks.zapier.com/hooks/catch/xxx/yyy
```
→ Trigger email welcome sequence, CRM entry, Slack message, etc.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhooks not sending | Restart app after `.env` changes |
| Webhook endpoint not receiving | Check URL is public (not localhost) |
| 404 errors | Verify webhook URL is correct |
| Silent failures | No errors logged by design - test endpoint separately |

## Popular Webhook Services

| Service | URL |
|---------|-----|
| **Discord** | `https://discord.com/api/webhooks/{id}/{token}` |
| **Slack** | `https://hooks.slack.com/services/{id}` |
| **Zapier** | `https://hooks.zapier.com/hooks/catch/{id}` |
| **Make** | `https://hook.integromate.com/xyz` |
| **RequestBin** (testing) | `https://requestbin.com/{id}` |

## Code Examples

### Using the webhook service in your code:

```typescript
import { sendWebhook, WebhookEvent } from '@/services/webhookService';

// Send a webhook
await sendWebhook(WebhookEvent.EVENT_CREATED, {
  eventId: '123',
  title: 'New Event',
  date: '2026-02-15',
});

// Send multiple webhooks
import { sendWebhooks } from '@/services/webhookService';

await sendWebhooks([
  { event: WebhookEvent.NEWS_CREATED, data: { articleId: '1' } },
  { event: WebhookEvent.NEWS_VIEWED, data: { articleId: '2' } }
]);

// Check if webhook is configured
import { isWebhookConfigured } from '@/services/webhookService';

if (isWebhookConfigured(WebhookEvent.EVENT_CREATED)) {
  // Webhook is available
}
```

## For More Details

See [WEBHOOK_INTEGRATION.md](WEBHOOK_INTEGRATION.md) for complete documentation with all payload examples.
