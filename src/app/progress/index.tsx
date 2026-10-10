// My Progress Screen (Section 8 & 9 - إنجازاتي)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import KidAvatar from '@/components/KidAvatar';

const METRIC_IMAGES = {
  quran: require('../../../assets/images/metric-quran.jpg'),
  sunnah: require('../../../assets/images/metric-sunnah.jpg'),
  prophets: require('../../../assets/images/metric-prophets.jpg'),
  streak: require('../../../assets/images/metric-streak.jpg'),
};

export default function MyProgressScreen() {
  const {
    language,
    profiles,
    activeProfileId,
    surahProgress,
    hadithProgress,
    storyProgress,
    streakCount,
    timeSpentTodaySec,
    parentSettings,
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const profile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Stats calculation
  const completedSurahs = Object.values(surahProgress).filter(
    (s) => s.isCompleted
  ).length;
  const completedHadiths = Object.values(hadithProgress).filter(
    (h) => h.completed
  ).length;
  const completedStories = Object.values(storyProgress).filter(
    (st) => st.completed
  ).length;

  const timeSpentMin = Math.round(timeSpentTodaySec / 60);
  const timeProgressPercent =
    parentSettings.dailyLimitMin > 0
      ? Math.min(100, Math.round((timeSpentMin / parentSettings.dailyLimitMin) * 100))
      : 100;


  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title={t.progress} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Child Profile Highlight Banner */}
        <View style={styles.profileBanner}>
          <KidAvatar avatar={profile.avatar} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.ageBandBadge}>
              {profile.ageBand === '4-6'
                ? t.ageBandExplorers
                : profile.ageBand === '7-9'
                ? t.ageBandLearners
                : t.ageBandMinds}
            </Text>
          </View>
        </View>

        {/* 4 Achievements Counters with 3D Visual Badges */}
        <View style={styles.achievementsGrid}>
          {/* Quran */}
          <View style={styles.achieveCard}>
            <View style={styles.metricImageContainer}>
              <Image
                source={METRIC_IMAGES.quran}
                style={styles.metricImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.achieveNum}>{completedSurahs}</Text>
            <Text style={styles.achieveLabel}>{t.quran}</Text>
          </View>

          {/* Sunnah */}
          <View style={styles.achieveCard}>
            <View style={styles.metricImageContainer}>
              <Image
                source={METRIC_IMAGES.sunnah}
                style={styles.metricImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.achieveNum}>{completedHadiths}</Text>
            <Text style={styles.achieveLabel}>{t.sunnah}</Text>
          </View>

          {/* Stories */}
          <View style={styles.achieveCard}>
            <View style={styles.metricImageContainer}>
              <Image
                source={METRIC_IMAGES.prophets}
                style={styles.metricImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.achieveNum}>{completedStories}</Text>
            <Text style={styles.achieveLabel}>{t.prophets}</Text>
          </View>

          {/* Streak */}
          <View style={styles.achieveCard}>
            <View style={styles.metricImageContainer}>
              <Image
                source={METRIC_IMAGES.streak}
                style={styles.metricImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.achieveNum}>{streakCount}</Text>
            <Text style={styles.achieveLabel}>{t.streakDays}</Text>
          </View>
        </View>

        {/* Daily Time & Balance Card */}
        <View style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Text style={styles.timeTitle}>{t.timeSpentToday}</Text>
            <Text style={styles.timeCounter}>
              {parentSettings.dailyLimitMin > 0
                ? `${timeSpentMin} / ${parentSettings.dailyLimitMin} ${t.minutes}`
                : `${timeSpentMin} ${t.minutes}`}
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${timeProgressPercent}%` },
              ]}
            />
          </View>

          <Text style={styles.timeSubtext}>
            {timeProgressPercent >= 100
              ? language === 'ar'
                ? 'رائع! وصلت إلى حد التعلم اليومي الموصى به من والديك'
                : 'Great job! You reached today’s recommended learning time'
              : language === 'ar'
              ? 'وقت تعليمي مبارك ومفيد'
              : 'Blessed and productive learning time'}
          </Text>
        </View>

        {/* Hifz Status Breakdown */}
        <View style={styles.hifzSummaryCard}>
          <Text style={styles.hifzTitle}>{t.hifzStatus}</Text>
          <View style={styles.hifzRow}>
            <View style={styles.hifzItem}>
              <View style={[styles.hifzDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.hifzCount}>{completedSurahs}</Text>
              <Text style={styles.hifzLabel}>{t.statusMemorized}</Text>
            </View>

            <View style={styles.hifzItem}>
              <View style={[styles.hifzDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.hifzCount}>
                {Object.keys(surahProgress).length - completedSurahs > 0
                  ? Object.keys(surahProgress).length - completedSurahs
                  : 0}
              </Text>
              <Text style={styles.hifzLabel}>{t.statusLearning}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  ageBandBadge: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  achieveCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  metricImageContainer: {
    width: 62,
    height: 62,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  metricImage: {
    width: '100%',
    height: '100%',
  },
  achieveNum: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  achieveLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  timeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  timeCounter: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginVertical: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  timeSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  hifzSummaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  hifzTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  hifzRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hifzItem: {
    alignItems: 'center',
  },
  hifzDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  hifzCount: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  hifzLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
