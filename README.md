# 🏈 Super Bowl LX Elimination League

A live playoff tracker PWA that displays player picks and automatically marks teams as eliminated based on real-time ESPN data. Syncs with the Draft Machine via JSONBin.

## 🎯 How It Works

### The League
1. Each player drafts **one AFC team** and **one NFC team** via the Draft Machine
2. As playoff games complete, losing teams are marked as **ELIMINATED** (red, fiery glow)
3. Teams still alive show a **green neon glow**
4. When both of a player's teams are eliminated, they get an "ELIMINATED" badge
5. Last player standing wins! 🏆

### Live Data
- **ESPN API** automatically fetches playoff results every 5 minutes
- **JSONBin** syncs picks from the Draft Machine in real-time
- No manual updates needed once the draft is complete

### 💰 Prize Pot
- Displays the total prize pool (£5 × number of players)
- Animated with falling money/footballs
- **Automatically transforms** into a champion display when a winner is detected

### 🏆 Auto Winner Detection
The app automatically detects the winner in two ways:
1. **Super Bowl Winner** - When ESPN reports the Super Bowl result, the app finds which player picked that team
2. **Last Player Standing** - If only one player has a team still alive, they're auto-crowned

### 🥄 Auto Spooner Detection
The "spooner" is the player who picked the **Super Bowl losing team**. This is only detected after the Super Bowl is complete - until then, the Spooner section shows "TBD".

## 📁 File Structure

```
elimination-league/
├── Assets/
│   ├── joe.png, jarv.png, matt.png, mark.png, gaz.png, liam.png, ben.png
│   ├── afc.png, nfc.png
│   ├── football-field.jpeg (background)
│   ├── Freshman.ttf (custom font)
│   ├── winnertbc.png, losertbc.png (placeholder avatars)
│   ├── nfl-favicon2.png
│   └── teams/ (team logos - optional)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── index.html          # Main app
├── players.json        # Player roster
├── config.json         # Season config & Hall of Fame
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md
```

### ❌ Files You Can Delete
- **picks.json** - No longer needed! Picks now sync from JSONBin automatically.

## ⚙️ Configuration

### players.json
Define the players in your league:
```json
[
  { "id": "joe", "name": "Joe", "avatar": "Assets/joe.png", "team": "Lions", "teamLogo": "Assets/Lions.png" },
  ...
]
```

**Note:** The `id` must match the player IDs used in the Draft Machine.

### config.json
```json
{
  "season": "2025",
  "highlight": {
    "winner": null,      // Auto-detected, or set manually to player id (e.g., "joe")
    "spoon": null        // Auto-detected, or set manually to last place player id
  },
  "honorary": [
    { "year": 2025, "player": null },    // Current season (TBD)
    { "year": 2024, "player": "ben" }    // Past winners
  ]
}
```

### Prize Pot Configuration
In `index.html`, adjust these constants:
```javascript
const ENTRY_FEE = 5; // £5 per player - change if your entry fee differs
```

### Elimination Order (for Spooner Detection)
Update this array after the Super Bowl to record the losing team:
```javascript
const ELIMINATION_ORDER = [
  { round: 'Wild Card', teams: ['Pittsburgh Steelers', ...] },
  { round: 'Divisional', teams: [...] },
  { round: 'Conference', teams: [...] },
  { round: 'Super Bowl', teams: ['Buffalo Bills'] },  // ← Add the Super Bowl LOSER here
];
```

The spooner is whoever picked the Super Bowl losing team. Only the `Super Bowl` entry matters for spooner detection - the earlier rounds are kept for historical reference.

### JSONBin Integration
The app automatically fetches picks from JSONBin (shared with Draft Machine):
```javascript
const JSONBIN_BIN_ID = '695b078fd0ea881f4054b2a0';
const JSONBIN_API_KEY = '$2a$10$C7BY0Kl0u74gNn/kXO7xNuayWv493/f1jAxlHUmx3ENADQKDii61C';
```

## 🎨 Visual Features

### Prize Pot Display
| State | Appearance |
|-------|------------|
| **No Winner Yet** | 🏆 Trophy, "Prize Pot", £35, animated money rain |
| **Winner Detected** | 👑 Crown, winner's avatar, name, winning team logo, "£35 Won!" |

### Team Status Animations
| Status | Appearance |
|--------|------------|
| **Alive** | Green neon glow, pulsing |
| **Eliminated** | Red fiery glow, strikethrough |
| **TBC** | Grey, italic |

### Player Status
- **Active:** Normal display
- **Eliminated:** Dimmed row + "ELIMINATED" badge

### Highlights Section
- **Winner:** Gold glow effect (auto-detected or manual)
- **Spooner:** Pink wobble effect (auto-detected or manual)
- **Hall of Fame:** Ice-blue glow for past champions

## 🔄 Data Flow

```
Draft Machine → JSONBin ← Elimination League
                              ↓
                         ESPN API (all weeks)
                              ↓
                    fetchEliminatedTeams()
                              ↓
                  detectWinnerAndSpooner()
                              ↓
                    renderPrizePot() +
                    renderPicks() +
                    applyHighlights()
```

### Auto-Refresh
- Page refreshes ESPN data every **5 minutes**
- Shows "Last Updated" timestamp in header
- Prize pot and highlights update automatically

## 📱 Installation (PWA)

### iOS
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

### Android
1. Open in Chrome
2. Tap menu (⋮) → "Add to Home screen"

## 🛠️ Adding Team Logos

Create an `Assets/teams/` folder with logos named by team slug:
```
Assets/teams/
├── denver-broncos.png
├── buffalo-bills.png
├── kansas-city-chiefs.png
├── philadelphia-eagles.png
└── ... etc
```

