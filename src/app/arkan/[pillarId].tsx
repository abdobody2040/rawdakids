// Pillar Detail & Interactive Learning Screen (تفاصيل الركن والأنشطة التفاعلية)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, isRTL } from '@/constants/i18n';
import {
  getLocalizedPillar,
  getPillarCategoryBadge,
  getPillarProofLabel,
  getPillarSimTab,
  getPillarDhikrLabel,
  getPillarQuizTitle,
  getPillarClaimRewardText,
  getPillarCelebrationMeta,
} from '@/services/multilingualContentService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { arkanService } from '@/data/arkanData';
import { audioService } from '@/services/audioService';
import { getPillarMedia, getStepMedia } from '@/data/arkanMedia';

const PRAYERS_LIST = [
  { id: 'fajr', nameAr: 'الْفَجْرُ', nameEn: 'Fajr', rakahs: 2 },
  { id: 'dhuhr', nameAr: 'الظُّهْرُ', nameEn: 'Dhuhr', rakahs: 4 },
  { id: 'asr', nameAr: 'الْعَصْرُ', nameEn: 'Asr', rakahs: 4 },
  { id: 'maghrib', nameAr: 'الْمَغْرِبُ', nameEn: 'Maghrib', rakahs: 3 },
  { id: 'isha', nameAr: 'الْعِشَاءُ', nameEn: 'Isha', rakahs: 4 },
];

