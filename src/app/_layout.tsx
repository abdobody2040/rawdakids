import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '@/store/useAppStore';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';
import AppSplashScreen from '@/components/AppSplashScreen';
import AppLoadingScreen from '@/components/AppLoadingScreen';

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
  const {
    hydrate,
    isHydrated,
    incrementTimeSpent,
  } = useAppStore();

  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Guaranteed safe dismissal of native splash screen on Android & iOS
  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
    // Safety fallback timeout: never let native splash freeze longer than 1.2s
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 1200);
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
      </Stack>

      {/* In-App Splash Screen Transition */}
      {splashVisible && (
        <AppSplashScreen
          onFinish={() => setSplashVisible(false)}
          minDurationMs={1500}
        />
      )}

      {/* Fallback Loading Screen if store hydration takes longer */}
      {!isHydrated && !splashVisible && <AppLoadingScreen />}
    </GestureHandlerRootView>
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
