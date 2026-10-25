// src/app/prayer/salah.tsx
// Interactive Salah Step Screen (Mockup Page 4: Dhuhr, Rak'ah 1 of 4, Position 3 of 5 - السُّجُودُ)

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

const MASCOT_IMG = require('../../../assets/images/mascot-noor.jpg');

interface SalahPositionData {
  positionNum: number;
  totalPositions: number;
  nameAr: string;
  nameEn: string;
  instructionAr: string;
  instructionEn: string;
  dhikrLabelAr: string;
  dhikrLabelEn: string;
  dhikrAr: string;
  dhikrEn: string;
  dhikrRepsAr: string;
  dhikrRepsEn: string;
}

const SALAH_POSITIONS: SalahPositionData[] = [
  {
    positionNum: 1,
    totalPositions: 5,
    nameAr: 'تَكْبِيرَةُ الْإِحْرَامِ وَالْقِيَامُ',
    nameEn: 'Opening Takbir & Standing',
    instructionAr: 'اسْتَقْبِلِ الْقِبْلَةَ، وَارْفَعْ يَدَيْكَ حَذْوَ أُذُنَيْكَ أَوْ مَنْكِبَيْكَ وَقُلْ: «اللَّهُ أَكْبَرُ»، ثُمَّ اقْرَأِ الْفَاتِحَةَ.',
    instructionEn: 'Face Qiblah, raise hands to ears/shoulders saying Allahu Akbar, then recite Al-Fatihah.',
    dhikrLabelAr: 'قُلْ فِي قِيَامِكَ',
    dhikrLabelEn: 'Say in standing',
    dhikrAr: 'اللَّهُ أَكْبَرُ',
    dhikrEn: 'Allahu Akbar',
    dhikrRepsAr: 'مَرَّةٌ وَاحِدَةٌ',
    dhikrRepsEn: '1 Time',
  },
  {
    positionNum: 2,
    totalPositions: 5,
    nameAr: 'الرُّكُوعُ',
    nameEn: 'Bowing (Rukoo)',
    instructionAr: 'انْحَنِ وَضَعْ كَفَّيْكَ عَلَى رُكْبَتَيْكَ مَعَ اسْتِوَاءِ ظَهْرِكَ، وَعَظِّمِ الرَّبَّ سُبْحَانَهُ بِطُمَأْنِينَةٍ.',
    instructionEn: 'Bow with a flat back, placing hands on knees, glorifying Allah peacefully.',
    dhikrLabelAr: 'قُلْ فِي رُكُوعِكَ',
    dhikrLabelEn: 'Say in bowing',
    dhikrAr: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    dhikrEn: 'Subhana Rabbiyal Azeem',
    dhikrRepsAr: '٣ مَرَّاتٍ',
    dhikrRepsEn: '3 Times',
  },
  {
    positionNum: 3,
    totalPositions: 5,
    nameAr: 'السُّجُودُ',
    nameEn: 'Prostration (Sujud)',
    instructionAr: 'ضَعْ جَبْهَتَكَ وَأَنْفَكَ وَكَفَّيْكَ وَرُكْبَتَيْكَ وَأَصَابِعَ قَدَمَيْكَ عَلَى الْأَرْضِ.',
    instructionEn: 'Place your forehead, nose, two palms, knees, and toes firmly upon the ground.',
    dhikrLabelAr: 'قُلْ فِي سُجُودِكَ',
    dhikrLabelEn: 'Say in your sujud',
    dhikrAr: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    dhikrEn: 'Subhana Rabbiyal A’la',
    dhikrRepsAr: '٣ مَرَّاتٍ',
    dhikrRepsEn: '3 Times',
  },
  {
    positionNum: 4,
    totalPositions: 5,
    nameAr: 'الْجُلُوسُ بَيْنَ السَّجْدَتَيْنِ',
    nameEn: 'Sitting Between Prostrations',
    instructionAr: 'ارْفَعْ رَأْسَكَ مُكَبِّرًا وَاجْلِسْ بَيْنَ السَّجْدَتَيْنِ مُطْمَئِنًّا، وَاسْأَلِ اللَّهَ الْمَغْفِرَةَ وَالرَّحْمَةَ.',
    instructionEn: 'Rise saying Allahu Akbar, sit calmly between two prostrations, asking for forgiveness.',
    dhikrLabelAr: 'قُلْ بَيْنَ السَّجْدَتَيْنِ',
    dhikrLabelEn: 'Say between prostrations',
    dhikrAr: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    dhikrEn: 'Rabbigh-fir lee, Rabbigh-fir lee',
    dhikrRepsAr: 'مَرَّتَيْنِ',
    dhikrRepsEn: '2 Times',
  },
  {
    positionNum: 5,
    totalPositions: 5,
    nameAr: 'التَّشَهُّدُ وَالتَّسْلِيمُ',
    nameEn: 'Tashahhud & Tasleem',
    instructionAr: 'اجْلِسْ فِي خِتَامِ الصَّلَاةِ، وَاقْرَأِ التَّحِيَّاتِ وَالصَّلَاةَ الْإِبْرَاهِيمِيَّةَ، ثُمَّ سَلِّمْ عَنْ يَمِينِكَ وَيَسَارِكَ.',
    instructionEn: 'Sit at the end of prayer, recite Tashahhud and blessings, then give Salam to right and left.',
    dhikrLabelAr: 'قُلْ فِي التَّشَهُّدِ',
    dhikrLabelEn: 'Say in Tashahhud',
    dhikrAr: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...',
    dhikrEn: 'At-tahiyyatu lillahi was-salawat...',
    dhikrRepsAr: 'مَرَّةٌ وَاحِدَةٌ',
    dhikrRepsEn: '1 Time',
  },
];

