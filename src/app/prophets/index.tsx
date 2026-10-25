import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { contentService } from '@/services/contentService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { getLocalizedProphetMeta, getAnimalMiraclesBadge, getAnimalMiraclesTitle, getAnimalMiraclesSubtitle } from '@/services/multilingualContentService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import { storiesService, StoryReadRecord } from '@/services/storiesService';

const PROPHETS_CARAVAN_IMG = require('../../../assets/images/prophets-caravan.jpg');
const NAV_PROPHETS_IMG = require('../../../assets/images/nav-prophets-3d.jpg');

export default function ProphetsTimelineScreen() {
  const router = useRouter();
  const { language, activeProfileId, profiles } = useAppStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const childId = activeProfile?.id || 'child_default';

  const t = TRANSLATIONS[language];
  const prophets = contentService.getProphets();

  const [readMap, setReadMap] = useState<Record<string, StoryReadRecord>>({});

  useEffect(() => {
    storiesService.getReadStories(childId).then(setReadMap).catch(() => {});
  }, [childId]);

  const totalStories = prophets.length;
  const readCount = Object.keys(readMap).length;
  const percentRead = Math.round((readCount / totalStories) * 100);

  // Find first unread story in order
  const firstUnread = prophets.find((p) => !readMap[p.id]) || prophets[0];
  const firstUnreadMeta = firstUnread ? getLocalizedProphetMeta(firstUnread, language) : null;

  // Next badge target
  const { nextBadge, remaining } = storiesService.getNextBadgeTarget(readCount);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack title={t.prophets} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Read Counter Header Card (B4) */}
        <View
          style={styles.counterHeaderCard}
          // @ts-ignore
          role="img"
          aria-label={`قَرَأْتُ ${readCount} مِنْ ${totalStories} قِصَصٍ`}
        >
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.counterGradient}
          >
            <View style={styles.counterRow}>
              <View style={styles.counterBadge}>
                <Ionicons name="book" size={24} color="#FDE047" />
                <Text style={styles.counterRatioText}>
                  {readCount} / {totalStories}
                </Text>
              </View>
              <View style={styles.counterTextCol}>
                <Text style={styles.counterTitle}>
                  قَرَأْتُ {readCount} مِنْ {totalStories}
                </Text>
                <Text style={styles.counterSub}>
                  مِنْ قِصَصِ الْأَنْبِيَاءِ وَالْمُرْسَلِينَ عَلَيْهِمُ السَّلَامُ
                </Text>
              </View>
            </View>

            {/* Accessible Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${percentRead}%` }]} />
            </View>
          </LinearGradient>
        </View>

        {/* Next Badge Card */}
        {nextBadge && (
          <View style={styles.badgeHintCard}>
            <Ionicons name="ribbon" size={24} color="#D97706" />
            <View style={styles.badgeHintTextCol}>
              <Text style={styles.badgeHintTitle}>{nextBadge.titleArabic}</Text>
              <Text style={styles.badgeHintSub}>
                بَقِيَتْ {remaining} {remaining === 1 ? 'قِصَّةٌ وَاحِدَةٌ' : 'قِصَصٍ'} لِلْحُصُولِ عَلَى الْوِسَامِ وَ {nextBadge.rewardSprouts} نَبْتَةً 🌱
              </Text>
            </View>
          </View>
        )}

        {/* Main CTA: Read Next Story */}
        {firstUnreadMeta && (
          <TouchableOpacity
            style={styles.mainReadCta}
            onPress={() => router.push(`/prophets/${firstUnread.id}`)}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel={`اقْرَأْ قِصَّةَ ${firstUnreadMeta.name}`}
          >
            <LinearGradient
              colors={['#059669', '#047857']}
              style={styles.mainReadGradient}
            >
              <Ionicons
                name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
                size={22}
                color="#FFFFFF"
              />
              <Text style={styles.mainReadText}>
                {readCount === totalStories
                  ? `أَعِدْ قِرَاءَةَ قِصَّةِ ${firstUnreadMeta.name}`
                  : `اقْرَأْ قِصَّةَ نَبِيِّ اللَّهِ ${firstUnreadMeta.name}`}
              </Text>
              <Ionicons name="sparkles" size={20} color="#FDE047" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Caravan Hero Banner */}
        <View style={styles.heroBannerContainer}>
          <ImageBackground
            source={PROPHETS_CARAVAN_IMG}
            style={styles.heroBannerImage}
            imageStyle={{ borderRadius: RADIUS.xl }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(79, 70, 229, 0.88)', 'rgba(124, 58, 237, 0.94)']}
              style={styles.heroBannerOverlay}
            >
              <View style={styles.heroRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>{t.prophets}</Text>
                  <Text style={styles.heroDesc}>{t.prophetsDesc}</Text>
                </View>
                <View style={styles.hero3dBadgeBox}>
                  <Image
                    source={NAV_PROPHETS_IMG}
                    style={styles.hero3dBadgeImg}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Animal Miracles Feature Shortcut Banner */}
        <TouchableOpacity
          style={styles.animalsShortcutBanner}
          onPress={() => router.push('/animals' as any)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#059669', '#047857']}
            style={styles.animalsShortcutGradient}
          >
            <Text style={{ fontSize: 32 }}>🐾</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.animalsShortcutBadge}>
                <Ionicons name="sparkles" size={11} color="#FEF3C7" />
                <Text style={styles.animalsShortcutBadgeText}>
                  {getAnimalMiraclesBadge(language)}
                </Text>
              </View>
              <Text style={styles.animalsShortcutTitle}>
                {getAnimalMiraclesTitle(language)}
              </Text>
              <Text style={styles.animalsShortcutSub}>
                {getAnimalMiraclesSubtitle(language)}
              </Text>
            </View>
            <Ionicons
              name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.timelineHeading}>{t.prophetsTimeline}</Text>

        {/* Vertical Timeline Path */}
        <View style={styles.timelineList}>
          {prophets.map((prophet, index) => {
            const isRead = Boolean(readMap[prophet.id]);
            const isNextToRead = prophet.id === firstUnread?.id && !isRead;
            const meta = getLocalizedProphetMeta(prophet, language);

            return (
              <View key={prophet.id} style={styles.timelineItemRow}>
                {/* Timeline Node & Connecting Line */}
                <View style={styles.timelineAxis}>
                  <View
                    style={[
                      styles.axisNode,
                      isRead && styles.axisNodeCompleted,
                      isNextToRead && styles.axisNodeNext,
                    ]}
                  >
                    {isRead ? (
                      <Ionicons name="checkmark-sharp" size={16} color="#FFFFFF" />
                    ) : isNextToRead ? (
                      <Ionicons name="play" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.axisOrderText}>{prophet.order}</Text>
                    )}
                  </View>
                  {index < prophets.length - 1 && (
                    <View
                      style={[
                        styles.axisLine,
                        isRead && { backgroundColor: '#10B981' },
                      ]}
                    />
                  )}
                </View>

                {/* Prophet Story Card */}
                <TouchableOpacity
                  style={[
                    styles.prophetCard,
                    { borderLeftColor: prophet.themeColor },
                    isNextToRead && styles.prophetCardNext,
                  ]}
                  onPress={() => router.push(`/prophets/${prophet.id}`)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${meta.name} - ${isRead ? 'قَرَأْتُهَا' : isNextToRead ? 'اقْرَأِ الْآنَ' : 'لَمْ أَقْرَأْهَا'}`}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.nameRow}>
                      <Text style={styles.prophetName}>
                        {language === 'ar' ? `نبي الله ${meta.name}` : `${t.prophetPrefix} ${meta.name}`}
                      </Text>
                      <View style={styles.honorificBadge}>
                        <Text style={styles.honorificText}>
                          {meta.honorific}
                        </Text>
                      </View>
                    </View>

                    {/* Status Badge */}
                    {isRead && (
                      <View style={styles.completedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={COLORS.success}
                        />
                        <Text style={styles.completedBadgeText}>قَرَأْتُهَا ✨</Text>
                      </View>
                    )}
                    {isNextToRead && (
                      <View style={styles.nextBadgeChip}>
                        <Ionicons name="flash" size={14} color="#0284C7" />
                        <Text style={styles.nextBadgeText}>اقْرَأِ الْآنَ</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.titleBadge}>
                    {meta.titleBadge}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      📍 {meta.location}
                    </Text>
                    <Text style={styles.metaText}>
                      ⏳ {meta.era}
                    </Text>
                  </View>

                  <View style={styles.startRow}>
                    <Text style={styles.startText}>{t.startStory}</Text>
                    <Ionicons
                      name={
                        language === 'ar'
                          ? 'arrow-back-circle'
                          : 'arrow-forward-circle'
                      }
                      size={22}
                      color={prophet.themeColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <AppBottomNav />
      </View>
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
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroBannerContainer: {
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroBannerImage: {
    width: '100%',
  },
  heroBannerOverlay: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  hero3dBadgeBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd6fe',
    backgroundColor: '#ede9fe',
    ...SHADOWS.soft,
  },
  hero3dBadgeImg: {
    width: '100%',
    height: '100%',
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  timelineHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: SPACING.sm,
  },
  timelineList: {
    marginTop: SPACING.xs,
  },
  timelineItemRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  timelineAxis: {
    alignItems: 'center',
    width: 36,
  },
  axisNode: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  axisNodeCompleted: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  axisOrderText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  axisLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  prophetCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    ...SHADOWS.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prophetName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  honorificBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  honorificText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  titleBadge: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  metaRow: {
    gap: 2,
    marginBottom: SPACING.sm,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  startRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.xs,
  },
  startText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  animalsShortcutBanner: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  animalsShortcutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  animalsShortcutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  animalsShortcutBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FEF3C7',
  },
  animalsShortcutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  animalsShortcutSub: {
    fontSize: 11,
    color: '#D1FAE5',
  },
  counterHeaderCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  counterGradient: {
    padding: SPACING.md,
  },
  counterRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  counterBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  counterRatioText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  counterTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  counterSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FDE047',
    borderRadius: 4,
  },
  badgeHintCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  badgeHintTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  badgeHintTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  badgeHintSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    textAlign: 'right',
  },
  mainReadCta: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  mainReadGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  mainReadText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  axisNodeNext: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  prophetCardNext: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  nextBadgeChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  nextBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
});
