// Good Manners Town: Town Map (مدينة الأخلاق - E1)
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
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';

import AppBottomNav from '@/components/AppBottomNav';

const MANNERS_TOWN_IMG = require('../../../assets/images/manners-town.jpg');
const GRATITUDE_JAR_IMG = require('../../../assets/images/gratitude-jar.jpg');
const HERO_OASIS_IMG = require('../../../assets/images/hero-oasis.jpg');

const MANNER_BUILDING_IMAGES: Record<string, any> = {
  'honesty-hall': require('../../../assets/images/scene-muhammad-hira.jpg'),
  'parents-palace': require('../../../assets/images/story-parents-hug.jpg'),
  'sharing-center': require('../../../assets/images/manner-sharing.jpg'),
  'cleanliness-corner': require('../../../assets/images/manner-cleanliness.jpg'),
  'respect-house': require('../../../assets/images/nav-manners-3d.jpg'),
  'forgiveness-garden': require('../../../assets/images/hero-oasis.jpg'),
  'gratitude-grove': require('../../../assets/images/gratitude-jar.jpg'),
  'patience-path': require('../../../assets/images/sunnah-path.jpg'),
  'gentleness-glade': require('../../../assets/images/story-gentle-nature.jpg'),
  'cheerfulness-court': require('../../../assets/images/story-smile-happy.jpg'),
  'humility-haven': require('../../../assets/images/quran-garden.jpg'),
  'peace-maker-plaza': require('../../../assets/images/story-smile-school.jpg'),
  'truthful-promise-palace': require('../../../assets/images/prophets-caravan.jpg'),
  'cooperation-castle': require('../../../assets/images/scene-nuh-ark.jpg'),
};

const VARIED_FALLBACK_IMAGES = [
  require('../../../assets/images/manners-town.jpg'),
  require('../../../assets/images/manner-cleanliness.jpg'),
  require('../../../assets/images/manner-sharing.jpg'),
  require('../../../assets/images/story-parents-hug.jpg'),
  require('../../../assets/images/story-smile-happy.jpg'),
  require('../../../assets/images/story-smile-school.jpg'),
  require('../../../assets/images/story-gentle-nature.jpg'),
  require('../../../assets/images/story-quran-reading.jpg'),
  require('../../../assets/images/gratitude-jar.jpg'),
  require('../../../assets/images/hero-oasis.jpg'),
  require('../../../assets/images/sunnah-path.jpg'),
  require('../../../assets/images/quran-garden.jpg'),
];

const getBuildingImage = (buildingId: string, index: number) => {
  if (MANNER_BUILDING_IMAGES[buildingId]) {
    return MANNER_BUILDING_IMAGES[buildingId];
  }
  return VARIED_FALLBACK_IMAGES[index % VARIED_FALLBACK_IMAGES.length];
};

