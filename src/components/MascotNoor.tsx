// Mascot Noor (فانوس نور المحبوب)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface MascotNoorProps {
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ENCOURAGEMENTS_AR = [
  'أنت بطل رائع ومثابر!',
  'ما شاء الله عليك، يا ذكي!',
  'كل آية تحفظها نور في قلبك!',
  'رسولنا الحبيب ﷺ يحب الأطفال الطيبين!',
  'هيا نستمر ونجمع المزيد من النجوم!',
];

const ENCOURAGEMENTS_EN = [
  'You are doing wonderfully!',
  'Masha’Allah, you are super smart!',
  'Every ayah memorized is light in your heart!',
  'Our beloved Prophet ﷺ loves kind children!',
  'Let’s keep going and collect more stars!',
];

const MASCOT_IMG = require('../../assets/images/mascot-noor.jpg');

export default function MascotNoor({ customMessage, size = 'md' }: MascotNoorProps) {
  const { language } = useAppStore();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const isAr = language === 'ar';
  const messages = isAr ? ENCOURAGEMENTS_AR : ENCOURAGEMENTS_EN;
  const currentText = customMessage || messages[quoteIndex % messages.length];

  const handleTap = () => {
    setQuoteIndex((prev) => prev + 1);
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View style={[styles.container, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
      <TouchableOpacity
        style={[
          styles.mascotBadge,
          isSmall && styles.badgeSm,
          isLarge && styles.badgeLg,
        ]}
        onPress={handleTap}
        activeOpacity={0.85}
      >
        <Image
          source={MASCOT_IMG}
          style={[
            styles.mascotImage,
            isSmall && styles.imageSm,
            isLarge && styles.imageLg,
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.bubble}>
        <View
          style={[
            styles.arrow,
            isAr ? styles.arrowRight : styles.arrowLeft,
          ]}
        />
        <Text
          style={[
            styles.bubbleText,
            isSmall && styles.bubbleTextSm,
            isLarge && styles.bubbleTextLg,
            isAr && { textAlign: 'right' },
          ]}
        >
          {currentText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.sm + 2,
    marginVertical: SPACING.xs,
  },
  mascotBadge: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff4db',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#ffc14d',
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  badgeSm: {
    width: 42,
    height: 42,
    borderWidth: 2,
  },
  badgeLg: {
    width: 78,
    height: 78,
    borderWidth: 3,
    borderColor: '#ffb326',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
  },
  imageSm: {
    width: '100%',
    height: '100%',
  },
  imageLg: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#faecd1',
    ...SHADOWS.soft,
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    top: '38%',
    width: 12,
    height: 12,
    backgroundColor: '#ffffff',
    borderColor: '#faecd1',
  },
  arrowLeft: {
    left: -7,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  arrowRight: {
    right: -7,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#28463c',
    lineHeight: 19,
  },
  bubbleTextSm: {
    fontSize: 12,
    lineHeight: 16,
  },
  bubbleTextLg: {
    fontSize: 15,
    lineHeight: 22,
  },
});
