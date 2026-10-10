// Ayah-by-Ayah Player Screen (Q1, Q2, Q3, Q4, Q5, Q10, Q11, Q13)
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { quranService } from '@/services/quranService';
import { audioService } from '@/services/audioService';
import { useAppStore, HifzStatus } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import { Ayah } from '@/data/quranData';
import Header from '@/components/Header';
import AudioPlayerBar from '@/components/AudioPlayerBar';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import SurahStoryModal from '@/components/SurahStoryModal';
import AyahTafsirModal from '@/components/AyahTafsirModal';
import WordMeaningBubbleModal from '@/components/WordMeaningBubbleModal';
import { quranWordsService } from '@/services/quranWordsService';
import { WordMeaning } from '@/data/quranWordsData';

export default function SurahDetailScreen() {
  const { surahId } = useLocalSearchParams();
  const surahNumber = parseInt(String(surahId || '1'), 10);

  const {
    language,
    surahProgress,
    setAyahStatus,
    addSurahStars,
    parentSettings,
    downloadedSurahs,
    setSurahDownloaded,
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const [surah, setSurah] = useState(() => quranService.getSurahSync(surahNumber));

  useEffect(() => {
    let isMounted = true;
    quranService
      .getSurah(surahNumber, parentSettings.translationSource)
      .then((data) => {
        if (isMounted && data) {
          setSurah(data);
        }
      })
      .catch(() => {
        // safely falls back to sync initialized data
      });
    return () => {
      isMounted = false;
    };
  }, [surahNumber, parentSettings.translationSource]);

  const [activeAyahNum, setActiveAyahNum] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [currentRepeatCycle, setCurrentRepeatCycle] = useState<number>(1);

  const repeatCountRef = useRef<number>(1);
  const currentRepeatCycleRef = useRef<number>(1);
  const activeAyahNumRef = useRef<number>(1);
  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);

  useEffect(() => {
    currentRepeatCycleRef.current = currentRepeatCycle;
  }, [currentRepeatCycle]);

  useEffect(() => {
    activeAyahNumRef.current = activeAyahNum;
  }, [activeAyahNum]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);
  const [playingTafsirAyahNum, setPlayingTafsirAyahNum] = useState<number | null>(null);

  // Per-user toggles
  const [showTafsir, setShowTafsir] = useState<boolean>(
    parentSettings.showSimpleTafsir !== undefined ? parentSettings.showSimpleTafsir : true
  );

  // Word-by-word tap meaning
  const [selectedWordMeaning, setSelectedWordMeaning] = useState<WordMeaning | null>(null);
  const [wordAyahNumber, setWordAyahNumber] = useState<number | undefined>(undefined);

  // Offline Audio Download
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const isDownloaded = !!downloadedSurahs[surahNumber];

  const scrollViewRef = useRef<ScrollView>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audioService.stop();
      audioService.stopDua();
    };
  }, []);

  const handlePlayTafsir = async (ayahNumber: number, tafsirText: string) => {
    if (playingTafsirAyahNum === ayahNumber) {
      await audioService.stopDua();
      setPlayingTafsirAyahNum(null);
      return;
    }
    if (isPlaying) {
      await audioService.pause();
      setIsPlaying(false);
    }
    setPlayingTafsirAyahNum(ayahNumber);
    await audioService.playDua(tafsirText, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setPlayingTafsirAyahNum(null);
      }
    });
  };

  const handleWordTap = (rawWord: string, ayah: Ayah) => {
    const meaning = quranWordsService.getWordMeaning(rawWord, ayah.simpleTafsir);
    setSelectedWordMeaning(meaning);
    setWordAyahNumber(ayah.number);
  };

  const handleToggleDownload = async () => {
    if (isDownloaded) {
      setSurahDownloaded(surahNumber, false);
      return;
    }
    setIsDownloading(true);
    setDownloadProgress(0);
    const success = await quranService.downloadSurahAudio(
      parentSettings.reciterId,
      surahNumber,
      surah.ayahCount,
      (prog) => setDownloadProgress(prog)
    );
    setIsDownloading(false);
    if (success) {
      setSurahDownloaded(surahNumber, true);
    }
  };

  const playAyahAudio = async (ayahNumber: number, repeatCycle: number = 1) => {
    setActiveAyahNum(ayahNumber);
    activeAyahNumRef.current = ayahNumber;

    setCurrentRepeatCycle(repeatCycle);
    currentRepeatCycleRef.current = repeatCycle;

    const audioUrl = quranService.getAudioUrl(
      parentSettings.reciterId,
      surah.number,
      ayahNumber
    );

    setIsPlaying(true);
    isPlayingRef.current = true;

    await audioService.playAyah(audioUrl, speed, (status) => {
      if (status.didJustFinish) {
        const targetRepeat = repeatCountRef.current;
        const currentCycle = currentRepeatCycleRef.current;

        // Repeat mode: repeat the same ayah until currentCycle reaches targetRepeat
        if (currentCycle < targetRepeat) {
          playAyahAudio(ayahNumber, currentCycle + 1);
        } else if (ayahNumber < surah.ayahs.length) {
          // Move to next ayah with repeat cycle reset to 1
          playAyahAudio(ayahNumber + 1, 1);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
          // Reached end of surah! Award stars
          addSurahStars(surah.number, 3);
          setShowCelebration(true);
        }
      } else if (status.isPlaying !== undefined) {
        setIsPlaying(status.isPlaying);
        isPlayingRef.current = status.isPlaying;
      }
    });
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioService.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      await playAyahAudio(activeAyahNumRef.current, currentRepeatCycleRef.current);
    }
  };

  const handleNextAyah = () => {
    if (activeAyahNum < surah.ayahs.length) {
      playAyahAudio(activeAyahNum + 1, 1);
    }
  };

  const handlePrevAyah = () => {
    if (activeAyahNum > 1) {
      playAyahAudio(activeAyahNum - 1, 1);
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    await audioService.setRate(newSpeed);
  };

  const toggleAyahHifzStatus = (ayahNumber: number) => {
    const currentStatus =
      surahProgress[surah.number]?.ayahsStatus?.[ayahNumber] || 'new';
    let nextStatus: HifzStatus = 'new';
    if (currentStatus === 'new') nextStatus = 'learning';
    else if (currentStatus === 'learning') nextStatus = 'memorized';
    else nextStatus = 'new';

    setAyahStatus(surah.number, ayahNumber, nextStatus);

    if (nextStatus === 'memorized') {
      addSurahStars(surah.number, 1);
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        fallbackRoute="/quran"
        title={language === 'ar' ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
      />

      {/* Surah Header Card with Story Button */}
      <View style={styles.topCard}>
        <View style={styles.topCardRow}>
          <View>
            <Text style={styles.surahTitleArabic}>
              {language === 'ar' ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
            </Text>
            <Text style={styles.surahSubtitle}>
              {language === 'ar'
                ? `${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • ${surah.ayahCount} ${t.ayahs}`
                : `${surah.nameArabic} • ${surah.nameEnglish} • ${surah.revelationType} • ${surah.ayahCount} ${t.ayahs}`}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {/* Offline Download Button */}
            <TouchableOpacity
              style={[styles.downloadBtn, isDownloaded && styles.downloadBtnActive]}
              onPress={handleToggleDownload}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isDownloading ? 'sync' : isDownloaded ? 'checkmark-circle' : 'cloud-download-outline'}
                size={14}
                color={isDownloaded ? COLORS.success : '#0d9488'}
              />
              <Text style={[styles.downloadBtnText, isDownloaded && { color: COLORS.success }]}>
                {isDownloading
                  ? `${downloadProgress}%`
                  : isDownloaded
                  ? language === 'ar'
                    ? 'بدون نت'
                    : 'Offline'
                  : language === 'ar'
                  ? 'تحميل'
                  : 'Download'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.storyCardBtn}
              onPress={() => setShowStoryModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={16} color={COLORS.secondaryDark} />
              <Text style={styles.storyCardBtnText}>{t.surahStory}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Toggles Row */}
        <View style={styles.togglesRow}>
          <TouchableOpacity
            style={[styles.toggleChip, showTafsir && styles.toggleChipActive]}
            onPress={() => setShowTafsir(!showTafsir)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={showTafsir ? 'checkmark' : 'add'}
              size={14}
              color={showTafsir ? COLORS.primaryDark : COLORS.textSecondary}
            />
            <Text
              style={[styles.toggleChipText, showTafsir && styles.toggleChipTextActive]}
            >
              {language === 'ar' ? 'التفسير الميسر' : 'Meaning & Reflection'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ayahs List */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.ayahsContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Bismillah Header (except for Surah 9 / At-Tawbah if applicable) */}
        {surah.number !== 1 && (
          <View style={styles.bismillahBanner}>
            <Text style={styles.bismillahText}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
          </View>
        )}

        {surah.ayahs.map((ayah) => {
          const isActive = ayah.number === activeAyahNum;
          const status =
            surahProgress[surah.number]?.ayahsStatus?.[ayah.number] || 'new';

          return (
            <TouchableOpacity
              key={ayah.number}
              style={[styles.ayahCard, isActive && styles.ayahCardActive]}
              onPress={() => playAyahAudio(ayah.number, 1)}
              activeOpacity={0.9}
            >
              {/* Ayah Header Row */}
              <View style={[styles.ayahHeaderRow, language === 'ar' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.ayahNumberBadge}>
                  <Text style={styles.ayahNumberText}>{ayah.number}</Text>
                </View>

                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {/* Active Repeat Badge for Kids */}
                  {isActive && isPlaying && repeatCount > 1 && (
                    <View style={[styles.ayahRepeatBadge, language === 'ar' && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="repeat" size={12} color="#047857" />
                      <Text style={styles.ayahRepeatBadgeText}>
                        {language === 'ar'
                          ? `تكرار ${currentRepeatCycle} من ${repeatCount}`
                          : `Loop ${currentRepeatCycle}/${repeatCount}`}
                      </Text>
                    </View>
                  )}

                  {/* Quick Tafsir Modal Button */}
                  <TouchableOpacity
                    style={[styles.ayahTafsirBtn, language === 'ar' && { flexDirection: 'row-reverse' }]}
                    onPress={() => setSelectedTafsirAyah(ayah)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="bulb-outline" size={14} color="#b45309" />
                    <Text style={styles.ayahTafsirBtnText}>
                      {language === 'ar' ? 'تفسير الآية' : 'Tafsir'}
                    </Text>
                  </TouchableOpacity>

                  {/* Hifz Status Button */}
                  <TouchableOpacity
                    style={[
                      styles.hifzStatusBtn,
                      status === 'memorized' && styles.hifzMemorized,
                      status === 'learning' && styles.hifzLearning,
                    ]}
                    onPress={() => toggleAyahHifzStatus(ayah.number)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={
                        status === 'memorized'
                          ? 'checkmark-circle'
                          : status === 'learning'
                          ? 'time'
                          : 'bookmark-outline'
                      }
                      size={14}
                      color={
                        status === 'memorized'
                          ? COLORS.success
                          : status === 'learning'
                          ? COLORS.warning
                          : COLORS.textMuted
                      }
                    />
                    <Text
                      style={[
                        styles.hifzStatusText,
                        status === 'memorized' && { color: COLORS.success },
                        status === 'learning' && { color: COLORS.warning },
                      ]}
                    >
                      {status === 'memorized'
                        ? t.statusMemorized
                        : status === 'learning'
                        ? t.statusLearning
                        : t.statusNew}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Uthmani Quran Text (with tap-to-learn word-by-word) */}
              <Text style={styles.uthmaniText}>
                {ayah.textUthmani.trim().split(/\s+/).map((word, wIdx) => (
                  <Text
                    key={wIdx}
                    style={styles.uthmaniWord}
                    onPress={() => handleWordTap(word, ayah)}
                  >
                    {word}{' '}
                  </Text>
                ))}
              </Text>

              {/* Simple Tafsir Line */}
              {/* Ayah Meaning / Tafsir Box */}
              {showTafsir && (
                <View
                  style={[
                    styles.tafsirContainer,
                    playingTafsirAyahNum === ayah.number && styles.tafsirContainerPlaying,
                  ]}
                >
                  <View
                    style={[
                      styles.tafsirHeaderRow,
                      language === 'ar' && { flexDirection: 'row-reverse' },
                    ]}
                  >
                    <View
                      style={[
                        styles.tafsirLabelRow,
                        language === 'ar' && { flexDirection: 'row-reverse' },
                      ]}
                    >
                      <Text style={{ fontSize: 15 }}>💡</Text>
                      <Text style={styles.tafsirLabel}>
                        {language === 'ar' ? 'التفسير الميسر' : 'Meaning & Reflection'}
                      </Text>
                    </View>

                    {language === 'ar' && (
                      <TouchableOpacity
                        style={[
                          styles.tafsirAudioBtn,
                          playingTafsirAyahNum === ayah.number && styles.tafsirAudioBtnActive,
                          { flexDirection: 'row-reverse' },
                        ]}
                        onPress={(e) => {
                          e.stopPropagation?.();
                          handlePlayTafsir(ayah.number, ayah.simpleTafsir);
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={
                            playingTafsirAyahNum === ayah.number
                              ? 'pause-circle'
                              : 'volume-high'
                          }
                          size={15}
                          color={
                            playingTafsirAyahNum === ayah.number
                              ? '#ffffff'
                              : '#b45309'
                          }
                        />
                        <Text
                          style={[
                            styles.tafsirAudioBtnText,
                            playingTafsirAyahNum === ayah.number &&
                              styles.tafsirAudioBtnTextActive,
                          ]}
                        >
                          {playingTafsirAyahNum === ayah.number ? 'إيقاف' : 'استمع للتفسير'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.tafsirText,
                      language === 'ar' && { textAlign: 'right' },
                    ]}
                  >
                    {language === 'ar' ? ayah.simpleTafsir : ayah.translationEn}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Floating Audio Player Bar */}
      <AudioPlayerBar
        isPlaying={isPlaying}
        activeAyahNumber={activeAyahNum}
        totalAyahs={surah.ayahs.length}
        speed={speed}
        repeatCount={repeatCount}
        currentRepeatCycle={currentRepeatCycle}
        onPlayPause={handlePlayPause}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onSpeedChange={handleSpeedChange}
        onRepeatChange={(newRepeat) => {
          setRepeatCount(newRepeat);
          repeatCountRef.current = newRepeat;
        }}
      />

      {/* Surah Story & Tadabbur Modal (Q10) */}
      <SurahStoryModal
        visible={showStoryModal}
        surah={surah}
        language={language}
        onDismiss={() => setShowStoryModal(false)}
        onStartReciting={() => {
          setShowStoryModal(false);
          if (!isPlaying) {
            handlePlayPause();
          }
        }}
      />

      {/* Interactive Ayah Tafsir Modal */}
      <AyahTafsirModal
        visible={!!selectedTafsirAyah}
        surah={surah}
        ayah={selectedTafsirAyah}
        language={language}
        onDismiss={() => setSelectedTafsirAyah(null)}
        onUnderstood={() => {
          addSurahStars(surah.number, 1);
          setShowCelebration(true);
        }}
      />

      {/* Star Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={2}
        gemsEarned={4}
        title={t.congratulations}
        subtitle={
          language === 'ar'
            ? `ما شاء الله! تقدمت في سورة ${surah.nameArabic}`
            : `Masha’Allah! Great progress in Surah ${surah.nameTransliteration}`
        }
        onDismiss={() => setShowCelebration(false)}
      />

      {/* Word-by-Word Kid Meaning Bubble Modal */}
      <WordMeaningBubbleModal
        visible={!!selectedWordMeaning}
        wordMeaning={selectedWordMeaning}
        ayahNumber={wordAyahNumber}
        onClose={() => setSelectedWordMeaning(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
  },
  topCard: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  topCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.xs,
  },
  surahTitleArabic: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  surahSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  storyCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  storyCardBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e6f7f3',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  downloadBtnActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#6ee7b7',
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0d9488',
  },
  uthmaniWord: {
    color: COLORS.text,
  },
  togglesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 4,
  },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  toggleChipActive: {
    backgroundColor: COLORS.primaryLight + '33',
  },
  toggleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  toggleChipTextActive: {
    color: COLORS.primaryDark,
  },
  ayahsContainer: {
    padding: SPACING.md,
    paddingBottom: 160,
    gap: SPACING.md,
  },
  bismillahBanner: {
    backgroundColor: COLORS.quranGarden.light,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.quranGarden.accent + '44',
  },
  bismillahText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
    fontFamily: 'System',
  },
  ayahCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  ayahCardActive: {
    borderColor: COLORS.quranBorderActive,
    backgroundColor: COLORS.quranActiveAyah,
    ...SHADOWS.glow(COLORS.quranBorderActive),
  },
  ayahHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ayahNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.quranGarden.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
  },
  hifzStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  hifzMemorized: {
    backgroundColor: COLORS.successLight,
  },
  hifzLearning: {
    backgroundColor: COLORS.warningLight,
  },
  hifzStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  uthmaniText: {
    fontSize: TYPOGRAPHY.quranSize,
    lineHeight: TYPOGRAPHY.quranLineHeight,
    color: COLORS.quranText,
    textAlign: 'center',
    marginVertical: SPACING.xs,
    fontFamily: 'System',
    fontWeight: '600',
  },
  ayahTafsirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  ayahTafsirBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
  },
  ayahRepeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  ayahRepeatBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065f46',
  },
  tafsirContainer: {
    backgroundColor: '#fffdf4',
    padding: SPACING.md - 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    borderLeftWidth: 3.5,
    borderLeftColor: '#f59e0b',
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  tafsirContainerPlaying: {
    backgroundColor: '#fef9e7',
    borderColor: '#f59e0b',
    ...SHADOWS.soft,
  },
  tafsirHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tafsirLabelRow: {
    alignItems: 'center',
    gap: 6,
  },
  tafsirLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400e',
  },
  tafsirAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tafsirAudioBtnActive: {
    backgroundColor: '#d97706',
    borderColor: '#b45309',
  },
  tafsirAudioBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
  },
  tafsirAudioBtnTextActive: {
    color: '#ffffff',
  },
  tafsirText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    fontWeight: '600',
  },
  translationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: 4,
  },
  translationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  storyIconBox: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  storyIntroText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginVertical: SPACING.xs,
  },
  lessonItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: 4,
  },
  lessonItemText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  closeStoryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  closeStoryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});
