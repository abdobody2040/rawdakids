// src/app/prayer/wudu.tsx
// Interactive Wudu Step Screen (Mockup Page 3: Step 6 of 10 - غَسْلُ الْوَجْهِ)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { isRTL } from '@/constants/i18n';
import { audioService } from '@/services/audioService';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { getStepMedia } from '@/data/arkanMedia';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const WUDU_SAVED_STEP_KEY = '@rawda_wudu_last_step';
const MASCOT_IMG = require('../../../assets/images/mascot-noor.jpg');

interface WuduStepData {
  step: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  reps: number;
  repsAr: string;
  repsEn: string;
}

const WUDU_STEPS: WuduStepData[] = [
  {
    step: 1,
    titleAr: 'النِّيَّةُ فِي الْقَلْبِ',
    titleEn: 'Intention in the Heart',
    descAr: 'أَنْوِي الْوُضُوءَ فِي قَلْبِي طَهَارَةً وَطَاعَةً لِلَّهِ تَعَالَى.',
    descEn: 'Make the sincere intention in your heart for the sake of Allah.',
    reps: 1,
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
  },
  {
    step: 2,
    titleAr: 'التَّسْمِيَةُ',
    titleEn: 'Saying Bismillah',
    descAr: 'أَقُولُ عِنْدَ بَدْءِ الْوُضُوءِ: «بِسْمِ اللَّهِ» كَمَا عَلَّمَنَا رَسُولُ اللَّهِ ﷺ.',
    descEn: 'Say "Bismillah" as taught by the Messenger of Allah ﷺ.',
    reps: 1,
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
  },
  {
    step: 3,
    titleAr: 'غَسْلُ الْكَفَّيْنِ',
    titleEn: 'Washing Hands',
    descAr: 'اغْسِلْ كَفَّيْكَ ثَلَاثَ مَرَّاتٍ جَيِّدًا مَعَ تَخْلِيلِ الْأَصَابِعِ بِالْمَاءِ النَّقِيِّ.',
    descEn: 'Wash hands thoroughly up to the wrists 3 times, rubbing between fingers.',
    reps: 3,
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
  },
  {
    step: 4,
    titleAr: 'الْمَضْمَضَةُ',
    titleEn: 'Rinsing Mouth',
    descAr: 'خُذْ غَرْفَةً مِنَ الْمَاءِ بِيَدِكَ الْيُمْنَى وَتَمَضْمَضْ بِهَا ثُمَّ امْجُجْهَا ثَلَاثَ مَرَّاتٍ.',
    descEn: 'Take water with your right hand and rinse your mouth 3 times.',
    reps: 3,
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
  },
  {
    step: 5,
    titleAr: 'الِاسْتِنْشَاقُ',
    titleEn: 'Sniffing Water',
    descAr: 'اسْتَنْشِقِ الْمَاءَ بِأَنْفِكَ بِيَدِكَ الْيُمْنَى ثُمَّ اسْتَنْثِرْهُ بِيَدِكَ الْيُسْرَى ثَلَاثًا.',
    descEn: 'Sniff water into nostrils with right hand and blow it out with left hand 3 times.',
    reps: 3,
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
  },
  {
    step: 6,
    titleAr: 'غَسْلُ الْوَجْهِ',
    titleEn: 'Washing the Face',
    descAr: 'خُذِ الْمَاءَ بِكَفَّيْكَ، وَاغْسِلْ وَجْهَكَ كُلَّهُ مِنْ أَعْلَى الْجَبْهَةِ إِلَى أَسْفَلِ الذَّقَنِ.',
    descEn: 'Take water with both hands and wash your entire face from forehead to chin.',
    reps: 3,
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
  },
  {
    step: 7,
    titleAr: 'غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ',
    titleEn: 'Washing Arms to Elbows',
    descAr: 'اغْسِلْ يَدَكَ الْيُمْنَى إِلَى الْمِرْفَقِ ثَلَاثًا، ثُمَّ يَدَكَ الْيُسْرَى كَذَلِكَ.',
    descEn: 'Wash the right arm to the elbow 3 times, then the left arm 3 times.',
    reps: 3,
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
  },
  {
    step: 8,
    titleAr: 'مَسْحُ الرَّأْسِ',
    titleEn: 'Wiping the Head',
    descAr: 'امْسَحْ رَأْسَكَ بِيَدَيْكَ الْمَبْلُولَتَيْنِ مِنَ الْمُقَدَّمَةِ إِلَى الْقَفَا ثُمَّ ارْجِعْ مَرَّةً وَاحِدَةً.',
    descEn: 'Wipe hands over your head once, from front to back and return.',
    reps: 1,
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
  },
  {
    step: 9,
    titleAr: 'مَسْحُ الْأُذُنَيْنِ',
    titleEn: 'Wiping the Ears',
    descAr: 'امْسَحْ بَاطِنَ أُذُنَيْكَ بِالسَّبَّابَتَيْنِ وَظَاهِرَهُمَا بِالْإِبْهَامَيْنِ مَرَّةً وَاحِدَةً.',
    descEn: 'Wipe inside your ears with index fingers and behind ears with thumbs once.',
    reps: 1,
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
  },
  {
    step: 10,
    titleAr: 'غَسْلُ الرِّجْلَيْنِ وَالدُّعَاءُ',
    titleEn: 'Washing Feet & Dua',
    descAr: 'اغْسِلْ رِجْلَكَ الْيُمْنَى إِلَى الْكَعْبَيْنِ ثَلَاثًا، ثُمَّ الْيُسْرَى، ثُمَّ قُلْ دُعَاءَ الْوُضُوءِ.',
    descEn: 'Wash right foot to ankle 3 times, then left foot, then say the post-wudu Dua.',
    reps: 3,
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
  },
];

