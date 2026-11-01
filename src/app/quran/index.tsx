import { formatAyahsCount } from '@/utils/arabicCount';
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
  Modal,
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
  const { language, surahProgress, lastReadMushafPage, activeProfileId, profiles } = useAppStore();
  const t = TRANSLATIONS[language];

  useDocumentTitle(t.quran);

  const activeProfile = profiles?.find((p) => p.id === activeProfileId) || profiles?.[0];
  const ageBand = activeProfile?.ageBand || '7-9';
  const isSenior = ageBand === '10-13';

  const [selectedTab, setSelectedTab] = useState<'juz_amma' | 'all' | 'favorites'>(
    isSenior ? 'all' : 'juz_amma'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedModalSurah, setLockedModalSurah] = useState<SurahMeta | null>(null);

  const baseSurahs =
    selectedTab === 'juz_amma'
      ? quranService.getJuzAmmaSurahs()
      : selectedTab === 'favorites'
      ? quranService.getAllSurahs().filter((s) => [1, 36, 55, 67, 112, 113, 114].includes(s.number))
      : quranService.getAllSurahs();

  // Searching checks the complete 114 catalog so kids always find their surah
  const searchPool = searchQuery.trim().length > 0 ? quranService.getAllSurahs() : baseSurahs;

  const filteredSurahs = searchPool.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.nameArabic.includes(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameTransliteration.toLowerCase().includes(q) ||
      String(s.number) === q
    );
  });

  const renderSurahCard = ({ item }: { item: SurahMeta }) => {
    const progress = surahProgress[item.number];
    const isCompleted = progress?.isCompleted;
    const starsEarned = progress?.stars || 0;
    const hasStarted = isCompleted || starsEarned > 0 || (progress?.ayahsStatus && Object.keys(progress.ayahsStatus).length > 0);

    // Is this surah locked for this age band?
    // In PRD: 10-13 has all 114 unlocked. 4-6 & 7-9 focus on Juz Amma (1 & 78-114).
    const isLockedForChild = !isSenior && item.number > 1 && item.number < 78;

    // Status: not started / listened / memorized / locked
    const statusLabel = isLockedForChild
      ? (language === 'ar' ? 'تُفتح لاحقًا' : 'Unlocks later')
      : isCompleted
      ? (language === 'ar' ? 'حفظت' : 'Memorized')
      : hasStarted
      ? (language === 'ar' ? 'استمعت' : 'Listened')
      : (language === 'ar' ? 'لم تبدأ' : 'Not started');

    const statusBg = isLockedForChild ? '#FEF3C7' : isCompleted ? '#E1F5EE' : hasStarted ? '#E6F1FB' : '#F1F5F9';
    const statusColor = isLockedForChild ? '#B45309' : isCompleted ? '#0F6E56' : hasStarted ? '#185FA5' : '#64748B';

    const handlePress = () => {
      if (isLockedForChild) {
        setLockedModalSurah(item);
      } else {
        router.push(`/quran/${item.number}`);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.surahCard, isLockedForChild && styles.surahCardLocked]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          language === 'ar'
            ? `سورة ${item.nameArabic}، رقم ${item.number}، ${item.ayahCount} آيات، الحالة: ${statusLabel}`
            : `Surah ${item.nameTransliteration}, number ${item.number}, ${item.ayahCount} verses, status: ${statusLabel}`
        }
      >
        <View style={[styles.surahNumberCircle, isLockedForChild && styles.surahNumberCircleLocked]}>
          <Text style={[styles.surahNumberText, isLockedForChild && styles.surahNumberTextLocked]}>
            {item.number}
          </Text>
        </View>

        <View style={styles.surahInfoArea}>
          <View style={styles.surahNameRow}>
            <Text style={[styles.surahArabicName, isLockedForChild && styles.surahArabicNameLocked]}>
              {language === 'ar' ? `سورة ${item.nameArabic}` : `Surah ${item.nameTransliteration}`}
            </Text>
            {/* State badge: not started / listened / memorized / locked */}
            <View style={[styles.surahStateBadge, { backgroundColor: statusBg }]}>
              <Ionicons
                name={isLockedForChild ? 'lock-closed' : isCompleted ? 'checkmark-circle' : hasStarted ? 'headset' : 'ellipse-outline'}
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
              {formatAyahsCount(item.ayahCount, language === 'ar')} • {item.revelationType === 'Meccan' ? (language === 'ar' ? 'مكية' : 'Meccan') : (language === 'ar' ? 'مدنية' : 'Medinan')}
            </Text>

            {/* Stars row */}
            {!isLockedForChild && (
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
            )}
          </View>
        </View>

        <Ionicons
          name={isLockedForChild ? 'lock-closed-outline' : language === 'ar' ? 'chevron-back' : 'chevron-forward'}
          size={18}
          color={isLockedForChild ? '#D97706' : COLORS.textMuted}
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

        {/* Filter Labels: جزء عمّ / كل السور / المفضلة */}
        <View
          style={[styles.tabsRow, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}
          role="tablist"
          aria-label={language === 'ar' ? 'تبويبات تصفية السور' : 'Surah filters'}
        >
          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'juz_amma' && styles.filterTabActive]}
            onPress={() => setSelectedTab('juz_amma')}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === 'juz_amma' }}
            accessibilityLabel={language === 'ar' ? 'سور جزء عمّ (٣٨ سورة)' : 'Juz Amma (38 surahs)'}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedTab === 'juz_amma' && styles.filterTabTextActive,
              ]}
            >
              {language === 'ar' ? 'سور جزء عمّ' : 'Juz Amma'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedTab('all')}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === 'all' }}
            accessibilityLabel={language === 'ar' ? 'كل السور (١١٤ سورة)' : 'All surahs (114)'}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedTab === 'all' && styles.filterTabTextActive,
              ]}
            >
              {language === 'ar' ? (isSenior ? 'كل السور (١١٤)' : 'كل السور') : (isSenior ? 'All (114)' : 'All')}
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
                {language === 'ar' ? `سورة الإخلاص (${formatAyahsCount(4, true)})` : 'Surah Al-Ikhlas (4 verses)'}
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
          contentContainerStyle={[styles.listContent, filteredSurahs.length === 0 && styles.listContentEmpty]}
          showsVerticalScrollIndicator={false}
          role="main"
          aria-label={t.quran}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={38} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>
                {language === 'ar' ? 'لم نعثر على سورة مطابقة' : 'No surahs found'}
              </Text>
              <Text style={styles.emptySub}>
                {language === 'ar'
                  ? 'تأكد من كتابة اسم السورة بشكل صحيح مثل: الفاتحة، الإخلاص، أو البقرة'
                  : 'Check the spelling or try searching for Al-Fatihah, Al-Ikhlas, or Al-Baqarah'}
              </Text>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.emptyResetBtn}
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="مسح البحث"
                >
                  <Text style={styles.emptyResetBtnText}>
                    {language === 'ar' ? 'مسح البحث وعرض كل السور' : 'Clear search'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        <AppBottomNav />

        {/* Locked Surah Modal for 4-6 / 7-9 */}
        <Modal
          visible={!!lockedModalSurah}
          transparent
          animationType="fade"
          onRequestClose={() => setLockedModalSurah(null)}
        >
          <View style={styles.lockedModalOverlay}>
            <View style={styles.lockedModalCard}>
              <View style={styles.lockedIconBox}>
                <Ionicons name="lock-closed" size={32} color="#D97706" />
              </View>
              <Text style={styles.lockedModalTitle}>
                {language === 'ar'
                  ? `سورة ${lockedModalSurah?.nameArabic} المباركة`
                  : `Surah ${lockedModalSurah?.nameTransliteration}`}
              </Text>
              <Text style={styles.lockedModalMessage}>
                {language === 'ar'
                  ? 'هذه السورة تُفتح لاحقًا لأبطالنا في المستوى المتقدم (١٠-١٣ سنة). ابدأ بإتقان وحفظ سور جزء عمّ أولاً يا بطل! 🌟'
                  : 'This surah unlocks later in the advanced level (10-13 years). Master and memorize Juz Amma surahs first! 🌟'}
              </Text>
              <TouchableOpacity
                style={styles.lockedModalCloseBtn}
                onPress={() => setLockedModalSurah(null)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="حسناً فهمت"
              >
                <Text style={styles.lockedModalCloseBtnText}>
                  {language === 'ar' ? 'حَسَنًا، فَهِمْتُ 👍' : 'Got it! 👍'}
                </Text>
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
    paddingBottom: 110,
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
  surahCardLocked: {
    opacity: 0.85,
    backgroundColor: '#FAFAFA',
    borderColor: '#FDE68A',
  },
  surahNumberCircleLocked: {
    backgroundColor: '#FEF3C7',
  },
  surahNumberTextLocked: {
    color: '#D97706',
  },
  surahArabicNameLocked: {
    color: '#78350F',
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: SPACING.md,
  },
  emptyResetBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyResetBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  lockedModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  lockedModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    maxWidth: 380,
    width: '100%',
    ...SHADOWS.medium,
  },
  lockedIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  lockedModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedModalMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  lockedModalCloseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: '100%',
  },
  lockedModalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
