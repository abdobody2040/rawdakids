// Lessons of Past Nations in the Quran (عبر الأمم والقصص القرآني: 9+ سنوات)
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
import { SPACING, RADIUS, SHADOWS } from "@/constants/theme";
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { NATIONS_DATA } from "@/data/nationsData";
import {
  getUpgradeLabel,
  getLocalizedNationLesson,
} from '@/services/multilingualUpgradeService';

const NATIONS_WORLD_COVER = require('../../../assets/images/nations-world.jpg');
const NATIONS_BADGE_IMG = require('../../../assets/images/sticker-kaaba.jpg');

const NATION_IMAGES: Record<string, any> = {
  'nation-1': require('../../../assets/images/nation-aad.jpg'),
  'nation-2': require('../../../assets/images/scene-she-camel-rock.jpg'),
  'nation-3': require('../../../assets/images/scene-palace-garden.jpg'),
  'nation-4': require('../../../assets/images/nation-garden.jpg'),
  'nation-5': require('../../../assets/images/nation-garden.jpg'),
  'nation-6': require('../../../assets/images/nation-qarun.jpg'),
  'nation-7': require('../../../assets/images/scene-earth-dawn.jpg'),
};

export default function NationsHubScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [selectedNationId, setSelectedNationId] = useState<string>('nation-1');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  const currentNation = NATIONS_DATA.find(n => n.id === selectedNationId) || NATIONS_DATA[0];
  const localizedNation = getLocalizedNationLesson(currentNation, language);

  const handleCompleteLesson = (id: string) => {
    const isNowDone = !completedLessons[id];
    setCompletedLessons(prev => ({ ...prev, [id]: isNowDone }));
    if (isNowDone) {
      addStars(5);
      addGems(2);
      setCelebrationData({
        stars: 5,
        gems: 2,
        title: getUpgradeLabel('nationsCelebrationTitle', language),
        subtitle: getUpgradeLabel('nationsCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={getUpgradeLabel('nationsHubTitle', language)}
          showBack
          onBack={() => router.back()}
        />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={NATIONS_WORLD_COVER} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(40, 20, 10, 0.85)']} style={styles.heroGradient} />
            <View style={styles.heroOverlay}>
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Image source={NATIONS_BADGE_IMG} style={styles.heroBadgeImg} />
                <View style={styles.heroTextWrap}>
                  <View style={styles.ageBadgePill}>
                    <Text style={styles.ageBadgeText}>{getUpgradeLabel('nationsBadgeAge9', language)}</Text>
                  </View>
                  <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('nationsHubTitle', language)}
                  </Text>
                  <Text style={[styles.heroSubtitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('nationsHubSubtitle', language)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Horizontal Lessons Scroller */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.lessonsScroller, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          >
            {NATIONS_DATA.map(nat => {
              const isSelected = nat.id === currentNation.id;
              const isDone = completedLessons[nat.id];
              const localizedChip = getLocalizedNationLesson(nat, language);
              return (
                <TouchableOpacity
                  key={nat.id}
                  style={[styles.natChip, isSelected && styles.natChipActive, isDone && styles.natChipDone]}
                  onPress={() => setSelectedNationId(nat.id)}
                >
                  <View style={styles.natChipThumbWrap}>
                    <Image
                      source={NATION_IMAGES[nat.id] || NATIONS_BADGE_IMG}
                      style={styles.natChipThumb}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={[styles.natChipTitle, isSelected && styles.natChipTitleActive]} numberOfLines={1}>
                    {localizedChip.cardTitle || nat.cardTitle}
                  </Text>
                  {isDone && <Ionicons name="checkmark-circle" size={14} color="#10b981" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active Lesson Card */}
          <View style={styles.lessonCardWrap}>
            <LinearGradient colors={['#ffffff', '#fffefc']} style={styles.lessonCard}>
              {/* Active Lesson Scene Image Banner */}
              <View style={styles.lessonHeroSceneWrap}>
                <Image
                  source={NATION_IMAGES[currentNation.id] || NATIONS_BADGE_IMG}
                  style={styles.lessonHeroSceneImage}
                  resizeMode="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(30, 15, 5, 0.75)']} style={styles.lessonHeroSceneOverlay} />
                <View style={[styles.lessonScenePill, isRtl ? { right: 12 } : { left: 12 }]}>
                  <Text style={styles.lessonScenePillText}>
                    {`${getUpgradeLabel('storyLabelShort', language) || 'عبرة'} ${currentNation.index}`}
                  </Text>
                </View>
              </View>

              {/* Header */}
              <View style={[styles.lessonHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.lessonImgBadgeWrap}>
                  <Image
                    source={NATION_IMAGES[currentNation.id] || NATIONS_BADGE_IMG}
                    style={styles.lessonImgBadge}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.lessonHeaderInfo}>
                  <Text style={[styles.lessonTitleText, isRtl && { textAlign: 'right' }]}>
                    {localizedNation.title}
                  </Text>
                  <Text style={[styles.lessonRefText, isRtl && { textAlign: 'right' }]}>
                    {`${getUpgradeLabel('sourceLabel', language)} ${currentNation.references}`}
                  </Text>
                </View>
              </View>

              {/* Quran Narrative */}
              <View style={styles.narrativeBox}>
                <Text style={[styles.narrativeLabel, isRtl && { textAlign: 'right' }]}>
                  {getUpgradeLabel('storyLabel', language)}
                </Text>
                <Text style={[styles.narrativeText, isRtl && { textAlign: 'right' }]}>
                  {localizedNation.story || currentNation.story}
                </Text>
              </View>

              {/* Moral Lesson */}
              <View style={styles.moralLessonBox}>
                <Ionicons name="shield-checkmark" size={20} color="#b45309" />
                <View style={styles.moralTextWrap}>
                  <Text style={[styles.moralLabel, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('moralLessonLabel', language)}
                  </Text>
                  <Text style={[styles.moralText, isRtl && { textAlign: 'right' }]}>
                    {localizedNation.lesson || currentNation.lesson}
                  </Text>
                </View>
              </View>

              {/* Family Discussion Card */}
              {currentNation.discussion ? (
                <View style={styles.discussBox}>
                  <View style={[styles.discussHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="people" size={18} color="#0369a1" />
                    <Text style={[styles.discussTitle, isRtl && { textAlign: 'right' }]}>
                      {getUpgradeLabel('nationsFamilyDiscuss', language)}
                    </Text>
                  </View>
                  <Text style={[styles.discussText, isRtl && { textAlign: 'right' }]}>
                    {localizedNation.discussion || currentNation.discussion}
                  </Text>
                </View>
              ) : null}

              {/* Interactive Ethical Activity */}
              {currentNation.activity ? (
                <View style={styles.activityBox}>
                  <Text style={[styles.activityLabel, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('practicalActivityLabel', language)}
                  </Text>
                  <Text style={[styles.activityText, isRtl && { textAlign: 'right' }]}>
                    {localizedNation.activity || currentNation.activity}
                  </Text>
                </View>
              ) : null}

              {/* 3 Questions */}
              {currentNation.quizText ? (
                <View style={styles.quizBox}>
                  <Text style={[styles.quizTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('takeQuickQuiz', language)}
                  </Text>
                  <Text style={[styles.quizBody, isRtl && { textAlign: 'right' }]}>
                    {currentNation.quizText}
                  </Text>
                </View>
              ) : null}

              {/* Caution Notes (What we do not say) */}
              {currentNation.caution ? (
                <View style={styles.cautionBox}>
                  <Ionicons name="information-circle-outline" size={16} color="#64748b" />
                  <Text style={[styles.cautionText, isRtl && { textAlign: 'right' }]}>
                    {`${getUpgradeLabel('cautionLabel', language)}: ${currentNation.caution}`}
                  </Text>
                </View>
              ) : null}

              {/* Complete Lesson Button */}
              <TouchableOpacity
                style={[styles.completeBtn, completedLessons[currentNation.id] && styles.completeBtnDone]}
                onPress={() => handleCompleteLesson(currentNation.id)}
              >
                <Ionicons
                  name={completedLessons[currentNation.id] ? 'checkmark-circle' : 'ribbon-outline'}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.completeBtnText}>
                  {completedLessons[currentNation.id]
                    ? getUpgradeLabel('markDone', language)
                    : getUpgradeLabel('nationsLessonDone', language)}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
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
  safeArea: { flex: 1, backgroundColor: '#fffbeb' },
  container: { flex: 1 },
  badgePill: {
    backgroundColor: 'rgba(180, 83, 9, 0.12)',
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
  ageBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  ageBadgeText: { fontSize: 11, fontWeight: '800', color: '#ffffff' },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  heroSubtitle: { fontSize: 11, color: '#fef3c7', marginTop: 3, lineHeight: 16 },
  lessonsScroller: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: 10 },
  natChip: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    minWidth: 88,
    ...SHADOWS.soft,
  },
  natChipActive: { borderColor: '#b45309', backgroundColor: '#fffbeb', borderWidth: 2 },
  natChipDone: { borderColor: '#10b981' },
  natChipThumbWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    marginBottom: 4,
    backgroundColor: '#fffbeb',
  },
  natChipThumb: { width: '100%', height: '100%' },
  natChipTitle: { fontSize: 12, fontWeight: '700', color: '#78350f', maxWidth: 96, textAlign: 'center' },
  natChipTitleActive: { color: '#b45309', fontWeight: '800' },
  lessonCardWrap: { marginHorizontal: SPACING.md, marginTop: 4 },
  lessonCard: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  lessonHeroSceneWrap: {
    height: 140,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  lessonHeroSceneImage: { width: '100%', height: '100%' },
  lessonHeroSceneOverlay: { ...StyleSheet.absoluteFill },
  lessonScenePill: {
    position: 'absolute',
    top: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  lessonScenePillText: { fontSize: 11, fontWeight: '800', color: '#ffffff' },
  lessonHeaderRow: { alignItems: 'center', gap: 12, marginBottom: SPACING.md },
  lessonImgBadgeWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f59e0b',
    ...SHADOWS.soft,
  },
  lessonImgBadge: { width: '100%', height: '100%' },
  lessonHeaderInfo: { flex: 1 },
  lessonTitleText: { fontSize: 18, fontWeight: '800', color: '#451a03' },
  lessonRefText: { fontSize: 12, color: '#9a3412', marginTop: 2 },
  narrativeBox: {
    backgroundColor: '#fffbeb',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  narrativeLabel: { fontSize: 13, fontWeight: '800', color: '#92400e', marginBottom: 4 },
  narrativeText: { fontSize: 15, color: '#78350f', lineHeight: 23 },
  moralLessonBox: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fef3c7',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  moralTextWrap: { flex: 1 },
  moralLabel: { fontSize: 12, fontWeight: '700', color: '#b45309' },
  moralText: { fontSize: 14, fontWeight: '600', color: '#78350f', marginTop: 2, lineHeight: 21 },
  discussBox: {
    marginTop: SPACING.md,
    backgroundColor: '#f0f9ff',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  discussHeader: { alignItems: 'center', gap: 6, marginBottom: 4 },
  discussTitle: { fontSize: 13, fontWeight: '800', color: '#0369a1' },
  discussText: { fontSize: 14, color: '#0c4a6e', lineHeight: 21 },
  activityBox: {
    marginTop: SPACING.md,
    backgroundColor: '#f0fdf4',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  activityLabel: { fontSize: 13, fontWeight: '800', color: '#15803d', marginBottom: 4 },
  activityText: { fontSize: 14, color: '#166534', lineHeight: 21 },
  quizBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  quizTitle: { fontSize: 13, fontWeight: '800', color: '#b45309', marginBottom: 4 },
  quizBody: { fontSize: 13, color: '#451a03', lineHeight: 20 },
  cautionBox: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  cautionText: { flex: 1, fontSize: 11, color: '#64748b' },
  completeBtn: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#b45309',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  completeBtnDone: { backgroundColor: '#10b981' },
  completeBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
