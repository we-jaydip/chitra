import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; // ✅ ADD
import '../lib/i18n'; // Initialize i18n

export default function RootLayout() {
  useFrameworkReady();

  return (
    // ✅ Wrap the entire app with ThemeProvider (top-most)
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="language" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* StatusBar can remain here; theme doesn't affect it directly */}
        <StatusBar style="light" />
      </AuthProvider>
    </ThemeProvider>
  );
}
