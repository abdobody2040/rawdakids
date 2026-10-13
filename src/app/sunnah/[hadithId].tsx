import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hadithService } from '@/services/hadithService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { getLocalizedHadith } from '@/services/multilingualContentService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';

const STORY_IMAGES = {
  smileSchool: require('../../../assets/images/story-smile-school.jpg'),
  smileHappy: require('../../../assets/images/story-smile-happy.jpg'),
  quranReading: require('../../../assets/images/story-quran-reading.jpg'),
  parentsHug: require('../../../assets/images/story-parents-hug.jpg'),
  gentleNature: require('../../../assets/images/story-gentle-nature.jpg'),
  sunnahPath: require('../../../assets/images/sunnah-path.jpg'),
};

const getSceneImage = (hadithId: string, sceneIndex: number, theme: string) => {
  if (hadithId === 'smile-charity') {
    return sceneIndex === 0 ? STORY_IMAGES.smileSchool : STORY_IMAGES.smileHappy;
  }
  if (hadithId === 'quran-learners' || hadithId === 'seeking-knowledge') {
    return STORY_IMAGES.quranReading;
  }
  if (hadithId === 'parents-kindness' || hadithId === 'mercy-to-young') {
    return STORY_IMAGES.parentsHug;
  }
  if (
    hadithId === 'mercy-living' ||
    hadithId === 'gentleness-matters' ||
    hadithId === 'removing-harm'
  ) {
    return STORY_IMAGES.gentleNature;
  }
  if (theme === 'knowledge') return STORY_IMAGES.quranReading;
  if (theme === 'parents' || theme === 'kindness') return STORY_IMAGES.parentsHug;
  if (theme === 'mercy' || theme === 'cleanliness') return STORY_IMAGES.gentleNature;
  if (theme === 'smiling') return STORY_IMAGES.smileHappy;
  return STORY_IMAGES.sunnahPath;
};