export default function PillarDetailScreen() {
  const router = useRouter();
  const { pillarId, mode } = useLocalSearchParams();
  const { language, addStars, addGems } = useAppStore();
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const pillar = arkanService.getPillarById(String(pillarId || 'shahada')) || arkanService.getIslamPillars()[0];
  const localizedPillar = getLocalizedPillar(pillar, language);

  const initialMode = (pillarId === 'wudu' || mode === 'wudu') ? 'wudu' : ((mode === 'prayer' || mode === 'salah') ? 'prayer' : 'wudu');
  const [simMode, setSimMode] = useState<'wudu' | 'prayer'>(initialMode);
  const [selectedPrayer, setSelectedPrayer] = useState<string>('fajr');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlayingStepAudio, setIsPlayingStepAudio] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [completedReps, setCompletedReps] = useState<Record<number, number[]>>({});

  const hasBothSims = Boolean(pillar.steps && pillar.prayerSteps);
  const activeSteps = (hasBothSims && simMode === 'prayer') ? (pillar.prayerSteps || []) : (pillar.steps || []);
  const currentStep = activeSteps[currentStepIdx] || activeSteps[0];

  const maxReps = currentStep.reps || (simMode === 'wudu' ? ((currentStep.step === 8 || currentStep.step === 9 || currentStep.step === 1 || currentStep.step === 2) ? 1 : 3) : 1);
  const currentStepReps = completedReps[currentStepIdx] || [];

  const toggleRep = (stepIdx: number, repNum: number) => {
    setCompletedReps((prev) => {
      const current = prev[stepIdx] || [];
      const next = current.includes(repNum)
        ? current.filter((r) => r !== repNum)
        : [...current, repNum];
      return { ...prev, [stepIdx]: next };
    });
  };

  const resetCurrentStepReps = () => {
    setCompletedReps((prev) => ({
      ...prev,
      [currentStepIdx]: [],
    }));
  };

  const handlePlayStepAudio = () => {
    if (isPlayingStepAudio) {
      audioService.stopDua();
      setIsPlayingStepAudio(false);
      return;
    }
    const textToPlay = isAr
      ? (currentStep.dhikrAr || currentStep.descAr)
      : (currentStep.dhikrAr || currentStep.descEn || currentStep.descAr);
    if (!textToPlay) return;

    setIsPlayingStepAudio(true);
    audioService.playDua(textToPlay, (status: { isPlaying: boolean; didJustFinish?: boolean; error?: boolean }) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingStepAudio(false);
      }
    });
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleFinishQuiz = () => {
    if (!hasClaimedReward) {
      addStars(pillar.rewardStars);
      addGems(pillar.rewardGems);
      setHasClaimedReward(true);
    }
    setShowCelebration(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header
          showBack
          fallbackRoute="/arkan"
          title={
            pillarId === 'wudu'
              ? t.learnWudu
              : localizedPillar.title
          }
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Pillar Hero Card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[pillar.color, pillar.color + 'DD']}
              style={styles.heroGradient}
            >
              <View style={[styles.heroTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {getPillarCategoryBadge(pillar.category, pillar.number, language)}
                  </Text>
                </View>
                <View style={styles.heroIconBox}>
                  <Image
                    source={getPillarMedia(pillar.id)}
                    style={styles.heroMediaImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              <Text style={[styles.heroTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {localizedPillar.title}
              </Text>

              <Text style={[styles.heroSubtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {localizedPillar.subtitle}
              </Text>

              {/* Hadith / Quran Proof Box */}
              <View style={styles.proofBox}>
                <View style={[styles.proofHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="book" size={15} color="#FDE68A" />
                  <Text style={styles.proofLabel}>
                    {getPillarProofLabel(language)}
                  </Text>
                </View>
                <Text style={[styles.proofText, { textAlign: isRtl ? 'right' : 'left' }]}>
                  «{isAr ? pillar.hadithProofAr : localizedPillar.hadithProof}»
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Interactive Steps Carousel (Wudu & Prayer Simulators) */}
          {activeSteps.length > 0 && currentStep && (
            <View style={styles.stepsModuleCard}>
              {/* Dual Simulator Mode Switcher for Salah */}
              {hasBothSims && (
                <View style={[styles.simSelectorRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity
                    style={[styles.simSelectorTab, simMode === 'wudu' && styles.simSelectorTabActive]}
                    onPress={() => {
                      audioService.stopDua();
                      setIsPlayingStepAudio(false);
                      setSimMode('wudu');
                      setCurrentStepIdx(0);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="water" size={15} color={simMode === 'wudu' ? '#FFFFFF' : '#0284C7'} />
                    <Text style={[styles.simSelectorTabText, simMode === 'wudu' && styles.simSelectorTabTextActive]}>
                      {getPillarSimTab('wudu', language)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.simSelectorTab, simMode === 'prayer' && styles.simSelectorTabActive]}
                    onPress={() => {
                      audioService.stopDua();
                      setIsPlayingStepAudio(false);
                      setSimMode('prayer');
                      setCurrentStepIdx(0);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="body" size={15} color={simMode === 'prayer' ? '#FFFFFF' : '#0284C7'} />
                    <Text style={[styles.simSelectorTabText, simMode === 'prayer' && styles.simSelectorTabTextActive]}>
                      {getPillarSimTab('prayer', language)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* 5 Prayers Selector (PRD §7.4 Item 3: choose the prayer Fajr 2, Dhuhr 4, Asr 4, Maghrib 3, Isha 4) */}
              {simMode === 'prayer' && (
                <View style={styles.prayerChoiceWrap}>
                  <Text style={[styles.prayerChoiceHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr ? 'اخْتَرِ الصَّلَاةَ لِمَعْرِفَةِ عَدَدِ رَكَعَاتِهَا:' : 'Choose a prayer to learn:'}
                  </Text>
                  <View style={[styles.prayerChipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    {PRAYERS_LIST.map((pr) => {
                      const isSelected = selectedPrayer === pr.id;
                      return (
                        <TouchableOpacity
                          key={pr.id}
                          style={[styles.prayerChip, isSelected && styles.prayerChipActive]}
                          onPress={() => setSelectedPrayer(pr.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.prayerChipText, isSelected && styles.prayerChipTextActive]}>
                            {isAr ? pr.nameAr : pr.nameEn} ({isAr ? (pr.rakahs === 2 ? '٢' : pr.rakahs === 3 ? '٣' : '٤') : pr.rakahs})
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 10 Top Progress Dots (PDF Page 3) */}
              <View style={[styles.topProgressDotsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {activeSteps.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.topProgressDot,
                      idx < currentStepIdx && styles.topProgressDotCompleted,
                      idx === currentStepIdx && styles.topProgressDotActive,
                    ]}
                  />
                ))}
              </View>

              {/* Step Display Area: Hero Scene */}
              <View style={styles.wuduHeroScene}>
                <Image
                  source={getStepMedia(simMode, currentStep.step)}
                  style={styles.wuduHeroImage}
                  resizeMode="contain"
                />

                {/* Reps Pill Badge (PDF Page 3: "٣ مَرَّاتٍ") */}
                <View style={[styles.repsPill, { [isRtl ? 'right' : 'left']: 12 }]}>
                  <Ionicons name="water" size={13} color="#FFFFFF" />
                  <Text style={styles.repsPillText}>
                    {isAr ? (currentStep.repsAr || `${maxReps} مَرَّاتٍ`) : (currentStep.repsEn || `${maxReps} Times`)}
                  </Text>
                </View>

                {/* Step Counter Pill Badge (PDF Page 3: "الْخُطْوَةُ ٦ مِنْ ١٠") */}
                <View style={[styles.stepCountPill, { [isRtl ? 'left' : 'right']: 12 }]}>
                  <Text style={styles.stepCountPillText}>
                    {isAr
                      ? `الْخُطْوَةُ ${currentStep.step} مِنْ ${activeSteps.length}`
                      : `Step ${currentStep.step} of ${activeSteps.length}`}
                  </Text>
                </View>
              </View>

              {/* Step Instruction Card */}
              <View style={styles.wuduInstructionCard}>
                <Text style={[styles.wuduStepTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? currentStep.titleAr : currentStep.titleEn}
                </Text>
                <Text style={[styles.wuduStepDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? currentStep.descAr : currentStep.descEn}
                </Text>

                {/* Dhikr & Du'a box if available */}
                {(currentStep.dhikrAr || currentStep.dhikrEn) && (
                  <View style={styles.dhikrBox}>
                    <View style={[styles.dhikrHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <Ionicons name="sparkles" size={14} color="#059669" />
                      <Text style={styles.dhikrLabel}>
                        {getPillarDhikrLabel(language)}
                      </Text>
                    </View>
                    <Text style={[styles.dhikrText, { textAlign: isRtl ? 'right' : 'left' }]}>
                      «{isAr ? currentStep.dhikrAr : (currentStep.dhikrEn || currentStep.dhikrAr)}»
                    </Text>
                  </View>
                )}

                {/* Interactive Repetition Checklist (PDF Page 3: "اِضْغَطْ بَعْدَ كُلِّ مَرَّةٍ") */}
                {maxReps > 1 && (
                  <View style={styles.repChecklistWrap}>
                    <Text style={[styles.repChecklistHeading, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {isAr ? 'اِضْغَطْ بَعْدَ كُلِّ مَرَّةٍ:' : 'Tap after each repetition:'}
                    </Text>
                    <View style={[styles.repDropsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      {Array.from({ length: maxReps }, (_, i) => i + 1).map((repNum) => {
                        const isDone = currentStepReps.includes(repNum);
                        return (
                          <TouchableOpacity
                            key={repNum}
                            style={[styles.dropBtn, isDone && styles.dropBtnDone]}
                            onPress={() => toggleRep(currentStepIdx, repNum)}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name={isDone ? 'checkmark-circle' : 'water'}
                              size={18}
                              color={isDone ? '#10B981' : '#0284C7'}
                            />
                            <Text style={[styles.dropBtnText, isDone && styles.dropBtnTextDone]}>
                              {isDone ? (isAr ? '✓' : '✓') : `${repNum}`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Secondary Action buttons: Listen & Reset (PDF Page 3) */}
                <View style={[styles.wuduActionsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity
                    style={[styles.wuduSecActionBtn, isPlayingStepAudio && styles.wuduSecActionBtnActive]}
                    onPress={handlePlayStepAudio}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isPlayingStepAudio ? 'stop-circle' : 'volume-high'}
                      size={16}
                      color={isPlayingStepAudio ? '#DC2626' : '#0284C7'}
                    />
                    <Text style={[styles.wuduSecActionText, isPlayingStepAudio && { color: '#DC2626' }]}>
                      {isAr ? 'اِسْتَمِعْ 🔊' : 'Listen 🔊'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.wuduSecActionBtn}
                    onPress={resetCurrentStepReps}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={16} color="#6B7280" />
                    <Text style={styles.wuduSecActionText}>
                      {isAr ? 'أَعِدِ الْخُطْوَةَ 🔄' : 'Reset 🔄'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Big Primary Coral Button (PDF Page 3: "أَنَا فَعَلْتُهَا! ✓") */}
              <TouchableOpacity
                style={styles.wuduPrimaryCoralBtn}
                onPress={() => {
                  audioService.stopDua();
                  setIsPlayingStepAudio(false);
                  if (currentStepIdx < activeSteps.length - 1) {
                    setCurrentStepIdx((prev) => prev + 1);
                  } else {
                    handleFinishQuiz();
                  }
                }}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={['#F26B4F', '#E85535']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.wuduPrimaryCoralInner, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                >
                  <Text style={styles.wuduPrimaryCoralText}>
                    {currentStepIdx === activeSteps.length - 1
                      ? (isAr ? 'أَتْمَمْتُ الْوُضُوءَ كَامِلًا! 🎉' : 'Completed Wudu! 🎉')
                      : (isAr ? 'أَنَا فَعَلْتُهَا! ✓' : 'I did it! ✓')}
                  </Text>
                  <Ionicons
                    name={isRtl ? 'chevron-back' : 'chevron-forward'}
                    size={22}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Core Lesson Sections */}
          <View style={styles.sectionsList}>
            {pillar.sections.map((sec, sIdx) => (
              <View key={sIdx} style={styles.sectionCard}>
                <View style={[styles.secHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.secIconBox, { backgroundColor: pillar.cardBg }]}>
                    <Ionicons name={sec.icon as keyof typeof Ionicons.glyphMap} size={20} color={pillar.color} />
                  </View>
                  <Text style={[styles.secTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isAr ? sec.titleAr : sec.titleEn}
                  </Text>
                </View>

                <Text style={[styles.secDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isAr ? sec.descAr : sec.descEn}
                </Text>

                {sec.items && sec.items.length > 0 && (
                  <View style={styles.itemsList}>
                    {sec.items.map((item, iIdx) => (
                      <View
                        key={iIdx}
                        style={[
                          styles.itemRow,
                          { flexDirection: isRtl ? 'row-reverse' : 'row' },
                        ]}
                      >
                        <Text style={[styles.itemText, { textAlign: isRtl ? 'right' : 'left' }]}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Interactive Learning Quiz Module */}
          <View style={styles.quizCard}>
            <View style={[styles.quizHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.quizBadge}>
                <Ionicons name="help-circle" size={18} color="#D97706" />
                <Text style={styles.quizBadgeText}>
                  {getPillarQuizTitle(language)}
                </Text>
              </View>
              <Text style={styles.quizRewardTag}>+{pillar.rewardStars} ⭐</Text>
            </View>

            {pillar.quizQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;

              return (
                <View key={qIdx} style={styles.questionBlock}>
                  <Text style={[styles.questionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {qIdx + 1}. {isAr ? q.questionAr : q.questionEn}
                  </Text>

                  <View style={styles.optionsList}>
                    {q.optionsAr.map((optAr, optIdx) => {
                      const optLabel = isAr ? optAr : q.optionsEn[optIdx];
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      return (
                        <TouchableOpacity
                          key={optIdx}
                          style={[
                            styles.optionBtn,
                            isAnswered && isThisCorrect && styles.optionBtnCorrect,
                            isAnswered && isThisSelected && !isThisCorrect && styles.optionBtnWrong,
                          ]}
                          onPress={() => handleSelectAnswer(qIdx, optIdx)}
                          disabled={isAnswered}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              isAnswered && isThisCorrect && styles.optionTextCorrect,
                              isAnswered && isThisSelected && !isThisCorrect && styles.optionTextWrong,
                              { textAlign: isRtl ? 'right' : 'left' },
                            ]}
                          >
                            {optLabel}
                          </Text>
                          {isAnswered && isThisCorrect && (
                            <Ionicons name="checkmark-circle" size={18} color="#059669" />
                          )}
                          {isAnswered && isThisSelected && !isThisCorrect && (
                            <Ionicons name="close-circle" size={18} color="#DC2626" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {isAnswered && (
                    <View style={styles.explanationBox}>
                      <Text style={[styles.explanationText, { textAlign: isRtl ? 'right' : 'left' }]}>
                        💡 {q.explanationAr}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Quiz Completion Action */}
            <TouchableOpacity
              style={styles.claimQuizBtn}
              onPress={handleFinishQuiz}
              activeOpacity={0.85}
            >
              <Ionicons name="trophy" size={20} color="#FFFFFF" />
              <Text style={styles.claimQuizBtnText}>
                {getPillarClaimRewardText(pillar.rewardStars, language)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Celebration Modal */}
        {(() => {
          const celebrationMeta = getPillarCelebrationMeta(localizedPillar.title, language);
          return (
            <StarRewardCelebration
              visible={showCelebration}
              starsEarned={pillar.rewardStars}
              gemsEarned={pillar.rewardGems}
              title={celebrationMeta.title}
              subtitle={celebrationMeta.subtitle}
              onDismiss={() => {
                setShowCelebration(false);
                router.replace('/arkan');
              }}
            />
          );
        })()}
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
    paddingBottom: SPACING.xl,
  },
  heroCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
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
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  heroMediaImage: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  proofBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  proofHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  proofLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FDE68A',
  },
  proofText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 19,
    fontWeight: '600',
  },
  stepsModuleCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    ...SHADOWS.soft,
  },
  simSelectorRow: {
    gap: 8,
    marginBottom: SPACING.md,
  },
  simSelectorTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  simSelectorTabActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  simSelectorTabText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  simSelectorTabTextActive: {
    color: '#FFFFFF',
  },
  dhikrBox: {
    marginTop: SPACING.sm,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    width: '100%',
  },
  dhikrHeader: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  dhikrLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  dhikrText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#065F46',
    lineHeight: 18,
  },
  playAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    alignSelf: 'center',
  },
  playAudioBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  playAudioBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  stepsHeaderRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  stepsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  stepsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  stepsCounterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  // Top 10 Progress Dots (PDF Page 3)
  topProgressDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  topProgressDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  topProgressDotActive: {
    backgroundColor: '#0284C7',
    flex: 1.8,
  },
  topProgressDotCompleted: {
    backgroundColor: '#10B981',
  },

  // Wudu Hero Scene Card (PDF Page 3)
  wuduHeroScene: {
    width: '100%',
    height: 250,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  wuduHeroImage: {
    width: '100%',
    height: '100%',
  },
  repsPill: {
    position: 'absolute',
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    ...SHADOWS.soft,
  },
  repsPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepCountPill: {
    position: 'absolute',
    top: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    ...SHADOWS.soft,
  },
  stepCountPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },

  // Wudu Instruction Card (PDF Page 3)
  wuduInstructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
  },
  wuduStepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.ink900,
    marginBottom: 8,
  },
  wuduStepDesc: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: SPACING.md,
  },

  // Interactive Repetition Checklist
  repChecklistWrap: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  repChecklistHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 10,
  },
  repDropsRow: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  dropBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    ...SHADOWS.soft,
  },
  dropBtnDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  dropBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0369A1',
  },
  dropBtnTextDone: {
    color: '#15803D',
  },

  // Wudu Secondary Actions
  wuduActionsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  wuduSecActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  wuduSecActionBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  wuduSecActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },

  // Big Primary Coral Button (PDF Page 3)
  wuduPrimaryCoralBtn: {
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  wuduPrimaryCoralInner: {
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  wuduPrimaryCoralText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    width: 14,
    backgroundColor: '#0284C7',
  },
  sectionsList: {
    paddingHorizontal: SPACING.md,
    gap: 12,
    marginBottom: SPACING.md,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    ...SHADOWS.soft,
  },
  secHeaderRow: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  secIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  secDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 6,
  },
  itemsList: {
    marginTop: 6,
    gap: 6,
  },
  itemRow: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
    fontWeight: '700',
  },
  quizCard: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    ...SHADOWS.medium,
  },
  quizHeaderRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  quizBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  quizRewardTag: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
  },
  questionBlock: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  optionsList: {
    gap: 6,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  optionTextCorrect: {
    color: '#065F46',
    fontWeight: '800',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  explanationBox: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: RADIUS.md,
    marginTop: 6,
  },
  explanationText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700',
    lineHeight: 16,
  },
  claimQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xs,
    ...SHADOWS.soft,
  },
  claimQuizBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  prayerChoiceWrap: {
    marginBottom: SPACING.sm,
    gap: 4,
  },
  prayerChoiceHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  prayerChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  prayerChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  prayerChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  prayerChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  prayerChipTextActive: {
    color: '#FFFFFF',
  },
});
