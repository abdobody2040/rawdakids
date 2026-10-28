// Listen & Repeat: Advanced Memorization & Recitation Mode (وضع التسميع والحفظ المتقدم)
// Full Surah Mode & Single Ayah Mode · Proper RTL Arabic word ordering · Progressive hiding · Surah switcher
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  Platform,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { quranService } from '@/services/quranService';
import { audioService } from '@/services/audioService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { SurahMeta } from '@/data/quranData';

type HidePercentage = 0 | 25 | 50 | 100;
type ViewMode = 'full_surah' | 'single_ayah';

export default function ListenAndRepeatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialSurahNumber = parseInt(String(params.surahId || '112'), 10);

  const { language, setAyahStatus, addSurahStars, parentSettings, addStars } = useAppStore();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  // Active Surah State
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(initialSurahNumber);
  const [showSurahModal, setShowSurahModal] = useState<boolean>(false);
  const [surahSearchQuery, setSurahSearchQuery] = useState<string>('');

  // Mode: Full Surah (السورة كاملة للتسميع) vs Single Ayah (آية واحدة للتركيز)
  const [viewMode, setViewMode] = useState<ViewMode>('full_surah');

  // Load current Surah
  const surah = useMemo(() => {
    return quranService.getSurahSync(selectedSurahNum) || quranService.getSurahSync(112);
  }, [selectedSurahNum]);

  // Ayah navigation in single-ayah mode
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);

  // Progressive Word Hiding percentage (0%, 25%, 50%, 100%)
  const [hidePercentage, setHidePercentage] = useState<HidePercentage>(0);
  // Store revealed word keys: `${ayahIdx}_${hidePercentage}_${wordIdx}`
  const [revealedWords, setRevealedWords] = useState<Record<string, boolean>>({});

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingAyahIdx, setPlayingAyahIdx] = useState<number | null>(null);
  const [isFullSurahPlaying, setIsFullSurahPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeatCycle, setCurrentRepeatCycle] = useState(1);

  // Celebration Modal
  const [showCelebration, setShowCelebration] = useState(false);

  const repeatCountRef = useRef(3);
  const currentRepeatCycleRef = useRef(1);
  const isFullSurahPlayingRef = useRef(false);
  const activePlayingAyahIdxRef = useRef<number | null>(null);

  useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);

  useEffect(() => {
    currentRepeatCycleRef.current = currentRepeatCycle;
  }, [currentRepeatCycle]);

  // Stop audio on unmount or surah change
  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, [selectedSurahNum]);

  const currentAyah = surah.ayahs[currentAyahIdx] || surah.ayahs[0];

  // Helper to split Ayah text into words
  const getAyahWords = (textUthmani: string) => {
    return textUthmani.trim().split(/\s+/).filter(Boolean);
  };

  const isWordInitiallyHidden = (wordIdx: number): boolean => {
    if (hidePercentage === 0) return false;
    if (hidePercentage === 100) return true;
    if (hidePercentage === 50) return wordIdx % 2 === 1;
    if (hidePercentage === 25) return wordIdx % 4 === 1;
    return false;
  };

  const toggleWordReveal = (ayahIdx: number, wordIdx: number) => {
    const key = `${ayahIdx}_${hidePercentage}_${wordIdx}`;
    setRevealedWords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Reveal all words or hide all words
  const handleRevealAll = () => {
    const nextRevealed: Record<string, boolean> = {};
    surah.ayahs.forEach((ayah, aIdx) => {
      const words = getAyahWords(ayah.textUthmani);
      words.forEach((_, wIdx) => {
        nextRevealed[`${aIdx}_${hidePercentage}_${wIdx}`] = true;
      });
    });
    setRevealedWords(nextRevealed);
  };

  const handleResetHidden = () => {
    setRevealedWords({});
  };

  // Play a specific Ayah with repeat cycle
  const playAyahAudio = async (ayahIndex: number, repeatCycle: number = 1) => {
    if (ayahIndex < 0 || ayahIndex >= surah.ayahs.length) {
      setIsPlaying(false);
      setPlayingAyahIdx(null);
      setIsFullSurahPlaying(false);
      return;
    }

    const targetAyah = surah.ayahs[ayahIndex];
    setIsPlaying(true);
    setPlayingAyahIdx(ayahIndex);
    activePlayingAyahIdxRef.current = ayahIndex;
    setCurrentRepeatCycle(repeatCycle);
    currentRepeatCycleRef.current = repeatCycle;

    const audioUrl = quranService.getAudioUrl(
      parentSettings.reciterId,
      surah.number,
      targetAyah.number
    );

    await audioService.playAyah(audioUrl, 1.0, (status) => {
      if (status.error) {
        setIsPlaying(false);
        setPlayingAyahIdx(null);
        setIsFullSurahPlaying(false);
        return;
      }
      if (status.didJustFinish) {
        if (isFullSurahPlayingRef.current) {
          // In Full Surah playback mode: advance to the next Ayah
          const nextIdx = ayahIndex + 1;
          if (nextIdx < surah.ayahs.length) {
            playAyahAudio(nextIdx, 1);
          } else {
            setIsPlaying(false);
            setPlayingAyahIdx(null);
            setIsFullSurahPlaying(false);
            isFullSurahPlayingRef.current = false;
          }
        } else {
          // In Single Ayah repeat loop
          const targetRepeat = repeatCountRef.current;
          const currentCycle = currentRepeatCycleRef.current;
          if (currentCycle < targetRepeat) {
            playAyahAudio(ayahIndex, currentCycle + 1);
          } else {
            setIsPlaying(false);
            setPlayingAyahIdx(null);
          }
        }
      } else if (status.isPlaying !== undefined) {
        setIsPlaying(status.isPlaying);
      }
    });
  };

  // Play full Surah sequentially
  const handlePlayFullSurah = async () => {
    if (isPlaying && isFullSurahPlaying) {
      await audioService.pause();
      setIsPlaying(false);
      setIsFullSurahPlaying(false);
      isFullSurahPlayingRef.current = false;
    } else {
      isFullSurahPlayingRef.current = true;
      setIsFullSurahPlaying(true);
      playAyahAudio(0, 1);
    }
  };

  const handlePauseAudio = async () => {
    await audioService.pause();
    setIsPlaying(false);
    setIsFullSurahPlaying(false);
    isFullSurahPlayingRef.current = false;
  };

  const handleRestartAudio = async () => {
    await audioService.stop();
    if (viewMode === 'full_surah') {
      handlePlayFullSurah();
    } else {
      playAyahAudio(currentAyahIdx, 1);
    }
  };

  // Self check
  const handleSelfCheckYes = () => {
    if (viewMode === 'single_ayah') {
      setAyahStatus(surah.number, currentAyah.number, 'memorized');
      addStars(1);
      if (currentAyahIdx < surah.ayahs.length - 1) {
        setCurrentAyahIdx(currentAyahIdx + 1);
      } else {
        addSurahStars(surah.number, 3);
        setShowCelebration(true);
      }
    } else {
      // Completed full surah memorization test!
      surah.ayahs.forEach((a) => {
        setAyahStatus(surah.number, a.number, 'memorized');
      });
      addSurahStars(surah.number, 5);
      addStars(5);
      setShowCelebration(true);
    }
  };

  // All Surahs list for Switcher Modal
  const allSurahs = useMemo(() => quranService.getAllSurahs(), []);
  const filteredSurahs = useMemo(() => {
    if (!surahSearchQuery.trim()) return allSurahs;
    const q = surahSearchQuery.trim().toLowerCase();
    return allSurahs.filter(
      (s) =>
        s.nameArabic.includes(q) ||
        s.nameTransliteration.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [allSurahs, surahSearchQuery]);

  const selectNewSurah = (num: number) => {
    audioService.stop();
    setIsPlaying(false);
    setPlayingAyahIdx(null);
    setIsFullSurahPlaying(false);
    isFullSurahPlayingRef.current = false;
    setSelectedSurahNum(num);
    setCurrentAyahIdx(0);
    setRevealedWords({});
    setShowSurahModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        title={isAr ? `تسميع وحفظ سورة ${surah.nameArabic}` : `Recite Surah ${surah.nameTransliteration}`}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* SURAH PICKER & METADATA BAR */}
        <View style={styles.surahHeaderBar}>
          <TouchableOpacity
            style={styles.surahPickerButton}
            onPress={() => setShowSurahModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="book-outline" size={18} color="#065F46" />
            <Text style={styles.surahPickerText}>
              {isAr ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
            </Text>
            <View style={styles.surahPickerBadge}>
              <Text style={styles.surahPickerBadgeText}>
                {isAr ? `${surah.ayahs.length} آيات` : `${surah.ayahs.length} ayahs`}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#065F46" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changeSurahBtn}
            onPress={() => setShowSurahModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={14} color="#059669" />
            <Text style={styles.changeSurahBtnText}>{isAr ? 'تغيير السورة' : 'Change'}</Text>
          </TouchableOpacity>
        </View>

        {/* VIEW MODE SELECTOR: FULL SURAH vs SINGLE AYAH */}
        <View style={styles.viewModeTabs}>
          <TouchableOpacity
            style={[styles.viewModeTab, viewMode === 'full_surah' && styles.viewModeTabActive]}
            onPress={() => {
              setViewMode('full_surah');
              audioService.stop();
              setIsPlaying(false);
              setPlayingAyahIdx(null);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="newspaper-outline"
              size={18}
              color={viewMode === 'full_surah' ? '#FFFFFF' : '#065F46'}
            />
            <Text
              style={[
                styles.viewModeTabText,
                viewMode === 'full_surah' && styles.viewModeTabTextActive,
              ]}
            >
              {isAr ? '📜 عرض السورة كاملة (تسميع شامل)' : '📜 Full Surah (All Verses)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewModeTab, viewMode === 'single_ayah' && styles.viewModeTabActive]}
            onPress={() => {
              setViewMode('single_ayah');
              audioService.stop();
              setIsPlaying(false);
              setPlayingAyahIdx(null);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="scan-outline"
              size={18}
              color={viewMode === 'single_ayah' ? '#FFFFFF' : '#065F46'}
            />
            <Text
              style={[
                styles.viewModeTabText,
                viewMode === 'single_ayah' && styles.viewModeTabTextActive,
              ]}
            >
              {isAr ? '🎯 آية تلو الأخرى (تركيز وتكرار)' : '🎯 Verse by Verse (Focus)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PROGRESSIVE WORD HIDING SELECTOR (0%, 25%, 50%, 100%) */}
        <View style={styles.hidingLevelCard}>
          <Text style={styles.hidingLevelTitle}>
            {isAr ? 'درجة إخفاء الكلمات للتسميع والاختبار 🧠' : 'Progressive Word Hiding Level 🧠'}
          </Text>
          <View style={styles.hidingChipsRow}>
            {[
              { val: 0, labelAr: '٠٪ (ظاهرة بالكامل)', labelEn: '0% (Visible)' },
              { val: 25, labelAr: '٢٥٪ (سهل)', labelEn: '25% (Easy)' },
              { val: 50, labelAr: '٥٠٪ (متوسط)', labelEn: '50% (Medium)' },
              { val: 100, labelAr: '١٠٠٪ (تسميع غيباً)', labelEn: '100% (Recite)' },
            ].map((chip) => {
              const active = hidePercentage === chip.val;
              return (
                <TouchableOpacity
                  key={chip.val}
                  style={[styles.hidingChip, active && styles.hidingChipActive]}
                  onPress={() => {
                    setHidePercentage(chip.val as HidePercentage);
                    setRevealedWords({});
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.hidingChipText, active && styles.hidingChipTextActive]}>
                    {isAr ? chip.labelAr : chip.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick reveal / hide helpers */}
          {hidePercentage > 0 && (
            <View style={styles.revealActionsRow}>
              <TouchableOpacity
                style={styles.revealQuickBtn}
                onPress={handleRevealAll}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={14} color="#047857" />
                <Text style={styles.revealQuickBtnText}>
                  {isAr ? 'كشف كل الكلمات مؤقتاً' : 'Reveal All Words'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.revealQuickBtn}
                onPress={handleResetHidden}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-off-outline" size={14} color="#B45309" />
                <Text style={[styles.revealQuickBtnText, { color: '#B45309' }]}>
                  {isAr ? 'إعادة الإخفاء' : 'Re-hide Words'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.hidingHelpHint}>
            {hidePercentage > 0
              ? isAr
                ? '💡 انقر فوق أي كلمة مخفية لإظهارها إذا نسيتها أثناء التسميع!'
                : '💡 Tap any hidden word to reveal it if you need a hint!'
              : isAr
              ? 'اقرأ الآيات واستمع إليها جيداً ثم اختر نسبة الإخفاء لبدء التسميع'
              : 'Read and listen to the verses before hiding words to test yourself'}
          </Text>
        </View>

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: FULL SURAH VIEW (عرض السورة كاملة مع كل الآيات)       */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'full_surah' && (
          <View style={styles.fullSurahContainer}>
            {/* Master Audio Controller for Full Surah */}
            <View style={styles.fullSurahAudioBar}>
              <View style={styles.fullSurahAudioInfo}>
                <Ionicons
                  name={isFullSurahPlaying ? 'volume-high' : 'musical-notes'}
                  size={20}
                  color="#059669"
                />
                <Text style={styles.fullSurahAudioTitle}>
                  {isAr
                    ? isFullSurahPlaying
                      ? `يتلو الآن: الآية ${(playingAyahIdx ?? 0) + 1} من ${surah.ayahs.length}`
                      : `تلاوة سورة ${surah.nameArabic} كاملة`
                    : `Recite Full Surah (${surah.ayahs.length} verses)`}
                </Text>
              </View>

              <View style={styles.fullSurahAudioBtns}>
                {isPlaying && isFullSurahPlaying ? (
                  <TouchableOpacity
                    style={[styles.audioCtrlBtn, styles.audioCtrlBtnPause]}
                    onPress={handlePauseAudio}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="pause" size={18} color="#FFFFFF" />
                    <Text style={styles.audioCtrlBtnText}>{isAr ? 'إيقاف' : 'Pause'}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.audioCtrlBtn, styles.audioCtrlBtnPlay]}
                    onPress={handlePlayFullSurah}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="play" size={18} color="#FFFFFF" />
                    <Text style={styles.audioCtrlBtnText}>
                      {isAr ? 'استماع للسورة كاملة' : 'Play Full Surah'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* ALL AYAHS OF THE SURAH IN PROPER RTL ORDER */}
            <View style={styles.fullSurahCard}>
              {surah.ayahs.map((ayah, aIdx) => {
                const words = getAyahWords(ayah.textUthmani);
                const isAyahActive = playingAyahIdx === aIdx && isPlaying;

                return (
                  <View
                    key={ayah.number}
                    style={[
                      styles.ayahBlockRow,
                      isAyahActive && styles.ayahBlockRowActive,
                    ]}
                  >
                    {/* Ayah Header with Quick Play */}
                    <View style={styles.ayahBlockHeader}>
                      <View style={styles.ayahBlockBadge}>
                        <Text style={styles.ayahBlockBadgeText}>
                          {isAr ? `الآية ${ayah.number}` : `Ayah ${ayah.number}`}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.ayahPlayMiniBtn,
                          isAyahActive && styles.ayahPlayMiniBtnActive,
                        ]}
                        onPress={() => {
                          if (isAyahActive) {
                            handlePauseAudio();
                          } else {
                            isFullSurahPlayingRef.current = false;
                            setIsFullSurahPlaying(false);
                            playAyahAudio(aIdx, 1);
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isAyahActive ? 'pause' : 'volume-medium'}
                          size={15}
                          color={isAyahActive ? '#FFFFFF' : '#047857'}
                        />
                        <Text
                          style={[
                            styles.ayahPlayMiniBtnText,
                            isAyahActive && { color: '#FFFFFF' },
                          ]}
                        >
                          {isAr ? 'استمع' : 'Listen'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* WORDS CONTAINER: STRICT RTL ORDER (flexDirection: row-reverse) */}
                    <View style={styles.wordsContainerRTL}>
                      {words.map((word, wIdx) => {
                        const hidden = isWordInitiallyHidden(wIdx);
                        const isRevealed = Boolean(
                          revealedWords[`${aIdx}_${hidePercentage}_${wIdx}`]
                        );
                        const shouldShowWord = !hidden || isRevealed;

                        return (
                          <TouchableOpacity
                            key={wIdx}
                            onPress={() => {
                              if (hidden) toggleWordReveal(aIdx, wIdx);
                            }}
                            activeOpacity={hidden ? 0.7 : 1}
                            style={[
                              styles.wordBox,
                              hidden && !isRevealed && styles.wordBoxHidden,
                              hidden && isRevealed && styles.wordBoxRevealed,
                            ]}
                          >
                            {shouldShowWord ? (
                              <Text
                                style={[
                                  styles.wordText,
                                  hidden && isRevealed && styles.wordTextRevealed,
                                ]}
                              >
                                {word}
                              </Text>
                            ) : (
                              <View style={styles.hiddenPlaceholder}>
                                <Text style={styles.hiddenDots}>•••</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}

                      {/* Ayah End Marker in RTL (appears to the left of the last word) */}
                      <View style={styles.ayahEndSymbolBox}>
                        <Text style={styles.ayahEndSymbolText}>﴿{ayah.number}﴾</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: SINGLE AYAH FOCUS (آية تلو الأخرى مع شريط التنقل)    */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'single_ayah' && (
          <View style={styles.singleAyahContainer}>
            {/* HORIZONTAL AYAH SELECTOR BAR (شريط كل الآيات) */}
            <View style={styles.ayahSelectorSection}>
              <Text style={styles.ayahSelectorTitle}>
                {isAr
                  ? `اختر الآية للتكرار والتسميع (${currentAyahIdx + 1} من ${surah.ayahs.length}):`
                  : `Choose Ayah (${currentAyahIdx + 1} of ${surah.ayahs.length}):`}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ayahChipsScroll}
              >
                {surah.ayahs.map((ayah, idx) => {
                  const isActive = idx === currentAyahIdx;
                  return (
                    <TouchableOpacity
                      key={ayah.number}
                      style={[styles.ayahNavChip, isActive && styles.ayahNavChipActive]}
                      onPress={() => {
                        audioService.stop();
                        setIsPlaying(false);
                        setPlayingAyahIdx(null);
                        setCurrentAyahIdx(idx);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.ayahNavChipText,
                          isActive && styles.ayahNavChipTextActive,
                        ]}
                      >
                        {isAr ? `آية ${ayah.number}` : `Ayah ${ayah.number}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* SINGLE AYAH CARD */}
            <View style={styles.ayahCard}>
              {/* Repeat info & count options */}
              <View style={styles.repeatBadgeRow}>
                <View style={styles.repeatCyclePill}>
                  <Ionicons name="repeat" size={14} color="#059669" />
                  <Text style={styles.repeatCycleText}>
                    {isAr
                      ? `تكرار: ${currentRepeatCycle} من ${repeatCount}`
                      : `Cycle: ${currentRepeatCycle} / ${repeatCount}`}
                  </Text>
                </View>

                <View style={styles.repeatCountSelector}>
                  {[1, 3, 5, 10].map((cnt) => (
                    <TouchableOpacity
                      key={cnt}
                      style={[styles.cntChip, repeatCount === cnt && styles.cntChipActive]}
                      onPress={() => {
                        setRepeatCount(cnt);
                        repeatCountRef.current = cnt;
                      }}
                    >
                      <Text
                        style={[
                          styles.cntChipText,
                          repeatCount === cnt && styles.cntChipTextActive,
                        ]}
                      >
                        {cnt}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* WORDS DISPLAY AREA: STRICT RTL ORDER (flexDirection: row-reverse) */}
              <View style={styles.wordsContainerRTL}>
                {getAyahWords(currentAyah.textUthmani).map((word, idx) => {
                  const hidden = isWordInitiallyHidden(idx);
                  const isRevealed = Boolean(
                    revealedWords[`${currentAyahIdx}_${hidePercentage}_${idx}`]
                  );
                  const shouldShowWord = !hidden || isRevealed;

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        if (hidden) toggleWordReveal(currentAyahIdx, idx);
                      }}
                      activeOpacity={hidden ? 0.7 : 1}
                      style={[
                        styles.wordBox,
                        hidden && !isRevealed && styles.wordBoxHidden,
                        hidden && isRevealed && styles.wordBoxRevealed,
                      ]}
                    >
                      {shouldShowWord ? (
                        <Text
                          style={[
                            styles.wordText,
                            hidden && isRevealed && styles.wordTextRevealed,
                          ]}
                        >
                          {word}
                        </Text>
                      ) : (
                        <View style={styles.hiddenPlaceholder}>
                          <Text style={styles.hiddenDots}>•••</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Ayah End Marker */}
                <View style={styles.ayahEndSymbolBox}>
                  <Text style={styles.ayahEndSymbolText}>﴿{currentAyah.number}﴾</Text>
                </View>
              </View>

              {/* PLAYBACK & NAVIGATION CONTROLS */}
              <View style={styles.playbackRow}>
                {/* Previous Ayah Button */}
                <TouchableOpacity
                  style={[
                    styles.controlSecBtn,
                    currentAyahIdx === 0 && styles.controlSecBtnDisabled,
                  ]}
                  onPress={() => {
                    if (currentAyahIdx > 0) {
                      audioService.stop();
                      setIsPlaying(false);
                      setCurrentAyahIdx(currentAyahIdx - 1);
                    }
                  }}
                  disabled={currentAyahIdx === 0}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="play-skip-back"
                    size={20}
                    color={currentAyahIdx === 0 ? '#9CA3AF' : '#059669'}
                  />
                  <Text
                    style={[
                      styles.controlSecBtnText,
                      currentAyahIdx === 0 && { color: '#9CA3AF' },
                    ]}
                  >
                    {isAr ? 'السابقة' : 'Prev'}
                  </Text>
                </TouchableOpacity>

                {/* Play / Pause Button */}
                {isPlaying && playingAyahIdx === currentAyahIdx ? (
                  <TouchableOpacity
                    style={[styles.controlMainBtn, styles.controlPauseBtn]}
                    onPress={handlePauseAudio}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="pause" size={24} color="#FFFFFF" />
                    <Text style={styles.controlMainBtnText}>{isAr ? 'إيقاف' : 'Pause'}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.controlMainBtn, styles.controlPlayBtn]}
                    onPress={() => playAyahAudio(currentAyahIdx, currentRepeatCycle)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="play" size={24} color="#FFFFFF" style={{ marginLeft: 2 }} />
                    <Text style={styles.controlMainBtnText}>
                      {isAr ? 'استمع وكرر' : 'Play & Repeat'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Restart Loop Button */}
                <TouchableOpacity
                  style={styles.controlSecBtn}
                  onPress={handleRestartAudio}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={20} color="#059669" />
                  <Text style={styles.controlSecBtnText}>{isAr ? 'إعادة' : 'Restart'}</Text>
                </TouchableOpacity>

                {/* Next Ayah Button */}
                <TouchableOpacity
                  style={[
                    styles.controlSecBtn,
                    currentAyahIdx === surah.ayahs.length - 1 && styles.controlSecBtnDisabled,
                  ]}
                  onPress={() => {
                    if (currentAyahIdx < surah.ayahs.length - 1) {
                      audioService.stop();
                      setIsPlaying(false);
                      setCurrentAyahIdx(currentAyahIdx + 1);
                    }
                  }}
                  disabled={currentAyahIdx === surah.ayahs.length - 1}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="play-skip-forward"
                    size={20}
                    color={
                      currentAyahIdx === surah.ayahs.length - 1 ? '#9CA3AF' : '#059669'
                    }
                  />
                  <Text
                    style={[
                      styles.controlSecBtnText,
                      currentAyahIdx === surah.ayahs.length - 1 && { color: '#9CA3AF' },
                    ]}
                  >
                    {isAr ? 'التالية' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* SELF-CHECK CARD (PRD §7.3.4: "هل حفظتها؟") */}
        <View style={styles.selfCheckCard}>
          <Text style={styles.selfCheckQuestion}>
            {viewMode === 'full_surah'
              ? isAr
                ? `هل أتممت تسميع سورة ${surah.nameArabic} كاملة بنجاح؟ 🌟`
                : `Did you recite full Surah ${surah.nameTransliteration} successfully? 🌟`
              : isAr
              ? `هل حفظت الآية ${currentAyah.number} المباركة؟ 🌸`
              : `Did you memorize noble Ayah ${currentAyah.number}? 🌸`}
          </Text>
          <Text style={styles.selfCheckSub}>
            {isAr
              ? 'اختر بصدق لتقييم حفظك وتثبيته ونيل النجوم المباركة:'
              : 'Choose honestly to track your progress and earn reward stars:'}
          </Text>

          <View style={styles.selfCheckButtonsRow}>
            {/* Try again button */}
            <TouchableOpacity
              style={[styles.checkBtn, styles.checkBtnRepeat]}
              onPress={handleRestartAudio}
              activeOpacity={0.85}
            >
              <Ionicons name="repeat" size={20} color="#D97706" />
              <Text style={styles.checkBtnRepeatText}>
                {isAr ? 'سأكرر وأحاول ثانية 🔁' : 'Try Again 🔁'}
              </Text>
            </TouchableOpacity>

            {/* Yes memorized button */}
            <TouchableOpacity
              style={[styles.checkBtn, styles.checkBtnYes]}
              onPress={handleSelfCheckYes}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.checkBtnYesText}>
                {viewMode === 'full_surah'
                  ? isAr
                    ? 'أتقنت السورة كاملة! 🌟'
                    : 'Mastered Full Surah! 🌟'
                  : isAr
                  ? 'نعم، حفظتها بحمد الله! 🌟'
                  : 'Yes, Memorized! 🌟'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* SURAH PICKER MODAL */}
      <Modal
        visible={showSurahModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSurahModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleBox}>
                <Ionicons name="book" size={20} color="#065F46" />
                <Text style={styles.modalTitle}>
                  {isAr ? 'اختر السورة للتسميع والحفظ' : 'Select Surah to Memorize'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowSurahModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.modalSearchBox}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput
                style={styles.modalSearchInput}
                placeholder={isAr ? 'ابحث باسم السورة أو رقمها...' : 'Search Surah name or number...'}
                value={surahSearchQuery}
                onChangeText={setSurahSearchQuery}
                placeholderTextColor="#94A3B8"
              />
              {surahSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSurahSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Surah List */}
            <FlatList
              data={filteredSurahs}
              keyExtractor={(item) => String(item.number)}
              renderItem={({ item }: { item: SurahMeta }) => {
                const isCurrent = item.number === selectedSurahNum;
                return (
                  <TouchableOpacity
                    style={[styles.modalSurahItem, isCurrent && styles.modalSurahItemActive]}
                    onPress={() => selectNewSurah(item.number)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modalSurahNumberBox}>
                      <Text style={styles.modalSurahNumberText}>{item.number}</Text>
                    </View>

                    <View style={styles.modalSurahInfo}>
                      <Text
                        style={[
                          styles.modalSurahNameAr,
                          isCurrent && styles.modalSurahNameArActive,
                        ]}
                      >
                        سورة {item.nameArabic}
                      </Text>
                      <Text style={styles.modalSurahSub}>
                        {item.nameTransliteration} • {item.ayahCount} آية
                      </Text>
                    </View>

                    {isCurrent ? (
                      <Ionicons name="checkmark-circle" size={22} color="#059669" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Completion Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={viewMode === 'full_surah' ? 5 : 3}
        gemsEarned={viewMode === 'full_surah' ? 10 : 6}
        title={t.congratulations}
        subtitle={
          isAr
            ? `ما شاء الله تبارك الله! أحسنت وأتممت تسميع سورة ${surah.nameArabic}`
            : `Masha’Allah! Completed recitation test of Surah ${surah.nameTransliteration}`
        }
        onDismiss={() => {
          setShowCelebration(false);
          router.replace('/quran');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.sand50,
  },
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 40,
  },

  // Surah Header Bar
  surahHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 8,
  },
  surahPickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  surahPickerText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
  },
  surahPickerBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  surahPickerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  changeSurahBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  changeSurahBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },

  // View Mode Tabs (Full Surah vs Single Ayah)
  viewModeTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.lg,
    padding: 3,
    marginBottom: SPACING.md,
    gap: 4,
  },
  viewModeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  viewModeTabActive: {
    backgroundColor: '#059669',
    ...SHADOWS.sm,
  },
  viewModeTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  viewModeTabTextActive: {
    color: '#FFFFFF',
  },

  // Hiding Level Card
  hidingLevelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  hidingLevelTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.ink900,
    marginBottom: 8,
    textAlign: 'center',
  },
  hidingChipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  hidingChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hidingChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  hidingChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  hidingChipTextActive: {
    color: '#FFFFFF',
  },
  revealActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: 10,
  },
  revealQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  revealQuickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  hidingHelpHint: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  // -------------------------------------------------------------
  // FULL SURAH STYLES
  // -------------------------------------------------------------
  fullSurahContainer: {
    marginBottom: SPACING.md,
  },
  fullSurahAudioBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: SPACING.sm,
  },
  fullSurahAudioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fullSurahAudioTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  fullSurahAudioBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  audioCtrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  audioCtrlBtnPlay: {
    backgroundColor: '#059669',
  },
  audioCtrlBtnPause: {
    backgroundColor: '#DC2626',
  },
  audioCtrlBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  fullSurahCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8D9BF',
    ...SHADOWS.md,
  },
  ayahBlockRow: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ayahBlockRowActive: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 8,
  },
  ayahBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ayahBlockBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  ayahBlockBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  ayahPlayMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  ayahPlayMiniBtnActive: {
    backgroundColor: '#059669',
  },
  ayahPlayMiniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },

  // -------------------------------------------------------------
  // STRICT RTL WORDS CONTAINER (Fix for words written backwards!)
  // -------------------------------------------------------------
  wordsContainerRTL: {
    flexDirection: Platform.OS === 'web' ? 'row' : (I18nManager.isRTL ? 'row' : 'row-reverse'),
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  wordBox: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBoxHidden: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    minWidth: 44,
    height: 38,
  },
  wordBoxRevealed: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  wordText: {
    fontSize: 24,
    lineHeight: 46,
    color: '#064E3B',
    fontWeight: '600',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  wordTextRevealed: {
    color: '#15803D',
    fontWeight: '700',
  },
  hiddenPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenDots: {
    fontSize: 16,
    color: '#B45309',
    fontWeight: '800',
    letterSpacing: 2,
  },
  ayahEndSymbolBox: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahEndSymbolText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D97706',
    writingDirection: 'rtl',
  },

  // -------------------------------------------------------------
  // SINGLE AYAH MODE STYLES
  // -------------------------------------------------------------
  singleAyahContainer: {
    marginBottom: SPACING.md,
  },
  ayahSelectorSection: {
    marginBottom: SPACING.sm,
  },
  ayahSelectorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
  },
  ayahChipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  ayahNavChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ayahNavChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  ayahNavChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  ayahNavChipTextActive: {
    color: '#FFFFFF',
  },

  ayahCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E8D9BF',
    ...SHADOWS.md,
  },
  repeatBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  repeatCyclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  repeatCycleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  repeatCountSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  cntChip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F1F5F9',
  },
  cntChipActive: {
    backgroundColor: '#059669',
  },
  cntChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  cntChipTextActive: {
    color: '#FFFFFF',
  },

  // Playback Row
  playbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: SPACING.md,
  },
  controlSecBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F0FDF4',
    gap: 2,
    minWidth: 50,
  },
  controlSecBtnDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.5,
  },
  controlSecBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  controlMainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    gap: 6,
    ...SHADOWS.sm,
  },
  controlPlayBtn: {
    backgroundColor: '#059669',
  },
  controlPauseBtn: {
    backgroundColor: '#DC2626',
  },
  controlMainBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Self Check Card
  selfCheckCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
    marginTop: SPACING.sm,
  },
  selfCheckQuestion: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.ink900,
    textAlign: 'center',
    marginBottom: 4,
  },
  selfCheckSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  selfCheckButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  checkBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  checkBtnRepeat: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  checkBtnRepeatText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  checkBtnYes: {
    backgroundColor: '#16A34A',
  },
  checkBtnYesText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // -------------------------------------------------------------
  // SURAH PICKER MODAL STYLES
  // -------------------------------------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '75%',
    padding: SPACING.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: SPACING.sm,
    gap: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    textAlign: 'right',
  },
  modalSurahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  modalSurahItemActive: {
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.md,
  },
  modalSurahNumberBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSurahNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  modalSurahInfo: {
    flex: 1,
  },
  modalSurahNameAr: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalSurahNameArActive: {
    color: '#059669',
  },
  modalSurahSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
