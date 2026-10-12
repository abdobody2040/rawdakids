// Home Screen: Noor Kids — Magical Learning Journey (رحلة النور الإيمانية)
import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { HADITHS_DATA } from '@/data/hadithData';
import { audioService } from '@/services/audioService';
import { SHADOWS, RADIUS } from "@/constants/theme";
import StarRewardCelebration from '@/components/StarRewardCelebration';
import AppBottomNav from '@/components/AppBottomNav';
import KidAvatar from '@/components/KidAvatar';
import ParentGateModal from '@/components/ParentGateModal';
import SmartSearchModal from '@/components/SmartSearchModal';
import { getLocalizedAgeTone } from '@/services/ageAdaptiveService';

const HERO_OASIS_IMG = require('../../assets/images/hero-oasis.jpg');
const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');
const ICON_STAR_IMG = require('../../assets/images/icon-star-3d.jpg');
const ICON_GEM_IMG = require('../../assets/images/icon-gem-3d.jpg');
const NAV_HOME_IMG = require('../../assets/images/nav-home-3d.jpg');
const NAV_QURAN_IMG = require('../../assets/images/nav-quran-3d.jpg');
const NAV_SUNNAH_IMG = require('../../assets/images/nav-sunnah-3d.jpg');
const NAV_PROPHETS_IMG = require('../../assets/images/nav-prophets-3d.jpg');

const STICKER_KAABA_IMG = require('../../assets/images/sticker-kaaba.jpg');
const STICKER_QURAN_IMG = require('../../assets/images/sticker-quran.jpg');
const STICKER_CRESCENT_IMG = require('../../assets/images/sticker-crescent.jpg');
const STICKER_LANTERN_IMG = require('../../assets/images/sticker-lantern.jpg');

const WORLD_IMAGES: Record<string, any> = {
  quran: require('../../assets/images/quran-garden.jpg'),
  sunnah: require('../../assets/images/sunnah-path.jpg'),
  prophets: require('../../assets/images/prophets-caravan.jpg'),
  manners: require('../../assets/images/manners-town.jpg'),
  arkan: require('../../assets/images/hero-oasis.jpg'),
  wudu: require('../../assets/images/wudu-garden.jpg'),
};

const WORLD_BADGE_IMAGES: Record<string, any> = {
  quran: NAV_QURAN_IMG,
  sunnah: NAV_SUNNAH_IMG,
  prophets: NAV_PROPHETS_IMG,
  manners: NAV_HOME_IMG,
  arkan: NAV_HOME_IMG,
  wudu: ICON_GEM_IMG,
};

