// Prophet Story Player (P2, P3, P4, P5, P6)
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { contentService } from '@/services/contentService';
import { useAppStore } from '@/store/useAppStore';
import { audioService } from '@/services/audioService';
import { getProphetDecisionMoment, StoryDecisionOption } from '@/data/storiesData';
import {
  getLocalizedProphetStoryTitle,
  getLocalizedProphetScene,
  getLocalizedProphetDecision,
  getLocalizedProphetQuiz,
  getLocalizedProphetTakeaway,
} from '@/services/multilingualContentService';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';

const PROPHET_ARTWORKS = {
  caravan: require('../../../assets/images/prophets-caravan.jpg'),
  adamCreation: require('../../../assets/images/scene-adam-creation.jpg'),
  adamRepentance: require('../../../assets/images/scene-adam-repentance.jpg'),
  paradiseTree: require('../../../assets/images/scene-paradise-tree.jpg'),
  earthDawn: require('../../../assets/images/scene-earth-dawn.jpg'),
  desertStars: require('../../../assets/images/scene-desert-stars.jpg'),
  whaleSea: require('../../../assets/images/scene-whale-sea.jpg'),
  palaceGarden: require('../../../assets/images/scene-palace-garden.jpg'),
  medinaMosque: require('../../../assets/images/scene-medina-mosque.jpg'),
  nuhArk: require('../../../assets/images/scene-nuh-ark.jpg'),
  ibrahimKaaba: require('../../../assets/images/scene-ibrahim-kaaba.jpg'),
  musaSinai: require('../../../assets/images/scene-musa-sinai.jpg'),
  muhammadHira: require('../../../assets/images/scene-muhammad-hira.jpg'),
};

const getProphetSceneArtwork = (prophetId: string, sceneIdx: number, scene: any) => {
  // 1. Prophet Adam
  if (prophetId === 'adam') {
    if (sceneIdx === 0 || sceneIdx === 1) return PROPHET_ARTWORKS.adamCreation;
    if (sceneIdx >= 2 && sceneIdx <= 4) return PROPHET_ARTWORKS.paradiseTree;
    if (sceneIdx === 5 || sceneIdx === 6) return PROPHET_ARTWORKS.adamRepentance;
    return PROPHET_ARTWORKS.earthDawn;
  }

  // 2. Prophet Nuh
  if (prophetId === 'nuh') {
    if (sceneIdx >= 4 && sceneIdx <= 6) return PROPHET_ARTWORKS.whaleSea;
    return PROPHET_ARTWORKS.nuhArk;
  }

  // 3. Prophet Ibrahim & Ismail
  if (prophetId === 'ibrahim' || prophetId === 'ismail') {
    if (sceneIdx === 0 || sceneIdx === 1) return PROPHET_ARTWORKS.desertStars;
    if (sceneIdx >= 6) return PROPHET_ARTWORKS.ibrahimKaaba;
    return PROPHET_ARTWORKS.earthDawn;
  }

  // 4. Prophet Musa & Harun
  if (prophetId === 'musa' || prophetId === 'harun') {
    if (sceneIdx >= 3 && sceneIdx <= 6) return PROPHET_ARTWORKS.musaSinai;
    return PROPHET_ARTWORKS.earthDawn;
  }

  // 5. Prophet Yunus
  if (prophetId === 'yunus') {
    if (sceneIdx >= 2 && sceneIdx <= 6) return PROPHET_ARTWORKS.whaleSea;
    return PROPHET_ARTWORKS.earthDawn;
  }

  // 6. Prophet Sulayman & Dawud
  if (prophetId === 'sulayman' || prophetId === 'dawud') {
    return PROPHET_ARTWORKS.palaceGarden;
  }

  // 7. Prophet Muhammad ﷺ
  if (prophetId === 'muhammad') {
    if (sceneIdx <= 2) return PROPHET_ARTWORKS.muhammadHira;
    if (sceneIdx >= 6) return PROPHET_ARTWORKS.medinaMosque;
    return PROPHET_ARTWORKS.ibrahimKaaba;
  }

  // 8. Prophet Yusuf
  if (prophetId === 'yusuf') {
    if (sceneIdx <= 2) return PROPHET_ARTWORKS.desertStars;
    if (sceneIdx >= 6) return PROPHET_ARTWORKS.palaceGarden;
    return PROPHET_ARTWORKS.earthDawn;
  }

  // 9. Semantic & Keyword Fallbacks based on Scene Content
  const text = `${scene?.titleAr || ''} ${scene?.narrationAr || ''} ${scene?.symbolDescriptionAr || ''}`;
  if (text.includes('جنة') || text.includes('شجرة') || text.includes('ثمار') || text.includes('أنهار')) {
    return PROPHET_ARTWORKS.paradiseTree;
  }
  if (text.includes('حوت') || text.includes('بحر') || text.includes('سفينة') || text.includes('طوفان')) {
    return PROPHET_ARTWORKS.whaleSea;
  }
  if (text.includes('كعبة') || text.includes('مكة') || text.includes('حرم')) {
    return PROPHET_ARTWORKS.ibrahimKaaba;
  }
  if (text.includes('مسجد') || text.includes('مدينة') || text.includes('منبر')) {
    return PROPHET_ARTWORKS.medinaMosque;
  }
  if (text.includes('طور') || text.includes('جبل') || text.includes('سيناء')) {
    return PROPHET_ARTWORKS.musaSinai;
  }
  if (text.includes('حراء') || text.includes('غار') || text.includes('وحي')) {
    return PROPHET_ARTWORKS.muhammadHira;
  }
  if (text.includes('هدهد') || text.includes('طير') || text.includes('بستان') || text.includes('قصر') || text.includes('نمل')) {
    return PROPHET_ARTWORKS.palaceGarden;
  }
  if (text.includes('نجم') || text.includes('ليل') || text.includes('صحراء') || text.includes('قمر')) {
    return PROPHET_ARTWORKS.desertStars;
  }

  return PROPHET_ARTWORKS.earthDawn;
};

