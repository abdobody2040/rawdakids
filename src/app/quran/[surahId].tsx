// Ayah-by-Ayah Player Screen (Q1, Q2, Q3, Q4, Q5, Q10, Q11, Q13)
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MUSHAF_SURAHS } from '@/data/mushafData';
import { quranService } from '@/services/quranService';
import { audioService } from '@/services/audioService';
import { useAppStore, HifzStatus } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import {
  getQuranSaveBtnLabel,
  getQuranStoryShowcaseTitle,
  getQuranGoldenLessonTag,
} from '@/services/multilingualContentService';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import { Ayah } from '@/data/quranData';
import Header from '@/components/Header';
import AudioPlayerBar from '@/components/AudioPlayerBar';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import SurahStoryModal from '@/components/SurahStoryModal';
import AyahTafsirModal from '@/components/AyahTafsirModal';
import WordMeaningBubbleModal from '@/components/WordMeaningBubbleModal';
import ChildVoiceRecorderModal from '@/components/ChildVoiceRecorderModal';
import AchievementCertificateModal from '@/components/AchievementCertificateModal';
import TajweedLegendModal from '@/components/TajweedLegendModal';
import QuranText from '@/components/QuranText';
import AyahTafsirSheet from '@/components/AyahTafsirSheet';
import VerseColoringModal, { VerseColor } from '@/components/VerseColoringModal';
import { hifzFadeService, SurahHifzRecord } from '@/services/hifzFadeService';
import { quranWordsService } from '@/services/quranWordsService';
import { WordMeaning } from '@/data/quranWordsData';

