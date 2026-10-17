// Animal Miracle Story Interactive Learning Player (شاشة قصة معجزة الحيوان التفاعلية)
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, isRTL } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { audioService } from '@/services/audioService';
import { getAyahAudioUrl } from '@/data/quranData';
import { ANIMAL_MIRACLE_STORIES, AnimalMiracleStory } from '@/data/animalsData';

export default function AnimalStoryScreen() {
  const router = useRouter();
  const { storyId } = useLocalSearchParams();
  const { language, addStars, addGems, unlockSticker } = useAppStore();
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const story: AnimalMiracleStory =
    ANIMAL_MIRACLE_STORIES.find((s) => s.id === storyId) || ANIMAL_MIRACLE_STORIES[0];

  // Age band toggle: 'young' (4-6) or 'older' (7+)
  const [ageMode, setAgeMode] = useState<'young' | 'older'>('young');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  // Audio states
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [isPlayingAyah, setIsPlayingAyah] = useState(false);

  // Quiz & Fear activity states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [courageChoices, setCourageChoices] = useState<Record<number, number>>({});
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentScene = story.scenes[currentSceneIdx] || story.scenes[0];

  const handlePlayNarration = () => {
    if (isPlayingNarration) {
      audioService.stopDua();
      setIsPlayingNarration(false);
      return;
    }
    const textToRead = ageMode === 'young'
      ? (isAr ? currentScene.narrationYoungAr : currentScene.narrationYoungEn)
      : (isAr ? currentScene.narrationOlderAr : currentScene.narrationOlderEn);

    setIsPlayingNarration(true);
    audioService.playDua(textToRead, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingNarration(false);
      }
    });
  };

  const handlePlayAyah = () => {
    if (isPlayingAyah) {
      audioService.stop();
      setIsPlayingAyah(false);
      return;
    }
    const audioUrl = getAyahAudioUrl(
      'Alafasy_128kbps',
      story.linkedAyah.surahNumber,
      story.linkedAyah.ayahNumber
    );
    setIsPlayingAyah(true);
    audioService.playAyah(audioUrl, 1.0, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAyah(false);
      }
    });
  };

  const handleSelectQuiz = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleFinishStory = () => {
    if (!hasClaimedReward) {
      addStars(10);
      addGems(5);
      unlockSticker(story.stickerId);
      setHasClaimedReward(true);
    }
    setShowCelebration(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header showBack fallbackRoute="/animals" title={isAr ? story.titleAr : story.titleEn} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Story Hero Header Card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[story.themeColor, story.themeColor + 'DD']}
              style={styles.heroGradient}
            >
              <View style={[styles.heroTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.badgeCluster}>
                  <View style={styles.ageBadgePill}>
                    <Text style={styles.ageBadgeText}>
                      {isAr ? `الفئة ${story.minAge}+ سنوات` : `Age ${story.minAge}+`}
                    </Text>
                  </View>
                  <Text style={styles.prophetTag}>
                    {isAr ? story.prophetNameAr : story.prophetNameEn}
                  </Text>
                </View>
                <View style={styles.heroEmojiCircle}>
                  <Text style={{ fontSize: 40 }}>{story.animalEmoji}</Text>
                </View>
              </View>

              <Text style={[styles.heroTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr ? story.titleAr : story.titleEn}
              </Text>

              <View style={[styles.valuePill, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="sparkles" size={13} color="#FDE68A" />
                <Text style={styles.valueText}>
                  {isAr ? story.moralValueAr : story.moralValueEn}
                </Text>
              </View>

              {/* Age Switcher Toggle */}
              <View style={[styles.ageToggleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={[styles.ageToggleBtn, ageMode === 'young' && styles.ageToggleBtnActive]}
                  onPress={() => {
                    audioService.stopDua();
                    setIsPlayingNarration(false);
                    setAgeMode('young');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.ageToggleBtnText, ageMode === 'young' && styles.ageToggleBtnTextActive]}>
                    {isAr ? '🌱 براعم (٤-٦ سنوات)' : '🌱 Young Learners (4-6)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ageToggleBtn, ageMode === 'older' && styles.ageToggleBtnActive]}
                  onPress={() => {
                    audioService.stopDua();
                    setIsPlayingNarration(false);
                    setAgeMode('older');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.ageToggleBtnText, ageMode === 'older' && styles.ageToggleBtnTextActive]}>
                    {isAr ? '🌟 أبطال (٧+ سنوات)' : '🌟 Young Champions (7+)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Linked Quranic Ayah Card with Audio Player */}
          <View style={styles.ayahCard}>
            <View style={[styles.ayahHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Ionicons name="book" size={16} color="#059669" />
              <Text style={styles.ayahSurahTag}>
                {isAr ? `${story.linkedAyah.surahNameAr} [آية ${story.linkedAyah.ayahNumber}]` : `${story.linkedAyah.surahNameEn} [Ayah ${story.linkedAyah.ayahNumber}]`}
              </Text>
            </View>

            <Text style={styles.ayahUthmaniText}>
              «{story.linkedAyah.textUthmani}»
            </Text>

            {language !== 'ar' && (
              <Text style={styles.ayahTransText}>
                "{story.linkedAyah.translationEn}"
              </Text>
            )}

            <TouchableOpacity
              style={[styles.playAyahBtn, isPlayingAyah && styles.playAyahBtnActive]}
              onPress={handlePlayAyah}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isPlayingAyah ? 'stop-circle' : 'volume-high'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.playAyahBtnText}>
                {isPlayingAyah
                  ? (isAr ? 'إيقاف التلاوة' : 'Stop Recitation')
                  : (isAr ? '🔊 استمع للآية بصوت القارئ' : '🔊 Listen to Ayah')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Scenes Module */}
          <View style={styles.sceneContainer}>
            <View style={[styles.sceneNavHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.sceneCounterPill}>
                <Ionicons name="images" size={13} color="#0284C7" />
                <Text style={styles.sceneCounterText}>
                  {isAr
                    ? `مشهد ${currentSceneIdx + 1} من ${story.scenes.length}`
                    : `Scene ${currentSceneIdx + 1} of ${story.scenes.length}`}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.audioNarrationBtn, isPlayingNarration && styles.audioNarrationBtnActive]}
                onPress={handlePlayNarration}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlayingNarration ? 'stop-circle' : 'volume-high'}
                  size={15}
                  color={isPlayingNarration ? '#DC2626' : '#047857'}
                />
                <Text style={[styles.audioNarrationBtnText, isPlayingNarration && { color: '#DC2626' }]}>
                  {isPlayingNarration
                    ? (isAr ? 'إيقاف الراوي' : 'Stop')
                    : (isAr ? '🔊 اقرأ لي' : '🔊 Read to me')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scene Content Box */}
            <View style={styles.sceneBox}>
              <View style={styles.sceneIconRing}>
                <Ionicons name={currentScene.symbolIcon as any} size={28} color={story.themeColor} />
              </View>

              <Text style={[styles.sceneTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr ? currentScene.titleAr : currentScene.titleEn}
              </Text>

              <Text style={[styles.sceneNarration, { textAlign: isRtl ? 'right' : 'left' }]}>
                {ageMode === 'young'
                  ? (isAr ? currentScene.narrationYoungAr : currentScene.narrationYoungEn)
                  : (isAr ? currentScene.narrationOlderAr : currentScene.narrationOlderEn)}
              </Text>

              <View style={[styles.sceneReflectionBox, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="bulb" size={16} color="#D97706" />
                <Text style={[styles.sceneReflectionText, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? currentScene.reflectionAr : currentScene.reflectionEn}
                </Text>
              </View>
            </View>

            {/* Scene Navigation Buttons */}
            <View style={[styles.sceneNavRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[styles.sceneNavBtn, currentSceneIdx === 0 && styles.sceneNavBtnDisabled]}
                onPress={() => {
                  audioService.stopDua();
                  setIsPlayingNarration(false);
                  setCurrentSceneIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentSceneIdx === 0}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isRtl ? 'arrow-forward' : 'arrow-back'}
                  size={15}
                  color={currentSceneIdx === 0 ? '#9CA3AF' : '#1F2937'}
                />
                <Text style={[styles.sceneNavBtnText, currentSceneIdx === 0 && { color: '#9CA3AF' }]}>
                  {isAr ? 'السابق' : 'Previous'}
                </Text>
              </TouchableOpacity>

              {/* Dots */}
              <View style={styles.dotsCluster}>
                {story.scenes.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.sceneDot,
                      idx === currentSceneIdx && [styles.sceneDotActive, { backgroundColor: story.themeColor }],
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.sceneNavBtn, styles.sceneNavBtnNext, { backgroundColor: story.themeColor }]}
                onPress={() => {
                  audioService.stopDua();
                  setIsPlayingNarration(false);
                  if (currentSceneIdx < story.scenes.length - 1) {
                    setCurrentSceneIdx((prev) => prev + 1);
                  }
                }}
                disabled={currentSceneIdx === story.scenes.length - 1}
                activeOpacity={0.8}
              >
                <Text style={styles.sceneNavBtnNextText}>
                  {isAr ? 'التالي' : 'Next'}
                </Text>
                <Ionicons
                  name={isRtl ? 'arrow-back' : 'arrow-forward'}
                  size={15}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Fear / Courage Activity if Available (Story 14) */}
          {story.fearActivity && (
            <View style={styles.fearActivityCard}>
              <View style={[styles.activityHead, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#059669" />
                <Text style={styles.activityHeadTitle}>
                  {isAr ? story.fearActivity.titleAr : story.fearActivity.titleEn}
                </Text>
              </View>
              <Text style={[styles.activityHeadDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr ? story.fearActivity.descAr : story.fearActivity.descEn}
              </Text>

              {story.fearActivity.scenarios.map((scen, sIdx) => {
                const selectedOptIdx = courageChoices[sIdx];

                return (
                  <View key={sIdx} style={styles.fearScenBlock}>
                    <Text style={[styles.fearScenQuestion, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {sIdx + 1}. {isAr ? scen.situationAr : scen.situationEn}
                    </Text>

                    <View style={styles.fearOptionsList}>
                      {scen.options.map((opt, oIdx) => {
                        const isChosen = selectedOptIdx === oIdx;

                        return (
                          <TouchableOpacity
                            key={oIdx}
                            style={[
                              styles.fearOptBtn,
                              isChosen && (opt.isCourageous ? styles.fearOptCorrect : styles.fearOptWrong),
                            ]}
                            onPress={() => setCourageChoices((prev) => ({ ...prev, [sIdx]: oIdx }))}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.fearOptText,
                                isChosen && { fontWeight: '700' },
                                { textAlign: isRtl ? 'right' : 'left' },
                              ]}
                            >
                              {isAr ? opt.textAr : opt.textEn}
                            </Text>
                            {isChosen && opt.isCourageous && (
                              <Ionicons name="checkmark-circle" size={16} color="#059669" />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {selectedOptIdx !== undefined && (
                      <View style={styles.fearFeedbackPill}>
                        <Text style={[styles.fearFeedbackText, { textAlign: isRtl ? 'right' : 'left' }]}>
                          {isAr ? scen.options[selectedOptIdx].feedbackAr : scen.options[selectedOptIdx].feedbackEn}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Golden Lesson Box */}
          <View style={styles.lessonCard}>
            <View style={[styles.lessonHeadRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Ionicons name="star" size={18} color="#D97706" />
              <Text style={styles.lessonHeadTitle}>
                {isAr ? 'العبرة الذهبية من القصة:' : 'Golden Lesson:'}
              </Text>
            </View>
            <Text style={[styles.lessonText, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? story.coreLessonAr : story.coreLessonEn}
            </Text>
          </View>

          {/* Interactive Quiz Module */}
          <View style={styles.quizCard}>
            <View style={[styles.quizHeadRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.quizBadge}>
                <Ionicons name="help-circle" size={16} color="#D97706" />
                <Text style={styles.quizBadgeText}>
                  {isAr ? 'اختبر فهمك يا بطل' : 'Check Your Knowledge'}
                </Text>
              </View>
              <Text style={styles.quizRewardBadge}>+10 ⭐</Text>
            </View>

            {story.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;

              return (
                <View key={q.id} style={styles.quizBlock}>
                  <Text style={[styles.quizQuestionText, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {qIdx + 1}. {isAr ? q.questionAr : q.questionEn}
                  </Text>

                  <View style={styles.quizOptionsCol}>
                    {q.optionsAr.map((optAr, optIdx) => {
                      const optLabel = isAr ? optAr : q.optionsEn[optIdx];
                      const isThisSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      return (
                        <TouchableOpacity
                          key={optIdx}
                          style={[
                            styles.quizOptionBtn,
                            isAnswered && isCorrect && styles.quizOptionCorrect,
                            isAnswered && isThisSelected && !isCorrect && styles.quizOptionWrong,
                          ]}
                          onPress={() => handleSelectQuiz(qIdx, optIdx)}
                          disabled={isAnswered}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.quizOptionText,
                              isAnswered && isCorrect && styles.quizOptionCorrectText,
                              isAnswered && isThisSelected && !isCorrect && styles.quizOptionWrongText,
                              { textAlign: isRtl ? 'right' : 'left' },
                            ]}
                          >
                            {optLabel}
                          </Text>
                          {isAnswered && isCorrect && (
                            <Ionicons name="checkmark-circle" size={16} color="#059669" />
                          )}
                          {isAnswered && isThisSelected && !isCorrect && (
                            <Ionicons name="close-circle" size={16} color="#DC2626" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {isAnswered && (
                    <View style={styles.quizExplanationBox}>
                      <Text style={[styles.quizExplanationText, { textAlign: isRtl ? 'right' : 'left' }]}>
                        💡 {isAr ? q.explanationAr : q.explanationEn}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Complete Story & Unlock Sticker Button */}
            <TouchableOpacity
              style={[styles.claimRewardBtn, { backgroundColor: story.themeColor }]}
              onPress={handleFinishStory}
              activeOpacity={0.85}
            >
              <Ionicons name="trophy" size={20} color="#FFFFFF" />
              <Text style={styles.claimRewardBtnText}>
                {isAr
                  ? `أتممت القصة! احصل على +10 نجوم وملصق ${story.stickerTitleAr}`
                  : `Complete! Claim +10 Stars & Unlock Sticker 🌟`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Celebration Modal */}
        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={10}
          gemsEarned={5}
          title={isAr ? 'بارك الله فيك يا بطل!' : 'Masha’Allah Champion!'}
          subtitle={
            isAr
              ? `أتممت قصة ${story.titleAr} وفتحت ملصق ${story.stickerTitleAr}!`
              : `You mastered ${story.titleEn} and unlocked the sticker!`
          }
          onDismiss={() => {
            setShowCelebration(false);
            router.replace('/animals' as any);
          }}
        />
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
    paddingBottom: 40,
  },
  heroCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  heroGradient: {
    padding: SPACING.lg,
  },
  heroTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  badgeCluster: {
    flex: 1,
  },
  ageBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  ageBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  prophetTag: {
    fontSize: 13,
    color: '#FDE68A',
    fontWeight: '700',
  },
  heroEmojiCircle: {
    width: 62,
    height: 62,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  valuePill: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    gap: 6,
    marginBottom: SPACING.md,
  },
  valueText: {
    fontSize: 12,
    color: '#FEF3C7',
    fontWeight: '600',
    flex: 1,
  },
  ageToggleRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: RADIUS.full,
    padding: 3,
    gap: 4,
  },
  ageToggleBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  ageToggleBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  ageToggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ageToggleBtnTextActive: {
    color: '#1F2937',
  },
  ayahCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  ayahHeaderRow: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  ayahSurahTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  ayahUthmaniText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 6,
  },
  ayahTransText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  playAyahBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  playAyahBtnActive: {
    backgroundColor: '#DC2626',
  },
  playAyahBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sceneContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  sceneNavHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sceneCounterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  sceneCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  audioNarrationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  audioNarrationBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  audioNarrationBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  sceneBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sceneIconRing: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  sceneTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
    width: '100%',
  },
  sceneNarration: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: SPACING.md,
    width: '100%',
  },
  sceneReflectionBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 6,
    width: '100%',
  },
  sceneReflectionText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  sceneNavRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sceneNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  sceneNavBtnDisabled: {
    opacity: 0.4,
  },
  sceneNavBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  dotsCluster: {
    flexDirection: 'row',
    gap: 6,
  },
  sceneDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#D1D5DB',
  },
  sceneDotActive: {
    width: 18,
  },
  sceneNavBtnNext: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  sceneNavBtnNextText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fearActivityCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...SHADOWS.soft,
  },
  activityHead: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  activityHeadTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065F46',
  },
  activityHeadDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginBottom: SPACING.sm,
  },
  fearScenBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  fearScenQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  fearOptionsList: {
    gap: 6,
  },
  fearOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  fearOptCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  fearOptWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  fearOptText: {
    fontSize: 12,
    color: '#1F2937',
    flex: 1,
  },
  fearFeedbackPill: {
    marginTop: 6,
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  fearFeedbackText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  lessonCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#FEFCE8',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  lessonHeadRow: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  lessonHeadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#854D0E',
  },
  lessonText: {
    fontSize: 13,
    color: '#713F12',
    lineHeight: 19,
    fontWeight: '600',
  },
  quizCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  quizHeadRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  quizRewardBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  quizBlock: {
    marginBottom: SPACING.md,
  },
  quizQuestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  quizOptionsCol: {
    gap: 6,
  },
  quizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    borderRadius: RADIUS.md,
  },
  quizOptionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  quizOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  quizOptionText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  quizOptionCorrectText: {
    color: '#065F46',
    fontWeight: '700',
  },
  quizOptionWrongText: {
    color: '#991B1B',
    fontWeight: '600',
  },
  quizExplanationBox: {
    marginTop: 6,
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  quizExplanationText: {
    fontSize: 11,
    color: '#4B5563',
  },
  claimRewardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    gap: 8,
    marginTop: SPACING.sm,
  },
  claimRewardBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
