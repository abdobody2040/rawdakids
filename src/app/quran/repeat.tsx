// Listen & Repeat: Memorization Mode (Q7)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { quranService } from '@/services/quranService';
import { audioService } from '@/services/audioService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';

export default function ListenAndRepeatScreen() {
  const router = useRouter();
  const { language, setAyahStatus, addSurahStars, parentSettings } = useAppStore();
  const t = TRANSLATIONS[language];

  // Default to Surah Al-Ikhlas (112) for quick delightful memorization
  const surah = quranService.getSurahSync(112);
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [isTextHidden, setIsTextHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeatCycle, setCurrentRepeatCycle] = useState(1);

  const repeatCountRef = React.useRef(3);
  const currentRepeatCycleRef = React.useRef(1);

  React.useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);

  React.useEffect(() => {
    currentRepeatCycleRef.current = currentRepeatCycle;
  }, [currentRepeatCycle]);

  const currentAyah = surah.ayahs[currentAyahIdx] || surah.ayahs[0];

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

  const handleSelfRate = (rating: 'great' | 'good' | 'practice') => {
    if (rating === 'great') {
      setAyahStatus(surah.number, currentAyah.number, 'memorized');
    } else {
      setAyahStatus(surah.number, currentAyah.number, 'learning');
    }

    if (currentAyahIdx < surah.ayahs.length - 1) {
      setCurrentAyahIdx(currentAyahIdx + 1);
      setIsTextHidden(false);
    } else {
      // Completed full surah memorization test!
      addSurahStars(surah.number, 3);
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header showBack title={t.memorizationMode} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Surah & Ayah Progress Badge */}
        <View style={styles.topBadgeRow}>
          <Text style={styles.surahTag}>
            {language === 'ar' ? `سورة ${surah.nameArabic}` : `Surah ${surah.nameTransliteration}`}
          </Text>
          <Text style={styles.counterTag}>
            {currentAyahIdx + 1} / {surah.ayahs.length}
          </Text>
        </View>

        {/* Listen Card */}
        <View style={styles.card}>
          {/* Main Interactive Controls: Play, Pause, Replay */}
          <View style={styles.playerControlsRow}>
            {/* Replay Button */}
            <TouchableOpacity
              style={styles.playerSecBtn}
              onPress={handleRestartAudio}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={22} color={COLORS.primary} />
              <Text style={styles.playerSecBtnText}>
                {language === 'ar' ? 'إعادة' : 'Restart'}
              </Text>
            </TouchableOpacity>

            {/* Play / Pause Toggle Button */}
            {isPlaying ? (
              <TouchableOpacity
                style={[styles.playerMainBtn, styles.playerPauseBtn]}
                onPress={handlePauseAudio}
                activeOpacity={0.85}
              >
                <Ionicons name="pause" size={32} color="#FFFFFF" />
                <Text style={styles.playerMainBtnText}>
                  {language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.playerMainBtn, styles.playerPlayBtn]}
                onPress={() => playCurrentAyah(currentRepeatCycle)}
                activeOpacity={0.85}
              >
                <Ionicons name="play" size={32} color="#FFFFFF" style={{ marginLeft: 3 }} />
                <Text style={styles.playerMainBtnText}>
                  {language === 'ar' ? 'استماع وتكرار' : 'Play & Repeat'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Next Ayah Quick Step */}
            <TouchableOpacity
              style={styles.playerSecBtn}
              onPress={() => {
                audioService.stop();
                setIsPlaying(false);
                if (currentAyahIdx < surah.ayahs.length - 1) {
                  setCurrentAyahIdx(currentAyahIdx + 1);
                  setIsTextHidden(false);
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="play-skip-forward" size={22} color={COLORS.primary} />
              <Text style={styles.playerSecBtnText}>
                {language === 'ar' ? 'التالية' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.instructionText}>
            {isPlaying
              ? language === 'ar'
                ? `استمع بخشوع... (تكرار ${currentRepeatCycle} من ${repeatCount})`
                : `Listening... (Repeat ${currentRepeatCycle}/${repeatCount})`
              : language === 'ar'
              ? 'اضغط زر التشغيل للبدء أو التكرار'
              : 'Tap Play to start repetition'}
          </Text>

          {/* Repeat Selection Chips */}
          <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
            {[1, 3, 5].map((cnt) => (
              <TouchableOpacity
                key={cnt}
                style={[
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: repeatCount === cnt ? COLORS.primary : COLORS.cardAlt,
                  },
                ]}
                onPress={() => {
                  setRepeatCount(cnt);
                  repeatCountRef.current = cnt;
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: repeatCount === cnt ? '#ffffff' : COLORS.textSecondary,
                  }}
                >
                  {cnt}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ayah Text Box */}
          <View style={styles.textBox}>
            {isTextHidden ? (
              <View style={styles.hiddenNotice}>
                <Ionicons name="eye-off" size={32} color={COLORS.primary} />
                <Text style={styles.hiddenNoticeText}>
                  {language === 'ar'
                    ? 'الآية مخفية! اقرأها الآن من حفظك يا بطل'
                    : 'Text is hidden! Recite now from memory, champion'}
                </Text>
              </View>
            ) : (
              <Text style={styles.uthmaniText}>{currentAyah.textUthmani}</Text>
            )}
          </View>

          {/* Hide / Show Text Toggle */}
          <TouchableOpacity
            style={styles.toggleTextBtn}
            onPress={() => setIsTextHidden(!isTextHidden)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isTextHidden ? 'eye' : 'eye-off'}
              size={18}
              color={COLORS.primaryDark}
            />
            <Text style={styles.toggleTextBtnLabel}>
              {isTextHidden ? t.showAyah : t.hideAyah}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Self-Rating Feedback Block */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>{t.selfRateTitle}</Text>
          <View style={styles.ratingButtonsRow}>
            {/* Great */}
            <TouchableOpacity
              style={[styles.ratingBtn, styles.ratingGreat]}
              onPress={() => handleSelfRate('great')}
              activeOpacity={0.8}
            >
              <Text style={styles.ratingEmoji}>😊</Text>
              <Text style={styles.ratingBtnLabel}>{t.rateGreat}</Text>
            </TouchableOpacity>

            {/* Good */}
            <TouchableOpacity
              style={[styles.ratingBtn, styles.ratingGood]}
              onPress={() => handleSelfRate('good')}
              activeOpacity={0.8}
            >
              <Text style={styles.ratingEmoji}>🙂</Text>
              <Text style={styles.ratingBtnLabel}>{t.rateGood}</Text>
            </TouchableOpacity>

            {/* Practice */}
            <TouchableOpacity
              style={[styles.ratingBtn, styles.ratingPractice]}
              onPress={() => handleSelfRate('practice')}
              activeOpacity={0.8}
            >
              <Text style={styles.ratingEmoji}>😐</Text>
              <Text style={styles.ratingBtnLabel}>{t.ratePractice}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={3}
        gemsEarned={6}
        title={t.congratulations}
        subtitle={
          language === 'ar'
            ? `ما شاء الله تبارك الله! أكملت مراجعة سورة ${surah.nameArabic}`
            : `Masha’Allah! Completed Surah ${surah.nameTransliteration} memorization test`
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
    backgroundColor: COLORS.background,
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  surahTag: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  counterTag: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
    marginBottom: SPACING.lg,
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  playerMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
  },
  playerPlayBtn: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glow(COLORS.primary),
  },
  playerPauseBtn: {
    backgroundColor: '#DC2626',
    ...SHADOWS.glow('#DC2626'),
  },
  playerMainBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  playerSecBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playerSecBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  textBox: {
    width: '100%',
    minHeight: 120,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  uthmaniText: {
    fontSize: TYPOGRAPHY.quranSize,
    lineHeight: TYPOGRAPHY.quranLineHeight,
    color: COLORS.quranText,
    textAlign: 'center',
    fontWeight: '600',
  },
  hiddenNotice: {
    alignItems: 'center',
    gap: 8,
  },
  hiddenNoticeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  toggleTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
    backgroundColor: COLORS.primaryLight + '33',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  toggleTextBtnLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  ratingCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.soft,
  },
  ratingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  ratingButtonsRow: {
    gap: SPACING.sm,
  },
  ratingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  ratingGreat: {
    backgroundColor: COLORS.successLight + '44',
    borderColor: COLORS.success,
  },
  ratingGood: {
    backgroundColor: COLORS.warningLight + '44',
    borderColor: COLORS.warning,
  },
  ratingPractice: {
    backgroundColor: COLORS.cardAlt,
    borderColor: COLORS.border,
  },
  ratingEmoji: {
    fontSize: 24,
  },
  ratingBtnLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
});
