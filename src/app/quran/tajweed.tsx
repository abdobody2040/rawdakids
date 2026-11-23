// src/app/quran/tajweed.tsx
// Dedicated Audio Tajweed Academy (مدرسة التجويد بالصوت)
// Free, 100% Client-Side, Zero-LLM, Pedagogical & Kid-Friendly
// Features Sheikh Mahmoud Khalil Al-Husary (Teacher Edition) audio from EveryAyah

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import {
  TAJWEED_SECTIONS,
  TajweedSection,
  TajweedLesson,
  TajweedAudioExample,
} from '@/features/tajweed/data/tajweedLessonsData';
import TajweedAudioPlayer from '@/features/tajweed/components/TajweedAudioPlayer';
import TajweedVoiceGame from '@/features/tajweed/components/TajweedVoiceGame';

export default function TajweedAcademyScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const { language, addStars, stars } = useAppStore();
  const totalStars = stars ?? 0;

  const [selectedSectionId, setSelectedSectionId] = useState<string>('nun_tanween');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('izhar_halqi');

  // Quiz interactive state: map of questionId -> selectedOptionId
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
    <View style={styles.container}>
      {/* ── Top Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="العودة"
        >
          <Ionicons name="arrow-forward" size={22} color="#064E3B" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>مدرسة التجويد بالصوت 🎨🔊</Text>
          <Text style={styles.headerSubtitle}>مع الشيخ الحصري (المعلم)</Text>
        </View>

        <View style={styles.starsBadge}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.starsText}>{totalStars}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Welcome Banner ────────────────────────────────── */}
        <LinearGradient
          colors={['#065F46', '#047857', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroTextContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={14} color="#FDE047" />
              <Text style={styles.heroBadgeText}>تعلّم التلاوة الصحيحة بسهولة</Text>
            </View>
            <Text style={styles.heroTitle}>استمع، تعلّم، ورتّل كالأبطال! 🌟</Text>
            <Text style={styles.heroDesc}>
              استمع لأمثلة صوتية واضحة ومتقنة بصوت شيخ المقارئ المصرية الشيخ محمود خليل الحصري
              (المعلم)، وتدرب على أحكام التجويد بألعاب تفاعلية مسلية.
            </Text>
          </View>
        </LinearGradient>

        {/* ── Section Selector Tabs ──────────────────────────────── */}
        <View style={styles.sectionTabsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionTabsScroll}
          >
            {TAJWEED_SECTIONS.map((sec) => {
              const isSelected = sec.id === selectedSectionId;
              return (
                <TouchableOpacity
                  key={sec.id}
                  style={[
                    styles.sectionTabPill,
                    isSelected && {
                      backgroundColor: sec.color,
                      borderColor: sec.color,
                    },
                  ]}
                  onPress={() => handleSelectSection(sec.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sectionTabEmoji}>{sec.emoji}</Text>
                  <Text
                    style={[
                      styles.sectionTabTitle,
                      isSelected && styles.sectionTabTitleActive,
                    ]}
                  >
                    {sec.titleAr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Lesson Selector Sub-Tabs (within selected section) ──── */}
        {activeSection.lessons.length > 1 && (
          <View style={styles.lessonTabsRow}>
            {activeSection.lessons.map((lesson) => {
              const isSelected = lesson.id === selectedLessonId;
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[
                    styles.lessonTabChip,
                    isSelected && [
                      styles.lessonTabChipActive,
                      { borderColor: activeSection.color, backgroundColor: activeSection.bgColor },
                    ],
                  ]}
                  onPress={() => setSelectedLessonId(lesson.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.lessonTabEmoji}>{lesson.emoji}</Text>
                  <Text
                    style={[
                      styles.lessonTabChipText,
                      isSelected && { color: activeSection.color, fontWeight: '700' },
                    ]}
                  >
                    {lesson.titleAr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Active Lesson Content Card ─────────────────────────── */}
        <View style={styles.lessonCard}>
          {/* Lesson Header */}
          <View style={styles.lessonHeaderRow}>
            <View
              style={[
                styles.lessonIconBox,
                { backgroundColor: activeLesson.badgeBgColor },
              ]}
            >
              <Text style={styles.lessonIconEmoji}>{activeLesson.emoji}</Text>
            </View>

            <View style={styles.lessonHeaderInfo}>
              <Text style={styles.lessonMainTitle}>{activeLesson.titleAr}</Text>
              <Text style={styles.lessonSubTitle}>{activeLesson.shortSummaryAr}</Text>
            </View>
          </View>

          {/* Kid-Friendly Analogy Box */}
          <View
            style={[
              styles.analogyBox,
              { backgroundColor: activeSection.bgColor, borderColor: activeSection.color + '30' },
            ]}
          >
            <View style={styles.analogyHeader}>
              <Ionicons name="bulb" size={18} color="#D97706" />
              <Text style={styles.analogyTitle}>التشبيه الذكي للأبطال 💡</Text>
            </View>
            <Text style={styles.analogyText}>{activeLesson.kidAnalogyAr}</Text>
            <Text style={styles.ruleDetailText}>{activeLesson.detailedRuleAr}</Text>
          </View>

          {/* Letters Pills */}
          <View style={styles.lettersSection}>
            <Text style={styles.lettersTitle}>
              {activeLesson.rulesCountDescAr}
            </Text>
            <View style={styles.lettersPillsRow}>
              {activeLesson.letters.map((char, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.letterPill,
                    { backgroundColor: activeLesson.badgeBgColor, borderColor: activeLesson.badgeColor },
                  ]}
                >
                  <Text style={[styles.letterChar, { color: activeLesson.badgeColor }]}>
                    {char}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Audio Examples Section ───────────────────────────── */}
          <View style={styles.examplesContainer}>
            <View style={styles.examplesHeaderRow}>
              <Ionicons name="volume-high" size={20} color={activeSection.color} />
              <Text style={[styles.examplesHeading, { color: activeSection.color }]}>
                أمثلة استماع بصوت الشيخ الحصري المعلم 🎧
              </Text>
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

          {/* ── Smart Audio Quiz (تحدي الأذن الذكية) ─────────────── */}
          {activeLesson.quiz.length > 0 && (
            <View style={styles.quizSection}>
              <View style={styles.quizHeaderRow}>
                <Ionicons name="ribbon" size={20} color="#D97706" />
                <Text style={styles.quizHeading}>تحدي الأذن الذكية 🎯 (اكسب ٥ نجوم!)</Text>
              </View>

              {activeLesson.quiz.map((q) => {
                const selectedOptId = quizAnswers[q.id];
                const isCorrect = answeredCorrectly[q.id];

                return (
                  <View key={q.id} style={styles.quizCard}>
                    <Text style={styles.quizQuestionText}>{q.questionAr}</Text>

                    {q.sampleText && (
                      <View style={styles.quizSampleBox}>
                        <Text style={styles.quizSampleText}>{q.sampleText}</Text>
                      </View>
                    )}

                    <View style={styles.quizOptionsList}>
                      {q.options.map((opt) => {
                        const isThisSelected = selectedOptId === opt.id;
                        return (
                          <TouchableOpacity
                            key={opt.id}
                            style={[
                              styles.quizOptionBtn,
                              isThisSelected &&
                                (opt.isCorrect
                                  ? styles.quizOptionCorrect
                                  : styles.quizOptionIncorrect),
                            ]}
                            onPress={() => handleAnswerQuiz(q.id, opt.id, opt.isCorrect)}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name={
                                isThisSelected
                                  ? opt.isCorrect
                                    ? 'checkmark-circle'
                                    : 'close-circle'
                                  : 'ellipse-outline'
                              }
                              size={18}
                              color={
                                isThisSelected
                                  ? opt.isCorrect
                                    ? '#059669'
                                    : '#DC2626'
                                  : COLORS.textMuted
                              }
                            />
                            <Text
                              style={[
                                styles.quizOptionText,
                                isThisSelected &&
                                  (opt.isCorrect
                                    ? styles.quizOptionTextCorrect
                                    : styles.quizOptionTextIncorrect),
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
                          styles.quizFeedbackBox,
                          isCorrect ? styles.quizFeedbackCorrect : styles.quizFeedbackIncorrect,
                        ]}
                      >
                        <Text
                          style={[
                            styles.quizFeedbackText,
                            isCorrect ? styles.quizFeedbackTextCorrect : styles.quizFeedbackTextIncorrect,
                          ]}
                        >
                          {q.options.find((o) => o.id === selectedOptId)?.explanationAr}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Interactive Voice Challenge Modal ──────────────────── */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...SHADOWS.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064E3B',
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'sans-serif' }),
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  starsBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  scrollContentDesktop: {
    maxWidth: 880,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  heroBanner: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(5, 150, 105, 0.2)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  heroTextContent: {
    alignItems: 'flex-end',
  },
  heroBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.full,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'right',
  },
  heroDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#D1FAE5',
    textAlign: 'right',
  },
  sectionTabsWrap: {
    marginBottom: SPACING.sm,
  },
  sectionTabsScroll: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingVertical: 4,
  },
  sectionTabPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  sectionTabEmoji: {
    fontSize: 16,
  },
  sectionTabTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  sectionTabTitleActive: {
    color: '#FFFFFF',
  },
  lessonTabsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  lessonTabChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  lessonTabChipActive: {
    borderColor: '#059669',
  },
  lessonTabEmoji: {
    fontSize: 14,
  },
  lessonTabChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...SHADOWS.md,
  },
  lessonHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
  },
  lessonIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconEmoji: {
    fontSize: 26,
  },
  lessonHeaderInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  lessonMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 2,
    textAlign: 'right',
  },
  lessonSubTitle: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'right',
    lineHeight: 18,
  },
  analogyBox: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  analogyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  analogyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
  analogyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#064E3B',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 6,
  },
  ruleDetailText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#374151',
    textAlign: 'right',
  },
  lettersSection: {
    marginBottom: SPACING.lg,
  },
  lettersTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'right',
  },
  lettersPillsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  letterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  letterChar: {
    fontSize: 15,
    fontWeight: '800',
  },
  examplesContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  examplesHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  examplesHeading: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
  },
  quizSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  quizHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  quizHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
    textAlign: 'right',
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: SPACING.sm,
  },
  quizQuestionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 8,
  },
  quizSampleBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quizSampleText: {
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'serif' }),
    fontSize: 18,
    color: '#064E3B',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  quizOptionsList: {
    gap: 8,
  },
  quizOptionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  quizOptionCorrect: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  quizOptionIncorrect: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  quizOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  quizOptionTextCorrect: {
    color: '#065F46',
    fontWeight: '700',
  },
  quizOptionTextIncorrect: {
    color: '#991B1B',
    fontWeight: '700',
  },
  quizFeedbackBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  quizFeedbackCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  quizFeedbackIncorrect: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  quizFeedbackText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    fontWeight: '600',
  },
  quizFeedbackTextCorrect: {
    color: '#065F46',
  },
  quizFeedbackTextIncorrect: {
    color: '#991B1B',
  },
});

