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

const QURAN_GARDEN_IMG = require('../../../assets/images/quran-garden.jpg');
const NAV_QURAN_IMG = require('../../../assets/images/nav-quran-3d.jpg');

export default function QuranGardenScreen() {
  const router = useRouter();
  const { language, surahProgress } = useAppStore();
  const t = TRANSLATIONS[language];

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

    return (
      <TouchableOpacity
        style={styles.surahCard}
        onPress={() => router.push(`/quran/${item.number}`)}
        activeOpacity={0.8}
      >
        <View style={styles.surahNumberCircle}>
          <Text style={styles.surahNumberText}>{item.number}</Text>
        </View>

        <View style={styles.surahInfoArea}>
          <View style={styles.surahNameRow}>
            <Text style={styles.surahArabicName}>
              {language === 'ar' ? `سورة ${item.nameArabic}` : `Surah ${item.nameTransliteration}`}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {language === 'en' && (
                <Text style={styles.surahArabicSideName}>{item.nameArabic}</Text>
              )}
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.completedBadgeText}>{t.statusMemorized}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.surahMetaRow}>
            <Text style={styles.surahMetaText}>
              {language === 'en' ? `${item.nameEnglish} • ` : ''}
              {item.ayahCount} {t.ayahs} •{' '}
              {item.revelationType === 'Meccan'
                ? language === 'ar'
                  ? 'مكية'
                  : 'Meccan'
                : language === 'ar'
                ? 'مدنية'
                : 'Medinan'}
            </Text>

            {starsEarned > 0 && (
              <View style={styles.starsRow}>
                {[1, 2, 3].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= starsEarned ? 'star' : 'star-outline'}
                    size={14}
                    color={COLORS.starActive}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        <Ionicons
          name={language === 'ar' ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack title={t.quran} />

        {/* Hero Header with 3D Generated Image Background */}
        <View style={styles.heroBannerContainer}>
          <ImageBackground
            source={QURAN_GARDEN_IMG}
            style={styles.heroBannerImage}
            imageStyle={{ borderRadius: RADIUS.xl }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(5, 150, 105, 0.88)', 'rgba(16, 185, 129, 0.94)']}
              style={styles.heroBannerOverlay}
            >
              <View style={styles.heroRow}>
                <View style={styles.heroTextCol}>
                  <Text style={styles.heroTitle}>{t.quran}</Text>
                  <Text style={styles.heroDesc}>{t.quranDesc}</Text>
                </View>
                <View style={styles.hero3dBadgeBox}>
                  <Image
                    source={NAV_QURAN_IMG}
                    style={styles.hero3dBadgeImg}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.memorizeHeroBtn}
                onPress={() => router.push('/quran/repeat')}
                activeOpacity={0.8}
              >
                <Ionicons name="headset" size={20} color={COLORS.primaryDark} />
                <Text style={styles.memorizeHeroBtnText}>{t.memorizationMode}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
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

      {/* Category Tabs */}
      <View style={[styles.tabsRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={[styles.filterTab, selectedTab === 'juz_amma' && styles.filterTabActive]}
          onPress={() => setSelectedTab('juz_amma')}
          activeOpacity={0.75}
        >
          <Ionicons
            name="book"
            size={15}
            color={selectedTab === 'juz_amma' ? '#FFFFFF' : COLORS.text}
          />
          <Text
            style={[
              styles.filterTabText,
              selectedTab === 'juz_amma' && styles.filterTabTextActive,
            ]}
            numberOfLines={1}
          >
            {language === 'ar' ? 'جزء عمَّ' : 'Juz Amma'}
          </Text>
          <View style={[styles.quranCountPill, selectedTab === 'juz_amma' && styles.quranCountPillActive]}>
            <Text style={[styles.quranCountPillText, selectedTab === 'juz_amma' && styles.quranCountPillTextActive]}>
              38
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, selectedTab === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedTab('all')}
          activeOpacity={0.75}
        >
          <Ionicons
            name="library"
            size={15}
            color={selectedTab === 'all' ? '#FFFFFF' : COLORS.text}
          />
          <Text
            style={[
              styles.filterTabText,
              selectedTab === 'all' && styles.filterTabTextActive,
            ]}
            numberOfLines={1}
          >
            {language === 'ar' ? 'كل القرآن' : 'All Quran'}
          </Text>
          <View style={[styles.quranCountPill, selectedTab === 'all' && styles.quranCountPillActive]}>
            <Text style={[styles.quranCountPillText, selectedTab === 'all' && styles.quranCountPillTextActive]}>
              114
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, selectedTab === 'favorites' && styles.filterTabActive]}
          onPress={() => setSelectedTab('favorites')}
          activeOpacity={0.75}
        >
          <Ionicons
            name="heart"
            size={15}
            color={selectedTab === 'favorites' ? '#FFFFFF' : COLORS.text}
          />
          <Text
            style={[
              styles.filterTabText,
              selectedTab === 'favorites' && styles.filterTabTextActive,
            ]}
            numberOfLines={1}
          >
            {language === 'ar' ? 'المختارة' : 'Featured'}
          </Text>
        </TouchableOpacity>
      </View>

        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => String(item.number)}
          renderItem={renderSurahCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  memorizeHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  memorizeHeroBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
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
  surahArabicSideName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
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