export default function MannersTownScreen() {
  const router = useRouter();
  const { language, scenarioProgress, weeklyChallenges, completeWeeklyChallenge } = useAppStore();
  const t = TRANSLATIONS[language];
  const buildings = contentService.getMannersBuildings();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header showBack title={t.manners} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header with 3D Generated Image Background */}
        <View style={styles.heroBannerContainer}>
          <ImageBackground
            source={MANNERS_TOWN_IMG}
            style={styles.heroBannerImage}
            imageStyle={{ borderRadius: RADIUS.xl }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(2, 132, 199, 0.88)', 'rgba(14, 165, 233, 0.94)']}
              style={styles.heroBannerOverlay}
            >
              <View style={styles.heroRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>{t.mannersTownTitle}</Text>
                  <Text style={styles.heroDesc}>{t.mannersDesc}</Text>
                </View>
                <View style={styles.hero3dBadgeBox}>
                  <Image
                    source={HERO_OASIS_IMG}
                    style={styles.hero3dBadgeImg}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Gratitude Journal Shortcut Banner (Feature 5) with 3D Jar Asset */}
        <TouchableOpacity
          style={styles.journalBannerBtn}
          onPress={() => router.push('/manners/journal')}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.journalBanner}
          >
            <View style={[styles.journalRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
              <View style={styles.journalIconCircle}>
                <Image
                  source={GRATITUDE_JAR_IMG}
                  style={{ width: '100%', height: '100%', borderRadius: 24 }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.journalBannerTitle,
                    language === 'ar' && { textAlign: 'right' },
                  ]}
                >
                  {language === 'ar'
                    ? 'دفتر شكر الله والامتنان 🌸'
                    : 'My Gratitude Journal 🌸'}
                </Text>
                <Text
                  style={[
                    styles.journalBannerSub,
                    language === 'ar' && { textAlign: 'right' },
                  ]}
                >
                  {language === 'ar'
                    ? 'سجّل نعمة تشكر الله عليها اليوم واكسب نجوماً!'
                    : 'Thank Allah for a blessing today & earn stars!'}
                </Text>
              </View>
            </View>
            <Ionicons
              name={language === 'ar' ? 'chevron-back' : 'chevron-forward'}
              size={22}
              color="#ffffff"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Weekly Manners Challenges (E3, PA4) */}
        <View style={styles.challengesSection}>
          <View style={[styles.challengeHeaderRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="trophy" size={20} color="#f59e0b" />
              <Text style={styles.challengesHeading}>
                {language === 'ar' ? 'تحديات الأخلاق لهذا الأسبوع' : 'Weekly Manners Challenges'}
              </Text>
            </View>
            <View style={styles.challengeBadgePill}>
              <Text style={styles.challengeBadgeText}>
                {weeklyChallenges.filter((c) => c.confirmedByParent).length} / {weeklyChallenges.length} {language === 'ar' ? 'معتمد' : 'Approved'}
              </Text>
            </View>
          </View>

          <View style={styles.challengeCardsList}>
            {weeklyChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeCard}>
                <View style={[styles.challengeTopRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                  <View style={styles.challengeEmojiBox}>
                    <Text style={{ fontSize: 24 }}>{challenge.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.challengeTitle, language === 'ar' && { textAlign: 'right' }]}>
                      {language === 'ar' ? challenge.titleAr : challenge.titleEn}
                    </Text>
                    <Text style={[styles.challengeDesc, language === 'ar' && { textAlign: 'right' }]}>
                      {language === 'ar' ? challenge.descAr : challenge.descEn}
                    </Text>
                  </View>
                </View>

                <View style={[styles.challengeBottomRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                  <View style={styles.rewardChip}>
                    <Text style={styles.rewardChipText}>💎 +{challenge.gemReward}</Text>
                  </View>

                  {challenge.confirmedByParent ? (
                    <View style={styles.confirmedPill}>
                      <Ionicons name="checkmark-done-circle" size={16} color="#059669" />
                      <Text style={styles.confirmedPillText}>
                        {language === 'ar' ? 'معتمد من الوالدين 🎉' : 'Approved by Parents 🎉'}
                      </Text>
                    </View>
                  ) : challenge.completedByChild ? (
                    <View style={styles.waitingPill}>
                      <Ionicons name="hourglass-outline" size={14} color="#d97706" />
                      <Text style={styles.waitingPillText}>
                        {language === 'ar' ? 'بانتظار مصادقة الوالدين' : 'Waiting for parent approval'}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.completeBtn}
                      onPress={() => completeWeeklyChallenge(challenge.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="sparkles" size={14} color="#ffffff" />
                      <Text style={styles.completeBtnText}>
                        {language === 'ar' ? 'أنجزت هذا الخلق اليوم! 🌟' : 'I did this today! 🌟'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>
            {language === 'ar' ? 'معالم الأخلاق في المدينة' : 'Buildings of Manners'}
          </Text>
          <View style={styles.landmarksCountBadge}>
            <Ionicons name="sparkles" size={13} color="#0284c7" />
            <Text style={styles.landmarksCountText}>
              {language === 'ar' ? '٥٠ مَعلماً وخُلقاً حسناً' : '50 Moral Landmarks'}
            </Text>
          </View>
        </View>

        {/* Interactive Buildings Grid with 3D Artwork */}
        <View style={styles.buildingsGrid}>
          {buildings.map((building, index) => {
            const isCompleted = scenarioProgress[building.id]?.completed;
            const buildingImage = getBuildingImage(building.id, index);

            return (
              <TouchableOpacity
                key={building.id}
                style={[styles.buildingCard, { borderTopColor: building.color }]}
                onPress={() => router.push(`/manners/${building.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.buildingBadgeWrapper}>
                    <Image
                      source={buildingImage}
                      style={styles.buildingThumbImage}
                      resizeMode="cover"
                    />
                    <View
                      style={[
                        styles.buildingMiniIcon,
                        { backgroundColor: building.color },
                      ]}
                    >
                      <Ionicons
                        name={(building.iconName as any) || 'sparkles'}
                        size={14}
                        color="#ffffff"
                      />
                    </View>
                  </View>

                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.success}
                      />
                      <Text style={styles.completedText}>{t.done}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.buildingName}>
                  {language === 'ar' ? building.nameAr : building.nameEn}
                </Text>

                <Text style={styles.buildingSubtitle}>
                  {language === 'ar' ? building.subtitleAr : building.subtitleEn}
                </Text>

                <View style={styles.enterRow}>
                  <Text style={[styles.enterText, { color: building.color }]}>
                    {t.enterBuilding}
                  </Text>
                  <Ionicons
                    name={
                      language === 'ar'
                        ? 'arrow-back-circle'
                        : 'arrow-forward-circle'
                    }
                    size={22}
                    color={building.color}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Persistent Bottom Bar with Manners Tab */}
      <AppBottomNav />
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
    paddingBottom: 84,
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
    borderColor: '#bae6fd',
    backgroundColor: '#e0f2fe',
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
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  landmarksCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  landmarksCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  buildingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  buildingCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderTopWidth: 5,
    ...SHADOWS.soft,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  buildingBadgeWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  buildingThumbImage: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: '#f1f5f9',
  },
  buildingMiniIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
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
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  buildingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  enterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  enterText: {
    fontSize: 13,
    fontWeight: '800',
  },
  journalBannerBtn: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  journalBanner: {
    padding: SPACING.md + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalRow: {
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  journalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalBannerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },
  journalBannerSub: {
    fontSize: 11,
    color: '#d1fae5',
    fontWeight: '600',
    marginTop: 2,
  },
  challengesSection: {
    marginVertical: SPACING.md,
    backgroundColor: '#fffdf5',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#fef3c7',
    ...SHADOWS.soft,
  },
  challengeHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengesHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400e',
  },
  challengeBadgePill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  challengeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#b45309',
  },
  challengeCardsList: {
    gap: 10,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3ece0',
    gap: 8,
  },
  challengeTopRow: {
    alignItems: 'center',
    gap: 10,
  },
  challengeEmojiBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1c1917',
  },
  challengeDesc: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 2,
  },
  challengeBottomRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f7f4ee',
    paddingTop: 8,
  },
  rewardChip: {
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  rewardChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#db2777',
  },
  confirmedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  confirmedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  waitingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  waitingPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  completeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
});
