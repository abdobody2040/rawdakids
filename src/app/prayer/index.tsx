import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
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

import { getPrayerTimesForCity } from '@/services/prayerTimeService';

// 3D Pixar-style visual assets for Prayer Hub
const WUDU_IMG = require('../../../assets/images/wudu-garden.jpg');
const SALAH_IMG = require('../../../assets/images/salah-takbeer-3d.jpg');
const ADHKAR_IMG = require('../../../assets/images/nav-sunnah-3d.jpg');
const TASBIH_IMG = require('../../../assets/images/icon-gem-3d.jpg');
const MOSQUE_IMG = require('../../../assets/images/scene-medina-mosque.jpg');

interface PrayerTimeItem {
  id: string;
  nameAr: string;
  nameEn: string;
  time: string;
  rakahs: number;
  icon: keyof typeof Ionicons.glyphMap;
  isPassed: boolean;
  isNext: boolean;
}

const PRAYER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  fajr: 'sunny-outline',
  sunrise: 'partly-sunny-outline',
  dhuhr: 'sunny',
  asr: 'cloud-outline',
  maghrib: 'partly-sunny-outline',
  isha: 'moon-outline',
};

export default function PrayerScreen() {
  const router = useRouter();
  const { language, profiles, activeProfileId, parentSettings, updateParentSettings } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  // Active child profile
  const profile = profiles.find((p) => p.id === activeProfileId);
  const isGirl = profile?.avatar?.includes('girl') || profile?.avatar?.includes('female');

  // Adhan sound toggle synchronized with parent controls (PRD §8 - PRY-4)
  const adhanEnabled = Boolean(parentSettings.adhanAudioEnabled);
  const setAdhanEnabled = (val: boolean) => {
    updateParentSettings({ adhanAudioEnabled: val });
  };

  // Practice checklist state (PRD §7.4.4: for learning, not point transaction)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Check if today is Friday (Day 5 in JS Date: 0 is Sun, 5 is Fri)
  const isFriday = new Date().getDay() === 5;

  // City & Madhhab based dynamic prayer times (PRD §8 - PRY-3 & PRY-4)
  const prayerData = getPrayerTimesForCity(
    parentSettings.prayerCity || 'cairo',
    parentSettings.madhhab || 'shafii',
    isAr
  );

  const prayerTimes: PrayerTimeItem[] = prayerData.slots.map((slot) => ({
    id: slot.id,
    nameAr: slot.nameAr,
    nameEn: slot.nameEn,
    time: isAr ? slot.timeStringAr : slot.timeStringEn,
    rakahs: slot.rakahs,
    icon: PRAYER_ICONS[slot.id] || 'time-outline',
    isPassed: slot.isPassed,
    isNext: slot.isNext,
  }));

  const nextPrayer = prayerData.nextSlot;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* Header */}
        <Header
          title={isAr ? 'صلاتي ونوري' : 'My Prayer & Light'}
          showBack
          fallbackRoute="/"
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* FRIDAY SPECIAL BANNER */}
          {isFriday && (
            <View style={styles.fridayBanner}>
              <LinearGradient
                colors={['#047857', '#065F46']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.fridayBannerInner, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                <Ionicons name="sparkles" size={24} color="#FDE047" />
                <View style={[styles.fridayTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.fridayTitle}>
                    {isAr ? 'يوم الجمعة المبارك ✨' : 'Blessed Friday ✨'}
                  </Text>
                  <Text style={[styles.fridaySub, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr
                      ? 'لا تنسَ قراءة سورة الكهف والإكثار من الصلاة على حبيبنا محمد ﷺ'
                      : 'Remember to recite Surah Al-Kahf and send blessings on Prophet Muhammad ﷺ'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.fridayActionBtn}
                  onPress={() => router.push('/quran/18')}
                >
                  <Text style={styles.fridayActionText}>
                    {isAr ? 'سورة الكهف' : 'Al-Kahf'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* NEXT PRAYER COUNTDOWN CARD */}
          <View style={styles.countdownCard}>
            <LinearGradient
              colors={['#0284C7', '#0369A1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.countdownGradient}
            >
              <View style={[styles.countdownTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <View style={[styles.countdownCityChip, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="location" size={14} color="#E0F2FE" />
                    <Text style={styles.countdownCityText}>
                      {isAr ? `مواقيت الصلاة • ${prayerData.city.nameAr}` : `Prayer Times • ${prayerData.city.nameEn}`}
                    </Text>
                  </View>
                  <View style={[styles.countdownCityChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                    <Text style={[styles.countdownCityText, { fontSize: 11 }]}>
                      {isAr
                        ? `مذهب: ${parentSettings.madhhab === 'hanafi' ? 'الحنفي' : parentSettings.madhhab === 'maliki' ? 'المالكي' : parentSettings.madhhab === 'hanbali' ? 'الحنبلي' : 'الشافعي'}`
                        : `Fiqh: ${parentSettings.madhhab === 'hanafi' ? 'Hanafi' : parentSettings.madhhab === 'maliki' ? 'Maliki' : parentSettings.madhhab === 'hanbali' ? 'Hanbali' : 'Shafi’i'}`}
                    </Text>
                  </View>
                </View>
                <View style={[styles.countdownAdhanRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons
                    name={adhanEnabled ? 'volume-high' : 'volume-mute'}
                    size={16}
                    color="#BAE6FD"
                  />
                  <Text style={styles.countdownAdhanLabel}>
                    {isAr ? 'الأذان' : 'Adhan'}
                  </Text>
                  <Switch
                    value={adhanEnabled}
                    onValueChange={setAdhanEnabled}
                    trackColor={{ false: '#0369A1', true: '#38BDF8' }}
                    thumbColor="#FFFFFF"
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                </View>
              </View>

              {isGirl && (
                <View style={[styles.girlNoticePill, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="sparkles" size={12} color="#FDE047" />
                  <Text style={styles.girlNoticeText}>
                    {isAr
                      ? 'إرشاد السنّة للفتيات: ضم الأعضاء وجمع اليدين في السجود والركوع لمزيد من الحشمة 🌸'
                      : 'Sunnah note for girls: Gather arms close during bowing and prostration 🌸'}
                  </Text>
                </View>
              )}

              <View style={[styles.countdownMainRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.countdownInfoCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.countdownNextLabel}>
                    {isAr ? 'الصلاة القادمة بإذن الله:' : 'Next prayer in sha Allah:'}
                  </Text>
                  <Text style={styles.countdownPrayerName}>
                    {isAr
                      ? `صلاة ${nextPrayer.nameAr} (${nextPrayer.rakahs} ركعات)`
                      : `${nextPrayer.nameEn} Prayer (${nextPrayer.rakahs} Rak’ahs)`}
                  </Text>
                  <Text style={styles.countdownTargetTime}>
                    {isAr
                      ? `موعد الأذان: ${nextPrayer.timeStringAr}`
                      : `Adhan Time: ${nextPrayer.timeStringEn}`}
                  </Text>
                </View>
                <View style={styles.countdownBadge}>
                  <Image source={MOSQUE_IMG} style={styles.countdownMosqueImg} resizeMode="cover" />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.countdownWuduBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                onPress={() => router.push('/arkan/salah?mode=wudu')}
                activeOpacity={0.85}
              >
                <Ionicons name="water" size={18} color="#0284C7" />
                <Text style={styles.countdownWuduBtnText}>
                  {isAr ? 'هيا نتوضأ معاً خطوة بخطوة 💧' : 'Let’s perform Wudu step by step 💧'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* 4 FLAGSHIP INTERACTIVE TILES */}
          <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
            {isAr ? 'تعلم وطبق صلاتك 🕌' : 'Learn & Practice Your Prayer 🕌'}
          </Text>

          <View style={styles.fourTilesGrid}>
            {/* Tile 1: Wudu Simulator */}
            <TouchableOpacity
              style={styles.tileCard}
              onPress={() => router.push('/prayer/wudu')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#E0F2FE', '#BAE6FD']}
                style={styles.tileGradient}
              >
                <View style={[styles.tileHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.tileIconBox, { borderColor: '#0284C7' }]}>
                    <Image source={WUDU_IMG} style={styles.tileImage} resizeMode="cover" />
                  </View>
                  <View style={styles.tileBadge}>
                    <Text style={styles.tileBadgeText}>
                      {isAr ? '١٠ خطوات' : '10 Steps'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tileTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? 'محاكي الوضوء المبارك' : 'Wudu Simulator'}
                </Text>
                <Text style={[styles.tileDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr
                    ? 'تعلم الطهارة الصحيحة بالصوت والصورة التفاعلية خطوة بخطوة'
                    : 'Learn proper purification step by step with clear audio and visuals'}
                </Text>
                <View style={[styles.tileActionRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.tileActionTxt, { color: '#0284C7' }]}>
                    {isAr ? 'ابدأ الوضوء ←' : 'Start Wudu →'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tile 2: Salah Simulator */}
            <TouchableOpacity
              style={styles.tileCard}
              onPress={() => router.push('/prayer/salah')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#DCFCE7', '#BBF7D0']}
                style={styles.tileGradient}
              >
                <View style={[styles.tileHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.tileIconBox, { borderColor: '#16A34A' }]}>
                    <Image source={SALAH_IMG} style={styles.tileImage} resizeMode="cover" />
                  </View>
                  <View style={[styles.tileBadge, { backgroundColor: '#15803D' }]}>
                    <Text style={styles.tileBadgeText}>
                      {isAr ? '٥ صلوات' : '5 Prayers'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tileTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? 'محاكي الصلاة خطوة بخطوة' : 'Salah Simulator'}
                </Text>
                <Text style={[styles.tileDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr
                    ? `تكبيرة الإحرام، الركوع، السجود والتشهد ${isGirl ? '(هيئة صلاة البطلة)' : ''}`
                    : 'Standing, Ruku, Sujud & Tashahhud with recitations and audio'}
                </Text>
                <View style={[styles.tileActionRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.tileActionTxt, { color: '#16A34A' }]}>
                    {isAr ? 'ابدأ الصلاة ←' : 'Start Prayer →'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tile 3: Adhkar & Supplications */}
            <TouchableOpacity
              style={styles.tileCard}
              onPress={() => router.push('/sunnah/adhkar')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.tileGradient}
              >
                <View style={[styles.tileHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.tileIconBox, { borderColor: '#D97706' }]}>
                    <Image source={ADHKAR_IMG} style={styles.tileImage} resizeMode="cover" />
                  </View>
                  <View style={[styles.tileBadge, { backgroundColor: '#B45309' }]}>
                    <Text style={styles.tileBadgeText}>
                      {isAr ? 'صباح ومساء' : 'Daily Adhkar'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tileTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? 'حصن المسلم الصغير' : 'Kids Daily Adhkar'}
                </Text>
                <Text style={[styles.tileDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr
                    ? 'أذكار الصباح والمساء، النوم والاستيقاظ، الطعام والشراب بالصوت'
                    : 'Morning, evening, sleep, and meal supplications with clear audio'}
                </Text>
                <View style={[styles.tileActionRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.tileActionTxt, { color: '#B45309' }]}>
                    {isAr ? 'اقرأ الأذكار ←' : 'Recite Adhkar →'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tile 4: Digital Tasbih Counter */}
            <TouchableOpacity
              style={styles.tileCard}
              onPress={() => router.push('/sunnah/tasbih')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#EDE9FE', '#DDD6FE']}
                style={styles.tileGradient}
              >
                <View style={[styles.tileHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.tileIconBox, { borderColor: '#7C3AED' }]}>
                    <Image source={TASBIH_IMG} style={styles.tileImage} resizeMode="cover" />
                  </View>
                  <View style={[styles.tileBadge, { backgroundColor: '#6D28D9' }]}>
                    <Text style={styles.tileBadgeText}>
                      {isAr ? '٣٣ أو ١٠٠' : '33 / 100'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tileTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? 'المسبحة الإلكترونية التفاعلية' : 'Digital Tasbih Counter'}
                </Text>
                <Text style={[styles.tileDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr
                    ? 'سبحان الله والحمد لله ولا إله إلا الله والله أكبر بنقرات هادئة'
                    : 'Interactive counter for Subhan Allah, Alhamdulillah, and Allahu Akbar'}
                </Text>
                <View style={[styles.tileActionRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.tileActionTxt, { color: '#7C3AED' }]}>
                    {isAr ? 'افتح المسبحة ←' : 'Open Tasbih →'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 5 PRAYER TIMES TIMELINE */}
          <Text style={[styles.sectionHeading, { textAlign: isRtl ? 'right' : 'left', marginTop: SPACING.lg }]}>
            {isAr ? 'جدول أوقات الصلاة اليومية 🕒' : 'Daily Prayer Schedule 🕒'}
          </Text>

          <View style={styles.prayerTimesList}>
            {prayerTimes.map((pt) => (
              <View
                key={pt.id}
                style={[
                  styles.prayerRow,
                  pt.isNext && styles.prayerRowNext,
                  { flexDirection: isRtl ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={[styles.prayerRowLeft, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View
                    style={[
                      styles.prayerIconCircle,
                      pt.isNext && { backgroundColor: '#0284C7' },
                      pt.isPassed && { backgroundColor: '#E2E8F0' },
                    ]}
                  >
                    <Ionicons
                      name={pt.icon}
                      size={18}
                      color={pt.isNext ? '#FFFFFF' : pt.isPassed ? '#94A3B8' : '#0284C7'}
                    />
                  </View>
                  <View style={{ alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                    <Text
                      style={[
                        styles.prayerRowName,
                        pt.isNext && { color: '#0369A1', fontWeight: '800' },
                      ]}
                    >
                      {isAr ? pt.nameAr : pt.nameEn}
                    </Text>
                    {pt.rakahs > 0 && (
                      <Text style={styles.prayerRowRakahs}>
                        {isAr ? `${pt.rakahs} ركعات` : `${pt.rakahs} Rak’ahs`}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={[styles.prayerRowRight, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text
                    style={[
                      styles.prayerRowTime,
                      pt.isNext && { color: '#0284C7', fontWeight: '800' },
                    ]}
                  >
                    {pt.time}
                  </Text>
                  {pt.isNext && (
                    <View style={styles.nextChip}>
                      <Text style={styles.nextChipText}>
                        {isAr ? 'القادمة' : 'Next'}
                      </Text>
                    </View>
                  )}
                  {pt.isPassed && (
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* PILLARS OF ISLAM & FAITH BANNER */}
          <TouchableOpacity
            style={styles.arkanBanner}
            onPress={() => router.push('/arkan')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#065F46', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.arkanBannerInner, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
            >
              <View style={styles.arkanIconBox}>
                <Ionicons name="shield-checkmark" size={26} color="#34D399" />
              </View>
              <View style={[styles.arkanTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                <Text style={styles.arkanTitle}>
                  {isAr ? 'أكاديمية الأركان: أركان الإسلام والإيمان' : 'Pillars Academy: Islam & Iman'}
                </Text>
                <Text style={[styles.arkanSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr
                    ? 'تعلم الشهادتين، الصلاة، الزكاة، الصوم، الحج، وأركان الإيمان الستة'
                    : 'Learn Shahada, Salah, Zakah, Sawm, Hajj and the 6 Pillars of Iman'}
                </Text>
              </View>
              <Ionicons
                name={isRtl ? 'chevron-back' : 'chevron-forward'}
                size={22}
                color="#A7F3D0"
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* PRACTICE CHECKLIST (PRD §7.4.4) */}
          <View style={styles.checklistCard}>
            <View style={[styles.checklistHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Ionicons name="ribbon" size={20} color="#F59E0B" />
              <Text style={styles.checklistTitle}>
                {isAr ? 'دفتر تدريبي اليومي المبارك ⭐' : 'My Daily Practice Checklist ⭐'}
              </Text>
            </View>
            <Text style={[styles.checklistSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr
                ? 'ضع علامة على ما تعلمته وتدربت عليه اليوم بفضل الله:'
                : 'Tick what you practiced and learned today:'}
            </Text>

            <View style={styles.checklistItems}>
              {[
                { id: 'item-wudu', labelAr: 'تدربت على خطوات الوضوء بشكل صحيح', labelEn: 'Practiced Wudu steps properly' },
                { id: 'item-fatiha', labelAr: 'قرأت سورة الفاتحة بترتيل في صلاتي', labelEn: 'Recited Surah Al-Fatihah carefully' },
                { id: 'item-ruku', labelAr: 'تعلمت دعاء الركوع بخشوع (سبحان ربي العظيم)', labelEn: 'Learned Ruku Dhikr (Subhana Rabbiyal Azeem)' },
                { id: 'item-tasbih', labelAr: 'سبحت الله ٣٣ مرة بعد الصلاة بالمسبحة', labelEn: 'Recited Tasbih 33 times with the counter' },
              ].map((item) => {
                const checked = Boolean(checkedItems[item.id]);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.checklistItemRow,
                      checked && styles.checklistItemRowChecked,
                      { flexDirection: isRtl ? 'row-reverse' : 'row' },
                    ]}
                    onPress={() => toggleCheckItem(item.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={checked ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={checked ? '#16A34A' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.checklistItemLabel,
                        checked && styles.checklistItemLabelChecked,
                        { textAlign: isRtl ? 'right' : 'left' },
                      ]}
                    >
                      {isAr ? item.labelAr : item.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

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

  // Friday Banner
  fridayBanner: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  fridayBannerInner: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  fridayTextCol: {
    flex: 1,
  },
  fridayTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FDE047',
    marginBottom: 2,
  },
  fridaySub: {
    fontSize: 12,
    color: '#E6FFFA',
    lineHeight: 18,
  },
  fridayActionBtn: {
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  fridayActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Countdown Card
  countdownCard: {
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  countdownGradient: {
    padding: SPACING.md,
  },
  countdownTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  countdownCityChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    gap: 4,
  },
  countdownCityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  girlNoticePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  girlNoticeText: {
    fontSize: 10,
    color: '#FEF9C3',
    fontWeight: '600',
    flex: 1,
  },
  countdownAdhanRow: {
    alignItems: 'center',
    gap: 4,
  },
  countdownAdhanLabel: {
    fontSize: 11,
    color: '#E0F2FE',
  },
  countdownMainRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
  },
  countdownInfoCol: {
    flex: 1,
  },
  countdownNextLabel: {
    fontSize: 12,
    color: '#BAE6FD',
    marginBottom: 2,
  },
  countdownPrayerName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  countdownTargetTime: {
    fontSize: 13,
    color: '#E0F2FE',
    fontWeight: '600',
  },
  countdownBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  countdownMosqueImg: {
    width: '100%',
    height: '100%',
  },
  countdownWuduBtn: {
    backgroundColor: '#FFFFFF',
    marginTop: SPACING.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.sm,
  },
  countdownWuduBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },

  // Section Heading
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.ink900,
    marginBottom: SPACING.sm,
  },

  // Four Tiles Grid
  fourTilesGrid: {
    gap: SPACING.md,
  },
  tileCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  tileGradient: {
    padding: SPACING.md,
  },
  tileHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  tileIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileBadge: {
    backgroundColor: '#0284C7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  tileBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink900,
    marginTop: 6,
    marginBottom: 4,
  },
  tileDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  tileActionRow: {
    alignItems: 'center',
  },
  tileActionTxt: {
    fontSize: 12,
    fontWeight: '800',
  },

  // Prayer Times List
  prayerTimesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  prayerRow: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  prayerRowNext: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: Platform.OS === 'web' ? 4 : 0,
    borderLeftColor: '#0284C7',
  },
  prayerRowLeft: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  prayerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerRowName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink900,
  },
  prayerRowRakahs: {
    fontSize: 11,
    color: '#64748B',
  },
  prayerRowRight: {
    alignItems: 'center',
    gap: 8,
  },
  prayerRowTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  nextChip: {
    backgroundColor: '#0284C7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  nextChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Arkan Banner
  arkanBanner: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  arkanBannerInner: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  arkanIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arkanTextCol: {
    flex: 1,
  },
  arkanTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  arkanSubtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    lineHeight: 16,
  },

  // Practice Checklist
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  checklistHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink900,
  },
  checklistSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: SPACING.sm,
  },
  checklistItems: {
    gap: 8,
  },
  checklistItemRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    gap: 10,
  },
  checklistItemRowChecked: {
    backgroundColor: '#F0FDF4',
  },
  checklistItemLabel: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    lineHeight: 19,
  },
  checklistItemLabelChecked: {
    color: '#15803D',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
});
