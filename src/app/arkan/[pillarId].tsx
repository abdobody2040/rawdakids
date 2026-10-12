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
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { arkanService } from '@/data/arkanData';
import { audioService } from '@/services/audioService';
import { getPillarMedia, getStepMedia } from '@/data/arkanMedia';

export default function PillarDetailScreen() {
  const router = useRouter();
  const { pillarId, mode } = useLocalSearchParams();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';

  const pillar = arkanService.getPillarById(String(pillarId || 'shahada')) || arkanService.getIslamPillars()[0];

  const initialMode = (pillarId === 'wudu' || mode === 'wudu') ? 'wudu' : ((mode === 'prayer' || mode === 'salah') ? 'prayer' : 'wudu');
  const [simMode, setSimMode] = useState<'wudu' | 'prayer'>(initialMode);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlayingStepAudio, setIsPlayingStepAudio] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  const hasBothSims = Boolean(pillar.steps && pillar.prayerSteps);
  const activeSteps = (hasBothSims && simMode === 'prayer') ? (pillar.prayerSteps || []) : (pillar.steps || []);
  const currentStep = activeSteps[currentStepIdx] || activeSteps[0];

  const handlePlayStepAudio = () => {
    if (isPlayingStepAudio) {
      audioService.stopDua();
      setIsPlayingStepAudio(false);
      return;
    }
    const textToPlay = isAr ? currentStep.dhikrAr : (currentStep.dhikrAr || currentStep.dhikrEn);
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
              ? (isAr ? 'تعلَّم الوضوء الطهور' : 'Learn Wudu')
              : (isAr ? pillar.titleAr : pillar.titleEn)
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
              <View style={[styles.heroTopRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {pillar.category === 'islam'
                      ? (isAr ? `الركن ${pillar.number} من أركان الإسلام` : `Pillar ${pillar.number} of Islam`)
                      : (isAr ? `الركن ${pillar.number} من أركان الإيمان` : `Pillar ${pillar.number} of Iman`)}
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

              <Text style={[styles.heroTitle, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? pillar.titleAr : pillar.titleEn}
              </Text>

              <Text style={[styles.heroSubtitle, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? pillar.subtitleAr : pillar.subtitleEn}
              </Text>

              {/* Hadith / Quran Proof Box */}
              <View style={styles.proofBox}>
                <View style={[styles.proofHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="book" size={15} color="#FDE68A" />
                  <Text style={styles.proofLabel}>
                    {isAr ? 'الدليل من الحديث الشريف:' : 'Prophetic Proof:'}
                  </Text>
                </View>
                <Text style={[styles.proofText, { textAlign: isAr ? 'right' : 'left' }]}>
                  «{isAr ? pillar.hadithProofAr : pillar.hadithProofEn}»
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Interactive Steps Carousel (Wudu & Prayer Simulators) */}
          {activeSteps.length > 0 && currentStep && (
            <View style={styles.stepsModuleCard}>
              {/* Dual Simulator Mode Switcher for Salah */}
              {hasBothSims && (
                <View style={[styles.simSelectorRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
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
                      {isAr ? '🌊 كيف أتوضأ؟ (٨ خطوات)' : '🌊 How to do Wudu (8 steps)'}
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
                      {isAr ? '🕌 كيف أصلي؟ (١٠ خطوات)' : '🕌 How to Pray (10 steps)'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={[styles.stepsHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={styles.stepsBadge}>
                  <Ionicons name={simMode === 'prayer' ? 'body' : 'water'} size={16} color="#0284C7" />
                  <Text style={styles.stepsBadgeText}>
                    {simMode === 'prayer'
                      ? (isAr ? 'طريقة وأركان الصلاة' : 'How to Pray (Step-by-Step)')
                      : (isAr ? 'خطوات الوضوء المبارك' : 'Steps of Wudu')}
                  </Text>
                </View>
                <Text style={styles.stepsCounterText}>
                  {isAr
                    ? `خطوة ${currentStepIdx + 1} من ${activeSteps.length}`
                    : `Step ${currentStepIdx + 1} of ${activeSteps.length}`}
                </Text>
              </View>

              {/* Step Display Area */}
              <View style={styles.stepContentBox}>
                <View style={styles.stepMediaBox}>
                  <Image
                    source={getStepMedia(simMode, currentStep.step)}
                    style={styles.stepMediaImage}
                    resizeMode="contain"
                  />
                  <View
                    style={[
                      styles.stepMediaBadge,
                      { [isAr ? 'left' : 'right']: 12 },
                    ]}
                  >
                    <Ionicons
                      name={simMode === 'prayer' ? 'body' : 'water'}
                      size={13}
                      color="#0284C7"
                    />
                    <Text style={styles.stepMediaBadgeText}>
                      {simMode === 'prayer'
                        ? (isAr ? `ركن ${currentStep.step} من ${activeSteps.length}` : `Step ${currentStep.step} of ${activeSteps.length}`)
                        : (isAr ? `خطوة ${currentStep.step} من ${activeSteps.length}` : `Step ${currentStep.step} of ${activeSteps.length}`)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.stepTitle}>
                  {isAr ? currentStep.titleAr : currentStep.titleEn}
                </Text>
                <Text style={[styles.stepDesc, { textAlign: isAr ? 'right' : 'left' }]}>
                  {isAr ? currentStep.descAr : currentStep.descEn}
                </Text>

                {/* Dhikr & Du'a box if available */}
                {(currentStep.dhikrAr || currentStep.dhikrEn) && (
                  <View style={styles.dhikrBox}>
                    <View style={[styles.dhikrHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                      <Ionicons name="sparkles" size={14} color="#059669" />
                      <Text style={styles.dhikrLabel}>
                        {isAr ? 'ما نقوله في هذه الخطوة:' : 'What to say in this step:'}
                      </Text>
                    </View>
                    <Text style={[styles.dhikrText, { textAlign: isAr ? 'right' : 'left' }]}>
                      «{isAr ? currentStep.dhikrAr : (currentStep.dhikrEn || currentStep.dhikrAr)}»
                    </Text>

                    {/* Listen to Step Dhikr Audio */}
                    <TouchableOpacity
                      style={[styles.playAudioBtn, isPlayingStepAudio && styles.playAudioBtnActive]}
                      onPress={handlePlayStepAudio}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isPlayingStepAudio ? 'stop-circle' : 'volume-high'}
                        size={16}
                        color={isPlayingStepAudio ? '#DC2626' : '#059669'}
                      />
                      <Text
                        style={[
                          styles.playAudioBtnText,
                          isPlayingStepAudio && { color: '#DC2626' },
                        ]}
                      >
                        {isPlayingStepAudio
                          ? (isAr ? 'إيقاف الصوت' : 'Stop Audio')
                          : (isAr ? '🔊 استمع لنطق الذكر' : '🔊 Listen to Dhikr')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Step Navigation Controls */}
              <View style={[styles.stepNavRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={[
                    styles.stepNavBtn,
                    currentStepIdx === 0 && styles.stepNavBtnDisabled,
                  ]}
                  onPress={() => {
                    audioService.stopDua();
                    setIsPlayingStepAudio(false);
                    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentStepIdx === 0}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isAr ? 'arrow-forward' : 'arrow-back'}
                    size={16}
                    color={currentStepIdx === 0 ? '#9CA3AF' : '#1F2937'}
                  />
                  <Text
                    style={[
                      styles.stepNavBtnText,
                      currentStepIdx === 0 && { color: '#9CA3AF' },
                    ]}
                  >
                    {isAr ? 'السابق' : 'Previous'}
                  </Text>
                </TouchableOpacity>

                {/* Dots indicator */}
                <View style={styles.dotsRow}>
                  {activeSteps.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        idx === currentStepIdx && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.stepNavBtn,
                    styles.stepNavBtnPrimary,
                    currentStepIdx === activeSteps.length - 1 && styles.stepNavBtnDone,
                  ]}
                  onPress={() => {
                    audioService.stopDua();
                    setIsPlayingStepAudio(false);
                    if (currentStepIdx < activeSteps.length - 1) {
                      setCurrentStepIdx((prev) => prev + 1);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.stepNavBtnPrimaryText}>
                    {currentStepIdx === activeSteps.length - 1
                      ? (simMode === 'prayer'
                          ? (isAr ? 'أتقنت الصلاة ✓' : 'Prayer Completed ✓')
                          : (isAr ? 'أتقنت الوضوء ✓' : 'Wudu Completed ✓'))
                      : (isAr ? 'التالي' : 'Next')}
                  </Text>
                  {currentStepIdx < activeSteps.length - 1 && (
                    <Ionicons
                      name={isAr ? 'arrow-back' : 'arrow-forward'}
                      size={16}
                      color="#FFFFFF"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Core Lesson Sections */}
          <View style={styles.sectionsList}>
            {pillar.sections.map((sec, sIdx) => (
              <View key={sIdx} style={styles.sectionCard}>
                <View style={[styles.secHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.secIconBox, { backgroundColor: pillar.cardBg }]}>
                    <Ionicons name={sec.icon as keyof typeof Ionicons.glyphMap} size={20} color={pillar.color} />
                  </View>
                  <Text style={[styles.secTitle, { textAlign: isAr ? 'right' : 'left' }]}>
                    {isAr ? sec.titleAr : sec.titleEn}
                  </Text>
                </View>

                <Text style={[styles.secDesc, { textAlign: isAr ? 'right' : 'left' }]}>
                  {isAr ? sec.descAr : sec.descEn}
                </Text>

                {sec.items && sec.items.length > 0 && (
                  <View style={styles.itemsList}>
                    {sec.items.map((item, iIdx) => (
                      <View
                        key={iIdx}
                        style={[
                          styles.itemRow,
                          { flexDirection: isAr ? 'row-reverse' : 'row' },
                        ]}
                      >
                        <Text style={[styles.itemText, { textAlign: isAr ? 'right' : 'left' }]}>
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
            <View style={[styles.quizHeaderRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <View style={styles.quizBadge}>
                <Ionicons name="help-circle" size={18} color="#D97706" />
                <Text style={styles.quizBadgeText}>
                  {isAr ? 'اختبر فهمك يا بطل' : 'Check Your Knowledge'}
                </Text>
              </View>
              <Text style={styles.quizRewardTag}>+{pillar.rewardStars} ⭐</Text>
            </View>

            {pillar.quizQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;

              return (
                <View key={qIdx} style={styles.questionBlock}>
                  <Text style={[styles.questionTitle, { textAlign: isAr ? 'right' : 'left' }]}>
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
                              { textAlign: isAr ? 'right' : 'left' },
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
                      <Text style={[styles.explanationText, { textAlign: isAr ? 'right' : 'left' }]}>
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
                {isAr
                  ? `أتممت الركن! احصل على +${pillar.rewardStars} نجوم 🌟`
                  : `Completed! Claim +${pillar.rewardStars} Stars 🌟`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Celebration Modal */}
        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={pillar.rewardStars}
          gemsEarned={pillar.rewardGems}
          title={isAr ? 'بارك الله فيك يا بطل!' : 'Masha’Allah! Champion!'}
          subtitle={
            isAr
              ? `أتممت تعلم واستيعاب ${pillar.titleAr}`
              : `You mastered learning ${pillar.titleEn}`
          }
          onDismiss={() => {
            setShowCelebration(false);
            router.replace('/arkan');
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
  stepContentBox: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  stepMediaBox: {
    width: '100%',
    height: 250,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  stepMediaImage: {
    width: '100%',
    height: '100%',
  },
  stepMediaGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  stepMediaBadge: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    ...SHADOWS.soft,
  },
  stepMediaBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369A1',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  stepNavRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F3F4F6',
  },
  stepNavBtnDisabled: {
    opacity: 0.5,
  },
  stepNavBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  stepNavBtnPrimary: {
    backgroundColor: '#0284C7',
  },
  stepNavBtnDone: {
    backgroundColor: '#059669',
  },
  stepNavBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
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
});
