// src/app/quran/tajweed.tsx
// Dedicated Audio Tajweed Academy (مدرسة التجويد بالصوت)
// Styled to perfectly match Rawda Kids 3D Garden aesthetic:
// - Standard Header & AppBottomNav
// - 3D Hero banner with Quran Garden art
// - Noor Mascot analogy callouts
// - Interactive 3D letter blocks
// - Live animated Sheikh Al-Husary audio examples
// - Smart game-show audio quiz with stars rewards

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import Header from '@/components/Header';
import AppBottomNav from '@/components/AppBottomNav';
import {
  TAJWEED_SECTIONS,
  TajweedSection,
  TajweedLesson,
  TajweedAudioExample,
} from '@/features/tajweed/data/tajweedLessonsData';
import TajweedAudioPlayer from '@/features/tajweed/components/TajweedAudioPlayer';
import TajweedVoiceGame from '@/features/tajweed/components/TajweedVoiceGame';

const QURAN_GARDEN_IMG = require('../../../assets/images/quran-garden.jpg');
const NAV_QURAN_IMG = require('../../../assets/images/nav-quran-3d.jpg');
const MASCOT_NOOR_IMG = require('../../../assets/images/mascot-noor.jpg');

const TAJWEED_SECTION_IMAGES: Record<string, any> = {
  nun_tanween: require('../../../assets/images/tajweed-nun-3d.jpg'),
  meem_ghunnah: require('../../../assets/images/tajweed-meem-3d.jpg'),
  madd: require('../../../assets/images/tajweed-madd-3d.jpg'),
  qalqalah: require('../../../assets/images/tajweed-qalqalah-3d.jpg'),
  makharij: require('../../../assets/images/tajweed-makharij-3d.jpg'),
};

