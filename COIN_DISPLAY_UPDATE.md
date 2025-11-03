# Coin Display & Rotating Hints Update

## Changes Made

### 📱 MenuScreen (Home Screen)

#### Before:
- Coins displayed in header next to "PONG-O" title
- Single static hint: "Rally bonus: +10 coins every 5 hits!"

#### After:
- **Coins moved above tab bar** - centered, larger, more prominent
- **5 rotating hints** that change every 5 seconds:
  1. "Rally bonus: +10 coins every 5 hits!"
  2. "You can get different skins by opening a box in the shop"
  3. "You get more coins the harder the AI"
  4. "Sign in to protect your progress across devices"
  5. "Legendary themes have customizable color variants"

#### Visual Layout:
```
┌─────────────────────────┐
│      PONG-O             │ ← Clean header
│      ─────              │
│  Choose Your Challenge  │
├─────────────────────────┤
│   [Game Mode Cards]     │
│                         │
│                         │
├─────────────────────────┤
│    💰 [Coins: 150]      │ ← NEW: Prominent coin display
├─────────────────────────┤
│ 💡 [Rotating Hint...]   │ ← NEW: Dynamic hints
├─────────────────────────┤
│  [Shop] [Bag] [Help]    │ ← Tab bar
└─────────────────────────┘
```

---

### 🎒 BackpackScreen

#### Before:
- Coins in header on the right side (cluttered with back button)

#### After:
- **Coins centered at the very top** above the header
- Clean three-column header: Back Button | BACKPACK Title | Empty space (symmetrical)
- More breathing room and visual hierarchy

#### Visual Layout:
```
┌─────────────────────────┐
│    💰 [Coins: 150]      │ ← NEW: Top-centered coins
├─────────────────────────┤
│ [←]   BACKPACK      [ ] │ ← Clean symmetrical header
│         ─────           │
│    X Items Unlocked     │
├─────────────────────────┤
│ [Balls][Paddles][Themes]│ ← Section tabs
├─────────────────────────┤
│   [Inventory Grid...]   │
└─────────────────────────┘
```

---

### 🛍️ ShopScreen

#### Status:
- **No changes needed** - coins already well-positioned in header
- Layout works great with back button, title, and coins

---

## Technical Implementation

### MenuScreen Changes

1. **Added Hints Array**:
```javascript
const HINTS = [
  "Rally bonus: +10 coins every 5 hits!",
  "You can get different skins by opening a box in the shop",
  "You get more coins the harder the AI",
  "Sign in to protect your progress across devices",
  "Legendary themes have customizable color variants"
];
```

2. **Added Hint Rotation**:
```javascript
const [currentHintIndex, setCurrentHintIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentHintIndex((prev) => (prev + 1) % HINTS.length);
  }, 5000); // Rotate every 5 seconds
  return () => clearInterval(interval);
}, []);
```

3. **Moved Coins Above Tab Bar**:
- Removed from header
- Added new `coinsContainer` section above footer
- Enhanced styling with glow effect

### BackpackScreen Changes

1. **Added Top Coins Container**:
```javascript
<View style={styles.coinsContainer}>
  <View style={styles.coinsDisplay}>
    <Ionicons name="disc" size={20} color="#F59E0B" />
    <Text style={styles.coinsAmount}>{coins}</Text>
  </View>
</View>
```

2. **Updated Header Layout**:
- Removed coins from right side
- Added empty `<View style={styles.backButton} />` for symmetry
- Adjusted padding and spacing

---

## Styling Details

### Enhanced Coin Display
- **Size**: Larger (20-22px icons, 18-20px text)
- **Glow Effect**: Shadow with gold color (#F59E0B)
- **Border**: 1.5px with increased opacity
- **Elevation**: Added shadow for depth
- **Rounded**: 20-24px border radius for pill shape

### Hint Container
- **Flexible Width**: Text wraps and centers
- **Min Height**: 44px to prevent layout shift during rotation
- **Smooth Transitions**: React handles fade naturally
- **Icon**: Lightbulb (💡) for visual interest

---

## User Experience Improvements

### ✅ Benefits

1. **Better Visual Hierarchy**
   - Coins more prominent above tab bar
   - Clean separation of sections
   - Less cluttered headers

2. **Educational Hints**
   - Users learn game mechanics passively
   - Rotating content keeps screen fresh
   - 5 different tips cover key features

3. **Consistent Layout**
   - MenuScreen: Coins above tabs
   - BackpackScreen: Coins at top (centered)
   - ShopScreen: Coins in header (works well there)

4. **Improved Readability**
   - Larger coin numbers
   - More breathing room
   - Enhanced contrast with glow effect

---

## Testing Checklist

- [x] No TypeScript/linting errors
- [x] Coins update in real-time (1000ms interval)
- [x] Hints rotate every 5 seconds
- [x] Layout works on different screen sizes
- [x] Glow effects visible
- [x] Symmetrical BackpackScreen header

---

## Next Steps (Optional)

### Potential Enhancements

1. **Animated Transitions**
   - Fade in/out for hint changes
   - Slide animation for rotating text
   - Use `react-native-reanimated` for smooth transitions

2. **Context-Aware Hints**
   - Show different hints based on user progress
   - Hide "sign in" hint if already signed in
   - Show achievement-specific tips

3. **Coin Animation**
   - Animate number changes when coins update
   - Add sparkle effect on coin gain
   - Pulse animation when hovering threshold

4. **Customizable Hints**
   - Load hints from server (for updates)
   - A/B test different messaging
   - Localization support

---

**Updated**: November 2, 2025  
**Files Modified**: 
- `src/screens/MenuScreen.js`
- `src/screens/BackpackScreen.js`
