// Cosmic Tafakkur Journey (رحلة التفكّر في الكون: تأمّل وتعجّب)
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
import { TAFAKKUR_DATA } from "@/data/tafakkurData";
import {
  getUpgradeLabel,
  getLocalizedTafakkurStation,
} from '@/services/multilingualUpgradeService';

const TAFAKKUR_WORLD_COVER = require('../../../assets/images/tafakkur-world.jpg');
const TAFAKKUR_BADGE_IMG = require('../../../assets/images/tafakkur-badge.jpg');

const TAFAKKUR_IMAGES: Record<string, any> = {
  'tafakkur-1': require('../../../assets/images/scene-she-camel-rock.jpg'),
  'tafakkur-2': require('../../../assets/images/hero-oasis.jpg'),
  'tafakkur-3': require('../../../assets/images/scene-desert-stars.jpg'),
  'tafakkur-4': require('../../../assets/images/scene-ibrahim-kaaba.jpg'),
  'tafakkur-5': require('../../../assets/images/scene-earth-dawn.jpg'),
  'tafakkur-6': require('../../../assets/images/tafakkur-rain.jpg'),
  'tafakkur-7': require('../../../assets/images/tafakkur-plant.jpg'),
  'tafakkur-8': require('../../../assets/images/tafakkur-ship.jpg'),
  'tafakkur-9': require('../../../assets/images/scene-isa-bird.jpg'),
  'tafakkur-10': require('../../../assets/images/nation-garden.jpg'),
  'tafakkur-11': require('../../../assets/images/tafakkur-heart.jpg'),
};

