# MeetInTheMiddle App

## Overview
MeetInTheMiddle is a web application that helps users find the perfect midpoint between two locations, displaying restaurants, entertainment venues, and other points of interest at that midpoint location.

## Features
- Interactive map interface with route visualization
- Dual location input with auto-suggestions
- Points of interest panel showing venues near the midpoint
- Professional styling with engaging animations
- Responsive design for mobile and desktop

## Tech Stack
- React with TypeScript
- Vite for build tooling (web)
- Expo for mobile deployment
- Tailwind CSS for styling
- Framer Motion for animations
- Leaflet for maps (web) / React Native Maps (mobile)
- ShadCN UI components

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/meet-in-the-middle.git
   cd meet-in-the-middle
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Location Input ├────►│  Map Interface  │◄────┤  POI Panel      │
│  Component      │     │  Component      │     │  Component      │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  External APIs  │
                        │  - Geocoding    │
                        │  - Routing      │
                        │  - POI Data     │
                        │                 │
                        └─────────────────┘
```

### Technologies Used

## Deploying to App Stores

### Preparing for App Store Deployment

1. Install Expo CLI
   ```bash
   npm install -g expo-cli
   npm install expo
   ```

2. Initialize Expo in your project
   ```bash
   npx expo init MeetInTheMiddle
   # Select 'bare workflow' when prompted
   ```

3. Move your React code to the Expo project
   ```bash
   # Copy your src files to the new Expo project
   ```

4. Install required Expo modules
   ```bash
   npx expo install expo-location react-native-maps
   ```

5. Configure app.json for your app
   ```json
   {
     "expo": {
       "name": "MeetInTheMiddle",
       "slug": "meet-in-the-middle",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": [
         "**/*"
       ],
       "ios": {
         "supportsTablet": true,
         "bundleIdentifier": "com.yourdomain.meetinthemiddle",
         "infoPlist": {
           "NSLocationWhenInUseUsageDescription": "This app needs access to your location to find the midpoint between you and your friend."
         }
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#FFFFFF"
         },
         "package": "com.yourdomain.meetinthemiddle",
         "permissions": ["ACCESS_FINE_LOCATION"]
       }
     }
   }
   ```

### iOS App Store Deployment

1. Build for iOS
   ```bash
   npx expo build:ios
   ```

2. When prompted, choose to build:
   - For simulator (development)
   - As an archive (for App Store)

3. Follow the Expo CLI instructions to:
   - Create or select an Apple Developer account
   - Generate or select certificates and provisioning profiles

4. Once the build is complete, download the .ipa file from the Expo website

5. Use Apple Transporter or App Store Connect to upload your .ipa

6. Complete App Store listing with:
   - Screenshots
   - App description
   - Privacy policy
   - Keywords

### Android Play Store Deployment

1. Build for Android
   ```bash
   npx expo build:android
   ```

2. When prompted, choose to build:
   - APK (for testing)
   - AAB (for Play Store submission)

3. Once the build is complete, download the .apk or .aab file from the Expo website

4. Create a Google Play Developer account and:
   - Upload your app bundle (.aab file)
   - Complete store listing details
   - Set up privacy policy
   - Submit for review

### Testing with Expo Go

During development, you can test your app on real devices using Expo Go:

1. Start your development server
   ```bash
   npx expo start
   ```

2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

This allows you to test your app on real devices without building native binaries.

## License
MIT

## Acknowledgements
- OpenStreetMap for map data
- OSRM for routing
- Overpass API for POI data
