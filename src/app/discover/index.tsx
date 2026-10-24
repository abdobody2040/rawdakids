// Discover Hub (اكتشف) — PRD §7.5
// Stories · Character & Sunnah · Names of Allah · Wonder & Universe
import React, { useState } from 'react';
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
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { isRTL } from '@/constants/i18n';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';

// 3D Pixar-style visual assets for Discover Worlds
const PROPHETS_IMG = require('../../../assets/images/prophets-caravan.jpg');
const SEERAH_IMG = require('../../../assets/images/seerah-world.jpg');
const COMPANIONS_IMG = require('../../../assets/images/companions-world.jpg');
const MANNERS_IMG = require('../../../assets/images/manners-town.jpg');
const SUNNAH_IMG = require('../../../assets/images/sunnah-path.jpg');
const ASMA_IMG = require('../../../assets/images/asma-allah-world.jpg');
const TAFAKKUR_IMG = require('../../../assets/images/tafakkur-world.jpg');
const ANIMALS_IMG = require('../../../assets/images/animals-world.jpg');
const NATIONS_IMG = require('../../../assets/images/nations-world.jpg');
const DISCOVER_HERO_IMG = require('../../../assets/images/nav-prophets-3d.jpg');

interface DiscoverCardItem {
  id: string;
  category: 'stories' | 'akhlaq' | 'asma' | 'wonder';
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descAr: string;
  descEn: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: any;
  accent: string;
  bgGradient: [string, string];
  ageGate?: string;
  countLabelAr: string;
  countLabelEn: string;
}

