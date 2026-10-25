// Ayah Tafsir Bottom Sheet (A4.1)
// Displays Tafsir Al-Muyassar and Tafsir As-Sa'di with offline caching
// Navigation: "السَّابِقَةُ / التَّالِيَةُ", Recitation listen button, accessible text >=18px

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { tafsirService, TafsirSource, TAFSIR_SOURCES } from '@/services/tafsirService';
import { audioService } from '@/services/audioService';
import { rawdaAnalytics } from '@/services/rawdaAnalyticsService';

interface AyahTafsirSheetProps {
  visible: boolean;
  surahNumber: number;
  surahNameArabic: string;
  ayahNumber: number;
  totalAyahs: number;
  ayahText?: string;
  onDismiss: () => void;
  onSelectAyah: (ayahNo: number) => void;
}

export default function AyahTafsirSheet({
  visible,
  surahNumber,
  surahNameArabic,
  ayahNumber,
  totalAyahs,
  ayahText,
  onDismiss,
  onSelectAyah,
}: AyahTafsirSheetProps) {
  const [selectedSource, setSelectedSource] = useState<'muyassar' | 'saddi'>('muyassar');
  const [tafsirText, setTafsirText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlayingRecitation, setIsPlayingRecitation] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      audioService.stopDua();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    rawdaAnalytics.logEvent('tafsir_opened', {
      surah: surahNumber,
      ayah: ayahNumber,
      source: selectedSource,
    });

    let isCurrent = true;

    tafsirService
      .getAyahTafsir(surahNumber, ayahNumber, selectedSource)
      .then((res) => {
        if (isCurrent) {
          setTafsirText(res.text);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setTafsirText('يَحْتَاجُ إِنْتَرْنِتْ لتحميل التفسير.');
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [visible, surahNumber, ayahNumber, selectedSource]);

  if (!visible) return null;

  const currentSourceInfo: TafsirSource = TAFSIR_SOURCES[selectedSource];

  const handleToggleRecitation = async () => {
    if (isPlayingRecitation) {
      await audioService.stopDua();
      setIsPlayingRecitation(false);
    } else {
      setIsPlayingRecitation(true);
      // Play ayah audio with fallback
      const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${String(surahNumber).padStart(3, '0')}${String(ayahNumber).padStart(3, '0')}.mp3`;
      try {
        await audioService.playDua(audioUrl, () => {
          setIsPlayingRecitation(false);
        });
      } catch {
        setIsPlayingRecitation(false);
      }
    }
  };

  const handlePrev = () => {
    if (ayahNumber > 1) {
      onSelectAyah(ayahNumber - 1);
    }
  };

  const handleNext = () => {
    if (ayahNumber < totalAyahs) {
      onSelectAyah(ayahNumber + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onDismiss}
          accessibilityLabel="إغلاق التفسير"
        />

        <View style={styles.sheetContainer}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Top Title & Close */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onDismiss}
              accessibilityLabel="إغلاق"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <View style={styles.titleWrap}>
              <Text style={styles.sheetTitle}>تَفْسِيرُ الْآيَةِ</Text>
              <Text style={styles.sheetSubtitle}>
                سُورَةُ {surahNameArabic} - الْآيَةُ {ayahNumber} مِنْ {totalAyahs}
              </Text>
            </View>

            {/* Recitation Listen Button */}
            <TouchableOpacity
              style={[
                styles.listenBtn,
                isPlayingRecitation && styles.listenBtnPlaying,
              ]}
              onPress={handleToggleRecitation}
              accessibilityLabel={isPlayingRecitation ? "إيقاف التلاوة" : "استمع للآية"}
              accessibilityRole="button"
            >
              <Ionicons
                name={isPlayingRecitation ? "pause" : "volume-medium"}
                size={22}
                color={isPlayingRecitation ? '#FFFFFF' : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Ayah Snippet if provided */}
          {ayahText ? (
            <View style={styles.ayahBox}>
              <Text style={styles.ayahText} numberOfLines={3}>
                « {ayahText} »
              </Text>
            </View>
          ) : null}

          {/* Tafsir Source Switcher (Al-Muyassar vs As-Sa'di) */}
          <View style={styles.sourceSelectorRow}>
            <TouchableOpacity
              style={[
                styles.sourceChip,
                selectedSource === 'muyassar' && styles.sourceChipActive,
              ]}
              onPress={() => setSelectedSource('muyassar')}
              accessibilityRole="button"
              accessibilityLabel="التفسير الميسر"
            >
              <Ionicons
                name="book-outline"
                size={16}
                color={selectedSource === 'muyassar' ? '#FFFFFF' : COLORS.text}
              />
              <Text
                style={[
                  styles.sourceChipText,
                  selectedSource === 'muyassar' && styles.sourceChipTextActive,
                ]}
              >
                التَّفْسِيرُ الْمُيَسَّرُ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sourceChip,
                selectedSource === 'saddi' && styles.sourceChipActive,
              ]}
              onPress={() => setSelectedSource('saddi')}
              accessibilityRole="button"
              accessibilityLabel="تفسير السعدي"
            >
              <Ionicons
                name="school-outline"
                size={16}
                color={selectedSource === 'saddi' ? '#FFFFFF' : COLORS.text}
              />
              <Text
                style={[
                  styles.sourceChipText,
                  selectedSource === 'saddi' && styles.sourceChipTextActive,
                ]}
              >
                تَفْسِيرُ السَّعْدِيِّ
              </Text>
            </TouchableOpacity>
          </View>

          {/* Source Attribution Header */}
          <View style={styles.authorBadge}>
            <Ionicons name="ribbon-outline" size={16} color={COLORS.primary} />
            <Text style={styles.authorText}>
              {currentSourceInfo.nameArabic} — {currentSourceInfo.authorArabic}
            </Text>
          </View>

          {/* Tafsir Content Body (Scrollable, text >= 18px) */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>جَارٍ تَحْمِيلُ التَّفْسِيرِ الْمُبَارَكِ...</Text>
              </View>
            ) : (
              <Text style={styles.tafsirBodyText}>
                {tafsirText}
              </Text>
            )}
          </ScrollView>

          {/* Stepper Navigation: السَّابِقَةُ / التَّالِيَةُ */}
          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                ayahNumber >= totalAyahs && styles.navBtnDisabled,
              ]}
              onPress={handleNext}
              disabled={ayahNumber >= totalAyahs}
              accessibilityLabel="الآية التالية"
              accessibilityRole="button"
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={ayahNumber >= totalAyahs ? '#9CA3AF' : COLORS.primary}
              />
              <Text
                style={[
                  styles.navBtnText,
                  ayahNumber >= totalAyahs && styles.navBtnTextDisabled,
                ]}
              >
                التَّالِيَةُ
              </Text>
            </TouchableOpacity>

            <View style={styles.navCounter}>
              <Text style={styles.navCounterText}>
                {ayahNumber} / {totalAyahs}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.navBtn,
                ayahNumber <= 1 && styles.navBtnDisabled,
              ]}
              onPress={handlePrev}
              disabled={ayahNumber <= 1}
              accessibilityLabel="الآية السابقة"
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.navBtnText,
                  ayahNumber <= 1 && styles.navBtnTextDisabled,
                ]}
              >
                السَّابِقَةُ
              </Text>
              <Ionicons
                name="chevron-back"
                size={22}
                color={ayahNumber <= 1 ? '#9CA3AF' : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
    minHeight: 460,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.medium,
  },
  handleBar: {
    width: 48,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
  },
  titleWrap: {
    alignItems: 'center',
    flex: 1,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenBtnPlaying: {
    backgroundColor: COLORS.primary,
  },
  ayahBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    borderRightWidth: 4,
    borderRightColor: COLORS.secondary,
  },
  ayahText: {
    fontSize: 19,
    color: COLORS.text,
    textAlign: 'right',
    lineHeight: 32,
  },
  sourceSelectorRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  sourceChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: '#F3F4F6',
    minHeight: 48,
  },
  sourceChipActive: {
    backgroundColor: COLORS.primary,
  },
  sourceChipText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  sourceChipTextActive: {
    color: '#FFFFFF',
  },
  authorBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    marginVertical: 4,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  scrollBody: {
    flex: 1,
    marginVertical: SPACING.xs,
  },
  scrollContent: {
    paddingVertical: SPACING.sm,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  tafsirBodyText: {
    fontSize: 18,
    color: COLORS.text,
    lineHeight: 32,
    textAlign: 'right',
  },
  navigationBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    backgroundColor: '#F3F4F6',
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  navBtnTextDisabled: {
    color: '#9CA3AF',
  },
  navCounter: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  navCounterText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
});
