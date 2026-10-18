import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '@/store/useAppStore';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import AppSplashScreen from '@/components/AppSplashScreen';
import AppLoadingScreen from '@/components/AppLoadingScreen';

// Ensure icon font families are registered immediately in browser on Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const FONT_STYLE_ID = 'expo-vector-icons-web-fonts';
  if (!document.getElementById(FONT_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = FONT_STYLE_ID;
    style.textContent = `
      @font-face {
        font-family: 'ionicons';
        src: url('/assets/fonts/Ionicons.ttf') format('truetype'),
             url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf') format('truetype');
        font-display: swap;
      }
      @font-face {
        font-family: 'FontAwesome5_Solid';
        src: url('/assets/fonts/FontAwesome5_Solid.ttf') format('truetype'),
             url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf') format('truetype');
        font-display: swap;
      }
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('/assets/fonts/MaterialCommunityIcons.ttf') format('truetype'),
             url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf') format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}

// Prevent native splash screen from autohiding until app is ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>✨ تطبيق نور للأطفال ✨</Text>
      <Text style={styles.errorSub}>
        حدث أمر غير متوقع أثناء تشغيل التطبيق. اضغط أدناه لإعادة التشغيل:
      </Text>
      <Text style={styles.errorDetails}>{error?.message || String(error)}</Text>
      <TouchableOpacity onPress={retry} style={styles.retryButton} activeOpacity={0.8}>
        <Text style={styles.retryButtonText}>إعادة التشغيل (Retry)</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...FontAwesome5.font,
  });

  const hydrate = useAppStore((s) => s.hydrate);
  const isHydrated = useAppStore((s) => s.isHydrated);
  const incrementTimeSpent = useAppStore((s) => s.incrementTimeSpent);

  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Guaranteed safe dismissal of native splash screen on Android & iOS
  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
    // Safety fallback timeout: never let native splash freeze longer than 800ms
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [isHydrated]);

  // Track daily time spent
  useEffect(() => {
    const interval = setInterval(() => {
      incrementTimeSpent(5);
    }, 5000);
    return () => clearInterval(interval);
  }, [incrementTimeSpent]);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
      <GestureHandlerRootView style={styles.rootContainer}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="quran/index" />
          <Stack.Screen name="quran/[surahId]" />
          <Stack.Screen name="quran/repeat" />
          <Stack.Screen name="sunnah/index" />
          <Stack.Screen name="sunnah/[hadithId]" />
          <Stack.Screen name="sunnah/duas" />
          <Stack.Screen name="sunnah/cards" />
          <Stack.Screen name="prophets/index" />
          <Stack.Screen name="prophets/[prophetId]" />
          <Stack.Screen name="manners/index" />
          <Stack.Screen name="manners/[valueId]" />
          <Stack.Screen name="manners/journal" />
          <Stack.Screen name="rewards/index" />
          <Stack.Screen name="progress/index" />
          <Stack.Screen name="parents/index" />
          <Stack.Screen name="animals/index" />
          <Stack.Screen name="asma-allah/index" />
          <Stack.Screen name="companions/index" />
          <Stack.Screen name="tafakkur/index" />
          <Stack.Screen name="nations/index" />
          <Stack.Screen name="seerah/index" />
        </Stack>

        {/* In-App Splash Screen Transition */}
        {splashVisible && (
          <AppSplashScreen
            onFinish={() => setSplashVisible(false)}
            minDurationMs={Platform.OS === 'web' ? 400 : 1000}
          />
        )}

        {/* Fallback Loading Screen if store hydration takes longer */}
        {!isHydrated && !splashVisible && <AppLoadingScreen />}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 12,
  },
  errorSub: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
