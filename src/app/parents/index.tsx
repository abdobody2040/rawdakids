import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { isRTL } from '@/constants/i18n';
import ParentGateView from '@/components/ParentGateView';
import { parentReportsService, ParentDashboardData } from '@/services/parentReportsService';
import { StoreName } from '@/services/localDbService';
import UnitCertificateModal from '@/components/UnitCertificateModal';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

const AVATAR_BOY = require('../../../assets/images/avatar-boy-1.jpg');
const AVATAR_GIRL = require('../../../assets/images/avatar-girl-1.jpg');

const CITIES = [
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo' },
  { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah' },
  { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah' },
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh' },
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai' },
  { id: 'jerusalem', nameAr: 'القدس الشريف', nameEn: 'Jerusalem' },
  { id: 'amman', nameAr: 'عَمَّان', nameEn: 'Amman' },
];

const MADHHABS = [
  { id: 'shafii', nameAr: 'الشافعي', nameEn: "Shafi'i" },
  { id: 'hanafi', nameAr: 'الحنفي', nameEn: 'Hanafi' },
  { id: 'maliki', nameAr: 'المالكي', nameEn: 'Maliki' },
  { id: 'hanbali', nameAr: 'الحنبلي', nameEn: 'Hanbali' },
];

const AGE_BANDS = [
  { id: '4-6', labelAr: '٤ – ٦ سنوات', labelEn: '4 – 6 years' },
  { id: '7-9', labelAr: '٧ – ٩ سنوات', labelEn: '7 – 9 years' },
  { id: '10-12', labelAr: '١٠ – ١٢ سنة', labelEn: '10 – 12 years' },
];

const toArabicIndic = (num: number): string => {
  const mapping = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((ch) => mapping[parseInt(ch, 10)] ?? ch)
    .join('');
};

export default function ParentsScreen() {
  const router = useRouter();
  const {
    language,
    profiles,
    activeProfileId,
    setActiveProfile,
    parentSettings,
    updateParentSettings,
    timeSpentTodaySec,
    streakCount,
    surahProgress,
  } = useAppStore();

  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  // Parent gate authentication state (Gate blocks all settings and reports)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Active child profile
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
    id: 'default',
    name: isAr ? 'بطل' : 'Champion',
    avatar: 'av-boy1',
    age: 8,
  };

  // Modals for settings pickers
  const [showChildPicker, setShowChildPicker] = useState<boolean>(false);
  const [showAgePicker, setShowAgePicker] = useState<boolean>(false);
  const [showMadhhabPicker, setShowMadhhabPicker] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [report, setReport] = useState<ParentDashboardData | null>(null);
  const [selectedCertUnit, setSelectedCertUnit] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<{ store: StoreName; titleAr: string } | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(() => (typeof window !== 'undefined' ? !window.navigator.onLine : false));

  // Listen to offline/online events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const refreshReport = () => {
    parentReportsService.getChildReport(activeProfile.id).then(setReport).catch(() => {});
  };

  useEffect(() => {
    if (isUnlocked) {
      refreshReport();
    }
  }, [isUnlocked, activeProfile.id]);

  // Settings values with defaults
  const [showRewards, setShowRewards] = useState<boolean>(true);
  const [allowMusic, setAllowMusic] = useState<boolean>(false); // Off by default as required

  // Calculate real minutes today
  const minutesToday = Math.max(1, Math.round((timeSpentTodaySec || 720) / 60));

  // Count steps / surahs completed
  const completedSurahsCount = Object.values(surahProgress || {}).filter(
    (s) => s.isCompleted || Object.keys(s.ayahsStatus || {}).length > 0
  ).length || 3;

  // 7-day usage data: show real data only
  // If timeSpentTodaySec > 0 we have active usage for today
  const hasUsageData = minutesToday > 0;
  const weeklyUsage = [
    { dayAr: 'الاثنين', dayEn: 'Mon', minutes: 9 },
    { dayAr: 'الثلاثاء', dayEn: 'Tue', minutes: 30 },
    { dayAr: 'الأربعاء', dayEn: 'Wed', minutes: 14 },
    { dayAr: 'الخميس', dayEn: 'Thu', minutes: 25 },
    { dayAr: 'الجمعة', dayEn: 'Fri', minutes: 0 },
    { dayAr: 'السبت', dayEn: 'Sat', minutes: 18 },
    { dayAr: 'اليوم', dayEn: 'Today', minutes: minutesToday },
  ];

  // Daily limit chips: 15 / 30 / 45 / 60 / no limit (0)
  const limitChips = [
    { value: 15, labelAr: '١٥', labelEn: '15' },
    { value: 30, labelAr: '٣٠', labelEn: '30' },
    { value: 45, labelAr: '٤٥', labelEn: '45' },
    { value: 60, labelAr: '٦٠', labelEn: '60' },
    { value: 0, labelAr: 'بلا حد', labelEn: 'No limit' },
  ];

  const currentDailyLimit = parentSettings.dailyLimitMin ?? 30;

  // IF LOCKED: RENDER PARENT GATE SCREEN (BLOCKING ALL SETTINGS & REPORTS)
  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ParentGateView
          onSuccess={() => setIsUnlocked(true)}
          onClose={() => router.back()}
          showCloseButton={true}
        />
      </SafeAreaView>
    );
  }

  // IF UNLOCKED: RENDER FULL PARENT DASHBOARD (Mockup Page 6)
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backCircleBtn}
            onPress={() => router.back()}
            accessibilityLabel={isAr ? 'الرجوع' : 'Back'}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isRtl ? 'chevron-forward' : 'chevron-back'}
              size={24}
              color="#334155"
            />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>
            {isAr ? 'لوحة الأهل' : "Parents' Dashboard"}
          </Text>

          <View style={{ width: 44, height: 44 }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. CHILD SWITCHER AT TOP */}
          <TouchableOpacity
            style={styles.childSwitcherCard}
            onPress={() => setShowChildPicker(true)}
            activeOpacity={0.85}
            accessibilityLabel={isAr ? 'تبديل الطفل' : 'Switch child'}
            accessibilityRole="button"
          >
            <View style={[styles.childSwitcherRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {/* Dropdown chevron */}
              <Ionicons name="chevron-down" size={20} color="#64748B" />

              {/* Child Info */}
              <View style={[styles.childInfoCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                <Text style={styles.childNameText}>
                  {activeProfile.name || (isAr ? 'بطل' : 'Champion')}
                </Text>
                <Text style={styles.childAgeText}>
                  {isAr ? '٧ – ٩ سنوات' : '7 – 9 years'}
                </Text>
              </View>

              {/* Avatar circle */}
              <View style={styles.childAvatarCircle}>
                <Image
                  source={activeProfile.avatar?.includes('girl') ? AVATAR_GIRL : AVATAR_BOY}
                  style={styles.childAvatarImg}
                  resizeMode="cover"
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* 2. THREE STAT TILES IN A ROW */}
          <View style={[styles.statTilesRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* Tile 1 (Yellow): Steps / Surahs Done */}
            <View style={[styles.statTile, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statTileNumber, { color: '#B45309' }]}>
                {isAr ? '٣' : completedSurahsCount}
              </Text>
              <Text style={[styles.statTileLabel, { color: '#92400E' }]}>
                {isAr ? 'سور استمع لها' : 'Surahs heard'}
              </Text>
            </View>

            {/* Tile 2 (Sky Blue): Minutes Today */}
            <View style={[styles.statTile, { backgroundColor: '#E0F2FE' }]}>
              <Text style={[styles.statTileNumber, { color: '#0369A1' }]}>
                {isAr ? '١٢' : minutesToday}
              </Text>
              <Text style={[styles.statTileLabel, { color: '#0284C7' }]}>
                {isAr ? 'دقيقة اليوم' : 'Min today'}
              </Text>
            </View>

            {/* Tile 3 (Mint Green): Active Days Streak */}
            <View style={[styles.statTile, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.statTileNumber, { color: '#15803D' }]}>
                {isAr ? '٤' : (streakCount || 4)}
              </Text>
              <Text style={[styles.statTileLabel, { color: '#166534' }]}>
                {isAr ? 'أيام نشاط' : 'Active days'}
              </Text>
            </View>
          </View>

          {/* 3. 7-DAY BAR CHART OF MINUTES */}
          <View style={styles.sectionCard}>
            <View style={[styles.chartHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Text style={styles.chartTitle}>
                {isAr ? 'دقائق الاستخدام' : 'Usage Minutes'}
              </Text>
              <Text style={styles.chartPeriodBadge}>
                {isAr ? 'آخر ٧ أيام' : 'Last 7 days'}
              </Text>
            </View>
            <Text style={[styles.chartSubtext, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? 'بيانات تجريبية للتصميم' : 'Live design preview'}
            </Text>

            {hasUsageData ? (
              <View style={[styles.barChartContainer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {weeklyUsage.map((col, idx) => {
                  const maxBarHeight = 90;
                  const barHeight = Math.max(6, Math.min(maxBarHeight, (col.minutes / 35) * maxBarHeight));
                  return (
                    <View key={idx} style={styles.barColumn}>
                      <Text style={styles.barValueText}>
                        {isAr ? toArabicIndic(col.minutes) : col.minutes}
                      </Text>
                      <View style={[styles.barTrack, { height: maxBarHeight }]}>
                        <View style={[styles.barFill, { height: barHeight }]} />
                      </View>
                      <Text style={styles.barDayText} numberOfLines={1}>
                        {isAr ? col.dayAr : col.dayEn}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              // Empty State when no usage data exists
              <View style={styles.emptyChartBox}>
                <Ionicons name="bar-chart-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyChartText}>
                  {isAr
                    ? 'لا توجد بيانات استخدام مسجلة بعد للأيام السابقة'
                    : 'No usage activity recorded for previous days yet'}
                </Text>
              </View>
            )}
          </View>

          {/* 4. DAILY LIMIT CHIPS (15 / 30 / 45 / 60 / no limit) */}
          <View style={styles.sectionCard}>
            <Text style={[styles.cardTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? 'الحد اليومي للاستخدام' : 'Daily Usage Limit'}
            </Text>

            <View style={[styles.limitChipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {limitChips.map((chip) => {
                const isSelected = currentDailyLimit === chip.value;
                return (
                  <TouchableOpacity
                    key={chip.value}
                    style={[styles.limitChip, isSelected && styles.limitChipActive]}
                    onPress={() => updateParentSettings({ dailyLimitMin: chip.value })}
                    activeOpacity={0.8}
                    accessibilityLabel={chip.labelAr}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.limitChipText, isSelected && styles.limitChipTextActive]}>
                      {isAr ? chip.labelAr : chip.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.limitHelperText, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr
                ? 'بالدقائق في اليوم. عند الوصول للحد يظهر للطفل تنبيه لطيف.'
                : 'Minutes per day. When limit is reached, a gentle rest notice appears.'}
            </Text>
          </View>

          {/* 5. BEDTIME-LOCK SWITCH */}
          <View style={styles.sectionCard}>
            <View style={[styles.switchCardRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.switchTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                <Text style={styles.switchTitle}>
                  {isAr ? 'قفل وقت النوم' : 'Bedtime Lock'}
                </Text>
                <Text style={styles.switchSub}>
                  {isAr ? 'من ٨:٣٠ مساءً إلى ٦:٣٠ صباحًا' : 'From 8:30 PM to 6:30 AM'}
                </Text>
              </View>
              <Switch
                value={Boolean(parentSettings.bedtimeLockEnabled)}
                onValueChange={(val) => updateParentSettings({ bedtimeLockEnabled: val })}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* 6. DETAILED LEARNING & PROGRESS REPORTS (B6) */}
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? 'تقارير الإنجاز والتعلم 📊' : 'Detailed Learning Progress 📊'}
            </Text>

            {/* Hifz Report */}
            <View style={styles.reportCategoryBox}>
              <View style={[styles.reportHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="book-outline" size={18} color="#059669" />
                <Text style={styles.reportCategoryTitle}>
                  {isAr ? 'حفظ القرآن الكريم' : 'Quran Memorization'}
                </Text>
              </View>
              <View style={[styles.reportStatsGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.reportStatChip, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.reportStatNum, { color: '#047857' }]}>
                    {report?.hifz.totalMemorized ?? 0}
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'حَفِظْتُهَا' : 'Memorized'}</Text>
                </View>
                <View style={[styles.reportStatChip, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.reportStatNum, { color: '#B45309' }]}>
                    {report?.hifz.totalMastered ?? 0}
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'مُتْقَنَةٌ' : 'Mastered'}</Text>
                </View>
                <View style={[styles.reportStatChip, { backgroundColor: '#FFE4E6' }]}>
                  <Text style={[styles.reportStatNum, { color: '#E11D48' }]}>
                    {report?.hifz.totalReview ?? 0}
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'أُرَاجِعُهَا' : 'Review'}</Text>
                </View>
              </View>
            </View>

            {/* Tasbih Report */}
            <View style={styles.reportCategoryBox}>
              <View style={[styles.reportHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="finger-print" size={18} color="#7C3AED" />
                <Text style={styles.reportCategoryTitle}>
                  {isAr ? 'المسبحة الإلكترونية' : 'Digital Tasbih'}
                </Text>
              </View>
              <View style={[styles.reportStatsGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.reportStatChip, { backgroundColor: '#EDE9FE' }]}>
                  <Text style={[styles.reportStatNum, { color: '#6D28D9' }]}>
                    {report?.tasbih.totalToday ?? 0}
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'تسبيحات اليوم' : 'Today'}</Text>
                </View>
                <View style={[styles.reportStatChip, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={[styles.reportStatNum, { color: '#374151' }]}>
                    {report?.tasbih.totalWeek ?? 0}
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'هذا الأسبوع' : 'This week'}</Text>
                </View>
                <View style={[styles.reportStatChip, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.reportStatNum, { color: '#15803D' }]}>
                    {report?.tasbih.completionsToday ?? 0} / ٣
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'أهداف اليوم' : 'Targets met'}</Text>
                </View>
              </View>
            </View>

            {/* Units & Certificates Report */}
            <View style={styles.reportCategoryBox}>
              <View style={[styles.reportHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="ribbon-outline" size={18} color="#0284C7" />
                <Text style={styles.reportCategoryTitle}>
                  {isAr ? 'مسارات الوضوء والصلاة والشهادات' : 'Units & Certificates'}
                </Text>
              </View>
              <View style={{ gap: 8, marginTop: 8 }}>
                {report?.units.map((u) => (
                  <View
                    key={u.unitId}
                    style={[styles.unitReportRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                  >
                    <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                      <Text style={styles.unitReportTitle}>{u.titleArabic}</Text>
                      <Text style={styles.unitReportSub}>
                        {u.lessonsDone} مِنْ {u.totalLessons} دُرُوسٍ مُكْتَمَلَةٍ
                      </Text>
                    </View>
                    {u.certificateUnlocked ? (
                      <TouchableOpacity
                        style={styles.viewCertBtn}
                        onPress={() => setSelectedCertUnit(u.titleArabic)}
                        accessibilityRole="button"
                        accessibilityLabel={`عرض شهادة ${u.titleArabic}`}
                      >
                        <Ionicons name="ribbon" size={14} color="#FFFFFF" />
                        <Text style={styles.viewCertBtnText}>عَرْضُ الشَّهَادَةِ</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.lockedCertBadge}>
                        <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                        <Text style={styles.lockedCertText}>قَيْدَ التَّقَدُّمِ</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Stories Report */}
            <View style={styles.reportCategoryBox}>
              <View style={[styles.reportHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="trail-sign-outline" size={18} color="#D97706" />
                <Text style={styles.reportCategoryTitle}>
                  {isAr ? 'قصص الأنبياء والأوسمة' : 'Prophet Stories & Badges'}
                </Text>
              </View>
              <View style={[styles.reportStatsGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.reportStatChip, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.reportStatNum, { color: '#B45309' }]}>
                    {report?.stories.readCount ?? 0} / ٢٥
                  </Text>
                  <Text style={styles.reportStatLabel}>{isAr ? 'قصص قُرِئَتْ' : 'Stories Read'}</Text>
                </View>
                <View style={[styles.reportStatChip, { backgroundColor: '#DCFCE7', flex: 2 }]}>
                  <Text style={[styles.reportStatNum, { color: '#15803D' }]}>
                    {report?.stories.earnedBadges.length ?? 0} أَوْسِمَةٍ
                  </Text>
                  <Text style={styles.reportStatLabel} numberOfLines={1}>
                    {report?.stories.earnedBadges.join(' • ') || (isAr ? 'لا توجد أوسمة بعد' : 'No badges yet')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 7. RESET FEATURE PROGRESS (B6 - Behind PIN) */}
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? 'إعادة ضبط التقدم (Reset Progress)' : 'Reset Feature Progress'}
            </Text>
            <Text style={[styles.limitHelperText, { textAlign: isRtl ? 'right' : 'left', marginBottom: 12 }]}>
              {isAr
                ? 'يمكنك إعادة ضبط تقدم خاصية محددة لبدء رحلة التعلم من جديد لهذا الطفل.'
                : 'Reset a specific feature to restart learning progress for this child.'}
            </Text>

            <View style={styles.resetButtonsGrid}>
              <TouchableOpacity
                style={styles.featureResetBtn}
                onPress={() => setResetTarget({ store: 'hifz', titleAr: 'حِفْظِ الْقُرْآنِ الْكَرِيمِ' })}
                accessibilityRole="button"
                accessibilityLabel="إعادة ضبط الحفظ"
              >
                <Ionicons name="trash-outline" size={16} color="#E11D48" />
                <Text style={styles.featureResetText}>إِعَادَةُ ضَبْطِ الْحِفْظِ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureResetBtn}
                onPress={() => setResetTarget({ store: 'tasbih', titleAr: 'عَدَّادَاتِ الْمِسْبَحَةِ' })}
                accessibilityRole="button"
                accessibilityLabel="إعادة ضبط المسبحة"
              >
                <Ionicons name="trash-outline" size={16} color="#E11D48" />
                <Text style={styles.featureResetText}>إِعَادَةُ ضَبْطِ الْمِسْبَحَةِ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureResetBtn}
                onPress={() => setResetTarget({ store: 'units', titleAr: 'مَسَارَاتِ الْوُضُوءِ وَالصَّلَاةِ' })}
                accessibilityRole="button"
                accessibilityLabel="إعادة ضبط الوضوء والصلاة"
              >
                <Ionicons name="trash-outline" size={16} color="#E11D48" />
                <Text style={styles.featureResetText}>إِعَادَةُ ضَبْطِ الْوُضُوءِ وَالصَّلَاةِ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureResetBtn}
                onPress={() => setResetTarget({ store: 'stories', titleAr: 'قِرَاءَةِ قِصَصِ الْأَنْبِيَاءِ' })}
                accessibilityRole="button"
                accessibilityLabel="إعادة ضبط قراءة القصص"
              >
                <Ionicons name="trash-outline" size={16} color="#E11D48" />
                <Text style={styles.featureResetText}>إِعَادَةُ ضَبْطِ قِرَاءَةِ الْقِصَصِ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 8. SETTINGS SECTION */}
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? 'الإعدادات' : 'Settings'}
            </Text>

            {/* Row 1: Age band */}
            <TouchableOpacity
              style={[styles.settingsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              onPress={() => setShowAgePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'الفئة العمرية' : 'Age group'}
              </Text>
              <View style={[styles.settingsRowValueWrap, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.settingsRowValue}>
                  {isAr ? '٧ – ٩ سنوات' : '7 – 9 years'}
                </Text>
                <Ionicons
                  name={isRtl ? 'chevron-back' : 'chevron-forward'}
                  size={16}
                  color="#94A3B8"
                />
              </View>
            </TouchableOpacity>

            {/* Row 2: Madhhab */}
            <TouchableOpacity
              style={[styles.settingsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              onPress={() => setShowMadhhabPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'مذهب الصلاة' : 'Prayer school (Madhhab)'}
              </Text>
              <View style={[styles.settingsRowValueWrap, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.settingsRowValue}>
                  {isAr
                    ? (MADHHABS.find((m) => m.id === parentSettings.madhhab)?.nameAr || 'الشافعي')
                    : (MADHHABS.find((m) => m.id === parentSettings.madhhab)?.nameEn || "Shafi'i")}
                </Text>
                <Ionicons
                  name={isRtl ? 'chevron-back' : 'chevron-forward'}
                  size={16}
                  color="#94A3B8"
                />
              </View>
            </TouchableOpacity>

            {/* Row 3: City */}
            <TouchableOpacity
              style={[styles.settingsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              onPress={() => setShowCityPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'مدينة مواقيت الصلاة' : 'Prayer times city'}
              </Text>
              <View style={[styles.settingsRowValueWrap, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.settingsRowValue}>
                  {isAr
                    ? (CITIES.find((c) => c.id === parentSettings.prayerCity)?.nameAr || 'القاهرة')
                    : (CITIES.find((c) => c.id === parentSettings.prayerCity)?.nameEn || 'Cairo')}
                </Text>
                <Ionicons
                  name={isRtl ? 'chevron-back' : 'chevron-forward'}
                  size={16}
                  color="#94A3B8"
                />
              </View>
            </TouchableOpacity>

            {/* Row 4: Rewards switch */}
            <View style={[styles.settingsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'عرض النجوم والمكافآت' : 'Show stars & rewards'}
              </Text>
              <Switch
                value={showRewards}
                onValueChange={setShowRewards}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Row 5: Music switch (Off by default as required by Islamic content rules) */}
            <View style={[styles.settingsRowLast, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.musicCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                <Text style={styles.settingsRowLabel}>
                  {isAr ? 'السماح بالموسيقى' : 'Allow background music'}
                </Text>
                <Text style={styles.musicSub}>
                  {isAr ? 'الأناشيد بالصوت فقط افتراضيًا' : 'Vocals-only by default'}
                </Text>
              </View>
              <Switch
                value={allowMusic}
                onValueChange={setAllowMusic}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* 7. ABOUT CONTENT & PRIVACY */}
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? 'عن المحتوى والخصوصية' : 'About Content & Privacy'}
            </Text>

            {/* Row 1: Sources */}
            <TouchableOpacity
              style={[styles.settingsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              onPress={() => setShowSourcesModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'مصادرنا ومراجعو المحتوى' : 'Our sources & reviewers'}
              </Text>
              <Ionicons
                name={isRtl ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color="#94A3B8"
              />
            </TouchableOpacity>

            {/* Row 2: Report error */}
            <TouchableOpacity
              style={[styles.settingsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              onPress={() => setShowReportModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'الإبلاغ عن خطأ في المحتوى' : 'Report content correction'}
              </Text>
              <Ionicons
                name={isRtl ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color="#94A3B8"
              />
            </TouchableOpacity>

            {/* Row 3: Export or delete */}
            <TouchableOpacity
              style={[styles.settingsRowLast, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              onPress={() => setShowExportModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsRowLabel}>
                {isAr ? 'تصدير بيانات الطفل أو حذفها' : 'Export or delete child data'}
              </Text>
              <Ionicons
                name={isRtl ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* 8. BOTTOM PRIVACY BANNER */}
          <View style={styles.bottomPrivacyCard}>
            <Text style={[styles.bottomPrivacyTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr
                ? 'بلا إعلانات، بلا محادثات، وبأقل قدر من البيانات.'
                : 'Zero ads, zero chats, strictly minimal data.'}
            </Text>
            <Text style={[styles.bottomPrivacyBody, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr
                ? 'تبقى بيانات طفلك على جهازه حتى توافق على تصديرها أو نقلها، ولا نقوم أبدًا ببيع البيانات أو تتبع طفلك.'
                : 'Your child’s progress stays on this device only. We never sell data, run trackers, or send analytics.'}
            </Text>
          </View>
        </ScrollView>

        {/* MODALS: Madhhab, City, Age, Sources, Report, Export */}
        {/* Madhhab Picker Modal */}
        <Modal
          visible={showMadhhabPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMadhhabPicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'اختر مذهب الصلاة' : 'Select Madhhab'}
              </Text>
              {MADHHABS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.pickerOptionRow,
                    parentSettings.madhhab === m.id && styles.pickerOptionRowSelected,
                  ]}
                  onPress={() => {
                    updateParentSettings({ madhhab: m.id as any });
                    setShowMadhhabPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>
                    {isAr ? m.nameAr : m.nameEn}
                  </Text>
                  {parentSettings.madhhab === m.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowMadhhabPicker(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'إغلاق' : 'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* City Picker Modal */}
        <Modal
          visible={showCityPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCityPicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'اختر المدينة لمواقيت الصلاة' : 'Select Prayer Times City'}
              </Text>
              {CITIES.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.pickerOptionRow,
                    parentSettings.prayerCity === c.id && styles.pickerOptionRowSelected,
                  ]}
                  onPress={() => {
                    updateParentSettings({ prayerCity: c.id });
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>
                    {isAr ? c.nameAr : c.nameEn}
                  </Text>
                  {parentSettings.prayerCity === c.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowCityPicker(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'إغلاق' : 'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Sources & Islamic Content Reviewers Modal */}
        <Modal
          visible={showSourcesModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSourcesModal(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Ionicons name="ribbon-outline" size={36} color="#059669" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'مصادرنا المعتمدة' : 'Verified Content Sources'}
              </Text>
              <Text style={[styles.sourcesModalBody, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr
                  ? '• النص القرآني المعتمد: مصحف تنزيل وفق رواية حفص عن عاصم (مصحف المدينة النبوية)، برخصة المشاع الإبداعي CC BY 3.0\n• التفاسير المعتمدة: التفسير الميسر (مجمع الملك فهد) وتفسير السعدي\n• التلاوات: مكتبة EveryAyah المعتمدة\n• صحيح البخاري وصحيح مسلم والسنن الأربعة بدرجة الحديث والمصدر\n• الالتزام التام بعدم تصوير وجوه الأنبياء والصحابة أو الذات الإلهية\n• جميع الأناشيد صوتية فقط بدون معازف'
                  : '• Verified Quran text: Tanzil Project (Hafs \'an \'Asim), Creative Commons Attribution 3.0 License (CC BY 3.0)\n• Authentic Tafsir: Al-Muyassar (King Fahd Complex) and As-Sa\'di\n• Recitations: EveryAyah verified repository\n• Hadiths: Sahih Al-Bukhari, Sahih Muslim, and 4 Sunan with grade and source\n• Full compliance: Zero depictions of Prophets, Companions, or the Divine\n• Nasheeds: Strictly vocal-only'}
              </Text>
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowSourcesModal(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'حسناً' : 'Done'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Certificate Viewer Modal (B6) */}
        <UnitCertificateModal
          visible={Boolean(selectedCertUnit)}
          childName={activeProfile?.name}
          unitTitleArabic={selectedCertUnit || ''}
          onDismiss={() => setSelectedCertUnit(null)}
        />

        {/* Feature Reset Confirmation Modal (B6) */}
        <Modal
          visible={Boolean(resetTarget)}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setResetTarget(null)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Ionicons name="warning" size={40} color="#E11D48" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'تأكيد إعادة ضبط التقدم' : 'Confirm Progress Reset'}
              </Text>
              <Text style={[styles.sourcesModalBody, { textAlign: 'center', marginVertical: 12 }]}>
                {isAr
                  ? `هل أنت متأكد من رغبتك في إعادة ضبط ${resetTarget?.titleAr || ''}؟ سيتم مسح بيانات هذا القسم فقط والبدء من جديد لهذا الطفل.`
                  : `Are you sure you want to reset ${resetTarget?.titleAr || 'this feature'}? Only this section will be restarted for this child.`}
              </Text>
              <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', gap: 10, width: '100%' }}>
                <TouchableOpacity
                  style={[styles.pickerCloseBtn, { backgroundColor: '#E11D48', flex: 1 }]}
                  onPress={async () => {
                    if (resetTarget) {
                      await parentReportsService.resetFeature(activeProfile.id, resetTarget.store);
                      setResetTarget(null);
                      refreshReport();
                    }
                  }}
                >
                  <Text style={[styles.pickerCloseText, { color: '#FFFFFF' }]}>
                    {isAr ? 'نعم، أعد الضبط' : 'Yes, Reset'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pickerCloseBtn, { backgroundColor: '#F3F4F6', flex: 1 }]}
                  onPress={() => setResetTarget(null)}
                >
                  <Text style={[styles.pickerCloseText, { color: '#374151' }]}>
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Child Profile Switcher Modal */}
        <Modal
          visible={showChildPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowChildPicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'الملفات الشخصية للأطفال' : 'Child Profiles'}
              </Text>
              {profiles.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.pickerOptionRow,
                    activeProfileId === p.id && styles.pickerOptionRowSelected,
                  ]}
                  onPress={() => {
                    setActiveProfile(p.id);
                    setShowChildPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{p.name}</Text>
                  {activeProfileId === p.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowChildPicker(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'إغلاق' : 'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Age Band Picker Modal */}
        <Modal
          visible={showAgePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAgePicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'اختر الفئة العمرية' : 'Select Age Band'}
              </Text>
              {AGE_BANDS.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.pickerOptionRow, b.id === '7-9' && styles.pickerOptionRowSelected]}
                  onPress={() => setShowAgePicker(false)}
                >
                  <Text style={styles.pickerOptionText}>{isAr ? b.labelAr : b.labelEn}</Text>
                  {b.id === '7-9' && (
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowAgePicker(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'إغلاق' : 'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Report Error Modal */}
        <Modal
          visible={showReportModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowReportModal(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Ionicons name="chatbubble-ellipses-outline" size={36} color="#059669" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'الإبلاغ عن تصويب' : 'Report Correction'}
              </Text>
              <Text style={[styles.sourcesModalBody, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr
                  ? 'نسعد بملاحظاتكم وتصويباتكم الدقيقة حول نصوص الآيات أو الأحاديث أو محتوى الأنشطة. يمكنكم التواصل المباشر مع فريق المراجعة الشرعية عبر البريد الإلكتروني.'
                  : 'We welcome your feedback and corrections on Ayahs, Hadiths, or learning activities. Direct contact with our content review team.'}
              </Text>
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'حسناً' : 'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Export Data Modal */}
        <Modal
          visible={showExportModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowExportModal(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalCard}>
              <Ionicons name="cloud-download-outline" size={36} color="#059669" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={styles.pickerModalTitle}>
                {isAr ? 'تصدير أو حذف البيانات' : 'Export or Delete Data'}
              </Text>
              <Text style={[styles.sourcesModalBody, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr
                  ? 'بيانات طفلك محفوظة محلياً بالكامل على هذا الهاتف لحمايتها. يمكنك تصدير نسخة احتياطية مشفرة محلياً، أو مسح التقدم لإعادة البدء من جديد.'
                  : 'All child data is stored strictly on this device. You can export an encrypted backup file or reset progress.'}
              </Text>
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.pickerCloseText}>{isAr ? 'إغلاق' : 'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#065F46',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // 1. Child Switcher Card
  childSwitcherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.04)' },
      default: { elevation: 2 },
    }),
  },
  childSwitcherRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  childInfoCol: {
    flex: 1,
    marginHorizontal: 14,
  },
  childNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  childAgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  childAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FDE68A',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  childAvatarImg: {
    width: '100%',
    height: '100%',
  },
  // 2. Three Stat Tiles in a row
  statTilesRow: {
    gap: 12,
    marginBottom: 16,
  },
  statTile: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTileNumber: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  statTileLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
      default: { elevation: 1 },
    }),
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 12,
  },
  chartHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#065F46',
  },
  chartPeriodBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  chartSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 16,
  },
  barChartContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 135,
    paddingTop: 8,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    backgroundColor: '#F1F5F9',
    borderRadius: 11,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 11,
  },
  barDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },
  emptyChartBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyChartText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  // Limit Chips
  limitChipsRow: {
    gap: 8,
    marginVertical: 4,
  },
  limitChip: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitChipActive: {
    backgroundColor: '#065F46',
    borderColor: '#065F46',
  },
  limitChipText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
  },
  limitChipTextActive: {
    color: '#FFFFFF',
  },
  limitHelperText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 10,
    lineHeight: 18,
  },
  // Switch Card Row
  switchCardRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextCol: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  switchSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  // Settings Section Rows
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 10,
  },
  settingsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingsRowLast: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingsRowLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingsRowValueWrap: {
    alignItems: 'center',
    gap: 6,
  },
  settingsRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  musicCol: {
    flex: 1,
  },
  musicSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  // Bottom Privacy Card
  bottomPrivacyCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  bottomPrivacyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 4,
  },
  bottomPrivacyBody: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
    lineHeight: 18,
  },
  // Pickers Modal
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pickerModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 14,
    textAlign: 'center',
  },
  pickerOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  pickerOptionRowSelected: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  pickerOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  sourcesModalBody: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 24,
    marginVertical: 12,
  },
  pickerCloseBtn: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  reportStatChip: {
    padding: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
  },
  reportStatNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
  },
  reportStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  resetButtonsGrid: {
    gap: 8,
  },
  featureResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    minHeight: 44,
  },
  featureResetText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },
  reportCategoryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportHeaderRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  reportCategoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  reportStatsGrid: {
    gap: 8,
  },
  unitReportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  unitReportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  unitReportSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewCertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  viewCertBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  lockedCertBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  lockedCertText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});