export default function SurahDetailScreen() {
  const router = useRouter();
  const { surahId } = useLocalSearchParams();
  const surahNumber = parseInt(String(surahId || '1'), 10);

  const {
    language,
    surahProgress,
    setAyahStatus,
    addSurahStars,
    markSurahCompleted,
    addStars,
    addGems,
    parentSettings,
    downloadedSurahs,
    setSurahDownloaded,
    profiles,
    activeProfileId,
  } = useAppStore();

  const currentChild = profiles?.find((p) => p.id === activeProfileId);
  const isAge4to6 = currentChild?.ageBand === '4-6';

  // Modes & View Formatting (Part A & B1)
  const [quranMode, setQuranMode] = useState<'listen' | 'fade'>('listen');
  const [viewFormat, setViewFormat] = useState<'text' | 'cards'>('text');
  const [fontSize, setFontSize] = useState<number>(26);

  // Hifz Fade state
  const [hifzRecord, setHifzRecord] = useState<SurahHifzRecord | null>(null);
  const [wordsPerStep, setWordsPerStep] = useState<number>(3);
  const [hiddenWordsMap, setHiddenWordsMap] = useState<Record<number, number[]>>({});
  const [versesColorMap, setVersesColorMap] = useState<Record<number, VerseColor>>({});
  const [allHiddenSuccess, setAllHiddenSuccess] = useState<boolean>(false);
  const [showUnreviewedNotice, setShowUnreviewedNotice] = useState<boolean>(false);

  // Tafsir Bottom Sheet (A4)
  const [tafsirSheetAyahNo, setTafsirSheetAyahNo] = useState<number | null>(null);

  // Verse Coloring Modal (B1)
  const [coloringVerseNo, setColoringVerseNo] = useState<number | null>(null);

  const isReviewedForFade = hifzFadeService.isSurahReviewed(surahNumber);

  const t = TRANSLATIONS[language];
  const [surah, setSurah] = useState(() => quranService.getSurahSync(surahNumber));
  const [isLoadingSurah, setIsLoadingSurah] = useState(() => {
    const initial = quranService.getSurahSync(surahNumber);
    return initial.ayahs[0]?.textUthmani?.startsWith('آية رقم') ?? false;
  });

  useEffect(() => {
    let isMounted = true;
    quranService
      .getSurah(surahNumber, parentSettings.translationSource, language)
      .then((data) => {
        if (isMounted && data) {
          setSurah(data);
          setIsLoadingSurah(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingSurah(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [surahNumber, parentSettings.translationSource, language]);

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
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);
  const [playingTafsirAyahNum, setPlayingTafsirAyahNum] = useState<number | null>(null);

  // Per-user toggles
  const [showTafsir, setShowTafsir] = useState<boolean>(
    parentSettings.showSimpleTafsir !== undefined ? parentSettings.showSimpleTafsir : true
  );
  const [tajweedEnabled, setTajweedEnabled] = useState<boolean>(false);
  const [showTajweedModal, setShowTajweedModal] = useState<boolean>(false);
  const [showEtiquetteHint, setShowEtiquetteHint] = useState<boolean>(true);

  // Word-by-word tap meaning
  const [selectedWordMeaning, setSelectedWordMeaning] = useState<WordMeaning | null>(null);
  const [wordAyahNumber, setWordAyahNumber] = useState<number | undefined>(undefined);

  // Child Voice Recording state
  const [recordingAyah, setRecordingAyah] = useState<Ayah | null>(null);

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
      if (status.error) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        return;
      }
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

  // Load Hifz Record for Child & Surah
  useEffect(() => {
    let isCurrent = true;
    hifzFadeService.getSurahHifz(activeProfileId || 'default', surahNumber).then((rec) => {
      if (!isCurrent) return;
      setHifzRecord(rec);
      setWordsPerStep(rec.wordsPerStep || 3);
      const colors: Record<number, VerseColor> = {};
      const hidden: Record<number, number[]> = {};
      for (const [vNo, vState] of Object.entries(rec.verses || {})) {
        colors[Number(vNo)] = vState.color;
        hidden[Number(vNo)] = vState.hiddenWords || [];
      }
      setVersesColorMap(colors);
      setHiddenWordsMap(hidden);
    });

    return () => {
      isCurrent = false;
      hifzFadeService.clearUndoStack();
    };
  }, [activeProfileId, surahNumber]);

  const handleSelectMode = (mode: 'listen' | 'fade') => {
    if (mode === 'fade') {
      if (!isReviewedForFade) {
        setShowUnreviewedNotice(true);
        return;
      }
      setQuranMode('fade');
      setViewFormat('text');
    } else {
      setQuranMode('listen');
    }
  };

  const cloneHifzRecord = (rec: SurahHifzRecord): SurahHifzRecord => {
    const versesCopy: Record<number, any> = {};
    for (const [vNo, vState] of Object.entries(rec.verses || {})) {
      versesCopy[Number(vNo)] = {
        color: vState.color,
        hiddenWords: [...(vState.hiddenWords || [])],
        updatedAt: vState.updatedAt,
      };
    }
    return {
      ...rec,
      verses: versesCopy,
    };
  };

  const handleQuranWordTap = (sId: number, verseNo: number, wordPos: number) => {
    if (quranMode === 'fade' && hifzRecord) {
      const copy = cloneHifzRecord(hifzRecord);
      hifzFadeService.toggleWordHidden(copy, verseNo, wordPos);
      hifzFadeService.saveSurahHifz(copy);
      setHifzRecord(copy);
      setHiddenWordsMap(hifzFadeService.getHiddenWordsMap(copy));
      setAllHiddenSuccess(false);
    } else {
      playAyahAudio(verseNo, 1);
    }
  };

  const handleFadeMore = () => {
    if (!hifzRecord || !surah?.ayahs) return;
    const verseWordCounts: Record<number, number> = {};
    surah.ayahs.forEach((a) => {
      const count = (a.textUthmani || '').trim().split(/\s+/).filter(Boolean).length;
      verseWordCounts[a.number] = Math.max(1, count);
    });

    const copy = cloneHifzRecord(hifzRecord);
    const result = hifzFadeService.fadeMoreWords(copy, verseWordCounts);
    hifzFadeService.saveSurahHifz(copy);
    setHifzRecord(copy);
    setHiddenWordsMap(hifzFadeService.getHiddenWordsMap(copy));
    if (result.allHidden) {
      setAllHiddenSuccess(true);
    }
  };

  const handleUndo = () => {
    if (!hifzRecord) return;
    const copy = cloneHifzRecord(hifzRecord);
    const restored = hifzFadeService.undoLastAction(copy);
    if (restored) {
      hifzFadeService.saveSurahHifz(copy);
      setHifzRecord(copy);
      setHiddenWordsMap(hifzFadeService.getHiddenWordsMap(copy));
      setAllHiddenSuccess(false);
    }
  };

  const handleResetHidden = () => {
    if (!hifzRecord) return;
    const copy = cloneHifzRecord(hifzRecord);
    hifzFadeService.resetHiddenWords(copy);
    hifzFadeService.saveSurahHifz(copy);
    setHifzRecord(copy);
    setHiddenWordsMap(hifzFadeService.getHiddenWordsMap(copy));
    setAllHiddenSuccess(false);
  };

  const handleChangeWordsPerStep = (delta: number) => {
    const next = Math.max(1, Math.min(6, wordsPerStep + delta));
    setWordsPerStep(next);
    if (hifzRecord) {
      const copy = { ...hifzRecord, wordsPerStep: next };
      setHifzRecord(copy);
      hifzFadeService.saveSurahHifz(copy);
    }
  };

  const handleSelectVerseColor = (color: VerseColor) => {
    if (!hifzRecord || coloringVerseNo === null) return;
    const copy = cloneHifzRecord(hifzRecord);
    hifzFadeService.setVerseColor(copy, coloringVerseNo, color);
    hifzFadeService.saveSurahHifz(copy);
    setHifzRecord(copy);
    setVersesColorMap({
      ...versesColorMap,
      [coloringVerseNo]: color,
    });
    setColoringVerseNo(null);
  };

  const handleOpenTafsirForVerse = (sId: number, verseNo: number) => {
    setTafsirSheetAyahNo(verseNo);
  };

  const hifzProgress = hifzRecord
    ? hifzFadeService.calculateProgress(hifzRecord, surah?.ayahs?.length || 1)
    : { memorizedCount: 0, masteredCount: 0, reviewCount: 0, percent: 0 };

  const currentSurahProgress = surahProgress[surah.number];
  const isSurahCompleted = !!currentSurahProgress?.isCompleted;
  const memorizedAyahsCount = surah.ayahs.filter(
    (a) => currentSurahProgress?.ayahsStatus?.[a.number] === 'memorized'
  ).length;
  const totalAyahsCount = surah.ayahs.length;
  const isAllAyahsMemorized = totalAyahsCount > 0 && memorizedAyahsCount >= totalAyahsCount;

  const handleCompleteSurahHifz = () => {
    // 1. Mark all ayahs as memorized
    surah.ayahs.forEach((a) => {
      setAyahStatus(surah.number, a.number, 'memorized');
    });
    // 2. Mark the whole surah as completed
    markSurahCompleted(surah.number);
    // 3. Award completion stars & gems
    addSurahStars(surah.number, 5);
    addStars(15);
    addGems(5);
    // 4. Show celebratory modal & Certificate
    setShowCelebration(true);
    setShowCertificateModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        fallbackRoute="/quran"
        title={language === 'ar' ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
      />

      {/* Surah Header Card with Rich Story & Tadabbur */}
      <View style={styles.topCard}>
        {/* Row 1: Surah Title + Revelation Type + Compact Offline Download */}
        <View style={styles.topCardRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={styles.surahTitleArabic}>
                {language === 'ar' ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
              </Text>
              <View style={styles.revelationTypeBadge}>
                <Text style={styles.revelationTypeText}>
                  {surah.revelationType === 'Meccan'
                    ? t.meccan
                    : t.medinan}
                </Text>
              </View>
            </View>
          </View>

          {/* Compact Download Button */}
          <TouchableOpacity
            style={[styles.downloadBtn, isDownloaded && styles.downloadBtnActive]}
            onPress={handleToggleDownload}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isDownloading ? 'sync' : isDownloaded ? 'checkmark-circle' : 'cloud-download-outline'}
              size={13}
              color={isDownloaded ? '#047857' : '#0d9488'}
            />
            <Text style={[styles.downloadBtnText, isDownloaded && { color: '#047857' }]}>
              {isDownloading
                ? `${downloadProgress}%`
                : isDownloaded
                ? getQuranSaveBtnLabel(true, language)
                : getQuranSaveBtnLabel(false, language)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Rich Surah Story & Tadabbur Showcase Card */}
        <View style={styles.storyShowcaseCard}>
          <View style={[styles.storyShowcaseHead, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sparkles" size={15} color="#d97706" />
              <Text style={styles.storyShowcaseTitle}>
                {getQuranStoryShowcaseTitle(language)}
              </Text>
            </View>
          </View>

          {/* Story Intro Text */}
          <Text
            style={[styles.storyShowcaseText, language === 'ar' && { textAlign: 'right' }]}
            numberOfLines={2}
          >
            {language === 'ar' ? surah.storyIntroAr : surah.storyIntroEn}
          </Text>

          {/* Golden Lesson Pill */}
          {((language === 'ar' ? surah.coreLessonsAr : surah.coreLessonsEn) || []).length > 0 && (
            <View style={[styles.goldenLessonRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
              <Text style={styles.goldenLessonTag}>
                {getQuranGoldenLessonTag(language)}
              </Text>
              <Text style={styles.goldenLessonText} numberOfLines={1}>
                {language === 'ar' ? surah.coreLessonsAr[0] : surah.coreLessonsEn[0]}
              </Text>
            </View>
          )}

          {/* Button to open complete interactive Story Modal */}
          <TouchableOpacity
            style={styles.storyCardBtn}
            onPress={() => setShowStoryModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="book-outline" size={15} color="#b45309" />
            <Text style={styles.storyCardBtnText}>
              {language === 'ar'
                ? 'اقرأ القصة وتدبّر عِبرها كاملة مع نور 📖✨'
                : 'Read Full Story & Reflections with Noor 📖✨'}
            </Text>
            <Ionicons
              name={language === 'ar' ? 'chevron-back' : 'chevron-forward'}
              size={13}
              color="#b45309"
            />
          </TouchableOpacity>
        </View>

        {/* Mode Switcher: "اسمع وردّد" | "المحو التدريجي" (Hidden in age 4-6) */}
        {!isAge4to6 && (
          <View style={styles.modeSwitcherContainer}>
            <TouchableOpacity
              style={[styles.modeTab, quranMode === 'listen' && styles.modeTabActive]}
              onPress={() => handleSelectMode('listen')}
              activeOpacity={0.85}
              accessibilityLabel="وضع اسمع وردّد"
            >
              <Ionicons
                name="headset"
                size={16}
                color={quranMode === 'listen' ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.modeTabText,
                  quranMode === 'listen' && styles.modeTabTextActive,
                ]}
              >
                {language === 'ar' ? 'اسمع وردّد' : 'Listen & Recite'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, quranMode === 'fade' && styles.modeTabActiveFade]}
              onPress={() => handleSelectMode('fade')}
              activeOpacity={0.85}
              accessibilityLabel="وضع المحو التدريجي للحفظ"
            >
              <Ionicons
                name="sparkles"
                size={16}
                color={quranMode === 'fade' ? '#FFFFFF' : '#047857'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  quranMode === 'fade' && styles.modeTabTextActive,
                ]}
              >
                {language === 'ar' ? 'المحو التدريجي 🧠' : 'Fade Memorize 🧠'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Fade Controls Toolbar (Part B1) */}
        {quranMode === 'fade' && (
          <View style={styles.fadeToolbarCard}>
            {/* Progress bar */}
            <View style={styles.fadeProgressSection}>
              <View style={[styles.fadeProgressHeader, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                <Text style={styles.fadeProgressTitle}>
                  {`حَفِظْتَ ${hifzProgress.memorizedCount + hifzProgress.masteredCount} مِنْ ${surah.ayahs.length} آيَاتٍ`}
                </Text>
                <Text style={styles.fadeProgressPercent}>{`${hifzProgress.percent}%`}</Text>
              </View>
              <View
                style={styles.fadeProgressBarTrack}
                role="img"
                aria-label={`تقدم حفظ السورة ${hifzProgress.percent} في المئة`}
              >
                <View
                  style={[styles.fadeProgressBarFill, { width: `${hifzProgress.percent}%` }]}
                />
              </View>
            </View>

            {/* Fade Actions */}
            <View style={[styles.fadeActionsRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
              {/* Button: امح المزيد */}
              <TouchableOpacity
                style={[styles.fadeMoreBtn, allHiddenSuccess && styles.fadeBtnDisabled]}
                onPress={handleFadeMore}
                disabled={allHiddenSuccess}
                activeOpacity={0.85}
                accessibilityLabel="امح المزيد من الكلمات"
              >
                <Ionicons name="eye-off-outline" size={17} color="#FFFFFF" />
                <Text style={styles.fadeMoreBtnText}>
                  {language === 'ar' ? 'امْحُ الْمَزِيدَ' : 'Fade More'}
                </Text>
              </TouchableOpacity>

              {/* Stepper: Words per step (- / +) */}
              <View style={styles.wordsStepper}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleChangeWordsPerStep(-1)}
                  accessibilityLabel="تقليل عدد الكلمات"
                >
                  <Ionicons name="remove" size={14} color="#047857" />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{wordsPerStep}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleChangeWordsPerStep(1)}
                  accessibilityLabel="زيادة عدد الكلمات"
                >
                  <Ionicons name="add" size={14} color="#047857" />
                </TouchableOpacity>
              </View>

              {/* Undo Button */}
              <TouchableOpacity
                style={[styles.undoBtn, !hifzFadeService.canUndo && styles.fadeBtnDisabled]}
                onPress={handleUndo}
                disabled={!hifzFadeService.canUndo}
                activeOpacity={0.8}
                accessibilityLabel="تراجع عن آخر خطوة"
              >
                <Ionicons
                  name="arrow-undo"
                  size={15}
                  color={hifzFadeService.canUndo ? '#047857' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.undoBtnText,
                    !hifzFadeService.canUndo && { color: '#9CA3AF' },
                  ]}
                >
                  {language === 'ar' ? 'تراجع' : 'Undo'}
                </Text>
              </TouchableOpacity>

              {/* Reset hidden words */}
              <TouchableOpacity
                style={styles.resetHiddenBtn}
                onPress={handleResetHidden}
                activeOpacity={0.8}
                accessibilityLabel="إظهار كل الكلمات المخفية"
              >
                <Ionicons name="eye-outline" size={15} color="#4B5563" />
                <Text style={styles.resetHiddenBtnText}>
                  {language === 'ar' ? 'إِظْهَارُ الْكُلِّ' : 'Show All'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Success Banner when all words are hidden */}
            {allHiddenSuccess && (
              <View style={[styles.allHiddenBanner, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                <Ionicons name="ribbon" size={18} color="#D97706" />
                <Text style={styles.allHiddenBannerText}>
                  أَحْسَنْتَ! جَرِّبْ أَنْ تَقُولَهَا مِنْ حِفْظِكَ 🎉
                </Text>
              </View>
            )}

            <View style={[styles.fadeHintRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
              <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
              <Text style={styles.fadeHintText}>
                المس أي كلمة لإخفائها/إظهارها • المس رقم الآية لتلوينها (حفظت، متقنة، مراجعة)
              </Text>
            </View>
          </View>
        )}

        {/* Toggles Row */}
        <View style={styles.togglesRow}>
          {quranMode === 'listen' && (
            <>
              {/* Text vs Cards Toggle */}
              <TouchableOpacity
                style={[styles.toggleChip, viewFormat === 'text' && styles.toggleChipActive]}
                onPress={() => setViewFormat(viewFormat === 'text' ? 'cards' : 'text')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={viewFormat === 'text' ? 'document-text' : 'albums'}
                  size={14}
                  color={viewFormat === 'text' ? COLORS.primaryDark : COLORS.textSecondary}
                />
                <Text style={[styles.toggleChipText, viewFormat === 'text' && styles.toggleChipTextActive]}>
                  {viewFormat === 'text'
                    ? (language === 'ar' ? 'نص المصحف 📜' : 'Mushaf Text 📜')
                    : (language === 'ar' ? 'بطاقات الآيات 🃏' : 'Ayah Cards 🃏')}
                </Text>
              </TouchableOpacity>

              {/* Font Size A- / A+ Controls */}
              {viewFormat === 'text' && (
                <View style={styles.fontSizeControlsRow}>
                  <TouchableOpacity
                    style={styles.fontBtn}
                    onPress={() => setFontSize((s) => Math.max(20, s - 2))}
                    accessibilityLabel="تصغير الخط"
                  >
                    <Text style={styles.fontBtnText}>A−</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.fontBtn}
                    onPress={() => setFontSize((s) => Math.min(38, s + 2))}
                    accessibilityLabel="تكبير الخط"
                  >
                    <Text style={styles.fontBtnText}>A+</Text>
                  </TouchableOpacity>
                </View>
              )}

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
            </>
          )}

          {/* Mushaf Page Fallback Toggle (A1 / A5: "وضع صفحة المصحف") */}
          <TouchableOpacity
            style={styles.openInMushafChip}
            onPress={() => {
              const surahMeta = MUSHAF_SURAHS.find((s) => s.number === surah.number);
              const startPage = surahMeta?.startPage || 1;
              router.push({
                pathname: '/quran/mushaf' as any,
                params: { page: startPage.toString() },
              });
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="book" size={13} color="#B45309" />
            <Text style={styles.openInMushafChipText}>
              {language === 'ar' ? 'وضع صفحة المصحف 📄' : 'Mushaf Page 📄'}
            </Text>
          </TouchableOpacity>

          {/* Tajweed Colors & Guide Chip (QUR-4) */}
          <TouchableOpacity
            style={[styles.tajweedChip, tajweedEnabled && styles.tajweedChipActive]}
            onPress={() => {
              setTajweedEnabled(!tajweedEnabled);
              setShowTajweedModal(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="color-palette"
              size={13}
              color={tajweedEnabled ? '#FFFFFF' : '#7C3AED'}
            />
            <Text style={[styles.tajweedChipText, tajweedEnabled && styles.tajweedChipTextActive]}>
              {language === 'ar' ? 'تجويد 🎨' : 'Tajweed 🎨'}
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
        {/* Etiquette Hint (PRD §7.3 Item 7: "تأكد من طهارتك وانتبه" as guidance, never a blocker) */}
        {showEtiquetteHint && (
          <View style={[styles.etiquetteHintBanner, language === 'ar' && { flexDirection: 'row-reverse' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Ionicons name="sparkles" size={15} color="#059669" />
              <Text style={styles.etiquetteHintText}>
                {language === 'ar'
                  ? 'تَأَكَّدْ مِنْ طَهَارَتِكَ وَاسْتَمِعْ بِخُشُوعٍ وَانْتَبِهْ 🌿'
                  : 'Ensure you are pure (tahir), listen mindfully and reflect 🌿'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowEtiquetteHint(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.etiquetteDismissBtn}
              accessibilityLabel={language === 'ar' ? 'إغلاق التنبيه' : 'Dismiss hint'}
            >
              <Ionicons name="close" size={14} color="#065F46" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bismillah Header for cards mode (except for Surah 9 / At-Tawbah if applicable) */}
        {viewFormat === 'cards' && quranMode === 'listen' && surah.number !== 1 && (
          <View style={styles.bismillahBanner}>
            <Text style={styles.bismillahText}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
          </View>
        )}

        {isLoadingSurah && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32, gap: 10 }}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={{ fontSize: 16, fontFamily: 'Amiri', color: '#064E3B' }}>
              {language === 'ar' ? 'جاري تحميل آيات السورة الكريمة...' : 'Loading holy surah verses...'}
            </Text>
          </View>
        )}

        {/* Interactive Real Text Hafs Hafiz Renderer (Part A & B1) */}
        {(quranMode === 'fade' || viewFormat === 'text') ? (
          <View style={styles.quranTextCardWrapper}>
            <QuranText
              surahId={surahNumber}
              mode={quranMode}
              fontSize={fontSize}
              activeVerseNumber={isPlaying ? activeAyahNum : null}
              versesColorMap={versesColorMap}
              hiddenWordsMap={hiddenWordsMap}
              onWordTap={handleQuranWordTap}
              onWordLongPress={handleOpenTafsirForVerse}
              onVerseMarkerTap={handleOpenTafsirForVerse}
              onVerseNumberTap={(sId, vNo) => setColoringVerseNo(vNo)}
            />
          </View>
        ) : (
          surah.ayahs.map((ayah) => {
            const isActive = ayah.number === activeAyahNum;
          const status =
            surahProgress[surah.number]?.ayahsStatus?.[ayah.number] || 'new';

          return (
            <TouchableOpacity
              key={ayah.number}
              style={[styles.ayahCard, isActive && styles.ayahCardActive]}
              onPress={() => {
                if (isActive && isPlaying) {
                  handlePlayPause();
                } else {
                  playAyahAudio(ayah.number, 1);
                }
              }}
              activeOpacity={0.9}
            >
              {/* Ayah Header Row */}
              <View style={[styles.ayahHeaderRow, language === 'ar' && { flexDirection: 'row-reverse' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.ayahNumberBadge}>
                    <Text style={styles.ayahNumberText}>{ayah.number}</Text>
                  </View>

                  {/* Dedicated 1-Tap Play / Pause Button */}
                  <TouchableOpacity
                    style={[styles.ayahPlayBtn, isActive && isPlaying && styles.ayahPlayBtnActive]}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      if (isActive && isPlaying) {
                        handlePlayPause();
                      } else {
                        playAyahAudio(ayah.number, 1);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isActive && isPlaying ? 'pause' : 'play'}
                      size={13}
                      color={isActive && isPlaying ? '#FFFFFF' : '#047857'}
                    />
                    <Text style={[styles.ayahPlayBtnText, isActive && isPlaying && styles.ayahPlayBtnTextActive]}>
                      {isActive && isPlaying
                        ? (language === 'ar' ? 'إيقاف' : 'Pause')
                        : (language === 'ar' ? 'استمع' : 'Play')}
                    </Text>
                  </TouchableOpacity>
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

                  {/* Word Meaning Vocabulary Button */}
                  <TouchableOpacity
                    style={[styles.ayahWordsBtn, language === 'ar' && { flexDirection: 'row-reverse' }]}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      const words = ayah.textUthmani.trim().split(/\s+/);
                      handleWordTap(words[0] || '', ayah);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="book-outline" size={13} color="#0D9488" />
                    <Text style={styles.ayahWordsBtnText}>
                      {language === 'ar' ? 'الكلمات' : 'Words'}
                    </Text>
                  </TouchableOpacity>

                  {/* Quick Tafsir Modal Button */}
                  <TouchableOpacity
                    style={[styles.ayahTafsirBtn, language === 'ar' && { flexDirection: 'row-reverse' }]}
                    onPress={() => setSelectedTafsirAyah(ayah)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="bulb-outline" size={13} color="#b45309" />
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
                      size={13}
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

                  {/* Child Voice Recording Button */}
                  <TouchableOpacity
                    style={styles.voiceRecordBtn}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      setRecordingAyah(ayah);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="mic" size={12} color="#059669" />
                    <Text style={styles.voiceRecordBtnText}>
                      {language === 'ar' ? 'سجّل' : 'Record'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Uthmani Quran Text (Tapping plays/pauses the Ayah) */}
              <TouchableOpacity
                onPress={() => {
                  if (isActive && isPlaying) {
                    handlePlayPause();
                  } else {
                    playAyahAudio(ayah.number, 1);
                  }
                }}
                activeOpacity={0.8}
                style={{ width: '100%' }}
              >
                <Text style={styles.uthmaniText}>
                  {ayah.textUthmani}
                </Text>
              </TouchableOpacity>

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
        })
      )}

        {/* Surah Memorization Completion Milestone Card */}
        <View style={styles.surahHifzMilestoneCard}>
          {isSurahCompleted ? (
            <View style={styles.surahCompletedBox}>
              <View style={styles.surahCompletedTrophyBadge}>
                <Ionicons name="trophy" size={38} color="#D97706" />
              </View>
              <Text style={styles.surahCompletedTitle}>
                {language === 'ar'
                  ? `🎉 أتممت حفظ سورة ${surah.nameArabic} بحمد الله!`
                  : `🎉 You Memorized Surah ${surah.nameTransliteration}!`}
              </Text>
              <Text style={styles.surahCompletedSubtitle}>
                {language === 'ar'
                  ? 'مبارك يا بطل القرآن! استمر في المراجعة وتثبيت الحفظ لنيل شفاعته 👑'
                  : 'Congratulations, Quran champion! Keep reciting and reviewing to shine always 👑'}
              </Text>
              <View style={styles.surahCompletedPillsRow}>
                <View style={styles.surahCompletedPill}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text style={styles.surahCompletedPillText}>
                    {language === 'ar'
                      ? `تم إتمام وحفظ كامل الآيات (${totalAyahsCount} آيات)`
                      : `All ${totalAyahsCount} verses memorized`}
                  </Text>
                </View>
              </View>

              {/* View / Print Certificate Button */}
              <TouchableOpacity
                style={styles.certificateOpenBtn}
                onPress={() => setShowCertificateModal(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="ribbon" size={20} color="#FFFFFF" />
                <Text style={styles.certificateOpenBtnText}>
                  {language === 'ar'
                    ? '📜 عرض وطباعة شهادة التقدير والإنجاز ✨'
                    : '📜 View & Print Honor Certificate ✨'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.surahPendingBox}>
              <View
                style={[
                  styles.surahPendingHeaderRow,
                  { flexDirection: language === 'ar' ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={styles.surahPendingIconCircle}>
                  <Ionicons name="ribbon" size={24} color="#059669" />
                </View>
                <View style={[styles.surahPendingTextCol, { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.surahPendingTitle}>
                    {language === 'ar'
                      ? `إتمام حفظ سورة ${surah.nameArabic}`
                      : `Memorizing Surah ${surah.nameTransliteration}`}
                  </Text>
                  <Text style={styles.surahPendingSub}>
                    {language === 'ar'
                      ? `تم حفظ ${memorizedAyahsCount} من ${totalAyahsCount} آيات`
                      : `Memorized ${memorizedAyahsCount} of ${totalAyahsCount} verses`}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.surahProgressBarTrack}>
                <View
                  style={[
                    styles.surahProgressBarFill,
                    {
                      width: `${Math.min(
                        100,
                        Math.round((memorizedAyahsCount / Math.max(1, totalAyahsCount)) * 100)
                      )}%`,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.surahPendingNotice, { textAlign: language === 'ar' ? 'right' : 'left' }]}>
                {language === 'ar'
                  ? 'لحفظ السورة وتثبيتها: مر على جميع الآيات واستمع إليها واقرأها جيداً، ثم اضغط على زر إتمام الحفظ أدناه.'
                  : 'To complete memorization: read and listen to all verses, then press the completion button below.'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.confirmHifzButton,
                  isAllAyahsMemorized ? styles.confirmHifzButtonDone : styles.confirmHifzButtonActive,
                ]}
                onPress={handleCompleteSurahHifz}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done-circle" size={24} color="#FFFFFF" />
                <Text style={styles.confirmHifzButtonText}>
                  {language === 'ar'
                    ? `✨ اضغط هنا: أتممت حفظ سورة ${surah.nameArabic} بحمد الله! 🌟`
                    : `✨ Tap Here: I Completed Memorizing Surah ${surah.nameTransliteration}! 🌟`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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

      {/* Achievement Certificate Modal (Feature 2) */}
      <AchievementCertificateModal
        visible={showCertificateModal}
        onDismiss={() => setShowCertificateModal(false)}
        certificateType="surah"
        title={language === 'ar' ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
        subtitle={
          language === 'ar'
            ? `جميع آيات السورة الكريمة (${surah.ayahs.length} آيات)`
            : `All ${surah.ayahs.length} Holy Verses`
        }
      />

      {/* Word-by-Word Kid Meaning Bubble Modal */}
      <WordMeaningBubbleModal
        visible={!!selectedWordMeaning}
        wordMeaning={selectedWordMeaning}
        ayahNumber={wordAyahNumber}
        onClose={() => setSelectedWordMeaning(null)}
      />

      {/* Child Voice Recording Modal */}
      <ChildVoiceRecorderModal
        visible={!!recordingAyah}
        ayah={recordingAyah}
        surahName={language === 'ar' ? surah.nameArabic : surah.nameTransliteration}
        reciterAudioUrl={
          recordingAyah
            ? quranService.getAudioUrl(
                parentSettings.reciterId,
                surah.number,
                recordingAyah.number
              )
            : undefined
        }
        language={language}
        onClose={() => setRecordingAyah(null)}
        onAwardReward={() => {
          addSurahStars(surah.number, 1);
          addStars(2);
          addGems(1);
          setShowCelebration(true);
        }}
      />

      {/* Tajweed Color Guide Modal (QUR-4) */}
      <TajweedLegendModal
        visible={showTajweedModal}
        language={language}
        onClose={() => setShowTajweedModal(false)}
      />

      {/* Tafsir Bottom Sheet (A4) */}
      <AyahTafsirSheet
        visible={tafsirSheetAyahNo !== null}
        surahNumber={surahNumber}
        surahNameArabic={surah.nameArabic}
        ayahNumber={tafsirSheetAyahNo || 1}
        totalAyahs={surah.ayahs.length}
        ayahText={surah.ayahs.find((a) => a.number === tafsirSheetAyahNo)?.textUthmani}
        onDismiss={() => setTafsirSheetAyahNo(null)}
        onSelectAyah={(newAyahNo) => setTafsirSheetAyahNo(newAyahNo)}
      />

      {/* Verse Coloring Modal (B1) */}
      <VerseColoringModal
        visible={coloringVerseNo !== null}
        surahNumber={surahNumber}
        verseNumber={coloringVerseNo || 1}
        currentColor={coloringVerseNo ? versesColorMap[coloringVerseNo] || null : null}
        onSelectColor={handleSelectVerseColor}
        onDismiss={() => setColoringVerseNo(null)}
      />

      {/* Unreviewed Surah Notice Modal */}
      {showUnreviewedNotice && (
        <Modal
          visible={showUnreviewedNotice}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUnreviewedNotice(false)}
        >
          <View style={styles.noticeOverlay}>
            <View style={styles.noticeModalCard}>
              <Ionicons name="sparkles" size={36} color="#D97706" />
              <Text style={styles.noticeModalTitle}>قَرِيبًا إِنْ شَاءَ اللَّهُ ✨</Text>
              <Text style={styles.noticeModalDesc}>
                وَضْعُ الْمَحْوِ التَّدْرِيجِيِّ قَادِمٌ لِهَذِهِ السُّورَةِ بَعْدَ اعْتِمَادِ مُرَاجَعَتِهَا الْمُعْتَمَدَةِ.
                يُمْكِنُكَ حِفْظُهَا الْآنَ عَبْرَ «اسْمَعْ وَرَدِّدْ» أَوْ «وَضْعِ صَفْحَةِ الْمُصْحَفِ».
              </Text>
              <TouchableOpacity
                style={styles.noticeModalCloseBtn}
                onPress={() => setShowUnreviewedNotice(false)}
              >
                <Text style={styles.noticeModalCloseBtnText}>حَسَنًا</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  revelationTypeBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  revelationTypeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  storyShowcaseCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    gap: 6,
    overflow: 'hidden',
  },
  storyShowcaseHead: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyShowcaseTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#b45309',
  },
  storyShowcaseText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: '#78350f',
  },
  goldenLessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  goldenLessonTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  goldenLessonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
    flex: 1,
  },
  storyCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginTop: 2,
  },
  storyCardBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400e',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  downloadBtnActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#34d399',
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
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
  openInMushafChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  openInMushafChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  memorizeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  memorizeChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  tajweedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  tajweedChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  tajweedChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },
  tajweedChipTextActive: {
    color: '#FFFFFF',
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
  ayahPlayBtn: {
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
  ayahPlayBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  ayahPlayBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  ayahPlayBtnTextActive: {
    color: '#FFFFFF',
  },
  ayahWordsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  ayahWordsBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
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
  voiceRecordBtn: {
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
  voiceRecordBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
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
  // Hifz Completion Milestone Card Styles
  surahHifzMilestoneCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: 100, // space above audio bar
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  surahCompletedBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  surahCompletedTrophyBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  surahCompletedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 6,
  },
  surahCompletedSubtitle: {
    fontSize: 13,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  surahCompletedPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  surahCompletedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  surahCompletedPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  surahPendingBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  surahPendingHeaderRow: {
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.sm,
  },
  surahPendingIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  surahPendingTextCol: {
    flex: 1,
  },
  surahPendingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  surahPendingSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  surahProgressBarTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  surahProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  surahPendingNotice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  confirmHifzButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  confirmHifzButtonActive: {
    backgroundColor: '#059669',
  },
  confirmHifzButtonDone: {
    backgroundColor: '#10B981',
  },
  confirmHifzButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  certificateOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#047857',
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md,
    ...SHADOWS.medium,
  },
  certificateOpenBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  etiquetteHintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: SPACING.sm,
    gap: 8,
  },
  etiquetteHintText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  etiquetteDismissBtn: {
    padding: 3,
    borderRadius: RADIUS.full,
    backgroundColor: '#D1FAE5',
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.lg,
    padding: 4,
    marginVertical: SPACING.xs,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.soft,
  },
  modeTabActiveFade: {
    backgroundColor: '#059669',
    ...SHADOWS.soft,
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  fadeToolbarCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    gap: 10,
    ...SHADOWS.soft,
  },
  fadeProgressSection: {
    gap: 4,
  },
  fadeProgressHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fadeProgressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  fadeProgressPercent: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  fadeProgressBarTrack: {
    height: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fadeProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  fadeActionsRow: {
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  fadeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    minHeight: 44,
    ...SHADOWS.soft,
  },
  fadeMoreBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  fadeBtnDisabled: {
    opacity: 0.5,
  },
  wordsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 6,
    minHeight: 44,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
    minWidth: 16,
    textAlign: 'center',
  },
  undoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    minHeight: 44,
  },
  undoBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  resetHiddenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    minHeight: 44,
  },
  resetHiddenBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  allHiddenBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  allHiddenBannerText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  fadeHintRow: {
    alignItems: 'center',
    gap: 5,
  },
  fadeHintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  fontSizeControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.full,
    padding: 2,
    gap: 2,
  },
  fontBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.text,
  },
  quranTextCardWrapper: {
    width: '100%',
    paddingVertical: SPACING.xs,
  },
  noticeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  noticeModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.medium,
  },
  noticeModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#92400E',
    textAlign: 'center',
  },
  noticeModalDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  noticeModalCloseBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },
  noticeModalCloseBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
