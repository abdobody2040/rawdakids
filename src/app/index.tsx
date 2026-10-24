// Home Screen — Rawda Kids Redesign (PRD §7.2)
// 7-block layout: Header · Bismillah · Continue · Daily 3 Steps · Hadith · Six Worlds Grid · Prayer Strip
import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { HADITHS_DATA } from '@/data/hadithData';
import { audioService } from '@/services/audioService';
import { SHADOWS, RADIUS, SPACING, COLORS } from "@/constants/theme";
import StarRewardCelebration from '@/components/StarRewardCelebration';
import AppBottomNav from '@/components/AppBottomNav';
import KidAvatar from '@/components/KidAvatar';
import ParentGateModal from '@/components/ParentGateModal';
import SmartSearchModal from '@/components/SmartSearchModal';
import ChildProfileSwitchModal from '@/components/ChildProfileSwitchModal';
import LanguageSelectModal from '@/components/LanguageSelectModal';
import { AVAILABLE_LANGUAGES, TRANSLATIONS } from '@/constants/i18n';
import { getLocalizedHadith, formatLocalizedTodayDate } from "@/services/multilingualContentService";
import { isBedtimeActive, getPrayerTimesForCity } from '@/services/prayerTimeService';

// ── World images ──────────────────────────────────────────────────────────

const WORLD_IMAGES: Record<string, any> = {
  quran:    require('../../assets/images/quran-garden.jpg'),
  worship:  require('../../assets/images/wudu-garden.jpg'),
  stories:  require('../../assets/images/prophets-caravan.jpg'),
  akhlaq:   require('../../assets/images/sunnah-path.jpg'),
  asmaAllah:require('../../assets/images/asma-allah-world.jpg'),
  wonder:   require('../../assets/images/tafakkur-world.jpg'),
};


// ── Daily step data ───────────────────────────────────────────────────────
interface DailyStep {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  route: string;
}

const DAILY_STEPS: DailyStep[] = [
  {
    id: 'listen',
    labelAr: 'استمع',
    labelEn: 'Listen',
    icon: 'headset',
    color: '#059669',
    bg: '#D1FAE5',
    route: '/quran',
  },
  {
    id: 'learn',
    labelAr: 'تعلّم',
    labelEn: 'Learn',
    icon: 'book-outline',
    color: '#7C3AED',
    bg: '#EDE9FE',
    route: '/prophets',
  },
  {
    id: 'practice',
    labelAr: 'طبّق',
    labelEn: 'Practice',
    icon: 'flower-outline',
    color: '#0284C7',
    bg: '#E0F2FE',
    route: '/arkan/salah',
  },
];

// ── Six Worlds (PRD §5, mapping from 13 cards) ────────────────────────────
interface World {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  route: string;
  ageGate?: '9+';
  accent: string;
  bg: string;
}

const SIX_WORLDS: World[] = [
  {
    id: 'quran',
    titleAr: 'حديقة القرآن',
    titleEn: 'Quran Garden',
    subtitleAr: '١١٤ سورة مباركة',
    subtitleEn: '114 Surahs',
    route: '/quran',
    accent: '#059669',
    bg: '#D1FAE5',
  },
  {
    id: 'worship',
    titleAr: 'العبادة',
    titleEn: 'Worship',
    subtitleAr: 'الوضوء والصلاة والأذكار',
    subtitleEn: 'Wudu, Prayer & Adhkar',
    route: '/prayer',
    accent: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    id: 'stories',
    titleAr: 'القصص',
    titleEn: 'Stories',
    subtitleAr: 'الأنبياء والصحابة والسيرة',
    subtitleEn: 'Prophets, Companions, Seerah',
    route: '/prophets',
    accent: '#7C3AED',
    bg: '#EDE9FE',
  },
  {
    id: 'akhlaq',
    titleAr: 'الأخلاق والسنّة',
    titleEn: 'Character & Sunnah',
    subtitleAr: '١٠٠ حديث نبوي وأخلاق',
    subtitleEn: '100 Hadiths & Manners',
    route: '/manners',
    accent: '#D97706',
    bg: '#FEF3C7',
  },
  {
    id: 'asmaAllah',
    titleAr: 'أسماء الله',
    titleEn: 'Names of Allah',
    subtitleAr: '٩٩ اسماً مباركاً — واحد كل يوم',
    subtitleEn: '99 Names — one per day',
    route: '/asma-allah',
    accent: '#5B21B6',
    bg: '#EDE9FE',
  },
  {
    id: 'wonder',
    titleAr: 'التفكّر',
    titleEn: 'Wonder',
    subtitleAr: 'آيات الله في الكون والحياة',
    subtitleEn: 'Signs of Allah in creation',
    route: '/tafakkur',
    accent: '#0369A1',
    bg: '#E0F2FE',
  },
];

