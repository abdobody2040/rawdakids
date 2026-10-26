// Animals in the Quran and Sunnah Hub (حديقة الحيوان في القرآن والسنة)
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
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
  QuranAnimalItem,
} from "@/data/animalsData";
import {
  getAnimalsHubLabel,
  getLocalizedAnimalStoryMeta,
} from '@/services/multilingualAnimalsService';

const ANIMALS_WORLD_COVER = require('../../../assets/images/animals-world.jpg');
const STORY_IMAGES: Record<string, any> = {
  'sulayman-ant': require('../../../assets/images/scene-ant-sulayman.jpg'),
  'sulayman-hoopoe': require('../../../assets/images/scene-hoopoe-message.jpg'),
  'salih-camel': require('../../../assets/images/scene-she-camel-rock.jpg'),
  'yunus-whale': require('../../../assets/images/scene-whale-sea.jpg'),
  'kahf-dog': require('../../../assets/images/scene-cave-dog.jpg'),
  'ibrahim-birds': require('../../../assets/images/scene-ibrahim-birds.jpg'),
  'bani-israel-cow': require('../../../assets/images/scene-yellow-cow.jpg'),
  'fil-ababil': require('../../../assets/images/scene-ababil-elephant.jpg'),
  'isa-bird': require('../../../assets/images/scene-isa-bird.jpg'),
  'musa-staff': require('../../../assets/images/scene-musa-staff.jpg'),
  'ismail-ram': require('../../../assets/images/scene-ram-sacrifice.jpg'),
  'qabil-crow': require('../../../assets/images/scene-qabil-crow.jpg'),
};