The app uses `slugifyTeam()` to convert team names:
- "Denver Broncos" → `denver-broncos.png`
- "San Francisco 49ers" → `san-francisco-49ers.png`

If a logo is missing, it gracefully hides the image.

## 🔧 Service Worker

The `sw.js` handles:
- **Cache-first** for static assets (background, fonts, icons)
- **Network-first** for ESPN API and JSON data
- Offline fallback for cached assets

### Updating the App
Bump the cache version in `sw.js`:
```javascript
const CACHE_NAME = 'sb-league-v2';  // Increment this
```

## 🐛 Troubleshooting

### Picks not showing
1. Check browser console for JSONBin errors
2. Verify Draft Machine has completed picks
3. Ensure player IDs match between `players.json` and Draft Machine

### Teams not being eliminated
1. Check ESPN API is accessible
2. Verify team names match exactly (e.g., "Buffalo Bills" not "Bills")
3. Check console for ESPN fetch errors
4. **Update the fallback list** in `index.html` (see ESPN API section below)

### Winner/Spooner not auto-detecting
1. Check browser console for detection logs (`🔍 Winner/Spooner detection:`)
2. Verify `ELIMINATION_ORDER` is updated with eliminated teams
3. Ensure player picks match team names exactly

### PWA not updating
1. Bump `CACHE_NAME` version in `sw.js`
2. Close all tabs and reopen
3. Or clear site data in browser settings

### Player missing from table
1. Check `players.json` has the player
2. Ensure player `id` matches JSONBin data

## 📊 ESPN API

The app fetches playoff data from ESPN's scoreboard endpoint for **each playoff week**:

```javascript
const weekUrls = [
  `${ESPN_BASE_URL}?seasontype=3&week=1`, // Wild Card
  `${ESPN_BASE_URL}?seasontype=3&week=2`, // Divisional
  `${ESPN_BASE_URL}?seasontype=3&week=3`, // Conference Championship
  `${ESPN_BASE_URL}?seasontype=3&week=5`, // Super Bowl
];
```

- `seasontype=3` = Playoffs
- `week=1` = Wild Card, `week=2` = Divisional, etc.
- Each week is fetched separately to ensure past rounds are included
- Losers (`winner: false`) are marked as eliminated
- Super Bowl winner (`winner: true` in week 5) triggers champion detection

### Fallback Eliminated Teams

If the ESPN API fails or doesn't return data, the app uses a hardcoded fallback list. **Update this list after each playoff round:**

```javascript
const KNOWN_ELIMINATED_TEAMS = [
  // Wild Card Round Losers (Jan 10-12, 2026)
  'Pittsburgh Steelers',    // Lost to Texans 6-30
  'Jacksonville Jaguars',   // Lost to Bills 24-27
  'Los Angeles Chargers',   // Lost to Patriots 3-16
  'Carolina Panthers',      // Lost to Rams 31-34
  'Green Bay Packers',      // Lost to Bears 27-31
  'Philadelphia Eagles',    // Lost to 49ers 19-23
  
  // Divisional Round Losers - ADD AFTER GAMES COMPLETE
  // e.g., 'Buffalo Bills',
  // e.g., 'Houston Texans',
];
```

**Why is this needed?**
The ESPN scoreboard API only returns the current week's games by default. While we now fetch all weeks explicitly, having a fallback ensures eliminations display correctly even if the API changes or fails.

## 🎯 End of Season Checklist

1. **Auto-detection should handle most of this**, but verify:
   - Winner shows in prize pot with crown
   - Winner shows in Season Highlights
   - Spooner shows in Season Highlights

2. Update `config.json` for Hall of Fame:
   - Add winner to `honorary` array for permanent record:
   ```json
   "honorary": [
     { "year": 2025, "player": "joe" },  // Add the winner's ID
     { "year": 2024, "player": "ben" }
   ]
   ```

3. The Hall of Fame will automatically display all past winners

## 🔄 Maintenance: Updating After Each Round

After each playoff round completes:

1. **Verify eliminations show correctly** - Check the live site

2. **Update ELIMINATION_ORDER** for spooner detection:
   - Open `index.html`
   - Find `ELIMINATION_ORDER` array
   - Add the round's losing teams
   - This ensures accurate spooner detection

3. **If teams aren't showing as eliminated:**
   - Find `KNOWN_ELIMINATED_TEAMS` array
   - Add the losing teams with full names (e.g., "Buffalo Bills")
   - Commit and push to GitHub

4. **Bump service worker** - Increment `CACHE_NAME` in `sw.js` if users have cached the old version

## 📝 Differences from Draft Machine

| Feature | Draft Machine | Elimination League |
|---------|--------------|-------------------|
| Purpose | Draft teams | Track eliminations |
| Interactivity | Spin to draft | View only |
| Data Source | ESPN standings | ESPN scoreboard |
| Updates | Manual spins | Auto every 5 min |
| JSONBin | Writes picks | Reads picks |
| Prize Pot | N/A | Shows pot & auto-crowns winner |

## 🆕 Recent Updates

### v2.0 - Prize Pot & Auto-Detection
- ✨ **Prize Pot Display** - Shows total kitty with animated money rain
- 🏆 **Auto Winner Detection** - Detects Super Bowl winner or last player standing
- 🥄 **Auto Spooner Detection** - Tracks first player fully eliminated
- 👑 **Champion Display** - Prize pot transforms to show winner when detected
- 🔄 **Improved ESPN Fetching** - Now detects Super Bowl winner from API

---

**May the best team(s) win! 🏆**
