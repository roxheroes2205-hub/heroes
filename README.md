# HEROES - Guild Management App

A web-based guild management application for tracking members, events, rankings, and team compositions. Built with vanilla HTML/CSS/JavaScript and Firebase (Firestore + Auth).

## Pages

### Home (`index.html`)
Dashboard with summary statistics and a monthly hero points table. Shows at-a-glance info for the latest KVM, AA, and GvG events including participation rates and top performers.

### Members (`members.html`)
Guild roster management. Features include:
- View, search, and sort all guild members
- Add, edit, and delete members (admin)
- Bulk import via tab/comma-separated data
- Update member data via a Claude-assisted copy-paste workflow

**Member fields:** Name, Character ID, Level, 7-day Contribution, Attempts

### Events (`events.html`)
Event tracking with an interactive calendar view. Features include:
- Create events for each type: KVM, xKVM, AA, GvG, xGvG
- Record event results via a Claude-assisted screenshot parsing workflow
- View, search, sort, and edit event results (admin)
- Calendar-based event navigation by month

### Distribution (`distribution.html`)
AA chest distribution calculator. Features include:
- Week-based calendar selection to find AA events
- Guild rank selection per AA event to determine available chests
- Automatic chest distribution based on member participation and points

### Ranking (`ranking.html`)
Weekly hero point generation and guild ranking. Features include:
- Calendar-based week selection
- Automatic hero point calculation from event results
- Configurable point values, qualification thresholds, and modes per event type
- Rank tiers (Legend, Elite) with configurable thresholds
- Monthly summary table with cumulative hero points

### Teams (`teams.html`)
Team composition builder for organizing guild event teams. Features include:
- Select event type (KVM, xKVM, AA, GvG, xGvG) to view relevant performance stats
- Drag-and-drop members between an unassigned bench and team slots
- Double-click to quick-assign members to the team with fewest members
- Auto-balance distributes all members across teams using a snake draft based on average event points
- Configurable number of teams (1-10)
- Team stats showing total and average points per team
- Save and load team compositions (admin)

## Event Types

| Type | Description |
|------|-------------|
| KVM  | Kill event (standard) |
| xKVM | Kill event (cross-server) |
| AA   | Ancient Arena |
| GvG  | Guild vs Guild (standard) |
| xGvG | Guild vs Guild (cross-server) |

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (ES modules)
- **Backend:** Firebase Firestore (real-time database)
- **Auth:** Firebase Authentication (email/password)
- **No build step** - all pages are standalone HTML files that can be served statically

## Firebase Collections

- `members` - Guild member roster
- `events` - Event entries (type + date)
- `eventResults` - Individual member results per event (points, characterId, etc.)
- `weeklyHeroPoints` - Calculated hero points per member per week
- `rankingConfig` - Point values, thresholds, and tier settings
- `teamCompositions` - Saved team compositions

## Access Model

- **Public (read-only):** Anyone can view members, events, results, rankings, and teams
- **Admin (read-write):** Sign in with email/password to create events, import members, save results, manage team compositions, and edit data
