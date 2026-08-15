import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useSignInWithGoogle } from '@clerk/expo/google';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  if (!publishableKey) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Set the variables from .env.example before running the app.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GoogleSignInProbe />
    </ClerkProvider>
  );
}

function GoogleSignInProbe() {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const [result, setResult] = useState('Not started');

  const start = async () => {
    setResult('Waiting for Google…');

    try {
      const response = await startGoogleAuthenticationFlow();

      setResult(
        response.createdSessionId
          ? 'A Clerk session was created.'
          : 'No session was created and no error was thrown.',
      );
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN';
      const message = error instanceof Error ? error.message : String(error);
      setResult(`${code}: ${message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Android Google Sign-In error probe</Text>
        <Button title="Continue with Google" onPress={start} />
        <Text selectable style={styles.result}>
          {result}
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  result: {
    fontFamily: 'monospace',
    lineHeight: 22,
  },
});
