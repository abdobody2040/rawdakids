import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';

interface AppLoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const DHIKR_ROTATIONS_AR = [
  'نور يجهّز لك بستان القرآن والبهجة... 🌸',
  'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ • سُبْحَانَ اللَّهِ الْعَظِيمِ ✨',
  'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ 🕌',
  'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ 🤲',
  'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ 🌟',
];

const DHIKR_ROTATIONS_EN = [
  'Noor is preparing your Quran Garden... 🌸',
  'Subhan Allah wa bihamdihi • Subhan Allah al-Adheem ✨',
  'Allahumma salli wa sallim ala Nabiyyina Muhammad ﷺ 🕌',
  'Alhamdulillah Rabbil Alameen 🤲',
  'La ilaha illa Allah wahdahu la shareeka lah 🌟',
];

export default function AppLoadingScreen({
  message,
  subMessage,
  fullScreen = true,
}: AppLoadingScreenProps) {
  const { language } = useAppStore();
  const isAr = language === 'ar';
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [dhikrIndex, setDhikrIndex] = useState(0);

  // Animations as state for React 19 compiler compatibility
  const [floatAnim] = useState(() => new Animated.Value(0));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [glowAnim] = useState(() => new Animated.Value(0.4));
  const [rotateAnim] = useState(() => new Animated.Value(0));

  // Floating & breathing loop
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.98,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.85,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(glowAnim, {
          toValue: 0.35,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    floatLoop.start();
    pulseLoop.start();
    glowLoop.start();
    rotateLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
      glowLoop.stop();
      rotateLoop.stop();
    };
  }, [floatAnim, pulseAnim, glowAnim, rotateAnim]);

  // Rotate reminder text every 2.4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDhikrIndex((prev) => (prev + 1) % DHIKR_ROTATIONS_AR.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const activeDhikr = isAr
    ? DHIKR_ROTATIONS_AR[dhikrIndex]
    : DHIKR_ROTATIONS_EN[dhikrIndex];

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreenContainer,
        isDesktop && fullScreen && styles.desktopContainer,
      ]}
    >
      {/* Decorative stars and sparkles */}
      <View style={styles.starsRow}>
        <Text style={styles.starSparkle}>✨</Text>
        <Text style={[styles.starSparkle, styles.starSmall]}>✦</Text>
        <Text style={styles.starSparkle}>🌙</Text>
        <Text style={[styles.starSparkle, styles.starSmall]}>✦</Text>
        <Text style={styles.starSparkle}>✨</Text>
      </View>

      {/* Mascot Noor with Glowing Aura */}
      <View style={styles.mascotWrapper}>
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.mascotContainer,
            {
              transform: [
                { translateY: floatAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/mascot-noor.jpg')}
            style={styles.mascotImage}
            resizeMode="cover"
          />
        </Animated.View>
      </View>

      {/* Title & Dhikr text */}
      <Text style={styles.mainTitle}>
        {message || (isAr ? 'جاري التحميل...' : 'Loading...')}
      </Text>

      <View style={styles.dhikrBubble}>
        <Text style={styles.dhikrText}>
          {subMessage || activeDhikr}
        </Text>
      </View>

      {/* Rotating geometric Islamic star spinner */}
      <Animated.View
        style={[
          styles.spinnerWrapper,
          { transform: [{ rotate: spin }] },
        ]}
      >
        <Text style={styles.spinnerText}>۞</Text>
      </Animated.View>

      <Text style={styles.hintFooter}>
        {isAr ? 'نور يبتسم لك ويدعوك لذكر الله' : 'Noor is smiling and reminding you of Dhikr'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    width: '100%',
    height: '100%',
  },
  desktopContainer: {
    maxWidth: 520,
    alignSelf: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  starSparkle: {
    fontSize: 22,
  },
  starSmall: {
    fontSize: 14,
    color: '#FDE047',
  },
  mascotWrapper: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  glowRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(251, 191, 36, 0.35)',
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  mascotContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FDE047',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  dhikrBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(253, 224, 71, 0.4)',
    maxWidth: '90%',
    marginBottom: 24,
  },
  dhikrText: {
    fontSize: 15,
    color: '#FEF08A',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
  spinnerWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  spinnerText: {
    fontSize: 32,
    color: '#FBBF24',
  },
  hintFooter: {
    fontSize: 12,
    color: '#A7F3D0',
    textAlign: 'center',
    opacity: 0.85,
  },
});