export default function WuduStepScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  useDocumentTitle(isAr ? 'الوضوء' : 'Wudu');

  // New users start at Step 1 (index 0). Mid-lesson users can resume.
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [filledDrops, setFilledDrops] = useState<number[]>([]);
  const [resumeBannerStep, setResumeBannerStep] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(WUDU_SAVED_STEP_KEY);
        if (saved !== null) {
          const stepNum = parseInt(saved, 10);
          if (!isNaN(stepNum) && stepNum > 0 && stepNum < WUDU_STEPS.length) {
            setResumeBannerStep(stepNum);
            setCurrentStepIdx(stepNum);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(WUDU_SAVED_STEP_KEY, String(currentStepIdx)).catch(() => {});
  }, [currentStepIdx]);

  const stepData = WUDU_STEPS[currentStepIdx] || WUDU_STEPS[5];
  const maxDrops = stepData.reps;

  // Toggle water drop
  const handleToggleDrop = (dropNumber: number) => {
    setFilledDrops((prev) => {
      if (prev.includes(dropNumber)) {
        return prev.filter((d) => d !== dropNumber);
      } else {
        const next = [...prev, dropNumber].sort((a, b) => a - b);
        if (next.length === maxDrops) {
          // Play pleasant audio cue when completed
          audioService.playPositiveChime();
        }
        return next;
      }
    });
  };

  // Play instruction narration
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = isAr
      ? `${stepData.titleAr}. ${stepData.descAr}`
      : `${stepData.titleEn}. ${stepData.descEn}`;

    setIsPlayingAudio(true);
    audioService.playDua(textToSpeak, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
  };

  // Repeat step: reset drops & replay audio
  const handleRepeatStep = () => {
    setFilledDrops([]);
    handlePlayAudio();
  };

  // Main coral button: "أَنَا فَعَلْتُهَا!"
  const handleCompleted = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    audioService.playCelebrationFanfare();
    addStars(5);
    addGems(2);
    setShowCelebration(true);

    setTimeout(() => {
      setShowCelebration(false);
      if (currentStepIdx < WUDU_STEPS.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
        setFilledDrops([]);
      } else {
        router.back();
      }
    }, 2200);
  };

  const handlePrevStep = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      setFilledDrops([]);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={[styles.topBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]} role="banner">
          <TouchableOpacity
            style={styles.circleIconButton}
            onPress={() => router.back()}
            accessibilityLabel={isAr ? 'الرجوع' : 'Back'}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isRtl ? 'chevron-forward' : 'chevron-back'}
              size={22}
              color="#334155"
            />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>
            {isAr ? 'الْوُضُوءُ' : 'Wudu'}
          </Text>

          <TouchableOpacity
            style={[styles.circleIconButton, isPlayingAudio && styles.circleIconButtonActive]}
            onPress={handlePlayAudio}
            accessibilityLabel={isAr ? 'استمع إلى الشرح' : 'Listen to instruction'}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlayingAudio ? 'volume-high' : 'volume-medium-outline'}
              size={22}
              color={isPlayingAudio ? '#FFFFFF' : '#5F5E5A'}
            />
          </TouchableOpacity>
        </View>

        {/* 10 PROGRESS DOTS (Mockup line 14-16) */}
        <View style={[styles.progressDotsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
          {WUDU_STEPS.map((_, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setCurrentStepIdx(idx);
                  setFilledDrops([]);
                }}
                accessibilityRole="button"
                accessibilityLabel={isAr ? `الخطوة ${idx + 1}` : `Step ${idx + 1}`}
                activeOpacity={0.7}
                style={styles.dotTouchable}
              >
                {isDone ? (
                  <View style={styles.dotDoneCirc}>
                    <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                  </View>
                ) : isCurrent ? (
                  <View style={styles.dotCurrentCirc}>
                    <Text style={styles.dotCurrentText}>{idx + 1}</Text>
                  </View>
                ) : (
                  <View style={styles.dotTodoCirc} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SCROLLABLE MAIN CONTENT */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          role="main"
        >
          {/* RESUME BANNER IF OPENED MID-LESSON */}
          {resumeBannerStep !== null && (
            <View style={styles.resumeCard}>
              <View style={[styles.resumeCardHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="time-outline" size={20} color="#0D9488" />
                <Text style={styles.resumeCardTitle}>
                  {isAr
                    ? `متابعة من الخطوة ${currentStepIdx + 1}`
                    : `Continue from step ${currentStepIdx + 1}`}
                </Text>
              </View>
              <Text style={[styles.resumeCardDesc, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr
                  ? `أنت حالياً عند خطوة "${stepData.titleAr}". يمكنك المتابعة أو البدء من الخطوة الأولى.`
                  : `You were at "${stepData.titleEn}". You can continue or start fresh.`}
              </Text>
              <View style={[styles.resumeButtonsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={styles.resumeStartOverBtn}
                  onPress={() => {
                    setCurrentStepIdx(0);
                    setFilledDrops([]);
                    setResumeBannerStep(null);
                    AsyncStorage.setItem(WUDU_SAVED_STEP_KEY, '0').catch(() => {});
                  }}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? 'البدء من جديد من الخطوة الأولى' : 'Start over from step 1'}
                >
                  <Ionicons name="reload" size={14} color="#DC2626" />
                  <Text style={styles.resumeStartOverText}>
                    {isAr ? 'البدء من جديد' : 'Start over'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resumeContinueBtn}
                  onPress={() => setResumeBannerStep(null)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={isAr ? `متابعة من الخطوة ${currentStepIdx + 1}` : `Continue from step ${currentStepIdx + 1}`}
                >
                  <Text style={styles.resumeContinueText}>
                    {isAr ? 'متابعة الخطوة' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Scene Illustration Card (Clean, no floating badges on top) */}
          <View style={styles.sceneCard}>
            <Image
              source={getStepMedia('wudu', stepData.step)}
              style={styles.stepImage}
              resizeMode="contain"
            />
          </View>

          {/* STEP BADGE & TITLE */}
          <View style={styles.stepInfoBlock}>
            <View style={styles.stepBadgePill}>
              <Text style={styles.stepBadgeText}>
                {isAr
                  ? `الْخُطْوَةُ ${stepData.step} مِنْ ${WUDU_STEPS.length}`
                  : `Step ${stepData.step} of ${WUDU_STEPS.length}`}
              </Text>
            </View>

            <Text style={styles.stepTitle} role="heading" aria-level={1}>
              {isAr ? stepData.titleAr : stepData.titleEn}
            </Text>

            {/* 3 WATER DROPS ROW (Mockup line 19) */}
            <View style={[styles.mockupDropsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Text style={styles.mockupRepsLabel}>
                {stepData.reps === 1
                  ? (isAr ? 'مرة واحدة' : '1 Time')
                  : (isAr ? '3 مرات' : '3 Times')}
              </Text>
              <View style={[styles.dropsIconsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {Array.from({ length: maxDrops }).map((_, index) => {
                  const dropNum = index + 1;
                  const isFilled = filledDrops.includes(dropNum);
                  return (
                    <TouchableOpacity
                      key={dropNum}
                      onPress={() => handleToggleDrop(dropNum)}
                      activeOpacity={0.8}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons
                        name={isFilled ? 'water' : 'water-outline'}
                        size={28}
                        color={isFilled ? '#185FA5' : 'rgba(0,0,0,0.22)'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ONE SENTENCE INSTRUCTION (Mockup line 20) */}
            <Text style={styles.stepInstruction}>
              {isAr ? stepData.descAr : stepData.descEn}
            </Text>

            {/* REPEAT AUDIO BUTTON (Mockup line 20: "اسمعها مرة أخرى") */}
            <TouchableOpacity
              style={[styles.repeatAudioPill, isPlayingAudio && styles.repeatAudioPillPlaying]}
              onPress={handlePlayAudio}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlayingAudio ? 'volume-high' : 'volume-medium-outline'}
                size={16}
                color={isPlayingAudio ? '#FFFFFF' : '#0F6E56'}
              />
              <Text style={[styles.repeatAudioPillText, isPlayingAudio && styles.repeatAudioPillTextPlaying]}>
                {isAr ? 'اسمعها مرة أخرى' : 'Listen Again'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* FIXED BOTTOM ACTION BAR (Mockup line 21) */}
        <View style={styles.bottomBarContainer}>
          <View style={[styles.bottomBarRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* Primary Action Button: "أنا فعلتها" in Action Green #0F9D6B */}
            <TouchableOpacity
              style={styles.greenMainBtn}
              onPress={handleCompleted}
              accessibilityLabel={isAr ? 'أنا فعلتها' : 'I did it'}
              accessibilityRole="button"
              activeOpacity={0.88}
            >
              <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              <Text style={styles.greenMainBtnText}>
                {isAr ? 'أَنَا فَعَلْتُهَا' : 'I Did It'}
              </Text>
            </TouchableOpacity>

            {/* Nav back/prev chevron arrow */}
            <TouchableOpacity
              style={[
                styles.bottomNavBtn,
                currentStepIdx === 0 && styles.bottomNavBtnDisabled,
              ]}
              onPress={handlePrevStep}
              accessibilityLabel={isAr ? 'السابق' : 'Previous'}
              accessibilityRole="button"
              activeOpacity={0.8}
            >
              <Ionicons
                name={isRtl ? 'chevron-forward' : 'chevron-back'}
                size={22}
                color="#888780"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* CELEBRATION MODAL */}
        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={5}
          gemsEarned={2}
          onDismiss={() => setShowCelebration(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  circleIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  circleIconButtonActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#185FA5',
  },
  progressDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 6,
  },
  dotTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDoneCirc: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrentCirc: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#185FA5',
    backgroundColor: '#E6F1FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#185FA5',
  },
  dotTodoCirc: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F5F4EE',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.28)',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  sceneCard: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F5F4EE',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: 4,
    marginBottom: 14,
  },
  stepImage: {
    width: '90%',
    height: '90%',
  },
  stepInfoBlock: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  stepBadgePill: {
    backgroundColor: '#E6F1FB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  stepBadgeText: {
    color: '#185FA5',
    fontSize: 13,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 6,
  },
  mockupDropsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  mockupRepsLabel: {
    fontSize: 13,
    color: '#5F5E5A',
    fontWeight: '600',
  },
  dropsIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepInstruction: {
    fontSize: 16,
    fontWeight: '400',
    color: '#5F5E5A',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
  },
  repeatAudioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  repeatAudioPillPlaying: {
    backgroundColor: '#0F6E56',
  },
  repeatAudioPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F6E56',
  },
  repeatAudioPillTextPlaying: {
    color: '#FFFFFF',
  },
  bottomBarContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greenMainBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0F9D6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  greenMainBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomNavBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F5F4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBtnDisabled: {
    opacity: 0.35,
  },

  // Resume mid-lesson card
  resumeCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  resumeCardHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resumeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F766E',
  },
  resumeCardDesc: {
    fontSize: 12,
    color: '#134E4A',
    lineHeight: 18,
    marginBottom: 10,
  },
  resumeButtonsRow: {
    alignItems: 'center',
    gap: 10,
  },
  resumeStartOverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  resumeStartOverText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  resumeContinueBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  resumeContinueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
