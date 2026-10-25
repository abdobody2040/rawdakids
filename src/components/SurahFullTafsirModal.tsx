// Full Surah Tafsir Modal (قائمة تفسير السورة كاملة)
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
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { tafsirService, TafsirSource, TAFSIR_SOURCES } from '@/services/tafsirService';
import { audioService } from '@/services/audioService';
import { Surah, Ayah } from '@/data/quranData';
import { Language } from '@/constants/i18n';

interface SurahFullTafsirModalProps {
  visible: boolean;
  surah: Surah;
  language: Language;
  onDismiss: () => void;
  onPlayAyah?: (ayahNumber: number) => void;
}

export default function SurahFullTafsirModal({
  visible,
  surah,
  language,
  onDismiss,
  onPlayAyah,
}: SurahFullTafsirModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isAr = language === 'ar';

  const [selectedSource, setSelectedSource] = useState<'muyassar' | 'saddi'>('muyassar');
  const [tafsirMap, setTafsirMap] = useState<Record<number, string>>({});
  const [loadingAyahs, setLoadingAyahs] = useState<Record<number, boolean>>({});
  const [playingAyahNum, setPlayingAyahNum] = useState<number | null>(null);

  // Stop any audio when dismissed
  useEffect(() => {
    if (!visible) {
      audioService.stopDua();
      setPlayingAyahNum(null);
    }
  }, [visible]);

  // Load tafsir for each ayah in surah
  useEffect(() => {
    if (!visible || !surah?.ayahs) return;

    let isCurrent = true;

    // Pre-populate with bundled simpleTafsir if available
    const initialMap: Record<number, string> = {};
    surah.ayahs.forEach((a) => {
      if (a.simpleTafsir && !a.simpleTafsir.startsWith('آية مباركة')) {
        initialMap[a.number] = a.simpleTafsir;
      }
    });
    setTafsirMap(initialMap);

    // Fetch official Tafsir text for all verses asynchronously
    surah.ayahs.forEach(async (ayah) => {
      try {
        setLoadingAyahs((prev) => ({ ...prev, [ayah.number]: true }));
        const res = await tafsirService.getAyahTafsir(surah.number, ayah.number, selectedSource);
        if (isCurrent && res && res.text) {
          setTafsirMap((prev) => ({ ...prev, [ayah.number]: res.text }));
        }
      } catch {
        // Fallback remains the bundled simpleTafsir
      } finally {
        if (isCurrent) {
          setLoadingAyahs((prev) => ({ ...prev, [ayah.number]: false }));
        }
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [visible, surah.number, selectedSource]);

  if (!visible) return null;

  const currentSourceInfo: TafsirSource = TAFSIR_SOURCES[selectedSource];

  const handlePlayTafsirAudio = async (ayahNumber: number, textToRead: string) => {
    if (playingAyahNum === ayahNumber) {
      await audioService.stopDua();
      setPlayingAyahNum(null);
      return;
    }

    setPlayingAyahNum(ayahNumber);
    await audioService.playDua(textToRead, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setPlayingAyahNum(null);
      }
    });
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
        />

        <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          {/* Header */}
          <View style={[styles.headerRow, isAr && { flexDirection: 'row-reverse' }]}>
            <View style={{ flex: 1 }}>
              <View style={[styles.titleBadgeRow, isAr && { flexDirection: 'row-reverse' }]}>
                <Text style={{ fontSize: 20 }}>📖</Text>
                <Text style={styles.modalTitle}>
                  {isAr ? `تفسير سورة ${surah.nameArabic} كاملة` : `Full Tafsir of Surah ${surah.nameTransliteration}`}
                </Text>
              </View>
              <Text style={[styles.modalSubtitle, isAr && { textAlign: 'right' }]}>
                {isAr
                  ? `تفسير جميع آيات السورة (${surah.ayahCount} آيات) بأسلوب مبسط وموثوق`
                  : `Tafsir of all ${surah.ayahCount} verses in easy, authentic style`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onDismiss}
              accessibilityLabel="إغلاق"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Tafsir Source Selector (Al-Muyassar vs As-Sa'di) */}
          <View style={[styles.sourceSelectorRow, isAr && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              style={[
                styles.sourceChip,
                selectedSource === 'muyassar' && styles.sourceChipActive,
                isAr && { flexDirection: 'row-reverse' },
              ]}
              onPress={() => setSelectedSource('muyassar')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="book"
                size={14}
                color={selectedSource === 'muyassar' ? '#FFFFFF' : '#047857'}
              />
              <Text
                style={[
                  styles.sourceChipText,
                  selectedSource === 'muyassar' && styles.sourceChipTextActive,
                ]}
              >
                {isAr ? 'التَّفْسِيرُ الْمُيَسَّرُ (المعتمد)' : 'Al-Muyassar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sourceChip,
                selectedSource === 'saddi' && styles.sourceChipActive,
                isAr && { flexDirection: 'row-reverse' },
              ]}
              onPress={() => setSelectedSource('saddi')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="school"
                size={14}
                color={selectedSource === 'saddi' ? '#FFFFFF' : '#B45309'}
              />
              <Text
                style={[
                  styles.sourceChipText,
                  selectedSource === 'saddi' && styles.sourceChipTextActive,
                ]}
              >
                {isAr ? 'تَفْسِيرُ السَّعْدِيِّ' : 'As-Sa’di'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Source Attribution Ribbon */}
          <View style={[styles.attributionBanner, isAr && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="ribbon-outline" size={15} color="#059669" />
            <Text style={styles.attributionText}>
              {currentSourceInfo.nameArabic} — {currentSourceInfo.authorArabic}
            </Text>
          </View>

          {/* Scrollable list of all verses & their tafsir */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {surah.ayahs.map((ayah) => {
              const tafsirText = tafsirMap[ayah.number] || ayah.simpleTafsir;
              const isLoading = loadingAyahs[ayah.number] && !tafsirMap[ayah.number];
              const isPlaying = playingAyahNum === ayah.number;

              return (
                <View key={ayah.number} style={styles.ayahTafsirCard}>
                  {/* Ayah Header Row */}
                  <View style={[styles.ayahCardHeader, isAr && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.ayahNumBadge}>
                      <Text style={styles.ayahNumText}>{ayah.number}</Text>
                    </View>

                    <Text style={styles.ayahVerseLabel}>
                      {isAr ? `الآية الكريمة (${ayah.number})` : `Verse ${ayah.number}`}
                    </Text>

                    <View style={{ flex: 1 }} />

                    {/* Audio Listen Button */}
                    <TouchableOpacity
                      style={[
                        styles.listenAudioBtn,
                        isPlaying && styles.listenAudioBtnActive,
                        isAr && { flexDirection: 'row-reverse' },
                      ]}
                      onPress={() => handlePlayTafsirAudio(ayah.number, tafsirText)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isPlaying ? 'pause' : 'volume-high'}
                        size={14}
                        color={isPlaying ? '#FFFFFF' : '#059669'}
                      />
                      <Text style={[styles.listenAudioBtnText, isPlaying && styles.listenAudioBtnTextActive]}>
                        {isPlaying ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'استمع للتفسير' : 'Listen')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Quranic Text */}
                  <View style={styles.quranTextBox}>
                    <Text style={styles.quranText}>
                      « {ayah.textUthmani} »
                    </Text>
                  </View>

                  {/* Tafsir Text */}
                  <View style={styles.tafsirTextBox}>
                    <View style={[styles.tafsirLabelRow, isAr && { flexDirection: 'row-reverse' }]}>
                      <Text style={{ fontSize: 13 }}>💡</Text>
                      <Text style={styles.tafsirLabelTitle}>
                        {isAr ? 'بيان المعنى والتفسير:' : 'Tafsir & Meaning:'}
                      </Text>
                    </View>

                    {isLoading ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 }}>
                        <ActivityIndicator size="small" color="#059669" />
                        <Text style={{ fontSize: 13, color: '#6B7280' }}>
                          جاري تحميل التفسير...
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.tafsirBodyText, isAr && { textAlign: 'right' }]}>
                        {tafsirText}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Close Button */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onDismiss}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.doneBtnText}>
                {isAr ? 'تم، العودة إلى المصحف' : 'Done, Return to Mushaf'}
              </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    width: '100%',
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  modalCardDesktop: {
    maxWidth: 720,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourceChipActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  sourceChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  sourceChipTextActive: {
    color: '#FFFFFF',
  },
  attributionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: SPACING.lg,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  attributionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: 12,
  },
  ayahTafsirCard: {
    backgroundColor: '#FAFAF9',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    padding: SPACING.md,
    gap: 8,
  },
  ayahCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ayahNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ayahVerseLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  listenAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  listenAudioBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  listenAudioBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  listenAudioBtnTextActive: {
    color: '#FFFFFF',
  },
  quranTextBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  quranText: {
    fontFamily: 'AmiriQuran-Regular',
    fontSize: 20,
    lineHeight: 36,
    color: '#064E3B',
    textAlign: 'center',
  },
  tafsirTextBox: {
    backgroundColor: '#FFFDF5',
    borderRadius: RADIUS.md,
    padding: 10,
    borderLeftWidth: 3.5,
    borderLeftColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 4,
  },
  tafsirLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tafsirLabelTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  tafsirBodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1F2937',
  },
  footerRow: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: RADIUS.full,
    ...SHADOWS.soft,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
