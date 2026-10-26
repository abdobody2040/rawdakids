// src/app/prayer/wudu.tsx
// Interactive Wudu Step Screen (Mockup Page 3: Step 6 of 10 - غَسْلُ الْوَجْهِ)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { isRTL } from '@/constants/i18n';
import { audioService } from '@/services/audioService';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { getStepMedia } from '@/data/arkanMedia';

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

  // Default to Step 6 (index 5) as requested in PRD & Mockup Page 3
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(5);
  const [filledDrops, setFilledDrops] = useState<number[]>([1]); // step 6 has 1st filled in mockup, user taps next
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

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
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleIconButton}
            onPress={() => router.back()}
            accessibilityLabel={isAr ? 'الرجوع' : 'Back'}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isRtl ? 'chevron-forward' : 'chevron-back'}
              size={24}
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
              color={isPlayingAudio ? '#FFFFFF' : '#0284C7'}
            />
          </TouchableOpacity>
        </View>

        {/* 10 PROGRESS DOTS UNDER TOP BAR */}
        {/* Done = green dot, Current = long sky pill, Next = light dot */}
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
                accessibilityLabel={`Step ${idx + 1}`}
                activeOpacity={0.7}
                style={styles.dotTouchable}
              >
                <View
                  style={[
                    styles.baseDot,
                    isDone && styles.dotDone,
                    isCurrent && styles.dotCurrentPill,
                    !isDone && !isCurrent && styles.dotNext,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SCROLLABLE MAIN CONTENT */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 300px SCENE CARD */}
          <View style={styles.sceneCard}>
            <LinearGradient
              colors={['#E0F2FE', '#BAE6FD', '#E0F2FE']}
              style={styles.sceneGradient}
            >
              {/* Soft clouds & sparkles in sky */}
              <View style={styles.cloudLeft} />
              <View style={styles.cloudRight} />
              <View style={styles.sparkleStar}>
                <Ionicons name="sparkles" size={20} color="#F59E0B" />
              </View>

              {/* 3D Wudu Step Illustration */}
              <View style={styles.imageContainer}>
                <Image
                  source={getStepMedia('wudu', stepData.step)}
                  style={styles.stepImage}
                  resizeMode="contain"
                />
              </View>

              {/* Mascot Noor perched on the left */}
              <View style={styles.mascotAnchor}>
                <Image
                  source={MASCOT_IMG}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </View>

              {/* 3 Reps Badge at bottom right: "٣ مَرَّاتٍ" */}
              <View style={styles.repsBadge}>
                <Text style={styles.repsBadgeNumber}>
                  {stepData.reps === 1 ? '١' : '٣'}
                </Text>
                <Text style={styles.repsBadgeLabel}>
                  {stepData.reps === 1 ? (isAr ? 'مَرَّة' : 'Time') : (isAr ? 'مَرَّاتٍ' : 'Times')}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* STEP BADGE */}
          <View style={styles.stepBadgeWrap}>
            <View style={styles.stepBadgePill}>
              <Text style={styles.stepBadgeText}>
                {isAr
                  ? `الْخُطْوَةُ ${stepData.step} مِنْ ${WUDU_STEPS.length}`
                  : `Step ${stepData.step} of ${WUDU_STEPS.length}`}
              </Text>
            </View>
          </View>

          {/* STEP TITLE (30px) */}
          <Text style={styles.stepTitle}>
            {isAr ? stepData.titleAr : stepData.titleEn}
          </Text>

          {/* ONE SENTENCE INSTRUCTION (17px) */}
          <Text style={styles.stepInstruction}>
            {isAr ? stepData.descAr : stepData.descEn}
          </Text>

          {/* COUNTER WITH 3 WATER DROPS (Tapped by child to fill - Matching Mockup Page 3 Row) */}
          <View style={[styles.counterRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <Text style={styles.counterPrompt}>
              {isAr ? 'اِضْغَطْ بَعْدَ كُلِّ مَرَّةٍ' : 'Tap after each time'}
            </Text>

            <View style={[styles.dropsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {Array.from({ length: maxDrops }).map((_, index) => {
                const dropNum = index + 1;
                const isFilled = filledDrops.includes(dropNum);
                return (
                  <TouchableOpacity
                    key={dropNum}
                    style={[styles.waterDropBtn, isFilled && styles.waterDropBtnFilled]}
                    onPress={() => handleToggleDrop(dropNum)}
                    accessibilityLabel={isAr ? `تكرار ${dropNum}` : `Repetition ${dropNum}`}
                    accessibilityRole="button"
                    activeOpacity={0.8}
                  >
                    {isFilled ? (
                      <Ionicons name="checkmark" size={26} color="#FFFFFF" />
                    ) : (
                      <Ionicons name="water-outline" size={26} color="#0284C7" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* LISTEN & REPEAT BUTTONS */}
          <View style={[styles.actionButtonsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* Listen Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isPlayingAudio && styles.actionBtnActive]}
              onPress={handlePlayAudio}
              accessibilityLabel={isAr ? 'استمع' : 'Listen'}
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              <Ionicons
                name="volume-high"
                size={20}
                color={isPlayingAudio ? '#FFFFFF' : '#0284C7'}
              />
              <Text style={[styles.actionBtnText, isPlayingAudio && styles.actionBtnTextActive]}>
                {isAr ? 'اِسْتَمِعْ' : 'Listen'}
              </Text>
            </TouchableOpacity>

            {/* Repeat Step Button */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleRepeatStep}
              accessibilityLabel={isAr ? 'أعد الخطوة' : 'Repeat step'}
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              <Ionicons name="reload" size={18} color="#0284C7" />
              <Text style={styles.actionBtnText}>
                {isAr ? 'أَعِدِ الْخُطْوَةَ' : 'Repeat Step'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* FIXED BOTTOM MAIN BUTTON + BACK BUTTON */}
        <View style={styles.bottomBarContainer}>
          <View style={[styles.bottomBarRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* 60px Back button */}
            <TouchableOpacity
              style={styles.bottomBackBtn}
              onPress={handlePrevStep}
              accessibilityLabel={isAr ? 'السابق' : 'Previous'}
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              <Ionicons
                name={isRtl ? 'chevron-forward' : 'chevron-back'}
                size={26}
                color="#475569"
              />
            </TouchableOpacity>

            {/* 60px Coral Main Button: "أَنَا فَعَلْتُهَا!" */}
            <TouchableOpacity
              style={styles.coralMainBtn}
              onPress={handleCompleted}
              accessibilityLabel={isAr ? 'أنا فعلتها!' : 'I did it!'}
              accessibilityRole="button"
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#E03E2D', '#C53020']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.coralGradient}
              >
                <Text style={styles.coralBtnText}>
                  {isAr ? 'أَنَا فَعَلْتُهَا!' : 'I Did It!'}
                </Text>
                <Ionicons name="checkmark" size={24} color="#FFFFFF" style={{ marginHorizontal: 8 }} />
              </LinearGradient>
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
    color: '#0284C7',
  },
  progressDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  dotTouchable: {
    paddingVertical: 4,
  },
  baseDot: {
    height: 8,
    borderRadius: 4,
  },
  dotDone: {
    width: 8,
    backgroundColor: '#10B981', // green for done
  },
  dotCurrentPill: {
    width: 32, // long sky pill for current
    backgroundColor: '#0284C7',
  },
  dotNext: {
    width: 8,
    backgroundColor: '#BAE6FD', // light blue for next
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  // 300px Scene Card
  sceneCard: {
    height: 300,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(2, 132, 199, 0.12)' },
      default: { elevation: 3 },
    }),
  },
  sceneGradient: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudLeft: {
    position: 'absolute',
    top: 24,
    left: 20,
    width: 70,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  cloudRight: {
    position: 'absolute',
    top: 40,
    right: 28,
    width: 55,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  sparkleStar: {
    position: 'absolute',
    top: 28,
    left: '42%',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  stepImage: {
    width: '92%',
    height: '92%',
  },
  tapAssembly: {
    alignItems: 'center',
    position: 'relative',
  },
  pipeHorizontal: {
    width: 140,
    height: 16,
    backgroundColor: '#94A3B8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#64748B',
  },
  tapBody: {
    width: 22,
    height: 34,
    backgroundColor: '#CBD5E1',
    borderWidth: 2,
    borderColor: '#64748B',
    marginTop: -2,
    borderRadius: 4,
  },
  tapSpout: {
    width: 14,
    height: 12,
    backgroundColor: '#94A3B8',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  tapKnobRed: {
    position: 'absolute',
    top: -14,
    right: 18,
    width: 24,
    height: 14,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#991B1B',
  },
  waterStream: {
    width: 10,
    height: 70,
    borderRadius: 5,
    marginVertical: 2,
  },
  miniDrop: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  crescentBasin: {
    width: 160,
    height: 70,
    marginTop: 2,
  },
  basinWoodOuter: {
    flex: 1,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  basinWaterInner: {
    width: '90%',
    height: 38,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  basinWaterGradient: {
    flex: 1,
  },
  mascotAnchor: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FEF08A',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  repsBadge: {
    position: 'absolute',
    bottom: 18,
    right: 20,
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  repsBadgeNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  repsBadgeLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  stepBadgeWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  stepBadgePill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepBadgeText: {
    color: '#0369A1',
    fontSize: 14,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepInstruction: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 27,
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
    paddingHorizontal: 8,
  },
  counterPrompt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
  },
  dropsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  waterDropBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#0284C7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 10px rgba(2, 132, 199, 0.15)' },
      default: { elevation: 2 },
    }),
  },
  waterDropBtnFilled: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7',
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  // Fixed Bottom Bar
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBackBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coralMainBtn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 6px 16px rgba(224, 62, 45, 0.35)' },
      default: { elevation: 4 },
    }),
  },
  coralGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coralBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