export default function TafakkurHubScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [selectedStationId, setSelectedStationId] = useState<string>('tafakkur-1');
  const [completedStations, setCompletedStations] = useState<Record<string, boolean>>({});
  const [dhikrCount, setDhikrCount] = useState<Record<string, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  const currentStation = TAFAKKUR_DATA.find(s => s.id === selectedStationId) || TAFAKKUR_DATA[0];
  const localizedStation = getLocalizedTafakkurStation(currentStation, language);

  const handleDhikrPress = (id: string) => {
    const current = dhikrCount[id] || 0;
    const nextCount = current + 1;
    setDhikrCount(prev => ({ ...prev, [id]: nextCount }));

    if (nextCount === 3) {
      addStars(3);
      setCelebrationData({
        stars: 3,
        gems: 1,
        title: getUpgradeLabel('tafakkurDhikrCelebrationTitle', language),
        subtitle: getUpgradeLabel('tafakkurDhikrCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  const handleMarkStationDone = (id: string) => {
    const isNowDone = !completedStations[id];
    setCompletedStations(prev => ({ ...prev, [id]: isNowDone }));
    if (isNowDone) {
      addStars(5);
      addGems(2);
      setCelebrationData({
        stars: 5,
        gems: 2,
        title: getUpgradeLabel('tafakkurDoneCelebrationTitle', language),
        subtitle: getUpgradeLabel('tafakkurDoneCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={getUpgradeLabel('tafakkurHubTitle', language)}
          showBack
          onBack={() => router.back()}
        />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={TAFAKKUR_WORLD_COVER} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(10, 25, 47, 0.85)']} style={styles.heroGradient} />
            <View style={styles.heroOverlay}>
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Image source={TAFAKKUR_BADGE_IMG} style={styles.heroBadgeImg} />
                <View style={styles.heroTextWrap}>
                  <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('tafakkurHubTitle', language)}
                  </Text>
                  <Text style={[styles.heroSubtitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('tafakkurHubSubtitle', language)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Horizontal Stations Scroller */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.stationsScroller, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          >
            {TAFAKKUR_DATA.map(st => {
              const isSelected = st.id === currentStation.id;
              const isDone = completedStations[st.id];
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.stChip, isSelected && styles.stChipActive, isDone && styles.stChipDone]}
                  onPress={() => setSelectedStationId(st.id)}
                >
                  <View style={styles.stChipThumbWrap}>
                    <Image
                      source={TAFAKKUR_IMAGES[st.id] || TAFAKKUR_BADGE_IMG}
                      style={styles.stChipThumb}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={[styles.stChipNum, isSelected && styles.stChipNumActive]}>
                    {`${getUpgradeLabel('stationLabel', language)} ${st.stationNumber}`}
                  </Text>
                  {isDone && <Ionicons name="checkmark-circle" size={14} color="#10b981" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active Station Content Card */}
          <View style={styles.stationCardWrap}>
            <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.stationCard}>
              {/* Active Station Scene Image Banner */}
              <View style={styles.stationHeroSceneWrap}>
                <Image
                  source={TAFAKKUR_IMAGES[currentStation.id] || TAFAKKUR_BADGE_IMG}
                  style={styles.stationHeroSceneImage}
                  resizeMode="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(12, 74, 110, 0.75)']} style={styles.stationHeroSceneOverlay} />
                <View style={[styles.stationScenePill, isRtl ? { right: 12 } : { left: 12 }]}>
                  <Text style={styles.stationScenePillText}>
                    {`${getUpgradeLabel('stationLabel', language)} ${currentStation.stationNumber}`}
                  </Text>
                </View>
              </View>

              {/* Header */}
              <View style={[styles.stHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.stImageBadgeWrap}>
                  <Image
                    source={TAFAKKUR_IMAGES[currentStation.id] || TAFAKKUR_BADGE_IMG}
                    style={styles.stImageBadge}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.stTitleWrap}>
                  <Text style={[styles.stStationBadge, isRtl && { textAlign: 'right' }]}>
                    {`${getUpgradeLabel('stationLabel', language)} ${currentStation.stationNumber}`}
                  </Text>
                  <Text style={[styles.stTitleText, isRtl && { textAlign: 'right' }]}>
                    {localizedStation.title}
                  </Text>
                </View>
              </View>

              {/* Quran Ayah Reference */}
              <View style={styles.ayahBox}>
                <Ionicons name="sparkles" size={18} color="#0284c7" />
                <View style={styles.ayahTextWrap}>
                  <Text style={[styles.ayahLabel, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('versesLabel', language)}
                  </Text>
                  <Text style={[styles.ayahText, isRtl && { textAlign: 'right' }]}>
                    {currentStation.ayah}
                  </Text>
                </View>
              </View>

              {/* Pause & Ponder */}
              <View style={styles.ponderBox}>
                <Text style={[styles.ponderLabel, isRtl && { textAlign: 'right' }]}>
                  {getUpgradeLabel('pausePonderLabel', language)}
                </Text>
                <Text style={[styles.ponderText, isRtl && { textAlign: 'right' }]}>
                  {localizedStation.ponder || currentStation.ponder}
                </Text>
              </View>

              {/* Did you know? Science Fact */}
              <View style={styles.scienceBox}>
                <Text style={[styles.scienceLabel, isRtl && { textAlign: 'right' }]}>
                  {getUpgradeLabel('tafakkurScienceFact', language)}
                </Text>
                <Text style={[styles.scienceText, isRtl && { textAlign: 'right' }]}>
                  {localizedStation.scienceFact || currentStation.scienceFact}
                </Text>
              </View>

              {/* Observation & Discovery Activity */}
              <View style={styles.activityBox}>
                <Text style={[styles.activityLabel, isRtl && { textAlign: 'right' }]}>
                  {getUpgradeLabel('tafakkurActivity', language)}
                </Text>
                <Text style={[styles.activityText, isRtl && { textAlign: 'right' }]}>
                  {localizedStation.activity || currentStation.activity}
                </Text>
              </View>

              {/* Dhikr Counter */}
              <View style={styles.dhikrCard}>
                <View style={[styles.dhikrHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="heart" size={18} color="#059669" />
                  <Text style={[styles.dhikrTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('propheticDhikrLabel', language)}
                  </Text>
                </View>
                <Text style={[styles.dhikrPhrase, isRtl && { textAlign: 'right' }]}>
                  {localizedStation.dhikr || currentStation.dhikr}
                </Text>
                <TouchableOpacity
                  style={styles.dhikrBtn}
                  onPress={() => handleDhikrPress(currentStation.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dhikrBtnText}>
                    {`${getUpgradeLabel('praiseAndGlorifyLabel', language)} (${dhikrCount[currentStation.id] || 0}/3)`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick Quiz */}
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

              {/* Complete Station Button */}
              <TouchableOpacity
                style={[styles.completeBtn, completedStations[currentStation.id] && styles.completeBtnDone]}
                onPress={() => handleMarkStationDone(currentStation.id)}
              >
                <Ionicons
                  name={completedStations[currentStation.id] ? 'checkmark-circle' : 'medal-outline'}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.completeBtnText}>
                  {completedStations[currentStation.id]
                    ? getUpgradeLabel('markDone', language)
                    : getUpgradeLabel('tafakkurStationDone', language)}
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
  safeArea: { flex: 1, backgroundColor: '#f0f9ff' },
  container: { flex: 1 },
  badgePill: {
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  badgePillText: { fontSize: 13, fontWeight: '700', color: '#0284c7' },
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
  heroBadgeImg: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#38bdf8' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 19, fontWeight: '800', color: '#ffffff' },
  heroSubtitle: { fontSize: 12, color: '#e0f2fe', marginTop: 4, lineHeight: 17 },
  stationsScroller: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: 10 },
  stChip: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    minWidth: 80,
    ...SHADOWS.soft,
  },
  stChipActive: { borderColor: '#0284c7', backgroundColor: '#e0f2fe', borderWidth: 2 },
  stChipDone: { borderColor: '#10b981' },
  stChipThumbWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    marginBottom: 4,
    backgroundColor: '#f0f9ff',
  },
  stChipThumb: { width: '100%', height: '100%' },
  stChipNum: { fontSize: 11, fontWeight: '700', color: '#0369a1' },
  stChipNumActive: { color: '#0c4a6e', fontWeight: '800' },
  stationCardWrap: { marginHorizontal: SPACING.md, marginTop: 4 },
  stationCard: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  stationHeroSceneWrap: {
    height: 140,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  stationHeroSceneImage: { width: '100%', height: '100%' },
  stationHeroSceneOverlay: { ...StyleSheet.absoluteFill },
  stationScenePill: {
    position: 'absolute',
    top: 10,
    backgroundColor: 'rgba(2, 132, 199, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  stationScenePillText: { fontSize: 11, fontWeight: '800', color: '#ffffff' },
  stHeaderRow: { alignItems: 'center', gap: 12, marginBottom: SPACING.md },
  stImageBadgeWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0284c7',
    ...SHADOWS.soft,
  },
  stImageBadge: { width: '100%', height: '100%' },
  stTitleWrap: { flex: 1 },
  stStationBadge: { fontSize: 12, fontWeight: '700', color: '#0284c7' },
  stTitleText: { fontSize: 17, fontWeight: '800', color: '#0c4a6e', marginTop: 2 },
  ayahBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#f0f9ff',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  ayahTextWrap: { flex: 1 },
  ayahLabel: { fontSize: 12, fontWeight: '700', color: '#0284c7' },
  ayahText: { fontSize: 14, color: '#0369a1', fontStyle: 'italic', marginTop: 2, lineHeight: 20 },
  ponderBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fefce8',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  ponderLabel: { fontSize: 13, fontWeight: '800', color: '#854d0e', marginBottom: 4 },
  ponderText: { fontSize: 14, color: '#713f12', lineHeight: 21 },
  scienceBox: {
    marginTop: SPACING.md,
    backgroundColor: '#ecfeff',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#cffafe',
  },
  scienceLabel: { fontSize: 13, fontWeight: '800', color: '#0e7490', marginBottom: 4 },
  scienceText: { fontSize: 14, color: '#155e75', lineHeight: 21 },
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
  dhikrCard: {
    marginTop: SPACING.md,
    backgroundColor: '#f0fdfa',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#99f6e4',
  },
  dhikrHeader: { alignItems: 'center', gap: 6, marginBottom: 4 },
  dhikrTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e' },
  dhikrPhrase: { fontSize: 15, fontWeight: '700', color: '#115e59', lineHeight: 22, marginBottom: 10 },
  dhikrBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  dhikrBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  quizBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quizTitle: { fontSize: 13, fontWeight: '800', color: '#0284c7', marginBottom: 4 },
  quizText: { fontSize: 13, color: '#334155', lineHeight: 20 },
  completeBtn: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  completeBtnDone: { backgroundColor: '#10b981' },
  completeBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
