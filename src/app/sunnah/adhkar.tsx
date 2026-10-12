// adhkar.tsx — Interactive Morning & Evening Adhkar for Kids (أذكار الصباح والمساء التفاعلية)
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MORNING_ADHKAR, EVENING_ADHKAR, AdhkarItem } from '@/data/adhkarData';
import { audioService } from '@/services/audioService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import StarRewardCelebration from '@/components/StarRewardCelebration';

export default function AdhkarScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  // Active period: 'morning' or 'evening'
  const [activePeriod, setActivePeriod] = useState<'morning' | 'evening'>('morning');
  // State tracking count per adhkar item
  const [counts, setCounts] = useState<Record<string, number>>({});
  // Audio playback state
  const [playingAdhkarId, setPlayingAdhkarId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const currentList = activePeriod === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioService.stopDua();
    };
  }, []);

  const handleIncrement = (item: AdhkarItem) => {
    const currentCount = counts[item.id] || 0;
    if (currentCount >= item.repeatCount) return;

    // Haptic feedback
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(40);
      } catch (_) {}
    }

    const nextCount = currentCount + 1;
    setCounts((prev) => ({ ...prev, [item.id]: nextCount }));

    // If just completed this dhikr
    if (nextCount === item.repeatCount) {
      addStars(1);
      addGems(2);
      setShowCelebration(true);
    }
  };

  const handleResetCard = (itemId: string) => {
    setCounts((prev) => ({ ...prev, [itemId]: 0 }));
  };

  const handleToggleAudio = async (item: AdhkarItem) => {
    setAudioError(null);
    if (playingAdhkarId === item.id) {
      await audioService.stopDua();
      setPlayingAdhkarId(null);
      return;
    }

    setPlayingAdhkarId(item.id);
    await audioService.playDua(item.arabicText, (status) => {
      if (status.didJustFinish) {
        setPlayingAdhkarId(null);
        addStars(1);
        setShowCelebration(true);
      } else if (status.error) {
        setPlayingAdhkarId(null);
        setAudioError(
          isAr
            ? 'تعذر تشغيل الصوت، تأكد من الاتصال بالإنترنت'
            : 'Could not play audio. Please check internet connection'
        );
      } else if (!status.isPlaying) {
        setPlayingAdhkarId(null);
      }
    });
  };

  // Completed items count in current period
  const completedCount = currentList.filter(
    (item) => (counts[item.id] || 0) >= item.repeatCount
  ).length;
  const progressRatio = currentList.length > 0 ? completedCount / currentList.length : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header
          showBack
          fallbackRoute="/sunnah"
          title={isAr ? 'أذكار الصباح والمساء ☀️🌙' : 'Morning & Evening Adhkar'}
        />

        {/* Hero Period Banner & Tabs */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={
              activePeriod === 'morning'
                ? ['#F59E0B', '#D97706', '#B45309']
                : ['#312E81', '#1E1B4B', '#0F172A']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Top Period Selector Tabs */}
            <View style={[styles.tabsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'morning' && styles.periodTabActiveMorning,
                ]}
                onPress={() => setActivePeriod('morning')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="sunny"
                  size={18}
                  color={activePeriod === 'morning' ? '#92400E' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'morning' && styles.periodTabTextActiveMorning,
                  ]}
                >
                  {isAr ? 'أذكار الصباح ☀️' : 'Morning Adhkar ☀️'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'evening' && styles.periodTabActiveEvening,
                ]}
                onPress={() => setActivePeriod('evening')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="moon"
                  size={18}
                  color={activePeriod === 'evening' ? '#312E81' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'evening' && styles.periodTabTextActiveEvening,
                  ]}
                >
                  {isAr ? 'أذكار المساء 🌙' : 'Evening Adhkar 🌙'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Action Bar: Tasbih Shortcut + Progress */}
            <View style={[styles.quickBar, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <View style={styles.progressSummaryCol}>
                <Text style={styles.progressSummaryText}>
                  {isAr
                    ? `إنجاز ${completedCount} من ${currentList.length} أذكار مباركة`
                    : `Completed ${completedCount} of ${currentList.length} Adhkars`}
                </Text>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.round(progressRatio * 100)}%`,
                        backgroundColor: activePeriod === 'morning' ? '#FDE68A' : '#A78BFA',
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Direct Tasbih Rosary Button */}
              <TouchableOpacity
                style={[styles.tasbihShortcutBtn, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
                onPress={() => router.push('/sunnah/tasbih')}
                activeOpacity={0.8}
              >
                <Ionicons name="finger-print" size={16} color="#0D9488" />
                <Text style={styles.tasbihShortcutText}>
                  {isAr ? 'مسبحة الأذكار 📿' : 'Tasbih 📿'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {audioError && (
          <View style={styles.audioErrorBanner}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.audioErrorText}>{audioError}</Text>
          </View>
        )}

        {/* Adhkar Cards List */}
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
        >
          {currentList.map((item, index) => {
            const currentCount = counts[item.id] || 0;
            const isCompleted = currentCount >= item.repeatCount;
            const isAudioPlaying = playingAdhkarId === item.id;

            return (
              <View
                key={item.id}
                style={[
                  styles.adhkarCard,
                  isCompleted && styles.adhkarCardCompleted,
                ]}
              >
                {/* Header Row: Index, Title, Audio & Source */}
                <View
                  style={[
                    styles.cardHeaderRow,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View style={styles.indexBadge}>
                    <Text style={styles.indexBadgeText}>{index + 1}</Text>
                  </View>

                  <View style={{ flex: 1, marginHorizontal: SPACING.sm }}>
                    <Text
                      style={[
                        styles.cardTitle,
                        { textAlign: isAr ? 'right' : 'left' },
                      ]}
                    >
                      {isAr ? item.titleAr : item.titleEn}
                    </Text>
                    <Text
                      style={[
                        styles.sourceBadgeText,
                        { textAlign: isAr ? 'right' : 'left' },
                      ]}
                    >
                      {item.source}
                    </Text>
                  </View>

                  {/* Audio Play/Pause Button */}
                  <TouchableOpacity
                    style={[
                      styles.audioPlayBtn,
                      isAudioPlaying && styles.audioPlayBtnActive,
                    ]}
                    onPress={() => handleToggleAudio(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isAudioPlaying ? 'pause' : 'volume-high'}
                      size={20}
                      color={isAudioPlaying ? '#FFFFFF' : COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Arabic Text (Tashkeel) */}
                <View style={styles.arabicBox}>
                  <Text style={styles.arabicText}>{item.arabicText}</Text>
                </View>

                {/* English Transliteration / Translation if en */}
                {!isAr && (
                  <View style={styles.englishBox}>
                    <Text style={styles.transliterationText}>
                      {item.transliteration}
                    </Text>
                    <Text style={styles.translationText}>
                      {item.translationEn}
                    </Text>
                  </View>
                )}

                {/* Virtue & Reward Note */}
                <View
                  style={[
                    styles.virtueBadgeBox,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  <Ionicons name="sparkles" size={15} color="#059669" />
                  <Text
                    style={[
                      styles.virtueText,
                      { textAlign: isAr ? 'right' : 'left' },
                    ]}
                  >
                    {isAr ? item.rewardAr : item.rewardEn}
                  </Text>
                </View>

                {/* Interactive Counter & Completion Section */}
                <View
                  style={[
                    styles.counterActionRow,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  {/* Big Tap Button to Advance Count */}
                  <TouchableOpacity
                    style={[
                      styles.tapCounterBtn,
                      isCompleted ? styles.tapCounterBtnDone : styles.tapCounterBtnActive,
                    ]}
                    onPress={() => handleIncrement(item)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'finger-print'}
                      size={24}
                      color="#FFFFFF"
                    />
                    <Text style={styles.tapCounterBtnText}>
                      {isCompleted
                        ? isAr
                          ? 'مكتمل بنجاح! أحسنت 🌟'
                          : 'Completed! Well Done 🌟'
                        : isAr
                        ? `كرر الذكر (${currentCount} / ${item.repeatCount})`
                        : `Repeat Dhikr (${currentCount} / ${item.repeatCount})`}
                    </Text>
                  </TouchableOpacity>

                  {/* Reset Counter Button */}
                  {currentCount > 0 && (
                    <TouchableOpacity
                      style={styles.resetCounterBtn}
                      onPress={() => handleResetCard(item.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <AppBottomNav />
      </View>

      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={1}
        gemsEarned={2}
        title={isAr ? 'ذكر مبارك! 🌟' : 'Blessed Dhikr! 🌟'}
        subtitle={isAr ? 'ما شاء الله! نور وبركة لقلبك الطيب 🌿' : 'Masha’Allah! Light and blessing for your heart 🌿'}
        onDismiss={() => setShowCelebration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appContainer: {
    flex: 1,
  },
  heroSection: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroGradient: {
    padding: SPACING.md,
  },
  tabsRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  periodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  periodTabActiveMorning: {
    backgroundColor: '#FEF3C7',
  },
  periodTabActiveEvening: {
    backgroundColor: '#E0E7FF',
  },
  periodTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  periodTabTextActiveMorning: {
    color: '#92400E',
  },
  periodTabTextActiveEvening: {
    color: '#312E81',
  },
  quickBar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  progressSummaryCol: {
    flex: 1,
  },
  progressSummaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tasbihShortcutBtn: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    gap: 4,
    ...SHADOWS.soft,
  },
  tasbihShortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  audioErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  audioErrorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
    flex: 1,
  },
  scrollList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
    gap: SPACING.md,
  },
  adhkarCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  adhkarCardCompleted: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  cardHeaderRow: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sourceBadgeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  audioPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayBtnActive: {
    backgroundColor: COLORS.primary,
  },
  arabicBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  arabicText: {
    fontSize: 19,
    lineHeight: 34,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  englishBox: {
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  transliterationText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  translationText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  virtueBadgeBox: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    marginVertical: SPACING.sm,
  },
  virtueText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
    lineHeight: 18,
  },
  counterActionRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  tapCounterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.xl,
    ...SHADOWS.soft,
  },
  tapCounterBtnActive: {
    backgroundColor: '#2563EB',
  },
  tapCounterBtnDone: {
    backgroundColor: '#059669',
  },
  tapCounterBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  resetCounterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
