import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';

interface AppSplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export default function AppSplashScreen({
  onFinish,
  minDurationMs = 1800,
}: AppSplashScreenProps) {
  const { language } = useAppStore();
  const isAr = language === 'ar';
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [progressAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Progress bar fill animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: minDurationMs,
      useNativeDriver: false,
    }).start();

    // Timer to fade out
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 400,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        if (onFinish) onFinish();
      });
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, progressAnim, minDurationMs, onFinish]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <ImageBackground
        source={require('../../assets/images/splash-screen.jpg')}
        style={[styles.background, isDesktop && styles.desktopBackground]}
        resizeMode="cover"
      >
        {/* Subtle bottom gradient tint and progress indicator */}
        <View style={styles.bottomOverlay}>
          <Text style={styles.subtitle}>
            {isAr ? '✨ بِسْمِ اللَّهِ نَبْدَأُ رِحْلَتَنَا ✨' : '✨ In the Name of Allah We Begin ✨'}
          </Text>

          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>

          <Text style={styles.appTitle}>
            {isAr ? 'روضة كيدز • عالم الإيمان والبهجة' : 'Rawdakids • Islamic Joy & Learning'}
          </Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  desktopBackground: {
    maxWidth: 520,
    alignSelf: 'center',
  },
  bottomOverlay: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.65)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FDE047',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  progressBarBackground: {
    width: '80%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 8,
  },
  appTitle: {
    fontSize: 13,
    color: '#D1FAE5',
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
});
