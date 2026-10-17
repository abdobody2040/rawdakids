// Animals in the Quran and Sunnah Hub (حديقة الحيوان في القرآن والسنة)
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, isRTL } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { audioService } from '@/services/audioService';
import { getAyahAudioUrl } from '@/data/quranData';
import {
  ANIMAL_MIRACLE_STORIES,
  ANIMAL_KINDNESS_HADITHS,
  ANIMAL_KINDNESS_SCENARIOS,
  QURAN_ANIMALS_CATALOG,
  GUESS_ANIMAL_ROUNDS,
  AnimalMiracleStory,
  QuranAnimalItem,
} from '@/data/animalsData';

type AnimalHubTab = 'miracles' | 'sunnah' | 'cards' | 'game';

export default function AnimalsHubScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { language, addStars, addGems, unlockSticker, unlockedStickers } = useAppStore();
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const initialTab: AnimalHubTab = (params.tab as AnimalHubTab) || 'miracles';
  const [activeTab, setActiveTab] = useState<AnimalHubTab>(initialTab);

  // Guessing game state
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedGuessId, setSelectedGuessId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [isPlayingAyahAudio, setIsPlayingAyahAudio] = useState(false);

  // Kindness scenario state
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ stars: 5, gems: 2, title: '', subtitle: '' });

  // Selected animal card modal/drawer state
  const [selectedCard, setSelectedCard] = useState<QuranAnimalItem | null>(null);

  const activeRound = GUESS_ANIMAL_ROUNDS[currentRoundIdx] || GUESS_ANIMAL_ROUNDS[0];

  const handlePlayAyah = (surahNum: number, ayahNum: number) => {
    if (isPlayingAyahAudio) {
      audioService.stop();
      setIsPlayingAyahAudio(false);
      return;
    }
    const audioUrl = getAyahAudioUrl('Alafasy_128kbps', surahNum, ayahNum);
    setIsPlayingAyahAudio(true);
    audioService.playAyah(audioUrl, 1.0, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAyahAudio(false);
      }
    });
  };

  const handleSelectGuess = (animalId: string) => {
    if (isAnswered) return;
    setSelectedGuessId(animalId);
    setIsAnswered(true);

    if (animalId === activeRound.correctAnimalId) {
      setGameScore((prev) => prev + 1);
      addStars(5);
      addGems(2);
      const matchedAnimal = QURAN_ANIMALS_CATALOG.find((a) => a.id === animalId);
      if (matchedAnimal) {
        unlockSticker(matchedAnimal.stickerId);
      }
    }
  };

  const handleNextRound = () => {
    audioService.stop();
    setIsPlayingAyahAudio(false);
    setSelectedGuessId(null);
    setIsAnswered(false);
    if (currentRoundIdx < GUESS_ANIMAL_ROUNDS.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      setCelebrationData({
        stars: 15,
        gems: 5,
        title: isAr ? 'أحسنت يا بطل الحيوانات!' : 'Masha’Allah Animal Champion!',
        subtitle: isAr ? 'أتممت لعبة تخمين حيوانات القرآن بنجاح!' : 'You mastered the Quran Animals Guessing Game!',
      });
      setShowCelebration(true);
      setCurrentRoundIdx(0);
    }
  };

  const handleKindnessChoice = (scenarioId: string, optId: string, isKind: boolean, stars: number, gems: number) => {
    setScenarioAnswers((prev) => ({ ...prev, [scenarioId]: optId }));
    if (isKind) {
      addStars(stars);
      addGems(gems);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack fallbackRoute="/" title={isAr ? 'حديقة الحيوان في القرآن' : 'Animals in the Quran'} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <LinearGradient
              colors={['#047857', '#065F46']}
              style={styles.heroGradient}
            >
              <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.heroTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <View style={styles.heroBadgePill}>
                    <Text style={styles.heroBadgeText}>
                      {isAr ? '🐾 عالم المخلوقات والآيات' : '🐾 World of Wonders & Signs'}
                    </Text>
                  </View>
                  <Text style={styles.heroTitle}>
                    {isAr ? 'حديقة الحيوان في القرآن' : 'Animals in the Quran'}
                  </Text>
                  <Text style={[styles.heroSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr
                      ? 'اكتشف معجزات الأنبياء مع الحيوانات، وهدي النبي ﷺ في الرحمة والرفق بكل كائن حي!'
                      : 'Explore prophetic miracles with animals, and the Prophet’s guidance on kindness to all living beings!'}
                  </Text>
                </View>
                <View style={styles.heroEmojiCluster}>
                  <Text style={{ fontSize: 36 }}>🕊️</Text>
                  <Text style={{ fontSize: 28, marginTop: -8 }}>🐍</Text>
                </View>
              </View>

              {/* 4-Hub Navigation Switcher */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.navTabsScroll, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                <TouchableOpacity
                  style={[styles.hubTabBtn, activeTab === 'miracles' && styles.hubTabBtnActive]}
                  onPress={() => setActiveTab('miracles')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hubTabIcon}>🕊️</Text>
                  <Text style={[styles.hubTabBtnText, activeTab === 'miracles' && styles.hubTabBtnTextActive]}>
                    {isAr ? 'معجزات الأنبياء' : 'Miracles'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.hubTabBtn, activeTab === 'sunnah' && styles.hubTabBtnActive]}
                  onPress={() => setActiveTab('sunnah')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hubTabIcon}>🌿</Text>
                  <Text style={[styles.hubTabBtnText, activeTab === 'sunnah' && styles.hubTabBtnTextActive]}>
                    {isAr ? 'الرفق بالحيوان' : 'Kindness in Sunnah'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.hubTabBtn, activeTab === 'cards' && styles.hubTabBtnActive]}
                  onPress={() => setActiveTab('cards')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hubTabIcon}>📚</Text>
                  <Text style={[styles.hubTabBtnText, activeTab === 'cards' && styles.hubTabBtnTextActive]}>
                    {isAr ? '١٦ حيواناً بالقرآن' : '16 Quran Animals'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.hubTabBtn, activeTab === 'game' && styles.hubTabBtnActive]}
                  onPress={() => setActiveTab('game')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hubTabIcon}>🎮</Text>
                  <Text style={[styles.hubTabBtnText, activeTab === 'game' && styles.hubTabBtnTextActive]}>
                    {isAr ? 'خمّن الحيوان' : 'Guessing Game'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </View>

          {/* TAB 1: MIRACLES STORIES */}
          {activeTab === 'miracles' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="sparkles" size={18} color="#D97706" />
                <Text style={styles.sectionHeaderTitle}>
                  {isAr ? 'قصص معجزات الحيوان مع الأنبياء' : 'Prophetic Miracles with Animals'}
                </Text>
              </View>

              <View style={styles.storiesGrid}>
                {ANIMAL_MIRACLE_STORIES.map((story) => (
                  <TouchableOpacity
                    key={story.id}
                    style={styles.storyCard}
                    onPress={() => router.push({ pathname: '/animals/[storyId]' as any, params: { storyId: story.id } })}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.storyCardHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <View style={[styles.storyEmojiBox, { backgroundColor: story.themeColor + '18' }]}>
                        <Text style={{ fontSize: 32 }}>{story.animalEmoji}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                        <View style={[styles.agePill, { backgroundColor: story.themeColor + '20' }]}>
                          <Text style={[styles.agePillText, { color: story.themeColor }]}>
                            {isAr ? `سن ${story.minAge}+` : `Age ${story.minAge}+`}
                          </Text>
                        </View>
                        <Text style={[styles.storyProphetName, { textAlign: isRtl ? 'right' : 'left' }]}>
                          {isAr ? story.prophetNameAr : story.prophetNameEn}
                        </Text>
                        <Text style={[styles.storyTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                          {isAr ? story.titleAr : story.titleEn}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[styles.storySummaryText, { textAlign: isRtl ? 'right' : 'left' }]}
                      numberOfLines={2}
                    >
                      {isAr ? story.shortSummaryYoungAr : story.shortSummaryYoungEn}
                    </Text>

                    <View style={[styles.storyFooterRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <View style={styles.rewardTag}>
                        <Ionicons name="star" size={13} color="#F59E0B" />
                        <Text style={styles.rewardTagText}>+10 {t.stars}</Text>
                      </View>
                      <View style={[styles.exploreBtn, { backgroundColor: story.themeColor }]}>
                        <Text style={styles.exploreBtnText}>
                          {isAr ? 'اقرأ القصة والتحدي' : 'Read & Explore'}
                        </Text>
                        <Ionicons
                          name={isRtl ? 'arrow-back' : 'arrow-forward'}
                          size={13}
                          color="#FFFFFF"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* TAB 2: ANIMAL KINDNESS IN SUNNAH */}
          {activeTab === 'sunnah' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="heart" size={18} color="#059669" />
                <Text style={styles.sectionHeaderTitle}>
                  {isAr ? 'الرحمة بالحيوان في السنة النبوية الشريفة' : 'Kindness to Animals in the Sunnah'}
                </Text>
              </View>

              {/* Hadiths Cards */}
              {ANIMAL_KINDNESS_HADITHS.map((hadith) => (
                <View key={hadith.id} style={styles.hadithCard}>
                  <View style={[styles.hadithHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Text style={{ fontSize: 28 }}>{hadith.badgeEmoji}</Text>
                    <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                      <Text style={[styles.hadithTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                        {isAr ? hadith.titleAr : hadith.titleEn}
                      </Text>
                      <Text style={styles.hadithSourceBadge}>
                        {hadith.source}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.hadithTextBody, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr ? hadith.textAr : hadith.textEn}
                  </Text>

                  <View style={[styles.hadithLessonBox, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="leaf" size={16} color="#059669" />
                    <Text style={[styles.hadithLessonText, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {isAr ? hadith.lessonAr : hadith.lessonEn}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Interactive Help the Animal Scenarios */}
              <View style={{ marginTop: SPACING.md }}>
                <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="hand-left" size={18} color="#D97706" />
                  <Text style={styles.sectionHeaderTitle}>
                    {isAr ? 'لعبة: ساعد الحيوان واكسب الحسنات 🐾' : 'Activity: Help the Animal 🐾'}
                  </Text>
                </View>

                {ANIMAL_KINDNESS_SCENARIOS.map((scen) => {
                  const selectedOptId = scenarioAnswers[scen.id];

                  return (
                    <View key={scen.id} style={styles.scenarioCard}>
                      <View style={[styles.scenarioHead, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                        <Text style={{ fontSize: 24 }}>{scen.animalEmoji}</Text>
                        <Text style={[styles.scenarioTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                          {isAr ? scen.titleAr : scen.titleEn}
                        </Text>
                      </View>

                      <Text style={[styles.scenarioSitText, { textAlign: isRtl ? 'right' : 'left' }]}>
                        {isAr ? scen.situationAr : scen.situationEn}
                      </Text>

                      <View style={styles.optionsCol}>
                        {scen.options.map((opt) => {
                          const isChosen = selectedOptId === opt.id;

                          return (
                            <TouchableOpacity
                              key={opt.id}
                              style={[
                                styles.scenOptionBtn,
                                isChosen && (opt.isKindChoice ? styles.scenOptionCorrect : styles.scenOptionWrong),
                              ]}
                              onPress={() => handleKindnessChoice(scen.id, opt.id, opt.isKindChoice, opt.rewardStars, opt.rewardGems)}
                              disabled={selectedOptId !== undefined}
                              activeOpacity={0.8}
                            >
                              <Text
                                style={[
                                  styles.scenOptionText,
                                  isChosen && { fontWeight: '700' },
                                  { textAlign: isRtl ? 'right' : 'left' },
                                ]}
                              >
                                {isAr ? opt.textAr : opt.textEn}
                              </Text>
                              {isChosen && opt.isKindChoice && (
                                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {selectedOptId && (
                        <View style={styles.feedbackBox}>
                          <Text style={[styles.feedbackText, { textAlign: isRtl ? 'right' : 'left' }]}>
                            {scen.options.find((o) => o.id === selectedOptId)?.isKindChoice
                              ? `🌟 ${isAr ? scen.options.find((o) => o.id === selectedOptId)?.feedbackAr : scen.options.find((o) => o.id === selectedOptId)?.feedbackEn}`
                              : `💡 ${isAr ? scen.options.find((o) => o.id === selectedOptId)?.feedbackAr : scen.options.find((o) => o.id === selectedOptId)?.feedbackEn}`}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 3: 16 QURANIC ANIMAL CARDS */}
          {activeTab === 'cards' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="book" size={18} color="#0284C7" />
                <Text style={styles.sectionHeaderTitle}>
                  {isAr ? 'فهرس الـ ١٦ حيواناً المذكورة في القرآن الكريم' : '16 Animals Mentioned in the Quran'}
                </Text>
              </View>

              <View style={styles.cardsGrid}>
                {QURAN_ANIMALS_CATALOG.map((item) => {
                  const isStickerUnlocked = unlockedStickers.includes(item.stickerId);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.catalogCard, { borderColor: item.themeColor + '40' }]}
                      onPress={() => setSelectedCard(item)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.catalogTopRow}>
                        <Text style={{ fontSize: 36 }}>{item.emoji}</Text>
                        {isStickerUnlocked && (
                          <View style={styles.stickerBadgePill}>
                            <Ionicons name="sparkles" size={10} color="#D97706" />
                            <Text style={styles.stickerBadgeText}>
                              {isAr ? 'ملصق مفتوح' : 'Unlocked'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.catalogName, { textAlign: isRtl ? 'right' : 'left' }]}>
                        {isAr ? item.nameAr : item.nameEn}
                      </Text>
                      <Text style={[styles.catalogSurah, { textAlign: isRtl ? 'right' : 'left' }]}>
                        {isAr ? item.surahNameAr : item.surahNameEn}
                      </Text>
                      <Text
                        style={[styles.catalogClue, { textAlign: isRtl ? 'right' : 'left' }]}
                        numberOfLines={2}
                      >
                        {isAr ? item.clueAr : item.clueEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Card Detail Popup Box */}
              {selectedCard && (
                <View style={styles.detailCardOverlay}>
                  <View style={styles.detailCardBox}>
                    <View style={styles.detailCardHeader}>
                      <Text style={{ fontSize: 44 }}>{selectedCard.emoji}</Text>
                      <TouchableOpacity
                        style={styles.closeCardBtn}
                        onPress={() => {
                          audioService.stop();
                          setIsPlayingAyahAudio(false);
                          setSelectedCard(null);
                        }}
                      >
                        <Ionicons name="close-circle" size={26} color="#6B7280" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.detailCardTitle}>
                      {isAr ? selectedCard.nameAr : selectedCard.nameEn}
                    </Text>
                    <Text style={styles.detailCardSurahTag}>
                      {isAr ? `${selectedCard.surahNameAr} [آية ${selectedCard.ayahNumber}]` : `${selectedCard.surahNameEn} [Ayah ${selectedCard.ayahNumber}]`}
                    </Text>

                    {/* Quranic Ayah Box with Clean Audio */}
                    <View style={styles.detailAyahBox}>
                      <Text style={styles.detailAyahText}>
                        «{selectedCard.ayahText}»
                      </Text>

                      <TouchableOpacity
                        style={[styles.listenAyahBtn, isPlayingAyahAudio && styles.listenAyahBtnActive]}
                        onPress={() => handlePlayAyah(selectedCard.surahNumber, selectedCard.ayahNumber)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isPlayingAyahAudio ? 'stop-circle' : 'volume-high'}
                          size={18}
                          color="#FFFFFF"
                        />
                        <Text style={styles.listenAyahBtnText}>
                          {isPlayingAyahAudio
                            ? (isAr ? 'إيقاف التلاوة' : 'Stop Audio')
                            : (isAr ? '🔊 استمع للآية بصوت القارئ' : '🔊 Listen to Ayah')}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailFactBox}>
                      <Text style={styles.detailFactTitle}>
                        {isAr ? '💡 حقيقة مدهشة:' : '💡 Amazing Fact:'}
                      </Text>
                      <Text style={[styles.detailFactText, { textAlign: isRtl ? 'right' : 'left' }]}>
                        {isAr ? selectedCard.factAr : selectedCard.factEn}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* TAB 4: GUESS THE ANIMAL GAME */}
          {activeTab === 'game' && (
            <View style={styles.tabContent}>
              <View style={[styles.gameScoreHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.scorePill}>
                  <Ionicons name="trophy" size={15} color="#F59E0B" />
                  <Text style={styles.scorePillText}>
                    {isAr ? `نقاط الفوز: ${gameScore}` : `Score: ${gameScore}`}
                  </Text>
                </View>
                <Text style={styles.gameRoundCounter}>
                  {isAr
                    ? `جولة ${currentRoundIdx + 1} من ${GUESS_ANIMAL_ROUNDS.length}`
                    : `Round ${currentRoundIdx + 1} of ${GUESS_ANIMAL_ROUNDS.length}`}
                </Text>
              </View>

              {/* Game Question Card */}
              <View style={styles.gameCard}>
                <View style={styles.gameQuestionSilhouetteBox}>
                  <Text style={{ fontSize: 56 }}>
                    {isAnswered ? QURAN_ANIMALS_CATALOG.find((a) => a.id === activeRound.correctAnimalId)?.emoji : '❓🐾'}
                  </Text>
                </View>

                <Text style={[styles.gameQuestionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? activeRound.questionAr : activeRound.questionEn}
                </Text>

                <View style={styles.soundClueBox}>
                  <Ionicons name="musical-notes" size={16} color="#0284C7" />
                  <Text style={[styles.soundClueText, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr ? activeRound.soundHintAr : activeRound.soundHintEn}
                  </Text>
                </View>

                {/* 4 Animal Choices */}
                <View style={styles.gameOptionsGrid}>
                  {activeRound.optionsAnimalIds.map((anId) => {
                    const animal = QURAN_ANIMALS_CATALOG.find((a) => a.id === anId);
                    if (!animal) return null;

                    const isThisSelected = selectedGuessId === anId;
                    const isCorrect = anId === activeRound.correctAnimalId;

                    return (
                      <TouchableOpacity
                        key={anId}
                        style={[
                          styles.gameOptionBtn,
                          isAnswered && isCorrect && styles.gameOptionCorrect,
                          isAnswered && isThisSelected && !isCorrect && styles.gameOptionWrong,
                        ]}
                        onPress={() => handleSelectGuess(anId)}
                        disabled={isAnswered}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontSize: 30 }}>{animal.emoji}</Text>
                        <Text style={styles.gameOptionName}>
                          {isAr ? animal.nameAr : animal.nameEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Reveal Quranic Ayah Box */}
                {isAnswered && (
                  <View style={styles.revealAyahBox}>
                    <View style={styles.revealAyahBadge}>
                      <Ionicons name="sparkles" size={14} color="#D97706" />
                      <Text style={styles.revealAyahBadgeText}>
                        {selectedGuessId === activeRound.correctAnimalId
                          ? (isAr ? 'إجابة صحيحة وممتازة! 🎉' : 'Correct Answer! 🎉')
                          : (isAr ? 'اقتربت! الجواب الصحيح هو:' : 'Almost! The correct animal is:')}
                      </Text>
                    </View>

                    {(() => {
                      const correctAnimal = QURAN_ANIMALS_CATALOG.find((a) => a.id === activeRound.correctAnimalId);
                      if (!correctAnimal) return null;

                      return (
                        <>
                          <Text style={styles.revealAyahVerse}>
                            «{correctAnimal.ayahText}»
                          </Text>
                          <Text style={styles.revealAyahRef}>
                            {isAr ? correctAnimal.surahNameAr : correctAnimal.surahNameEn} [آية {correctAnimal.ayahNumber}]
                          </Text>

                          <TouchableOpacity
                            style={[styles.listenAyahBtn, isPlayingAyahAudio && styles.listenAyahBtnActive]}
                            onPress={() => handlePlayAyah(correctAnimal.surahNumber, correctAnimal.ayahNumber)}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name={isPlayingAyahAudio ? 'stop-circle' : 'volume-high'}
                              size={16}
                              color="#FFFFFF"
                            />
                            <Text style={styles.listenAyahBtnText}>
                              {isPlayingAyahAudio
                                ? (isAr ? 'إيقاف التلاوة' : 'Stop Audio')
                                : (isAr ? '🔊 استمع للآية بصوت القارئ' : '🔊 Listen to Ayah')}
                            </Text>
                          </TouchableOpacity>
                        </>
                      );
                    })()}

                    <TouchableOpacity
                      style={styles.nextRoundBtn}
                      onPress={handleNextRound}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.nextRoundBtnText}>
                        {currentRoundIdx === GUESS_ANIMAL_ROUNDS.length - 1
                          ? (isAr ? 'أنهِ التحدي واحصل على الجائزة 🌟' : 'Finish Challenge 🌟')
                          : (isAr ? 'الجولة التالية ➔' : 'Next Round ➔')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Celebration Modal */}
        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={celebrationData.stars}
          gemsEarned={celebrationData.gems}
          title={celebrationData.title}
          subtitle={celebrationData.subtitle}
          onDismiss={() => setShowCelebration(false)}
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
    maxWidth: 680,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  heroBanner: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroGradient: {
    padding: SPACING.lg,
  },
  heroRow: {
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  heroTextCol: {
    flex: 1,
  },
  heroBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D1FAE5',
    lineHeight: 18,
  },
  heroEmojiCluster: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  navTabsScroll: {
    gap: 8,
    paddingTop: 4,
  },
  hubTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  hubTabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  hubTabIcon: {
    fontSize: 14,
  },
  hubTabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hubTabBtnTextActive: {
    color: '#065F46',
  },
  tabContent: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitleRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
  },
  storiesGrid: {
    gap: SPACING.md,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  storyCardHeader: {
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  storyEmojiBox: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  agePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  storyProphetName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  storySummaryText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginVertical: SPACING.sm,
  },
  storyFooterRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rewardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  rewardTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hadithCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  hadithHeaderRow: {
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  hadithTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  hadithSourceBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: 2,
  },
  hadithTextBody: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    backgroundColor: '#F9FAFB',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  hadithLessonBox: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  hadithLessonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    flex: 1,
  },
  scenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: SPACING.md,
  },
  scenarioHead: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  scenarioSitText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  optionsCol: {
    gap: 8,
  },
  scenOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    borderRadius: RADIUS.md,
  },
  scenOptionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  scenOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  scenOptionText: {
    fontSize: 12,
    color: '#1F2937',
    flex: 1,
  },
  feedbackBox: {
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  catalogCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    ...SHADOWS.soft,
    marginBottom: 6,
  },
  catalogTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  stickerBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  stickerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  catalogName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  catalogSurah: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
    marginBottom: 4,
  },
  catalogClue: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  detailCardOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    zIndex: 99,
  },
  detailCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 440,
    ...SHADOWS.strong,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeCardBtn: {
    padding: 4,
  },
  detailCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  detailCardSurahTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  detailAyahBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  detailAyahText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  listenAyahBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  listenAyahBtnActive: {
    backgroundColor: '#DC2626',
  },
  listenAyahBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailFactBox: {
    backgroundColor: '#F9FAFB',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  detailFactTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 2,
  },
  detailFactText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  gameScoreHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  scorePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  gameRoundCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.medium,
  },
  gameQuestionSilhouetteBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
  },
  gameQuestionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  soundClueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: 8,
    borderRadius: RADIUS.md,
    gap: 6,
    marginBottom: SPACING.md,
  },
  soundClueText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600',
    flex: 1,
  },
  gameOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  gameOptionBtn: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  gameOptionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  gameOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  gameOptionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  revealAyahBox: {
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  revealAyahBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  revealAyahBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#854D0E',
  },
  revealAyahVerse: {
    fontSize: 13,
    fontWeight: '700',
    color: '#713F12',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  revealAyahRef: {
    fontSize: 11,
    color: '#A16207',
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  nextRoundBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: RADIUS.full,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  nextRoundBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
