// Smart Search Modal for Noor Kids (البحث الذكي والشامل عبر كل محتويات التطبيق)
import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { ALL_114_SURAHS_CATALOG, SurahMeta } from '@/data/quranData';
import { hadithService } from '@/services/hadithService';
import { DUAS_DATA } from '@/data/duasData';
import { PROPHETS_STORIES } from '@/data/storiesData';
import { EXPANDED_MANNERS_50 } from '@/data/mannersData50';

export type SearchCategory =
  | 'all'
  | 'quran'
  | 'sunnah'
  | 'duas'
  | 'prophets'
  | 'manners'
  | 'arkan';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  categoryLabelAr: string;
  categoryLabelEn: string;
  categoryColor: string;
  categoryIcon: keyof typeof Ionicons.glyphMap;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  route: string;
  keywords: string[];
}

// Arabic text normalizer (removes diacritics and unifies letters)
function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove Tashkeel (Fathah, Dammah, Kasrah, Sukun, etc.)
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim();
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  initialCategory?: SearchCategory;
}

export default function SmartSearchModal({
  visible,
  onDismiss,
  initialCategory = 'all',
}: Props) {
  const router = useRouter();
  const { language } = useAppStore();
  const isAr = language === 'ar';

  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(initialCategory);

  // Pre-index items once
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Quran Surahs (114 Surahs)
    ALL_114_SURAHS_CATALOG.forEach((s: SurahMeta) => {
      items.push({
        id: `quran-${s.number}`,
        category: 'quran',
        categoryLabelAr: 'القرآن الكريم',
        categoryLabelEn: 'Holy Quran',
        categoryColor: '#059669',
        categoryIcon: 'book',
        titleAr: `سورة ${s.nameArabic}`,
        titleEn: `Surah ${s.nameTransliteration}`,
        subtitleAr: `${s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • ${s.ayahCount} آيات • جزء ${s.juzNumber}`,
        subtitleEn: `${s.revelationType} • ${s.ayahCount} Verses • Juz ${s.juzNumber}`,
        route: `/quran/${s.number}`,
        keywords: [s.nameArabic, s.nameTransliteration, s.nameEnglish, `سورة ${s.nameArabic}`, `surah ${s.number}`],
      });
    });

    // 2. Stories of the Prophets (25 Prophets)
    PROPHETS_STORIES.forEach((p) => {
      items.push({
        id: `prophet-${p.id}`,
        category: 'prophets',
        categoryLabelAr: 'قصص الأنبياء',
        categoryLabelEn: 'Prophets',
        categoryColor: '#7C3AED',
        categoryIcon: 'trail-sign',
        titleAr: `نبي الله ${p.nameAr} (${p.honorificAr})`,
        titleEn: `Prophet ${p.nameEn}`,
        subtitleAr: `${p.titleBadgeAr} • ${p.scenes.length} محطات تفاعلية`,
        subtitleEn: `${p.titleBadgeEn} • ${p.scenes.length} Scenes`,
        route: `/prophets/${p.id}`,
        keywords: [p.nameAr, p.nameEn, p.titleBadgeAr, p.titleBadgeEn, p.eraAr, p.locationAr],
      });
    });

    // 3. Sunnah Hadiths (100 Hadiths)
    const hadiths = hadithService.getAll();
    hadiths.forEach((h) => {
      items.push({
        id: `hadith-${h.id}`,
        category: 'sunnah',
        categoryLabelAr: 'الحديث الشريف',
        categoryLabelEn: 'Hadith',
        categoryColor: '#B45309',
        categoryIcon: 'ribbon',
        titleAr: h.titleAr,
        titleEn: h.titleEn,
        subtitleAr: `«${h.arabicText.slice(0, 55)}...»`,
        subtitleEn: h.explanationEn.slice(0, 60),
        route: `/sunnah/${h.id}`,
        keywords: [h.titleAr, h.titleEn, h.theme, h.arabicText, h.explanationAr, h.grade],
      });
    });

    // 4. Daily Duas & Azkar (50 Duas)
    DUAS_DATA.forEach((d) => {
      items.push({
        id: `dua-${d.id}`,
        category: 'duas',
        categoryLabelAr: 'حصن المسلم الصغير',
        categoryLabelEn: 'Duas & Azkar',
        categoryColor: '#E11D48',
        categoryIcon: 'heart',
        titleAr: d.titleAr,
        titleEn: d.titleEn,
        subtitleAr: `«${d.arabicText.slice(0, 55)}...»`,
        subtitleEn: d.translationEn.slice(0, 60),
        route: '/sunnah/duas',
        keywords: [d.titleAr, d.titleEn, d.arabicText, d.whenToSayAr, d.category],
      });
    });

    // 5. Good Manners Town (50 Moral landmarks)
    EXPANDED_MANNERS_50.forEach((m) => {
      items.push({
        id: `manner-${m.id}`,
        category: 'manners',
        categoryLabelAr: 'بلدة الأخلاق',
        categoryLabelEn: 'Good Manners',
        categoryColor: '#0D9488',
        categoryIcon: 'sparkles',
        titleAr: m.nameAr,
        titleEn: m.nameEn,
        subtitleAr: m.subtitleAr,
        subtitleEn: m.subtitleEn,
        route: '/manners',
        keywords: [m.nameAr, m.nameEn, m.subtitleAr, m.weeklyPledgeAr],
      });
    });

    // 6. Pillars, Prayer & Wudu Academies
    items.push({
      id: 'feature-wudu',
      category: 'arkan',
      categoryLabelAr: 'الأركان والوضوء',
      categoryLabelEn: 'Wudu Guide',
      categoryColor: '#0284C7',
      categoryIcon: 'water',
      titleAr: 'تعلّم الوضوء الطهور خطوة بخطوة',
      titleEn: 'Step-by-Step Wudu Learning & Simulator',
      subtitleAr: 'محاكي الوضوء (٨ خطوات وسُنن وأدعية طهور)',
      subtitleEn: '8 Interactive Steps, Sunnahs & Duas',
      route: '/arkan/salah?mode=wudu',
      keywords: ['وضوء', 'الوضوء', 'طهور', 'طهارة', 'wudu', 'ablution'],
    });

    items.push({
      id: 'feature-salah',
      category: 'arkan',
      categoryLabelAr: 'الأركان والوضوء',
      categoryLabelEn: 'Prayer Guide',
      categoryColor: '#0369A1',
      categoryIcon: 'shield-checkmark',
      titleAr: 'محاكي الصلاة التفاعلي',
      titleEn: 'Interactive Prayer Simulator',
      subtitleAr: 'تعلّم كيف تصلي من تكبيرة الإحرام إلى التسليم',
      subtitleEn: 'Learn Prayer Step-by-Step from Takbeer to Tasleem',
      route: '/arkan/salah',
      keywords: ['صلاة', 'الصلاة', 'سجود', 'ركوع', 'salah', 'prayer'],
    });

    items.push({
      id: 'feature-tasbih',
      category: 'sunnah',
      categoryLabelAr: 'المسبحة والأذكار',
      categoryLabelEn: 'Tasbih Counter',
      categoryColor: '#0D9488',
      categoryIcon: 'finger-print',
      titleAr: 'مسبحة الأذكار التفاعلية للأطفال',
      titleEn: 'Interactive Kids 3D Tasbih Counter',
      subtitleAr: 'تسبيح، تحميد، تكبير، والصلاة على النبي ﷺ',
      subtitleEn: 'SubhanAllah, Alhamdulillah, Allahu Akbar & Salawat',
      route: '/sunnah/tasbih',
      keywords: ['مسبحة', 'تسبيح', 'سبحان الله', 'الحمد لله', 'الله اكبر', 'tasbih'],
    });

    items.push({
      id: 'feature-adhkar',
      category: 'sunnah',
      categoryLabelAr: 'أذكار الصباح والمساء',
      categoryLabelEn: 'Morning & Evening Adhkar',
      categoryColor: '#F59E0B',
      categoryIcon: 'sunny',
      titleAr: 'أذكار الصباح والمساء المباركة للأطفال',
      titleEn: 'Morning & Evening Daily Adhkar',
      subtitleAr: 'حصن المسلم الصغير، آية الكرسي، المعوذات، وسيد الاستغفار',
      subtitleEn: 'Ayat al-Kursi, Muawwidhat, Sayyid al-Istighfar with Audio',
      route: '/sunnah/adhkar',
      keywords: ['اذكار', 'أذكار', 'صباح', 'مساء', 'الصباح', 'المساء', 'استغفار', 'كرسي', 'حصن المسلم', 'adhkar', 'morning', 'evening'],
    });

    items.push({
      id: 'feature-arkan',
      category: 'arkan',
      categoryLabelAr: 'أكاديمية الأركان',
      categoryLabelEn: 'Pillars Academy',
      categoryColor: '#D97706',
      categoryIcon: 'home',
      titleAr: 'أركان الإسلام وأركان الإيمان',
      titleEn: 'Pillars of Islam and Faith',
      subtitleAr: '١١ ركناً مباركاً وشروحات تفاعلية للأطفال',
      subtitleEn: '11 Pillars with Interactive Quizzes',
      route: '/arkan',
      keywords: ['اركان', 'أركان', 'اسلام', 'ايمان', 'pillars', 'faith'],
    });

    return items;
  }, []);

  // Filtered search results
  const searchResults: SearchResultItem[] = useMemo(() => {
    const cleanQ = normalizeArabicText(query);

    return allSearchableItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (!cleanQ) return true;

      // Match query against keywords, title, subtitle
      const titleMatch = normalizeArabicText(item.titleAr).includes(cleanQ) ||
        item.titleEn.toLowerCase().includes(cleanQ);
      const subMatch = normalizeArabicText(item.subtitleAr).includes(cleanQ) ||
        item.subtitleEn.toLowerCase().includes(cleanQ);
      const kwMatch = item.keywords.some((kw) =>
        normalizeArabicText(kw).includes(cleanQ) || kw.toLowerCase().includes(cleanQ)
      );

      return titleMatch || subMatch || kwMatch;
    });
  }, [allSearchableItems, query, selectedCategory]);

  const handleSelectResult = (route: string) => {
    onDismiss();
    router.push(route as Parameters<typeof router.push>[0]);
  };

  const categoriesList: { id: SearchCategory; labelAr: string; labelEn: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: 'grid' },
    { id: 'quran', labelAr: 'القرآن', labelEn: 'Quran', icon: 'book' },
    { id: 'sunnah', labelAr: 'الأحاديث', labelEn: 'Hadiths', icon: 'ribbon' },
    { id: 'duas', labelAr: 'الأدعية', labelEn: 'Duas', icon: 'heart' },
    { id: 'prophets', labelAr: 'الأنبياء', labelEn: 'Prophets', icon: 'trail-sign' },
    { id: 'manners', labelAr: 'الأخلاق', labelEn: 'Manners', icon: 'sparkles' },
    { id: 'arkan', labelAr: 'الأركان والوضوء', labelEn: 'Pillars', icon: 'water' },
  ];

  const quickSuggestionKeywords = [
    { labelAr: 'أذكار الصباح والمساء', labelEn: 'Adhkar', query: 'أذكار' },
    { labelAr: 'مسبحة الأذكار', labelEn: 'Tasbih', query: 'مسبحة' },
    { labelAr: 'الفاتحة', labelEn: 'Al-Fatihah', query: 'الفاتحة' },
    { labelAr: 'الكهف', labelEn: 'Al-Kahf', query: 'الكهف' },
    { labelAr: 'دعاء النوم', labelEn: 'Sleep Dua', query: 'النوم' },
    { labelAr: 'نبي الله يوسف', labelEn: 'Prophet Yusuf', query: 'يوسف' },
    { labelAr: 'الوضوء الطهور', labelEn: 'Wudu', query: 'وضوء' },
    { labelAr: 'الصدق والأمانة', labelEn: 'Honesty', query: 'الصدق' },
    { labelAr: 'مسبحة الأذكار', labelEn: 'Tasbih', query: 'مسبحة' },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.searchModalCard}>
          {/* Top Search Input Bar */}
          <View style={[styles.searchInputRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <Ionicons name="search" size={22} color="#059669" />

            <TextInput
              style={[styles.searchInput, { textAlign: isAr ? 'right' : 'left' }]}
              value={query}
              onChangeText={setQuery}
              placeholder={
                isAr
                  ? 'ابحث في السور، الأحاديث، الأنبياء، الأدعية، والأخلاق...'
                  : 'Search Surahs, Hadiths, Prophets, Duas & Manners...'
              }
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
            />

            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                style={styles.clearBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onDismiss}
              style={styles.cancelBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>{isAr ? 'إلغاء' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <View style={styles.categoriesBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.categoriesScroll,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={14}
                      color={isSelected ? '#FFFFFF' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextActive,
                      ]}
                    >
                      {isAr ? cat.labelAr : cat.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Quick Suggestions (when query is empty) */}
          {query.trim().length === 0 && (
            <View style={styles.suggestionsWrapper}>
              <Text style={[styles.suggestionsLabel, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? '💡 مقترحات سريعة للبحث:' : '💡 Quick Suggestions:'}
              </Text>
              <View style={[styles.suggestionsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                {quickSuggestionKeywords.map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestionBadge}
                    onPress={() => setQuery(s.query)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.suggestionBadgeText}>
                      {isAr ? s.labelAr : s.labelEn}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Results Count Bar */}
          <View style={[styles.resultsHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <Text style={styles.resultsCountText}>
              {isAr
                ? `${searchResults.length} نتيجة مطابقة`
                : `${searchResults.length} results found`}
            </Text>
          </View>

          {/* Results List */}
          <ScrollView
            contentContainerStyle={styles.resultsListScroll}
            showsVerticalScrollIndicator={false}
          >
            {searchResults.length === 0 ? (
              <View style={styles.emptyResultsBox}>
                <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>
                  {isAr ? 'لم نجد نتائج مطابقة' : 'No matching results'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {isAr
                    ? 'جرب البحث بكلمة أخرى مثل: الفاتحة، الصبر، يوسف، الوضوء...'
                    : 'Try searching for something else like: Fatihah, Patience, Wudu...'}
                </Text>
              </View>
            ) : (
              searchResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItemCard}
                  onPress={() => handleSelectResult(item.route)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.resultItemRow,
                      { flexDirection: isAr ? 'row-reverse' : 'row' },
                    ]}
                  >
                    {/* Category Icon Badge */}
                    <View
                      style={[
                        styles.resultIconCircle,
                        { backgroundColor: item.categoryColor + '18' },
                      ]}
                    >
                      <Ionicons
                        name={item.categoryIcon}
                        size={20}
                        color={item.categoryColor}
                      />
                    </View>

                    {/* Texts */}
                    <View
                      style={[
                        styles.resultTextCol,
                        { alignItems: isAr ? 'flex-end' : 'flex-start' },
                      ]}
                    >
                      <View
                        style={[
                          styles.resultCategoryPill,
                          {
                            backgroundColor: item.categoryColor + '15',
                            borderColor: item.categoryColor + '40',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.resultCategoryPillText,
                            { color: item.categoryColor },
                          ]}
                        >
                          {isAr ? item.categoryLabelAr : item.categoryLabelEn}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.resultTitle,
                          { textAlign: isAr ? 'right' : 'left' },
                        ]}
                      >
                        {isAr ? item.titleAr : item.titleEn}
                      </Text>

                      <Text
                        style={[
                          styles.resultSubtitle,
                          { textAlign: isAr ? 'right' : 'left' },
                        ]}
                        numberOfLines={1}
                      >
                        {isAr ? item.subtitleAr : item.subtitleEn}
                      </Text>
                    </View>

                    {/* Navigation Arrow */}
                    <Ionicons
                      name={isAr ? 'chevron-back' : 'chevron-forward'}
                      size={18}
                      color="#94A3B8"
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  searchModalCard: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  searchInputRow: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 6,
  },
  clearBtn: {
    padding: 4,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  categoriesBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  suggestionsWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 4,
    backgroundColor: '#FFFEFA',
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
  },
  suggestionsRow: {
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  suggestionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  resultsHeaderRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultsCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  resultsListScroll: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  emptyResultsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
  resultItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  resultItemRow: {
    alignItems: 'center',
    gap: 12,
  },
  resultIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTextCol: {
    flex: 1,
    gap: 3,
  },
  resultCategoryPill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  resultCategoryPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  resultSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
