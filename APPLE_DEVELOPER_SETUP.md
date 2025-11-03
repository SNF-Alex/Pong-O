# Apple Developer Setup Guide for Pong-O

## Prerequisites
- Apple Developer Account ($99/year) - https://developer.apple.com
- EAS CLI installed globally
- Expo account

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials.

## Step 3: Configure Your Project

Create an EAS configuration file:

```bash
eas build:configure
```

This creates an `eas.json` file in your project root.

## Step 4: Update eas.json

Your `eas.json` should look like this:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Step 5: Apple Developer Portal Setup

### 5.1 Create App Identifier

1. Go to https://developer.apple.com/account
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (Add new)
4. Select **App IDs** → Continue
5. Fill in:
   - **Description**: Pong-O
   - **Bundle ID**: `com.snfalex.pongo` (must match app.json)
   - **Capabilities**: Enable "Sign in with Apple"
6. Click **Continue** → **Register**

### 5.2 Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Pong-O
   - **Primary Language**: English
   - **Bundle ID**: Select `com.snfalex.pongo`
   - **SKU**: `pongo-2025` (or any unique identifier)
   - **User Access**: Full Access
4. Click **Create**

## Step 6: Update app.json

Make sure your `app.json` has the correct configuration:

```json
{
  "expo": {
    "name": "Pong-O",
    "slug": "pong-o",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F172A"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.snfalex.pongo",
      "usesAppleSignIn": true,
      "infoPlist": {
        "NSUserTrackingUsageDescription": "This app uses Game Center to save your progress across devices."
      },
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "package": "com.snfalex.pongo"
    },
    "plugins": [
      "expo-apple-authentication"
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id-will-be-here"
      }
    }
  }
}
```

## Step 7: Build Your First Development Build

### Option A: Build for Physical Device (Recommended)

```bash
# Build for iOS device
eas build --profile development --platform ios
```

This will:
1. Ask you to set up your Apple credentials
2. Create a provisioning profile
3. Build the app
4. Give you a download link

### Option B: Build for Simulator (Testing)

```bash
# Build for iOS Simulator
eas build --profile development --platform ios --local
```

## Step 8: Download and Install

### For Physical Device:
1. EAS will provide a QR code and download link
2. Open the link on your iPhone
3. Install the app (you may need to trust the developer certificate)
4. Go to **Settings** → **General** → **VPN & Device Management**
5. Trust your developer certificate

### For Simulator:
1. Download the `.tar.gz` file from EAS
2. Extract it
3. Drag the `.app` file to your simulator

## Step 9: Install Expo Dev Client

On your device, you'll also need the Expo Dev Client to run the development build:

The build already includes the dev client, so you just need to run:

```bash
npx expo start --dev-client
```

Then scan the QR code with your device.

## Step 10: Test Apple Sign In

1. Launch your app on the device
2. You should see the Sign In screen
3. Tap "Sign in with Apple"
4. **Important**: Make sure you're signed into iCloud on the device
5. Authenticate with Face ID/Touch ID
6. App should navigate to Menu automatically
7. Check Help screen to verify you're signed in

## Troubleshooting

### "Sign in with Apple is not available"
- Make sure you're testing on a real device (not simulator)
- Ensure device is signed into iCloud
- Check that bundle ID matches exactly

### Build fails with provisioning error
```bash
# Clear EAS credentials and try again
eas credentials:clear
eas build --profile development --platform ios
```

### "App not trusted" on device
- Go to Settings → General → VPN & Device Management
- Tap your developer account
- Tap "Trust"

### EAS asks for Apple Developer credentials
You'll need to provide:
- Apple ID email
- App-specific password (create at appleid.apple.com)
- Or use `eas credentials` to manage manually

## Production Build (When Ready)

When you're ready to release:

```bash
# Production build
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

## Cost Summary

- **Apple Developer Program**: $99/year (required)
- **Expo Account**: Free
- **EAS Build**: Free tier includes limited builds, paid plans available

## Quick Start Commands

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure project
eas build:configure

# 4. Build for development
eas build --profile development --platform ios

# 5. Start dev server
npx expo start --dev-client
```

## Next Steps After Setup

Once your development build is working:

1. ✅ Test Apple Sign In on real device
2. ✅ Test logout functionality
3. ✅ Verify cloud sync (sign in on multiple devices)
4. ✅ Test game mechanics
5. ✅ Test loot boxes and rewards
6. ✅ Prepare app store screenshots
7. ✅ Write app description
8. ✅ Submit for TestFlight beta testing
9. ✅ Get feedback from testers
10. ✅ Submit to App Store

## Important Notes

- **Bundle Identifier** must match exactly everywhere: `com.snfalex.pongo`
- **Sign in with Apple** only works on physical devices with iCloud signed in
- **Development builds** expire after a certain time (30-90 days)
- **Production builds** are permanent and can be distributed via TestFlight/App Store

## Support Resources

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Apple Developer: https://developer.apple.com/support/
- Expo Forums: https://forums.expo.dev/
- Apple Sign In Docs: https://developer.apple.com/sign-in-with-apple/

---

**Ready to build?** Run `eas build --profile development --platform ios` to get started! 🚀
