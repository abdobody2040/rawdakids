// Young Companions Hub (صغار الصحابة: كانوا مثلك)
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { isRTL } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { COMPANIONS_DATA, CompanionStoryItem } from '@/data/companionsData';
import {
  getUpgradeLabel,
  getLocalizedCompanionStory,
} from '@/services/multilingualUpgradeService';

const COMPANIONS_WORLD_COVER = require('../../../assets/images/companions-world.jpg');
const COMPANIONS_BADGE_IMG = require('../../../assets/images/companions-badge.jpg');

const COMPANION_IMAGES: Record<string, any> = {
  'comp-1': require('../../../assets/images/comp-anas-service.jpg'),
  'comp-2': require('../../../assets/images/comp-nughayr-bird.jpg'),
  'comp-3': require('../../../assets/images/comp-dining-manners.jpg'),
  'comp-4': require('../../../assets/images/comp-ibn-abbas-counsel.jpg'),
  'comp-5': require('../../../assets/images/comp-night-prayer.jpg'),
  'comp-6': require('../../../assets/images/comp-usama-mercy.jpg'),
  'comp-7': require('../../../assets/images/comp-ibn-umar-patience.jpg'),
  'comp-8': require('../../../assets/images/comp-ibn-jafar-welcome.jpg'),
  'comp-9': require('../../../assets/images/comp-ashura-wool-toy.jpg'),
  'comp-10': require('../../../assets/images/comp-aisha-childhood.jpg'),
  'comp-11': require('../../../assets/images/comp-hasan-gentle-dates.jpg'),
  'comp-12': require('../../../assets/images/comp-water-cup-right.jpg'),
};

