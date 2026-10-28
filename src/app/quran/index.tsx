// Quran Garden: Surahs List (حديقة القرآن - Q1)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { quranService } from '@/services/quranService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import { SurahMeta } from '@/data/quranData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const QURAN_GARDEN_IMG = require('../../../assets/images/quran-garden.jpg');
const NAV_QURAN_IMG = require('../../../assets/images/nav-quran-3d.jpg');

export default function QuranGardenScreen() {
  const router = useRouter();
  const { language, surahProgress, lastReadMushafPage } = useAppStore();
  const t = TRANSLATIONS[language];

  useDocumentTitle(t.quran);

  const [selectedTab, setSelectedTab] = useState<'juz_amma' | 'all' | 'favorites'>('juz_amma');
  const [searchQuery, setSearchQuery] = useState('');

  const surahs =
    selectedTab === 'juz_amma'
      ? quranService.getJuzAmmaSurahs()
      : selectedTab === 'favorites'
      ? quranService.getAllSurahs().filter((s) => [1, 36, 55, 67, 112, 113, 114].includes(s.number))
      : quranService.getAllSurahs();

  const filteredSurahs = surahs.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.nameArabic.includes(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameTransliteration.toLowerCase().includes(q)
    );
  });

  const renderSurahCard = ({ item }: { item: SurahMeta }) => {
    const progress = surahProgress[item.number];
    const isCompleted = progress?.isCompleted;
    const starsEarned = progress?.stars || 0;
    const hasStarted = isCompleted || starsEarned > 0 || (progress?.ayahsStatus && Object.keys(progress.ayahsStatus).length > 0);

    // Status: not started / listened / memorized
    const statusLabel = isCompleted
      ? (language === 'ar' ? 'حفظت' : 'Memorized')
      : hasStarted
      ? (language === 'ar' ? 'استمعت' : 'Listened')
      : (language === 'ar' ? 'لم تبدأ' : 'Not started');

    const statusBg = isCompleted ? '#E1F5EE' : hasStarted ? '#E6F1FB' : '#F1F5F9';
    const statusColor = isCompleted ? '#0F6E56' : hasStarted ? '#185FA5' : '#64748B';

    return (
      <TouchableOpacity
        style={styles.surahCard}
        onPress={() => router.push(`/quran/${item.number}`)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          language === 'ar'
            ? `سورة ${item.nameArabic}، رقم ${item.number}، ${item.ayahCount} آيات، الحالة: ${statusLabel}`
            : `Surah ${item.nameTransliteration}, number ${item.number}, ${item.ayahCount} verses, status: ${statusLabel}`
        }
      >
        <View style={styles.surahNumberCircle}>
          <Text style={styles.surahNumberText}>{item.number}</Text>
        </View>

        <View style={styles.surahInfoArea}>
          <View style={styles.surahNameRow}>
            <Text style={styles.surahArabicName}>
              {language === 'ar' ? `سورة ${item.nameArabic}` : `Surah ${item.nameTransliteration}`}
            </Text>
            {/* State badge: not started / listened / memorized */}
            <View style={[styles.surahStateBadge, { backgroundColor: statusBg }]}>
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : hasStarted ? 'headset' : 'ellipse-outline'}
                size={12}
                color={statusColor}
              />
              <Text style={[styles.surahStateBadgeText, { color: statusColor }]}>
                {statusLabel}
              </Text>
            </View>
          </View>

          <View style={styles.surahMetaRow}>
            <Text style={styles.surahMetaText}>
              {item.ayahCount} {t.ayahs} • {item.revelationType === 'Meccan' ? (language === 'ar' ? 'مكية' : 'Meccan') : (language === 'ar' ? 'مدنية' : 'Medinan')}
            </Text>

            {/* Stars row */}
            <View style={styles.starsRow}>
              {[1, 2, 3].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= starsEarned ? 'star' : 'star-outline'}
                  size={13}
                  color={star <= starsEarned ? '#F5B83D' : '#CBD5E1'}
                />
              ))}
            </View>
          </View>
        </View>

        <Ionicons
          name={language === 'ar' ? 'chevron-back' : 'chevron-forward'}
          size={18}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* Header without duplicate title */}
        <Header showBack title={t.quran} />

        {/* Hero Header Banner */}
        <View style={styles.heroBannerContainer}>
          <ImageBackground
            source={QURAN_GARDEN_IMG}
            style={styles.heroBannerImage}
            imageStyle={{ borderRadius: RADIUS.xl }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(15, 157, 107, 0.92)', 'rgba(11, 122, 83, 0.96)']}
              style={styles.heroBannerOverlay}
            >
              <View style={styles.heroRow}>
                <View style={styles.heroTextCol}>
                  <Text style={styles.heroDesc}>
                    {language === 'ar' ? 'بستان القرآن العظيم • استمع واحفظ وتدبر' : 'Listen, memorize & reflect on the noble Quran'}
                  </Text>
                </View>
                <View style={styles.hero3dBadgeBox}>
                  <Image
                    source={NAV_QURAN_IMG}
                    style={styles.hero3dBadgeImg}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Action Buttons: 1 Repeat Button + 1 Mushaf Button (Single entry, 1 line each) */}
              <View style={[styles.heroActionsRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={styles.memorizeHeroBtn}
                  onPress={() => router.push('/quran/repeat')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="headset" size={16} color="#0F6E56" />
                  <Text style={styles.memorizeHeroBtnText}>
                    {language === 'ar' ? 'استمع وردد' : 'Listen & Repeat'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mushafHeroBtn}
                  onPress={() => router.push('/quran/mushaf')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="book" size={16} color="#92400E" />
                  <Text style={styles.mushafHeroBtnText}>
                    {language === 'ar' ? `المصحف (ص ${lastReadMushafPage || 1}) 📖` : `Mushaf (p. ${lastReadMushafPage || 1}) 📖`}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Search Input (Single clean search bar) */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'ar' ? 'ابحث عن سورة...' : 'Search surah...'}
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Short Filter Labels: الكل / جزء عمّ / المفضلة */}
        <View
          style={[styles.tabsRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}
          role="tablist"
          aria-label={language === 'ar' ? 'تبويبات تصفية السور' : 'Surah filters'}
        >
          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedTab('all')}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === 'all' }}
            accessibilityLabel={language === 'ar' ? 'كل السور' : 'All surahs'}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedTab === 'all' && styles.filterTabTextActive,
              ]}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'juz_amma' && styles.filterTabActive]}
            onPress={() => setSelectedTab('juz_amma')}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === 'juz_amma' }}
            accessibilityLabel={language === 'ar' ? 'جزء عمّ' : 'Juz Amma'}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedTab === 'juz_amma' && styles.filterTabTextActive,
              ]}
            >
              {language === 'ar' ? 'جزء عمّ' : 'Juz Amma'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'favorites' && styles.filterTabActive]}
            onPress={() => setSelectedTab('favorites')}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === 'favorites' }}
            accessibilityLabel={language === 'ar' ? 'السور المفضلة' : 'Favorite surahs'}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedTab === 'favorites' && styles.filterTabTextActive,
              ]}
            >
              {language === 'ar' ? 'المفضلة' : 'Favorites'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Suggested Surah Card */}
        <TouchableOpacity
          style={styles.suggestedSurahCard}
          onPress={() => router.push('/quran/112')}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={
            language === 'ar'
              ? 'سورة اليوم المقترحة: سورة الإخلاص، 4 آيات'
              : "Today's suggested surah: Surah Al-Ikhlas, 4 verses"
          }
        >
          <View style={[styles.suggestedSurahInner, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
            <View style={styles.suggestedIconBox}>
              <Ionicons name="sparkles" size={20} color="#D97706" />
            </View>
            <View style={[styles.suggestedTextCol, { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.suggestedBadgeTitle}>
                {language === 'ar' ? 'سورة اليوم المقترحة' : "Today's suggested surah"}
              </Text>
              <Text style={styles.suggestedSurahName}>
                {language === 'ar' ? 'سورة الإخلاص (4 آيات)' : 'Surah Al-Ikhlas (4 verses)'}
              </Text>
            </View>
            <View style={styles.suggestedStartBtn}>
              <Text style={styles.suggestedStartBtnText}>
                {language === 'ar' ? 'ابدأ' : 'Start'}
              </Text>
              <Ionicons
                name={language === 'ar' ? 'chevron-back' : 'chevron-forward'}
                size={14}
                color="#0F6E56"
              />
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => String(item.number)}
          renderItem={renderSurahCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          role="main"
          aria-label={t.quran}
        />

        <AppBottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  heroBannerContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroBannerImage: {
    width: '100%',
  },
  heroBannerOverlay: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  hero3dBadgeBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a7f3d0',
    backgroundColor: '#ecfdf5',
    ...SHADOWS.soft,
  },
  hero3dBadgeImg: {
    width: '100%',
    height: '100%',
  },
  heroTextCol: {
    flex: 1,
    marginBottom: SPACING.xs,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  heroActionsRow: {
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  memorizeHeroBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: SPACING.sm,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  memorizeHeroBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  mushafHeroBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: SPACING.sm,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    ...SHADOWS.soft,
  },
  mushafHeroBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400E',
  },
  mushafFeatureCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    ...SHADOWS.medium,
  },
  mushafFeatureCardGradient: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  mushafIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  mushafFeatureInfo: {
    flex: 1,
  },
  mushafFeatureTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#78350F',
  },
  mushafFeatureSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
    gap: SPACING.md,
  },
  surahNumberCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.quranGarden.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.quranGarden.primary,
  },
  surahNumberText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.quranGarden.dark,
  },
  surahInfoArea: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surahArabicName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  surahStateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  surahStateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  suggestedSurahCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 12,
    ...SHADOWS.soft,
  },
  suggestedSurahInner: {
    alignItems: 'center',
    gap: 10,
  },
  suggestedIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedTextCol: {
    flex: 1,
  },
  suggestedBadgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  suggestedSurahName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
    marginTop: 2,
  },
  suggestedStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  suggestedStartBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F6E56',
  },
  surahMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  surahMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: COLORS.quranGarden.primary,
    borderColor: COLORS.quranGarden.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  quranCountPill: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  quranCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  quranCountPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  quranCountPillTextActive: {
    color: '#FFFFFF',
  },
});
