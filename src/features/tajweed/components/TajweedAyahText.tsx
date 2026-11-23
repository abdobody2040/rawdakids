// src/features/tajweed/components/TajweedAyahText.tsx
// Color-coded Tajweed Ayah renderer — renders parsed tokens as nested <Text> spans.
// Non-destructive: when tajweedEnabled=false or data not loaded, renders plain ayah text.

import { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform, View } from 'react-native';
import { tajweedService, TajweedAyah, TajweedToken } from '../tajweedService';
import { TAJWEED_CATEGORIES } from '../tajweedRules';

interface TajweedAyahTextProps {
  surahNumber: number;
  ayahNumber: number;
  plainText: string;
  tajweedEnabled: boolean;
  fontSize: number;
  isActive: boolean;
  onTokenPress?: (token: TajweedToken, ayah: TajweedAyah) => void;
}

export default function TajweedAyahText({
  surahNumber,
  ayahNumber,
  plainText,
  tajweedEnabled,
  fontSize,
  isActive,
  onTokenPress,
}: TajweedAyahTextProps) {
  const [tajweedAyah, setTajweedAyah] = useState<TajweedAyah | null>(null);

  useEffect(() => {
    if (!tajweedEnabled) return;
    let cancelled = false;
    tajweedService.getAyahTajweed(surahNumber, ayahNumber).then((data) => {
      if (!cancelled) setTajweedAyah(data);
    });
    return () => { cancelled = true; };
  }, [tajweedEnabled, surahNumber, ayahNumber]);

  const baseStyle = [
    styles.quranText,
    { fontSize: isActive ? fontSize + 2 : fontSize },
    isActive && styles.quranTextActive,
  ];

  // Fallback: plain text
  if (!tajweedEnabled || !tajweedAyah || !tajweedAyah.hasAnyTajweed) {
    return (
      <Text style={baseStyle} textBreakStrategy="simple">
        {plainText}
      </Text>
    );
  }

  // Colored token render
  return (
    <Text style={baseStyle} textBreakStrategy="simple">
      {tajweedAyah.tokens.map((token, idx) => {
        if (!token.isTajweed || !token.category) {
          return (
            <Text key={idx} style={styles.plainToken}>
              {token.text}
            </Text>
          );
        }
        return (
          <Text
            key={idx}
            style={[styles.tajweedToken, { color: token.category.color }]}
            onPress={
              onTokenPress
                ? () => onTokenPress(token, tajweedAyah)
                : undefined
            }
            suppressHighlighting
          >
            {token.text}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  quranText: {
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'serif' }),
    color: '#064E3B',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 56,
    letterSpacing: 0.5,
    width: '100%',
  },
  quranTextActive: {
    color: '#022C1E',
  },
  plainToken: {
    // Inherits parent style
  },
  tajweedToken: {
    fontWeight: '700',
  },
});

// ─────────────────────────────────────────────────────────
// Compact 4-color Legend Bar (shown at bottom of Quran page when Tajweed is ON)
// ─────────────────────────────────────────────────────────

interface TajweedLegendBarProps {
  language: string;
  onRuleTap?: (categoryId: string) => void;
}

export function TajweedLegendBar({ language, onRuleTap }: TajweedLegendBarProps) {
  const isAr = language === 'ar';
  return (
    <View style={legendStyles.bar}>
      {Object.values(TAJWEED_CATEGORIES).map((cat) => (
        <Text
          key={cat.id}
          style={[legendStyles.pill, { backgroundColor: cat.bgColor, color: cat.color }]}
          onPress={onRuleTap ? () => onRuleTap(cat.id) : undefined}
          suppressHighlighting
          numberOfLines={1}
        >
          {cat.emoji} {isAr ? cat.nameAr : cat.nameEn}
        </Text>
      ))}
    </View>
  );
}

const legendStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FAFAF9',
    borderTopWidth: 1,
    borderTopColor: '#E8D9BF',
  },
  pill: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

