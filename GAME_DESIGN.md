# Pong-O - Game Design Document

## Core Concept
**Pong-O** is a classic Pong game with modern twists: collectible skins, loot boxes with Plinko mechanics, customizable themes, and cloud save functionality.

---

## 🎮 Game Mechanics

### Classic Pong Gameplay
- **Traditional Pong** vs AI opponent
- **Three Difficulty Levels**:
  - Easy: +50 coins on win
  - Medium: +100 coins on win  
  - Hard: +150 coins on win
- **Rally Bonus**: +10 coins every 5 consecutive hits
- **Customizable Controls**: Arrow buttons or drag control
- **Adjustable Paddle Position**: Bottom-right, bottom-left, top-right, top-left, or bottom bar

### Coin System
- Earn coins by winning matches
- Rally bonuses for skilled play
- Coins displayed on all screens (Menu, Shop, Backpack)
- Used to purchase loot boxes

---

## 🎁 Progression System

### Loot Boxes
- **Three Types**:
  1. **Ball Skin Loot Box** - Contains ball skins
  2. **Paddle Skin Loot Box** - Contains paddle skins
  3. **Theme Loot Box** - Contains full app themes

- **Plinko Mechanic**:
  - Purchase box → Ball drops through Plinko board
  - Land in slot → Determines rarity of reward
  - 5 Rarity Tiers: Common, Uncommon, Rare, Epic, Legendary

### Collectibles

#### Ball Skins
- **Common**: Red, Orange, Brown, Green
- **Uncommon**: Grey, Blue, Purple, Yellow
- **Rare**: Pink, White, Black
- **Epic**: Gold, Silver, Bronze
- **Legendary**: Rainbow (animated with color cycling)

#### Paddle Skins
- **Common**: Red, Orange, Brown, Green
- **Uncommon**: Grey, Blue, Purple, Yellow
- **Rare**: Pink, White, Black
- **Epic**: Gold, Silver, Bronze
- **Legendary**: Rainbow (animated with color cycling)

#### Themes (Full App Color Schemes)
- **Common**: Default, Lavender, White, Dark Grey
- **Uncommon**: Navy, Light Grey
- **Rare**: Ocean, Forest
- **Epic**: (None currently)
- **Legendary**: Neon Cyberpunk (with 8 customizable color variants)

---

## 🎨 Customization

### Theme System
- Themes change the entire app's color scheme
- Affects all screens: Menu, Game, Shop, Backpack, Help
- **Neon Cyberpunk Theme** has special feature:
  - 8 color variants: Pink, Red, Orange, Yellow, Green, Blue, Purple, White
  - Selectable via "Edit Color" button in Backpack
  - Variant selection saved per user

### Visual Customization
- Equip one ball skin (affects gameplay ball)
- Equip one paddle skin (affects player paddle)
- Equip one theme (affects entire UI)
- Preview before equipping
- Rarity badges show skin value

---

## 💾 Storage & Sync

### Offline-First Architecture
- **AsyncStorage** for all data persistence
- **Fully playable offline** - no internet required
- All game progress, coins, and unlocked items saved locally

### Cloud Sync (When Signed In)
- **Sign in with Apple** (iOS)
- **Sign in with Google Play Games** (Android)
- **Automatic sync** after sign-in
- Syncs:
  - Coins
  - Unlocked ball skins
  - Unlocked paddle skins
  - Unlocked themes
  - Equipped items (ball, paddle, theme)
  - Theme variant selections

### Data Safety
- **Without sign-in**: Data only saved locally
  - Uninstalling app = permanent data loss
  - Cannot transfer to another device
  - No cloud backup
- **With sign-in**: Data synced to cloud
  - Safe across app reinstalls
  - Accessible on multiple devices
  - Automatic conflict resolution (newest data wins)

---

## 📱 User Experience

### Navigation Flow
```
Menu Screen
├── Play Game → GameScreen
├── Shop → ShopScreen → Plinko → Reward Reveal → Back to Shop
├── Backpack → View/Equip Items
└── Help → Account info, How to Play, Sign Out
```

### First-Time Experience
1. **Sign-In Screen** (first launch only)
   - Option: Sign in with Apple/Google
   - Option: Skip (with warning about data loss)
   - Warning modal explains consequences of not signing in

2. **Default Unlocks**
   - Ball: Red ball
   - Paddle: Red paddle
   - Theme: Default theme
   - Coins: 0

3. **Tutorial** (Future feature)
   - Show how to play
   - Explain coin system
   - Introduce loot boxes

### Returning User Experience
1. App loads saved data from AsyncStorage
2. If signed in: Syncs with cloud in background
3. Coin balance displayed on all screens
4. Continue playing and collecting

---

## 🎯 Monetization (Future)

