# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Build and install the development build

   This project uses `expo-dev-client`, which requires a development build to be installed on your device/simulator before you can run the app.

   **For iOS:**
   
   ```bash
   npm run ios
   ```
   
   This will build and install the development build on the iOS simulator. For a physical device, you'll need to:
   - Connect your device via USB
   - Ensure your device is registered in your Apple Developer account
   - Run `npm run ios` with your device selected

   **For Android:**
   
   ```bash
   npm run android
   ```
   
   This will build and install the development build on an Android emulator or connected device.

3. Start the development server

   After the development build is installed, start the Expo development server:

   ```bash
   npx expo start
   ```

   The app should automatically connect to the development server. If it doesn't, you can:
   - Shake your device to open the developer menu
   - Select "Reload" or scan the QR code

## Development Builds

This project uses [development builds](https://docs.expo.dev/develop/development-builds/introduction/), which allow you to use custom native code and modules that aren't available in Expo Go. You'll need to rebuild the development build whenever you:
- Add or modify native dependencies
- Change native configuration in `app.json`
- Update Expo SDK version

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
