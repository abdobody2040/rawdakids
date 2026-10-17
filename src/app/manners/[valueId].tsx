// Good Manners Scenario Player & Value Pledge (E2, E3)
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { contentService } from '@/services/contentService';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { getLocalizedMannerBuilding, getLocalizedMannerScenario, getMannersProofType, getMannersPledgeText, getMannersCelebrationSubtitle } from '@/services/multilingualContentService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import Header from '@/components/Header';
import StarRewardCelebration from '@/components/StarRewardCelebration';

const MANNER_SCENARIO_IMAGES: Record<string, any> = {
  'honesty-hall': require('../../../assets/images/scene-muhammad-hira.jpg'),
  'parents-palace': require('../../../assets/images/story-parents-hug.jpg'),
  'sharing-center': require('../../../assets/images/manner-sharing.jpg'),
  'cleanliness-corner': require('../../../assets/images/manner-cleanliness.jpg'),
  'respect-house': require('../../../assets/images/nav-manners-3d.jpg'),
  'forgiveness-garden': require('../../../assets/images/hero-oasis.jpg'),
  'gratitude-grove': require('../../../assets/images/gratitude-jar.jpg'),
  'patience-path': require('../../../assets/images/sunnah-path.jpg'),
  'gentleness-glade': require('../../../assets/images/story-gentle-nature.jpg'),
  'cheerfulness-court': require('../../../assets/images/story-smile-happy.jpg'),
  'humility-haven': require('../../../assets/images/quran-garden.jpg'),
  'peace-maker-plaza': require('../../../assets/images/story-smile-school.jpg'),
  'truthful-promise-palace': require('../../../assets/images/prophets-caravan.jpg'),
  'cooperation-castle': require('../../../assets/images/scene-nuh-ark.jpg'),
};