export default function TajweedAcademyScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const { language, addStars } = useAppStore();
  const isAr = language === 'ar';

  const [selectedSectionId, setSelectedSectionId] = useState<string>('nun_tanween');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('izhar_halqi');

  // Quiz interactive state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Record<string, boolean>>({});

  // Voice practice modal state
  const [voiceModalVisible, setVoiceModalVisible] = useState<boolean>(false);
  const [activeVoiceExample, setActiveVoiceExample] = useState<TajweedAudioExample | null>(null);

  const activeSection: TajweedSection =
    TAJWEED_SECTIONS.find((s) => s.id === selectedSectionId) ?? TAJWEED_SECTIONS[0];

  const activeLesson: TajweedLesson =
    activeSection.lessons.find((l) => l.id === selectedLessonId) ?? activeSection.lessons[0];

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    const sec = TAJWEED_SECTIONS.find((s) => s.id === sectionId);
    if (sec && sec.lessons.length > 0) {
      setSelectedLessonId(sec.lessons[0].id);
    }
  };

  const handleAnswerQuiz = (questionId: string, optionId: string, isCorrect: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (isCorrect && !answeredCorrectly[questionId]) {
      setAnsweredCorrectly((prev) => ({ ...prev, [questionId]: true }));
      addStars(5);
    }
  };

  const handleOpenVoiceChallenge = (example: TajweedAudioExample) => {
    setActiveVoiceExample(example);
    setVoiceModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.appContainer}>
        {/* ── App Top Header with 3D Stats & Profile Switcher ── */}
        <Header
          showBack
          title={isAr ? 'مدرسة التجويد بالصوت 🎨' : 'Tajweed School 🎨'}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.scrollContentDesktop,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── 3D Hero Banner with Quran Garden Backdrop ─────────── */}
          <View style={styles.heroBannerContainer}>
            <ImageBackground
              source={QURAN_GARDEN_IMG}
              style={styles.heroBannerImage}
              imageStyle={{ borderRadius: RADIUS.xl }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(6, 78, 59, 0.90)', 'rgba(5, 150, 105, 0.95)']}
                style={styles.heroBannerOverlay}
              >
                <View style={[styles.heroRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <View style={styles.hero3dBadgeBox}>
                    <Image
                      source={NAV_QURAN_IMG}
                      style={styles.hero3dBadgeImg}
                      contentFit="cover"
                    />
                  </View>

                  <View style={[styles.heroTextCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                    <View style={styles.heroPillBadge}>
                      <Ionicons name="sparkles" size={13} color="#FDE047" />
                      <Text style={styles.heroPillText}>
                        {isAr ? 'مع الشيخ الحصري (المعلم)' : 'Sheikh Al-Husary (Teacher)'}
                      </Text>
                    </View>
                    <Text style={[styles.heroTitle, { textAlign: isAr ? 'right' : 'left' }]}>
                      {isAr ? 'مدرسة التجويد بالصوت 🎨🔊' : 'Audio Tajweed Academy 🎨🔊'}
                    </Text>
                    <Text style={[styles.heroDesc, { textAlign: isAr ? 'right' : 'left' }]}>
                      {isAr
                        ? 'استمع لنطق شيخ القراء ببطء وإتقان، وتدرّب بألعاب صوتية ممتعة!'
                        : 'Listen to slow, clear recitations by Sheikh Al-Husary and practice with fun audio games!'}
                    </Text>
                  </View>
                </View>

                {/* Progress Pill */}
                <View style={[styles.heroStatsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>🌿</Text>
                    <Text style={styles.statText}>٥ أقسام رئيسية</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>🎧</Text>
                    <Text style={styles.statText}>أمثلة صوتية نقية</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>⭐</Text>
                    <Text style={styles.statText}>تحديات ونجوم</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* ── 5 Main Section Selector Cards ───────────────────── */}
          <View style={styles.sectionCardsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectionCardsScroll}
            >
              {TAJWEED_SECTIONS.map((sec) => {
                const isSelected = sec.id === selectedSectionId;
                return (
                  <TouchableOpacity
                    key={sec.id}
                    style={[
                      styles.sectionCardItem,
                      isSelected && [
                        styles.sectionCardItemActive,
                        { borderColor: sec.color, backgroundColor: sec.bgColor },
                      ],
                    ]}
                    onPress={() => handleSelectSection(sec.id)}
                    activeOpacity={0.85}
                  >
                    <View
                      style={[
                        styles.sectionImageBox,
                        isSelected && { borderColor: sec.color, borderWidth: 2.5 },
                      ]}
                    >
                      <Image
                        source={TAJWEED_SECTION_IMAGES[sec.id]}
                        style={styles.sectionImg}
                        contentFit="cover"
                      />
                    </View>
                    <Text
                      style={[
                        styles.sectionCardTitle,
                        isSelected && { color: sec.color, fontWeight: '800' },
                      ]}
                    >
                      {isAr ? sec.titleAr : sec.titleEn}
                    </Text>
                    <View
                      style={[
                        styles.sectionCountTag,
                        isSelected && { backgroundColor: sec.color + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sectionCountText,
                          isSelected && { color: sec.color },
                        ]}
                      >
                        {sec.lessons.length} {isAr ? 'أحكام' : 'Rules'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ── Sub-Lessons Chips Row ───────────────────────────── */}
          {activeSection.lessons.length > 1 && (
            <View style={styles.subLessonsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subLessonsScroll}
              >
                {activeSection.lessons.map((lesson) => {
                  const isSelected = lesson.id === selectedLessonId;
                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.subLessonPill,
                        isSelected && [
                          styles.subLessonPillActive,
                          {
                            borderColor: activeSection.color,
                            backgroundColor: activeSection.color,
                          },
                        ],
                      ]}
                      onPress={() => setSelectedLessonId(lesson.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.subLessonEmoji}>{lesson.emoji}</Text>
                      <Text
                        style={[
                          styles.subLessonText,
                          isSelected && styles.subLessonTextActive,
                        ]}
                      >
                        {isAr ? lesson.titleAr : lesson.titleEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* ── Active Lesson Showcase Card ─────────────────────── */}
          <View style={styles.showcaseCard}>
            {/* Lesson Title Header */}
            <View style={[styles.showcaseHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
              <View
                style={[
                  styles.showcaseImageBox,
                  { backgroundColor: activeLesson.badgeBgColor, borderColor: activeLesson.badgeColor },
                ]}
              >
                <Image
                  source={TAJWEED_SECTION_IMAGES[activeSection.id]}
                  style={styles.showcaseImg}
                  contentFit="cover"
                />
              </View>

              <View style={[styles.showcaseTitleCol, { alignItems: isAr ? 'flex-end' : 'flex-start' }]}>
                <View style={[styles.ruleTypePill, { backgroundColor: activeLesson.badgeBgColor }]}>
                  <Text style={[styles.ruleTypePillText, { color: activeLesson.badgeColor }]}>
                    {activeSection.titleAr}
                  </Text>
                </View>
                <Text style={styles.showcaseMainTitle}>{activeLesson.titleAr}</Text>
                <Text style={styles.showcaseSummary}>{activeLesson.shortSummaryAr}</Text>
              </View>
            </View>

            {/* ── Noor Mascot Thought Card ("💡 همسة نور للأبطال") ── */}
            <View style={[styles.noorMascotCard, { borderColor: activeSection.color + '35' }]}>
              <View style={[styles.noorMascotRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Image
                  source={MASCOT_NOOR_IMG}
                  style={styles.noorMascotImg}
                  contentFit="cover"
                />
                <View style={styles.noorSpeechCol}>
                  <View style={[styles.noorBadge, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="sparkles" size={13} color="#D97706" />
                    <Text style={styles.noorBadgeText}>همسة نور الذكية للأبطال</Text>
                  </View>
                  <Text style={[styles.noorAnalogyText, { textAlign: isAr ? 'right' : 'left' }]}>
                    {activeLesson.kidAnalogyAr}
                  </Text>
                </View>
              </View>

              <View style={styles.ruleExplainDivider} />
              <Text style={[styles.ruleDetailExplanation, { textAlign: isAr ? 'right' : 'left' }]}>
                {activeLesson.detailedRuleAr}
              </Text>
            </View>

            {/* ── Tactile 3D Letter Blocks Grid ─────────────────── */}
            <View style={styles.letterBlocksArea}>
              <View style={[styles.letterBlocksHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Ionicons name="shapes" size={16} color={activeSection.color} />
                <Text style={[styles.letterBlocksTitle, { color: activeSection.color }]}>
                  {activeLesson.rulesCountDescAr}
                </Text>
              </View>

              <View style={[styles.letterBlocksGrid, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                {activeLesson.letters.map((char, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.letterBlockItem,
                      {
                        backgroundColor: activeLesson.badgeBgColor,
                        borderColor: activeLesson.badgeColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.letterBlockChar,
                        { color: activeLesson.badgeColor },
                      ]}
                    >
                      {char}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Interactive Audio Examples List ───────────────── */}
            <View style={styles.audioExamplesSection}>
              <View style={[styles.audioSectionHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={[styles.audioHeaderIconCircle, { backgroundColor: activeSection.bgColor }]}>
                  <Ionicons name="volume-high" size={18} color={activeSection.color} />
                </View>
                <View style={{ flex: 1, alignItems: isAr ? 'flex-end' : 'flex-start' }}>
                  <Text style={[styles.audioSectionTitle, { color: activeSection.color }]}>
                    أمثلة الاستماع بصوت الشيخ الحصري (المعلم) 🎧
                  </Text>
                  <Text style={styles.audioSectionSub}>
                    استمع للنطق الصحيح ثم اضغط على «ردد الآن» للتجربة
                  </Text>
                </View>
              </View>

              {activeLesson.examples.map((ex) => (
                <TajweedAudioPlayer
                  key={ex.id}
                  example={ex}
                  accentColor={activeLesson.badgeColor}
                  onVoicePractice={() => handleOpenVoiceChallenge(ex)}
                />
              ))}
            </View>

            {/* ── Smart Audio Quiz Game ("تحدي الأذن الذكية") ────── */}
            {activeLesson.quiz.length > 0 && (
              <View style={styles.quizGameCard}>
                <LinearGradient
                  colors={['#FEF3C7', '#FFFBEB']}
                  style={styles.quizGameGradient}
                >
                  <View style={[styles.quizGameHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    <View style={styles.quizTrophyBox}>
                      <Ionicons name="trophy" size={20} color="#D97706" />
                    </View>
                    <View style={{ flex: 1, alignItems: isAr ? 'flex-end' : 'flex-start' }}>
                      <Text style={styles.quizGameHeading}>تحدي الأذن الذكية 🎯</Text>
                      <Text style={styles.quizGameSub}>اختر الإجابة الصحيحة واكسب ٥ نجوم ذهبية!</Text>
                    </View>
                  </View>

                  {activeLesson.quiz.map((q) => {
                    const selectedOptId = quizAnswers[q.id];
                    const isCorrect = answeredCorrectly[q.id];

                    return (
                      <View key={q.id} style={styles.quizInnerBox}>
                        <Text style={[styles.quizQuestionLabel, { textAlign: isAr ? 'right' : 'left' }]}>
                          {q.questionAr}
                        </Text>

                        {q.sampleText && (
                          <View style={styles.quizSampleCallout}>
                            <Text style={styles.quizSampleCalloutText}>
                              {`﴿ ${q.sampleText} ﴾`}
                            </Text>
                          </View>
                        )}

                        <View style={styles.quizChoicesStack}>
                          {q.options.map((opt) => {
                            const isChosen = selectedOptId === opt.id;
                            return (
                              <TouchableOpacity
                                key={opt.id}
                                style={[
                                  styles.quizChoiceBtn,
                                  isChosen &&
                                    (opt.isCorrect
                                      ? styles.quizChoiceCorrect
                                      : styles.quizChoiceWrong),
                                ]}
                                onPress={() => handleAnswerQuiz(q.id, opt.id, opt.isCorrect)}
                                activeOpacity={0.85}
                              >
                                <Ionicons
                                  name={
                                    isChosen
                                      ? opt.isCorrect
                                        ? 'checkmark-circle'
                                        : 'close-circle'
                                      : 'radio-button-off'
                                  }
                                  size={20}
                                  color={
                                    isChosen
                                      ? opt.isCorrect
                                        ? '#059669'
                                        : '#DC2626'
                                      : '#9CA3AF'
                                  }
                                />
                                <Text
                                  style={[
                                    styles.quizChoiceText,
                                    isChosen &&
                                      (opt.isCorrect
                                        ? styles.quizChoiceTextCorrect
                                        : styles.quizChoiceTextWrong),
                                    { textAlign: isAr ? 'right' : 'left' },
                                  ]}
                                >
                                  {opt.labelAr}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {selectedOptId && (
                          <View
                            style={[
                              styles.feedbackBadge,
                              isCorrect ? styles.feedbackBadgeCorrect : styles.feedbackBadgeWrong,
                            ]}
                          >
                            <Text style={styles.feedbackEmoji}>{isCorrect ? '🌟' : '💡'}</Text>
                            <Text
                              style={[
                                styles.feedbackText,
                                isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong,
                                { textAlign: isAr ? 'right' : 'left' },
                              ]}
                            >
                              {q.options.find((o) => o.id === selectedOptId)?.explanationAr}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </LinearGradient>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ── App Bottom Nav Anchored ─────────────────────────── */}
        <AppBottomNav />

        {/* ── Interactive Voice Challenge Modal ────────────────── */}
        {activeVoiceExample && (
          <TajweedVoiceGame
            visible={voiceModalVisible}
            surahNumber={activeVoiceExample.surahNumber}
            ayahNumber={activeVoiceExample.ayahNumber}
            ayahText={activeVoiceExample.ayahText}
            language={language}
            onClose={() => {
              setVoiceModalVisible(false);
              setActiveVoiceExample(null);
            }}
            onStarsAwarded={(count) => {
              addStars(count);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.sand50,
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    backgroundColor: COLORS.sand50,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 90, // Leave space for AppBottomNav
  },
  scrollContentDesktop: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },

  // ── Hero Banner ──
  heroBannerContainer: {
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(6, 78, 59, 0.16)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  heroBannerImage: {
    width: '100%',
  },
  heroBannerOverlay: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
  },
  heroRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: SPACING.md,
  },
  hero3dBadgeBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    ...SHADOWS.soft,
  },
  hero3dBadgeImg: {
    width: '100%',
    height: '100%',
  },
  heroTextCol: {
    flex: 1,
  },
  heroPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: RADIUS.full,
    marginBottom: 6,
  },
  heroPillText: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'Amiri, sans-serif' }),
  },
  heroDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#D1FAE5',
    fontWeight: '600',
  },
  heroStatsRow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 44, 34, 0.35)',
    borderRadius: RADIUS.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statEmoji: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // ── Section Cards ──
  sectionCardsContainer: {
    marginBottom: SPACING.sm + 2,
  },
  sectionCardsScroll: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingVertical: 4,
  },
  sectionCardItem: {
    width: 136,
    padding: 12,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EFE7DA',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  sectionCardItemActive: {
    ...Platform.select({
      web: {
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  sectionImageBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionImg: {
    width: '100%',
    height: '100%',
  },
  sectionCardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
  },
  sectionCountTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: '#F3F4F6',
  },
  sectionCountText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6B7280',
  },

  // ── Sub-Lessons Chips ──
  subLessonsContainer: {
    marginBottom: SPACING.md,
  },
  subLessonsScroll: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingVertical: 2,
  },
  subLessonPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  subLessonPillActive: {
    ...SHADOWS.soft,
  },
  subLessonEmoji: {
    fontSize: 14,
  },
  subLessonText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  subLessonTextActive: {
    color: '#FFFFFF',
  },

  // ── Showcase Card ──
  showcaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: '#EFE7DA',
    ...SHADOWS.medium,
  },
  showcaseHeader: {
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md + 2,
  },
  showcaseImageBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  showcaseImg: {
    width: '100%',
    height: '100%',
  },
  showcaseTitleCol: {
    flex: 1,
  },
  ruleTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  ruleTypePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  showcaseMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 3,
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'Amiri, serif' }),
  },
  showcaseSummary: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 19,
    fontWeight: '600',
  },

  // ── Noor Mascot Thought Card ──
  noorMascotCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    marginBottom: SPACING.lg,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  noorMascotRow: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  noorMascotImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FDE68A',
    backgroundColor: '#FEF3C7',
  },
  noorSpeechCol: {
    flex: 1,
  },
  noorBadge: {
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  noorBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  noorAnalogyText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
    color: '#064E3B',
  },
  ruleExplainDivider: {
    height: 1,
    backgroundColor: '#F3E8FF',
    marginVertical: 6,
  },
  ruleDetailExplanation: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4B5563',
    fontWeight: '600',
  },

  // ── 3D Letter Blocks ──
  letterBlocksArea: {
    marginBottom: SPACING.lg,
  },
  letterBlocksHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  letterBlocksTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  letterBlocksGrid: {
    flexWrap: 'wrap',
    gap: 8,
  },
  letterBlockItem: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.06)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  letterBlockChar: {
    fontSize: 17,
    fontWeight: '900',
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'Amiri, serif' }),
  },

  // ── Audio Examples Section ──
  audioExamplesSection: {
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  audioSectionHeader: {
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  audioHeaderIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  audioSectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  // ── Quiz Game Card ──
  quizGameCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FDE68A',
    marginTop: SPACING.sm,
  },
  quizGameGradient: {
    padding: SPACING.md + 2,
  },
  quizGameHeader: {
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  quizTrophyBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    ...SHADOWS.soft,
  },
  quizGameHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
    marginBottom: 2,
  },
  quizGameSub: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  quizInnerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
  },
  quizQuestionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 8,
  },
  quizSampleCallout: {
    backgroundColor: '#FFFDF9',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFE7DA',
  },
  quizSampleCalloutText: {
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'Amiri, serif' }),
    fontSize: 19,
    color: '#064E3B',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  quizChoicesStack: {
    gap: 8,
  },
  quizChoiceBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  quizChoiceCorrect: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  quizChoiceWrong: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  quizChoiceText: {
    fontSize: 13.5,
    color: '#374151',
    fontWeight: '700',
    flex: 1,
  },
  quizChoiceTextCorrect: {
    color: '#065F46',
    fontWeight: '800',
  },
  quizChoiceTextWrong: {
    color: '#991B1B',
    fontWeight: '800',
  },
  feedbackBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  feedbackBadgeCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  feedbackBadgeWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  feedbackEmoji: {
    fontSize: 16,
  },
  feedbackText: {
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
    fontWeight: '700',
  },
  feedbackTextCorrect: {
    color: '#065F46',
  },
  feedbackTextWrong: {
    color: '#991B1B',
  },
});
