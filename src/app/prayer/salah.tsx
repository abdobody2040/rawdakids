// src/app/prayer/salah.tsx
// Comprehensive 10-Step Interactive Salah Simulator with 3D Visual Assets
// Built according to authentic Sunnah instructions, 10 clear positions, audio recitation, and rich feedback.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { isRTL } from '@/constants/i18n';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { audioService } from '@/services/audioService';
import StarRewardCelebration from '@/components/StarRewardCelebration';
import { getStepMedia } from '@/data/arkanMedia';

export interface SalahStepData {
  step: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  instructionAr: string;
  instructionEn: string;
  dhikrLabelAr: string;
  dhikrLabelEn: string;
  dhikrAr: string;
  dhikrEn: string;
  repsAr: string;
  repsEn: string;
  reflectionAr: string;
  reflectionEn: string;
}

export const SALAH_10_STEPS: SalahStepData[] = [
  {
    step: 1,
    titleAr: 'تَكْبِيرَةُ الْإِحْرَامِ وَالْقِيَامُ',
    titleEn: 'Opening Takbir & Standing',
    subtitleAr: 'اسْتِقْبَالُ الْقِبْلَةِ وَبَدْءُ الصَّلَاةِ',
    subtitleEn: 'Facing the Qiblah & Beginning Salah',
    instructionAr: 'أَقِفُ مُسْتَقْبِلًا الْكَعْبَةَ الْمُشَرَّفَةَ بِهُدُوءٍ وَخُشُوعٍ، وَأَرْفَعُ يَدَيَّ حَذْوَ مَنْكِبَيَّ أَوْ أُذُنَيَّ قَائِلًا: «اللَّهُ أَكْبَرُ».',
    instructionEn: 'Stand calmly facing the Holy Kaaba with focused heart, raise both hands to shoulders or ears and say: "Allahu Akbar".',
    dhikrLabelAr: 'قُلْ عِنْدَ بَدْءِ الصَّلَاةِ',
    dhikrLabelEn: 'Say at the beginning',
    dhikrAr: 'اللَّهُ أَكْبَرُ',
    dhikrEn: 'Allahu Akbar (Allah is the Greatest)',
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
    reflectionAr: 'نبدأ صلاتنا بتعظيم الله، فالله أكبر من كل شيء في حياتنا.',
    reflectionEn: 'We begin prayer by exalting Allah above everything in our lives.',
  },
  {
    step: 2,
    titleAr: 'وَضْعُ الْيَدَيْنِ وَقِرَاءَةُ الْفَاتِحَةِ',
    titleEn: 'Folding Hands & Reciting Al-Fatihah',
    subtitleAr: 'الْقِيَامُ مَعَ تِلَاوَةِ أُمِّ الْقُرْآنِ',
    subtitleEn: 'Standing with Recitation of the Mother of the Book',
    instructionAr: 'أَضَعُ كَفَّ يَدِي الْيُمْنَى فَوْقَ الْيُسْرَى عَلَى صَدْرِي، وَأَسْتَعِيذُ بِاللَّهِ، ثُمَّ أَقْرَأُ سُورَةَ الْفَاتِحَةِ بِتَرْتِيلٍ وَطُمَأْنِينَةٍ مَعَ سُورَةٍ قَصِيرَةٍ.',
    instructionEn: 'Place your right hand over your left hand upon your chest, seek refuge in Allah, and recite Surah Al-Fatihah followed by a short surah.',
    dhikrLabelAr: 'تِلَاوَةُ الْفَاتِحَةِ الْوَاجِبَةِ',
    dhikrLabelEn: 'Reciting Surah Al-Fatihah',
    dhikrAr: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ • الرَّحْمَنِ الرَّحِيمِ • مَالِكِ يَوْمِ الدِّينِ • إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ • اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ • صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    dhikrEn: 'In the name of Allah, Most Gracious, Most Merciful. Praise be to Allah, Lord of the worlds...',
    repsAr: 'فِي كُلِّ رَكْعَةٍ',
    repsEn: 'Every Rak’ah',
    reflectionAr: 'الفاتحة هي أعظم سورة نناجي بها ربنا ونسأله الهداية إلى الصراط المستقيم.',
    reflectionEn: 'Al-Fatihah is our direct heartfelt conversation with Allah asking for His guidance.',
  },
  {
    step: 3,
    titleAr: 'الرُّكُوعُ وَتَعْظِيمُ الرَّبِّ سُبْحَانَهُ',
    titleEn: 'Bowing (Rukoo) & Glorification',
    subtitleAr: 'الانْحِنَاءُ تَعْظِيمًا لِلَّهِ الْعَظِيمِ',
    subtitleEn: 'Bowing with flat back in reverence to Allah',
    instructionAr: 'أُكَبِّرُ وَأَرْكَعُ حَانِيًا ظَهْرِي مُسْتَوِيًا، وَأَضَعُ كَفَّيَّ عَلَى رُكْبَتَيَّ كَالْقَابِضِ عَلَيْهِمَا بِهُدُوءٍ، وَأُعَظِّمُ رَبِّي ثَلَاثَ مَرَّاتٍ.',
    instructionEn: 'Say Allahu Akbar and bow with a flat, level back, resting your palms on your knees calmly, glorifying Allah 3 times.',
    dhikrLabelAr: 'قُلْ فِي رُكُوعِكَ',
    dhikrLabelEn: 'Say during bowing',
    dhikrAr: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    dhikrEn: 'Subhana Rabbiyal Azeem (Glory be to my Lord the Almighty)',
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
    reflectionAr: 'نحني ظهورنا تواضعاً لله وحده الذي خلقنا ورزقنا كل الخير.',
    reflectionEn: 'We bow in humility to Allah alone, our Creator and Provider of all goodness.',
  },
  {
    step: 4,
    titleAr: 'الرَّفْعُ مِنَ الرُّكُوعِ وَالاعْتِدَالُ',
    titleEn: 'Rising from Bowing & Standing Straight',
    subtitleAr: 'حَمْدُ اللَّهِ وَالشُّكْرُ عَلَى نِعَمِهِ',
    subtitleEn: 'Praising Allah and giving thanks',
    instructionAr: 'أَرْفَعُ رَأْسِي وَظَهْرِي قَائِلًا: «سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ»، ثُمَّ أَقِفُ مُعْتَدِلًا مُطْمَئِنًّا وَأَحْمَدُ رَبِّي:',
    instructionEn: 'Rise straight saying "Sami’ Allahu liman hamidah", standing completely still and praising Allah.',
    dhikrLabelAr: 'قُلْ عِنْدَ الاعْتِدَالِ',
    dhikrLabelEn: 'Say when standing upright',
    dhikrAr: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا وَلَكَ الْحَمْدُ',
    dhikrEn: 'Sami’ Allahu liman hamidah • Rabbana wa lakal hamd',
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
    reflectionAr: 'الله يسمع دعاء من يحمده، فالحمد لله دائماً وأبداً ملء السماوات والأرض.',
    reflectionEn: 'Allah hears whoever praises Him; praise belongs to Him filling heavens and earth.',
  },
  {
    step: 5,
    titleAr: 'السُّجُودُ الْأَوَّلُ عَلَى ٧ أَعْضَاءٍ',
    titleEn: 'First Sujood (Prostration) on 7 Limbs',
    subtitleAr: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ',
    subtitleEn: 'Nearest a servant is to their Lord',
    instructionAr: 'أُكَبِّرُ وَأَسْجُدُ عَلَى الْأَرْضِ مُسْتَقِرًّا عَلَى أَعْضَائِي السَّبْعَةِ: (الْجَبْهَةُ مَعَ الْأَنْفِ، وَالْكَفَّانِ، وَالرُّكْبَتَانِ، وَأَطْرَافُ الْقَدَمَيْنِ)، وَأُسَبِّحُ رَبِّي ثَلَاثًا.',
    instructionEn: 'Say Allahu Akbar and prostrate placing all 7 limbs firmly on the ground: forehead with nose, two palms, two knees, and toes, praising Allah 3 times.',
    dhikrLabelAr: 'قُلْ فِي سُجُودِكَ',
    dhikrLabelEn: 'Say in Sujood',
    dhikrAr: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    dhikrEn: 'Subhana Rabbiyal A’la (Glory be to my Lord the Most High)',
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
    reflectionAr: 'السجود موضع استجابة الدعاء، اطلب من الله ما تحب في سجودك برفق.',
    reflectionEn: 'Sujood is the most blessed place for answered prayers; ask Allah for goodness.',
  },
  {
    step: 6,
    titleAr: 'الْجُلُوسُ بَيْنَ السَّجْدَتَيْنِ',
    titleEn: 'Sitting Between the Two Prostrations',
    subtitleAr: 'الدُّعَاءُ بِالْمَغْفِرَةِ وَالرَّحْمَةِ وَالرِّزْقِ',
    subtitleEn: 'Praying for forgiveness and divine mercy',
    instructionAr: 'أَرْفَعُ رَأْسِي مُكَبِّرًا وَأَجْلِسُ بَيْنَ السَّجْدَتَيْنِ مُطْمَئِنًّا عَلَى رِجْلِي الْيُسْرَى مَعَ نَصْبِ الْيُمْنَى، وَأَسْأَلُ اللَّهَ الْمَغْفِرَةَ.',
    instructionEn: 'Rise saying Allahu Akbar, sit calmly between the two prostrations resting hands on thighs, and ask Allah for forgiveness.',
    dhikrLabelAr: 'قُلْ بَيْنَ السَّجْدَتَيْنِ',
    dhikrLabelEn: 'Say between prostrations',
    dhikrAr: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    dhikrEn: 'Rabbigh-fir lee, Rabbigh-fir lee (My Lord forgive me)',
    repsAr: 'مَرَّتَيْنِ',
    repsEn: '2 Times',
    reflectionAr: 'جلسة هدوء وطمأنينة نستغفر فيها الله الرحيم ونطلب عفوه ورضوانه.',
    reflectionEn: 'A tranquil sitting where we seek Allah’s boundless mercy and forgiveness.',
  },
  {
    step: 7,
    titleAr: 'السُّجُودُ الثَّانِي وَإِتْمَامُ الرَّكْعَةِ',
    titleEn: 'Second Sujood & Completing the Rak’ah',
    subtitleAr: 'السَّجْدَةُ الثَّانِيَةُ بِخُشُوعٍ وَسَكِينَةٍ',
    subtitleEn: 'Second prostration completing the unit',
    instructionAr: 'أُكَبِّرُ وَأَسْجُدُ السَّجْدَةَ الثَّانِيَةَ تَمَامًا مِثْلَ السَّجْدَةِ الْأُولَى عَلَى الْأَعْضَاءِ السَّبْعَةِ، وَأُسَبِّحُ اللَّهَ ثَلَاثًا، وَبِذَلِكَ تَتِمُّ الرَّكْعَةُ الْمُبَارَكَةُ!',
    instructionEn: 'Say Allahu Akbar and prostrate a second time just like the first on all 7 contact points, praising Allah 3 times to complete the Rak’ah.',
    dhikrLabelAr: 'قُلْ فِي السَّجْدَةِ الثَّانِيَةِ',
    dhikrLabelEn: 'Say in second Sujood',
    dhikrAr: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    dhikrEn: 'Subhana Rabbiyal A’la (Glory be to my Lord the Most High)',
    repsAr: '٣ مَرَّاتٍ',
    repsEn: '3 Times',
    reflectionAr: 'تمت ركعتك بحمد الله! في الصلوات المتعددة نقوم للركعة التالية بنفس الخطوات الجميلة.',
    reflectionEn: 'Your Rak’ah is complete! In multiple rak’ahs we rise and repeat the same steps.',
  },
  {
    step: 8,
    titleAr: 'التَّشَهُّدُ الْأَوَّلُ وَرَفْعُ السَّبَّابَةِ',
    titleEn: 'At-Tashahhud (Praising Allah & Shahada)',
    subtitleAr: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَاةُ عَلَى النَّبِيِّ ﷺ',
    subtitleEn: 'Greetings of peace and testimony of faith',
    instructionAr: 'أَجْلِسُ فِي نِهَايَةِ الرَّكْعَةِ الثَّانِيَةِ أَوْ الْأَخِيرَةِ، وَأَضَعُ كَفَّيَّ عَلَى فَخِذَيَّ، وَأَضُمُّ أَصَابِعَ يَدِي الْيُمْنَى مَعَ رَفْعِ السَّبَّابَةِ مُشِيرًا إِلَى التَّوْحِيدِ.',
    instructionEn: 'Sit at the end of the second or final rak’ah with hands on thighs, lifting the right index finger in testimony of Allah’s oneness.',
    dhikrLabelAr: 'قِرَاءَةُ التَّشَهُّدِ الْمُبَارَكِ',
    dhikrLabelEn: 'Reciting At-Tashahhud',
    dhikrAr: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
    dhikrEn: 'All compliments, prayers, and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings...',
    repsAr: 'مَرَّةٌ وَاحِدَةٌ',
    repsEn: '1 Time',
    reflectionAr: 'نلقي السلام والمحبة على نبينا الحبيب محمد ﷺ وعلى عباد الله الصالحين في كل مكان.',
    reflectionEn: 'We send peace upon Prophet Muhammad ﷺ and all righteous servants of Allah.',
  },
  {
    step: 9,
    titleAr: 'الصَّلَاةُ الْإِبْرَاهِيمِيَّةُ فِي الْخِتَامِ',
    titleEn: 'As-Salat Al-Ibrahimiyyah',
    subtitleAr: 'الصَّلَاةُ وَالْبَرَكَةُ عَلَى النَّبِيِّ وَآلِهِ',
    subtitleEn: 'Blessings upon Prophet Muhammad & Prophet Ibrahim',
    instructionAr: 'فِي الْجَلْسَةِ الْأَخِيرَةِ مِنَ الصَّلَاةِ، أَتْبَعُ التَّشَهُّدَ بِالصَّلَاةِ الْإِبْرَاهِيمِيَّةِ الْمُبَارَكَةِ كَمَا عَلَّمَنَا رَسُولُ اللَّهِ ﷺ.',
    instructionEn: 'In the final sitting of prayer, follow the Tashahhud with the blessed Ibrahimic prayer sending blessings upon our Prophet.',
    dhikrLabelAr: 'الصَّلَاةُ الْإِبْرَاهِيمِيَّةُ',
    dhikrLabelEn: 'The Ibrahimic Prayer',
    dhikrAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.',
    dhikrEn: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim...',
    repsAr: 'فِي التَّشَهُّدِ الْأَخِيرِ',
    repsEn: 'In Final Tashahhud',
    reflectionAr: 'من صلى على النبي ﷺ صلاةً واحدةً صلى الله عليه بها عشراً ورُفعت درجاته.',
    reflectionEn: 'Whoever sends one prayer upon the Prophet, Allah sends ten blessings upon them.',
  },
  {
    step: 10,
    titleAr: 'التَّسْلِيمُ وَخِتَامُ الصَّلَاةِ بِسَلَامٍ',
    titleEn: 'Tasleem (Concluding Prayer in Peace)',
    subtitleAr: 'الالْتِفَاتُ يَمِينًا وَيَسَارًا بِالسَّلَامِ',
    subtitleEn: 'Turning right and left with greetings of peace',
    instructionAr: 'أَلْتَفِتُ بِرَأْسِي عَنْ يَمِينِي قَائِلًا: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»، ثُمَّ عَنْ يَسَارِي قَائِلًا: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»، وَبِذَلِكَ تَكْتَمِلُ صَلَاتِي بِنُورٍ وَبَرَكَةٍ!',
    instructionEn: 'Turn your head to the right saying "As-Salamu Alaykum wa Rahmatullah", then to the left saying the same. Your prayer is now complete with light and peace!',
    dhikrLabelAr: 'قُلْ عِنْدَ التَّسْلِيمِ',
    dhikrLabelEn: 'Say in Tasleem',
    dhikrAr: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    dhikrEn: 'As-Salamu Alaykum wa Rahmatullah (May peace and Allah’s mercy be upon you)',
    repsAr: 'يَمِينًا وَيَسَارًا',
    repsEn: 'Right & Left',
    reflectionAr: 'نختم صلاتنا بنشر السلام والرحمة للجميع، صلاتك مقبولة بإذن الله يا بطل!',
    reflectionEn: 'We end our prayer spreading peace to all; may Allah accept your prayer!',
  },
];