export default function SalahStepScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  // Default to Position 3 (index 2: "السُّجُودُ") in Dhuhr, Rak'ah 1 of 4
  const [currentPosIdx, setCurrentPosIdx] = useState<number>(2);
  const [currentRakah] = useState<number>(1);
  const [totalRakahs] = useState<number>(4);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const posData = SALAH_POSITIONS[currentPosIdx] || SALAH_POSITIONS[2];

  // Play Dhikr / Instruction audio
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${posData.dhikrAr}. ${posData.nameAr}. ${posData.instructionAr}`;

    setIsPlayingAudio(true);
    audioService.playDua(textToSpeak, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
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
      if (currentPosIdx < SALAH_POSITIONS.length - 1) {
        setCurrentPosIdx((prev) => prev + 1);
      } else {
        router.back();
      }
    }, 2200);
  };

  const handlePrev = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    if (currentPosIdx > 0) {
      setCurrentPosIdx((prev) => prev - 1);
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
            {isAr ? 'الصَّلَاةُ' : 'Salah'}
          </Text>

          <TouchableOpacity
            style={[styles.circleIconButton, isPlayingAudio && styles.circleIconButtonActive]}
            onPress={handlePlayAudio}
            accessibilityLabel={isAr ? 'استمع إلى الذكر' : 'Listen to Dhikr'}
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

        {/* 5-DOT PROGRESS UNDER TOP BAR */}
        {/* Done = green dot, Current = long sky pill, Next = light dot */}
        <View style={[styles.progressDotsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
          {SALAH_POSITIONS.map((_, idx) => {
            const isDone = idx < currentPosIdx;
            const isCurrent = idx === currentPosIdx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setCurrentPosIdx(idx)}
                accessibilityLabel={`Position ${idx + 1}`}
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
          {/* 300px SCENE CARD: SUJUD WITH 7 GOLD CONTACT POINTS */}
          <View style={styles.sceneCard}>
            <LinearGradient
              colors={['#E0F2FE', '#BAE6FD', '#E0F7FA']}
              style={styles.sceneGradient}
            >
              {/* Sky background clouds and sparkling star */}
              <View style={styles.cloudLeft} />
              <View style={styles.cloudRight} />
              <View style={styles.sparkleStar}>
                <Ionicons name="sparkles" size={22} color="#F59E0B" />
              </View>

              {/* Mascot Noor perched top right */}
              <View style={styles.mascotAnchor}>
                <Image
                  source={MASCOT_IMG}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </View>

              {/* Floor prayer area */}
              <View style={styles.floorArea}>
                {/* Green Prayer Mat */}
                <View style={styles.prayerMatOuter}>
                  <View style={styles.prayerMatInner}>
                    <View style={styles.prayerMatArch} />
                  </View>
                </View>

                {/* Child Figure in Prostration (Sujud) */}
                <View style={styles.sujudFigureWrap}>
                  {/* Head with brown prayer cap */}
                  <View style={styles.sujudHead}>
                    <View style={styles.prayerCap} />
                    <View style={styles.faceTouch} />
                  </View>

                  {/* Hands / Palms touching mat */}
                  <View style={styles.sujudPalms} />

                  {/* Torso / Upper body (green robe) */}
                  <View style={styles.sujudTorso} />

                  {/* Legs / Lower garment (white) */}
                  <View style={styles.sujudLegs} />

                  {/* Feet / Toes bent forward */}
                  <View style={styles.sujudFeet} />

                  {/* GOLD DOTS ON THE 7 CONTACT POINTS */}
                  {/* Point 1: Forehead and nose */}
                  <View style={[styles.goldPointWrap, { left: 40, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>

                  {/* Points 2 & 3: Two palms / hands */}
                  <View style={[styles.goldPointWrap, { left: 66, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>
                  <View style={[styles.goldPointWrap, { left: 82, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>

                  {/* Points 4 & 5: Two knees */}
                  <View style={[styles.goldPointWrap, { left: 160, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>
                  <View style={[styles.goldPointWrap, { left: 178, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>

                  {/* Points 6 & 7: Two feet / toes */}
                  <View style={[styles.goldPointWrap, { left: 202, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>
                  <View style={[styles.goldPointWrap, { left: 218, bottom: 22 }]}>
                    <View style={styles.goldPointRing} />
                    <View style={styles.goldPointCore} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* CHIPS ROW: Prayer name, Rak'ah number, Position number */}
          <View style={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* Prayer Name Chip */}
            <View style={[styles.chipPill, styles.chipPrayer]}>
              <Text style={styles.chipTextPrayer}>
                {isAr ? 'الظُّهْرُ' : 'Dhuhr'}
              </Text>
            </View>

            {/* Rak'ah Number Chip */}
            <View style={[styles.chipPill, styles.chipRakah]}>
              <Text style={styles.chipTextRakah}>
                {isAr ? `الرَّكْعَةُ ${currentRakah} مِنْ ${totalRakahs}` : `Rak'ah ${currentRakah} of ${totalRakahs}`}
              </Text>
            </View>

            {/* Position Number Chip */}
            <View style={[styles.chipPill, styles.chipPosition]}>
              <Text style={styles.chipTextPosition}>
                {isAr ? `الْوَضْعُ ${posData.positionNum} مِنْ ${posData.totalPositions}` : `Position ${posData.positionNum} of ${posData.totalPositions}`}
              </Text>
            </View>
          </View>

          {/* TITLE (30px) */}
          <Text style={styles.salahTitle}>
            {isAr ? posData.nameAr : posData.nameEn}
          </Text>

          {/* ONE SENTENCE INSTRUCTION (17px) */}
          <Text style={styles.salahInstruction}>
            {isAr ? posData.instructionAr : posData.instructionEn}
          </Text>

          {/* DHIKR CARD */}
          <View style={styles.dhikrCard}>
            <View style={[styles.dhikrCardRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {/* Play Button */}
              <TouchableOpacity
                style={[styles.dhikrPlayBtn, isPlayingAudio && styles.dhikrPlayBtnActive]}
                onPress={handlePlayAudio}
                accessibilityLabel={isAr ? 'تشغيل الذكر' : 'Play Dhikr'}
                accessibilityRole="button"
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlayingAudio ? 'pause' : 'volume-high'}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {/* Dhikr text + Small Label */}
              <View style={styles.dhikrTextCol}>
                <Text style={styles.dhikrSmallLabel}>
                  {isAr ? posData.dhikrLabelAr : posData.dhikrLabelEn}
                </Text>
                <Text style={styles.dhikrArabicPhrase}>
                  {posData.dhikrAr}
                </Text>
              </View>

              {/* "٣ مَرَّاتٍ" Chip */}
              <View style={styles.dhikrRepsChip}>
                <Text style={styles.dhikrRepsText}>
                  {isAr ? posData.dhikrRepsAr : posData.dhikrRepsEn}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* FIXED BOTTOM: BACK BUTTON + CORAL MAIN BUTTON */}
        <View style={styles.bottomBarContainer}>
          <View style={[styles.bottomBarRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* 60px Back button */}
            <TouchableOpacity
              style={styles.bottomBackBtn}
              onPress={handlePrev}
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
    justifyContent: 'flex-end',
  },
  cloudLeft: {
    position: 'absolute',
    top: 24,
    left: 20,
    width: 65,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  cloudRight: {
    position: 'absolute',
    top: 45,
    left: '36%',
    width: 50,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  sparkleStar: {
    position: 'absolute',
    top: 26,
    left: '48%',
  },
  mascotAnchor: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FEF08A',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  floorArea: {
    width: '100%',
    height: 190,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  prayerMatOuter: {
    width: '88%',
    height: 82,
    backgroundColor: '#047857',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 3,
    borderColor: '#F59E0B',
    padding: 5,
    position: 'absolute',
    bottom: 12,
  },
  prayerMatInner: {
    flex: 1,
    backgroundColor: '#064E3B',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerMatArch: {
    width: '60%',
    height: '70%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  sujudFigureWrap: {
    width: 260,
    height: 120,
    position: 'absolute',
    bottom: 20,
  },
  sujudHead: {
    position: 'absolute',
    left: 36,
    bottom: 24,
    width: 40,
    height: 34,
  },
  prayerCap: {
    width: 32,
    height: 22,
    backgroundColor: '#78350F',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  faceTouch: {
    width: 28,
    height: 16,
    backgroundColor: '#FED7AA',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginTop: -4,
  },
  sujudPalms: {
    position: 'absolute',
    left: 68,
    bottom: 24,
    width: 26,
    height: 12,
    backgroundColor: '#FED7AA',
    borderRadius: 6,
  },
  sujudTorso: {
    position: 'absolute',
    left: 62,
    bottom: 34,
    width: 104,
    height: 52,
    backgroundColor: '#10B981',
    borderRadius: 24,
    transform: [{ rotate: '-15deg' }],
  },
  sujudLegs: {
    position: 'absolute',
    left: 142,
    bottom: 24,
    width: 68,
    height: 38,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sujudFeet: {
    position: 'absolute',
    left: 204,
    bottom: 24,
    width: 24,
    height: 18,
    backgroundColor: '#FED7AA',
    borderRadius: 6,
  },
  // Gold Dots for 7 Contact Points
  goldPointWrap: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldPointRing: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(254, 240, 138, 0.45)',
  },
  goldPointCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  // Chips Row
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  chipPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipPrayer: {
    backgroundColor: '#DCFCE7',
  },
  chipTextPrayer: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '800',
  },
  chipRakah: {
    backgroundColor: '#E0F2FE',
  },
  chipTextRakah: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '800',
  },
  chipPosition: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  chipTextPosition: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '800',
  },
  salahTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  salahInstruction: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 27,
    marginBottom: 16,
  },
  // Dhikr Card
  dhikrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 6,
    ...Platform.select({
      web: { boxShadow: '0 4px 14px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  dhikrCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dhikrPlayBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhikrPlayBtnActive: {
    backgroundColor: '#0369A1',
  },
  dhikrTextCol: {
    flex: 1,
    alignItems: 'center',
  },
  dhikrSmallLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  dhikrArabicPhrase: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  dhikrRepsChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  dhikrRepsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
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