### Current State
- **Completely Free**
- All loot boxes cost 0 coins (for testing)
- No in-app purchases
- No ads

### Future Possibilities
- Loot boxes cost real coins (earned through gameplay)
- Optional coin packs for purchase
- Ad-supported coin rewards
- Premium themes or skins
- Season passes
- Battle pass system

---

## 🔐 Authentication & Privacy

### Apple Sign In (iOS)
- Uses Apple's native authentication
- Game Center integration
- Follows Apple Human Interface Guidelines
- Privacy-focused (minimal data collection)

### Google Play Games (Android)
- OAuth 2.0 authentication
- Play Games Services integration
- Leaderboards ready (future feature)
- Achievements ready (future feature)

### Data Collected
- User ID (platform-specific)
- Display name
- Authentication type
- Game progress (coins, unlocked items, equipped items)
- Last sync timestamp

### Data NOT Collected
- Email addresses (unless user shares)
- Personal information
- Location data
- Device information
- Usage analytics (not implemented yet)

---

## 🚀 Technical Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Storage**: AsyncStorage
- **Authentication**: 
  - expo-apple-authentication (iOS)
  - expo-auth-session (Android/Google)
- **State Management**: React Context API
- **Styling**: StyleSheet (dynamic theming)

### Key Systems

#### Theme System
- `ThemeContext` provides global theme colors
- `getEquippedThemeSkin()` loads active theme
- `refreshTheme()` updates after changes
- Dynamic styles using `getStyles(colors)` pattern

#### Authentication System
- `AuthContext` manages auth state
- Auto-sync on sign-in
- Persistent session across app launches
- Sign out clears auth state (local data remains)

#### Storage System
- All functions in `storage.js`
- Separate keys for each data type
- Atomic updates prevent data corruption
- Cloud sync functions ready for platform APIs

---

## 📊 Game Balance

### Coin Economy
| Action | Coins Earned |
|--------|--------------|
| Win (Easy) | 50 |
| Win (Medium) | 100 |
| Win (Hard) | 150 |
| Rally Bonus (every 5 hits) | 10 |

### Loot Box Pricing (Future)
| Box Type | Suggested Price |
|----------|----------------|
| Ball Skin Box | 500 coins |
| Paddle Skin Box | 500 coins |
| Theme Box | 1000 coins |

### Rarity Distribution (Plinko)
- Common: ~64% (13 slots)
- Uncommon: ~20% (4 slots)
- Rare: ~10% (2 slots)
- Epic: ~5% (1 slot)
- Legendary: ~1% (1 slot)

---

## 🎨 Visual Design

### Color Palette
- **Background**: Dark slate (#0F172A)
- **Surface**: Slightly lighter slate
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple tones
- **Accent**: Gold (#F59E0B) for coins
- **Text**: White with opacity variations

### Typography
- **Titles**: Thin weight (300), wide letter-spacing
- **Body**: Medium weight (500-600)
- **Coins**: Bold (700), gold color

### UI Principles
- Clean, minimal design
- Glassmorphism effects
- Smooth animations
- Clear visual hierarchy
- Consistent spacing and padding

---

## 🔮 Future Features

### Planned
- [ ] Leaderboards (requires backend)
- [ ] Achievements system
- [ ] Daily challenges
- [ ] Friend challenges
- [ ] Profile customization
- [ ] Sound effects and music
- [ ] Haptic feedback
- [ ] Multiple ball/paddle colors in one game
- [ ] Power-ups during gameplay
- [ ] Tournament mode

### Under Consideration
- [ ] Multiplayer (local or online)
- [ ] Custom paddle sizes (unlockable)
- [ ] Ball speed modifiers
- [ ] Special effect themes (particles, trails)
- [ ] Replay system
- [ ] Statistics tracking
- [ ] Cross-platform account linking

---

## 📝 Notes for Development

### Current Status
✅ Core gameplay working
✅ Coin system implemented
✅ Loot boxes with Plinko
✅ All skin types (ball, paddle, theme)
✅ Theme variants (Neon Cyberpunk)
✅ Authentication (Apple/Google)
✅ Cloud sync architecture
✅ Offline-first design
✅ All screens functional

### Known Issues
- Cloud storage placeholder (needs platform-specific APIs)
- Google OAuth Client ID needs configuration
- No actual coin prices on loot boxes (set to 0 for testing)
- No error handling for failed sync

### Next Steps
1. Set loot box prices
2. Implement actual cloud storage (iCloud/Play Games Saved Games)
3. Add sound effects
4. Add achievements
5. Create app store assets
6. Beta testing via TestFlight/Play Store
7. Launch! 🚀

---

**Version**: 1.0.0  
**Last Updated**: November 2, 2025  
**Developer**: SNF-Alex  
**Platform**: iOS & Android (via React Native + Expo)