const DISCOVER_ITEMS: DiscoverCardItem[] = [
  // 1. Stories World
  {
    id: 'prophets',
    category: 'stories',
    titleAr: 'قصص الأنبياء عليهم السلام',
    titleEn: 'Stories of the Prophets',
    subtitleAr: '٢٥ نبياً ورسولاً',
    subtitleEn: '25 Prophets & Messengers',
    descAr: 'رحلة إيمانية مشوقة مع صبر الأنبياء وحكمتهم ومعجزاتهم الخالدة.',
    descEn: 'An inspiring journey through the wisdom, patience, and miracles of the Prophets.',
    route: '/prophets',
    icon: 'book',
    image: PROPHETS_IMG,
    accent: '#7C3AED',
    bgGradient: ['#EDE9FE', '#DDD6FE'],
    countLabelAr: '٢٥ قصة',
    countLabelEn: '25 Stories',
  },
  {
    id: 'seerah',
    category: 'stories',
    titleAr: 'السيرة النبوية العطرة',
    titleEn: 'Prophetic Seerah',
    subtitleAr: 'حياة الحبيب المصطفى ﷺ',
    subtitleEn: 'Life of Prophet Muhammad ﷺ',
    descAr: 'من مولده الشريف في مكة إلى هجرته وبناء مجتمع المحبة والسلام.',
    descEn: 'From his noble birth in Makkah to the Hijrah and building a community of peace.',
    route: '/seerah',
    icon: 'heart',
    image: SEERAH_IMG,
    accent: '#059669',
    bgGradient: ['#D1FAE5', '#A7F3D0'],
    countLabelAr: '١٢ محطة',
    countLabelEn: '12 Milestones',
  },
  {
    id: 'companions',
    category: 'stories',
    titleAr: 'أصحاب الرسول الصغار',
    titleEn: 'Young Companions',
    subtitleAr: 'أبطال حول النبي ﷺ',
    subtitleEn: 'Heroes Around the Prophet ﷺ',
    descAr: 'قصص ملهمة لأطفال ويافعين عاشوا حول النبي وتعلموا منه الشجاعة والوفاء.',
    descEn: 'Inspiring stories of young boys and girls who learned bravery and truth from the Prophet.',
    route: '/companions',
    icon: 'shield-checkmark',
    image: COMPANIONS_IMG,
    accent: '#0284C7',
    bgGradient: ['#E0F2FE', '#BAE6FD'],
    countLabelAr: '١٠ أبطال',
    countLabelEn: '10 Heroes',
  },

  // 2. Character & Sunnah World
  {
    id: 'manners',
    category: 'akhlaq',
    titleAr: 'مدينة الأخلاق والآداب',
    titleEn: 'Manners & Akhlaq City',
    subtitleAr: '٥٠ خلقاً جميلاً',
    subtitleEn: '50 Beautiful Manners',
    descAr: 'الصدق، الأمانة، بر الوالدين، الكلمة الطيبة، والرفق بالحيوان.',
    descEn: 'Honesty, kindness to parents, gentle speech, patience, and compassion.',
    route: '/manners',
    icon: 'sparkles',
    image: MANNERS_IMG,
    accent: '#D97706',
    bgGradient: ['#FEF3C7', '#FDE68A'],
    countLabelAr: '٥٠ خلقاً',
    countLabelEn: '50 Manners',
  },
  {
    id: 'sunnah',
    category: 'akhlaq',
    titleAr: 'أحاديث نبوية شريفة',
    titleEn: '100 Noble Hadiths',
    subtitleAr: '١٠٠ حديث صحيح للأطفال',
    subtitleEn: '100 Sahih Hadiths for Kids',
    descAr: 'كلمات النبوة الجامعة في الأخلاق والعمل الصالح مع الشرح والأنشطة.',
    descEn: 'Prophetic wisdom with kid-friendly commentary and interactive quizzes.',
    route: '/sunnah',
    icon: 'ribbon',
    image: SUNNAH_IMG,
    accent: '#B45309',
    bgGradient: ['#FFFBEB', '#FEF3C7'],
    countLabelAr: '١٠٠ حديث',
    countLabelEn: '100 Hadiths',
  },

  // 3. Names of Allah World
  {
    id: 'asma-allah',
    category: 'asma',
    titleAr: 'أسماء الله الحسنى',
    titleEn: '99 Beautiful Names of Allah',
    subtitleAr: '٩٩ اسماً مباركاً',
    subtitleEn: '99 Sacred Names',
    descAr: 'تعرف على خالقك الرحيم العليم الحكيم من خلال أسمائه الحسنى كل يوم.',
    descEn: 'Know your loving Creator through His majestic and merciful Names daily.',
    route: '/asma-allah',
    icon: 'diamond',
    image: ASMA_IMG,
    accent: '#6D28D9',
    bgGradient: ['#F5F3FF', '#EDE9FE'],
    countLabelAr: '٩٩ اسماً',
    countLabelEn: '99 Names',
  },

  // 4. Wonder & Universe World
  {
    id: 'tafakkur',
    category: 'wonder',
    titleAr: 'التفكّر في الكون والنفس',
    titleEn: 'Tafakkur & Universe',
    subtitleAr: 'عجائب صنع الله المتقن',
    subtitleEn: 'Wonders of Allah’s Creation',
    descAr: 'تأمل بديع صنع الله في النجوم، الجبال، البحار، والمطر، ودقة خلقه للإنسان.',
    descEn: 'Reflect upon the stars, oceans, mountains, rain, and the marvel of the human body.',
    route: '/tafakkur',
    icon: 'planet',
    image: TAFAKKUR_IMG,
    accent: '#0369A1',
    bgGradient: ['#F0F9FF', '#E0F2FE'],
    countLabelAr: '١٢ تأملاً',
    countLabelEn: '12 Reflections',
  },
  {
    id: 'animals',
    category: 'wonder',
    titleAr: 'حيوانات في القرآن',
    titleEn: 'Animals in the Quran',
    subtitleAr: 'الهدهد، النملة، الحوت وغيرها',
    subtitleEn: 'Hoopoe, Ant, Whale & More',
    descAr: 'قصص وعجائب المخلوقات التي جاء ذكرها في كتاب الله الكريم ودروسها العظيمة.',
    descEn: 'Marvelous creatures mentioned in the Quran and the great lessons they teach us.',
    route: '/animals',
    icon: 'paw',
    image: ANIMALS_IMG,
    accent: '#059669',
    bgGradient: ['#ECFDF5', '#D1FAE5'],
    countLabelAr: '١٠ حيوانات',
    countLabelEn: '10 Animals',
  },
  {
    id: 'nations',
    category: 'wonder',
    titleAr: 'عبر وتاريخ الأمم السابقة',
    titleEn: 'Lessons from Past Nations',
    subtitleAr: 'دروس وعبر تاريخية قرءانية',
    subtitleEn: 'Historical Lessons from Quran',
    descAr: 'أصحاب الجنة، قوم عاد، وقارون، وقصص العبر التاريخية الموجهة للفتيان.',
    descEn: 'Deep reflections on ancient nations mentioned in the Quran for older learners.',
    route: '/nations',
    icon: 'trail-sign',
    image: NATIONS_IMG,
    accent: '#C2410C',
    bgGradient: ['#FFF7ED', '#FFEDD5'],
    ageGate: '9+',
    countLabelAr: 'دروس ٩+',
    countLabelEn: '9+ Years',
  },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const { language, profiles, activeProfileId } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  // Active profile age filter
  const profile = profiles.find((p) => p.id === activeProfileId);
  const isUnder9 = profile?.ageBand === '4-6' || profile?.ageBand === '7-9';

  // Category filter tabs
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stories' | 'akhlaq' | 'asma' | 'wonder'>('all');

  const filteredItems = DISCOVER_ITEMS.filter((item) => {
    // If under 9 and item is 9+ age gated, hide per PRD AGE-2
    if (isUnder9 && item.ageGate === '9+') return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* Header */}
        <Header
          title={isAr ? 'اكتشف عوالم روضة' : 'Discover Rawda Worlds'}
          showBack
          fallbackRoute="/"
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* INTRO HERO BANNER */}
          <View style={styles.heroBanner}>
            <LinearGradient
              colors={['#4338CA', '#3730A3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.heroTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <View style={styles.heroChip}>
                    <Text style={styles.heroChipText}>
                      {isAr ? 'عوالم المعرفة والقدوة 🌟' : 'Worlds of Wisdom & Role Models 🌟'}
                    </Text>
                  </View>
                  <Text style={styles.heroTitle}>
                    {isAr ? 'عالم القصص والحكمة والتفكر' : 'Stories, Wisdom & Wonder'}
                  </Text>
                  <Text style={[styles.heroSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr
                      ? 'اختر عالماً مباركاً لتبدأ رحلتك الشيقة في التعلم وبناء الأخلاق الحسنة'
                      : 'Choose a world to begin your engaging journey of values, history and reflection'}
                  </Text>
                </View>
                <View style={styles.heroIconBadge}>
                  <Image source={DISCOVER_HERO_IMG} style={styles.heroImage} resizeMode="cover" />
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* FILTER CATEGORY PILLS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.filterScroll,
              { flexDirection: isRtl ? 'row-reverse' : 'row' },
            ]}
          >
            {[
              { id: 'all', labelAr: 'الكل 🌟', labelEn: 'All 🌟' },
              { id: 'stories', labelAr: 'القصص والسيرة 📜', labelEn: 'Stories 📜' },
              { id: 'akhlaq', labelAr: 'الأخلاق والسنة 🌸', labelEn: 'Character 🌸' },
              { id: 'asma', labelAr: 'أسماء الله ✨', labelEn: '99 Names ✨' },
              { id: 'wonder', labelAr: 'التفكر والكون 🌍', labelEn: 'Wonder 🌍' },
            ].map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => setSelectedCategory(tab.id as any)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {isAr ? tab.labelAr : tab.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* DISCOVER CARDS LIST */}
          <View style={styles.cardsList}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cardItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={item.bgGradient}
                  style={styles.cardGradient}
                >
                  <View style={[styles.cardTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <View style={[styles.cardIconBox, { borderColor: item.accent }]}>
                      <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                    </View>
                    <View style={styles.cardBadgesRow}>
                      {item.ageGate && (
                        <View style={styles.cardAgeChip}>
                          <Text style={styles.cardAgeChipText}>{item.ageGate}</Text>
                        </View>
                      )}
                      <View style={[styles.cardCountChip, { backgroundColor: item.accent + '22' }]}>
                        <Text style={[styles.cardCountText, { color: item.accent }]}>
                          {isAr ? item.countLabelAr : item.countLabelEn}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.cardTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr ? item.titleAr : item.titleEn}
                  </Text>
                  <Text style={[styles.cardSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr ? item.subtitleAr : item.subtitleEn}
                  </Text>
                  <Text
                    style={[styles.cardDesc, { textAlign: isRtl ? 'right' : 'left' }]}
                    numberOfLines={2}
                  >
                    {isAr ? item.descAr : item.descEn}
                  </Text>

                  <View style={[styles.cardBottomRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <View style={[styles.exploreBtn, { backgroundColor: item.accent }]}>
                      <Text style={styles.exploreBtnText}>
                        {isAr ? 'ابدأ الاستكشاف ←' : 'Start Exploring →'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom 5-Tab Navigation */}
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

  // Hero Banner
  heroBanner: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  heroGradient: {
    padding: SPACING.md,
  },
  heroRow: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  heroTextCol: {
    flex: 1,
  },
  heroChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDE047',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    lineHeight: 18,
  },
  heroIconBadge: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  // Filter Pills
  filterScroll: {
    gap: 8,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#4338CA',
    borderColor: '#4338CA',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Cards List
  cardsList: {
    gap: SPACING.md,
  },
  cardItem: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  cardGradient: {
    padding: SPACING.md,
  },
  cardTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  cardIconBox: {
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
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardAgeChip: {
    backgroundColor: '#C2410C',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  cardAgeChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardCountChip: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  cardCountText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.ink900,
    marginTop: 6,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  cardBottomRow: {
    alignItems: 'center',
  },
  exploreBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
