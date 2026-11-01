// Home Screen — Rawda Kids (redesign v2)
// Order: Header · Hero Start · Today's 3 Steps · Quick 2x2 · Hadith · Worlds · Prayer strip · Tools
// Rules: min text 14px, min tap target 56px, one digit system, fewer competing entry points.
import { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { HADITHS_DATA } from '@/data/hadithData';
import { audioService } from '@/services/audioService';
import { SHADOWS, RADIUS, SPACING, COLORS } from '@/constants/theme';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import AppBottomNav from '@/components/AppBottomNav';
import KidAvatar from '@/components/KidAvatar';
import ParentGateModal from '@/components/ParentGateModal';
import ChildProfileSwitchModal from '@/components/ChildProfileSwitchModal';
import LanguageSelectModal from '@/components/LanguageSelectModal';
import { AVAILABLE_LANGUAGES, TRANSLATIONS } from '@/constants/i18n';
import { getLocalizedHadith, formatLocalizedTodayDate } from '@/services/multilingualContentService';
import { isBedtimeActive, getPrayerTimesForCity } from '@/services/prayerTimeService';
import { formatStreakDays } from '@/utils/arabicCount';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import SmartSearchModal from '@/components/SmartSearchModal';

const MIN_TAP = 56;

const WORLD_IMAGES: Record<string, any> = {
  quran: require('../../assets/images/quran-garden.jpg'),
  worship: require('../../assets/images/wudu-garden.jpg'),
  stories: require('../../assets/images/prophets-caravan.jpg'),
  akhlaq: require('../../assets/images/sunnah-path.jpg'),
  asmaAllah: require('../../assets/images/asma-allah-world.jpg'),
  wonder: require('../../assets/images/tafakkur-world.jpg'),
};

const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');

// ── Daily steps ───────────────────────────────────────────────────────────
interface DailyStep {
  id: 'listen' | 'learn' | 'practice';
  labelAr: string;
  labelEn: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  route: string;
}

const DAILY_STEPS: DailyStep[] = [
  { id: 'listen', labelAr: 'اِسْتَمِعْ', labelEn: 'Listen', icon: 'headset', color: '#059669', bg: '#D1FAE5', route: '/quran' },
  { id: 'learn', labelAr: 'تَعَلَّمْ', labelEn: 'Learn', icon: 'book', color: '#7C3AED', bg: '#EDE9FE', route: '/prophets' },
  { id: 'practice', labelAr: 'طَبِّقْ', labelEn: 'Practice', icon: 'star', color: '#0284C7', bg: '#E0F2FE', route: '/arkan/salah?mode=wudu' },
];

// ── Quick tiles (icon + ONE word, no sub-pills) ───────────────────────────
interface QuickTile {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  route: string;
  labelAr: string;
  labelEn: string;
}

const QUICK_TILES: QuickTile[] = [
  { id: 'repeat', titleAr: 'استمع وردد', titleEn: 'Repeat', icon: 'headset', color: '#059669', bg: '#D1FAE5', route: '/quran/repeat', labelAr: 'استمع وردد قصار السور', labelEn: 'Listen and repeat short surahs' },
  { id: 'wudu', titleAr: 'الوضوء', titleEn: 'Wudu', icon: 'water', color: '#0284C7', bg: '#E0F2FE', route: '/prayer/wudu', labelAr: 'تعلم الوضوء', labelEn: 'Learn Wudu' },
  { id: 'salah', titleAr: 'الصلاة', titleEn: 'Prayer', icon: 'moon', color: '#D97706', bg: '#FEF3C7', route: '/prayer/salah', labelAr: 'تعلم الصلاة', labelEn: 'Learn prayer' },
  { id: 'discover', titleAr: 'اكتشف', titleEn: 'Discover', icon: 'compass', color: '#7C3AED', bg: '#EDE9FE', route: '/discover', labelAr: 'اكتشف قصصا وأخلاقا', labelEn: 'Discover stories and manners' },
];

// ── Worlds ────────────────────────────────────────────────────────────────
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
  { id: 'quran', titleAr: 'حَدِيقَةُ الْقُرْآنِ', titleEn: 'Quran Garden', subtitleAr: '١١٤ سُورَةً مُبَارَكَةً', subtitleEn: '114 Surahs', route: '/quran', accent: '#059669', bg: '#D1FAE5' },
  { id: 'worship', titleAr: 'الْعِبَادَةُ', titleEn: 'Worship', subtitleAr: 'الْوُضُوءُ وَالصَّلَاةُ وَالْأَذْكَارُ', subtitleEn: 'Wudu, Prayer & Adhkar', route: '/prayer', accent: '#0284C7', bg: '#E0F2FE' },
  { id: 'stories', titleAr: 'الْقِصَصُ', titleEn: 'Stories', subtitleAr: 'الْأَنْبِيَاءُ وَالصَّحَابَةُ وَالسِّيرَةُ', subtitleEn: 'Prophets, Companions, Seerah', route: '/prophets', accent: '#7C3AED', bg: '#EDE9FE' },
  { id: 'akhlaq', titleAr: 'الْأَخْلَاقُ وَالسُّنَّةُ', titleEn: 'Character & Sunnah', subtitleAr: '١٠٠ حَدِيثٍ نَبَوِيٍّ وَأَخْلَاقٍ', subtitleEn: '100 Hadiths & Manners', route: '/manners', accent: '#D97706', bg: '#FEF3C7' },
  { id: 'asmaAllah', titleAr: 'أَسْمَاءُ اللَّهِ', titleEn: 'Names of Allah', subtitleAr: '٩٩ اسْمًا — وَاحِدٌ كُلَّ يَوْمٍ', subtitleEn: '99 Names — one per day', route: '/asma-allah', accent: '#5B21B6', bg: '#EDE9FE' },
  { id: 'wonder', titleAr: 'التَّفَكُّرُ', titleEn: 'Wonder', subtitleAr: 'آيَاتُ اللَّهِ فِي الْكَوْنِ', subtitleEn: 'Signs of Allah in creation', route: '/tafakkur', accent: '#0369A1', bg: '#E0F2FE' },
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
    addStars,
    addGems,
    lastReadMushafPage,
    parentSettings,
    getChildProgress,
    dailyStepsDone,
  } = useAppStore();

  const childProgress = getChildProgress ? getChildProgress(activeProfileId) : null;
  const totalStars = childProgress?.stars ?? 0;
  const streak = childProgress?.streakCount ?? 0;
  const pageNum = childProgress?.lastReadMushafPage ?? lastReadMushafPage;
  const resumePercent = (pageNum && pageNum > 1)
    ? Math.min(100, Math.round((Number(pageNum) / 604) * 100))
    : 0;

  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const rowDir = isAr ? 'row-reverse' : 'row';
  const align = isAr ? 'flex-end' : 'flex-start';
  const txtAlign = isAr ? 'right' : 'left';

  // One digit system everywhere: Eastern Arabic in Arabic, Western otherwise.
  const n = (val: number | string) =>
    isAr ? String(val).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]) : String(val);

  useDocumentTitle(isAr ? 'الرئيسية' : 'Home');

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
  const [isPlayingMascot, setIsPlayingMascot] = useState(false);
  const [hasCelebratedDaily, setHasCelebratedDaily] = useState<boolean>(false);
  const [showDailyCelebrationModal, setShowDailyCelebrationModal] = useState<boolean>(false);

  // Client-only flag + minute ticker: avoids hydration mismatch (React #418)
  // and keeps "next prayer" fresh while the app stays open.
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const id = setInterval(() => setTick((x) => x + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const prayerData = useMemo(
    () =>
      getPrayerTimesForCity(
        parentSettings.prayerCity || 'cairo',
        parentSettings.madhhab || 'shafii',
        isAr
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentSettings.prayerCity, parentSettings.madhhab, isAr, tick]
  );
  const nextPrayer = prayerData.nextSlot;

  // Bismillah banner (first open)
  const [showBismillah, setShowBismillah] = useState(true);
  const [bismillahOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!showBismillah) return;
    Animated.sequence([
      Animated.timing(bismillahOpacity, { toValue: 1, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
      Animated.delay(2800),
      Animated.timing(bismillahOpacity, { toValue: 0, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => setShowBismillah(false));
  }, [bismillahOpacity, showBismillah]);

  // Hadith of the day
  const [hadithOfTheDay, setHadithOfTheDay] = useState(HADITHS_DATA[0]);
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    setTimeout(() => setHadithOfTheDay(HADITHS_DATA[dayOfYear % HADITHS_DATA.length] || HADITHS_DATA[0]), 0);
  }, []);

  const isFriday = mounted && new Date().getDay() === 5;

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

  const todayDateStr = useMemo(() => formatLocalizedTodayDate(language), [language]);

  useEffect(() => {
    if (isHydrated && hasCompletedOnboarding) recordDailyActivity();
  }, [isHydrated, hasCompletedOnboarding, recordDailyActivity]);

    const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const todayStepsList = useMemo(() => (activeProfileId && dailyStepsDone[activeProfileId]?.[todayKey]) || [], [activeProfileId, dailyStepsDone, todayKey]);
  const completedSteps = useMemo(() => new Set(todayStepsList), [todayStepsList]);
  const completedCount = completedSteps.size;

  useEffect(() => {
    if (completedCount === 3 && !hasCelebratedDaily) {
      setTimeout(() => {
        setHasCelebratedDaily(true);
        setShowDailyCelebrationModal(true);
      }, 0);
    }
  }, [completedCount, hasCelebratedDaily]);

  if (isHydrated && !hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
      name: '',
      avatar: '🧒🏻',
      ageBand: '7-9' as const,
    };

  const isValidNickname = (name?: string) => {
    if (!name) return false;
    const clean = name.trim();
    if (clean.length < 2 || clean.length > 15) return false;
    if (/^(dfd|asdf|test|abc|xyz)$/i.test(clean)) return false;
    return /^[\p{L}\s]+$/u.test(clean);
  };

  const avatarStr = activeProfile?.avatar || '';
  const isGirl = Boolean(
    activeProfile?.gender === 'female' ||
    avatarStr.includes('girl') ||
    avatarStr.includes('female') ||
    avatarStr.includes('zahra') ||
    avatarStr.includes('maryam') ||
    avatarStr === '👧' ||
    avatarStr === '🧕' ||
    avatarStr === '🌸'
  );
  const isBoy = Boolean(
    activeProfile?.gender === 'male' ||
    avatarStr.includes('boy') ||
    avatarStr.includes('hafiz') ||
    avatarStr.includes('explorer') ||
    avatarStr === '👦' ||
    avatarStr === '🧒' ||
    avatarStr === '📖' ||
    avatarStr === '🧭'
  );
  const displayName = isValidNickname(activeProfile?.name)
    ? activeProfile.name
    : isAr
      ? isGirl ? 'يَا بَطَلَةُ 🌸' : isBoy ? 'يَا بَطَلُ 🌿' : 'يَا بَطَلَنَا ✨'
      : 'Friend';

  const ageBand = activeProfile?.ageBand || '7-9';
  const isYoung = ageBand === '4-6';

  const handlePlayMascotGreeting = async () => {
    if (isPlayingMascot) {
      await audioService.stopDua();
      setIsPlayingMascot(false);
      return;
    }
    setIsPlayingMascot(true);
    const speech = isAr
      ? isGirl
        ? 'هَيَّا نَتَعَلَّمْ مَعًا! أَهْلًا يَا صَدِيقَتِي الصَّغِيرَةَ، اضْغَطِي عَلَى الزِّرِّ الْكَبِيرِ لِنَبْدَأَ'
        : isBoy
        ? 'هَيَّا نَتَعَلَّمْ مَعًا! أَهْلًا يَا صَدِيقِي الصَّغِيرَ، اضْغَطْ عَلَى الزِّرِّ الْكَبِيرِ لِنَبْدَأَ'
        : 'هَيَّا نَتَعَلَّمْ مَعًا! أَهْلًا بِكَ، اضْغَطْ عَلَى الزِّرِّ الْكَبِيرِ لِنَبْدَأَ'
      : 'Welcome little friend! Tap the big button to start together';
    await audioService.playDua(speech, (status) => {
      if (status.didJustFinish || !status.isPlaying) setIsPlayingMascot(false);
    });
  };

  const canSeeAgedContent = ageBand === '10-13';
  const visibleWorlds = SIX_WORLDS.map((w) => {
    if (w.id === 'quran') {
      return {
        ...w,
        subtitleAr: canSeeAgedContent ? '١١٤ سُورَةً مُبَارَكَةً' : 'سُوَرُ جُزْءِ عَمَّ (٣٨ سُورَةً)',
        subtitleEn: canSeeAgedContent ? '114 Surahs' : 'Juz Amma (38 Surahs)',
      };
    }
    return w;
  }).filter((w) => !w.ageGate || canSeeAgedContent);
  
  const handleStepTap = (step: DailyStep) => {
    router.push(step.route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <ScrollView
          style={styles.mainCanvas}
          contentContainerStyle={styles.mainCanvasContent}
          showsVerticalScrollIndicator={false}
          role="main"
        >
          {/* ── 1. HEADER: avatar · greeting · streak · parent lock ─────── */}
          <View style={[styles.headerRow, { flexDirection: rowDir }]} role="banner">
            <TouchableOpacity
              style={[styles.headerLeft, { flexDirection: rowDir }]}
              onPress={() => router.push('/progress')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'ملف الطفل والتقدم' : 'Profile & Progress'}
            >
              <View style={styles.avatarWrapper}>
                <KidAvatar avatar={activeProfile.avatar} size={52} />
              </View>
              <View style={{ flex: 1, alignItems: align }}>
                <Text style={[styles.greetingSub, { textAlign: txtAlign }]}>
                  {isAr ? 'السَّلَامُ عَلَيْكُمْ' : 'As-salamu alaykum 🌿'}
                </Text>
                <Text style={[styles.greetingMain, { textAlign: txtAlign }]} role="heading" aria-level={1} numberOfLines={1}>
                  {isAr ? `أَهْلًا ${displayName}` : `Welcome, ${displayName}`}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.streakChip}
              onPress={() => router.push('/progress')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isAr ? `مسيرة الاستمرار: ${formatStreakDays(streak, true)}` : `Streak: ${formatStreakDays(streak, false)}`}
            >
              <Ionicons name="leaf" size={18} color="#0F6E56" />
              <Text style={styles.streakCount}>{n(streak)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.parentLock}
              onPress={() => setParentGateVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isAr ? 'منطقة أولياء الأمور' : 'Parents Area'}
            >
              <Ionicons name="lock-closed" size={20} color="#5F5E5A" />
              <Text style={styles.parentLockLabel}>{isAr ? 'الأهل' : 'Parents'}</Text>
            </TouchableOpacity>
          </View>

          {showBismillah && (
            <Animated.View style={[styles.bismillahBanner, { opacity: bismillahOpacity }]}>
              <Text style={styles.bismillahText}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
            </Animated.View>
          )}

          {/* Bedtime banner */}
          {isBedtimeNow && (
            <View style={styles.bannerWrap}>
              <LinearGradient
                colors={['#1E1B4B', '#312E81']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.bannerInner, { flexDirection: rowDir }]}
              >
                <Ionicons name="moon" size={32} color="#FDE047" />
                <View style={{ flex: 1, alignItems: align }}>
                  <Text style={[styles.bannerTitle, { color: '#FDE047', textAlign: txtAlign }]}>
                    {isAr ? 'وقت النوم الهادئ 🌙' : 'Peaceful Bedtime 🌙'}
                  </Text>
                  <Text style={[styles.bannerSub, { color: '#E0E7FF', textAlign: txtAlign }]}>
                    {isAr ? 'هيا نستمع لأذكار النوم المباركة.' : 'Time for restful sleep and bedtime adhkar.'}
                  </Text>
                  <View style={[styles.bannerBtnRow, { flexDirection: rowDir }]}>
                    <TouchableOpacity style={styles.bedtimeDuaBtn} onPress={() => router.push('/dua' as any)} activeOpacity={0.85}>
                      <Text style={styles.bannerBtnText}>{isAr ? 'أذكار النوم 🤲' : 'Bedtime Dua'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bedtimeParentBtn} onPress={() => setParentGateVisible(true)} activeOpacity={0.85}>
                      <Text style={[styles.bannerBtnText, { color: '#C7D2FE' }]}>{isAr ? 'للأهل 🔑' : 'Parent Unlock'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Friday banner */}
          {isFriday && (
            <View style={styles.bannerWrap}>
              <LinearGradient
                colors={['#047857', '#065F46']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.bannerInner, { flexDirection: rowDir }]}
              >
                <View style={{ flex: 1, alignItems: align }}>
                  <Text style={[styles.bannerTitle, { color: '#FFFFFF', textAlign: txtAlign }]}>
                    {isAr ? 'يوم الجمعة المبارك ✨' : 'Blessed Friday ✨'}
                  </Text>
                  <Text style={[styles.bannerSub, { color: '#D1FAE5', textAlign: txtAlign }]}>
                    {isAr ? 'صلّوا على النبي ﷺ واقرأوا سورة الكهف' : 'Send blessings on the Prophet ﷺ and read Al-Kahf'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.fridayBtn} onPress={() => router.push('/quran/18' as any)} activeOpacity={0.85}>
                  <Text style={styles.fridayBtnText}>{isAr ? 'الكهف 📖' : 'Al-Kahf 📖'}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* ── 2. HERO: mascot + progress + ONE big Start button ────────── */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#0F9D6B', '#0B7A53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroInner}
            >
              <View style={[styles.heroTopRow, { flexDirection: rowDir }]}>
                <TouchableOpacity
                  style={styles.mascotWrap}
                  onPress={handlePlayMascotGreeting}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? 'استمع إلى نور' : 'Listen to Noor'}
                >
                  <Image source={MASCOT_NOOR_IMG} style={styles.mascotImg} resizeMode="cover" />
                  <View style={styles.mascotBadge}>
                    <Ionicons name={isPlayingMascot ? 'stop' : 'volume-high'} size={16} color="#0F9D6B" />
                  </View>
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: align }}>
                  <Text style={[styles.heroTitle, { textAlign: txtAlign }]}>
                    {isAr
                      ? isGirl
                        ? 'كَمِّلِي مِنْ حَيْثُ تَوَقَّفْتِ 🌸'
                        : isBoy
                        ? 'كَمِّلْ مِنْ حَيْثُ تَوَقَّفْتَ 🌿'
                        : 'مُتَابَعَةُ التَّعَلُّمِ ✨'
                      : 'Continue where you stopped'}
                  </Text>
                  <Text style={[styles.heroSubtitle, { textAlign: txtAlign }]}>
                    {isAr
                      ? lastReadMushafPage ? `المصحف الشريف، صفحة ${n(lastReadMushafPage)}` : 'سورة الفاتحة، الآية ٢'
                      : lastReadMushafPage ? `Holy Mushaf, page ${lastReadMushafPage}` : 'Surah Al-Fatihah, Ayah 2'}
                  </Text>
                </View>
              </View>

              <View style={styles.heroBarTrack}>
                <View style={[styles.heroBarFill, { width: `${resumePercent}%` }]} />
              </View>

              <View style={[styles.heroBottomRow, { flexDirection: rowDir }]}>
                <Text style={styles.heroMeta}>
                  {isAr ? `${n(resumePercent)}٪ مكتمل` : `${resumePercent}% complete`}
                </Text>
                <View style={[styles.heroStars, { flexDirection: rowDir }]}>
                  <Ionicons name="star" size={16} color="#F5B83D" />
                  <Text style={styles.heroMeta}>{isAr ? `${n(totalStars)} نجوم` : `${totalStars} stars`}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.startBtn, { flexDirection: rowDir }]}
                onPress={() => router.push(lastReadMushafPage ? ('/quran/mushaf' as any) : '/quran')}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'ابدأ' : 'Start'}
              >
                <Ionicons
                  name="play"
                  size={22}
                  color="#0B7A53"
                  style={{ transform: [{ scaleX: isAr ? -1 : 1 }] }}
                />
                <Text style={styles.startBtnText}>{isAr ? 'هَيَّا نَبْدَأُ' : "Let's start"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* ── 3. TODAY'S 3 STEPS ──────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={[styles.stepsHeader, { flexDirection: rowDir }]}>
              <View style={[styles.stepsRing, { borderColor: completedCount === 3 ? '#16A34A' : '#E8D9BF', flexDirection: rowDir }]}>
                <Text style={styles.stepsRingCount}>{n(completedCount)}</Text>
                <Text style={styles.stepsRingTotal}>{isAr ? '/٣' : '/3'}</Text>
              </View>
              <View style={{ flex: 1, alignItems: align }}>
                <Text style={[styles.sectionTitle, { textAlign: txtAlign }]}>
                  {isAr ? 'خُطُوَاتُ الْيَوْمِ الثَّلَاثُ' : "Today's 3 steps"}
                </Text>
                <Text style={[styles.sectionSub, { textAlign: txtAlign }]}>
                  {completedCount === 3
                    ? isAr ? 'ما شاء الله! أكملت خطوات اليوم 🌱' : 'MashaAllah! Day complete 🌱'
                    : isAr ? `${n(completedCount)} مِنْ ٣ خُطُوَاتٍ` : `${completedCount} of 3 steps`}
                </Text>
              </View>
            </View>

            <View style={[styles.stepsTiles, { flexDirection: rowDir }]}>
              {DAILY_STEPS.map((step, i) => {
                const done = completedSteps.has(step.id);
                return (
                  <TouchableOpacity
                    key={step.id}
                    style={[
                      styles.stepTile,
                      { backgroundColor: done ? step.bg : '#FFFFFF', borderColor: done ? step.color + '66' : '#E8D9BF' },
                    ]}
                    onPress={() => handleStepTap(step)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={isAr ? step.labelAr : step.labelEn}
                  >
                    <Text style={[styles.stepNumber, { color: step.color }]}>{n(i + 1)}</Text>
                    <View style={[styles.stepIcon, { backgroundColor: step.bg }]}>
                      <Ionicons name={done ? 'checkmark-circle' : step.icon} size={32} color={done ? '#16A34A' : step.color} />
                    </View>
                    <Text style={[styles.stepLabel, { color: done ? '#16A34A' : COLORS.ink900 }]}>
                      {isAr ? step.labelAr : step.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── 4. QUICK 2x2: icon + one word ───────────────────────────── */}
          <View style={styles.quickGrid}>
            {QUICK_TILES.map((tile) => (
              <TouchableOpacity
                key={tile.id}
                style={[styles.quickTile, { backgroundColor: tile.bg, borderColor: tile.color + '40' }]}
                onPress={() => router.push(tile.route as any)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={isAr ? tile.labelAr : tile.labelEn}
              >
                <View style={[styles.quickIcon, { backgroundColor: tile.color }]}>
                  <Ionicons name={tile.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={[styles.quickTitle, { color: tile.color }]}>{isAr ? tile.titleAr : tile.titleEn}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── 5. HADITH OF THE DAY ────────────────────────────────────── */}
          <View style={styles.hadithCard}>
            <LinearGradient colors={['#FFFBF0', '#FFF3D4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hadithInner}>
              <View style={[styles.hadithHeader, { flexDirection: rowDir }]}>
                <View style={styles.hadithLabelPill}>
                  <Text style={styles.hadithLabel}>{isAr ? 'حَدِيثُ الْيَوْمِ' : 'Hadith of the Day'}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.hadithPlayBtn, isPlayingHadith && styles.hadithPlayBtnActive]}
                  onPress={handlePlayHadithOfTheDay}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? 'استمع للحديث' : 'Listen to hadith'}
                >
                  <Ionicons name={isPlayingHadith ? 'stop' : 'volume-high'} size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.hadithArabic, { textAlign: txtAlign }]}>«{hadithOfTheDay.arabicText}»</Text>

              <Text style={[styles.hadithExplanation, { textAlign: txtAlign }]} numberOfLines={2}>
                {getLocalizedHadith(hadithOfTheDay, language).explanation}
              </Text>

              <TouchableOpacity
                style={[styles.hadithMoreBtn, { flexDirection: rowDir }]}
                onPress={() => router.push(`/sunnah/${hadithOfTheDay.id}`)}
                activeOpacity={0.8}
              >
                <Text style={styles.hadithMoreText}>{isAr ? 'قِصَّةُ وَعَمَلُ الْيَوْمِ' : 'Story & Action'}</Text>
                <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color="#92400E" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* ── 6. OUR WORLDS ───────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textAlign: txtAlign }]}>{isAr ? 'عَوَالِمُنَا' : 'Our Worlds'}</Text>
            <View style={styles.worldsGrid}>
              {visibleWorlds.map((world) => (
                <TouchableOpacity
                  key={world.id}
                  style={[styles.worldCard, { borderColor: world.accent + '55' }]}
                  onPress={() => router.push(world.route as any)}
                  activeOpacity={0.88}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? world.titleAr : world.titleEn}
                >
                  <View style={styles.worldImageWrap}>
                    <Image source={WORLD_IMAGES[world.id]} style={styles.worldImg} resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(6,14,10,0.55)']} style={styles.worldImgGradient} />
                  </View>
                  <View style={styles.worldBody}>
                    <Text style={[styles.worldTitle, { textAlign: txtAlign }]} numberOfLines={2}>
                      {isAr ? world.titleAr : world.titleEn}
                    </Text>
                    <Text style={[styles.worldSubtitle, { textAlign: txtAlign }]} numberOfLines={2}>
                      {isAr ? world.subtitleAr : world.subtitleEn}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── 7. PRAYER STRIP ─────────────────────────────────────────── */}
          {mounted && !isPrayerStripDismissed && (
            <View style={styles.prayerStrip}>
              <LinearGradient
                colors={['#0284C7', '#0369A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.prayerInner, { flexDirection: rowDir }]}
              >
                <TouchableOpacity
                  style={{ flex: 1, alignItems: align }}
                  onPress={() => router.push('/prayer' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.prayerTitle, { textAlign: txtAlign }]}>
                    {isAr
                      ? `حان وقت صلاة ${nextPrayer.nameAr} (${nextPrayer.timeStringAr})`
                      : `Time for ${nextPrayer.nameEn} (${nextPrayer.timeStringEn})`}
                  </Text>
                  <Text style={[styles.prayerSub, { textAlign: txtAlign }]}>
                    {isAr ? 'هيا نتوضأ معاً! 💧' : "Let's do Wudu! 💧"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.prayerBtn} onPress={() => router.push('/arkan/salah?mode=wudu')} activeOpacity={0.85}>
                  <Text style={styles.prayerBtnText}>{isAr ? 'الوضوء 💧' : 'Wudu 💧'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.prayerDismiss}
                  onPress={() => setIsPrayerStripDismissed(true)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? 'إغلاق' : 'Dismiss'}
                >
                  <Ionicons name="close" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* ── TOOLS: moved out of the header (search · language · profile · date) ── */}
          {!isYoung && (
            <View style={styles.toolsSection}>
              <View style={[styles.toolsRow, { flexDirection: rowDir }]}>
                <TouchableOpacity style={styles.toolBtn} onPress={() => setShowSmartSearch(true)} activeOpacity={0.8} accessibilityRole="button">
                  <Ionicons name="search" size={22} color="#064E3B" />
                  <Text style={styles.toolLabel}>{isAr ? 'بحث' : 'Search'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolBtn} onPress={() => setShowProfileSwitcher(true)} activeOpacity={0.8} accessibilityRole="button">
                  <Ionicons name="people" size={22} color="#064E3B" />
                  <Text style={styles.toolLabel}>{t.switchProfile}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolBtn} onPress={() => setShowLanguageModal(true)} activeOpacity={0.8} accessibilityRole="button">
                  <Text style={styles.flagText}>{AVAILABLE_LANGUAGES.find((l) => l.code === language)?.flagEmoji || '🇸🇦'}</Text>
                  <Text style={styles.toolLabel}>{isAr ? 'اللغة' : 'Language'}</Text>
                </TouchableOpacity>
              </View>
              {mounted ? <Text style={styles.dateText}>{todayDateStr}</Text> : null}
            </View>
          )}
        </ScrollView>

        <AppBottomNav />
      </View>

      {/* ── Overlays & Modals ─────────────────────────────────────────── */}
      <StarRewardCelebration
        visible={showHadithReward}
        starsEarned={1}
        gemsEarned={2}
        title={isAr ? 'أحسنت يا بطل!' : 'MashaAllah!'}
        subtitle={isAr ? 'استمعت لكلام النبي ﷺ المبارك ونلت أجراً ونوراً!' : 'You listened to the blessed words of the Prophet ﷺ!'}
        onDismiss={() => setShowHadithReward(false)}
      />

      <StarRewardCelebration
        visible={showDailyCelebrationModal}
        starsEarned={10}
        gemsEarned={3}
        title={isAr ? 'مُبَارَكٌ! أَتْمَمْتَ خُطُوَاتِ الْيَوْمِ الثَّلَاثَ 🎉' : 'MashaAllah! All 3 daily steps completed! 🎉'}
        subtitle={isAr ? 'أحسنت يا بطل! أتممت الاستماع والتعلم والتطبيق ونلت الأجر والنجوم!' : 'You completed listening, learning, and practice!'}
        onDismiss={() => setShowDailyCelebrationModal(false)}
      />

      <ParentGateModal
        visible={parentGateVisible}
        onClose={() => setParentGateVisible(false)}
        onSuccess={() => {
          setParentGateVisible(false);
          router.push('/parents');
        }}
      />

      {showSmartSearch && (
        <SmartSearchModal visible={showSmartSearch} onDismiss={() => setShowSmartSearch(false)} />
      )}

      <ChildProfileSwitchModal visible={showProfileSwitcher} onClose={() => setShowProfileSwitcher(false)} />
      <LanguageSelectModal visible={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.sand50, width: '100%', height: '100%' },
  appContainer: { flex: 1, width: '100%', backgroundColor: COLORS.sand50, flexDirection: 'column' },
  mainCanvas: { flex: 1, width: '100%', backgroundColor: COLORS.sand50 },
  mainCanvasContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 20,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
  },
  section: { gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.brandEmerald },
  sectionSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2, fontWeight: '600' },

  // Header
  headerRow: { alignItems: 'center', gap: 8 },
  headerLeft: { flex: 1, alignItems: 'center', gap: 10 },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: COLORS.gold400 + '88',
    borderRadius: 30,
    padding: 1,
    backgroundColor: '#FFFFFF',
  },
  greetingSub: { fontSize: 14, color: COLORS.gardenGreen, fontWeight: '700' },
  greetingMain: { fontSize: 22, fontWeight: '900', color: COLORS.brandEmerald, marginTop: 1 },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: MIN_TAP,
    minHeight: MIN_TAP,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#E1F5EE',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  streakCount: { fontSize: 20, fontWeight: '900', color: '#0F6E56' },
  parentLock: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: MIN_TAP,
    minHeight: MIN_TAP,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#F5F4EE',
    borderWidth: 1.5,
    borderColor: '#E8D9BF',
  },
  parentLockLabel: { fontSize: 14, fontWeight: '700', color: '#5F5E5A', marginTop: 1 },

  // Bismillah
  bismillahBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandEmerald,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...SHADOWS.medium,
  },
  bismillahText: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', lineHeight: 38 },

  // Banners (bedtime / friday)
  bannerWrap: { borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.soft },
  bannerInner: { padding: 16, alignItems: 'center', gap: 12 },
  bannerTitle: { fontSize: 17, fontWeight: '800', marginBottom: 2 },
  bannerSub: { fontSize: 14, lineHeight: 20 },
  bannerBtnRow: { alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  bannerBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  bedtimeDuaBtn: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: '#4338CA',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  bedtimeParentBtn: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  fridayBtn: {
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
  },
  fridayBtnText: { fontSize: 14, fontWeight: '800', color: '#065F46' },

  // Hero
  heroCard: { borderRadius: 24, overflow: 'hidden', ...SHADOWS.medium },
  heroInner: { padding: 18, gap: 14 },
  heroTopRow: { alignItems: 'center', gap: 14 },
  mascotWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  mascotImg: { width: '100%', height: '100%', borderRadius: 36 },
  mascotBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.92)', marginTop: 3, fontWeight: '600' },
  heroBarTrack: { height: 12, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 6, overflow: 'hidden' },
  heroBarFill: { height: 12, backgroundColor: '#FFFFFF', borderRadius: 6 },
  heroBottomRow: { justifyContent: 'space-between', alignItems: 'center' },
  heroStars: { alignItems: 'center', gap: 5 },
  heroMeta: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  startBtn: {
    minHeight: 60,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...SHADOWS.soft,
  },
  startBtnText: { fontSize: 20, fontWeight: '900', color: '#0B7A53' },

  // Steps
  stepsHeader: { alignItems: 'center', gap: 12 },
  stepsRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepsRingCount: { fontSize: 20, fontWeight: '900', color: COLORS.brandEmerald },
  stepsRingTotal: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted, marginTop: 3 },
  stepsTiles: { gap: 10 },
  stepTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    gap: 8,
    minHeight: 132,
    ...SHADOWS.soft,
  },
  stepNumber: { fontSize: 17, fontWeight: '900' },
  stepIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { fontSize: 17, fontWeight: '900', textAlign: 'center' },

  // Quick grid
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickTile: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 124,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  quickIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  quickTitle: { fontSize: 19, fontWeight: '900', textAlign: 'center' },

  // Hadith
  hadithCard: { borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1.5, borderColor: '#FCE7B8', ...SHADOWS.soft },
  hadithInner: { padding: 18, gap: 12 },
  hadithHeader: { justifyContent: 'space-between', alignItems: 'center' },
  hadithLabelPill: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  hadithLabel: { fontSize: 16, fontWeight: '900', color: '#166534' },
  hadithPlayBtn: {
    width: MIN_TAP,
    height: MIN_TAP,
    borderRadius: MIN_TAP / 2,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  hadithPlayBtnActive: { backgroundColor: '#DC2626' },
  hadithArabic: { fontSize: 22, fontWeight: '900', color: COLORS.brandEmerald, lineHeight: 40 },
  hadithExplanation: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22, fontWeight: '600' },
  hadithMoreBtn: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    backgroundColor: '#FFF3D4',
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7B8',
  },
  hadithMoreText: { fontSize: 15, fontWeight: '800', color: '#92400E' },

  // Worlds
  worldsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  worldCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 2,
    ...SHADOWS.soft,
  },
  worldImageWrap: { width: '100%', height: 130, backgroundColor: '#E6EDE8' },
  worldImg: { width: '100%', height: '100%' },
  worldImgGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 50 },
  worldBody: { padding: 14, gap: 4 },
  worldTitle: { fontSize: 18, fontWeight: '900', color: COLORS.brandEmerald, lineHeight: 26 },
  worldSubtitle: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600', lineHeight: 20 },

  // Prayer strip
  prayerStrip: { borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1.5, borderColor: '#BAE6FD', ...SHADOWS.soft },
  prayerInner: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  prayerTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  prayerSub: { fontSize: 14, color: '#E0F2FE', fontWeight: '600', marginTop: 2 },
  prayerBtn: {
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
  },
  prayerBtnText: { fontSize: 15, fontWeight: '900', color: '#0284C7' },
  prayerDismiss: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  // Tools (secondary)
  toolsSection: { gap: 10, alignItems: 'center' },
  toolsRow: { gap: 10, width: '100%' },
  toolBtn: {
    flex: 1,
    minHeight: MIN_TAP,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
  },
  toolLabel: { fontSize: 14, fontWeight: '700', color: '#064E3B' },
  flagText: { fontSize: 22 },
  dateText: { fontSize: 14, color: '#047857', fontWeight: '700' },
});
