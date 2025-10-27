# Pong-O 🏓

A modern React Native Pong game built with Expo, featuring AI opponents, customizable controls, and a coin reward system.

## Original Prompt

"Create a react native app with expo/eas build compatible. I want a simple pong game with some kinda AI as an enemy. I want Easy Medium Hard mode. I want to be able to earn coins when you win a game you get a certain amount and maybe a bonus if you get like 5 hits in a row or something, I also want the option to make an account in the future (using clerk) but for now i just want the coins to be stored in a state for now. Then i want to be able to use the coins to buy different skins and i want loot boxes as an option as well with different tier of items common, uncommon, rare, epic and legendary."

## Main Features

### Core Gameplay
- 🎮 **Classic Pong mechanics** with smooth 60 FPS gameplay
- 🤖 **AI opponent** with intelligent paddle movement
- 🎯 **3 Difficulty Levels**:
  - Easy: 10 coins per win
  - Medium: 50 coins per win  
  - Hard: 100 coins per win
- 💰 **Coin System**: Earn coins by winning + rally bonuses (+5 coins every 5 hits)
- ⚡ **Progressive ball speed** - starts slow, speeds up with each hit (capped for playability)

### Control Options
- 🎮 **Two Control Styles**:
  - **Arrow Buttons**: On-screen up/down buttons
  - **Drag**: Touch and drag anywhere to move paddle
- 📍 **Button Position Options** (for Arrow Buttons):
  - Bottom Right (default)
  - Bottom Left
  - Top Right
  - Top Left
  - Bottom Bar (side-by-side buttons)
- ⚙️ **Settings Modal** with dropdown menus for customization

### Game Features
- � **Serve Mechanic**: Ball waits after each point
  - Player gets 1-second delay before serving (prevents accidental quick serves)
  - AI serves after 3 seconds
  - Player can trigger serve by moving paddle
- ⏯️ **Settings as Pause**: Settings button pauses game
- ⏱️ **3-2-1 Countdown**: Red countdown when resuming from settings
- 🏆 **First to 5 wins**: Simple scoring system

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo Go app (for testing on physical devices)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Devices
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## Building for Production

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Build Commands
```bash
# Login to Expo
eas login

# Build for Android (APK)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard from the main menu
2. **Control Your Paddle**:
   - Use arrow buttons (default) or switch to drag in settings
   - Change button position in settings if needed
3. **Serve the Ball**: Move your paddle after the 1-second delay
4. **Win Points**: First to 5 points wins
5. **Earn Coins**: Win bonuses + rally bonuses for long volleys

## Project Structure

```
Pong-O/
├── src/
│   ├── screens/
│   │   ├── MenuScreen.js      # Main menu with difficulty selection
│   │   └── GameScreen.js      # Game screen with controls & settings
│   ├── utils/
│   │   └── gameEngine.js      # Game logic, physics, AI, ball mechanics
│   └── constants/
│       └── gameConfig.js      # Game configuration and colors
├── App.js                      # Simple state-based navigation
├── app.json                    # Expo configuration
└── eas.json                    # EAS Build configuration
```

## Upcoming Features

- 🔐 **User Authentication**: Clerk integration for accounts
- 🎁 **Loot Box System**: Random rewards with rarity tiers
- 🎨 **Skins & Customization**: 
  - Paddle skins
  - Ball skins
  - Background themes
  - Rarity levels: Common, Uncommon, Rare, Epic, Legendary
- 💾 **Persistent Storage**: Save coins and unlocked items
- 📊 **Statistics**: Track wins, losses, and high scores

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build tooling
- **JavaScript** - Programming language
- **@expo/vector-icons (Ionicons)** - UI icons
- **EAS Build** - Production builds for iOS/Android

## License

MIT

---

## 🤖 Context for AI Assistant (Copy/Paste to Resume Development)

**Current Project State:**

This is a React Native Pong game built with Expo. The core game is fully functional with the following implemented features:

**Completed Features:**
- ✅ Full Pong game engine with 60 FPS physics
- ✅ AI opponent with 3 difficulty levels (Easy/Medium/Hard with different speeds, error margins, and coin rewards)
- ✅ Coin system: Win rewards (10/50/100) + rally bonuses (+5 every 5 hits)
- ✅ Progressive ball speed (starts at 6, increases by 0.15 per hit, capped at 14)
- ✅ Serve mechanic: Ball waits after each point, 1-second delay for player, 3 seconds for AI
- ✅ Two control styles: Arrow Buttons (with 5 position options: bottom-right, bottom-left, top-right, top-left, bottom-bar) and Drag (touch anywhere to move)
- ✅ Settings modal with dropdowns for control style and button position
- ✅ Countdown timer (3-2-1 in red) when resuming from settings
- ✅ Modern UI with Ionicons throughout
- ✅ Simple state-based navigation (removed React Navigation due to compatibility issues)
- ✅ EAS build configuration for production builds

**Technical Implementation:**
- `App.js`: Simple state-based screen switching (Menu/Game)
- `src/screens/MenuScreen.js`: Difficulty selection with icons
- `src/screens/GameScreen.js`: Main game with PanResponder for drag, arrow controls, settings modal
- `src/utils/gameEngine.js`: Game logic (ball physics, AI movement, collision detection, serve mechanics)
- `src/constants/gameConfig.js`: Configuration (ball speed, paddle size, difficulty settings, colors)
- No React Navigation (caused type errors, using useState for navigation instead)
- Paddle movement: 10 speed (balanced between 8 and 12)
- AI uses target tracking with dead zone to prevent jittering
- PanResponder always attached, only responds when controlStyle === 'drag'

**Known Working Solutions:**
- Fixed paddle going off screen by calculating PLAYABLE_HEIGHT = SCREEN_HEIGHT - 120 - 140
- Fixed AI jitter by storing aiTargetY and only updating occasionally
- Fixed ball speed being random by using consistent INITIAL_BALL_SPEED and linear increments
- Arrow controls use onPressIn/onPressOut with setInterval for continuous movement
- Settings button acts as pause, X button closes with countdown

**Next Steps (Not Yet Implemented):**
- Clerk authentication for user accounts
- Persistent storage (AsyncStorage) for coins and settings
- Loot box system with rarity tiers
- Skins for paddles/balls/backgrounds
- Statistics tracking

**File Structure:**
```
src/
├── screens/
│   ├── MenuScreen.js (difficulty selection)
│   └── GameScreen.js (game + controls + settings)
├── utils/
│   └── gameEngine.js (physics, AI, ball mechanics)
└── constants/
    └── gameConfig.js (config values, colors)
App.js (navigation)
```

**Important Notes:**
- Using Expo SDK (not newArchEnabled or edgeToEdgeEnabled)
- All controls are customizable via settings dropdown menus
- Ball speed is intentionally capped to keep game playable
- Serve delay prevents accidental quick serves after being scored on

Use this context to understand the current implementation and continue development from where we left off.