function formatTodayDate(isAr: boolean): string {
  if (isAr) return 'الأحد، ٤ ربيع الأول';
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeScreen() {
  const router = useRouter();

  const {
    language,
    setLanguage,
    hasCompletedOnboarding,
    isHydrated,
    recordDailyActivity,
    profiles,
    activeProfileId,
    stars,
    gems,
    streakCount,
    addStars,
    addGems,
  } = useAppStore();

  const isAr = language === 'ar';
  const [isPlayingHadith, setIsPlayingHadith] = useState(false);
  const [showHadithReward, setShowHadithReward] = useState(false);
  const [parentGateVisible, setParentGateVisible] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);

  // Rotating Hadith of the Day based on day of year
  const [hadithOfTheDay] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    return HADITHS_DATA[dayOfYear % HADITHS_DATA.length] || HADITHS_DATA[0];
  });

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

  const todayDateStr = useMemo(() => formatTodayDate(isAr), [isAr]);

  useEffect(() => {
    if (isHydrated && hasCompletedOnboarding) {
      recordDailyActivity();
    }
  }, [isHydrated, hasCompletedOnboarding, recordDailyActivity]);

  if (isHydrated && !hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
      name: isAr ? 'آدم' : 'Adam',
      avatar: '🧒🏻',
      ageBand: '7-9',
    };

  const ageTone = getLocalizedAgeTone(activeProfile?.ageBand, language);
  const worlds = [
    {
      id: 'quran',
      title: isAr ? 'حديقة القرآن' : 'Quran Garden',
      subtitle: isAr ? 'استمع، ردّد واكتشف' : 'Listen, learn & grow',
      count: isAr ? '١١٤ سورة مباركة' : '114 surahs blooming',
      emoji: '📖',
      gradient: ['#e5f5df', '#daf0e6'] as const,
      route: '/quran',
    },
    {
      id: 'sunnah',
      title: isAr ? 'طريق السنّة' : 'Sunnah Path',
      subtitle: isAr ? 'عادات نبوية وأذكار' : 'Little habits, big love',
      count: isAr ? '١٠٠ حديث نبوي وسُنّة' : '100 authentic hadiths',
      emoji: '🌙',
      gradient: ['#fff1ce', '#ffe6c9'] as const,
      route: '/sunnah',
    },
    {
      id: 'prophets',
      title: isAr ? 'قافلة الأنبياء' : 'Prophets’ Caravan',
      subtitle: isAr ? 'قصص وعِبر ملهمة' : 'Stories full of wonder',
      count: isAr ? '٢٥ قصة نبي' : '25 stories explored',
      emoji: '🕊️',
      gradient: ['#e9e8fb', '#dceafa'] as const,
      route: '/prophets',
    },
    {
      id: 'manners',
      title: isAr ? 'بلدة الأخلاق' : 'Good Manners Town',
      subtitle: isAr ? 'قيم تصنع الفرق' : 'Make the world brighter',
      count: isAr ? '٥٠ مَعلماً وخُلقاً حسناً' : '50 moral landmarks',
      emoji: '🌟',
      gradient: ['#ffe8dc', '#fce3ed'] as const,
      route: '/manners',
    },
    {
      id: 'arkan',
      title: isAr ? 'أكاديمية الأركان' : 'Pillars Academy',
      subtitle: isAr ? 'أركان الإسلام والإيمان الخمسة والستة' : 'Pillars of Islam & Iman',
      count: isAr ? '١١ ركناً مباركاً' : '11 Pillars',
      emoji: '🕌',
      gradient: ['#fef3c7', '#fed7aa'] as const,
      route: '/arkan',
    },
    {
      id: 'wudu',
      title: isAr ? 'تعلَّم كيف تتوضأ وتصلي خطوة بخطوة' : 'Learn How to Pray & Make Wudu',
      subtitle: isAr
        ? 'محاكي الوضوء (٨ خطوات) • محاكي الصلاة (١٠ خطوات) • أركان وسنن الصلاة'
        : 'Wudu Simulator (8 steps) • Prayer Simulator (10 steps) • Pillars & Sunnahs',
      count: isAr ? 'محاكي تفاعلي صوتي' : 'Audio Interactive Simulator',
      emoji: '🌊',
      gradient: ['#e0f2fe', '#bae6fd'] as const,
      route: '/arkan/salah',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* MAIN SCROLLABLE CONTENT (MOBILE FIRST) */}
        <ScrollView
          style={styles.mainCanvas}
          contentContainerStyle={styles.mainCanvasContent}
          showsVerticalScrollIndicator={false}
        >
            {/* Top Bar Header (Mobile First & Fully Responsive) */}
            <View style={styles.headerContainer}>
              {/* Top Utility Row: Date on one side, Language Switch + Parent Gate on other */}
              <View
                style={[
                  styles.headerUtilityRow,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                {/* Date Badge */}
                <View style={styles.datePill}>
                  <Ionicons name="calendar-outline" size={13} color="#059669" />
                  <Text style={styles.dateText}>{todayDateStr}</Text>
                </View>

                {/* Top Actions: Language Switch & Clear Parent Gate */}
                <View
                  style={[
                    styles.headerActionBtns,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  {/* Language Switcher */}
                  <View style={styles.langSwitchPill}>
                    <TouchableOpacity
                      style={[
                        styles.langSegmentBtn,
                        isAr && styles.langSegmentActive,
                      ]}
                      onPress={() => setLanguage('ar')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.langSegmentText,
                          isAr && styles.langSegmentTextActive,
                        ]}
                      >
                        عربي
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.langSegmentBtn,
                        !isAr && styles.langSegmentActive,
                      ]}
                      onPress={() => setLanguage('en')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.langSegmentText,
                          !isAr && styles.langSegmentTextActive,
                        ]}
                      >
                        EN
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Parent Gate Lock Button (Clearly labeled so parents know what it is) */}
                  <TouchableOpacity
                    style={styles.parentGateBtn}
                    onPress={() => setParentGateVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="lock-closed" size={13} color="#047857" />
                    <Text style={styles.parentGateBtnText}>
                      {isAr ? 'منطقة الأهل' : 'Parents'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Child Profile & Greeting Row (Full width - never truncated!) */}
              <TouchableOpacity
                style={[
                  styles.profileGreetingBanner,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
                onPress={() => router.push('/progress')}
                activeOpacity={0.85}
              >
                <View style={styles.avatarWrapper}>
                  <KidAvatar avatar={activeProfile.avatar} size={46} />
                  <View style={styles.avatarBadgeDot} />
                </View>
                <View style={[styles.greetingTextWrap, isAr && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.greetingSub, isAr && { textAlign: 'right' }]}>
                    {isAr ? 'السلام عليكم ورحمة الله 🌿' : 'As-salamu alaykum 🌿'}
                  </Text>
                  <Text style={[styles.greetingMain, isAr && { textAlign: 'right' }]}>
                    {isAr ? 'أهلاً يا ' : 'Welcome, '}
                    <Text style={styles.greetingName}>{activeProfile.name}</Text>
                    {' 🌟'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Row 2: Gamification Stats Bar (Streak, Stars, Gems) */}
              <View
                style={[
                  styles.statsChipsRow,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                {/* Streak Chip */}
                <TouchableOpacity
                  style={styles.statChipItem}
                  onPress={() => router.push('/progress')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="flame" size={17} color="#f97316" />
                  <Text style={styles.statChipText}>
                    {streakCount} {isAr ? 'أيام متتالية' : 'streak'}
                  </Text>
                </TouchableOpacity>

                {/* Stars Chip */}
                <TouchableOpacity
                  style={styles.statChipItem}
                  onPress={() => router.push('/rewards')}
                  activeOpacity={0.8}
                >
                  <Image source={ICON_STAR_IMG} style={styles.statChip3dIcon} resizeMode="contain" />
                  <Text style={styles.statChipText}>
                    {stars} {isAr ? 'نجمة' : 'stars'}
                  </Text>
                </TouchableOpacity>

                {/* Gems Chip */}
                <TouchableOpacity
                  style={styles.statChipItem}
                  onPress={() => router.push('/rewards')}
                  activeOpacity={0.8}
                >
                  <Image source={ICON_GEM_IMG} style={styles.statChip3dIcon} resizeMode="contain" />
                  <Text style={styles.statChipText}>
                    {gems} {isAr ? 'جوهرة' : 'gems'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* QUICK SMART SEARCH BAR (Feature 5) */}
            <TouchableOpacity
              style={[styles.homeSearchBar, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
              onPress={() => setShowSmartSearch(true)}
              activeOpacity={0.85}
            >
              <View style={styles.homeSearchIconWrap}>
                <Ionicons name="search" size={18} color="#059669" />
              </View>
              <Text
                style={[styles.homeSearchPlaceholder, { textAlign: isAr ? 'right' : 'left' }]}
                numberOfLines={1}
              >
                {isAr
                  ? 'ابحث في السور، الأحاديث، الأنبياء، الأدعية، والأخلاق...'
                  : 'Search Surahs, Hadiths, Prophets, Duas & Manners...'}
              </Text>
              <View style={[styles.homeSearchActionBadge, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Ionicons name="sparkles" size={13} color="#D97706" />
                <Text style={styles.homeSearchActionBadgeText}>
                  {isAr ? 'بحث ذكي' : 'Search'}
                </Text>
              </View>
            </TouchableOpacity>



            {/* HERO BANNER: Oasis Night / Follow The Lantern */}
            <View style={styles.heroBannerWrapper}>
              <ImageBackground
                source={HERO_OASIS_IMG}
                style={styles.heroBanner}
                imageStyle={styles.heroBannerImage}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={
                    isAr
                      ? ['rgba(12, 34, 26, 0.92)', 'rgba(18, 50, 38, 0.78)', 'rgba(26, 75, 54, 0.25)']
                      : ['rgba(12, 34, 26, 0.92)', 'rgba(18, 50, 38, 0.78)', 'rgba(26, 75, 54, 0.25)']
                  }
                  start={{ x: isAr ? 1 : 0, y: 0 }}
                  end={{ x: isAr ? 0 : 1, y: 0 }}
                  style={styles.heroGradientOverlay}
                >
                  <View
                    style={[
                      styles.heroContent,
                      { alignItems: isAr ? 'flex-end' : 'flex-start' },
                    ]}
                  >
                    <View style={[styles.heroEyebrowRow, isAr && { flexDirection: 'row-reverse' }]}>
                      <Image source={MASCOT_NOOR_IMG} style={styles.heroMascotMini} />
                      <Text style={styles.heroEyebrow}>
                        {ageTone.badgeTitle}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.heroTitle,
                        isAr && { textAlign: 'right' },
                      ]}
                    >
                      {activeProfile?.ageBand === '4-6'
                        ? (isAr ? 'أهلاً بصديقنا الصغير!\nنستمع للقرآن معاً؟' : 'Welcome little friend!\nLet’s listen together!')
                        : activeProfile?.ageBand === '10-13'
                        ? (isAr ? 'مرحباً بباحث المعرفة!\nتدبّر آيات الحكمة' : 'Welcome seeker of wisdom!\nContemplate divine verses')
                        : (isAr ? 'جاهز لمغامرة\nاليوم يا بطل؟' : 'Ready for a\nlittle adventure?')}
                    </Text>
                    <Text
                      style={[
                        styles.heroSubtitle,
                        isAr && { textAlign: 'right' },
                      ]}
                    >
                      {ageTone.homeMissionDesc}
                    </Text>

                    {/* 3D Tactile CTA Button */}
                    <TouchableOpacity
                      style={styles.heroCtaBtn}
                      onPress={() => router.push('/quran')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.heroCtaText}>
                        {isAr ? 'أكمل رحلتي الآن' : 'Continue my journey'}
                      </Text>
                      <Text style={styles.heroCtaArrow}>{isAr ? '←' : '→'}</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* TODAY'S LITTLE MISSION */}
            <View
              style={[
                styles.sectionRow,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              <Text style={styles.sectionTitle}>
                {isAr ? 'مهمة اليوم اللطيفة' : 'Today’s little mission'}
              </Text>
              <TouchableOpacity onPress={() => router.push('/quran')}>
                <Text style={styles.sectionLink}>
                  {isAr ? 'عرض الكل ←' : 'See all →'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.missionCard}
              onPress={() => router.push('/quran/112')}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.missionInner,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={styles.missionIconBox}>
                  <Image source={MASCOT_NOOR_IMG} style={styles.missionMascotImg} />
                </View>

                <View style={[styles.missionTextBox, isAr && { alignItems: 'flex-end' }]}>
                  <Text style={styles.missionHeading}>
                    {isAr ? 'تعلَّم شيئاً جميلاً' : 'Learn something lovely'}
                  </Text>
                  <Text style={styles.missionDesc}>
                    {isAr
                      ? 'استمع لسورة الإخلاص وتدبّر معناها العظيم'
                      : 'Listen to Al-Ikhlas and discover its meaning'}
                  </Text>
                </View>

                <View style={styles.missionProgressBox}>
                  <View style={styles.missionProgressBar}>
                    <View style={styles.missionProgressFill} />
                  </View>
                  <Text style={styles.missionProgressText}>
                    {isAr ? '٢ من ٣' : '2 of 3'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* HADITH OF THE DAY BANNER (Feature 6) */}
            <View style={styles.hadithOfDayWrapper}>
              <LinearGradient
                colors={['#fffbf0', '#fff3d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hadithOfDayCard}
              >
                <View
                  style={[
                    styles.hodTopRow,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: isAr ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Image
                      source={NAV_SUNNAH_IMG}
                      style={{ width: 24, height: 24, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                    <Text style={styles.hodLabel}>
                      {isAr ? 'حديث اليوم المبارك' : 'Hadith of the Day'}
                    </Text>
                  </View>
                  <View style={styles.hodGradePill}>
                    <Text style={styles.hodGradeText}>
                      {hadithOfTheDay.grade}
                    </Text>
                  </View>
                </View>

                {/* Arabic Text */}
                <Text
                  style={[
                    styles.hodArabicText,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  «{hadithOfTheDay.arabicText}»
                </Text>

                {/* Explanation */}
                <Text
                  style={[
                    styles.hodExplanation,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  {isAr
                    ? hadithOfTheDay.explanationAr
                    : hadithOfTheDay.explanationEn}
                </Text>

                {/* Actions Row */}
                <View
                  style={[
                    styles.hodActionsRow,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.hodAudioBtn,
                      isPlayingHadith && styles.hodAudioBtnPlaying,
                      { flexDirection: isAr ? 'row-reverse' : 'row' },
                    ]}
                    onPress={handlePlayHadithOfTheDay}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isPlayingHadith ? 'pause-circle' : 'volume-high'}
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.hodAudioBtnText}>
                      {isPlayingHadith
                        ? isAr
                          ? 'جارٍ الاستماع... (إيقاف)'
                          : 'Listening... (Pause)'
                        : isAr
                        ? 'استمع للحديث'
                        : 'Listen to Hadith'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.hodPracticeBtn}
                    onPress={() => router.push(`/sunnah/${hadithOfTheDay.id}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hodPracticeBtnText}>
                      {isAr ? 'قصة وعمل اليوم ➔' : 'Story & Action ➔'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.hodCardsLink}
                    onPress={() => router.push('/sunnah/cards')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hodCardsLinkText}>
                      {isAr ? '🎴 البطاقات' : '🎴 Cards'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.hodCardsLink}
                    onPress={() => router.push('/sunnah/tasbih')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hodCardsLinkText}>
                      {isAr ? '📿 المسبحة' : '📿 Tasbih'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>


            {/* PICK A PATH: 5 WORLDS */}
            <View style={styles.worldsHeader}>
              <Text style={[styles.sectionTitle, isAr && { textAlign: 'right' }]}>
                {isAr ? 'اختر مسارك يا بطل!' : 'Pick a path, little explorer!'}
              </Text>
              <Text style={[styles.worldsSubtitle, isAr && { textAlign: 'right' }]}>
                {isAr
                  ? 'ستة عوالم مباركة بانتظار استكشافك!'
                  : 'Six wonderful worlds are waiting for you!'}
              </Text>
            </View>

            <View style={styles.worldsGrid}>
              {worlds.map((world) => (
                <TouchableOpacity
                  key={world.id}
                  style={styles.worldCardTouch}
                  onPress={() => router.push(world.route as any)}
                  activeOpacity={0.88}
                >
                  <View style={styles.worldCard}>
                    {/* World Cover Image with Top Badges */}
                    <View style={styles.worldImageWrap}>
                      <Image
                        source={WORLD_IMAGES[world.id]}
                        style={styles.worldCoverImage}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(12, 28, 22, 0.45)']}
                        style={styles.worldImageGradient}
                      />
                      <View
                        style={[
                          styles.worldEmojiBadge,
                          isAr ? { right: 12 } : { left: 12 },
                        ]}
                      >
                        <Image
                          source={WORLD_BADGE_IMAGES[world.id] || ICON_STAR_IMG}
                          style={styles.worldBadgeImg}
                          resizeMode="cover"
                        />
                      </View>
                    </View>

                    {/* Content Area */}
                    <View style={styles.worldCardBody}>
                      <Text
                        style={[
                          styles.worldTitle,
                          isAr && { textAlign: 'right' },
                        ]}
                      >
                        {world.title}
                      </Text>
                      <Text
                        style={[
                          styles.worldSubtitleText,
                          isAr && { textAlign: 'right' },
                        ]}
                        numberOfLines={1}
                      >
                        {world.subtitle}
                      </Text>

                      {/* Bottom Row */}
                      <View
                        style={[
                          styles.worldBottomRow,
                          { flexDirection: isAr ? 'row-reverse' : 'row' },
                        ]}
                      >
                        <View style={styles.worldCountPill}>
                          <Text style={styles.worldCountText}>{world.count}</Text>
                        </View>
                        <View style={styles.worldExploreBtn}>
                          <Text style={styles.worldExploreArrow}>
                            {isAr ? 'استكشف ←' : 'Explore →'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* TREASURE GARDEN FOOTER */}
            <View
              style={[
                styles.treasureGarden,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.treasureTitle,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  {isAr ? 'حديقة كنوزك وجوائزك' : 'Your treasure garden'}
                </Text>
                <Text
                  style={[
                    styles.treasureSubtitle,
                    isAr && { textAlign: 'right' },
                  ]}
                >
                  {isAr
                    ? 'كل خطوة طيبة تثمر مكافأة جديدة!'
                    : 'Every kind step earns a new treasure'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.stickersRow}
                onPress={() => router.push('/rewards')}
                activeOpacity={0.8}
              >
                <View style={styles.stickerBox}>
                  <Image source={STICKER_KAABA_IMG} style={styles.stickerBoxImg} resizeMode="cover" />
                </View>
                <View style={styles.stickerBox}>
                  <Image source={STICKER_QURAN_IMG} style={styles.stickerBoxImg} resizeMode="cover" />
                </View>
                <View style={styles.stickerBox}>
                  <Image source={STICKER_CRESCENT_IMG} style={styles.stickerBoxImg} resizeMode="cover" />
                </View>
                <View style={styles.stickerBox}>
                  <Image source={STICKER_LANTERN_IMG} style={styles.stickerBoxImg} resizeMode="cover" />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* MOBILE-FIRST BOTTOM NAVIGATION */}
          <AppBottomNav />
        </View>

      {/* Star Celebration for Hadith of the Day */}
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

      {/* Parent Gate Pin Modal */}
      <ParentGateModal
        visible={parentGateVisible}
        onClose={() => setParentGateVisible(false)}
        onSuccess={() => {
          setParentGateVisible(false);
          router.push('/parents');
        }}
      />

      {/* Instant Smart Search Modal (Feature 5) */}
      <SmartSearchModal
        visible={showSmartSearch}
        onDismiss={() => setShowSmartSearch(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffdf8',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fffdf8',
    flexDirection: 'column',
  },

  // MAIN CANVAS
  mainCanvas: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fffdf8',
  },
  mainCanvasContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 72,
    gap: 20,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
  },

  // TOP BAR & HEADER (RESPONSIVE)
  headerContainer: {
    gap: 8,
    marginBottom: 4,
    width: '100%',
  },
  headerUtilityRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  dateText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  profileGreetingBanner: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 4,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 2,
    borderColor: '#fed7aa',
    borderRadius: 26,
    padding: 1,
    backgroundColor: '#ffffff',
  },
  avatarBadgeDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  greetingTextWrap: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  greetingMain: {
    fontSize: 19,
    fontWeight: '900',
    color: '#183c38',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  greetingName: {
    color: '#d97706',
  },
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  langSwitchPill: {
    flexDirection: 'row',
    backgroundColor: '#eef6f0',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: '#d7e8db',
    alignItems: 'center',
  },
  langSegmentBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 13,
  },
  langSegmentActive: {
    backgroundColor: '#267960',
  },
  langSegmentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#267960',
  },
  langSegmentTextActive: {
    color: '#ffffff',
  },
  parentGateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
    paddingHorizontal: 9,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  parentGateBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  statsChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  statChipItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...SHADOWS.soft,
  },
  statChip3dIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  homeSearchBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 10,
    width: '100%',
    ...SHADOWS.soft,
  },
  homeSearchIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeSearchPlaceholder: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  homeSearchActionBadge: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  homeSearchActionBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
  },
  pillIcon: {
    width: 15,
    height: 15,
    borderRadius: 8,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  worldBadgeImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  stickerBoxImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  // HERO BANNER
  heroBannerWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#123024',
    ...SHADOWS.medium,
  },
  heroBanner: {
    minHeight: 220,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    flex: 1,
    padding: 26,
    justifyContent: 'center',
  },
  heroContent: {
    zIndex: 2,
    maxWidth: '65%',
    justifyContent: 'center',
  },
  heroEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroMascotMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffd878',
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#c7e6d2',
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 33,
    marginVertical: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#d6e9dd',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffcf5c',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderBottomWidth: 4,
    borderBottomColor: '#d99835',
    ...SHADOWS.glow('#d99835'),
  },
  heroCtaText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#385540',
  },
  heroCtaArrow: {
    fontSize: 15,
    fontWeight: '900',
    color: '#385540',
  },

  // SECTION ROW
  sectionRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#183c38',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#267960',
  },

  // MISSION CARD
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#f1eee1',
    padding: 16,
    ...SHADOWS.soft,
  },
  missionInner: {
    alignItems: 'center',
    gap: 14,
  },
  missionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff1c9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fce3a6',
    overflow: 'hidden',
  },
  missionMascotImg: {
    width: '100%',
    height: '100%',
  },
  missionFlower: {
    fontSize: 24,
  },
  missionTextBox: {
    flex: 1,
  },
  missionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#183c38',
  },
  missionDesc: {
    fontSize: 11,
    color: '#81948b',
    marginTop: 3,
  },
  missionProgressBox: {
    alignItems: 'flex-end',
    gap: 6,
  },
  missionProgressBar: {
    width: 90,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#edf1e9',
    overflow: 'hidden',
  },
  missionProgressFill: {
    width: '66%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#55a57a',
  },
  missionProgressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#789087',
  },


  // 5 WORLDS
  worldsHeader: {
    marginTop: 8,
  },
  worldsSubtitle: {
    fontSize: 12,
    color: '#82958d',
    marginTop: 3,
  },
  worldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  worldCardTouch: {
    flex: 1,
    minWidth: 230,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#eee9dc',
    borderBottomWidth: 4,
    borderBottomColor: '#e0d8c7',
    ...SHADOWS.soft,
  },
  worldCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  worldImageWrap: {
    width: '100%',
    height: 128,
    position: 'relative',
    backgroundColor: '#e6ede8',
  },
  worldCoverImage: {
    width: '100%',
    height: '100%',
  },
  worldImageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
  },
  worldEmojiBadge: {
    position: 'absolute',
    top: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    ...SHADOWS.soft,
  },
  worldEmojiText: {
    fontSize: 20,
  },
  worldCardBody: {
    padding: 16,
    paddingTop: 14,
  },
  worldTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#183c38',
  },
  worldSubtitleText: {
    fontSize: 12,
    color: '#71877d',
    marginTop: 3,
    marginBottom: 12,
  },
  worldBottomRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  worldCountPill: {
    backgroundColor: '#f1f6f1',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#e2ede3',
  },
  worldCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#346d53',
  },
  worldExploreBtn: {
    backgroundColor: '#fff4dc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fce3b1',
  },
  worldExploreArrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9c6218',
  },

  // TREASURE GARDEN FOOTER
  treasureGarden: {
    marginTop: 10,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0f0e8',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  treasureTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#183c38',
  },
  treasureSubtitle: {
    fontSize: 11,
    color: '#82958d',
    marginTop: 2,
  },
  stickersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stickerBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#fff3d0',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#eaddbd',
  },
  stickerLocked: {
    backgroundColor: '#f1f1eb',
    borderBottomColor: '#dfdfe5',
  },
  stickerEmoji: {
    fontSize: 18,
  },

  // MOBILE BOTTOM TAB BAR
  mobileTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fffdf8',
    borderTopWidth: 1,
    borderTopColor: '#eeeede',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  tabBtn: {
    alignItems: 'center',
    gap: 3,
  },
  tabIcon: {
    fontSize: 20,
    color: '#899b92',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#899b92',
  },
  tabActive: {
    color: '#267960',
  },

  // HADITH OF THE DAY (Feature 6)
  hadithOfDayWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  hadithOfDayCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#fce7b8',
    gap: 12,
  },
  hodTopRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hodLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#92400e',
  },
  hodGradePill: {
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  hodGradeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  hodArabicText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#183c38',
    lineHeight: 36,
  },
  hodExplanation: {
    fontSize: 13,
    color: '#526960',
    lineHeight: 20,
    fontWeight: '600',
  },
  hodActionsRow: {
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  hodAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#267960',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  hodAudioBtnPlaying: {
    backgroundColor: '#059669',
  },
  hodAudioBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  hodPracticeBtn: {
    backgroundColor: '#ffcf5c',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#d99835',
  },
  hodPracticeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#385540',
  },
  hodCardsLink: {
    backgroundColor: '#ffffff',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  hodCardsLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
  },
});