export default function MannersScenarioPlayerScreen() {
  const router = useRouter();
  const { valueId } = useLocalSearchParams();
  const { language, completeScenario, unlockBadge, parentSettings } = useAppStore();
  const showEnglish = language === 'en' || (language === 'ar' && parentSettings?.showEnglishTranslation === true);
  const t = TRANSLATIONS[language];

  const building =
    contentService.getMannersBuildingById(String(valueId)) ||
    contentService.getMannersBuildings()[0];

  const scenario = building.scenarios[0];
  const localizedBuilding = getLocalizedMannerBuilding(building, language);
  const localizedScenario = getLocalizedMannerScenario(scenario, language);

  const scenarioImage = MANNER_SCENARIO_IMAGES[building.id] || require('../../../assets/images/manners-town.jpg');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasPledged, setHasPledged] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const selectedChoice = localizedScenario.choices.find((c) => c.id === selectedChoiceId);

  const handleChoose = (id: string) => {
    setSelectedChoiceId(id);
  };

  const handlePledge = () => {
    setHasPledged(true);
    completeScenario(building.id);
    unlockBadge(building.badgeId);
    setShowCelebration(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        showBack
        title={localizedBuilding.name}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Situation Card with 3D Illustration */}
        <View style={styles.situationCard}>
          {scenarioImage && (
            <View style={styles.scenarioImageWrap}>
              <Image
                source={scenarioImage}
                style={styles.scenarioImage}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.situationHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: building.color + '22' },
              ]}
            >
              <Ionicons
                name={(building.iconName as any) || 'sparkles'}
                size={22}
                color={building.color}
              />
            </View>
            <Text style={styles.scenarioTitle}>
              {localizedScenario.title}
            </Text>
          </View>

          <Text style={styles.situationText}>
            {localizedScenario.situation}
          </Text>
        </View>

        {/* Action Choices */}
        <View style={styles.choicesSection}>
          <Text style={styles.choicesHeader}>{t.whatWouldYouDo}</Text>

          <View style={styles.choicesList}>
            {localizedScenario.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;

              return (
                <TouchableOpacity
                  key={choice.id}
                  style={[
                    styles.choiceCard,
                    isSelected &&
                      (choice.isPositive
                        ? styles.choiceCardPositive
                        : styles.choiceCardGentle),
                  ]}
                  onPress={() => handleChoose(choice.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      isSelected
                        ? choice.isPositive
                          ? 'checkmark-circle'
                          : 'alert-circle'
                        : 'radio-button-off'
                    }
                    size={22}
                    color={
                      isSelected
                        ? choice.isPositive
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
        </View>

        {/* Consequence & Educational Feedback */}
        {selectedChoice && (
          <View
            style={[
              styles.feedbackCard,
              selectedChoice.isPositive
                ? styles.feedbackPositive
                : styles.feedbackGentle,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {selectedChoice.isPositive
                ? t.correctChoiceFeedback
                : t.gentleWrongFeedback}
            </Text>
            <Text style={styles.consequenceText}>
              {selectedChoice.consequence}
            </Text>
          </View>
        )}

        {/* Quran / Hadith Proof Link */}
        <View style={styles.proofCard}>
          <View style={styles.proofHeader}>
            <Ionicons name="bookmark" size={16} color={COLORS.primaryDark} />
            <Text style={styles.proofType}>
              {getMannersProofType(scenario.supportingProof.type, language)}
            </Text>
          </View>

          <Text style={styles.proofArabicText}>
            {scenario.supportingProof.textAr}
          </Text>
          {showEnglish && (
            <Text style={styles.proofTranslation}>
              {scenario.supportingProof.translationEn}
            </Text>
          )}

          <Text style={styles.proofReference}>
            {language === 'ar'
              ? scenario.supportingProof.referenceAr
              : scenario.supportingProof.referenceEn}
          </Text>
        </View>

        {/* Value Pledge Card (E3) */}
        <View style={styles.pledgeCard}>
          <Text style={styles.pledgeTitle}>{t.valuePledge}</Text>
          <Text style={styles.pledgeText}>
            {localizedBuilding.weeklyPledge}
          </Text>

          <TouchableOpacity
            style={[
              styles.pledgeBtn,
              hasPledged && styles.pledgeBtnDone,
              { backgroundColor: building.color },
            ]}
            onPress={handlePledge}
            disabled={hasPledged}
            activeOpacity={0.8}
          >
            <Ionicons
              name={hasPledged ? 'checkmark-circle' : 'hand-left'}
              size={18}
              color="#ffffff"
            />
            <Text style={styles.pledgeBtnText}>
              {getMannersPledgeText(hasPledged, language)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Celebration Modal */}
      <StarRewardCelebration
        visible={showCelebration}
        starsEarned={2}
        gemsEarned={4}
        title={t.congratulations}
        subtitle={getMannersCelebrationSubtitle(language)}
        onDismiss={() => {
          setShowCelebration(false);
          router.replace('/manners');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  situationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  scenarioImageWrap: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  scenarioImage: {
    width: '100%',
    height: '100%',
  },
  situationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  situationText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  choicesSection: {
    gap: SPACING.xs,
  },
  choicesHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  choicesList: {
    gap: SPACING.sm,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  choiceCardPositive: {
    backgroundColor: COLORS.successLight + '33',
    borderColor: COLORS.success,
  },
  choiceCardGentle: {
    backgroundColor: COLORS.warningLight + '33',
    borderColor: COLORS.warning,
  },
  choiceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  feedbackCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
  },
  feedbackPositive: {
    backgroundColor: COLORS.successLight + '33',
    borderColor: COLORS.success,
  },
  feedbackGentle: {
    backgroundColor: COLORS.warningLight + '33',
    borderColor: COLORS.warning,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  consequenceText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  proofCard: {
    backgroundColor: COLORS.quranGarden.light,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.quranGarden.accent + '44',
  },
  proofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  proofType: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
  },
  proofArabicText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
    lineHeight: 26,
    textAlign: 'center',
    marginVertical: SPACING.xs,
  },
  proofTranslation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  proofReference: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  pledgeCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  pledgeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 6,
  },
  pledgeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  pledgeBtn: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.soft,
  },
  pledgeBtnDone: {
    backgroundColor: COLORS.success,
  },
  pledgeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});
