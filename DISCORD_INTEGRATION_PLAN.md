# Discord Integration Plan — Rox Heroes Dashboard

## Overview

Push event results, member updates, and ranking summaries from the Rox Heroes dashboard to a Discord channel. Supports both **automatic notifications** (on data save) and **manual sends** (admin button clicks).

---

## Part 1: Discord Webhook Setup

### Steps to create a webhook in your Discord server:
1. Open your Discord server and go to **Server Settings > Integrations > Webhooks**
2. Click **New Webhook**
3. Name it (e.g., "Rox Heroes Bot") and select the target channel
4. Copy the **Webhook URL** — it looks like: `https://discord.com/api/webhooks/XXXX/YYYY`
5. You will paste this URL into the Rox Heroes admin settings

### Storage in the app:
- Add a **Discord Settings** section to the admin panel (accessible from any page's admin menu)
- Store the webhook URL in Firestore under a `config/discord` document
- Only admins can view/edit the webhook URL

---

## Part 2: Shared Discord Module (`discord.js`)

Create a new file `discord.js` as an ES6 module that all pages import. It handles:

- **`sendToDiscord(embed)`** — Posts a Discord embed message via the stored webhook URL
- **`buildEventEmbed(eventData)`** — Formats event results into a rich embed (title, scores, participants)
- **`buildMemberEmbed(memberData)`** — Formats member updates (new members, level changes, contributions)
- **`buildRankingEmbed(rankingData)`** — Formats ranking summaries (top 10, tier breakdowns, monthly stats)
- **`getWebhookUrl()`** — Reads the webhook URL from Firestore `config/discord`

### Discord Embed Format
Messages will use Discord's [rich embed format](https://discord.com/developers/docs/resources/webhook) for clean, structured notifications with:
- Color-coded sidebars (green for events, blue for members, gold for rankings)
- Fields for key data points
- Timestamps
- Footer with "Rox Heroes Dashboard" branding

---

## Part 3: Automatic Notifications (On Data Save)

Trigger Discord messages from the **client side** right after successful Firestore writes. No cloud functions needed — the notification fires from the admin's browser when they save data.

### 3a. Event Results (`events.html`)
- **Trigger:** After an admin successfully saves event results
- **Message content:**
  - Event type (KVM / AA / GvG)
  - Event date
  - Number of participants
  - Top 3 performers with scores
  - Average score

### 3b. Member Updates (`members.html`)
- **Trigger:** After an admin saves bulk member updates
- **Message content:**
  - Number of members updated
  - Summary of changes (new members added, level changes, etc.)

### 3c. Distribution Updates (`distribution.html`)
- **Trigger:** After an admin saves distribution data
- **Message content:**
  - Week covered
  - Distribution summary

---

## Part 4: Manual "Send to Discord" Buttons

Add a **"Send to Discord"** button on key pages so admins can push summaries on demand.

### 4a. Home Dashboard (`index.html`)
- Button in the header area (visible to admins only)
- Sends: Monthly summary with top 10 performers, tier counts, and recent event highlights

### 4b. Rankings Page (`ranking.html`)
- Button near the ranking table
- Sends: Current rankings with weekly hero point breakdowns and top performers

### 4c. Events Page (`events.html`)
- Button near event results view
- Sends: Selected event's full results as a formatted leaderboard

---

## Part 5: Admin UI for Discord Settings

Add to the existing admin settings modal (or create a small settings gear icon):

- **Webhook URL** input field (masked/password-style for security)
- **Test** button — sends a test message to verify the webhook works
- **Toggle switches** for enabling/disabling automatic notifications per type:
  - Event results auto-notify: ON/OFF
  - Member updates auto-notify: ON/OFF
  - Distribution auto-notify: ON/OFF

Settings stored in Firestore: `config/discord`
```
{
  webhookUrl: "https://discord.com/api/webhooks/...",
  autoNotify: {
    events: true,
    members: true,
    distribution: true
  }
}
```

---

## File Changes Summary

| File | Changes |
|---|---|
| **`discord.js`** (NEW) | Shared module: webhook calls, embed builders, config reader |
| **`index.html`** | Import discord.js, add "Send to Discord" button, admin Discord settings UI |
| **`events.html`** | Import discord.js, auto-notify on save, add manual send button |
| **`members.html`** | Import discord.js, auto-notify on save |
| **`distribution.html`** | Import discord.js, auto-notify on save |
| **`ranking.html`** | Import discord.js, add manual send button |

---

## Implementation Order

1. **Discord webhook setup guidance** (documentation only)
2. **`discord.js`** shared module with embed builders
3. **Admin Discord settings UI** (webhook URL config + toggles)
4. **Manual send buttons** on index, rankings, and events pages
5. **Automatic notifications** wired into existing save handlers
6. **Testing** end-to-end with a real Discord webhook

---

## Security Considerations

- Webhook URL is stored in Firestore with admin-only read/write rules
- Webhook calls are made client-side from the admin's browser (no server required)
- Rate limiting: Discord webhooks allow 30 requests per minute — the app's usage will be well within this
- No sensitive data (passwords, auth tokens) is sent to Discord — only game performance data

---

## No Additional Dependencies

- Uses the browser's native `fetch()` API to call Discord webhooks
- Uses existing Firebase/Firestore setup for config storage
- No npm packages, cloud functions, or server infrastructure needed