const ANIMAL_CATALOG_IMAGES: Record<string, any> = {
  'ant': require('../../../assets/images/scene-ant-sulayman.jpg'),
  'hoopoe': require('../../../assets/images/scene-hoopoe-message.jpg'),
  'she-camel': require('../../../assets/images/scene-she-camel-rock.jpg'),
  'whale': require('../../../assets/images/scene-whale-sea.jpg'),
  'dog': require('../../../assets/images/scene-cave-dog.jpg'),
  'cow': require('../../../assets/images/scene-yellow-cow.jpg'),
  'elephant': require('../../../assets/images/scene-ababil-elephant.jpg'),
  'bee': require('../../../assets/images/animal-bee-3d.jpg'),
  'crow': require('../../../assets/images/scene-qabil-crow.jpg'),
  'four-birds': require('../../../assets/images/scene-ibrahim-birds.jpg'),
  'isa-bird': require('../../../assets/images/scene-isa-bird.jpg'),
  'serpent': require('../../../assets/images/scene-musa-staff.jpg'),
  'ram': require('../../../assets/images/scene-ram-sacrifice.jpg'),
  'wolf': require('../../../assets/images/animal-wolf-3d.jpg'),
  'spider': require('../../../assets/images/scene-thawr-cave.jpg'),
  'camel': require('../../../assets/images/sticker-camel.jpg'),
  'horse': require('../../../assets/images/avatar-horse.jpg'),
  'mule': require('../../../assets/images/prophets-caravan.jpg'),
  'donkey': require('../../../assets/images/hero-oasis.jpg'),
  'lion': require('../../../assets/images/avatar-falcon.jpg'),
  'fly': require('../../../assets/images/story-gentle-nature.jpg'),
  'mosquito': require('../../../assets/images/manner-cleanliness.jpg'),
  'sheep': require('../../../assets/images/seerah-sheep.jpg'),
  'goat': require('../../../assets/images/seerah-sheep.jpg'),
  'locust': require('../../../assets/images/nation-garden.jpg'),
  'lice': require('../../../assets/images/hero-oasis.jpg'),
  'frog': require('../../../assets/images/quran-garden.jpg'),
  'quail': require('../../../assets/images/comp-nughayr-bird.jpg'),
  'ababil': require('../../../assets/images/scene-ababil-elephant.jpg'),
  'termite': require('../../../assets/images/scene-sulayman-crystal.jpg'),
  'calf': require('../../../assets/images/scene-yellow-cow.jpg'),
  'monkey': require('../../../assets/images/animals-badge-3d.jpg'),
};

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
        <Header showBack fallbackRoute="/" title={getAnimalsHubLabel('hubTitle', language)} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner with 3D Background */}
          <View style={styles.heroBanner}>
            <ImageBackground
              source={ANIMALS_WORLD_COVER}
              style={styles.heroBackground}
              imageStyle={{ borderRadius: RADIUS.xl }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(6, 78, 59, 0.72)', 'rgba(4, 120, 87, 0.92)']}
                style={styles.heroGradient}
              >
                <View style={[styles.heroRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.heroTextCol, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                    <View style={styles.heroBadgePill}>
                      <Text style={styles.heroBadgeText}>
                        {getAnimalsHubLabel('hubBadge', language)}
                      </Text>
                    </View>
                    <Text style={styles.heroTitle}>
                      {getAnimalsHubLabel('hubTitle', language)}
                    </Text>
                    <Text style={[styles.heroSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {getAnimalsHubLabel('hubSubtitle', language)}
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
                      {getAnimalsHubLabel('tabMiracles', language)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.hubTabBtn, activeTab === 'sunnah' && styles.hubTabBtnActive]}
                    onPress={() => setActiveTab('sunnah')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hubTabIcon}>🌿</Text>
                    <Text style={[styles.hubTabBtnText, activeTab === 'sunnah' && styles.hubTabBtnTextActive]}>
                      {getAnimalsHubLabel('tabSunnah', language)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.hubTabBtn, activeTab === 'cards' && styles.hubTabBtnActive]}
                    onPress={() => setActiveTab('cards')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hubTabIcon}>📚</Text>
                    <Text style={[styles.hubTabBtnText, activeTab === 'cards' && styles.hubTabBtnTextActive]}>
                      {getAnimalsHubLabel('tabCards', language)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.hubTabBtn, activeTab === 'game' && styles.hubTabBtnActive]}
                    onPress={() => setActiveTab('game')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hubTabIcon}>🎮</Text>
                    <Text style={[styles.hubTabBtnText, activeTab === 'game' && styles.hubTabBtnTextActive]}>
                      {getAnimalsHubLabel('tabGame', language)}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* TAB 1: MIRACLES STORIES */}
          {activeTab === 'miracles' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="sparkles" size={18} color="#D97706" />
                <Text style={styles.sectionHeaderTitle}>
                  {getAnimalsHubLabel('miraclesSectionTitle', language)}
                </Text>
              </View>

              <View style={styles.storiesGrid}>
                {ANIMAL_MIRACLE_STORIES.map((story) => {
                  const storyMeta = getLocalizedAnimalStoryMeta(story.id, language);
                  const storyTitle = storyMeta ? storyMeta.title : (isAr ? story.titleAr : story.titleEn);
                  const prophetName = storyMeta ? storyMeta.prophetName : (isAr ? story.prophetNameAr : story.prophetNameEn);
                  const summaryText = storyMeta ? storyMeta.summaryYoung : (isAr ? story.shortSummaryYoungAr : story.shortSummaryYoungEn);

                  return (
                    <TouchableOpacity
                      key={story.id}
                      style={styles.storyCard}
                      onPress={() => router.push({ pathname: '/animals/[storyId]' as any, params: { storyId: story.id } })}
                      activeOpacity={0.85}
                    >
                      {/* 3D Story Image Cover Thumbnail */}
                      {STORY_IMAGES[story.id] && (
                        <View style={styles.storyThumbWrap}>
                          <Image source={STORY_IMAGES[story.id]} style={styles.storyThumbImg} resizeMode="cover" />
                          <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.55)']}
                            style={styles.storyThumbGradient}
                          />
                          <View style={[styles.storyThumbBadge, isRtl ? { right: 12 } : { left: 12 }]}>
                            <Text style={{ fontSize: 26 }}>{story.animalEmoji}</Text>
                          </View>
                        </View>
                      )}

                      <View style={{ padding: SPACING.md }}>
                        <View style={[styles.storyCardHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                          <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                            <View style={[styles.agePill, { backgroundColor: story.themeColor + '20' }]}>
                              <Text style={[styles.agePillText, { color: story.themeColor }]}>
                                {isAr ? `سن ${story.minAge}+` : `Age ${story.minAge}+`}
                              </Text>
                            </View>
                            <Text style={[styles.storyProphetName, { textAlign: isRtl ? 'right' : 'left' }]}>
                              {prophetName}
                            </Text>
                            <Text style={[styles.storyTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                              {storyTitle}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={[styles.storySummaryText, { textAlign: isRtl ? 'right' : 'left' }]}
                          numberOfLines={2}
                        >
                          {summaryText}
                        </Text>

                        <View style={[styles.storyFooterRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                          <View style={styles.rewardTag}>
                            <Ionicons name="star" size={13} color="#F59E0B" />
                            <Text style={styles.rewardTagText}>+10 {t.stars}</Text>
                          </View>
                          <View style={[styles.exploreBtn, { backgroundColor: story.themeColor }]}>
                            <Text style={styles.exploreBtnText}>
                              {getAnimalsHubLabel('readStoryBtn', language)}
                            </Text>
                            <Ionicons
                              name={isRtl ? 'arrow-back' : 'arrow-forward'}
                              size={13}
                              color="#FFFFFF"
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 2: ANIMAL KINDNESS IN SUNNAH */}
          {activeTab === 'sunnah' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="heart" size={18} color="#059669" />
                <Text style={styles.sectionHeaderTitle}>
                  {getAnimalsHubLabel('sunnahSectionTitle', language)}
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
                    {getAnimalsHubLabel('helpAnimalTitle', language)}
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
                  {getAnimalsHubLabel('catalogSectionTitle', language)}
                </Text>
              </View>

              <View style={styles.cardsGrid}>
                {QURAN_ANIMALS_CATALOG.map((item) => {
                  const isStickerUnlocked = unlockedStickers.includes(item.stickerId);
                  const animalImg = ANIMAL_CATALOG_IMAGES[item.id] || STORY_IMAGES['isa-bird'];

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.catalogCard, { borderColor: item.themeColor + '40' }]}
                      onPress={() => setSelectedCard(item)}
                      activeOpacity={0.85}
                    >
                      {/* Animal 3D Image Thumbnail */}
                      <View style={styles.catalogCardImgWrap}>
                        <Image
                          source={animalImg}
                          style={styles.catalogCardImg}
                          resizeMode="cover"
                        />
                        <View style={styles.catalogEmojiBadge}>
                          <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                        </View>
                        {isStickerUnlocked && (
                          <View style={styles.stickerBadgePill}>
                            <Ionicons name="sparkles" size={10} color="#D97706" />
                            <Text style={styles.stickerBadgeText}>
                              {getAnimalsHubLabel('unlockedBadge', language)}
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
                    {/* Header Image with close button */}
                    <View style={styles.detailCardImgWrap}>
                      <Image
                        source={ANIMAL_CATALOG_IMAGES[selectedCard.id] || STORY_IMAGES['isa-bird']}
                        style={styles.detailCardImg}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.detailCardGradient}
                      />
                      <TouchableOpacity
                        style={styles.closeCardBtn}
                        onPress={() => {
                          audioService.stop();
                          setIsPlayingAyahAudio(false);
                          setSelectedCard(null);
                        }}
                      >
                        <Ionicons name="close-circle" size={28} color="#FFFFFF" />
                      </TouchableOpacity>
                      <View style={styles.detailCardEmojiBadge}>
                        <Text style={{ fontSize: 24 }}>{selectedCard.emoji}</Text>
                      </View>
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
                            ? getAnimalsHubLabel('stopAyahBtn', language)
                            : getAnimalsHubLabel('listenAyahBtn', language)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailFactBox}>
                      <Text style={styles.detailFactTitle}>
                        {getAnimalsHubLabel('amazingFactTitle', language)}
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
                    {`${getAnimalsHubLabel('scoreTitle', language)} ${gameScore}`}
                  </Text>
                </View>
                <Text style={styles.gameRoundCounter}>
                  {`${getAnimalsHubLabel('roundText', language)} ${currentRoundIdx + 1} ${getAnimalsHubLabel('ofText', language)} ${GUESS_ANIMAL_ROUNDS.length}`}
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
                                ? getAnimalsHubLabel('stopAyahBtn', language)
                                : getAnimalsHubLabel('listenAyahBtn', language)}
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
                          ? getAnimalsHubLabel('finishChallengeBtn', language)
                          : getAnimalsHubLabel('nextRoundBtn', language)}
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
  heroBackground: {
    width: '100%',
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  storyThumbWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  storyThumbImg: {
    width: '100%',
    height: '100%',
  },
  storyThumbGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  storyThumbBadge: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...SHADOWS.soft,
  },
  storyCardHeader: {
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xs,
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
    padding: 10,
    borderWidth: 1,
    ...SHADOWS.soft,
    marginBottom: 10,
  },
  catalogCardImgWrap: {
    width: '100%',
    height: 95,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  catalogCardImg: {
    width: '100%',
    height: '100%',
  },
  catalogEmojiBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: RADIUS.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
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
    overflow: 'hidden',
    paddingBottom: SPACING.lg,
    width: '100%',
    maxWidth: 440,
    ...SHADOWS.strong,
  },
  detailCardImgWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
    marginBottom: SPACING.md,
    backgroundColor: '#CBD5E1',
  },
  detailCardImg: {
    width: '100%',
    height: '100%',
  },
  detailCardGradient: {
    ...StyleSheet.absoluteFill,
  },
  detailCardEmojiBadge: {
    position: 'absolute',
    bottom: -16,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  closeCardBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
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
