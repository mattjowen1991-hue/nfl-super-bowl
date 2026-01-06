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
    "winner": null,      // Set to player id when season ends (e.g., "joe")
    "spoon": null        // Set to last place player id
  },
  "honorary": [
    { "year": 2025, "player": null },    // Current season (TBD)
    { "year": 2024, "player": "ben" }    // Past winners
  ]
}
```

### JSONBin Integration
The app automatically fetches picks from JSONBin (shared with Draft Machine):
```javascript
const JSONBIN_BIN_ID = '695b078fd0ea881f4054b2a0';
const JSONBIN_API_KEY = '$2a$10$C7BY0Kl0u74gNn/kXO7xNuayWv493/f1jAxlHUmx3ENADQKDii61C';
```

## 🎨 Visual Features

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
- **Winner:** Gold glow effect
- **Spooner:** Pink wobble effect
- **Hall of Fame:** Ice-blue glow for past champions

## 🔄 Data Flow

```
Draft Machine → JSONBin ← Elimination League
                              ↓
                         ESPN API
                              ↓
                    fetchEliminatedTeams()
                              ↓
                      renderPicks() with
                      live elimination status
```

### Auto-Refresh
- Page refreshes ESPN data every **5 minutes**
- Shows "Last Updated" timestamp in header

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

### PWA not updating
1. Bump `CACHE_NAME` version in `sw.js`
2. Close all tabs and reopen
3. Or clear site data in browser settings

### Player missing from table
1. Check `players.json` has the player
2. Ensure player `id` matches JSONBin data

## 📊 ESPN API

The app uses ESPN's scoreboard endpoint:
```
https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=3
```

- `seasontype=3` = Playoffs
- Returns all playoff games with completion status
- Losers (`winner: false`) are marked as eliminated

## 🎯 End of Season Checklist

1. Update `config.json`:
   - Set `highlight.winner` to winner's player ID
   - Set `highlight.spoon` to last place player ID
   - Add winner to `honorary` array

2. The Hall of Fame will automatically display all past winners

## 📝 Differences from Draft Machine

| Feature | Draft Machine | Elimination League |
|---------|--------------|-------------------|
| Purpose | Draft teams | Track eliminations |
| Interactivity | Spin to draft | View only |
| Data Source | ESPN standings | ESPN scoreboard |
| Updates | Manual spins | Auto every 5 min |
| JSONBin | Writes picks | Reads picks |

---

**May the best team(s) win! 🏆**
