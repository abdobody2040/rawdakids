// Seerah of Prophet Muhammad ﷺ (السيرة النبوية المبسّطة: رحلة نور)
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
import { SEERAH_DATA, SeerahStationItem } from '@/data/seerahData';
import {
  getUpgradeLabel,
  getLocalizedSeerahStation,
} from '@/services/multilingualUpgradeService';

const SEERAH_WORLD_COVER = require('../../../assets/images/seerah-world.jpg');
const SEERAH_BADGE_IMG = require('../../../assets/images/sticker-lantern.jpg');

export default function SeerahHubScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [selectedStationId, setSelectedStationId] = useState<string>('seerah-1');
  const [emulatedStations, setEmulatedStations] = useState<Record<string, boolean>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  const currentStation = SEERAH_DATA.find(s => s.id === selectedStationId) || SEERAH_DATA[0];
  const localizedStation = getLocalizedSeerahStation(currentStation, language);

  const handleEmulateToggle = (id: string) => {
    const isNowDone = !emulatedStations[id];
    setEmulatedStations(prev => ({ ...prev, [id]: isNowDone }));
    if (isNowDone) {
      addStars(5);
      addGems(2);
      setCelebrationData({
        stars: 5,
        gems: 2,
        title: getUpgradeLabel('seerahCelebrationTitle', language),
        subtitle: getUpgradeLabel('seerahCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={getUpgradeLabel('seerahHubTitle', language)}
          showBack
          onBack={() => router.back()}
        />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={SEERAH_WORLD_COVER} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(12, 28, 22, 0.85)']} style={styles.heroGradient} />
            <View style={styles.heroOverlay}>
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Image source={SEERAH_BADGE_IMG} style={styles.heroBadgeImg} />
                <View style={styles.heroTextWrap}>
                  <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('seerahHubTitle', language)}
                  </Text>
                  <Text style={[styles.heroSubtitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('seerahHubSubtitle', language)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Timeline Milestones Horizontal Scroller */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.timelineScroller, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          >
            {SEERAH_DATA.map(st => {
              const isSelected = st.id === currentStation.id;
              const isDone = emulatedStations[st.id];
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.stChip, isSelected && styles.stChipActive, isDone && styles.stChipDone]}
                  onPress={() => setSelectedStationId(st.id)}
                >
                  <Text style={styles.stChipEmoji}>{st.cardEmoji}</Text>
                  <Text style={[styles.stChipNum, isSelected && styles.stChipNumActive]}>
                    {`${getUpgradeLabel('milestoneLabel', language)} ${st.stationNumber}`}
                  </Text>
                  {isDone && <Ionicons name="checkmark-circle" size={14} color="#10b981" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Detailed Milestone Card */}
          <View style={styles.milestoneCardWrap}>
            <LinearGradient colors={['#ffffff', '#fcfdfd']} style={styles.milestoneCard}>
              {/* Header */}
              <View style={[styles.stHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.stEmojiBadge}>{currentStation.cardEmoji}</Text>
                <View style={styles.stHeaderInfo}>
                  <Text style={[styles.stTitleText, isRtl && { textAlign: 'right' }]}>
                    {localizedStation.title}
                  </Text>
                  <Text style={[styles.stSourceText, isRtl && { textAlign: 'right' }]}>
                    {`${getUpgradeLabel('sourceLabel', language)} ${currentStation.source}`}
                  </Text>
                </View>
              </View>

              {/* Story Narrative */}
              <View style={styles.narrativeBox}>
                <Text style={[styles.narrativeLabel, isRtl && { textAlign: 'right' }]}>
                  {getUpgradeLabel('milestoneNarrativeLabel', language)}
                </Text>
                <Text style={[styles.narrativeText, isRtl && { textAlign: 'right' }]}>
                  {localizedStation.story || currentStation.story}
                </Text>
              </View>

              {/* Moral Lesson */}
              <View style={styles.lessonBox}>
                <Ionicons name="heart-circle-outline" size={20} color="#059669" />
                <View style={styles.lessonTextWrap}>
                  <Text style={[styles.lessonLabel, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('propheticLessonLabel', language)}
                  </Text>
                  <Text style={[styles.lessonText, isRtl && { textAlign: 'right' }]}>
                    {localizedStation.lesson || currentStation.lesson}
                  </Text>
                </View>
              </View>

              {/* I Emulate Him Today (أقتدي به) */}
              <View style={styles.emulateBox}>
                <Text style={[styles.emulateLabel, isRtl && { textAlign: 'right' }]}>
                  {getUpgradeLabel('seerahEmulateAction', language)}
                </Text>
                <Text style={[styles.emulateText, isRtl && { textAlign: 'right' }]}>
                  {localizedStation.emulate || currentStation.emulate}
                </Text>
                <TouchableOpacity
                  style={[styles.emulateBtn, emulatedStations[currentStation.id] && styles.emulateBtnDone]}
                  onPress={() => handleEmulateToggle(currentStation.id)}
                >
                  <Ionicons
                    name={emulatedStations[currentStation.id] ? 'checkbox' : 'star-outline'}
                    size={20}
                    color={emulatedStations[currentStation.id] ? '#ffffff' : '#059669'}
                  />
                  <Text style={[styles.emulateBtnText, emulatedStations[currentStation.id] && styles.emulateBtnTextDone]}>
                    {emulatedStations[currentStation.id]
                      ? getUpgradeLabel('markDone', language)
                      : getUpgradeLabel('emulateButtonLabel', language)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Two Quiz Questions */}
              {currentStation.quizText ? (
                <View style={styles.quizBox}>
                  <Text style={[styles.quizTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('takeQuickQuiz', language)}
                  </Text>
                  <Text style={[styles.quizText, isRtl && { textAlign: 'right' }]}>
                    {currentStation.quizText}
                  </Text>
                </View>
              ) : null}

              {/* Caution Notes */}
              {currentStation.caution ? (
                <View style={styles.cautionBox}>
                  <Ionicons name="information-circle-outline" size={16} color="#64748b" />
                  <Text style={[styles.cautionText, isRtl && { textAlign: 'right' }]}>
                    {`${getUpgradeLabel('cautionLabel', language)}: ${currentStation.caution}`}
                  </Text>
                </View>
              ) : null}
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
  safeArea: { flex: 1, backgroundColor: '#f0fdf4' },
  container: { flex: 1 },
  badgePill: {
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  badgePillText: { fontSize: 13, fontWeight: '700', color: '#059669' },
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
  heroBadgeImg: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#34d399' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 19, fontWeight: '800', color: '#ffffff' },
  heroSubtitle: { fontSize: 12, color: '#dcfce7', marginTop: 4, lineHeight: 17 },
  timelineScroller: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: 10 },
  stChip: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    minWidth: 80,
    ...SHADOWS.soft,
  },
  stChipActive: { borderColor: '#059669', backgroundColor: '#dcfce7' },
  stChipDone: { borderColor: '#10b981' },
  stChipEmoji: { fontSize: 20, marginBottom: 2 },
  stChipNum: { fontSize: 11, fontWeight: '700', color: '#166534' },
  stChipNumActive: { color: '#064e3b', fontWeight: '800' },
  milestoneCardWrap: { marginHorizontal: SPACING.md, marginTop: 4 },
  milestoneCard: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    ...SHADOWS.medium,
  },
  stHeaderRow: { alignItems: 'center', gap: 12, marginBottom: SPACING.md },
  stEmojiBadge: { fontSize: 32 },
  stHeaderInfo: { flex: 1 },
  stTitleText: { fontSize: 18, fontWeight: '800', color: '#064e3b' },
  stSourceText: { fontSize: 12, color: '#047857', marginTop: 2 },
  narrativeBox: {
    backgroundColor: '#f0fdf4',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  narrativeLabel: { fontSize: 13, fontWeight: '800', color: '#166534', marginBottom: 4 },
  narrativeText: { fontSize: 15, color: '#14532d', lineHeight: 23 },
  lessonBox: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#ecfdf5',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  lessonTextWrap: { flex: 1 },
  lessonLabel: { fontSize: 12, fontWeight: '700', color: '#059669' },
  lessonText: { fontSize: 14, fontWeight: '600', color: '#064e3b', marginTop: 2, lineHeight: 21 },
  emulateBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fefce8',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#fef08a',
  },
  emulateLabel: { fontSize: 13, fontWeight: '800', color: '#854d0e', marginBottom: 4 },
  emulateText: { fontSize: 14, color: '#713f12', lineHeight: 21, marginBottom: 10 },
  emulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  emulateBtnDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  emulateBtnText: { fontSize: 13, fontWeight: '700', color: '#059669' },
  emulateBtnTextDone: { color: '#ffffff' },
  quizBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  quizTitle: { fontSize: 13, fontWeight: '800', color: '#059669', marginBottom: 4 },
  quizText: { fontSize: 13, color: '#064e3b', lineHeight: 20 },
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
});
