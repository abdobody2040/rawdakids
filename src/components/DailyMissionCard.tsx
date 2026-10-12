// Daily Mission Card (≤ 10 min loop - Flow E)
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';

export default function DailyMissionCard() {
  const router = useRouter();
  const { language, dailyHabitsDone, surahProgress, hadithProgress } = useAppStore();
  const t = TRANSLATIONS[language];

  // Check completions
  const isQuranDone = Object.values(surahProgress).some((s) => s.isCompleted);
  const isHadithDone = Object.values(hadithProgress).some((h) => h.completed);
  const isHabitDone = Object.values(dailyHabitsDone).some((v) => v);

  const completedCount =
    (isQuranDone ? 1 : 0) + (isHadithDone ? 1 : 0) + (isHabitDone ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);

  return (
    <LinearGradient
      colors={['#0F766E', '#14B8A6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.tag}>{t.dailyMission}</Text>
          <Text style={styles.subtitle}>{t.dailyMissionSub}</Text>
        </View>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeCountText}>{completedCount}/3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* 3 Mission Items */}
      <View style={styles.missionsList}>
        <TouchableOpacity
          style={styles.missionItem}
          onPress={() => router.push('/quran')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isQuranDone ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={isQuranDone ? '#34D399' : '#CCFBF1'}
          />
          <Text style={[styles.missionText, isQuranDone && styles.missionDoneText]}>
            {t.missionQuran}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.missionItem}
          onPress={() => router.push('/sunnah')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isHadithDone ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={isHadithDone ? '#34D399' : '#CCFBF1'}
          />
          <Text style={[styles.missionText, isHadithDone && styles.missionDoneText]}>
            {t.missionHadith}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.missionItem}
          onPress={() => router.push('/sunnah')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isHabitDone ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={isHabitDone ? '#34D399' : '#CCFBF1'}
          />
          <Text style={[styles.missionText, isHabitDone && styles.missionDoneText]}>
            {t.missionHabit}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    ...SHADOWS.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleArea: {
    flex: 1,
  },
  tag: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  subtitle: {
    fontSize: 12,
    color: '#CCFBF1',
    marginTop: 2,
  },
  badgeCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginVertical: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: RADIUS.full,
  },
  missionsList: {
    gap: 8,
    marginTop: 4,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  missionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  missionDoneText: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
});
