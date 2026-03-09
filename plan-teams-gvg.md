# GvG Teams Page Plan

## Page Purpose
Admin tool to organize guild members into GvG teams (0–15 members each). Focused on GvG and xGvG events only.

---

## Layout

### Top Bar
- Page title: **"GvG Teams"**
- **"+ New Team"** button (admin only) — opens a small inline form or modal to name the team
- **Save** button (admin only) — persists the current layout to Firestore
- **Load** dropdown — pick from previously saved GvG compositions

### Main Area — Two-column layout

**Left column (narrow, ~300px): Member Pool**
- Lists all guild members not yet assigned to a team
- Search box to filter by name
- Each member shows: name, class, level
- Members are draggable
- Double-click a member to add them to the team with the fewest members

**Right column (wide): Team Cards**
- Each team is a card with:
  - **Editable team name** (click to rename, inline input)
  - **Member count** badge (e.g. "7 / 15")
  - **Member list** inside the card — each member row shows name + class + level + an X button to remove
  - **Drop zone** — drag members from the pool or other teams onto a card
  - **Delete team** button (admin only, with confirmation) — returns members to pool
- Cards stack vertically
- When a team hits 15 members, it shows "Full" and rejects further drops
- Empty teams show a placeholder: "Drag members here"

### Bottom Section: Saved Compositions
- List of previously saved GvG team setups
- Each entry shows: name, number of teams, total members, date saved
- Click to load, admin can delete

---

## Interactions

| Action | Behavior |
|---|---|
| Drag from pool → team card | Adds member to that team (if < 15) |
| Drag from team → team | Moves member between teams |
| Drag from team → pool | Returns member to pool |
| Double-click pool member | Auto-assigns to smallest team |
| Click X on team member | Returns to pool |
| Click "+ New Team" | Creates a new empty team card named "Team N" |
| Edit team name | Inline input, updates on blur/enter |
| Delete team | Confirmation prompt, returns all members to pool, removes card |
| Save | Prompts for a name, stores to Firestore under `teamCompositions` with `eventType: 'GvG'` |
| Load | Restores teams + assignments from a saved composition |

---

## Data (Firestore)

Uses the existing `teamCompositions` collection, filtered to `eventType == 'GvG'`:

```
{
  name: "Week 10 GvG",
  eventType: "GvG",
  teams: [
    { name: "Alpha", memberIds: ["id1", "id2", ...] },
    { name: "Bravo", memberIds: ["id3", "id4", ...] }
  ],
  createdAt: serverTimestamp()
}
```

---

## What's NOT included (keep it simple)
- No auto-balance / snake draft
- No average points or performance stats
- No event type selector (hardcoded to GvG)
- No team count input — admin adds/removes teams manually with buttons
