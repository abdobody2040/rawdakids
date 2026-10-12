// Kid-Friendly 3D Tasbih Counter Modal (مسبحة الأذكار التفاعلية للأطفال)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface DhikrItem {
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

const DHIKR_LIST: DhikrItem[] = [
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
];

// Web Audio API Synthesizer (Zero external dependencies)
type WindowWithWebAudio = {
  AudioContext?: new () => AudioContext;
  webkitAudioContext?: new () => AudioContext;
};

function playBeadClickSound() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const win = window as WindowWithWebAudio;
      const AudioCtx = win.AudioContext || win.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }
    } catch (_err) {
      // AudioContext not allowed or unsupported in current environment
    }
  }
}

function playCompletionChimeSound() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const win = window as WindowWithWebAudio;
      const AudioCtx = win.AudioContext || win.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        chords.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
        });
      }
    } catch (_err) {
      // AudioContext not allowed or unsupported
    }
  }
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  initialDhikrId?: string;
}

export default function KidTasbihModal({
  visible,
  onDismiss,
  initialDhikrId = 'subhanallah',
}: Props) {
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';

  const [activeDhikr, setActiveDhikr] = useState<DhikrItem>(() => {
    return DHIKR_LIST.find((d) => d.id === initialDhikrId) || DHIKR_LIST[0];
  });

  const [count, setCount] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [justCompletedTarget, setJustCompletedTarget] = useState<boolean>(false);

  // Animation values (useState initialized once to comply with react-hooks rules)
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [pulseAnim] = useState(() => new Animated.Value(1));

  const target = activeDhikr.defaultTarget;
  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  const handleTapBead = () => {
    // 1. Tactile feedback
    if (Platform.OS === 'web') {
      playBeadClickSound();
    } else {
      try {
        Vibration.vibrate(30);
      } catch {
        // Safe fallback
      }
    }

    // 2. Button Bounce Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Counter increment
    const nextCount = count + 1;
    if (nextCount >= target) {
      // Target reached!
      setCount(0);
      setCompletedRounds((r) => r + 1);
      setJustCompletedTarget(true);

      // Sound chime & award rewards
      playCompletionChimeSound();
      addStars(1);
      addGems(1);

      // Pulse celebratory animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setJustCompletedTarget(false);
      }, 4000);
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
    setJustCompletedTarget(false);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Top Header */}
          <View style={[styles.headerRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.headerIconCircle}>
                <Ionicons name="finger-print" size={20} color="#0D9488" />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {isAr ? '📿 مسبحة الأذكار التفاعلية' : '📿 Kids 3D Tasbih Counter'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {isAr ? 'عَطِّرْ لِسَانَكَ بِذِكْرِ اللَّهِ وَاكَسِبِ النُّجُومَ' : 'Light your day with Dhikr & earn stars'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Dhikr Selector Horizontal Chips */}
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

            {/* Active Dhikr Card (Text & Meaning) */}
            <LinearGradient
              colors={activeDhikr.colorScheme}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.activeDhikrCard}
            >
              <Text style={styles.activeDhikrArabic}>{activeDhikr.textArabic}</Text>
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

            {/* Completion Celebratory Banner */}
            {justCompletedTarget && (
              <Animated.View
                style={[
                  styles.celebrationBanner,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Ionicons name="sparkles" size={24} color="#D97706" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.celebrationBannerTitle}>
                    {isAr
                      ? `🎉 ما شاء الله يا بطل! أتممت ${target} تسبيحة!`
                      : `🎉 Masha'Allah! Completed ${target} Tasbihs!`}
                  </Text>
                  <Text style={styles.celebrationBannerSub}>
                    {isAr
                      ? 'أُضيفت لك نجمة 🌟 وجوهرة 💎 في خزانتك المباركة'
                      : 'Earned 1 Star 🌟 and 1 Gem 💎 in your treasure chest'}
                  </Text>
                </View>
              </Animated.View>
            )}

            {/* Rounds & Target Stats Row */}
            <View
              style={[
                styles.statsRow,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={styles.statsPill}>
                <Ionicons name="refresh-circle" size={18} color="#047857" />
                <Text style={styles.statsPillText}>
                  {isAr ? `الدورات: ${completedRounds}` : `Rounds: ${completedRounds}`}
                </Text>
              </View>

              <View style={styles.statsPill}>
                <Ionicons name="flag" size={18} color="#D97706" />
                <Text style={styles.statsPillText}>
                  {isAr ? `الهدف: ${target}` : `Target: ${target}`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Ionicons name="reload" size={16} color="#64748B" />
                <Text style={styles.resetBtnText}>{isAr ? 'تصفير' : 'Reset'}</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
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

            {/* BIG INTERACTIVE 3D TASBIH BUTTON */}
            <View style={styles.bigButtonContainer}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[styles.bigTapButton, { shadowColor: activeDhikr.colorScheme[0] }]}
                  onPress={handleTapBead}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={activeDhikr.colorScheme}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.bigTapGradient}
                  >
                    {/* Inner 3D Highlight Ring */}
                    <View style={styles.innerHighlightRing}>
                      <Text style={styles.bigCounterNumber}>{count}</Text>
                      <Text style={styles.bigCounterTarget}>/ {target}</Text>
                      <View style={styles.tapPromptBadge}>
                        <Ionicons name="finger-print" size={18} color="#FFFFFF" />
                        <Text style={styles.tapPromptText}>
                          {isAr ? 'المس للتسبيح' : 'Tap to Count'}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Hadith Benefit Footer */}
            <View style={styles.footerBenefitBox}>
              <Text style={styles.footerBenefitTitle}>
                {isAr ? '💡 هَدْيُ النَّبِيِّ ﷺ فِي التَّسْبِيحِ:' : '💡 Prophet Muhammad ﷺ taught us:'}
              </Text>
              <Text style={styles.footerBenefitText}>
                {isAr
                  ? '«مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلاةٍ ثَلاثاً وَثَلاثِينَ، وَحَمِدَ اللَّهَ ثَلاثاً وَثَلاثِينَ، وَكَبَّرَ اللَّهَ ثَلاثاً وَثَلاثِينَ، فَتِلْكَ تِسْعَةٌ وَتِسْعُونَ، وَقَالَ تَمَامَ الْمِائَةِ: لا إِلَهَ إِلا اللَّهُ... غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ»'
                  : 'Saying SubhanAllah (33), Alhamdulillah (33), and Allahu Akbar (33) after prayer forgives shortcomings and brings immense peace.'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 580,
    maxHeight: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  headerRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  dhikrListWrap: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  dhikrChipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  dhikrChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
  },
  dhikrChipText: {
    fontSize: 13,
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
  activeDhikrArabic: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  activeDhikrTranslit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FEF3C7',
    textAlign: 'center',
  },
  activeDhikrDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: SPACING.sm,
  },
  activeDhikrMeaning: {
    fontSize: 13,
    color: '#F8FAFC',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 19,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  rewardPillText: {
    fontSize: 11,
    color: '#FEF3C7',
    fontWeight: '700',
  },
  celebrationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  celebrationBannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
  },
  celebrationBannerSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 2,
  },
  statsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  statsPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
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
    width: 210,
    height: 210,
    borderRadius: 105,
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  bigTapGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 105,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  innerHighlightRing: {
    width: '100%',
    height: '100%',
    borderRadius: 95,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCounterNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 64,
  },
  bigCounterTarget: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: -4,
  },
  tapPromptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },
  tapPromptText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerBenefitBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerBenefitTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  footerBenefitText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '600',
  },
});
