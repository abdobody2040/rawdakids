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
import { TRANSLATIONS, AVAILABLE_LANGUAGES, LANGUAGE_LOCALIZED_NAMES, isRTL } from '@/constants/i18n';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import MascotNoor from '@/components/MascotNoor';
import KidAvatar, { PRESET_AVATARS, getAvatarDisplayName } from '@/components/KidAvatar';
import { getLocalizedAgeTone } from '@/services/ageAdaptiveService';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';


const QURAN_GARDEN_IMG = require('../../assets/images/quran-garden.jpg');
const PRAYER_WORLD_IMG = require('../../assets/images/wudu-garden.jpg');
const SUNNAH_PATH_IMG = require('../../assets/images/sunnah-path.jpg');
const PROPHETS_CARAVAN_IMG = require('../../assets/images/prophets-caravan.jpg');
const ASMA_ALLAH_IMG = require('../../assets/images/asma-allah-world.jpg');
const TAFAKKUR_WORLD_IMG = require('../../assets/images/tafakkur-world.jpg');
const AGE_SPROUT_IMG = require('../../assets/images/age-sprout-3d.jpg');
const AGE_ROCKET_IMG = require('../../assets/images/age-rocket-3d.jpg');
const AGE_SCHOLAR_IMG = require('../../assets/images/age-scholar-3d.jpg');

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, profiles, addProfile, deleteProfile, completeOnboarding } = useAppStore();
  const t = TRANSLATIONS[language];

  const isAr = language === 'ar';
  const isRightToLeft = isRTL(language);
  useDocumentTitle(isAr ? 'البداية – تخصيص التجربة' : 'Welcome – Setup');

  const [step, setStep] = useState<number>(1);
  const [childName, setChildName] = useState<string>('');
  const [selectedAgeBand, setSelectedAgeBand] = useState<AgeBand>('7-9');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('av-boy1');
  const [selectedDestination, setSelectedDestination] = useState<string>('/quran');
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);

  const handleGuestPreview = () => {
    completeOnboarding(true);
    router.replace('/');
  };

  const worlds = [
    {
      id: 'quran',
      route: '/quran',
      title: isAr ? 'حَدِيقَةُ الْقُرْآنِ' : t.quran,
      desc: isAr ? '١١٤ سُورَةً مُبَارَكَةً — تِلَاوَةٌ وَحِفْظٌ وَتَفْسِيرٌ مُيَسَّرٌ' : t.quranDesc,
      badge: isAr ? '١١٤ سُورَةً' : '114 Surahs',
      icon: 'book-outline',
      themeColor: '#059669',
      bgSelected: '#ECFDF5',
      image: QURAN_GARDEN_IMG,
    },
    {
      id: 'worship',
      route: '/prayer',
      title: isAr ? 'صَلَاتِي وَوُضُوئِي' : (language === 'en' ? 'My Prayer & Wudu' : (t.learnWuduSalah || 'Prayer & Wudu')),
      desc: isAr ? 'تَعَلَّمِ الْوُضُوءَ وَالصَّلَاةَ الْمُبَارَكَةَ خُطْوَةً بِخُطْوَةٍ مَعَ الْأَذْكَارِ' : (language === 'en' ? 'Interactive Wudu & Salah simulator with daily adhkar' : (t.learnWuduSalah || 'Learn Wudu & Prayer')),
      badge: isAr ? 'تَفَاعُلِيٌّ' : 'Interactive',
      icon: 'water-outline',
      themeColor: '#0284C7',
      bgSelected: '#E0F2FE',
      image: PRAYER_WORLD_IMG,
    },
    {
      id: 'stories',
      route: '/prophets',
      title: isAr ? 'قِصَصُ الْأَنْبِيَاءِ وَالسِّيرَةُ' : (language === 'en' ? 'Prophets & Seerah Stories' : t.prophets),
      desc: isAr ? '٢٥ نَبِيًّا وَرَسُولًا وَسِيرَةُ الْحَبِيبِ ﷺ وَصِحَابَتِهِ الْأَبْطَالِ' : t.prophetsDesc,
      badge: isAr ? '٢٥ نَبِيًّا' : (t.prophetsCount || '25 Prophets'),
      icon: 'trail-sign-outline',
      themeColor: '#7C3AED',
      bgSelected: '#EDE9FE',
      image: PROPHETS_CARAVAN_IMG,
    },
    {
      id: 'akhlaq',
      route: '/manners',
      title: isAr ? 'الْأَخْلَاقُ وَالسُّنَّةُ' : (language === 'en' ? 'Character & Sunnah' : t.manners),
      desc: isAr ? '١٠٠ حَدِيثٍ نَبَوِيٍّ شَرِيفٍ وَمَوَاقِفُ تَرْبَوِيَّةٌ فِي حُسْنِ الْخُلُقِ' : t.mannersDesc,
      badge: isAr ? '١٠٠ حَدِيثٍ' : (language === 'en' ? '100 Hadiths' : (t.mannersCount || '100 Hadiths')),
      icon: 'heart-outline',
      themeColor: '#D97706',
      bgSelected: '#FEF3C7',
      image: SUNNAH_PATH_IMG,
    },
    {
      id: 'asmaAllah',
      route: '/asma-allah',
      title: isAr ? 'أَسْمَاءُ اللَّهِ الْحُسْنَى' : (t.asmaAllahWorld || 'Names of Allah'),
      desc: isAr ? '٩٩ اسْمًا مُبَارَكًا نَتَعَلَّمُ مَعَانِيهَا الْجَمِيلَةَ وَنَعِيشُهَا كُلَّ يَوْمٍ' : (t.asmaAllahWorldDesc || 'Discover the 99 Names of Allah and live their virtues'),
      badge: isAr ? '٩٩ اسْمًا' : (t.asmaAllahWorldCount || '99 Names'),
      icon: 'sparkles-outline',
      themeColor: '#5B21B6',
      bgSelected: '#F5F3FF',
      image: ASMA_ALLAH_IMG,
    },
    {
      id: 'wonder',
      route: '/tafakkur',
      title: isAr ? 'عَالَمُ التَّفَكُّرِ فِي الْكَوْنِ' : (t.tafakkurWorld || 'Wonder & Creation'),
      desc: isAr ? 'آيَاتُ اللَّهِ وَبَدَائِعُ صُنْعِهِ فِي السَّمَاوَاتِ وَالْأَرْضِ وَالْكَائِنَاتِ' : (t.tafakkurWorldDesc || 'Contemplate Allah\'s signs in nature, skies and creation'),
      badge: isAr ? 'تَأَمُّلٌ' : (t.tafakkurWorldCount || 'Wonder'),
      icon: 'planet-outline',
      themeColor: '#0369A1',
      bgSelected: '#E0F2FE',
      image: TAFAKKUR_WORLD_IMG,
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
    addProfile({
      name: chosenName, // empty string → home shows يا بطل
      ageBand: selectedAgeBand,
      avatar: selectedAvatar,
    });
    completeOnboarding(false);
    router.replace(selectedDestination as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} role="main">
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

            <Text style={styles.heading} role="heading" aria-level={1}>{t.appName}</Text>
            <Text style={styles.subheading}>{t.tagline}</Text>

            <View style={styles.langSelectorArea}>
              <Text style={styles.fieldLabel}>{t.chooseLanguage}</Text>
              <View style={styles.langButtonsRow} role="radiogroup" aria-label={t.chooseLanguage}>
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.langCard,
                        isSelected && styles.langCardSelected,
                      ]}
                      onPress={() => setLanguage(lang.code)}
                      activeOpacity={0.8}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`${lang.nameNative} (${lang.nameEnglish})`}
                    >
                      <View style={styles.langImageContainer}>
                        <View style={styles.langEmojiWrapper}>
                          <Text style={styles.langEmojiText}>{lang.code.toUpperCase()}</Text>
                        </View>
                      </View>
                      <Text style={[styles.langTitle, isSelected && styles.langTitleSelected]}>
                        {lang.nameNative}
                      </Text>
                      <Text style={styles.langSub}>
                        {LANGUAGE_LOCALIZED_NAMES[language]?.[lang.code] || lang.nameNative}
                      </Text>
                      {isSelected && (
                        <View style={styles.langCheckBadgeCircle}>
                          <Text style={styles.langCheckBadgeText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(2)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>{t.continue}</Text>
              <Text style={styles.buttonArrowText}>
                {language === 'ar' ? '←' : '→'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestPreviewButton}
              onPress={handleGuestPreview}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={language === 'ar' ? 'تصفّح التطبيق كضيف دون إدخال بيانات' : 'Preview the app without entering data'}
            >
              <Ionicons name="compass-outline" size={18} color={COLORS.primaryDark} />
              <Text style={styles.guestPreviewButtonText}>
                {language === 'ar' ? 'تصفّح التطبيق كضيف' : 'Preview the app'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Child Profile */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading} role="heading" aria-level={1}>{t.addChild}</Text>
            <Text style={styles.subheading}>
              {language === 'ar'
                ? 'خصص تجربة رائعة تناسب عمر البطل'
                : 'Customize a joyful journey for your child'}
            </Text>

            {/* Child Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {language === 'ar' ? 'اسم الطفل أو اللقب (اختياري)' : 'Child’s Name or Nickname (Optional)'}
              </Text>
              <Text style={styles.fieldExplanation}>
                {language === 'ar'
                  ? 'نستخدمه لتشجيع طفلك ومناداته باسمه أو لقبه المفضل أثناء التلاوة والإنجازات.'
                  : 'Used to cheer on your child and personalize their learning achievements.'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={language === 'ar' ? 'مثال: طارق أو مريم (يمكنك تركه فارغاً)' : 'e.g., Tariq or Maryam (can be left blank)'}
                placeholderTextColor={COLORS.textMuted}
                value={childName}
                onChangeText={setChildName}
                autoComplete="off"
                accessibilityLabel={language === 'ar' ? 'اسم الطفل أو اللقب اختياري' : 'Child name or nickname optional'}
              />
            </View>

            {/* Age Band */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.ageBand}</Text>
              <Text style={styles.fieldExplanation}>
                {language === 'ar'
                  ? 'نحدد به حجم الخط ومستوى التفسير وصعوبة الأنشطة لتناسب مرحلة طفلك بدقة.'
                  : 'Customizes font sizes, explanation depth, and activity pacing for your child’s age.'}
              </Text>
              <View style={styles.ageBandList} role="radiogroup" aria-label={t.ageBand}>
                <TouchableOpacity
                  style={[
                    styles.ageBandCard,
                    selectedAgeBand === '4-6' && styles.ageBandCardSelected,
                  ]}
                  onPress={() => setSelectedAgeBand('4-6')}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedAgeBand === '4-6' }}
                  accessibilityLabel={`${t.ageBandExplorers}: ${language === 'ar' ? 'أزرار كبيرة وإرشاد صوتي' : 'Large buttons & voice guided'}`}
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedAgeBand === '7-9' }}
                  accessibilityLabel={`${t.ageBandLearners}: ${language === 'ar' ? 'ألعاب تفاعلية ومسابقات خفيفة' : 'Games, quizzes & light reading'}`}
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedAgeBand === '10-13' }}
                  accessibilityLabel={`${t.ageBandMinds}: ${language === 'ar' ? 'معانٍ عميقة وتحديات حفظ' : 'Deeper meanings & memory tests'}`}
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

            {/* Avatar Choices (Deferred / Optional Step) */}
            <View style={styles.fieldGroup}>
              <TouchableOpacity
                style={styles.avatarToggleHeader}
                onPress={() => setShowAvatarPicker((prev) => !prev)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={language === 'ar' ? 'تخصيص الرمز التعبيري والصورة، اختياري' : 'Customize avatar and photo, optional'}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>
                    {language === 'ar' ? 'الصورة الرمزية (اختياري)' : 'Avatar & Photo (Optional)'}
                  </Text>
                  <Text style={styles.fieldExplanation}>
                    {language === 'ar'
                      ? 'اختر شخصية كرتونية مبهجة تمثل طفلك، أو يمكنك اختيارها لاحقاً.'
                      : 'Pick a joyful character for your child, or customize it anytime.'}
                  </Text>
                </View>
                <View style={styles.avatarToggleBadge}>
                  <KidAvatar avatar={selectedAvatar} size={36} />
                  <Ionicons
                    name={showAvatarPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
              </TouchableOpacity>

              {showAvatarPicker && (
                <View style={styles.avatarPickerExpandable}>
                  <View style={styles.avatarLabelRow}>
                    <Text style={styles.avatarSubLabel}>
                      {language === 'ar' ? 'اختر شخصية أو ارفع صورة:' : 'Choose a character or upload photo:'}
                    </Text>
                    <TouchableOpacity
                      style={styles.uploadPhotoBtn}
                      onPress={handleUploadClick}
                      activeOpacity={0.8}
                      accessibilityRole="button"
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
                          <View style={styles.avatarSelectedBadgeCircle}>
                            <Text style={styles.avatarSelectedBadgeText}>✓</Text>
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
                            <View style={styles.avatarSelectedBadgeCircle}>
                              <Text style={styles.avatarSelectedBadgeText}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep(1)}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>{t.back}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { flex: 2 }]}
                onPress={() => setStep(3)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>{t.continue}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: Choose First World & Start */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading} role="heading" aria-level={1}>
              {language === 'ar' ? 'اخْتَرْ وِجْهَتَكَ الْأُولَى يَا بَطَلُ! 🚀' : 'Choose your first journey, hero! 🚀'}
            </Text>
            <Text style={styles.subheading}>
              {language === 'ar'
                ? 'انْقُرْ عَلَى الْعَالَمِ الَّذِي تَوَدُّ الْبَدْءَ فِيهِ، وَيُمْكِنُكَ التَّنَقُّلُ بَيْنَ جَمِيعِ الْعَوَالِمِ فِي أَيِّ وَقْتٍ'
                : 'Select the world you want to start with. You can explore and switch between all worlds anytime!'}
            </Text>

            <View
              style={styles.worldsPreviewList}
              role="radiogroup"
              aria-label={language === 'ar' ? 'اختر وجهتك الأولى' : 'Choose your first journey'}
            >
              {worlds.map((w) => {
                const isSelected = selectedDestination === w.route;

                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[
                      styles.worldPreviewCard,
                      {
                        flexDirection: isRightToLeft ? 'row-reverse' : 'row',
                        borderColor: isSelected ? w.themeColor : '#E2E8F0',
                      },
                      isSelected && {
                        backgroundColor: w.bgSelected,
                        borderWidth: 2.5,
                        borderColor: w.themeColor,
                        shadowColor: w.themeColor,
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 4,
                      },
                    ]}
                    onPress={() => setSelectedDestination(w.route)}
                    activeOpacity={0.85}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${w.title}: ${w.desc}`}
                  >
                    <Image
                      source={w.image}
                      style={[
                        styles.worldThumb,
                        isSelected && { borderColor: w.themeColor, borderWidth: 2 },
                      ]}
                      contentFit="cover"
                      transition={150}
                    />
                    <View style={[styles.worldContentCol, { alignItems: isRightToLeft ? 'flex-end' : 'flex-start' }]}>
                      <View style={[styles.worldTitleRow, { flexDirection: isRightToLeft ? 'row-reverse' : 'row' }]}>
                        <Text
                          style={[
                            styles.worldTitle,
                            { textAlign: isRightToLeft ? 'right' : 'left' },
                            isSelected && { color: w.themeColor, fontWeight: '900' },
                          ]}
                        >
                          {w.title}
                        </Text>
                        <View style={[styles.worldBadgeChip, { backgroundColor: w.themeColor + '18' }]}>
                          <Text style={[styles.worldBadgeText, { color: w.themeColor }]}>
                            {w.badge}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.worldDesc,
                          { textAlign: isRightToLeft ? 'right' : 'left' },
                        ]}
                      >
                        {w.desc}
                      </Text>
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
                      {isSelected ? (
                        <Text style={styles.worldRadioCheckText}>✓</Text>
                      ) : (
                        <View style={styles.worldRadioInnerEmpty} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep(2)}
                accessibilityRole="button"
                accessibilityLabel={t.back}
              >
                <Text style={styles.secondaryButtonText}>{t.back}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { flex: 2 }]}
                onPress={handleFinish}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={t.start}
              >
                <Text style={styles.primaryButtonText}>{t.start}</Text>
                <Text style={styles.buttonSparkleText}>✨</Text>
              </TouchableOpacity>
            </View>
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
    flexWrap: 'wrap',
    gap: 12,
    marginTop: SPACING.xs,
    justifyContent: 'center',
  },
  langCard: {
    flex: 1,
    minWidth: 130,
    maxWidth: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    position: 'relative',
    ...SHADOWS.soft,
  },
  langCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#ECFDF5',
  },
  langImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#FBBF24',
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langEmojiWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  langEmojiText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  langImage: {
    width: '100%',
    height: '100%',
  },
  langTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  langTitleSelected: {
    color: COLORS.primaryDark,
  },
  langSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  langCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  langCheckBadgeCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  langCheckBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 14,
    textAlign: 'center',
  },
  buttonArrowText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 6,
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
  avatarSelectedBadgeCircle: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  avatarSelectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 14,
    textAlign: 'center',
  },
  buttonSparkleText: {
    fontSize: 18,
    marginLeft: 6,
  },
  worldsPreviewList: {
    gap: SPACING.md - 2,
    marginBottom: SPACING.lg,
  },
  worldPreviewCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    gap: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  worldThumb: {
    width: 62,
    height: 62,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F1F5F9',
  },
  worldContentCol: {
    flex: 1,
    gap: 4,
  },
  worldTitleRow: {
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  worldTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  worldBadgeChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  worldBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  worldDesc: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  worldSelectRadio: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldRadioInnerEmpty: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  worldRadioCheckText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 15,
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
  guestPreviewButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  guestPreviewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  fieldExplanation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  avatarToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 4,
  },
  avatarToggleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  avatarPickerExpandable: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  avatarSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
