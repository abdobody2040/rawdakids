import { AgeBand } from '@/store/useAppStore';
import { Language } from '@/constants/i18n';

export interface AgeToneProfile {
  ageBand: AgeBand;
  badgeTitleAr: string;
  badgeTitleEn: string;
  badgeDescAr: string;
  badgeDescEn: string;
  toneSummaryAr: string;
  toneSummaryEn: string;
  mascotGreetingAr: string;
  mascotGreetingEn: string;
  homeMissionTitleAr: string;
  homeMissionTitleEn: string;
  homeMissionDescAr: string;
  homeMissionDescEn: string;
  tafsirTakeawayTitleAr: string;
  tafsirTakeawayTitleEn: string;
  tafsirTakeawayDescAr: string;
  tafsirTakeawayDescEn: string;
  recommendedRepeatTimes: number;
}

export const AGE_TONE_CONFIGS: Record<AgeBand, AgeToneProfile> = {
  '4-6': {
    ageBand: '4-6',
    badgeTitleAr: 'المستكشف الصغير (٤ - ٦ سنوات)',
    badgeTitleEn: 'Little Explorer (4 - 6 yrs)',
    badgeDescAr: 'أزرار كبيرة، تركيز على الاستماع الصوتي والترديد المرح',
    badgeDescEn: 'Large buttons, voice guidance & joyful repeat',
    toneSummaryAr: 'نبرة مبسطة ومرحة تركز على الاستماع الصوتي وحب الله ورعايته 🎈',
    toneSummaryEn: 'Playful, gentle tone focusing on audio listening and divine love 🎈',
    mascotGreetingAr: 'أهلاً يا صديقي الصغير والجميل! 🎈 هل نستمع اليوم لصوت القرآن العذب معاً؟ 🌸',
    mascotGreetingEn: 'Welcome little explorer! 🎈 Let us listen to the sweet Quran together today! 🌸',
    homeMissionTitleAr: 'مهمة الاستماع الصغير 🎧',
    homeMissionTitleEn: "Little Listener's Mission 🎧",
    homeMissionDescAr: 'استمع إلى آيات اليوم وردد بصوتك الحلو مع الشيخ! 🌸',
    homeMissionDescEn: 'Listen to today’s verses and repeat with your sweet voice! 🌸',
    tafsirTakeawayTitleAr: 'درس لقلبك الصغير 💕',
    tafsirTakeawayTitleEn: 'Heart Lesson for You 💕',
    tafsirTakeawayDescAr: 'الله تعالى يحبنا، يرعانا، ويسعدنا عندما نقول الخير ونفعل الجميل! ✨',
    tafsirTakeawayDescEn: 'Allah loves us, cares for us, and is pleased when we do good! ✨',
    recommendedRepeatTimes: 3,
  },
  '7-9': {
    ageBand: '7-9',
    badgeTitleAr: 'المتعلم الناشئ (٧ - ٩ سنوات)',
    badgeTitleEn: 'Young Learner (7 - 9 yrs)',
    badgeDescAr: 'مسابقات تفاعلية، ألعاب حفظ، وجمع أوسمة النجوم',
    badgeDescEn: 'Interactive quizzes, memorization quests & star rewards',
    toneSummaryAr: 'نبرة حماسية وبطولية مليئة بالمغامرة والتحديات وجمع الجواهر 🚀',
    toneSummaryEn: 'Heroic, gamified adventure tone with quest badges and gem rewards 🚀',
    mascotGreetingAr: 'مرحباً يا بطل المغامرات! 🚀 جاهز لتحدي اليوم وجمع النجوم والأوسمة؟ ⭐',
    mascotGreetingEn: 'Welcome champion! 🚀 Ready for today’s quest to collect stars and badges? ⭐',
    homeMissionTitleAr: 'تحدي بطل القرآن 🌟',
    homeMissionTitleEn: "Quran Champion Quest 🌟",
    homeMissionDescAr: 'احفظ ورتل ٣ آيات جديدة وافتح ملصقاً جديداً في خزينتك! ⭐',
    homeMissionDescEn: 'Recite and learn 3 new ayahs to unlock a new treasure sticker! ⭐',
    tafsirTakeawayTitleAr: 'خطوة بطل اليوم 🌼',
    tafsirTakeawayTitleEn: 'Champion Action Step 🌼',
    tafsirTakeawayDescAr: 'اجعل هذه الآية سلوكاً حقيقياً اليوم: ابتسم، ساعد أهلك، وانشر السلام! 🌟',
    tafsirTakeawayDescEn: 'Live this verse today: smile, help your parents, and spread peace! 🌟',
    recommendedRepeatTimes: 2,
  },
  '10-13': {
    ageBand: '10-13',
    badgeTitleAr: 'العقول النامية (١٠ - ١٣ سنة)',
    badgeTitleEn: 'Growing Minds (10 - 13 yrs)',
    badgeDescAr: 'تدبّر عميق، استيعاب المفردات القرآنية وتحديات إتقان الحفظ',
    badgeDescEn: 'Deep reflection, vocabulary comprehension & mastery challenges',
    toneSummaryAr: 'نبرة ناضجة وملهمة تركز على التدبّر وإخلاص النية والقيم الحياتية 💡',
    toneSummaryEn: 'Reflective, mature mentorship focusing on Tadabbur, values and sincere intention 💡',
    mascotGreetingAr: 'أهلاً بك يا باحث المعرفة والقيم! 📖 تدبّر آيات الله وتأمّل حكمتها العميقة اليوم 💡',
    mascotGreetingEn: 'Welcome seeker of wisdom! 📖 Contemplate the divine verses and their deep wisdom today 💡',
    homeMissionTitleAr: 'مهمة التدبّر والإتقان 📜',
    homeMissionTitleEn: 'Tadabbur & Mastery Quest 📜',
    homeMissionDescAr: 'تدبّر معاني السورة وأتقن التلاوة مع التجويد واستشعر أثرها في قلبك 🌿',
    homeMissionDescEn: 'Contemplate the Surah’s meanings, refine recitation, and feel its impact 🌿',
    tafsirTakeawayTitleAr: 'تدبّر وبصيرة 🌿',
    tafsirTakeawayTitleEn: 'Contemplation & Insight 🌿',
    tafsirTakeawayDescAr: 'استشعر مراقبة الله في كل عمل، واجعل نيتك خالصة لوجهه الكريم في السر والعلن 💡',
    tafsirTakeawayDescEn: 'Be mindful of Allah in every deed, keeping sincerity in your heart in private and public 💡',
    recommendedRepeatTimes: 1,
  },
};

