// Listen & Repeat: Advanced Memorization Mode (PRD §7.3.4 & QUR-2)
// Word-by-word progressive hiding (0%, 25%, 50%, 100%) · Tap to reveal · Repeat cycles · Self check
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

type HidePercentage = 0 | 25 | 50 | 100;

export default function ListenAndRepeatScreen() {
  const router = useRouter();
  const { surahId } = useLocalSearchParams();
  const surahNumber = parseInt(String(surahId || '112'), 10);

  const { language, setAyahStatus, addSurahStars, parentSettings, addStars } = useAppStore();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  // Load surah (defaults to Al-Ikhlas or the passed Surah)
  const surah = useMemo(() => {
    return quranService.getSurahSync(surahNumber) || quranService.getSurahSync(112);
  }, [surahNumber]);

  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [hidePercentage, setHidePercentage] = useState<HidePercentage>(0);
  const [revealedWords, setRevealedWords] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeatCycle, setCurrentRepeatCycle] = useState(1);

  const repeatCountRef = useRef(3);
  const currentRepeatCycleRef = useRef(1);

  useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);

  useEffect(() => {
    currentRepeatCycleRef.current = currentRepeatCycle;
  }, [currentRepeatCycle]);

  const currentAyah = surah.ayahs[currentAyahIdx] || surah.ayahs[0];

  // Split Ayah into words for progressive hiding
  const words = useMemo(() => {
    return currentAyah.textUthmani.trim().split(/\s+/);
  }, [currentAyah]);

  const isWordInitiallyHidden = (index: number): boolean => {
    if (hidePercentage === 0) return false;
    if (hidePercentage === 100) return true;
    if (hidePercentage === 50) return index % 2 === 1;
    if (hidePercentage === 25) return index % 4 === 1;
    return false;
  };

  const toggleWordReveal = (index: number) => {
    const key = `${currentAyahIdx}_${hidePercentage}_${index}`;
    setRevealedWords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const playCurrentAyah = async (repeatCycle: number = 1) => {
    setIsPlaying(true);
    setCurrentRepeatCycle(repeatCycle);
    currentRepeatCycleRef.current = repeatCycle;

    const audioUrl = quranService.getAudioUrl(
      parentSettings.reciterId,
      surah.number,
      currentAyah.number
    );
    await audioService.playAyah(audioUrl, 1.0, (status) => {
      if (status.error) {
        setIsPlaying(false);
        return;
      }
      if (status.didJustFinish) {
        const targetRepeat = repeatCountRef.current;
        const currentCycle = currentRepeatCycleRef.current;
        if (currentCycle < targetRepeat) {
          playCurrentAyah(currentCycle + 1);
        } else {
          setIsPlaying(false);
        }
      } else if (status.isPlaying !== undefined) {
        setIsPlaying(status.isPlaying);
      }
    });
  };

  const handlePauseAudio = async () => {
    await audioService.pause();
    setIsPlaying(false);
  };

  const handleRestartAudio = async () => {
    await audioService.stop();
    await playCurrentAyah(1);
  };

  // Self check answer (PRD §7.3.4: "هل حفظتها؟" with Yes / Try again)
  const handleSelfCheckYes = () => {
    setAyahStatus(surah.number, currentAyah.number, 'memorized');
    addStars(1);

    if (currentAyahIdx < surah.ayahs.length - 1) {
      setCurrentAyahIdx(currentAyahIdx + 1);
    } else {
      // Completed full surah memorization test!
      addSurahStars(surah.number, 3);
      setShowCelebration(true);
    }
  };

  const handleSelfCheckTryAgain = () => {
    // Replay audio and encourage the child
    handleRestartAudio();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        title={isAr ? `تحفيظ سورة ${surah.nameArabic}` : `Memorize Surah ${surah.nameTransliteration}`}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Surah & Progress Chip */}
        <View style={styles.topBadgeRow}>
          <View style={styles.surahTagPill}>
            <Ionicons name="book" size={16} color="#059669" />
            <Text style={styles.surahTag}>
              {isAr ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
            </Text>
          </View>
          <View style={styles.counterTagPill}>
            <Text style={styles.counterTag}>
              {isAr ? `آية ${currentAyahIdx + 1} من ${surah.ayahs.length}` : `Ayah ${currentAyahIdx + 1} of ${surah.ayahs.length}`}
            </Text>
          </View>
        </View>

        {/* PROGRESSIVE WORD HIDING SELECTOR (PRD §7.3.4 & QUR-2) */}
        <View style={styles.hidingLevelCard}>
          <Text style={styles.hidingLevelTitle}>
            {isAr ? 'درجة إخفاء الكلمات للاختبار والتثبيت 🧠' : 'Progressive Word Hiding Level 🧠'}
          </Text>
          <View style={styles.hidingChipsRow}>
            {[
              { val: 0, labelAr: '٠٪ (ظاهرة)', labelEn: '0% (Visible)' },
              { val: 25, labelAr: '٢٥٪ (سهل)', labelEn: '25% (Easy)' },
              { val: 50, labelAr: '٥٠٪ (متوسط)', labelEn: '50% (Medium)' },
              { val: 100, labelAr: '١٠٠٪ (تسميع)', labelEn: '100% (Full)' },
            ].map((chip) => {
              const active = hidePercentage === chip.val;
              return (
                <TouchableOpacity
                  key={chip.val}
                  style={[styles.hidingChip, active && styles.hidingChipActive]}
                  onPress={() => setHidePercentage(chip.val as HidePercentage)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.hidingChipText, active && styles.hidingChipTextActive]}>
                    {isAr ? chip.labelAr : chip.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.hidingHelpHint}>
            {hidePercentage > 0
              ? (isAr ? '💡 انقر فوق أي كلمة مخفية لإظهارها إذا نسيتها!' : '💡 Tap any hidden word to reveal it if you need help!')
              : (isAr ? 'اقرأ الآية بوضوح واستمع إليها قبل بدء الإخفاء' : 'Read and listen to the Ayah before hiding words')}
          </Text>
        </View>

        {/* INTERACTIVE AYAH CARD WITH TAP-TO-REVEAL */}
        <View style={styles.ayahCard}>
          {/* Audio repeat info banner */}
          <View style={styles.repeatBadgeRow}>
            <View style={styles.repeatCyclePill}>
              <Ionicons name="repeat" size={14} color="#059669" />
              <Text style={styles.repeatCycleText}>
                {isAr
                  ? `تكرار: ${currentRepeatCycle} من ${repeatCount}`
                  : `Cycle: ${currentRepeatCycle} / ${repeatCount}`}
              </Text>
            </View>

            {/* Repeat count options */}
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
                  <Text style={[styles.cntChipText, repeatCount === cnt && styles.cntChipTextActive]}>
                    {cnt}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* WORDS DISPLAY AREA */}
          <View style={styles.wordsContainer}>
            {words.map((word, idx) => {
              const hidden = isWordInitiallyHidden(idx);
              const isRevealed = Boolean(
                revealedWords[`${currentAyahIdx}_${hidePercentage}_${idx}`]
              );
              const shouldShowWord = !hidden || isRevealed;

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    if (hidden) toggleWordReveal(idx);
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
          </View>

          {/* PLAYBACK CONTROLS */}
          <View style={styles.playbackRow}>
            {/* Replay Button */}
            <TouchableOpacity
              style={styles.controlSecBtn}
              onPress={handleRestartAudio}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="#059669" />
              <Text style={styles.controlSecBtnText}>
                {isAr ? 'إعادة' : 'Restart'}
              </Text>
            </TouchableOpacity>

            {/* Play/Pause Button */}
            {isPlaying ? (
              <TouchableOpacity
                style={[styles.controlMainBtn, styles.controlPauseBtn]}
                onPress={handlePauseAudio}
                activeOpacity={0.85}
              >
                <Ionicons name="pause" size={26} color="#FFFFFF" />
                <Text style={styles.controlMainBtnText}>
                  {isAr ? 'إيقاف مؤقت' : 'Pause'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.controlMainBtn, styles.controlPlayBtn]}
                onPress={() => playCurrentAyah(currentRepeatCycle)}
                activeOpacity={0.85}
              >
                <Ionicons name="play" size={26} color="#FFFFFF" style={{ marginLeft: 2 }} />
                <Text style={styles.controlMainBtnText}>
                  {isAr ? 'استمع وكرر' : 'Play & Repeat'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Next Ayah */}
            <TouchableOpacity
              style={styles.controlSecBtn}
              onPress={() => {
                audioService.stop();
                setIsPlaying(false);
                if (currentAyahIdx < surah.ayahs.length - 1) {
                  setCurrentAyahIdx(currentAyahIdx + 1);
                  setRevealedWords({});
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="play-skip-forward" size={20} color="#059669" />
              <Text style={styles.controlSecBtnText}>
                {isAr ? 'التالية' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SELF-CHECK CARD (PRD §7.3.4: "هل حفظتها؟") */}
        <View style={styles.selfCheckCard}>
          <Text style={styles.selfCheckQuestion}>
            {isAr ? 'هل حفظت هذه الآية المباركة؟ 🌸' : 'Did you memorize this noble Ayah? 🌸'}
          </Text>
          <Text style={styles.selfCheckSub}>
            {isAr
              ? 'اختر بصدق لتقييم حفظك ونيل النجوم المباركة:'
              : 'Choose honestly to track your progress and earn stars:'}
          </Text>

          <View style={styles.selfCheckButtonsRow}>
            {/* Try again button */}
            <TouchableOpacity
              style={[styles.checkBtn, styles.checkBtnRepeat]}
              onPress={handleSelfCheckTryAgain}
              activeOpacity={0.85}
            >
              <Ionicons name="repeat" size={22} color="#D97706" />
              <Text style={styles.checkBtnRepeatText}>
                {isAr ? 'سأكرر وأحاول ثانية 🔁' : 'I will repeat again 🔁'}
              </Text>
            </TouchableOpacity>

            {/* Yes memorized button */}
            <TouchableOpacity
              style={[styles.checkBtn, styles.checkBtnYes]}
              onPress={handleSelfCheckYes}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              <Text style={styles.checkBtnYesText}>
                {isAr ? 'نعم، حفظتها بحمد الله! 🌟' : 'Yes, memorized! 🌟'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Completion Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={3}
        gemsEarned={6}
        title={t.congratulations}
        subtitle={
          isAr
            ? `ما شاء الله تبارك الله! أكملت حفظ ومراجعة سورة ${surah.nameArabic}`
            : `Masha’Allah! Completed memorization test of Surah ${surah.nameTransliteration}`
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
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  surahTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  surahTag: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064E3B',
  },
  counterTagPill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  counterTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
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
    gap: 8,
    flexWrap: 'wrap',
  },
  hidingChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  hidingHelpHint: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  // Ayah Card
  ayahCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
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

  // Words display
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: SPACING.md,
    minHeight: 120,
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

  // Playback Row
  playbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  controlSecBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: '#F0FDF4',
    gap: 2,
  },
  controlSecBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  controlMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIUS.full,
    gap: 8,
    ...SHADOWS.sm,
  },
  controlPlayBtn: {
    backgroundColor: '#059669',
  },
  controlPauseBtn: {
    backgroundColor: '#DC2626',
  },
  controlMainBtnText: {
    fontSize: 14,
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
  },
  selfCheckQuestion: {
    fontSize: 16,
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
});