export default function HadithDetailScreen() {
  const { hadithId } = useLocalSearchParams();
  const { language, completeHadith } = useAppStore();
  const t = TRANSLATIONS[language];

  const hadith =
    hadithService.getById(String(hadithId)) || hadithService.getAll()[0];

  const localized = getLocalizedHadith(hadith, language);
  const [activeStoryScene, setActiveStoryScene] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const currentScene = localized.miniStory[activeStoryScene];
  const sceneImg = getSceneImage(hadith.id, activeStoryScene, hadith.theme);
  const selectedChoice = localized.scenario.choices.find((c) => c.id === selectedChoiceId);

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    const choice = hadith.scenario.choices.find((c) => c.id === choiceId);
    if (choice?.isCorrect) {
      completeHadith(hadith.id, 2);
      setShowCelebration(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        title={localized.title}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hadith Core Card */}
        <View style={styles.hadithCard}>
          <View style={styles.topBadgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{hadith.grade}</Text>
            </View>
            <View style={styles.sunnahRefBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#0369A1" />
              <Text style={styles.sunnahRefBadgeText}>
                {hadith.source}
              </Text>
            </View>
          </View>

          <Text style={styles.hadithArabicText}>{hadith.arabicText}</Text>

          <View style={styles.narratorBox}>
            <Text style={styles.narratorText}>
              {t.narrator}:{' '}
              {localized.narrator}
            </Text>
          </View>

          <Text style={styles.explanationText}>
            {localized.explanation}
          </Text>
        </View>

        {/* Mini-Story Component (S2) */}
        <View style={styles.storySection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="book" size={20} color={COLORS.secondaryDark} />
            <Text style={styles.sectionTitle}>
              {language === 'ar'
                ? 'قصة مصورة عن الحديث'
                : language === 'fr'
                ? 'Mini-histoire illustrée'
                : language === 'de'
                ? 'Illustrierte Kurzgeschichte'
                : language === 'es'
                ? 'Mini-historia ilustrada'
                : 'Illustrated Mini-Story'}
            </Text>
          </View>

          <View style={styles.storyCard}>
            <View style={styles.sceneHeader}>
              <Text style={styles.sceneTitle}>
                {currentScene.title}
              </Text>
              <Text style={styles.sceneCounter}>
                {activeStoryScene + 1} / {hadith.miniStory.length}
              </Text>
            </View>

            <View style={styles.sceneImageContainer}>
              <Image
                source={sceneImg}
                style={styles.sceneImage}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.sceneText}>
              {currentScene.text}
            </Text>

            {/* Scene Navigation */}
            <View style={styles.sceneNavRow}>
              <TouchableOpacity
                style={[
                  styles.navMiniBtn,
                  activeStoryScene === 0 && { opacity: 0.4 },
                ]}
                disabled={activeStoryScene === 0}
                onPress={() => setActiveStoryScene(activeStoryScene - 1)}
              >
                <Ionicons
                  name={language === 'ar' ? 'arrow-forward' : 'arrow-back'}
                  size={18}
                  color={COLORS.text}
                />
                <Text style={styles.navMiniBtnText}>{t.prevScene}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navMiniBtn,
                  activeStoryScene >= hadith.miniStory.length - 1 && {
                    opacity: 0.4,
                  },
                ]}
                disabled={activeStoryScene >= hadith.miniStory.length - 1}
                onPress={() => setActiveStoryScene(activeStoryScene + 1)}
              >
                <Text style={styles.navMiniBtnText}>{t.nextScene}</Text>
                <Ionicons
                  name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
                  size={18}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* "What would you do?" Scenario Component (S3) */}
        <View style={styles.scenarioSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="help-circle" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{t.whatWouldYouDo}</Text>
          </View>

          <View style={styles.scenarioCard}>
            <Text style={styles.scenarioPrompt}>
              {localized.scenario.prompt}
            </Text>

            <View style={styles.choicesList}>
              {localized.scenario.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;

                return (
                  <TouchableOpacity
                    key={choice.id}
                    style={[
                      styles.choiceCard,
                      isSelected &&
                        (choice.isCorrect
                          ? styles.choiceCardCorrect
                          : styles.choiceCardWrong),
                    ]}
                    onPress={() => handleChoiceSelect(choice.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={
                        isSelected
                          ? choice.isCorrect
                            ? 'checkmark-circle'
                            : 'alert-circle'
                          : 'radio-button-off'
                      }
                      size={22}
                      color={
                        isSelected
                          ? choice.isCorrect
                            ? COLORS.success
                            : COLORS.warning
                          : COLORS.textMuted
                      }
                    />
                    <Text style={styles.choiceText}>
                      {choice.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Gentle Feedback Box */}
            {selectedChoice && (
              <View
                style={[
                  styles.feedbackBox,
                  selectedChoice.isCorrect
                    ? styles.feedbackBoxCorrect
                    : styles.feedbackBoxGentle,
                ]}
              >
                <Text style={styles.feedbackTitle}>
                  {selectedChoice.isCorrect
                    ? t.correctChoiceFeedback
                    : t.gentleWrongFeedback}
                </Text>
                <Text style={styles.feedbackExplanation}>
                  {selectedChoice.explanation}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={2}
        gemsEarned={3}
        title={t.congratulations}
        subtitle={
          language === 'ar'
            ? 'أحسنت اختيار السلوك النبوي الشريف!'
            : language === 'fr'
            ? 'Bravo ! Tu as choisi la noble voie prophétique !'
            : language === 'de'
            ? 'Gut gemacht! Du hast den edlen prophetischen Weg gewählt!'
            : language === 'es'
            ? '¡Bien hecho! ¡Elegiste el noble camino de la Sunnah!'
            : 'Well done choosing the noble Sunnah way!'
        }
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
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  hadithCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  sunnahRefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  sunnahRefBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  hadithArabicText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondaryDark,
    textAlign: 'center',
    lineHeight: 34,
    marginVertical: SPACING.md,
  },
  narratorBox: {
    backgroundColor: COLORS.cardAlt,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  narratorText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  storySection: {
    gap: SPACING.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  storyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sceneTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  sceneCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  sceneImageContainer: {
    width: '100%',
    height: 190,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginVertical: SPACING.md,
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  sceneImage: {
    width: '100%',
    height: '100%',
  },
  sceneText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  sceneNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  navMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  navMiniBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  scenarioSection: {
    gap: SPACING.xs,
  },
  scenarioCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  scenarioPrompt: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  choicesList: {
    gap: SPACING.sm,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  choiceCardCorrect: {
    backgroundColor: COLORS.successLight + '33',
    borderColor: COLORS.success,
  },
  choiceCardWrong: {
    backgroundColor: COLORS.warningLight + '33',
    borderColor: COLORS.warning,
  },
  choiceText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 18,
  },
  feedbackBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  feedbackBoxCorrect: {
    backgroundColor: COLORS.successLight + '33',
    borderColor: COLORS.success,
  },
  feedbackBoxGentle: {
    backgroundColor: COLORS.warningLight + '33',
    borderColor: COLORS.warning,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  feedbackExplanation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