// ─────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const {
    language,
    hasCompletedOnboarding,
    isHydrated,
    recordDailyActivity,
    profiles,
    activeProfileId,
    streakCount,
    addStars,
    addGems,
    lastReadMushafPage,
    parentSettings,
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  const isBedtimeNow = Boolean(
    parentSettings.bedtimeLockEnabled &&
      isBedtimeActive(parentSettings.bedtimeStart, parentSettings.bedtimeEnd)
  );

  const [isPlayingHadith, setIsPlayingHadith] = useState(false);
  const [showHadithReward, setShowHadithReward] = useState(false);
  const [parentGateVisible, setParentGateVisible] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isPrayerStripDismissed, setIsPrayerStripDismissed] = useState(false);

  const prayerData = useMemo(() => {
    return getPrayerTimesForCity(
      parentSettings.prayerCity || 'cairo',
      parentSettings.madhhab || 'shafii',
      isAr
    );
  }, [parentSettings.prayerCity, parentSettings.madhhab, isAr]);

  const nextPrayer = prayerData.nextSlot;

  // HOME-5: Bismillah banner on first open of the session
  const [showBismillah, setShowBismillah] = useState(true);
  const [bismillahOpacity] = useState(() => new Animated.Value(0));

  // Completed daily steps
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Fade-in / Fade-out animation for Bismillah
  useEffect(() => {
    if (!showBismillah) return;
    Animated.sequence([
      Animated.timing(bismillahOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(2800),
      Animated.timing(bismillahOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      setShowBismillah(false);
    });
  }, [bismillahOpacity, showBismillah]);

  // Hadith of the Day (rotates by day of year)
  const [hadithOfTheDay] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    return HADITHS_DATA[dayOfYear % HADITHS_DATA.length] || HADITHS_DATA[0];
  });

  // Check if today is Friday (PRD §7.4 Friday mode)
  const isFriday = new Date().getDay() === 5;

  const handlePlayHadithOfTheDay = async () => {
    if (isPlayingHadith) {
      await audioService.stopDua();
      setIsPlayingHadith(false);
      return;
    }
    setIsPlayingHadith(true);
    await audioService.playDua(hadithOfTheDay.arabicText, (status) => {
      if (status.didJustFinish) {
        setIsPlayingHadith(false);
        addStars(1);
        addGems(2);
        setShowHadithReward(true);
      } else if (!status.isPlaying) {
        setIsPlayingHadith(false);
      }
    });
  };

  // HOME-4: Hijri date computed on device at open
  const todayDateStr = useMemo(() => formatLocalizedTodayDate(language), [language]);

  useEffect(() => {
    if (isHydrated && hasCompletedOnboarding) {
      recordDailyActivity();
    }
  }, [isHydrated, hasCompletedOnboarding, recordDailyActivity]);

  if (isHydrated && !hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Active child profile
  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
      name: '',
      avatar: '🧒🏻',
      ageBand: '7-9' as const,
    };

  // ONB-2: No hard-coded name — use يا بطل / يا بطلة when name is empty
  const displayName = activeProfile.name?.trim()
    ? activeProfile.name
    : (isAr ? 'يا بطل' : 'Friend');

  const ageBand = activeProfile?.ageBand || '7-9';

  // AGE-2: Hide 9+ content from profiles younger than 10
  const canSeeAgedContent = ageBand === '10-13';
  const visibleWorlds = SIX_WORLDS.filter(
    (w) => !w.ageGate || canSeeAgedContent
  );

  // Completed steps count for progress ring (max 3)
  const completedCount = completedSteps.size;

  const handleStepTap = (step: DailyStep) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step.id);
      return next;
    });
    router.push(step.route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <ScrollView
          style={styles.mainCanvas}
          contentContainerStyle={styles.mainCanvasContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── BLOCK 1: HEADER (64 dp) ────────────────────────────────── */}
          <View style={styles.headerContainer}>
            {/* Row 1: Avatar + Greeting + Streak + Actions */}
            <View
              style={[
                styles.headerRow,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              {/* Avatar → taps to Me/Progress */}
              <TouchableOpacity
                style={[styles.headerLeft, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
                onPress={() => router.push('/progress')}
                activeOpacity={0.85}
              >
                <View style={styles.avatarWrapper}>
                  <KidAvatar avatar={activeProfile.avatar} size={44} />
                  <View style={styles.avatarOnlineDot} />
                </View>
                <View style={[styles.greetingCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.greetingSub, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr ? 'السلام عليكم 🌿' : 'As-salamu alaykum 🌿'}
                  </Text>
                  <Text style={[styles.greetingMain, { textAlign: isAr ? 'right' : 'left' }]}>
                    {(t as any).welcomePrefix || (isAr ? 'أهلاً يا ' : 'Welcome, ')}
                    <Text style={styles.greetingName}>{displayName}</Text>
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Right actions: Streak sprout + Search + Lang + Parent */}
              <View style={[styles.headerActions, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                {/* Streak (sprout icon, not flame) */}
                <TouchableOpacity
                  style={styles.streakChip}
                  onPress={() => router.push('/progress')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="leaf" size={14} color="#16A34A" />
                  <Text style={styles.streakText}>{streakCount}</Text>
                </TouchableOpacity>

                {/* Search icon (hidden for 4-6 per PRD §7.2) */}
                {ageBand !== '4-6' && (
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => setShowSmartSearch(true)}
                    activeOpacity={0.8}
                    accessibilityLabel={isAr ? 'بحث' : 'Search'}
                  >
                    <Ionicons name="search" size={18} color="#064E3B" />
                  </TouchableOpacity>
                )}

                {/* Language */}
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setShowLanguageModal(true)}
                  activeOpacity={0.8}
                  accessibilityLabel={isAr ? 'اللغة' : 'Language'}
                >
                  <Text style={styles.flagText}>
                    {AVAILABLE_LANGUAGES.find((l) => l.code === language)?.flagEmoji || '🇸🇦'}
                  </Text>
                </TouchableOpacity>

                {/* Parent zone (lock icon) */}
                <TouchableOpacity
                  style={[styles.iconBtn, styles.lockBtn]}
                  onPress={() => setParentGateVisible(true)}
                  activeOpacity={0.8}
                  accessibilityLabel={isAr ? 'منطقة الأهل' : 'Parent zone'}
                >
                  <Ionicons name="lock-closed" size={16} color="#064E3B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Row 2: Date pill (phones only show on wide, always in parent zone) */}
            <View style={[styles.datePillRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <View style={styles.datePill}>
                <Ionicons name="calendar-outline" size={12} color="#16A34A" />
                <Text style={styles.dateText}>{todayDateStr}</Text>
              </View>
              {/* Profile switch */}
              <TouchableOpacity
                style={styles.switchBtn}
                onPress={() => setShowProfileSwitcher(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="swap-horizontal" size={13} color="#064E3B" />
                <Text style={styles.switchBtnText}>{t.switchProfile}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── BLOCK 2: BISMILLAH BANNER ──────────────────────────────── */}
          {showBismillah && (
            <Animated.View style={[styles.bismillahBanner, { opacity: bismillahOpacity }]}>
              <Text style={styles.bismillahText}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </Text>
            </Animated.View>
          )}

          {/* BEDTIME LOCK WINDOW BANNER (PRD §8 - PAR-3) */}
          {isBedtimeNow && (
            <View style={styles.bedtimeBanner}>
              <LinearGradient
                colors={['#1E1B4B', '#312E81']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.bedtimeBannerInner, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
              >
                <Ionicons name="moon" size={28} color="#FDE047" />
                <View style={[styles.bedtimeTextCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.bedtimeTitle}>
                    {isAr ? 'وقت النوم الهادئ والسكينة 🌙' : 'Peaceful Bedtime Routine 🌙'}
                  </Text>
                  <Text style={[styles.bedtimeSubtitle, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr
                      ? 'حان وقت راحة عينيك يا بطل! هيا نستمع لآية الكرسي وأذكار النوم المباركة.'
                      : 'Time for restful sleep! Listen to Ayat Al-Kursi and soothing bedtime adhkar.'}
                  </Text>
                  <View style={[styles.bedtimeActionsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity
                      style={styles.bedtimeActionBtn}
                      onPress={() => router.push('/dua' as any)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="sparkles" size={13} color="#FDE047" />
                      <Text style={styles.bedtimeActionText}>
                        {isAr ? 'أذكار النوم 🤲' : 'Bedtime Dua'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.bedtimeParentBtn}
                      onPress={() => setParentGateVisible(true)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="lock-open-outline" size={13} color="#C7D2FE" />
                      <Text style={styles.bedtimeParentBtnText}>
                        {isAr ? 'فك القفل (للأهل) 🔑' : 'Parent Unlock'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* ── FRIDAY SPECIAL BANNER (PRD §7.4 & Phase 4) ─ */}
          {isFriday && (
            <View style={styles.fridayHomeBanner}>
              <LinearGradient
                colors={['#047857', '#065F46']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.fridayHomeBannerInner, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
              >
                <Ionicons name="sparkles" size={22} color="#FDE047" />
                <View style={[styles.fridayTextCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.fridayHomeTitle}>
                    {isAr ? 'يوم الجمعة المبارك ✨' : 'Blessed Friday ✨'}
                  </Text>
                  <Text style={[styles.fridayHomeSub, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr
                      ? 'أكثروا من الصلاة على النبي ﷺ واقرأوا سورة الكهف'
                      : 'Send blessings upon Prophet Muhammad ﷺ and read Surah Al-Kahf'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.fridayKahfBtn}
                  onPress={() => router.push('/quran/18' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.fridayKahfBtnText}>
                    {isAr ? 'الكهف 📖' : 'Al-Kahf 📖'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* ── BLOCK 3: CONTINUE CARD (Primary CTA — coral, full width) ─ */}
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => router.push(lastReadMushafPage ? `/quran/mushaf` as any : '/quran')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#F26B4F', '#E85535']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueCardInner}
            >
              {/* Left: thumbnail */}
              <View style={styles.continueThumbnail}>
                <Ionicons name="book" size={28} color="#FFFFFF" />
              </View>

              {/* Center: label */}
              <View style={[styles.continueMid, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.continueLabel, { textAlign: isAr ? 'right' : 'left' }]}>
                  {isAr ? 'كمل من حيث توقفت' : 'Continue where you left off'}
                </Text>
                <Text style={[styles.continueSub, { textAlign: isAr ? 'right' : 'left' }]}>
                  {isAr
                    ? `المصحف — صفحة ${lastReadMushafPage || 1}`
                    : `Mushaf — page ${lastReadMushafPage || 1}`}
                </Text>
              </View>

              {/* Right: arrow */}
              <Ionicons
                name={isAr ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* ── AGES 4–6: THREE HUGE TILES (PRD §7.2) vs AGES 7–12 REGULAR BLOCKS ── */}
          {ageBand === '4-6' ? (
            <View style={styles.seedlingSection}>
              {/* Mascot voice prompt */}
              <View style={[styles.mascotVoiceCard, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={styles.mascotVoiceAvatar}>
                  <Text style={{ fontSize: 32 }}>🏮</Text>
                </View>
                <View style={[styles.mascotVoiceTexts, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.mascotVoiceTitle}>
                    {isAr ? 'صديقك نور المحبوب يقول لك:' : 'Noor the Mascot says to you:'}
                  </Text>
                  <Text style={[styles.mascotVoiceSpeech, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr
                      ? 'أهلاً يا صديقي الصغير! 🎈 اختر زراً كبيراً لنستمع ونلعب ونتعلم معاً 🌸'
                      : 'Welcome little friend! 🎈 Tap a big tile to listen, pray, and play together 🌸'}
                  </Text>
                </View>
              </View>

              {/* 3 Huge Action Tiles */}
              <View style={styles.seedlingTilesRow}>
                {/* Tile 1: Listen & Repeat */}
                <TouchableOpacity
                  style={styles.seedlingTile}
                  onPress={() => router.push('/quran' as any)}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#059669', '#10B981']}
                    style={styles.seedlingTileGradient}
                  >
                    <Ionicons name="headset" size={44} color="#FFFFFF" />
                    <Text style={styles.seedlingTileTitle}>
                      {isAr ? 'استمع وردد 🎧' : 'Listen & Repeat 🎧'}
                    </Text>
                    <Text style={styles.seedlingTileSub}>
                      {isAr ? 'قصار السور بصوت الشيخ والترديد' : 'Short Surahs with joyful recitation'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Tile 2: Pray & Wudu */}
                <TouchableOpacity
                  style={styles.seedlingTile}
                  onPress={() => router.push('/prayer' as any)}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#0284C7', '#38BDF8']}
                    style={styles.seedlingTileGradient}
                  >
                    <Ionicons name="water" size={44} color="#FFFFFF" />
                    <Text style={styles.seedlingTileTitle}>
                      {isAr ? 'صلاتي ووضوئي 💧' : 'My Prayer & Wudu 💧'}
                    </Text>
                    <Text style={styles.seedlingTileSub}>
                      {isAr ? 'تعلم الوضوء والصلاة خطوة بخطوة' : 'Learn Wudu & Prayer step by step'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Tile 3: Play & Learn */}
                <TouchableOpacity
                  style={styles.seedlingTile}
                  onPress={() => router.push('/discover' as any)}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#D97706', '#F59E0B']}
                    style={styles.seedlingTileGradient}
                  >
                    <Ionicons name="sparkles" size={44} color="#FFFFFF" />
                    <Text style={styles.seedlingTileTitle}>
                      {isAr ? 'العب وتعلم 🎈' : 'Play & Learn 🎈'}
                    </Text>
                    <Text style={styles.seedlingTileSub}>
                      {isAr ? 'قصص الأنبياء وحيوانات القرآن' : 'Prophets stories & Quran animals'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* ── BLOCK 4: TODAY'S 3 STEPS ─────────────────────────────────── */}
              <View style={styles.stepsSection}>
            <View style={[styles.stepsSectionHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              {/* Progress ring summary */}
              <View style={styles.stepsRingWrap}>
                <View style={[styles.stepsRing, { borderColor: completedCount === 3 ? '#16A34A' : '#E8D9BF' }]}>
                  <Text style={styles.stepsRingCount}>{completedCount}</Text>
                  <Text style={styles.stepsRingTotal}>/3</Text>
                </View>
              </View>
              <View style={[{ flex: 1 }, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.stepsSectionTitle, { textAlign: isAr ? 'right' : 'left' }]}>
                  {isAr ? 'خطوات اليوم الثلاث' : "Today's 3 steps"}
                </Text>
                <Text style={[styles.stepsSectionSub, { textAlign: isAr ? 'right' : 'left' }]}>
                  {completedCount === 3
                    ? (isAr ? 'ما شاء الله! أكملت اليوم! 🌱' : 'MashaAllah! Day complete! 🌱')
                    : (isAr ? 'اكتشف خطوة جديدة' : 'Discover a new step')}
                </Text>
              </View>
            </View>

            {/* Three step tiles */}
            <View style={styles.stepsTiles}>
              {DAILY_STEPS.map((step) => {
                const done = completedSteps.has(step.id);
                return (
                  <TouchableOpacity
                    key={step.id}
                    style={[
                      styles.stepTile,
                      { backgroundColor: done ? step.bg : '#FFFFFF', borderColor: done ? step.color + '44' : '#E8D9BF' },
                    ]}
                    onPress={() => handleStepTap(step)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.stepTileIcon, { backgroundColor: step.bg }]}>
                      <Ionicons
                        name={done ? 'checkmark-circle' : step.icon}
                        size={22}
                        color={done ? '#16A34A' : step.color}
                      />
                    </View>
                    <Text style={[styles.stepTileLabel, { color: done ? '#16A34A' : COLORS.ink900 }]}>
                      {isAr ? step.labelAr : step.labelEn}
                    </Text>
                    {done && (
                      <View style={styles.stepDoneSprout}>
                        <Ionicons name="leaf" size={10} color="#16A34A" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── BLOCK 5: HADITH OF THE DAY (collapsed card) ─────────────── */}
          <View style={styles.hadithCard}>
            <LinearGradient
              colors={['#FFFBF0', '#FFF3D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hadithCardInner}
            >
              {/* Header row */}
              <View style={[styles.hadithHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Text style={styles.hadithLabel}>
                  {isAr ? 'حديث اليوم المبارك' : 'Hadith of the Day'}
                </Text>
                <View style={styles.hadithGradePill}>
                  <Text style={styles.hadithGradeText}>{hadithOfTheDay.grade}</Text>
                </View>
              </View>

              {/* Arabic text */}
              <Text style={[styles.hadithArabic, { textAlign: isAr ? 'right' : 'left' }]}>
                «{hadithOfTheDay.arabicText}»
              </Text>

              {/* Explanation (collapsed size) */}
              <Text
                style={[styles.hadithExplanation, { textAlign: isAr ? 'right' : 'left' }]}
                numberOfLines={2}
              >
                {getLocalizedHadith(hadithOfTheDay, language).explanation}
              </Text>

              {/* Actions */}
              <View style={[styles.hadithActions, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={[styles.hadithPlayBtn, isPlayingHadith && styles.hadithPlayBtnActive]}
                  onPress={handlePlayHadithOfTheDay}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isPlayingHadith ? 'pause-circle' : 'volume-high'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.hadithPlayBtnText}>
                    {isPlayingHadith
                      ? (isAr ? 'إيقاف' : 'Pause')
                      : (isAr ? 'استمع' : 'Listen')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.hadithMoreBtn}
                  onPress={() => router.push(`/sunnah/${hadithOfTheDay.id}`)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hadithMoreBtnText}>
                    {isAr ? 'قصة وعمل اليوم' : 'Story & Action'}
                  </Text>
                  <Ionicons
                    name={isAr ? 'chevron-back' : 'chevron-forward'}
                    size={14}
                    color="#92400E"
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* ── BLOCK 6: SIX WORLDS GRID (2 columns) ─────────────────────── */}
          <View style={styles.worldsSection}>
            <View style={[styles.worldsSectionHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.worldsSectionTitle, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? 'ستة عوالم مباركة' : 'Six wonderful worlds'}
              </Text>
            </View>

            <View style={styles.worldsGrid}>
              {visibleWorlds.map((world) => (
                <TouchableOpacity
                  key={world.id}
                  style={[styles.worldCard, { borderLeftColor: world.accent }]}
                  onPress={() => router.push(world.route as any)}
                  activeOpacity={0.88}
                >
                  {/* Cover image */}
                  <View style={styles.worldImageWrap}>
                    <Image
                      source={WORLD_IMAGES[world.id]}
                      style={styles.worldCoverImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(6,14,10,0.55)']}
                      style={styles.worldImgGradient}
                    />
                    {/* Accent chip */}
                    <View style={[styles.worldAccentChip, { backgroundColor: world.accent + 'EE' }]}>
                      <Ionicons name="compass" size={12} color="#FFFFFF" />
                    </View>
                  </View>

                  {/* Text body */}
                  <View style={styles.worldBody}>
                    <Text
                      style={[styles.worldTitle, { textAlign: isAr ? 'right' : 'left' }]}
                      numberOfLines={2}
                    >
                      {isAr ? world.titleAr : world.titleEn}
                    </Text>
                    <Text
                      style={[styles.worldSubtitle, { textAlign: isAr ? 'right' : 'left' }]}
                      numberOfLines={1}
                    >
                      {isAr ? world.subtitleAr : world.subtitleEn}
                    </Text>
                    <View
                      style={[
                        styles.worldFooter,
                        { flexDirection: isAr ? 'row-reverse' : 'row' },
                      ]}
                    >
                      <View style={[styles.worldExplorePill, { backgroundColor: world.bg }]}>
                        <Text style={[styles.worldExploreTxt, { color: world.accent }]}>
                          {isAr ? 'استكشف ←' : 'Explore →'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
            </>
          )}

          {/* ── BLOCK 7: PRAYER-TIME STRIP (PRD §7.2 - HOME-1 & PRY-4) ──────── */}
          {!isPrayerStripDismissed && (
            <View style={styles.prayerStrip}>
              <LinearGradient
                colors={['#0284C7', '#0369A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.prayerStripInner, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
              >
                <View style={styles.prayerStripIconBox}>
                  <Ionicons name="time" size={20} color="#FFFFFF" />
                </View>
                <TouchableOpacity
                  style={[{ flex: 1 }, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}
                  onPress={() => router.push('/prayer' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.prayerStripTitle, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr
                      ? `حان وقت صلاة ${nextPrayer.nameAr} (${nextPrayer.timeStringAr})`
                      : `Time for ${nextPrayer.nameEn} Prayer (${nextPrayer.timeStringEn})`}
                  </Text>
                  <Text style={[styles.prayerStripSub, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr
                      ? `مواقيت ${prayerData.city.nameAr} • هيا نتوضأ معاً! 💧`
                      : `Times in ${prayerData.city.nameEn} • Let’s do Wudu! 💧`}
                  </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                  <TouchableOpacity
                    style={styles.prayerStripBtn}
                    onPress={() => router.push('/arkan/salah?mode=wudu')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.prayerStripBtnText}>
                      {isAr ? 'الوضوء 💧' : 'Wudu 💧'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.prayerStripDismissBtn}
                    onPress={() => setIsPrayerStripDismissed(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

        </ScrollView>

        {/* BOTTOM NAVIGATION (5 task-based tabs) */}
        <AppBottomNav />
      </View>

      {/* ── Overlays & Modals ─────────────────────────────────────────── */}
      <StarRewardCelebration
        visible={showHadithReward}
        starsEarned={1}
        gemsEarned={2}
        title={isAr ? 'أحسنت يا بطل!' : 'MashaAllah!'}
        subtitle={
          isAr
            ? 'استمعت لكلام النبي ﷺ المبارك ونلت أجراً ونوراً!'
            : 'You listened to the blessed words of the Prophet ﷺ!'
        }
        onDismiss={() => setShowHadithReward(false)}
      />

      <ParentGateModal
        visible={parentGateVisible}
        onClose={() => setParentGateVisible(false)}
        onSuccess={() => {
          setParentGateVisible(false);
          router.push('/parents');
        }}
      />

      <SmartSearchModal
        visible={showSmartSearch}
        onDismiss={() => setShowSmartSearch(false)}
      />

      <ChildProfileSwitchModal
        visible={showProfileSwitcher}
        onClose={() => setShowProfileSwitcher(false)}
      />

      <LanguageSelectModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.sand50,
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.sand50,
    flexDirection: 'column',
  },
  mainCanvas: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.sand50,
  },
  mainCanvasContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: 12,
    paddingBottom: 80,
    gap: SPACING.md,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
  },

  // ── BLOCK 1: HEADER ─────────────────────────────────────────────────
  headerContainer: {
    gap: 8,
  },
  headerRow: {
    alignItems: 'center',
    gap: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 2,
    borderColor: COLORS.gold400 + '88',
    borderRadius: 26,
    padding: 1,
    backgroundColor: '#FFFFFF',
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gardenGreen,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingCol: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 12,
    color: COLORS.gardenGreen,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  greetingMain: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.brandEmerald,
    letterSpacing: -0.3,
    marginTop: 1,
  },
  greetingName: {
    color: COLORS.coral500,
  },
  headerActions: {
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.gardenGreen,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  lockBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  flagText: {
    fontSize: 16,
  },
  datePillRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  dateText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBEFD5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brandEmerald,
  },

  // ── BLOCK 2: BISMILLAH ───────────────────────────────────────────────
  bismillahBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandEmerald,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...SHADOWS.medium,
  },
  bismillahText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 36,
  },

  // ── FRIDAY BANNER ──────────────────────────────────────────────────
  fridayHomeBanner: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  fridayHomeBannerInner: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fridayTextCol: {
    flex: 1,
  },
  fridayHomeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  fridayHomeSub: {
    fontSize: 11,
    color: '#D1FAE5',
    lineHeight: 16,
  },
  fridayKahfBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    ...SHADOWS.soft,
  },
  fridayKahfBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },

  // ── BLOCK 3: CONTINUE CARD ───────────────────────────────────────────
  continueCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    minHeight: 72,
    ...SHADOWS.medium,
  },
  continueCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
    minHeight: 72,
  },
  continueThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  continueMid: {
    flex: 1,
    gap: 3,
  },
  continueLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  continueSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '600',
  },

  // ── BLOCK 4: DAILY STEPS ─────────────────────────────────────────────
  stepsSection: {
    gap: 12,
  },
  stepsSectionHeader: {
    alignItems: 'center',
    gap: 12,
  },
  stepsRingWrap: {
    flexShrink: 0,
  },
  stepsRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#E8D9BF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  stepsRingCount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.brandEmerald,
  },
  stepsRingTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  stepsSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.brandEmerald,
  },
  stepsSectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepsTiles: {
    flexDirection: 'row',
    gap: 10,
  },
  stepTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    gap: 8,
    minHeight: 96,
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.soft,
  },
  stepTileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTileLabel: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.ink900,
  },
  stepDoneSprout: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // ── BLOCK 5: HADITH CARD ─────────────────────────────────────────────
  hadithCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FCE7B8',
    ...SHADOWS.soft,
  },
  hadithCardInner: {
    padding: 18,
    gap: 12,
    borderRadius: RADIUS.lg,
  },
  hadithHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hadithLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#92400E',
  },
  hadithGradePill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hadithGradeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  hadithArabic: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.brandEmerald,
    lineHeight: 36,
  },
  hadithExplanation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: '600',
  },
  hadithActions: {
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  hadithPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.brandEmerald,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  hadithPlayBtnActive: {
    backgroundColor: COLORS.gardenGreen,
  },
  hadithPlayBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hadithMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF3D4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCE7B8',
  },
  hadithMoreBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },

  // ── BLOCK 6: SIX WORLDS GRID ─────────────────────────────────────────
  worldsSection: {
    gap: 12,
  },
  worldsSectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  worldsSectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.brandEmerald,
  },
  worldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  worldCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    ...SHADOWS.soft,
  },
  worldImageWrap: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#E6EDE8',
  },
  worldCoverImage: {
    width: '100%',
    height: '100%',
  },
  worldImgGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  worldAccentChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  worldBody: {
    padding: 14,
    gap: 4,
  },
  worldTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.brandEmerald,
    lineHeight: 22,
  },
  worldSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  worldFooter: {
    marginTop: 8,
  },
  worldExplorePill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  worldExploreTxt: {
    fontSize: 12,
    fontWeight: '800',
  },

  // ── BLOCK 7: PRAYER STRIP ────────────────────────────────────────────
  prayerStrip: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    ...SHADOWS.soft,
  },
  prayerStripInner: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderRadius: RADIUS.lg,
  },
  prayerStripIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerStripTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  prayerStripSub: {
    fontSize: 11,
    color: '#E0F2FE',
    fontWeight: '600',
    marginTop: 2,
  },
  prayerStripBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    flexShrink: 0,
  },
  prayerStripBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0284C7',
  },
  prayerStripDismissBtn: {
    padding: 4,
    borderRadius: RADIUS.full,
  },

  // ── AGES 4–6 SEEDLING STYLES (PRD §7.2) ───────────────────────────────
  seedlingSection: {
    marginVertical: SPACING.md,
    gap: SPACING.md,
  },
  mascotVoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8D9BF',
    ...SHADOWS.sm,
  },
  mascotVoiceAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotVoiceTexts: {
    flex: 1,
  },
  mascotVoiceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 2,
  },
  mascotVoiceSpeech: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '600',
  },
  seedlingTilesRow: {
    gap: SPACING.md,
  },
  seedlingTile: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  seedlingTileGradient: {
    paddingVertical: 22,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  seedlingTileTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  seedlingTileSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '600',
  },
  // Bedtime Lock Banner styles
  bedtimeBanner: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  bedtimeBannerInner: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
  },
  bedtimeTextCol: {
    flex: 1,
  },
  bedtimeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FDE047',
    marginBottom: 2,
  },
  bedtimeSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  bedtimeActionsRow: {
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  bedtimeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4338CA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  bedtimeActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bedtimeParentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  bedtimeParentBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C7D2FE',
  },
});
