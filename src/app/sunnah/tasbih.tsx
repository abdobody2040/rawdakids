// Dedicated Interactive Kid Tasbih Screen (/sunnah/tasbih)
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import SunnahHeroHeader from '@/components/SunnahHeroHeader';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { audioService } from '@/services/audioService';

export interface DhikrItem {
  id: string;
  textArabic: string;
  transliteration: string;
  meaningAr: string;
  meaningEn: string;
  defaultTarget: number;
  rewardNoteAr: string;
  rewardNoteEn: string;
  colorScheme: readonly [string, string];
}

export const DHIKR_LIST: DhikrItem[] = [
  {
    id: 'subhanallah',
    textArabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥān Allāh',
    meaningAr: 'أُنَزِّهُ اللَّهَ عَنْ كُلِّ عَيْبٍ وَنَقْصٍ',
    meaningEn: 'Glory be to Allah above any imperfection',
    defaultTarget: 33,
    rewardNoteAr: 'شجرة طيبة تُغرس لك في الجنة 🌴',
    rewardNoteEn: 'A blessed palm tree planted in Jannah 🌴',
    colorScheme: ['#047857', '#065F46'] as const,
  },
  {
    id: 'alhamdulillah',
    textArabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    meaningAr: 'الشُّكْرُ وَالثَّنَاءُ الْكَامِلُ لِلَّهِ عَلَى نِعَمِهِ',
    meaningEn: 'All praise and gratitude belong to Allah',
    defaultTarget: 33,
    rewardNoteAr: 'تملأ ميزان الحسنات بالخير العظيم ⚖️',
    rewardNoteEn: 'Fills the scale of good deeds with light ⚖️',
    colorScheme: ['#0284C7', '#0369A1'] as const,
  },
  {
    id: 'allahuakbar',
    textArabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    meaningAr: 'اللَّهُ أَعْظَمُ وَأَجَلُّ مِنْ كُلِّ شَيْءٍ',
    meaningEn: 'Allah is Greater than everything',
    defaultTarget: 33,
    rewardNoteAr: 'تزيد القلب سكينة وعزة وقوة 🛡️',
    rewardNoteEn: 'Fills the young heart with courage and tranquility 🛡️',
    colorScheme: ['#D97706', '#B45309'] as const,
  },
  {
    id: 'lailahaillallah',
    textArabic: 'لا إِلَهَ إِلا اللَّهُ',
    transliteration: 'Lā ilāha illā Allāh',
    meaningAr: 'لا مَعْبُودَ بِحَقٍّ فِي الْكَوْنِ إِلا اللَّهُ',
    meaningEn: 'There is none worthy of worship except Allah',
    defaultTarget: 33,
    rewardNoteAr: 'أفضل الذكر ومفتاح أبواب الجنة 🗝️',
    rewardNoteEn: 'The best remembrance and key to Jannah 🗝️',
    colorScheme: ['#7C3AED', '#6D28D9'] as const,
  },
  {
    id: 'salawat',
    textArabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammad',
    meaningAr: 'صَلاةٌ وَبَرَكَةٌ عَلَى حَبِيبِنَا وَقُدْوَتِنَا ﷺ',
    meaningEn: 'Peace, blessings, and honor upon our beloved Prophet ﷺ',
    defaultTarget: 33,
    rewardNoteAr: 'مَن صلى عليه صلاة صلى الله عليه بها عشراً 🌸',
    rewardNoteEn: 'Whoever sends peace upon him, Allah blesses them tenfold 🌸',
    colorScheme: ['#E11D48', '#BE123C'] as const,
  },
  {
    id: 'istighfar',
    textArabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfiru Allāh wa-atūbu ilayh',
    meaningAr: 'أَطْلُبُ مَغْفِرَةَ رَبِّي وَرَحْمَتَهُ الْوَاسِعَةَ',
    meaningEn: 'I seek Allah’s forgiveness and return to Him in repentance',
    defaultTarget: 33,
    rewardNoteAr: 'تَمْحُو الذُّنُوبَ وَتَجْلِبُ الرِّزْقَ وَالفَرَجَ 🌧️',
    rewardNoteEn: 'Brings forgiveness, ease, and endless blessings 🌧️',
    colorScheme: ['#0D9488', '#0F766E'] as const,
  },
  {
    id: 'subhanallahi_wabihamdih',
    textArabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subḥān Allāhi wa-biḥamdih, Subḥān Allāhi al-ʿAẓīm',
    meaningAr: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ حَبِيبَتَانِ إِلَى الرَّحْمَٰنِ',
    meaningEn: 'Two phrases light on the tongue, heavy on the scale',
    defaultTarget: 33,
    rewardNoteAr: 'ثَقِيلَتَانِ فِي الْمِيزَانِ حَبِيبَتَانِ لِلرَّحْمَنِ ⭐',
    rewardNoteEn: 'Beloved to the Most Merciful and heavy on the scale ⭐',
    colorScheme: ['#4F46E5', '#4338CA'] as const,
  },
  {
    id: 'hawqalah',
    textArabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Lā ḥawla wa-lā quwwata illā billāh',
    meaningAr: 'لَا تَحَوُّلَ مِنْ حَالٍ إِلَى حَالٍ إِلَّا بِقُدْرَةِ اللَّهِ وَعَوْنِهِ',
    meaningEn: 'There is no power nor strength except through Allah',
    defaultTarget: 33,
    rewardNoteAr: 'كَنْزٌ مِنْ كُنُوزِ الْجَنَّةِ 💎',
    rewardNoteEn: 'A precious treasure from the treasures of Jannah 💎',
    colorScheme: ['#0284C7', '#0F766E'] as const,
  },
];

