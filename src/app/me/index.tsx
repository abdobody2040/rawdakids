// Me Hub (أنا) — PRD §7.6 & §10
// My Garden · Weekly Sprout Calendar · Profile & Avatar · Child Settings · Gated Parent Entry
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { isRTL } from '@/constants/i18n';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import KidAvatar, { PRESET_AVATARS } from '@/components/KidAvatar';
import { ASMA_ALLAH_DATA } from '@/data/asmaAllahData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function MeScreen() {
  const router = useRouter();
  const {
    language,
    profiles,
    activeProfileId,
    setSelectedAvatarId,
    getChildProgress,
    unlockedBadges,
  } = useAppStore();

  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  useDocumentTitle(isAr ? 'أنا وحديقتي' : 'Me & My Garden');

  const [showSampleData, setShowSampleData] = useState<boolean>(false);

  // Active child profile
  const realProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;
  const isSample = !realProfile && showSampleData;
  const profile = realProfile || (isSample ? {
    id: 'sample-profile',
    name: isAr ? 'طارق (نموذج تجريبي)' : 'Tariq (Sample Data)',
    ageBand: '7-9' as const,
    avatar: 'av-boy1',
  } : null);

  const rawProgress = realProfile ? getChildProgress(realProfile.id) : null;
  const sampleProgress = {
    stars: 25,
    gems: 10,
    streakCount: 3,
    surahProgress: {},
    hadithProgress: {},
    storyProgress: {},
    scenarioProgress: {},
    dailyHabitsDone: {},
    lastActiveDate: '',
    unlockedStickers: ['⭐ حافظ الفاتحة', '💧 بطل الوضوء'],
    unlockedBadges: [],
    selectedAvatarId: 'av-boy1',
    gratitudeEntries: [],
    lastReadMushafPage: 1,
    mushafBookmarks: [1],
  };
  const progress = realProfile ? rawProgress : (isSample ? sampleProgress : null);

  const isGirl =
    profile?.avatar?.includes('girl') ||
    profile?.avatar?.includes('zahra') ||
    profile?.avatar?.includes('maryam') ||
    profile?.avatar === '👧' ||
    profile?.avatar === '🧕' ||
    profile?.avatar === '🌸';

  // Dynamic fallback name per PRD ONB-2
  const displayName = profile?.name && profile.name.trim().length > 0
    ? profile.name
    : (isGirl ? (isAr ? 'البطلة' : 'Champion Girl') : (isAr ? 'البطل' : 'Champion'));

  // Avatar picker modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Child-safe settings state
  const [soundEffects, setSoundEffects] = useState(true);
  const [calmAudio, setCalmAudio] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  // Growth stage calculation (PRD §10: 5 stages per world)
  const totalStars = progress?.stars || 0;
  const gardenLevel = Math.min(5, Math.floor(totalStars / 10) + 1);
  const gardenTitlesAr = ['بذرة طيبة 🌱', 'برعم أخضر 🌿', 'شجيرة مزهرة 🌸', 'شجرة وارفة 🌳', 'حديقة الجنان الفردوسية 🌺'];
  const gardenTitlesEn = ['Seedling 🌱', 'Green Sprout 🌿', 'Flowering Bush 🌸', 'Flourishing Tree 🌳', 'Paradise Garden 🌺'];

  // Weekly sprout calendar (7 days, green sprout for active, calm for empty)
  const weekDaysAr = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const weekDaysEn = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  // Active on current day and recent days
  const todayIdx = (new Date().getDay() + 1) % 7; // Sat=0, Sun=1 ...

  // Names of Allah Collectible Shelf items (PRD §8 - STO-2)
  const collectedAsmaCards = ASMA_ALLAH_DATA.filter((item) =>
    (unlockedBadges || []).includes(item.id)
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* Header */}
        <Header
          title={isAr ? 'أنا وحديقتي' : 'Me & My Garden'}
          showBack
          fallbackRoute="/"
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          role="main"
        >
          {/* EMPTY PROFILE STATE (when user has no profile and sample data is not active) */}
          {!profile && (
            <View style={styles.emptyProfileCard}>
              <View style={styles.emptyProfileIconBox}>
                <Ionicons name="person-circle-outline" size={54} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyProfileTitle}>
                {isAr ? 'لم تُنشئ ملفاً لطفلك بعد 🌿' : 'No child profile yet 🌿'}
              </Text>
              <Text style={styles.emptyProfileDesc}>
                {isAr
                  ? 'أنشئ ملفاً شخصياً لحفظ إنجازات طفلك ومتابعة حفظه للقرآن ورعاية حديقته الإيمانية بالأوسمة والنجوم.'
                  : 'Create a profile to track memorization, prayer habits, and watch their faith garden flourish.'}
              </Text>

              <TouchableOpacity
                style={styles.emptyProfileCreateBtn}
                onPress={() => router.push('/onboarding' as any)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'إنشاء ملف طفل جديد' : 'Create new child profile'}
              >
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                <Text style={styles.emptyProfileCreateBtnText}>
                  {isAr ? 'إنشاء ملف طفل جديد' : 'Create Child Profile'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emptyProfileSampleBtn}
                onPress={() => setShowSampleData(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={isAr ? 'معاينة نموذج بيانات توضيحية' : 'Preview demonstration sample data'}
              >
                <Text style={styles.emptyProfileSampleBtnText}>
                  {isAr ? 'معاينة بيانات توضيحية (نموذج) 🔍' : 'Preview Sample Demo Data 🔍'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* SAMPLE DATA BANNER */}
          {isSample && (
            <View style={styles.sampleDataBanner}>
              <View style={[styles.sampleDataHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.sampleDataBadge}>
                  <Text style={styles.sampleDataBadgeText}>
                    {isAr ? 'بيانات تجريبية (Sample Data)' : 'Sample Demo Data'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.sampleResetBtn}
                  onPress={() => setShowSampleData(false)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? 'إعادة ضبط وإخفاء النموذج' : 'Reset and hide sample data'}
                >
                  <Ionicons name="close-circle-outline" size={16} color="#B45309" />
                  <Text style={styles.sampleResetBtnText}>
                    {isAr ? 'إعادة ضبط / إخفاء' : 'Reset / Hide'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.sampleDataDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr
                  ? 'هذا نموذج توضيحي لمعاينة كيف تبدو حديقة الطفل بعد التعلم وإنجاز المهام.'
                  : 'Demonstration preview showing how a child’s progress and garden appear.'}
              </Text>
            </View>
          )}

          {/* PROFILE & AVATAR CARD (Only when profile or sample exists) */}
          {profile && (
            <View style={styles.profileCard}>
              <LinearGradient
                colors={['#065F46', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileGradient}
              >
                <View style={[styles.profileRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity
                    style={styles.avatarWrap}
                    onPress={() => setShowAvatarModal(true)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={isAr ? 'تغيير الصورة الرمزية' : 'Change avatar'}
                  >
                    <KidAvatar
                      avatar={profile?.avatar || 'av-boy1'}
                      size={72}
                      borderWidth={2}
                      borderColor="#34D399"
                    />
                    <View style={styles.avatarEditBadge}>
                      <Ionicons name="pencil" size={12} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.profileTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                    <View style={styles.roleChip}>
                      <Text style={styles.roleChipText}>
                        {isAr
                          ? (profile?.ageBand === '4-6' ? 'البذرة (٤–٦ سنوات)' : profile?.ageBand === '10-13' ? 'المستكشف (١٠–١٢ سنة)' : 'الناشئ (٧–٩ سنوات)')
                          : `Age Band: ${profile?.ageBand || '7-9'}`}
                      </Text>
                    </View>
                    <Text style={styles.profileGreeting}>
                      {isAr ? `أهلاً بك يا ${displayName} 🌟` : `Welcome, ${displayName} 🌟`}
                    </Text>
                    <Text style={styles.profileSproutStreak}>
                      {isAr ? `🌱 مسيرة الاستمرار: ${progress?.streakCount || 0} أيام متتالية` : `🌱 Consistent streak: ${progress?.streakCount || 0} days`}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* MY GROWING GARDEN (PRD §7.6.1 & §10) */}
          <View style={styles.gardenCard}>
            <LinearGradient
              colors={['#ECFDF5', '#D1FAE5']}
              style={styles.gardenGradient}
            >
              <View style={[styles.gardenHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.gardenIconBox}>
                  <Ionicons name="leaf" size={24} color="#059669" />
                </View>
                <View style={[styles.gardenHeaderTexts, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.gardenTitle}>
                    {isAr ? 'حديقتي الإيمانية المزهرة 🌿' : 'My Blooming Garden 🌿'}
                  </Text>
                  <Text style={styles.gardenSubtitle}>
                    {isAr
                      ? `المرحلة: ${gardenTitlesAr[gardenLevel - 1]}`
                      : `Stage: ${gardenTitlesEn[gardenLevel - 1]}`}
                  </Text>
                </View>
              </View>

              {/* Garden illustration graphic */}
              <View style={styles.gardenGraphicBox}>
                <Text style={{ fontSize: 64 }}>
                  {gardenLevel === 1 ? '🌱' : gardenLevel === 2 ? '🌿' : gardenLevel === 3 ? '🌸' : gardenLevel === 4 ? '🌳' : '🌺'}
                </Text>
                <Text style={styles.gardenTreeMessage}>
                  {isAr
                    ? 'كل خطوة تعلم جديدة تسقي حديقتك لتنبت زهرة جميلة!'
                    : 'Every completed lesson waters your garden with fresh flowers!'}
                </Text>
              </View>

              {/* Sticker shelf */}
              <View style={styles.stickerShelf}>
                <Text style={[styles.shelfTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? 'رف أوسمة الأخلاق والإنجاز 🏅' : 'Badges & Sticker Shelf 🏅'}
                </Text>
                <View style={[styles.shelfRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  {['⭐ حافظ الفاتحة', '💧 بطل الوضوء', '🕌 نور الصلاة', '🤝 الصدق أمانة'].map((badge, idx) => (
                    <View key={idx} style={styles.stickerBadge}>
                      <Text style={styles.stickerText}>{badge}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* WEEKLY SPROUT CALENDAR (PRD §7.6.2 & §10 - No Loss Shaming) */}
          <View style={styles.calendarCard}>
            <View style={[styles.calendarHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Ionicons name="calendar-outline" size={20} color="#047857" />
              <Text style={styles.calendarTitle}>
                {isAr ? 'تقويم البراعم الأسبوعي 🌱' : 'Weekly Sprout Calendar 🌱'}
              </Text>
            </View>
            <Text style={[styles.calendarSub, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr
                ? 'تنمو بذرتك الخضراء كل يوم تتعلم فيه شيئاً نافعاً:'
                : 'Your green sprout grows every day you learn something beneficial:'}
            </Text>

            <View style={[styles.calendarDaysRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {weekDaysAr.map((dayAr, idx) => {
                const isActiveDay = idx <= todayIdx;
                const isCurrent = idx === todayIdx;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.calendarDayCol,
                      isCurrent && styles.calendarDayColCurrent,
                    ]}
                  >
                    <Text style={styles.calendarDayName}>
                      {isAr ? dayAr : weekDaysEn[idx]}
                    </Text>
                    <View
                      style={[
                        styles.calendarSproutBox,
                        isActiveDay ? styles.calendarSproutActive : styles.calendarSproutEmpty,
                      ]}
                    >
                      <Text style={{ fontSize: 18 }}>
                        {isActiveDay ? '🌱' : '⚪'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* MY PROGRESS DETAILED SHORTCUTS */}
          <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left', marginTop: SPACING.md }]}>
            {isAr ? 'سجل إنجازاتي التفصيلي 📊' : 'Detailed Progress 📊'}
          </Text>

          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={() => router.push('/progress')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#E0F2FE', '#BAE6FD']}
                style={styles.shortcutGradient}
              >
                <Ionicons name="book" size={26} color="#0284C7" />
                <Text style={styles.shortcutTitle}>
                  {isAr ? 'حفظ القرآن' : 'Quran Hifz'}
                </Text>
                <Text style={styles.shortcutSub}>
                  {isAr ? 'متابعة حفظ السور والآيات' : 'Track memorized Surahs'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={() => router.push('/rewards')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.shortcutGradient}
              >
                <Ionicons name="trophy" size={26} color="#D97706" />
                <Text style={styles.shortcutTitle}>
                  {isAr ? 'لوحة الأوسمة' : 'Achievements'}
                </Text>
                <Text style={styles.shortcutSub}>
                  {isAr ? 'كؤوس وأوسمة الإتقان' : 'Unlocked trophies & stars'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* NAMES OF ALLAH COLLECTIBLE SHELF (PRD §8 - STO-2) */}
          <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left', marginTop: SPACING.md }]}>
            {isAr ? 'رف بطاقات أسماء الله الحسنى 🌟' : 'Names of Allah Shelf 🌟'}
          </Text>

          <View style={styles.shelfCard}>
            <View style={[styles.shelfTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.shelfCountBadge, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="sparkles" size={14} color="#D97706" />
                <Text style={styles.shelfCountText}>
                  {isAr
                    ? `${collectedAsmaCards.length} من ٩٩ بطاقة مجموعة`
                    : `${collectedAsmaCards.length} of 99 collected`}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.shelfActionBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                onPress={() => router.push('/asma-allah' as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.shelfActionText}>
                  {isAr ? 'اجمع المزيد' : 'Collect More'}
                </Text>
                <Ionicons name={isRtl ? 'arrow-back' : 'arrow-forward'} size={14} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {collectedAsmaCards.length === 0 ? (
              <View style={styles.emptyShelfBox}>
                <Text style={styles.emptyShelfEmoji}>✨</Text>
                <Text style={styles.emptyShelfTitle}>
                  {isAr ? 'رفك النوراني بانتظارك يا بطل!' : 'Your shelf awaits you, champion!'}
                </Text>
                <Text style={styles.emptyShelfSub}>
                  {isAr
                    ? 'تعلم أسماء الله الحسنى وطبّقها في يومك لتضع بطاقاتها الذهبية اللامعة هنا.'
                    : 'Learn and live by Allah’s 99 beautiful names to place their golden cards here.'}
                </Text>
                <TouchableOpacity
                  style={styles.emptyShelfBtn}
                  onPress={() => router.push('/asma-allah' as any)}
                >
                  <Text style={styles.emptyShelfBtnText}>
                    {isAr ? 'هيا نجمع أول بطاقة 🌟' : 'Collect your first card 🌟'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.shelfCardsScroll, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                {collectedAsmaCards.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.shelfCardItem}
                    onPress={() => router.push('/asma-allah' as any)}
                    activeOpacity={0.88}
                  >
                    <LinearGradient
                      colors={['#4C1D95', '#6D28D9']}
                      style={styles.shelfCardGradient}
                    >
                      <View style={styles.shelfCardTop}>
                        <Text style={styles.shelfCardEmoji}>{c.cardEmoji}</Text>
                        <View style={styles.shelfCardNumberBadge}>
                          <Text style={styles.shelfCardNumberText}>#{c.day}</Text>
                        </View>
                      </View>
                      <Text style={styles.shelfCardName} numberOfLines={1}>
                        {c.name}
                      </Text>
                      <Text style={styles.shelfCardMeaning} numberOfLines={2}>
                        {c.meaning}
                      </Text>
                      <View style={styles.shelfCardStarPill}>
                        <Ionicons name="star" size={11} color="#FDE047" />
                        <Text style={styles.shelfCardStarText}>
                          {isAr ? 'متقن' : 'Learned'}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* CHILD-SAFE SETTINGS (PRD §7.6.4) */}
          <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left', marginTop: SPACING.md }]}>
            {isAr ? 'إعدادات البطل الصغير ⚙️' : 'Child Settings ⚙️'}
          </Text>

          <View style={styles.settingsCard}>
            {/* Setting 1: Sound Effects */}
            <View style={[styles.settingRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.settingLeft, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="volume-medium" size={22} color="#059669" />
                <Text
                  id="label-sound-effects"
                  nativeID="label-sound-effects"
                  style={styles.settingLabel}
                >
                  {isAr ? 'أصوات التفاعل والتشجيع' : 'Sound Effects'}
                </Text>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                thumbColor="#FFFFFF"
                accessibilityRole="switch"
                accessibilityLabel={isAr ? 'أصوات التفاعل والتشجيع' : 'Sound Effects'}
                accessibilityState={{ checked: soundEffects }}
                aria-labelledby="label-sound-effects"
              />
            </View>

            {/* Setting 2: Calm Audio */}
            <View style={[styles.settingRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.settingLeft, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="musical-notes" size={22} color="#0284C7" />
                <Text
                  id="label-calm-audio"
                  nativeID="label-calm-audio"
                  style={styles.settingLabel}
                >
                  {isAr ? 'أناشيد هادئة بدون إيقاع' : 'Calm Nasheeds (Vocal)'}
                </Text>
              </View>
              <Switch
                value={calmAudio}
                onValueChange={setCalmAudio}
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor="#FFFFFF"
                accessibilityRole="switch"
                accessibilityLabel={isAr ? 'أناشيد هادئة بدون إيقاع' : 'Calm Nasheeds (Vocal)'}
                accessibilityState={{ checked: calmAudio }}
                aria-labelledby="label-calm-audio"
              />
            </View>

            {/* Setting 3: Night Bedtime Mode */}
            <View style={[styles.settingRow, { borderBottomWidth: 0, flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.settingLeft, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="moon" size={22} color="#7C3AED" />
                <Text
                  id="label-night-mode"
                  nativeID="label-night-mode"
                  style={styles.settingLabel}
                >
                  {isAr ? 'وضع ما قبل النوم الهادئ' : 'Bedtime Night Mode'}
                </Text>
              </View>
              <Switch
                value={nightMode}
                onValueChange={setNightMode}
                trackColor={{ false: '#CBD5E1', true: '#7C3AED' }}
                thumbColor="#FFFFFF"
                accessibilityRole="switch"
                accessibilityLabel={isAr ? 'وضع ما قبل النوم الهادئ' : 'Bedtime Night Mode'}
                accessibilityState={{ checked: nightMode }}
                aria-labelledby="label-night-mode"
              />
            </View>
          </View>

          {/* GATED PARENT ZONE ENTRY (PRD §7.6.5 & §11) */}
          <TouchableOpacity
            style={styles.parentZoneCard}
            onPress={() => router.push('/parents')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#1E293B', '#0F172A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.parentZoneGradient, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
            >
              <View style={styles.parentLockBox}>
                <Ionicons name="lock-closed" size={24} color="#FDE047" />
              </View>
              <View style={[styles.parentTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                <View style={styles.parentGateBadge}>
                  <Text style={styles.parentGateBadgeText}>
                    {isAr ? 'منطقة محمية برمز PIN' : 'PIN Protected Zone'}
                  </Text>
                </View>
                <Text style={styles.parentTitle}>
                  {isAr ? 'لوحة تحكم ولي الأمر 🛡️' : 'Parent Control Dashboard 🛡️'}
                </Text>
                <Text style={[styles.parentSub, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr
                    ? 'إدارة الوقت، تصفية المحتوى، المذهب الفقهي، والنسخ الاحتياطي'
                    : 'Screen limits, content filters, Madhhab setting and secure backup'}
                </Text>
              </View>
              <Ionicons
                name={isRtl ? 'chevron-back' : 'chevron-forward'}
                size={22}
                color="#94A3B8"
              />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* AVATAR PICKER MODAL */}
        <Modal
          visible={showAvatarModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.modalHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.modalTitle}>
                  {isAr ? 'اختر شخصيتك الرمزية المفضلة 🌟' : 'Choose Your Avatar 🌟'}
                </Text>
                <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                  <Ionicons name="close-circle" size={26} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.avatarGrid}>
                {PRESET_AVATARS.map((item) => {
                  const isSelected = profile?.avatar === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.avatarGridItem,
                        isSelected && styles.avatarGridItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedAvatarId(item.id);
                        setShowAvatarModal(false);
                      }}
                    >
                      <KidAvatar avatar={item.id} size={56} />
                      <Text style={styles.avatarNameText}>
                        {isAr ? item.nameAr : item.nameEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* 5-Tab Navigation */}
        <AppBottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.sand50,
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.sand50,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },

  // Empty Profile Card
  emptyProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.md,
  },
  emptyProfileIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  emptyProfileTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyProfileDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  emptyProfileCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIUS.lg,
    width: '100%',
    ...SHADOWS.glow(COLORS.primary),
  },
  emptyProfileCreateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyProfileSampleBtn: {
    marginTop: 10,
    paddingVertical: 8,
  },
  emptyProfileSampleBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Sample Data Banner
  sampleDataBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
  },
  sampleDataHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sampleDataBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  sampleDataBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sampleResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sampleResetBtnText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
  },
  sampleDataDesc: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },

  // Profile Card
  profileCard: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  profileGradient: {
    padding: SPACING.md,
  },
  profileRow: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#059669',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileTextCol: {
    flex: 1,
  },
  roleChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDE047',
  },
  profileGreeting: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileSproutStreak: {
    fontSize: 12,
    color: '#D1FAE5',
    fontWeight: '600',
  },

  // Garden Card
  gardenCard: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  gardenGradient: {
    padding: SPACING.md,
  },
  gardenHeader: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  gardenIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gardenHeaderTexts: {
    flex: 1,
  },
  gardenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  gardenSubtitle: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '700',
  },
  gardenGraphicBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  gardenTreeMessage: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
  },
  stickerShelf: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  shelfTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  shelfRow: {
    flexWrap: 'wrap',
    gap: 6,
  },
  stickerBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  stickerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },

  // Calendar Card
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  calendarHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  calendarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink900,
  },
  calendarSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: SPACING.sm,
  },
  calendarDaysRow: {
    justifyContent: 'space-between',
    gap: 4,
  },
  calendarDayCol: {
    alignItems: 'center',
    padding: 6,
    borderRadius: RADIUS.md,
  },
  calendarDayColCurrent: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  calendarDayName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  calendarSproutBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarSproutActive: {
    backgroundColor: '#DCFCE7',
  },
  calendarSproutEmpty: {
    backgroundColor: '#F1F5F9',
  },

  // Section Heading
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink900,
    marginBottom: SPACING.xs,
  },

  // Shortcuts
  shortcutsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  shortcutCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  shortcutGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.ink900,
    marginTop: 2,
  },
  shortcutSub: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center',
  },

  // Settings Card
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  settingRow: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  // Parent Zone Entry
  parentZoneCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  parentZoneGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  parentLockBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentTextCol: {
    flex: 1,
  },
  parentGateBadge: {
    backgroundColor: 'rgba(253, 224, 71, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  parentGateBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE047',
  },
  parentTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  parentSub: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '75%',
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink900,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingBottom: SPACING.xl,
  },
  avatarGridItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: RADIUS.lg,
    width: 80,
  },
  avatarGridItemSelected: {
    backgroundColor: '#DCFCE7',
  },
  avatarNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
    textAlign: 'center',
  },

  // Collectible Shelf styles (PRD §8 - STO-2)
  shelfCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  shelfTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  shelfCountBadge: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  shelfCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  shelfActionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  shelfActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  emptyShelfBox: {
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emptyShelfEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  emptyShelfTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 2,
  },
  emptyShelfSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  emptyShelfBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  emptyShelfBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shelfCardsScroll: {
    gap: 10,
    paddingVertical: SPACING.xs,
  },
  shelfCardItem: {
    width: 110,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  shelfCardGradient: {
    padding: 10,
    alignItems: 'center',
  },
  shelfCardTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shelfCardEmoji: {
    fontSize: 18,
  },
  shelfCardNumberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  shelfCardNumberText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shelfCardName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 2,
    textAlign: 'center',
  },
  shelfCardMeaning: {
    fontSize: 9,
    color: '#EDE9FE',
    textAlign: 'center',
    lineHeight: 12,
    height: 24,
    marginBottom: 4,
  },
  shelfCardStarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  shelfCardStarText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FDE047',
  },
});
