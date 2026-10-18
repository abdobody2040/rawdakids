// Asma Allah Al-Husna Sanctuary (روضة أسماء الله الحسنى للأطفال)
import { useState } from 'react';
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
import { isRTL } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { ASMA_ALLAH_DATA, AsmaAllahItem } from '@/data/asmaAllahData';
import {
  getUpgradeLabel,
  getLocalizedAsmaAllah,
} from '@/services/multilingualUpgradeService';

const ASMA_WORLD_COVER = require('../../../assets/images/asma-allah-world.jpg');
const ASMA_BADGE_IMG = require('../../../assets/images/asma-allah-badge.jpg');

export default function AsmaAllahScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'days1to30' | 'days31to78' | 'cards'>('days1to30');
  const [selectedDayId, setSelectedDayId] = useState<string>('asma-1');
  const [appliedDays, setAppliedDays] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  // Filter items based on active tab
  const displayedItems = ASMA_ALLAH_DATA.filter(item => {
    if (activeTab === 'days1to30') return item.day <= 30;
    if (activeTab === 'days31to78') return item.day > 30;
    return true; // cards tab shows all
  });

  const currentItem = ASMA_ALLAH_DATA.find(i => i.id === selectedDayId) || ASMA_ALLAH_DATA[0];
  const localizedCurrent = getLocalizedAsmaAllah(currentItem, language);

  const handleApplyToggle = (id: string) => {
    const isNowApplied = !appliedDays[id];
    setAppliedDays(prev => ({ ...prev, [id]: isNowApplied }));
    if (isNowApplied) {
      addStars(3);
      addGems(1);
      setCelebrationData({
        stars: 3,
        gems: 1,
        title: getUpgradeLabel('asmaApplyCelebrationTitle', language),
        subtitle: getUpgradeLabel('asmaApplyCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswers[currentItem.id] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [currentItem.id]: optionIdx }));
    const isCorrect = optionIdx === currentItem.correctOptionIndex;
    if (isCorrect) {
      addStars(5);
      addGems(2);
      setCelebrationData({
        stars: 5,
        gems: 2,
        title: getUpgradeLabel('asmaQuizCelebrationTitle', language),
        subtitle: getUpgradeLabel('asmaQuizCelebrationSubtitle', language),
      });
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Header
          title={getUpgradeLabel('asmaHubTitle', language)}
          showBack
          onBack={() => router.back()}
        />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={ASMA_WORLD_COVER} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(23, 17, 43, 0.85)']} style={styles.heroGradient} />
            <View style={styles.heroOverlay}>
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Image source={ASMA_BADGE_IMG} style={styles.heroBadgeImg} />
                <View style={styles.heroTextWrap}>
                  <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('asmaHubTitle', language)}
                  </Text>
                  <Text style={[styles.heroSubtitle, isRtl && { textAlign: 'right' }]}>
                    {getUpgradeLabel('asmaHubSubtitle', language)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={[styles.tabBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'days1to30' && styles.tabBtnActive]}
              onPress={() => setActiveTab('days1to30')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'days1to30' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('asmaTabDays1to30', language)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'days31to78' && styles.tabBtnActive]}
              onPress={() => setActiveTab('days31to78')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'days31to78' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('asmaTabDays31to78', language)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'cards' && styles.tabBtnActive]}
              onPress={() => setActiveTab('cards')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'cards' && styles.tabBtnTextActive]}>
                {getUpgradeLabel('asmaTabCards', language)}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab !== 'cards' ? (
            <>
              {/* Horizontal Days Selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.daysScroller, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                {displayedItems.map(item => {
                  const isSelected = item.id === currentItem.id;
                  const isDone = appliedDays[item.id];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.dayChip, isSelected && styles.dayChipActive, isDone && styles.dayChipDone]}
                      onPress={() => setSelectedDayId(item.id)}
                    >
                      <Text style={[styles.dayChipNumber, isSelected && styles.dayChipNumberActive]}>
                        {`${getUpgradeLabel('dayLabel', language)} ${item.day}`}
                      </Text>
                      <Text style={[styles.dayChipName, isSelected && styles.dayChipNameActive]}>
                        {item.name}
                      </Text>
                      {isDone && <Ionicons name="checkmark-circle" size={14} color="#10b981" style={styles.doneCheck} />}
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
                        {`${getUpgradeLabel('dayLabel', language)} ${currentItem.day}`}
                      </Text>
                      <Text style={[styles.cardNameText, isRtl && { textAlign: 'right' }]}>
                        {localizedCurrent.name}
                      </Text>
                    </View>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>
                        {currentItem.category === 'primary'
                          ? getUpgradeLabel('categoryQuran', language)
                          : currentItem.category === 'sunnah'
                          ? getUpgradeLabel('categorySunnah', language)
                          : getUpgradeLabel('categoryAttribute', language)}
                      </Text>
                    </View>
                  </View>

                  {/* Meaning Box */}
                  <View style={styles.meaningBox}>
                    <Text style={[styles.meaningLabel, isRtl && { textAlign: 'right' }]}>
                      {getUpgradeLabel('asmaSimpleMeaning', language)}
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
                        {getUpgradeLabel('storyLabel', language)}
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
                        {getUpgradeLabel('asmaDailyApply', language)}
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
                          ? getUpgradeLabel('markDone', language)
                          : getUpgradeLabel('asmaApplyBtn', language)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Quick Quiz */}
                  {currentItem.quizQuestion ? (
                    <View style={styles.quizSection}>
                      <Text style={[styles.quizTitle, isRtl && { textAlign: 'right' }]}>
                        {getUpgradeLabel('takeQuickQuiz', language)}
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
                              onPress={() => handleQuizAnswer(oIdx)}
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
                              {isAnswered && isCorrect && <Ionicons name="checkmark-circle" size={18} color="#10b981" />}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </LinearGradient>
              </View>
            </>
          ) : (
            /* Cards Album Grid */
            <View style={styles.cardsGrid}>
              {ASMA_ALLAH_DATA.map(item => {
                const isEarned = appliedDays[item.id] || quizAnswers[item.id] !== undefined;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.albumCardTouch, !isEarned && styles.albumCardTouchLocked]}
                    onPress={() => {
                      setSelectedDayId(item.id);
                      setActiveTab(item.day <= 30 ? 'days1to30' : 'days31to78');
                    }}
                  >
                    <View style={[styles.albumCard, isEarned ? styles.albumCardEarned : styles.albumCardLocked]}>
                      <Text style={styles.albumCardEmoji}>{item.cardEmoji}</Text>
                      <Text style={styles.albumCardDay}>{`${getUpgradeLabel('dayLabel', language)} ${item.day}`}</Text>
                      <Text style={styles.albumCardName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.albumCardTitle} numberOfLines={1}>{item.cardTitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

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
  badgePill: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  badgePillText: { fontSize: 13, fontWeight: '700', color: '#6366f1' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  heroCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    height: 190,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFill },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  heroRow: { alignItems: 'center', gap: 12 },
  heroBadgeImg: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#fbbf24' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 19, fontWeight: '800', color: '#ffffff' },
  heroSubtitle: { fontSize: 12, color: '#f1f5f9', marginTop: 4, lineHeight: 17 },
  tabBar: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#ede9fe',
    borderRadius: RADIUS.xl,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#ffffff', ...SHADOWS.soft },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabBtnTextActive: { color: '#6366f1', fontWeight: '800' },
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
  meaningLabel: { fontSize: 12, fontWeight: '700', color: '#7e22ce', marginBottom: 4 },
  meaningText: { fontSize: 15, fontWeight: '600', color: '#3b0764', lineHeight: 22 },
  ayahBox: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  ayahText: { flex: 1, fontSize: 13, color: '#475569', fontStyle: 'italic' },
  storyBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fffbeb',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  storyLabel: { fontSize: 13, fontWeight: '800', color: '#b45309', marginBottom: 4 },
  storyText: { fontSize: 14, color: '#78350f', lineHeight: 22 },
  applyCard: {
    marginTop: SPACING.md,
    backgroundColor: '#fdf2f8',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#fbcfe8',
  },
  applyRow: { alignItems: 'center', gap: 6, marginBottom: 6 },
  applyTitle: { fontSize: 14, fontWeight: '800', color: '#be185d' },
  applyBody: { fontSize: 14, color: '#831843', lineHeight: 21, marginBottom: 12 },
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
  applyToggleText: { fontSize: 13, fontWeight: '700', color: '#6366f1' },
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
  cardsGrid: {
    padding: SPACING.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  albumCardTouch: { width: '48%' },
  albumCardTouchLocked: { opacity: 0.7 },
  albumCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  albumCardEarned: { backgroundColor: '#ffffff', borderColor: '#8b5cf6', ...SHADOWS.medium },
  albumCardLocked: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  albumCardEmoji: { fontSize: 32, marginBottom: 4 },
  albumCardDay: { fontSize: 10, fontWeight: '700', color: '#94a3b8' },
  albumCardName: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginTop: 2 },
  albumCardTitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
});
