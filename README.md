# Clerk Expo Google Sign-In error classification reproduction

Minimal Expo development build reproducing an Android provider failure that
`@clerk/expo-google-signin` reports as user cancellation.

## Setup

1. Follow Clerk's [native Google Sign-In guide](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-google)
   to create a Google web client and configure it in a Clerk development instance.
2. Copy `.env.example` to `.env.local` and set the three public values.
3. For the failure case, do not register the installed debug package and SHA-1 as
   an Android OAuth client. This intentionally makes Google reject the caller.
4. Build and run the native Android app:

   ```sh
   bun install
   bunx expo prebuild --platform android
   bunx expo run:android
   ```

5. Tap **Continue with Google** and select an account.

## Expected

The provider failure is thrown to the app as `GOOGLE_SIGN_IN_ERROR`, preserving
Google's diagnostic message.

Closing the account chooser without selecting an account remains a normal
cancellation and creates no session.

## Actual

The app displays:

```text
No session was created and no error was thrown.
```

Google Play services reports the underlying configuration failure in Logcat,
but the native Clerk module converts every
`GetCredentialCancellationException` into `SIGN_IN_CANCELLED`. The Clerk Expo
hook then intentionally treats that code as a normal dismissal and returns no
session.

## Versions

- Expo SDK 57
- React Native 0.86
- `@clerk/expo` 4.3.0
- `@clerk/expo-google-signin` 1.0.0
- Android API 36 Google Play emulator