export default function CompanionsHubScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'stories' | 'badges'>('stories');
  const [selectedStoryId, setSelectedStoryId] = useState<string>('comp-1');
  const [appliedStories, setAppliedStories] = useState<Record<string, boolean>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  const currentStory = COMPANIONS_DATA.find(s => s.id === selectedStoryId) || COMPANIONS_DATA[0];
  const localizedStory = getLocalizedCompanionStory(currentStory, language);

  const handleApplyAction = (id: string) => {
    const isNowDone = !appliedStories[id];
    setAppliedStories(prev => ({ ...prev, [id]: isNowDone }));
    if (isNowDone) {
      addStars(4);
      addGems(1);
      setCelebrationData({
        stars: 4,
        gems: 1,
        title: getUpgradeLabel('compCelebrationTitle', language),
        subtitle: getUpgradeLabel('compCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={getUpgradeLabel('compHubTitle', language)}
          showBack
          onBack={() => router.back()}
        />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={COMPANIONS_WORLD_COVER} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(30, 20, 10, 0.85)']} style={styles.heroGradient} />
            <View style={styles.heroOverlay}>
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Image source={COMPANIONS_BADGE_IMG} style={styles.heroBadgeImg} />
                <View style={styles.heroTextWrap}>
                  <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('compHubTitle', language)}
                  </Text>
                  <Text style={[styles.heroSubtitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('compHubSubtitle', language)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={[styles.tabBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'stories' && styles.tabBtnActive]}
              onPress={() => setActiveTab('stories')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'stories' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('compTabStories', language)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'badges' && styles.tabBtnActive]}
              onPress={() => setActiveTab('badges')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'badges' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('compTabBadges', language)}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'stories' ? (
            <>
              {/* Horizontal Stories Scroller */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.storiesScroller, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                {COMPANIONS_DATA.map(story => {
                  const isSelected = story.id === currentStory.id;
                  const isDone = appliedStories[story.id];
                  const localizedChip = getLocalizedCompanionStory(story, language);
                  return (
                    <TouchableOpacity
                      key={story.id}
                      style={[styles.storyChip, isSelected && styles.storyChipActive, isDone && styles.storyChipDone]}
                      onPress={() => setSelectedStoryId(story.id)}
                    >
                      <Image source={COMPANION_IMAGES[story.id]} style={styles.storyChipThumb} resizeMode="cover" />
                      <Text style={[styles.storyChipTitle, isSelected && styles.storyChipTitleActive]} numberOfLines={1}>
                        {localizedChip.cardTitle || story.cardTitle}
                      </Text>
                      {isDone && <Ionicons name="checkmark-circle" size={14} color="#10b981" style={styles.storyChipCheck} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Story Content Card */}
              <View style={styles.storyCardWrap}>
                <View style={styles.storyCard}>
                  {/* Story Hero Scene Banner */}
                  <View style={styles.storyHeroWrap}>
                    <Image source={COMPANION_IMAGES[currentStory.id]} style={styles.storyHeroImage} resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(20, 15, 10, 0.75)']} style={styles.storyHeroOverlay} />
                    <View style={[styles.storyHeroIndexPill, isRtl ? { right: 12 } : { left: 12 }]}>
                      <Text style={styles.storyHeroIndexText}>
                        {`${getUpgradeLabel('storyLabelShort', language)} ${currentStory.index}`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.storyCardContent}>
                    {/* Title & Source */}
                    <View style={styles.storyHeaderBlock}>
                      <Text style={[styles.storyTitleText, isRtl && { textAlign: 'right' }]}>
                        {localizedStory.title}
                      </Text>
                      <Text style={[styles.storySourceText, isRtl && { textAlign: 'right' }]}>
                        {`${getUpgradeLabel('sourceLabel', language)} ${localizedStory.source || currentStory.source}`}
                      </Text>
                    </View>

                  {/* Story Text */}
                  <View style={styles.storyNarrativeBox}>
                    <Text style={[styles.narrativeLabel, isRtl && { textAlign: 'right' }]}>
                      {getUpgradeLabel('storyLabel', language)}
                    </Text>
                    <Text style={[styles.narrativeText, isRtl && { textAlign: 'right' }]}>
                      {localizedStory.story || currentStory.story}
                    </Text>
                  </View>

                  {/* Moral Lesson */}
                  <View style={styles.lessonBox}>
                    <Ionicons name="bulb-outline" size={20} color="#d97706" />
                    <View style={styles.lessonTextWrap}>
                      <Text style={[styles.lessonLabel, isRtl && { textAlign: 'right' }]}>
                        {getUpgradeLabel('moralLessonLabel', language)}
                      </Text>
                      <Text style={[styles.lessonText, isRtl && { textAlign: 'right' }]}>
                        {localizedStory.lesson || currentStory.lesson}
                      </Text>
                    </View>
                  </View>

                  {/* Are You Like Them? */}
                  {(localizedStory.areYouLikeThem || currentStory.areYouLikeThem) ? (
                    <View style={styles.areYouBox}>
                      <Text style={[styles.areYouLabel, isRtl && { textAlign: 'right' }]}>
                        {getUpgradeLabel('compAreYouLikeThem', language)}
                      </Text>
                      <Text style={[styles.areYouText, isRtl && { textAlign: 'right' }]}>
                        {localizedStory.areYouLikeThem || currentStory.areYouLikeThem}
                      </Text>
                    </View>
                  ) : null}

                  {/* Action Step */}
                  <View style={styles.applyActionBox}>
                    <Text style={[styles.applyActionLabel, isRtl && { textAlign: 'right' }]}>
                      {getUpgradeLabel('asmaDailyApply', language)}
                    </Text>
                    <Text style={[styles.applyActionText, isRtl && { textAlign: 'right' }]}>
                      {localizedStory.apply || currentStory.apply}
                    </Text>
                    <TouchableOpacity
                      style={[styles.applyBtn, appliedStories[currentStory.id] && styles.applyBtnDone]}
                      onPress={() => handleApplyAction(currentStory.id)}
                    >
                      <Ionicons
                        name={appliedStories[currentStory.id] ? 'checkbox' : 'ribbon-outline'}
                        size={20}
                        color={appliedStories[currentStory.id] ? '#ffffff' : '#b45309'}
                      />
                      <Text style={[styles.applyBtnText, appliedStories[currentStory.id] && styles.applyBtnTextDone]}>
                        {appliedStories[currentStory.id]
                          ? getUpgradeLabel('markDone', language)
                          : getUpgradeLabel('applyCompanionButtonLabel', language)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                    {/* Two Questions */}
                    {currentStory.quizText ? (
                      <View style={styles.twoQuizBox}>
                        <Text style={[styles.twoQuizTitle, isRtl && { textAlign: 'right' }]}>
                          {getUpgradeLabel('takeQuickQuiz', language)}
                        </Text>
                        <Text style={[styles.twoQuizBody, isRtl && { textAlign: 'right' }]}>
                          {currentStory.quizText}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </>
          ) : (
            /* Badges Album */
            <View style={styles.badgesAlbumGrid}>
              {COMPANIONS_DATA.map(story => {
                const isEarned = appliedStories[story.id];
                const localizedBadge = getLocalizedCompanionStory(story, language);
                return (
                  <TouchableOpacity
                    key={story.id}
                    style={[styles.badgeCardTouch, !isEarned && styles.badgeCardTouchLocked]}
                    onPress={() => {
                      setSelectedStoryId(story.id);
                      setActiveTab('stories');
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.badgeCard, isEarned ? styles.badgeCardEarned : styles.badgeCardLocked]}>
                      <View style={styles.badgeCoverWrap}>
                        <Image source={COMPANION_IMAGES[story.id]} style={styles.badgeCoverImg} resizeMode="cover" />
                        <LinearGradient colors={['transparent', 'rgba(15, 23, 42, 0.7)']} style={styles.badgeCoverGradient} />
                        <View style={[styles.badgePillFloating, isRtl ? { right: 8 } : { left: 8 }]}>
                          <Text style={styles.badgePillText}>{`${getUpgradeLabel('storyLabelShort', language)} ${story.index}`}</Text>
                        </View>
                        {isEarned && (
                          <View style={[styles.badgeEarnedStar, isRtl ? { left: 8 } : { right: 8 }]}>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                          </View>
                        )}
                      </View>
                      <View style={styles.badgeBody}>
                        <Text style={[styles.badgeName, isRtl && { textAlign: 'right' }]} numberOfLines={2}>
                          {localizedBadge.cardTitle || story.cardTitle}
                        </Text>
                        <View style={[styles.badgeActionRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                          <Text style={styles.badgeReadAction}>
                            {language === 'ar' ? 'اقرأ القصة' : 'Read Story'}
                          </Text>
                          <Ionicons name={isRtl ? 'chevron-back' : 'chevron-forward'} size={14} color="#b45309" />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        <AppBottomNav />

        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={celebrationData.stars}
          gemsEarned={celebrationData.gems}
          title={celebrationData.title}
          subtitle={celebrationData.subtitle}
          onDismiss={() => setShowCelebration(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fcfbf7' },
  container: { flex: 1 },
  badgePill: {
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  badgePillText: { fontSize: 13, fontWeight: '700', color: '#b45309' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  heroCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    height: 190,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFill },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  heroRow: { alignItems: 'center', gap: 12 },
  heroBadgeImg: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#f59e0b' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 19, fontWeight: '800', color: '#ffffff' },
  heroSubtitle: { fontSize: 12, color: '#fef3c7', marginTop: 4, lineHeight: 17 },
  tabBar: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#fef3c7',
    borderRadius: RADIUS.xl,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#ffffff', ...SHADOWS.soft },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: '#92400e' },
  tabBtnTextActive: { color: '#b45309', fontWeight: '800' },
  storiesScroller: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: 10 },
  storyChip: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    minWidth: 84,
    ...SHADOWS.soft,
  },
  storyChipActive: { borderColor: '#b45309', backgroundColor: '#fffbeb' },
  storyChipDone: { borderColor: '#10b981' },
  storyChipThumb: { width: 44, height: 44, borderRadius: 22, marginBottom: 5 },
  storyChipCheck: { position: 'absolute', top: 6, right: 6 },
  storyChipTitle: { fontSize: 11, fontWeight: '700', color: '#78350f', maxWidth: 90, textAlign: 'center' },
  storyChipTitleActive: { color: '#b45309', fontWeight: '800' },
  storyCardWrap: { marginHorizontal: SPACING.md, marginTop: 4 },
  storyCard: {
    borderRadius: RADIUS.xxl,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  storyHeroWrap: { height: 170, width: '100%', position: 'relative' },
  storyHeroImage: { width: '100%', height: '100%' },
  storyHeroOverlay: { ...StyleSheet.absoluteFill },
  storyHeroIndexPill: {
    position: 'absolute',
    top: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  storyHeroIndexText: { color: '#fbbf24', fontSize: 12, fontWeight: '700' },
  storyCardContent: { padding: SPACING.lg },
  storyHeaderBlock: { marginBottom: SPACING.md },
  storyTitleText: { fontSize: 18, fontWeight: '800', color: '#451a03' },
  storySourceText: { fontSize: 12, color: '#92400e', marginTop: 3 },
  storyNarrativeBox: {
    backgroundColor: '#fffbeb',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  narrativeLabel: { fontSize: 13, fontWeight: '800', color: '#92400e', marginBottom: 4 },
  narrativeText: { fontSize: 15, color: '#78350f', lineHeight: 23 },
  lessonBox: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fef3c7',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  lessonTextWrap: { flex: 1 },
  lessonLabel: { fontSize: 12, fontWeight: '700', color: '#b45309' },
  lessonText: { fontSize: 14, fontWeight: '600', color: '#78350f', marginTop: 2, lineHeight: 20 },
  areYouBox: {
    marginTop: SPACING.md,
    backgroundColor: '#f0fdf4',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  areYouLabel: { fontSize: 13, fontWeight: '800', color: '#166534', marginBottom: 4 },
  areYouText: { fontSize: 14, color: '#14532d', lineHeight: 21 },
  applyActionBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fefce8',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#fde047',
  },
  applyActionLabel: { fontSize: 13, fontWeight: '800', color: '#854d0e', marginBottom: 4 },
  applyActionText: { fontSize: 14, color: '#713f12', lineHeight: 21, marginBottom: 10 },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#d97706',
  },
  applyBtnDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  applyBtnText: { fontSize: 13, fontWeight: '700', color: '#b45309' },
  applyBtnTextDone: { color: '#ffffff' },
  twoQuizBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  twoQuizTitle: { fontSize: 14, fontWeight: '800', color: '#b45309', marginBottom: 4 },
  twoQuizBody: { fontSize: 13, color: '#451a03', lineHeight: 20 },
  badgesAlbumGrid: {
    padding: SPACING.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  badgeCardTouch: { width: '48%' },
  badgeCardTouchLocked: { opacity: 0.9 },
  badgeCard: {
    borderRadius: RADIUS.xl,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  badgeCardEarned: { borderColor: '#d97706', ...SHADOWS.medium },
  badgeCardLocked: { borderColor: '#e2e8f0', ...SHADOWS.soft },
  badgeCoverWrap: { width: '100%', height: 125, position: 'relative' },
  badgeCoverImg: { width: '100%', height: '100%' },
  badgeCoverGradient: { ...StyleSheet.absoluteFill },
  badgePillFloating: {
    position: 'absolute',
    top: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeEarnedStar: {
    position: 'absolute',
    top: 8,
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.full,
    padding: 2,
    ...SHADOWS.soft,
  },
  badgeBody: { padding: 10, backgroundColor: '#ffffff', width: '100%' },
  badgeName: { fontSize: 13, fontWeight: '800', color: '#451a03', minHeight: 34 },
  badgeActionRow: { alignItems: 'center', marginTop: 6, gap: 4 },
  badgeReadAction: { fontSize: 11, fontWeight: '700', color: '#b45309' },
});