// Web Audio Singleton
let sharedAudioCtx: any = null;

function getSharedAudioCtx(): any {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const win = window as any;
    const AudioCtx = win.AudioContext || win.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playBeadClickSound() {
  try {
    const ctx = getSharedAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (_) {}
}

function playCompletionChimeSound() {
  try {
    const ctx = getSharedAudioCtx();
    if (!ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  } catch (_) {}
}

export default function TasbihScreen() {
  const router = useRouter();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  const [activeDhikr, setActiveDhikr] = useState<DhikrItem>(DHIKR_LIST[0]);
  const [count, setCount] = useState<number>(0);
  const [customTarget, setCustomTarget] = useState<number>(33);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Animated scale value for tactile button click
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioService.stopDua();
    };
  }, []);

  const handleTapBead = () => {
    // 1. Audio and Haptic feedback
    if (Platform.OS === 'web') {
      playBeadClickSound();
    } else {
      try {
        Vibration.vibrate(30);
      } catch (_) {}
    }

    // 2. Button bounce animation
    scaleAnim.setValue(0.92);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: false,
    }).start();

    // 3. Counter logic
    const nextCount = count + 1;

    if (customTarget > 0 && nextCount >= customTarget) {
      // Reached Target!
      setCount(0);
      setCompletedRounds((r) => r + 1);
      playCompletionChimeSound();
      addStars(1);
      addGems(2);
      setShowCelebration(true);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSelectDhikr = (dhikr: DhikrItem) => {
    setActiveDhikr(dhikr);
    setCount(0);
  };

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      await audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await audioService.playDua(activeDhikr.textArabic, (status) => {
      if (status.didJustFinish || status.error || !status.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
  };

  const progressPercent =
    customTarget > 0 ? Math.min(100, Math.round((count / customTarget) * 100)) : 100;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        <Header
          showBack
          fallbackRoute="/sunnah"
          title={t.sunnah}
        />

        {/* Persistent Sunnah Navigation Hub Header */}
        <SunnahHeroHeader activeTab="tasbih" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Horizontal Dhikr Selector Chips */}
          <View style={styles.dhikrListWrap}>
            <Text style={[styles.sectionLabel, { textAlign: isAr ? 'right' : 'left' }]}>
              {isAr ? 'اختر الذكر المبارك:' : 'Choose Dhikr:'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.dhikrChipsRow,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              {DHIKR_LIST.map((d) => {
                const isSelected = d.id === activeDhikr.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.dhikrChip,
                      isSelected && {
                        backgroundColor: d.colorScheme[0],
                        borderColor: d.colorScheme[1],
                      },
                    ]}
                    onPress={() => handleSelectDhikr(d)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dhikrChipText,
                        isSelected && styles.dhikrChipTextActive,
                      ]}
                    >
                      {d.textArabic}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Active Dhikr Card (Text, Audio, Meaning & Reward) */}
          <LinearGradient
            colors={activeDhikr.colorScheme}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeDhikrCard}
          >
            {/* Arabic Text & Audio Play Button */}
            <View style={styles.dhikrHeaderRow}>
              <TouchableOpacity
                style={[
                  styles.audioSpeakerBtn,
                  isPlayingAudio && styles.audioSpeakerBtnActive,
                ]}
                onPress={handleToggleAudio}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlayingAudio ? 'pause' : 'volume-high'}
                  size={20}
                  color={isPlayingAudio ? activeDhikr.colorScheme[0] : '#FFFFFF'}
                />
              </TouchableOpacity>
              <Text style={styles.activeDhikrArabic}>{activeDhikr.textArabic}</Text>
            </View>

            <Text style={styles.activeDhikrTranslit}>{activeDhikr.transliteration}</Text>
            <View style={styles.activeDhikrDivider} />
            <Text style={styles.activeDhikrMeaning}>
              {isAr ? activeDhikr.meaningAr : activeDhikr.meaningEn}
            </Text>

            <View style={styles.rewardPill}>
              <Ionicons name="gift-outline" size={14} color="#FEF3C7" />
              <Text style={styles.rewardPillText}>
                {isAr ? activeDhikr.rewardNoteAr : activeDhikr.rewardNoteEn}
              </Text>
            </View>
          </LinearGradient>

          {/* Target & Rounds Controller Row */}
          <View
            style={[
              styles.controlsRow,
              { flexDirection: isAr ? 'row-reverse' : 'row' },
            ]}
          >
            {/* Target Selectors */}
            <View style={[styles.targetsBox, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              {[33, 100, 0].map((tVal) => (
                <TouchableOpacity
                  key={tVal}
                  style={[
                    styles.targetPill,
                    customTarget === tVal && styles.targetPillActive,
                  ]}
                  onPress={() => {
                    setCustomTarget(tVal);
                    setCount(0);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.targetPillText,
                      customTarget === tVal && styles.targetPillTextActive,
                    ]}
                  >
                    {tVal === 0 ? '∞' : tVal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rounds Pill */}
            <View style={styles.roundsPill}>
              <Ionicons name="refresh-circle" size={16} color="#047857" />
              <Text style={styles.roundsPillText}>
                {isAr ? `الدورات: ${completedRounds}` : `Rounds: ${completedRounds}`}
              </Text>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Ionicons name="reload" size={15} color="#64748B" />
              <Text style={styles.resetBtnText}>{isAr ? 'تصفير' : 'Reset'}</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          {customTarget > 0 && (
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: activeDhikr.colorScheme[0],
                  },
                ]}
              />
            </View>
          )}

          {/* BIG INTERACTIVE 3D TASBIH BUTTON */}
          <View style={styles.bigButtonContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.bigTapButton,
                  {
                    shadowColor: activeDhikr.colorScheme[0],
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                ]}
                onPress={handleTapBead}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={activeDhikr.colorScheme}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bigTapGradient}
                >
                  <View style={styles.innerHighlightRing}>
                    <Text style={styles.bigCounterNumber}>{count}</Text>
                    {customTarget > 0 && (
                      <Text style={styles.bigCounterTarget}>/ {customTarget}</Text>
                    )}
                    <View style={styles.tapPromptBadge}>
                      <Ionicons name="finger-print" size={20} color="#FFFFFF" />
                      <Text style={styles.tapPromptText}>
                        {isAr ? 'المس للتسبيح 👆' : 'Tap to Count 👆'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Hadith Benefit Footer */}
          <View style={styles.footerBenefitBox}>
            <Text
              style={[
                styles.footerBenefitTitle,
                { textAlign: isAr ? 'right' : 'left' },
              ]}
            >
              {isAr ? '💡 هَدْيُ النَّبِيِّ ﷺ فِي التَّسْبِيحِ:' : '💡 Prophet Muhammad ﷺ taught us:'}
            </Text>
            <Text
              style={[
                styles.footerBenefitText,
                { textAlign: isAr ? 'right' : 'left' },
              ]}
            >
              {isAr
                ? '«مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلاةٍ ثَلاثاً وَثَلاثِينَ، وَحَمِدَ اللَّهَ ثَلاثاً وَثَلاثِينَ، وَكَبَّرَ اللَّهَ ثَلاثاً وَثَلاثِينَ، فَتِلْكَ تِسْعَةٌ وَتِسْعُونَ، وَقَالَ تَمَامَ الْمِائَةِ: لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ... غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ»'
                : 'Saying SubhanAllah (33), Alhamdulillah (33), and Allahu Akbar (33) after prayer forgives shortcomings and brings immense peace.'}
            </Text>
          </View>
        </ScrollView>

        <AppBottomNav />
      </View>

      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={1}
        gemsEarned={2}
        title={isAr ? `أتممت ${customTarget} تسبيحة مباركة! 🎉` : `Completed ${customTarget} Tasbihs! 🎉`}
        subtitle={isAr ? 'ما شاء الله! نورت قلبك وحفظت لسانك 🌴' : 'Masha’Allah! Light and blessings for your soul 🌴'}
        onDismiss={() => setShowCelebration(false)}
      />
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
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: 110,
    gap: SPACING.md,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  dhikrListWrap: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  dhikrChipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  dhikrChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
  },
  dhikrChipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  dhikrChipTextActive: {
    color: '#FFFFFF',
  },
  activeDhikrCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  dhikrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  audioSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioSpeakerBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  activeDhikrArabic: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  activeDhikrTranslit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  activeDhikrDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: '80%',
    marginVertical: 10,
  },
  activeDhikrMeaning: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    gap: 6,
    marginTop: 10,
  },
  rewardPillText: {
    fontSize: 12,
    color: '#FEF3C7',
    fontWeight: '700',
  },
  controlsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: SPACING.xs,
    ...SHADOWS.soft,
  },
  targetsBox: {
    gap: 4,
  },
  targetPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9',
  },
  targetPillActive: {
    backgroundColor: COLORS.primary,
  },
  targetPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  targetPillTextActive: {
    color: '#FFFFFF',
  },
  roundsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  roundsPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bigButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  bigTapButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    ...SHADOWS.medium,
  },
  bigTapGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  innerHighlightRing: {
    width: '100%',
    height: '100%',
    borderRadius: 98,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCounterNumber: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 64,
  },
  bigCounterTarget: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: -2,
  },
  tapPromptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  tapPromptText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerBenefitBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  footerBenefitTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  footerBenefitText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#78350F',
  },
});
