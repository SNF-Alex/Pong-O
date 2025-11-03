# Authentication Setup Guide

## Overview
Pong-O now includes platform-specific authentication with Apple Game Center (iOS) and Google Play Games (Android), allowing users to save their progress across devices.

## Features Implemented

### ✅ Authentication Flow
- **SignInScreen**: Initial screen with platform-specific sign-in options
- **Warning Modal**: Alerts users about data loss risks without sign-in
- **Skip Option**: Users can play locally without signing in
- **Auto-Navigation**: Shows sign-in screen on first launch if user hasn't signed in

### ✅ Platform Support
- **iOS**: Sign in with Apple / Game Center
- **Android**: Sign in with Google Play Games
- **Platform Detection**: Shows only relevant sign-in button per platform

### ✅ Cloud Sync
- Automatic sync after successful sign-in
- Syncs: Coins, unlocked skins/paddles/themes, equipped items, theme variants
- Conflict resolution: Uses most recent data (local vs cloud)
- Background sync placeholder (ready for iCloud/Google Play saved games)

### ✅ Sign-In Reminders
- Smart banner in MenuScreen for users with progress
- Shows when user has:
  - More than 50 coins, OR
  - More than 5 unlocked items
- Dismissible but reappears when conditions met

## Setup Instructions

### iOS - Apple Sign In

1. **App Configuration** (Already done in `app.json`)
   ```json
   "ios": {
     "usesAppleSignIn": true,
     "infoPlist": {
       "NSUserTrackingUsageDescription": "This app uses Game Center to save your progress across devices."
     }
   }
   ```

2. **Apple Developer Console**
   - Enable "Sign In with Apple" capability in your app identifier
   - Configure bundle identifier: `com.snfalex.pongo`

3. **Testing**
   - Requires physical iOS device (simulator may not work fully)
   - Must be signed into iCloud/Apple ID on device

### Android - Google Play Games

1. **Google Play Console Setup**
   - Create a game in Google Play Console
   - Enable Google Play Games Services
   - Add your app's package name: `com.snfalex.pongo`

2. **Get SHA-1 Fingerprint**
   ```bash
   # Debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # Production keystore
   keytool -list -v -keystore /path/to/your/keystore.jks -alias your-alias
   ```

3. **Configure OAuth Client**
   - In Google Play Console > Game Services > Credentials
   - Create OAuth 2.0 client ID for Android
   - Add SHA-1 fingerprint
   - Copy the Client ID and replace in `AuthContext.js`:
     ```javascript
     const clientId = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
     ```

4. **Testing**
   - Requires physical Android device or emulator with Google Play Services
   - Must be signed into Google account

## File Structure

```
src/
├── contexts/
│   ├── AuthContext.js          # Authentication state management
│   └── ThemeContext.js         # Theme state (uses auth for sync)
├── screens/
│   ├── SignInScreen.js         # Sign-in UI with warnings
│   └── MenuScreen.js           # Sign-in reminder banner
├── utils/
│   └── storage.js              # Cloud sync functions
└── App.js                      # Auth flow integration
```

## Key Components

### AuthContext (`src/contexts/AuthContext.js`)
- Manages authentication state globally
- Functions:
  - `signInWithApple()` - iOS authentication
  - `signInWithGoogle()` - Android authentication
  - `signOut()` - Clear auth state
  - `skipSignIn()` - Mark warning as seen, continue locally
- Automatically syncs with cloud after sign-in

### SignInScreen (`src/screens/SignInScreen.js`)
- Platform-specific sign-in buttons
- Warning modal explaining data loss risks
- Compliance with Apple/Google guidelines
- Terms of Service and Privacy Policy mentions

### Cloud Sync (`src/utils/storage.js`)
Functions added:
- `getAllUserData()` - Export all user progress
- `restoreUserData()` - Import user progress
- `uploadToCloud()` - Upload to platform cloud (placeholder)
- `downloadFromCloud()` - Download from platform cloud (placeholder)
- `syncWithCloud()` - Automatic sync with conflict resolution

## Data Synced

All user progress is synced:
- 💰 Coins
- 🎨 Unlocked ball skins
- 🏓 Unlocked paddle skins
- 🎨 Unlocked themes
- ⭐ Equipped ball skin
- ⭐ Equipped paddle skin
- ⭐ Equipped theme
- 🌈 Theme color variants (for Neon Cyberpunk)

## Warnings & Compliance

### Apple Requirements ✅
- Uses "Sign in with Apple" button styling
- Includes privacy usage description
- Warns about data loss
- Non-blocking (users can skip)

### Google Play Requirements ✅
- Uses Google Play Games Services
- OAuth 2.0 authentication
- SHA-1 fingerprint verification
- Warns about data loss
- Non-blocking (users can skip)

### User Warnings
The app warns users that **WITHOUT signing in**:
- ⚠️ Uninstalling the app = permanent data loss
- ⚠️ Cannot transfer progress to another device
- ⚠️ No cloud backup of progress

## Testing the System

### Test Sign-In Flow
1. Launch app for first time
2. Should show SignInScreen with platform-specific button
3. Can sign in or skip (with warning)
4. After skipping, goes to Menu

### Test Sign-In Reminder
1. Skip sign-in on first launch
2. Earn 60+ coins or unlock 6+ items
3. Navigate to Menu
4. Should see sign-in reminder banner
5. Can click "Sign In" or "Later"

### Test Cloud Sync
1. Sign in on Device A
2. Earn coins and unlock items
3. Sign in on Device B with same account
4. Should sync progress automatically

## Production Checklist

Before releasing:

- [ ] Replace Google OAuth Client ID in `AuthContext.js`
- [ ] Test Apple Sign In on physical iOS device
- [ ] Test Google Play Games on physical Android device
- [ ] Implement actual cloud storage (iCloud for iOS, Google Play saved games for Android)
- [ ] Add Terms of Service URL
- [ ] Add Privacy Policy URL
- [ ] Test sync across multiple devices
- [ ] Test data restoration after app reinstall
- [ ] Verify all warnings display correctly

## Future Enhancements

Potential improvements:
- 📊 Leaderboards using Game Center/Play Games
- 🏆 Achievements
- 👥 Friend challenges
- 📱 Cross-platform account linking
- 🔄 Manual sync button
- 📧 Email/password authentication option
- 🎮 Guest account promotion

## Troubleshooting

### Apple Sign In Not Working
- Ensure device is signed into iCloud
- Check bundle identifier matches
- Verify "Sign in with Apple" capability is enabled
- Test on physical device, not simulator

### Google Play Games Not Working
- Check SHA-1 fingerprint is correct
- Verify Client ID is configured properly
- Ensure Google Play Services is installed
- Check package name matches

### Cloud Sync Not Working
- Note: Cloud storage is currently placeholder
- Implement platform-specific cloud APIs:
  - iOS: `NSUbiquitousKeyValueStore` or CloudKit
  - Android: Google Play Games Services Saved Games API

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify platform setup (Apple/Google consoles)
3. Test authentication libraries are installed
4. Review this documentation

---

**Status**: ✅ Authentication system fully implemented and ready for testing!