export function getAgeTone(ageBand: AgeBand = '7-9'): AgeToneProfile {
  return AGE_TONE_CONFIGS[ageBand] || AGE_TONE_CONFIGS['7-9'];
}

export function getLocalizedAgeTone(ageBand: AgeBand = '7-9', lang: Language = 'ar') {
  const cfg = getAgeTone(ageBand);
  const isAr = lang === 'ar';
  return {
    badgeTitle: isAr ? cfg.badgeTitleAr : cfg.badgeTitleEn,
    badgeDesc: isAr ? cfg.badgeDescAr : cfg.badgeDescEn,
    toneSummary: isAr ? cfg.toneSummaryAr : cfg.toneSummaryEn,
    mascotGreeting: isAr ? cfg.mascotGreetingAr : cfg.mascotGreetingEn,
    homeMissionTitle: isAr ? cfg.homeMissionTitleAr : cfg.homeMissionTitleEn,
    homeMissionDesc: isAr ? cfg.homeMissionDescAr : cfg.homeMissionDescEn,
    tafsirTakeawayTitle: isAr ? cfg.tafsirTakeawayTitleAr : cfg.tafsirTakeawayTitleEn,
    tafsirTakeawayDesc: isAr ? cfg.tafsirTakeawayDescAr : cfg.tafsirTakeawayDescEn,
    recommendedRepeatTimes: cfg.recommendedRepeatTimes,
  };
}