export default function ProphetStoryPlayerScreen() {
  const router = useRouter();
  const { prophetId } = useLocalSearchParams();
  const { language, completeStory, addStars, parentSettings } = useAppStore();
  const showEnglish = language === 'en' || (language === 'ar' && parentSettings?.showEnglishTranslation === true);
  const t = TRANSLATIONS[language];

  const prophet =
    contentService.getProphetById(String(prophetId)) ||
    contentService.getProphets()[0];

  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [screenPhase, setScreenPhase] = useState<'scenes' | 'decision' | 'quiz'>('scenes');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Decision moment state (P5)
  const decisionMoment = getProphetDecisionMoment(prophet);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [decisionRewarded, setDecisionRewarded] = useState<boolean>(false);

  // Quiz state
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  const [showTakeawayModal, setShowTakeawayModal] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const currentScene = prophet.scenes[activeSceneIdx] || prophet.scenes[0];
  const currentQuizQ = prophet.quiz[quizQuestionIdx];

  const localizedScene = getLocalizedProphetScene(prophet.id, currentScene, activeSceneIdx, language);
  const localizedDecision = getLocalizedProphetDecision(decisionMoment, language);
  const localizedQuiz = currentQuizQ ? getLocalizedProphetQuiz(currentQuizQ, language) : null;
  const localizedTakeaway = getLocalizedProphetTakeaway(prophet.takeawayCard, language);

  const sceneImage = getProphetSceneArtwork(prophet.id, activeSceneIdx, currentScene);

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const handleToggleAudio = async () => {
    if (isAudioPlaying) {
      await audioService.stop();
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      const narrationToPlay = language === 'ar' ? currentScene.narrationAr : localizedScene.narration;
      await audioService.playDua(
        narrationToPlay,
        (status) => {
          if (status.didJustFinish || status.error) {
            setIsAudioPlaying(false);
          }
        },
        language === 'ar' ? 'ar' : language
      );
    }
  };

  const handleNextScene = () => {
    audioService.stop();
    setIsAudioPlaying(false);
    if (activeSceneIdx < prophet.scenes.length - 1) {
      setActiveSceneIdx(activeSceneIdx + 1);
    } else {
      // Finished all scenes -> open decision moment checkpoint
      setScreenPhase('decision');
    }
  };

  const handlePrevScene = () => {
    audioService.stop();
    setIsAudioPlaying(false);
    if (activeSceneIdx > 0) {
      setActiveSceneIdx(activeSceneIdx - 1);
    }
  };

  const handleSelectDecision = (option: StoryDecisionOption) => {
    setSelectedDecisionId(option.id);
    if (option.isBestChoice && !decisionRewarded) {
      addStars(1);
      setDecisionRewarded(true);
    }
  };

  const handleStartQuiz = () => {
    setScreenPhase('quiz');
    setQuizQuestionIdx(0);
    setSelectedOptionIdx(null);
  };

  const handleAnswerQuiz = (optionIndex: number) => {
    setSelectedOptionIdx(optionIndex);
    const isCorrect = optionIndex === currentQuizQ.correctAnswerIndex;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizScore(newScore);

    setTimeout(() => {
      if (quizQuestionIdx < prophet.quiz.length - 1) {
        setQuizQuestionIdx(quizQuestionIdx + 1);
        setSelectedOptionIdx(null);
      } else {
        // Quiz completed!
        completeStory(prophet.id, newScore);
        setShowTakeawayModal(true);
      }
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        title={getLocalizedProphetStoryTitle(prophet, language)}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar of Scenes */}
        <View style={styles.scenesProgressBar}>
          {prophet.scenes.map((_, i) => (
            <View
              key={i}
              style={[
                styles.sceneBarSegment,
                i <= activeSceneIdx && { backgroundColor: prophet.themeColor },
              ]}
            />
          ))}
        </View>

        {screenPhase === 'scenes' && (
          // STORY SCENE VIEW
          <View style={styles.sceneContainer}>
            {/* Top Scene Card */}
            <View style={styles.sceneCard}>
              <View style={styles.sceneHeader}>
                <Text style={styles.sceneTitle}>
                  {localizedScene.title}
                </Text>
                <Text style={styles.sceneCounter}>
                  {t.scene} {activeSceneIdx + 1} / {prophet.scenes.length}
                </Text>
              </View>

              {/* Respectful 3D Scene Art Illustration (No Prophet Face or Body) */}
              <View style={styles.sceneIllustrationWrapper}>
                <Image
                  source={sceneImage}
                  style={styles.sceneIllustrationImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.72)']}
                  style={styles.sceneIllustrationOverlay}
                >
                  <Text style={styles.sceneIllustrationCaption}>
                    {localizedScene.symbolDescription}
                  </Text>
                </LinearGradient>
              </View>

              {/* Audio Narration Trigger (P4) */}
              <TouchableOpacity
                style={[
                  styles.audioNarrateBtn,
                  isAudioPlaying && styles.audioNarrateBtnPlaying,
                  { borderColor: prophet.themeColor },
                ]}
                onPress={handleToggleAudio}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isAudioPlaying ? 'pause-circle' : 'volume-high'}
                  size={22}
                  color={isAudioPlaying ? COLORS.textLight : prophet.themeColor}
                />
                <Text
                  style={[
                    styles.audioNarrateBtnText,
                    isAudioPlaying && styles.audioNarrateBtnTextPlaying,
                  ]}
                >
                  {isAudioPlaying
                    ? t.playingVoiceNarration
                    : t.listenVoiceNarration}
                </Text>
                {isAudioPlaying && (
                  <View style={styles.audioWavePill}>
                    <Text style={styles.audioWaveText}>♪ ♫</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Narration Text */}
              <Text style={styles.narrationText}>
                {localizedScene.narration}
              </Text>

              {/* Embedded Quran Ayah Inside Story (P3) */}
              {currentScene.linkedAyah && (
                <View style={styles.linkedAyahCard}>
                  <View style={styles.linkedAyahHeader}>
                    <Ionicons name="book" size={16} color={COLORS.quranGarden.dark} />
                    <Text style={styles.linkedAyahTitle}>
                      سورة {currentScene.linkedAyah.surahNameAr} (آية{' '}
                      {currentScene.linkedAyah.ayahNumber})
                    </Text>
                  </View>
                  <Text style={styles.linkedAyahUthmani}>
                    {currentScene.linkedAyah.textUthmani}
                  </Text>
                  {showEnglish && (
                    <Text style={styles.linkedAyahTranslation}>
                      {currentScene.linkedAyah.translationEn}
                    </Text>
                  )}
                </View>
              )}

              {/* Scene Navigation Buttons */}
              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[
                    styles.prevBtn,
                    activeSceneIdx === 0 && { opacity: 0.4 },
                  ]}
                  disabled={activeSceneIdx === 0}
                  onPress={handlePrevScene}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={language === 'ar' ? 'arrow-forward' : 'arrow-back'}
                    size={20}
                    color={COLORS.text}
                  />
                  <Text style={styles.prevBtnText}>{t.prevScene}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.nextBtn, { backgroundColor: prophet.themeColor }]}
                  onPress={handleNextScene}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextBtnText}>
                    {activeSceneIdx === prophet.scenes.length - 1
                      ? t.decisionMoment
                      : t.nextScene}
                  </Text>
                  <Ionicons
                    name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {screenPhase === 'decision' && (
          // INTERACTIVE DECISION MOMENT (P5)
          <View style={styles.decisionCard}>
            <View style={styles.decisionHeader}>
              <Ionicons name="compass" size={24} color={prophet.themeColor} />
              <Text style={styles.decisionHeaderTitle}>
                {t.whatWouldYouDoPrompt}
              </Text>
            </View>

            <View style={[styles.decisionPromptBadge, { backgroundColor: prophet.themeColor + '18' }]}>
              <Ionicons name="sparkles" size={16} color={prophet.themeColor} />
              <Text style={[styles.decisionPromptText, { color: prophet.themeColor }]}>
                {localizedDecision.prompt}
              </Text>
            </View>

            <Text style={styles.decisionQuestionText}>
              {localizedDecision.question}
            </Text>

            <View style={styles.decisionOptionsList}>
              {localizedDecision.options.map((opt) => {
                const isSelected = selectedDecisionId === opt.id;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.decisionOptionCard,
                      isSelected &&
                        (opt.isBestChoice
                          ? styles.decisionOptionBest
                          : styles.decisionOptionAlternative),
                    ]}
                    onPress={() => handleSelectDecision(opt as any)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.decisionOptionRow}>
                      <View
                        style={[
                          styles.decisionOptionRadio,
                          isSelected && {
                            borderColor: opt.isBestChoice ? '#059669' : '#d97706',
                          },
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name={opt.isBestChoice ? 'checkmark' : 'alert'}
                            size={14}
                            color={opt.isBestChoice ? '#059669' : '#d97706'}
                          />
                        )}
                      </View>
                      <Text style={styles.decisionOptionText}>
                        {opt.text}
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        style={[
                          styles.decisionFeedbackBox,
                          {
                            backgroundColor: opt.isBestChoice ? '#05966915' : '#d9770615',
                            borderColor: opt.isBestChoice ? '#05966940' : '#d9770640',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.decisionFeedbackText,
                            { color: opt.isBestChoice ? '#047857' : '#b45309' },
                          ]}
                        >
                          {opt.feedback}
                        </Text>
                        {opt.isBestChoice && (
                          <View style={styles.bestChoiceRewardPill}>
                            <Ionicons name="star" size={12} color="#f59e0b" />
                            <Text style={styles.bestChoiceRewardText}>
                              {t.reflectionStar}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedDecisionId && (
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: prophet.themeColor, marginTop: SPACING.md }]}
                onPress={handleStartQuiz}
                activeOpacity={0.8}
              >
                <Text style={styles.nextBtnText}>
                  {t.proceedToQuiz}
                </Text>
                <Ionicons
                  name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {screenPhase === 'quiz' && localizedQuiz && (
          // QUIZ MODE (P5)
          <View style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <Ionicons name="help-circle" size={24} color={prophet.themeColor} />
              <Text style={styles.quizTitle}>
                {t.storyQuiz} ({quizQuestionIdx + 1} / {prophet.quiz.length})
              </Text>
            </View>

            <Text style={styles.quizQuestionText}>
              {localizedQuiz.question}
            </Text>

            <View style={styles.optionsList}>
              {localizedQuiz.options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const isCorrect = idx === currentQuizQ.correctAnswerIndex;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionBtn,
                      isSelected &&
                        (isCorrect
                          ? styles.optionBtnCorrect
                          : styles.optionBtnWrong),
                    ]}
                    onPress={() => handleAnswerQuiz(idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                    {isSelected && (
                      <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={22}
                        color={isCorrect ? COLORS.success : COLORS.error}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* "Lessons I Learned" Takeaway Card Modal (P6) */}
      <Modal
        visible={showTakeawayModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTakeawayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.takeawayCard}>
            <Text style={styles.takeawayEmoji}>📜</Text>
            <Text style={styles.takeawayTitle}>
              {localizedTakeaway.title}
            </Text>

            <View style={styles.takeawayBox}>
              <Text style={styles.takeawayLabel}>{t.lessonsLearned}</Text>
              <Text style={styles.takeawayContent}>
                {localizedTakeaway.lesson}
              </Text>
            </View>

            <View style={styles.actionBox}>
              <Text style={styles.actionLabel}>
                {t.todaysPractice}
              </Text>
              <Text style={styles.actionContent}>
                {localizedTakeaway.actionForToday}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.saveCardBtn, { backgroundColor: prophet.themeColor }]}
              onPress={() => {
                setShowTakeawayModal(false);
                setShowCelebration(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.saveCardBtnText}>{t.addToCardCollection}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={3}
        gemsEarned={5}
        title={t.congratulations}
        subtitle={t.completedStorySuccess}
        onDismiss={() => {
          setShowCelebration(false);
          router.replace('/prophets');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  scenesProgressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.md,
  },
  sceneBarSegment: {
    flex: 1,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  sceneContainer: {
    gap: SPACING.md,
  },
  sceneCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sceneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  sceneCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sceneIllustrationWrapper: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  sceneIllustrationImage: {
    width: '100%',
    height: '100%',
  },
  sceneIllustrationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  sceneIllustrationCaption: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  narrationText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 28,
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  linkedAyahCard: {
    backgroundColor: COLORS.quranGarden.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.quranGarden.accent + '44',
  },
  linkedAyahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  linkedAyahTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
  },
  linkedAyahUthmani: {
    fontSize: 18,
    lineHeight: 32,
    color: COLORS.quranGarden.dark,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 4,
  },
  linkedAyahTranslation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  prevBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cardAlt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  nextBtn: {
    flex: 2,
    height: 48,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...SHADOWS.soft,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  quizCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  quizQuestionText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: SPACING.lg,
  },
  optionsList: {
    gap: SPACING.sm,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionBtnCorrect: {
    backgroundColor: COLORS.successLight + '44',
    borderColor: COLORS.success,
  },
  optionBtnWrong: {
    backgroundColor: COLORS.errorLight + '44',
    borderColor: COLORS.error,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  takeawayCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  takeawayEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  takeawayTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  takeawayBox: {
    width: '100%',
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  takeawayLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  takeawayContent: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  actionBox: {
    width: '100%',
    backgroundColor: COLORS.secondaryLight + '44',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondaryDark,
    marginBottom: 4,
  },
  actionContent: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  saveCardBtn: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCardBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  audioNarrateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
  },
  audioNarrateBtnPlaying: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  audioNarrateBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  audioNarrateBtnTextPlaying: {
    color: COLORS.textLight,
  },
  audioWavePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  audioWaveText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '900',
  },
  decisionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  decisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  decisionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  decisionPromptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  decisionPromptText: {
    fontSize: 12,
    fontWeight: '800',
  },
  decisionQuestionText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  decisionOptionsList: {
    gap: SPACING.sm,
  },
  decisionOptionCard: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 8,
  },
  decisionOptionBest: {
    borderColor: '#059669',
    backgroundColor: '#05966910',
  },
  decisionOptionAlternative: {
    borderColor: '#d97706',
    backgroundColor: '#d9770610',
  },
  decisionOptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  decisionOptionRadio: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  decisionOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  decisionFeedbackBox: {
    marginTop: 4,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  decisionFeedbackText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  bestChoiceRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  bestChoiceRewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
  },
});
