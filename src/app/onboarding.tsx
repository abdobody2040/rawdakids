// Onboarding Screen (≤ 60 seconds - Flow 5.7)
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, AgeBand } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import MascotNoor from '@/components/MascotNoor';
import KidAvatar, { PRESET_AVATARS, getAvatarDisplayName } from '@/components/KidAvatar';
import { getLocalizedAgeTone } from '@/services/ageAdaptiveService';


const QURAN_GARDEN_IMG = require('../../assets/images/quran-garden.jpg');
const SUNNAH_PATH_IMG = require('../../assets/images/sunnah-path.jpg');
const PROPHETS_CARAVAN_IMG = require('../../assets/images/prophets-caravan.jpg');
const MANNERS_TOWN_IMG = require('../../assets/images/manners-town.jpg');
const LANG_ARABIC_IMG = require('../../assets/images/lang-arabic-3d.jpg');
const LANG_ENGLISH_IMG = require('../../assets/images/lang-english-3d.jpg');
const AGE_SPROUT_IMG = require('../../assets/images/age-sprout-3d.jpg');
const AGE_ROCKET_IMG = require('../../assets/images/age-rocket-3d.jpg');
const AGE_SCHOLAR_IMG = require('../../assets/images/age-scholar-3d.jpg');

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, profiles, addProfile, deleteProfile, completeOnboarding } = useAppStore();
  const t = TRANSLATIONS[language];

  const [step, setStep] = useState<number>(1);
  const [childName, setChildName] = useState<string>('');
  const [selectedAgeBand, setSelectedAgeBand] = useState<AgeBand>('7-9');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('av-boy1');
  const [selectedDestination, setSelectedDestination] = useState<string>('/quran');
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);

  const worlds = [
    {
      id: 'quran',
      route: '/quran',
      title: t.quran,
      desc: t.quranDesc,
      icon: '📖',
      themeColor: COLORS.quranGarden.primary,
      image: QURAN_GARDEN_IMG,
    },
    {
      id: 'sunnah',
      route: '/sunnah',
      title: t.sunnah,
      desc: t.sunnahDesc,
      icon: '🌙',
      themeColor: COLORS.sunnahPath.primary,
      image: SUNNAH_PATH_IMG,
    },
    {
      id: 'prophets',
      route: '/prophets',
      title: t.prophets,
      desc: t.prophetsDesc,
      icon: '🕌',
      themeColor: COLORS.prophetsCaravan.primary,
      image: PROPHETS_CARAVAN_IMG,
    },
    {
      id: 'manners',
      route: '/manners',
      title: t.manners,
      desc: t.mannersDesc,
      icon: '🌟',
      themeColor: COLORS.mannersTown.primary,
      image: MANNERS_TOWN_IMG,
    },
  ];

  const handleUploadClick = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const res = ev.target?.result as string;
            if (res) {
              setCustomPhotoUri(res);
              setSelectedAvatar(res);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleFinish = () => {
    const chosenName = childName.trim();
    if (profiles.length === 1 && profiles[0].id === 'default-child') {
      addProfile({
        name: chosenName || (language === 'ar' ? 'البطل' : 'Champion'),
        ageBand: selectedAgeBand,
        avatar: selectedAvatar,
      });
      deleteProfile('default-child');
    } else {
      addProfile({
        name: chosenName || (language === 'ar' ? 'البطل' : 'Champion'),
        ageBand: selectedAgeBand,
        avatar: selectedAvatar,
      });
    }
    completeOnboarding();
    router.replace(selectedDestination as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Step Indicator */}
        <View style={styles.stepIndicatorRow}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                step === s && styles.stepDotActive,
                step > s && styles.stepDotDone,
              ]}
            />
          ))}
        </View>

        {/* STEP 1: Welcome & Language */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.bismillahBox}>
              <Text style={styles.bismillahText}>{t.bismillah}</Text>
            </View>

            <MascotNoor customMessage={t.mascotGreeting} size="lg" />

            <Text style={styles.heading}>{t.appName}</Text>
            <Text style={styles.subheading}>{t.tagline}</Text>

            <View style={styles.langSelectorArea}>
              <Text style={styles.fieldLabel}>اختر لغة التطبيق / Choose Language</Text>
              <View style={styles.langButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.langCard,
                    language === 'ar' && styles.langCardSelected,
                  ]}
                  onPress={() => setLanguage('ar')}
                  activeOpacity={0.8}
                >
                  <View style={styles.langImageContainer}>
                    <Image
                      source={LANG_ARABIC_IMG}
                      style={styles.langImage}
                      contentFit="cover"
                      transition={150}
                    />
                  </View>
                  <Text style={styles.langTitle}>العربية</Text>
                  <Text style={styles.langSub}>اللغة الأساسية</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.langCard,
                    language === 'en' && styles.langCardSelected,
                  ]}
                  onPress={() => setLanguage('en')}
                  activeOpacity={0.8}
                >
                  <View style={styles.langImageContainer}>
                    <Image
                      source={LANG_ENGLISH_IMG}
                      style={styles.langImage}
                      contentFit="cover"
                      transition={150}
                    />
                  </View>
                  <Text style={styles.langTitle}>English</Text>
                  <Text style={styles.langSub}>Second Language</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(2)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{t.continue}</Text>
              <Ionicons
                name={language === 'ar' ? 'arrow-back' : 'arrow-forward'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Child Profile */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>{t.addChild}</Text>
            <Text style={styles.subheading}>
              {language === 'ar'
                ? 'خصص تجربة رائعة تناسب عمر البطل'
                : 'Customize a joyful journey for your child'}
            </Text>

            {/* Child Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.childName}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={language === 'ar' ? 'مثال: طارق أو مريم' : 'e.g., Tariq or Maryam'}
                placeholderTextColor={COLORS.textMuted}
                value={childName}
                onChangeText={setChildName}
              />
            </View>

            {/* Age Band */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.ageBand}</Text>
              <View style={styles.ageBandList}>
                <TouchableOpacity
                  style={[
                    styles.ageBandCard,
                    selectedAgeBand === '4-6' && styles.ageBandCardSelected,
                  ]}
                  onPress={() => setSelectedAgeBand('4-6')}
                  activeOpacity={0.8}
                >
                  <View style={styles.ageBandImgContainer}>
                    <Image
                      source={AGE_SPROUT_IMG}
                      style={styles.ageBandImg}
                      contentFit="cover"
                      transition={150}
                    />
                  </View>
                  <View style={styles.ageBandTextCol}>
                    <Text style={styles.ageBandTitle}>{t.ageBandExplorers}</Text>
                    <Text style={styles.ageBandDesc}>
                      {language === 'ar' ? 'أزرار كبيرة وإرشاد صوتي' : 'Large buttons & voice guided'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.ageBandCard,
                    selectedAgeBand === '7-9' && styles.ageBandCardSelected,
                  ]}
                  onPress={() => setSelectedAgeBand('7-9')}
                  activeOpacity={0.8}
                >
                  <View style={styles.ageBandImgContainer}>
                    <Image
                      source={AGE_ROCKET_IMG}
                      style={styles.ageBandImg}
                      contentFit="cover"
                      transition={150}
                    />
                  </View>
                  <View style={styles.ageBandTextCol}>
                    <Text style={styles.ageBandTitle}>{t.ageBandLearners}</Text>
                    <Text style={styles.ageBandDesc}>
                      {language === 'ar' ? 'ألعاب تفاعلية ومسابقات خفيفة' : 'Games, quizzes & light reading'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.ageBandCard,
                    selectedAgeBand === '10-13' && styles.ageBandCardSelected,
                  ]}
                  onPress={() => setSelectedAgeBand('10-13')}
                  activeOpacity={0.8}
                >
                  <View style={styles.ageBandImgContainer}>
                    <Image
                      source={AGE_SCHOLAR_IMG}
                      style={styles.ageBandImg}
                      contentFit="cover"
                      transition={150}
                    />
                  </View>
                  <View style={styles.ageBandTextCol}>
                    <Text style={styles.ageBandTitle}>{t.ageBandMinds}</Text>
                    <Text style={styles.ageBandDesc}>
                      {language === 'ar' ? 'معانٍ عميقة وتحديات حفظ' : 'Deeper meanings & memory tests'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Dynamic Tone Preview: Proves to user that tone adapts to age */}
              <View style={styles.tonePreviewCard}>
                <View style={[styles.tonePreviewHeader, language === 'ar' && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="sparkles" size={16} color="#B45309" />
                  <Text style={styles.tonePreviewTitle}>
                    {language === 'ar' ? 'نبرة المحتوى والتجربة لهذا العمر:' : 'Content Tone for this Age:'}
                  </Text>
                </View>
                <Text style={[styles.tonePreviewText, language === 'ar' && { textAlign: 'right' }]}>
                  {getLocalizedAgeTone(selectedAgeBand, language).toneSummary}
                </Text>
              </View>
            </View>

            {/* Avatar Choices (3D Pixar Images + Custom Photo Upload) */}
            <View style={styles.fieldGroup}>
              <View style={styles.avatarLabelRow}>
                <Text style={styles.fieldLabel}>{t.avatars}</Text>
                <TouchableOpacity
                  style={styles.uploadPhotoBtn}
                  onPress={handleUploadClick}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera" size={16} color={COLORS.primaryDark} />
                  <Text style={styles.uploadPhotoBtnText}>
                    {language === 'ar' ? 'رفع صورتي 📷' : 'Upload Photo 📷'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.avatarScrollRow}
              >
                {/* Uploaded Custom Photo Card if present */}
                {customPhotoUri && (
                  <TouchableOpacity
                    style={[
                      styles.avatarCard3D,
                      selectedAvatar === customPhotoUri && styles.avatarCard3DSelected,
                    ]}
                    onPress={() => setSelectedAvatar(customPhotoUri)}
                    activeOpacity={0.85}
                  >
                    <KidAvatar avatar={customPhotoUri} size={62} />
                    <Text style={styles.avatarCardName}>
                      {language === 'ar' ? 'صورتي' : 'My Photo'}
                    </Text>
                    {selectedAvatar === customPhotoUri && (
                      <View style={styles.avatarSelectedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#059669" />
                      </View>
                    )}
                  </TouchableOpacity>
                )}

                {/* 3D Pixar Preset Avatars */}
                {PRESET_AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <TouchableOpacity
                      key={av.id}
                      style={[
                        styles.avatarCard3D,
                        isSelected && styles.avatarCard3DSelected,
                      ]}
                      onPress={() => setSelectedAvatar(av.id)}
                      activeOpacity={0.85}
                    >
                      <KidAvatar avatar={av.id} size={62} />
                      <Text
                        style={[
                          styles.avatarCardName,
                          isSelected && styles.avatarCardNameSelected,
                        ]}
                      >
                        {getAvatarDisplayName(av.id, childName, language)}
                      </Text>
                      {isSelected && (
                        <View style={styles.avatarSelectedBadge}>
                          <Ionicons name="checkmark-circle" size={18} color="#059669" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.secondaryButtonText}>{t.back}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { flex: 2 }]}
                onPress={() => setStep(3)}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>{t.continue}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: Choose First World & Start */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>
              {language === 'ar' ? 'اختر وجهتك الأولى يا بطل!' : 'Choose your first journey!'}
            </Text>
            <Text style={styles.subheading}>
              {language === 'ar'
                ? 'انقر على العالم الذي تود البدء فيه، ويمكنك التبديل بين العوالم الأربعة في أي وقت'
                : 'Select the world you want to start with. You can explore all worlds anytime!'}
            </Text>

            <View style={styles.worldsPreviewList}>
              {worlds.map((w) => {
                const isSelected = selectedDestination === w.route;

                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[
                      styles.worldPreviewCard,
                      { borderColor: isSelected ? w.themeColor : '#E2E8F0' },
                      isSelected && {
                        backgroundColor:
                          w.id === 'quran'
                            ? '#ECFDF5'
                            : w.id === 'sunnah'
                            ? '#FEF3C7'
                            : w.id === 'prophets'
                            ? '#EEF2FF'
                            : '#F0F9FF',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedDestination(w.route)}
                    activeOpacity={0.85}
                  >
                    <Image source={w.image} style={styles.worldThumb} contentFit="cover" transition={150} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.worldTitle,
                          isSelected && { color: w.themeColor, fontWeight: '900' },
                        ]}
                      >
                        {w.title}
                      </Text>
                      <Text style={styles.worldDesc}>{w.desc}</Text>
                    </View>
                    <View
                      style={[
                        styles.worldSelectRadio,
                        isSelected && {
                          borderColor: w.themeColor,
                          backgroundColor: w.themeColor,
                        },
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleFinish}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{t.start}</Text>
              <Ionicons name="sparkles" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: SPACING.md,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  stepDotDone: {
    backgroundColor: COLORS.primaryLight,
  },
  stepContent: {
    marginTop: SPACING.sm,
  },
  bismillahBox: {
    backgroundColor: COLORS.quranGarden.light,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bismillahText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.quranGarden.dark,
    fontFamily: 'System',
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  langSelectorArea: {
    marginVertical: SPACING.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  langButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  langCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  langCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#ECFDF5',
  },
  langImageContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#FBBF24',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  langImage: {
    width: '100%',
    height: '100%',
  },
  langTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  langSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  textInput: {
    height: 52,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
  },
  ageBandList: {
    gap: SPACING.sm,
  },
  ageBandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: SPACING.sm,
    overflow: 'hidden',
  },
  ageBandCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
  },
  ageBandImgContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FBBF24',
    backgroundColor: '#FFFFFF',
  },
  ageBandImg: {
    width: '100%',
    height: '100%',
  },
  ageBandTextCol: {
    flex: 1,
  },
  ageBandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  ageBandDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tonePreviewCard: {
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: 12,
    overflow: 'hidden',
  },
  tonePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tonePreviewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  tonePreviewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    lineHeight: 18,
  },
  avatarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  uploadPhotoBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  avatarScrollRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  avatarCard3D: {
    alignItems: 'center',
    padding: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minWidth: 84,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarCard3DSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#ECFDF5',
  },
  avatarCardName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  avatarCardNameSelected: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  avatarSelectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  worldsPreviewList: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  worldPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    gap: SPACING.sm + 4,
    overflow: 'hidden',
  },
  worldThumb: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
  },
  worldTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  worldDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  worldSelectRadio: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  primaryButton: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    ...SHADOWS.glow(COLORS.primary),
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});
