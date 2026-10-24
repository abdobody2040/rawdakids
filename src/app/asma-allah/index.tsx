// Asma Allah Al-Husna Sanctuary (روضة أسماء الله الحسنى للأطفال)
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  DimensionValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { isRTL } from '@/constants/i18n';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import AsmaDetailModal from '@/components/AsmaDetailModal';
import { ASMA_ALLAH_DATA, AsmaAllahItem } from '@/data/asmaAllahData';
import {
  getUpgradeLabel,
  getLocalizedAsmaAllah,
} from '@/services/multilingualUpgradeService';

const ASMA_WORLD_COVER = require('../../../assets/images/asma-allah-world.jpg');
const ASMA_BADGE_IMG = require('../../../assets/images/asma-allah-badge.jpg');

type TabFilter = 'all' | 'days1to50' | 'days51to99' | 'completed';
type ViewMode = 'grid' | 'card';

export default function AsmaAllahScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isLargeScreen = width >= 1024;
  const { language, addStars, addGems, unlockedBadges, unlockBadge } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayId, setSelectedDayId] = useState<string>('asma-1');
  const [modalItem, setModalItem] = useState<AsmaAllahItem | null>(null);

  const [appliedDays, setAppliedDays] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  // Deterministic daily featured name (PRD §8 - STO-2)
  const [dailyFeaturedItem] = useState(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const todayIndex = dayOfYear % ASMA_ALLAH_DATA.length;
    return ASMA_ALLAH_DATA[todayIndex] || ASMA_ALLAH_DATA[0];
  });
  const isDailyCollected =
    (unlockedBadges || []).includes(dailyFeaturedItem.id) ||
    Boolean(appliedDays[dailyFeaturedItem.id]);

  // Filtered items based on tab & search
  const filteredItems = useMemo(() => {
    return ASMA_ALLAH_DATA.filter((item) => {
      // Tab filter
      if (activeTab === 'days1to50' && item.day > 50) return false;
      if (activeTab === 'days51to99' && item.day <= 50) return false;
      if (activeTab === 'completed' && !appliedDays[item.id] && !(unlockedBadges || []).includes(item.id)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesMeaning = item.meaning.toLowerCase().includes(q);
        const matchesDay = String(item.day) === q;
        return matchesName || matchesMeaning || matchesDay;
      }
      return true;
    });
  }, [activeTab, searchQuery, appliedDays, unlockedBadges]);

  const currentItem = ASMA_ALLAH_DATA.find((i) => i.id === selectedDayId) || ASMA_ALLAH_DATA[0];
  const localizedCurrent = getLocalizedAsmaAllah(currentItem, language);

  const completedCount = useMemo(() => {
    const fromApplied = Object.values(appliedDays).filter(Boolean).length;
    const fromBadges = (unlockedBadges || []).filter((b) => b.startsWith('asma-')).length;
    return Math.max(fromApplied, fromBadges);
  }, [appliedDays, unlockedBadges]);

  const handleCollectDailyCard = () => {
    if (!isDailyCollected) {
      unlockBadge(dailyFeaturedItem.id);
      setAppliedDays((prev) => ({ ...prev, [dailyFeaturedItem.id]: true }));
      addStars(5);
      addGems(2);
      setCelebrationData({
        stars: 5,
        gems: 2,
        title: isAr ? 'أحسنت! أُضيفت البطاقة لرفك 🌟' : 'Added to your shelf! 🌟',
        subtitle: isAr
          ? `جمعت بطاقة «${dailyFeaturedItem.name}» في رفك بصفحة أنا وحديقتي!`
          : `Collected «${dailyFeaturedItem.name}» card to your Me & My Garden shelf!`,
      });
      setShowCelebration(true);
    }
  };

  const handleApplyToggle = (id: string) => {
    const isNowApplied = !appliedDays[id];
    setAppliedDays((prev) => ({ ...prev, [id]: isNowApplied }));
    if (isNowApplied) {
      unlockBadge(id);
      addStars(3);
      addGems(1);
      setCelebrationData({
        stars: 3,
        gems: 1,
        title: getUpgradeLabel('asmaApplyCelebrationTitle', language) || 'أحسنت! عملاً مباركاً',
        subtitle: isAr
          ? 'طبّقت اسم الله اليوم وأضفت بطاقته لرفك المجمع بنجاح!'
          : 'Practiced this divine name and added it to your collectible shelf!',
      });
      setShowCelebration(true);
    }
  };

  const handleQuizAnswer = (id: string, optionIdx: number) => {
    if (quizAnswers[id] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [id]: optionIdx }));
    const targetItem = ASMA_ALLAH_DATA.find((x) => x.id === id) || currentItem;
    const isCorrect = optionIdx === targetItem.correctOptionIndex;
    if (isCorrect) {
      addStars(5);
      addGems(2);
      setCelebrationData({
        stars: 5,
        gems: 2,
        title: getUpgradeLabel('asmaQuizCelebrationTitle', language) || 'إجابة صحيحة وذكية! 🌟',
        subtitle: getUpgradeLabel('asmaQuizCelebrationSubtitle', language) || 'أحسنت فهم اسم الله وربحت 5 نجوم!',
      });
      setShowCelebration(true);
    }
  };

  // Card width depending on viewport
  const cardWidthStyle = useMemo((): { width: DimensionValue } => {
    if (isLargeScreen) return { width: '23.8%' };
    if (isDesktop) return { width: '31.8%' };
    return { width: '48%' };
  }, [isDesktop, isLargeScreen]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={getUpgradeLabel('asmaHubTitle', language) || (isAr ? 'أسماء الله الحسنى' : 'Names of Allah')}
          showBack
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={ASMA_WORLD_COVER} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(23, 17, 43, 0.88)']} style={styles.heroGradient} />
            <View style={styles.heroOverlay}>
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Image source={ASMA_BADGE_IMG} style={styles.heroBadgeImg} />
                <View style={styles.heroTextWrap}>
                  <View style={[styles.progressBadgeRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Text style={styles.progressBadgeText}>
                      {isAr
                        ? `حفظت وطبّقت ${completedCount} من ٩٩ اسمًا`
                        : `Learned ${completedCount} of 99 Names`}
                    </Text>
                  </View>
                  <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('asmaHubTitle', language) || (isAr ? 'روضة أسماء الله الحسنى ٩٩' : '99 Names of Allah')}
                  </Text>
                  <Text style={[styles.heroSubtitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('asmaHubSubtitle', language) || (isAr ? 'تأمّل معاني أسماء الله وعِش بها في يومك لتفوز بالجنة!' : 'Learn Allah’s beautiful names and live by their noble meanings!')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* DAILY FEATURED CARD BANNER (PRD §8 - STO-2) */}
          <View style={styles.dailyFeaturedCard}>
            <LinearGradient
              colors={['#4C1D95', '#5B21B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.dailyFeaturedGradient, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
            >
              <View style={styles.dailyBadgeCircle}>
                <Text style={styles.dailyBadgeEmoji}>{dailyFeaturedItem.cardEmoji}</Text>
              </View>
              <View style={[styles.dailyFeaturedTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                <View style={[styles.dailyFeaturedHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.dailyFeaturedLabel}>
                    {isAr ? '✨ بطاقة اليوم المباركة' : '✨ Daily Featured Card'}
                  </Text>
                  <View style={styles.dailyDayBadge}>
                    <Text style={styles.dailyDayBadgeText}>#{dailyFeaturedItem.day}</Text>
                  </View>
                </View>
                <Text style={styles.dailyFeaturedName}>
                  {dailyFeaturedItem.name}
                </Text>
                <Text style={[styles.dailyFeaturedMeaning, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {dailyFeaturedItem.meaning}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dailyCollectBtn,
                    isDailyCollected && styles.dailyCollectBtnDone,
                    { flexDirection: isRtl ? 'row-reverse' : 'row' },
                  ]}
                  onPress={handleCollectDailyCard}
                  disabled={isDailyCollected}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={isDailyCollected ? 'checkmark-circle' : 'star'}
                    size={16}
                    color={isDailyCollected ? '#10B981' : '#FDE047'}
                  />
                  <Text style={[styles.dailyCollectBtnText, isDailyCollected && { color: '#D1FAE5' }]}>
                    {isDailyCollected
                      ? (isAr ? 'مجموعة برفك بأنا وحديقتي ✅' : 'In your Me shelf ✅')
                      : (isAr ? 'أضف لرف بطاقاتي المجمعة (+5⭐)' : 'Add to my shelf (+5⭐)')}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Search Bar & View Mode Toggle */}
          <View style={styles.controlsRowWrap}>
            <View style={[styles.searchBox, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Ionicons name="search" size={18} color="#8b5cf6" />
              <TextInput
                style={[styles.searchInput, isRtl && { textAlign: 'right' }]}
                placeholder={isAr ? 'ابحث في أسماء الله أو معانيها...' : 'Search names or meanings...'}
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* View Mode Toggle (Grid vs Single Card) */}
            <View style={styles.viewModeToggleGroup}>
              <TouchableOpacity
                style={[styles.viewModeBtn, viewMode === 'grid' && styles.viewModeBtnActive]}
                onPress={() => setViewMode('grid')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="grid"
                  size={18}
                  color={viewMode === 'grid' ? '#ffffff' : '#64748b'}
                />
                <Text style={[styles.viewModeText, viewMode === 'grid' && styles.viewModeTextActive]}>
                  {isAr ? 'الشبكة' : 'Grid'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewModeBtn, viewMode === 'card' && styles.viewModeBtnActive]}
                onPress={() => setViewMode('card')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="card"
                  size={18}
                  color={viewMode === 'card' ? '#ffffff' : '#64748b'}
                />
                <Text style={[styles.viewModeText, viewMode === 'card' && styles.viewModeTextActive]}>
                  {isAr ? 'البطاقة' : 'Card'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tabBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          >
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
                {isAr ? 'الكل (٩٩ اسمًا)' : 'All 99 Names'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'days1to50' && styles.tabBtnActive]}
              onPress={() => setActiveTab('days1to50')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'days1to50' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('asmaTabDays1to50', language) || (isAr ? 'الأيام ١–٥٠' : 'Days 1–50')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'days51to99' && styles.tabBtnActive]}
              onPress={() => setActiveTab('days51to99')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'days51to99' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('asmaTabDays51to99', language) || (isAr ? 'الأيام ٥١–٩٩' : 'Days 51–99')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
              onPress={() => setActiveTab('completed')}
            >
              <View style={[styles.completedPillRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={activeTab === 'completed' ? '#6366f1' : '#10b981'}
                />
                <Text style={[styles.tabBtnText, activeTab === 'completed' && styles.tabBtnTextActive]}>
                  {isAr ? `المكتملة (${completedCount})` : `Done (${completedCount})`}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* MAIN CONTENT AREA */}
          {viewMode === 'grid' ? (
            /* ========================================================
               GRID VIEW: ALL 99 NAMES SHOWN ON BEAUTIFUL INTERACTIVE GRID
               ======================================================== */
            <View style={styles.gridContainer}>
              {filteredItems.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyEmoji}>🔍</Text>
                  <Text style={styles.emptyText}>
                    {isAr ? 'لم نجد اسمًا يطابق بحثك' : 'No names found matching your search'}
                  </Text>
                </View>
              ) : (
                filteredItems.map((item) => {
                  const isDone = appliedDays[item.id];
                  const localized = getLocalizedAsmaAllah(item, language);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.gridCardTouch, cardWidthStyle]}
                      onPress={() => setModalItem(item)}
                      activeOpacity={0.88}
                    >
                      <LinearGradient
                        colors={isDone ? ['#ffffff', '#f5f3ff'] : ['#ffffff', '#fafafa']}
                        style={[
                          styles.gridCard,
                          isDone && styles.gridCardDone,
                        ]}
                      >
                        {/* Top Card Row */}
                        <View style={[styles.gridCardTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                          <View style={styles.gridDayBadge}>
                            <Text style={styles.gridDayNumber}>#{item.day}</Text>
                          </View>

                          <View style={styles.gridCardTopRight}>
                            <Text style={styles.gridCardEmoji}>{item.cardEmoji}</Text>
                            {isDone && (
                              <View style={styles.masteredCheckBadge}>
                                <Ionicons name="checkmark" size={12} color="#ffffff" />
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Divine Name (Large, Bold Arabic Calligraphy) */}
                        <Text style={styles.gridDivineName} numberOfLines={1}>
                          {localized.name}
                        </Text>

                        {/* Brief Kid-Friendly Meaning */}
                        <Text style={styles.gridMeaningText} numberOfLines={2}>
                          {localized.meaning}
                        </Text>

                        {/* Card Footer Action */}
                        <View style={[styles.gridCardFooter, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                          <Text style={styles.gridFooterExplore}>
                            {isAr ? 'اضغط للتعلّم والتطبيق' : 'Tap to explore'}
                          </Text>
                          <Ionicons
                            name={isRtl ? 'arrow-back-circle' : 'arrow-forward-circle'}
                            size={16}
                            color="#8b5cf6"
                          />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          ) : (
            /* ========================================================
               CARD / FOCUS VIEW: HORIZONTAL CHIPS + LARGE DAILY CARD
               ======================================================== */
            <>
              {/* Horizontal Days Selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.daysScroller, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                {filteredItems.map((item) => {
                  const isSelected = item.id === currentItem.id;
                  const isDone = appliedDays[item.id];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.dayChip, isSelected && styles.dayChipActive, isDone && styles.dayChipDone]}
                      onPress={() => setSelectedDayId(item.id)}
                    >
                      <Text style={[styles.dayChipNumber, isSelected && styles.dayChipNumberActive]}>
                        #{item.day}
                      </Text>
                      <Text style={[styles.dayChipName, isSelected && styles.dayChipNameActive]}>
                        {item.name}
                      </Text>
                      {isDone && (
                        <Ionicons name="checkmark-circle" size={14} color="#10b981" style={styles.doneCheck} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Detailed Active Daily Card */}
              <View style={styles.activeCardWrap}>
                <LinearGradient colors={['#ffffff', '#fdfcff']} style={styles.activeCard}>
                  {/* Card Header */}
                  <View style={[styles.cardHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <View style={styles.cardEmojiCircle}>
                      <Text style={styles.cardEmojiText}>{currentItem.cardEmoji}</Text>
                    </View>
                    <View style={styles.cardTitleWrap}>
                      <Text style={[styles.cardDayLabel, isRtl && { textAlign: 'right' }]}>
                        {`${getUpgradeLabel('dayLabel', language) || (isAr ? 'اليوم' : 'Day')} ${currentItem.day}`}
                      </Text>
                      <Text style={[styles.cardNameText, isRtl && { textAlign: 'right' }]}>
                        {localizedCurrent.name}
                      </Text>
                    </View>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>
                        {currentItem.category === 'primary'
                          ? (getUpgradeLabel('categoryQuran', language) || (isAr ? 'قرآن كريم' : 'Quran'))
                          : currentItem.category === 'sunnah'
                          ? (getUpgradeLabel('categorySunnah', language) || (isAr ? 'سنة نبوية' : 'Sunnah'))
                          : (getUpgradeLabel('categoryAttribute', language) || (isAr ? 'صفة جليلة' : 'Divine'))}
                      </Text>
                    </View>
                  </View>

                  {/* Meaning Box */}
                  <View style={styles.meaningBox}>
                    <Text style={[styles.meaningLabel, isRtl && { textAlign: 'right' }]}>
                      {getUpgradeLabel('asmaSimpleMeaning', language) || (isAr ? 'المعنى المبسط' : 'Simple Meaning')}
                    </Text>
                    <Text style={[styles.meaningText, isRtl && { textAlign: 'right' }]}>
                      {localizedCurrent.meaning}
                    </Text>
                  </View>

                  {/* Quran Ayah Reference */}
                  {currentItem.ayah ? (
                    <View style={styles.ayahBox}>
                      <Ionicons name="book-outline" size={18} color="#8b5cf6" />
                      <Text style={[styles.ayahText, isRtl && { textAlign: 'right' }]}>
                        {currentItem.ayah}
                      </Text>
                    </View>
                  ) : null}

                  {/* Story or Educational Example */}
                  {currentItem.story ? (
                    <View style={styles.storyBox}>
                      <Text style={[styles.storyLabel, isRtl && { textAlign: 'right' }]}>
                        {getUpgradeLabel('storyLabel', language) || (isAr ? 'قصة وعبرة' : 'Story & Lesson')}
                      </Text>
                      <Text style={[styles.storyText, isRtl && { textAlign: 'right' }]}>
                        {currentItem.story}
                      </Text>
                    </View>
                  ) : null}

                  {/* Daily Application Challenge */}
                  <View style={styles.applyCard}>
                    <View style={[styles.applyRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <Ionicons name="heart" size={20} color="#ec4899" />
                      <Text style={[styles.applyTitle, isRtl && { textAlign: 'right' }]}>
                        {getUpgradeLabel('asmaDailyApply', language) || (isAr ? 'تطبيق اليوم العملي' : 'Daily Action')}
                      </Text>
                    </View>
                    <Text style={[styles.applyBody, isRtl && { textAlign: 'right' }]}>
                      {localizedCurrent.apply}
                    </Text>
                    <TouchableOpacity
                      style={[styles.applyToggleBtn, appliedDays[currentItem.id] && styles.applyToggleBtnDone]}
                      onPress={() => handleApplyToggle(currentItem.id)}
                    >
                      <Ionicons
                        name={appliedDays[currentItem.id] ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={appliedDays[currentItem.id] ? '#ffffff' : '#6366f1'}
                      />
                      <Text style={[styles.applyToggleText, appliedDays[currentItem.id] && styles.applyToggleTextDone]}>
                        {appliedDays[currentItem.id]
                          ? (getUpgradeLabel('markDone', language) || (isAr ? 'تم التطبيق بنجاح! ⭐' : 'Done! ⭐'))
                          : (getUpgradeLabel('asmaApplyBtn', language) || (isAr ? 'سأطبّقه اليوم (+3 نجوم)' : 'I will apply this (+3 stars)'))}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Quick Quiz */}
                  {currentItem.quizQuestion ? (
                    <View style={styles.quizSection}>
                      <Text style={[styles.quizTitle, isRtl && { textAlign: 'right' }]}>
                        {getUpgradeLabel('takeQuickQuiz', language) || (isAr ? 'سؤال سريع وممتع' : 'Quick Quiz')}
                      </Text>
                      <Text style={[styles.quizQuestionText, isRtl && { textAlign: 'right' }]}>
                        {currentItem.quizQuestion}
                      </Text>
                      <View style={styles.quizOptionsGrid}>
                        {currentItem.quizOptions.map((opt, oIdx) => {
                          const isAnswered = quizAnswers[currentItem.id] !== undefined;
                          const isChosen = quizAnswers[currentItem.id] === oIdx;
                          const isCorrect = oIdx === currentItem.correctOptionIndex;
                          return (
                            <TouchableOpacity
                              key={oIdx}
                              style={[
                                styles.quizOptBtn,
                                isAnswered && isCorrect && styles.quizOptCorrect,
                                isAnswered && isChosen && !isCorrect && styles.quizOptWrong,
                              ]}
                              onPress={() => handleQuizAnswer(currentItem.id, oIdx)}
                              disabled={isAnswered}
                            >
                              <Text
                                style={[
                                  styles.quizOptText,
                                  isAnswered && isCorrect && styles.quizOptTextCorrect,
                                  isAnswered && isChosen && !isCorrect && styles.quizOptTextWrong,
                                ]}
                              >
                                {opt}
                              </Text>
                              {isAnswered && isCorrect && (
                                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </LinearGradient>
              </View>
            </>
          )}
        </ScrollView>

        {/* Modal when tapping any card in the grid */}
        <AsmaDetailModal
          visible={!!modalItem}
          item={modalItem}
          language={language}
          isApplied={modalItem ? !!appliedDays[modalItem.id] : false}
          quizAnswer={modalItem ? quizAnswers[modalItem.id] : undefined}
          onApplyToggle={handleApplyToggle}
          onQuizAnswer={handleQuizAnswer}
          onDismiss={() => setModalItem(null)}
        />

        <AppBottomNav />

        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={celebrationData.stars}
          gemsEarned={celebrationData.gems}
          title={celebrationData.title}
          subtitle={celebrationData.subtitle}
          onDismiss={() => setShowCelebration(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  heroCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    height: 195,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  heroRow: { alignItems: 'center', gap: 12 },
  heroBadgeImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#c084fc',
  },
  heroTextWrap: { flex: 1 },
  progressBadgeRow: { marginBottom: 4 },
  progressBadgeText: {
    backgroundColor: 'rgba(216, 180, 254, 0.25)',
    color: '#f5f3ff',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(216, 180, 254, 0.4)',
    alignSelf: 'flex-start',
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  heroSubtitle: { fontSize: 11, color: '#f3e8ff', marginTop: 3, lineHeight: 16 },

  controlsRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  searchBox: {
    flex: 1,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1e293b',
    height: '100%',
  },
  viewModeToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    borderRadius: RADIUS.xl,
    padding: 3,
    gap: 2,
  },
  viewModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.lg,
  },
  viewModeBtnActive: {
    backgroundColor: '#7c3aed',
    ...SHADOWS.soft,
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  viewModeTextActive: {
    color: '#ffffff',
  },

  // Tab Bar Filters
  tabBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.soft,
  },
  tabBtnActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  completedPillRow: {
    alignItems: 'center',
    gap: 4,
  },

  gridContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  emptyWrap: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  gridCardTouch: {
    marginBottom: 2,
  },
  gridCard: {
    borderRadius: RADIUS.xl,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.soft,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  gridCardDone: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
    borderWidth: 2,
  },
  gridCardTopRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridDayBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  gridDayNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  gridCardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridCardEmoji: {
    fontSize: 16,
  },
  masteredCheckBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridDivineName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e1b4b',
    textAlign: 'center',
    marginVertical: 6,
  },
  gridMeaningText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  gridCardFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
  },
  gridFooterExplore: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8b5cf6',
  },

  daysScroller: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: 10 },
  dayChip: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    minWidth: 72,
    ...SHADOWS.soft,
  },
  dayChipActive: { borderColor: '#8b5cf6', backgroundColor: '#f5f3ff' },
  dayChipDone: { borderColor: '#10b981' },
  dayChipNumber: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  dayChipNumberActive: { color: '#8b5cf6' },
  dayChipName: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginTop: 2 },
  dayChipNameActive: { color: '#6d28d9' },
  doneCheck: { marginTop: 4 },
  activeCardWrap: { marginHorizontal: SPACING.md, marginTop: 4 },
  activeCard: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#e9d5ff',
    ...SHADOWS.medium,
  },
  cardHeaderRow: { alignItems: 'center', gap: 12 },
  cardEmojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmojiText: { fontSize: 24 },
  cardTitleWrap: { flex: 1 },
  cardDayLabel: { fontSize: 12, fontWeight: '700', color: '#8b5cf6' },
  cardNameText: { fontSize: 24, fontWeight: '900', color: '#1e1b4b', marginTop: 2 },
  categoryPill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  categoryPillText: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  meaningBox: {
    marginTop: SPACING.md,
    backgroundColor: '#faf5ff',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  meaningLabel: { fontSize: 12, fontWeight: '700', color: '#8b5cf6', marginBottom: 2 },
  meaningText: { fontSize: 14, color: '#4c1d95', lineHeight: 22 },
  ayahBox: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SPACING.sm,
    backgroundColor: '#f5f3ff',
    padding: 12,
    borderRadius: RADIUS.md,
  },
  ayahText: { fontSize: 13, color: '#6d28d9', fontStyle: 'italic', flex: 1, lineHeight: 18 },
  storyBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fffbeb',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  storyLabel: { fontSize: 12, fontWeight: '700', color: '#b45309', marginBottom: 2 },
  storyText: { fontSize: 13, color: '#78350f', lineHeight: 20 },
  applyCard: {
    marginTop: SPACING.md,
    backgroundColor: '#fdf2f8',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#fbcfe8',
  },
  applyRow: { alignItems: 'center', gap: 6, marginBottom: 4 },
  applyTitle: { fontSize: 13, fontWeight: '800', color: '#db2777' },
  applyBody: { fontSize: 13, color: '#9d174d', lineHeight: 19, marginBottom: 12 },
  applyToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#6366f1',
  },
  applyToggleBtnDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  applyToggleText: { fontSize: 13, fontWeight: '800', color: '#6366f1' },
  applyToggleTextDone: { color: '#ffffff' },
  quizSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  quizTitle: { fontSize: 14, fontWeight: '800', color: '#6366f1', marginBottom: 6 },
  quizQuestionText: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 10 },
  quizOptionsGrid: { gap: 8 },
  quizOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quizOptText: { fontSize: 14, color: '#334155', fontWeight: '600' },
  quizOptCorrect: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: RADIUS.md,
  },
  quizOptTextCorrect: { fontSize: 14, color: '#065f46', fontWeight: '800' },
  quizOptWrong: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: RADIUS.md,
  },
  quizOptTextWrong: { fontSize: 14, color: '#991b1b', fontWeight: '700' },
  // Daily featured card styles
  dailyFeaturedCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  dailyFeaturedGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
  },
  dailyBadgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  dailyBadgeEmoji: {
    fontSize: 32,
  },
  dailyFeaturedTextCol: {
    flex: 1,
  },
  dailyFeaturedHeaderRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  dailyFeaturedLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FDE047',
  },
  dailyDayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  dailyDayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dailyFeaturedName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  dailyFeaturedMeaning: {
    fontSize: 12,
    color: '#EDE9FE',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  dailyCollectBtn: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
  },
  dailyCollectBtnDone: {
    backgroundColor: '#065F46',
    borderColor: '#34D399',
  },
  dailyCollectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