const PRAYERS_LIST = [
  { id: 'fajr', nameAr: 'صَلَاةُ الْفَجْرِ', nameEn: 'Fajr', rakahs: 2 },
  { id: 'dhuhr', nameAr: 'صَلَاةُ الظُّهْرِ', nameEn: 'Dhuhr', rakahs: 4 },
  { id: 'asr', nameAr: 'صَلَاةُ الْعَصْرِ', nameEn: 'Asr', rakahs: 4 },
  { id: 'maghrib', nameAr: 'صَلَاةُ الْمَغْرِبِ', nameEn: 'Maghrib', rakahs: 3 },
  { id: 'isha', nameAr: 'صَلَاةُ الْعِشَاءِ', nameEn: 'Isha', rakahs: 4 },
];

export default function SalahScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ step?: string; prayer?: string }>();
  const { language, addStars, addGems } = useAppStore();
  const isAr = language === 'ar';
  const isRtl = isRTL(language);

  const initialStepParam = params.step ? parseInt(params.step, 10) - 1 : 0;
  const safeInitialStep = Math.max(0, Math.min(9, isNaN(initialStepParam) ? 0 : initialStepParam));

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(safeInitialStep);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>(params.prayer || 'dhuhr');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);



  const stepData = SALAH_10_STEPS[currentStepIdx] || SALAH_10_STEPS[0];
  const selectedPrayer = PRAYERS_LIST.find((p) => p.id === selectedPrayerId) || PRAYERS_LIST[1];

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${stepData.dhikrAr}. ${stepData.titleAr}. ${stepData.instructionAr}`;

    setIsPlayingAudio(true);
    audioService.playDua(textToSpeak, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
  };

  const handleNext = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);

    if (currentStepIdx < SALAH_10_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      audioService.playCelebrationFanfare();
      addStars(10);
      addGems(3);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        router.back();
      }, 2500);
    }
  };

  const handlePrev = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={[styles.topBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
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

          <View style={styles.topBarTitleCol}>
            <Text style={styles.topBarTitle}>
              {isAr ? 'مُحَاكِي تَعَلُّمِ الصَّلَاةِ' : 'Prayer Learning Simulator'}
            </Text>
            <Text style={styles.topBarSub}>
              {isAr ? `${selectedPrayer.nameAr} (${selectedPrayer.rakahs} رَكَعَاتٍ)` : `${selectedPrayer.nameEn} (${selectedPrayer.rakahs} Rak’ahs)`}
            </Text>
          </View>

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

        {/* PRAYER SELECTOR CHIPS */}
        <View style={styles.prayerChipsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.prayerChipsScroll, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          >
            {PRAYERS_LIST.map((p) => {
              const isSelected = p.id === selectedPrayerId;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.prayerChip, isSelected && styles.prayerChipActive]}
                  onPress={() => setSelectedPrayerId(p.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.prayerChipText, isSelected && styles.prayerChipTextActive]}>
                    {isAr ? p.nameAr : p.nameEn} ({isAr ? (p.rakahs === 2 ? '٢' : p.rakahs === 3 ? '٣' : '٤') : p.rakahs})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 10-STEP PROGRESS BAR WITH INTERACTIVE DOTS */}
        <View style={[styles.progressDotsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
          {SALAH_10_STEPS.map((_, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  audioService.stopDua();
                  setIsPlayingAudio(false);
                  setCurrentStepIdx(idx);
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

        {/* MAIN SCROLLABLE CONTENT */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO CARD: 3D CHARACTER IMAGE ILLUSTRATION */}
          <View style={styles.heroSceneCard}>
            <LinearGradient
              colors={['#E0F2FE', '#BAE6FD', '#F0F9FF']}
              style={styles.heroGradient}
            >
              {/* Soft sky clouds decoration */}
              <View style={styles.cloudLeft} />
              <View style={styles.cloudRight} />
              <View style={styles.sparkleStar}>
                <Ionicons name="sparkles" size={20} color="#F59E0B" />
              </View>

              {/* 3D Character Illustration */}
              <View style={styles.imageContainer}>
                <Image
                  source={getStepMedia('prayer', stepData.step)}
                  style={styles.stepImage}
                  resizeMode="contain"
                />
              </View>

              {/* Repetitions Pill Badge */}
              <View style={[styles.repsPill, { [isRtl ? 'right' : 'left']: 14 }]}>
                <Ionicons name="repeat" size={13} color="#FFFFFF" />
                <Text style={styles.repsPillText}>
                  {isAr ? stepData.repsAr : stepData.repsEn}
                </Text>
              </View>

              {/* Step Counter Pill Badge */}
              <View style={[styles.stepCountPill, { [isRtl ? 'left' : 'right']: 14 }]}>
                <Text style={styles.stepCountPillText}>
                  {isAr
                    ? `الْخُطْوَةُ ${stepData.step} مِنْ ١٠`
                    : `Step ${stepData.step} of 10`}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* STEP HEADER TITLES */}
          <View style={styles.titlesWrap}>
            <Text style={styles.stepMainTitle}>
              {isAr ? stepData.titleAr : stepData.titleEn}
            </Text>
            <Text style={styles.stepSubtitle}>
              {isAr ? stepData.subtitleAr : stepData.subtitleEn}
            </Text>
          </View>

          {/* INSTRUCTION CARD */}
          <View style={styles.instructionCard}>
            <View style={[styles.cardHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.iconCircleBlue}>
                <Ionicons name="body-outline" size={18} color="#0284C7" />
              </View>
              <Text style={[styles.cardHeaderTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr ? 'كَيْفَ تُؤَدِّي هَذِهِ الْخُطْوَةَ؟' : 'How to Perform This Step'}
              </Text>
            </View>
            <Text style={[styles.instructionText, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isAr ? stepData.instructionAr : stepData.instructionEn}
            </Text>
          </View>

          {/* DHIKR RECITATION CARD */}
          <View style={styles.dhikrCard}>
            <LinearGradient
              colors={['#047857', '#065F46']}
              style={styles.dhikrGradient}
            >
              <View style={[styles.dhikrHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.dhikrBadge}>
                  <Ionicons name="musical-notes" size={14} color="#FDE047" />
                  <Text style={styles.dhikrBadgeText}>
                    {isAr ? stepData.dhikrLabelAr : stepData.dhikrLabelEn}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.audioPlayBtn, isPlayingAudio && styles.audioPlayBtnActive]}
                  onPress={handlePlayAudio}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isPlayingAudio ? 'stop-circle' : 'play-circle'}
                    size={26}
                    color="#FFFFFF"
                  />
                  <Text style={styles.audioPlayBtnText}>
                    {isPlayingAudio ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استمع' : 'Listen')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.dhikrMainText}>
                {stepData.dhikrAr}
              </Text>

              {language !== 'ar' && (
                <Text style={styles.dhikrTransText}>
                  {stepData.dhikrEn}
                </Text>
              )}
            </LinearGradient>
          </View>

          {/* SPIRITUAL REFLECTION */}
          <View style={styles.reflectionCard}>
            <View style={[styles.reflectionRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Ionicons name="sparkles" size={18} color="#D97706" />
              <Text style={[styles.reflectionText, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isAr ? stepData.reflectionAr : stepData.reflectionEn}
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* BOTTOM NAVIGATION FOOTER */}
        <View style={styles.bottomBar}>
          <View style={[styles.bottomBarInner, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {/* PREV BUTTON */}
            <TouchableOpacity
              style={styles.prevBtn}
              onPress={handlePrev}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isRtl ? 'arrow-forward' : 'arrow-back'}
                size={20}
                color="#64748B"
              />
              <Text style={styles.prevBtnText}>
                {currentStepIdx === 0 ? (isAr ? 'رجوع' : 'Back') : (isAr ? 'السابق' : 'Previous')}
              </Text>
            </TouchableOpacity>

            {/* NEXT / COMPLETED BUTTON */}
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNext}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#0284C7', '#0369A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.nextBtnGradient, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                <Text style={styles.nextBtnText}>
                  {currentStepIdx === SALAH_10_STEPS.length - 1
                    ? (isAr ? 'أَتْمَمْتُ الصَّلَاةَ! 🌟' : 'I Completed Prayer! 🌟')
                    : (isAr ? 'أَنَا فَعَلْتُهَا! ⭐' : 'I Did It! ⭐')}
                </Text>
                <Ionicons
                  name={isRtl ? 'arrow-back' : 'arrow-forward'}
                  size={20}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* STAR CELEBRATION MODAL */}
        <StarRewardCelebration
          visible={showCelebration}
          starsEarned={10}
          gemsEarned={3}
          title={isAr ? 'مَا شَاءَ اللَّهُ! بَارَكَ اللَّهُ فِيكَ' : 'Masha’Allah! Wonderful Prayer!'}
          subtitle={isAr ? 'أتممت خطوات الصلاة المباركة بنجاح!' : 'You mastered all 10 steps of prayer!'}
          onDismiss={() => setShowCelebration(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    height: 60,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  circleIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIconButtonActive: {
    backgroundColor: '#0284C7',
  },
  topBarTitleCol: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  topBarSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 2,
  },
  prayerChipsWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
  },
  prayerChipsScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  prayerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prayerChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  prayerChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  prayerChipTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  progressDotsRow: {
    height: 28,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dotTouchable: {
    padding: 3,
  },
  baseDot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    width: 7,
  },
  dotDone: {
    backgroundColor: '#10B981',
    width: 9,
  },
  dotCurrentPill: {
    backgroundColor: '#0284C7',
    width: 24,
  },
  dotNext: {
    backgroundColor: '#E2E8F0',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  heroSceneCard: {
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    ...SHADOWS.medium,
    marginBottom: SPACING.md,
  },
  heroGradient: {
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cloudLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  cloudRight: {
    position: 'absolute',
    top: 36,
    right: 25,
    width: 60,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  sparkleStar: {
    position: 'absolute',
    top: 22,
    right: 100,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  stepImage: {
    width: '90%',
    height: '92%',
  },
  repsPill: {
    position: 'absolute',
    top: 14,
    backgroundColor: 'rgba(2, 132, 199, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.soft,
  },
  repsPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepCountPill: {
    position: 'absolute',
    top: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    ...SHADOWS.soft,
  },
  stepCountPillText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '800',
  },
  titlesWrap: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  stepMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  cardHeaderRow: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconCircleBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 25,
    color: '#334155',
    fontWeight: '500',
  },
  dhikrCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  dhikrGradient: {
    padding: SPACING.md,
  },
  dhikrHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dhikrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  dhikrBadgeText: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '800',
  },
  audioPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  audioPlayBtnActive: {
    backgroundColor: '#EF4444',
  },
  audioPlayBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  dhikrMainText: {
    fontSize: 20,
    lineHeight: 36,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  dhikrTransText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#D1FAE5',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reflectionCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reflectionRow: {
    alignItems: 'center',
    gap: 10,
  },
  reflectionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 21,
    color: '#92400E',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    ...SHADOWS.strong,
  },
  bottomBarInner: {
    alignItems: 'center',
    gap: 12,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: RADIUS.xl,
    backgroundColor: '#F1F5F9',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  nextBtn: {
    flex: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  nextBtnGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
