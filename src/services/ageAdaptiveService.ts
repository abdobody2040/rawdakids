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
    tafsirTakeawayTitleEn: "Champion's Step 🌼",
    tafsirTakeawayDescAr: 'طبق خلقاً قرآنيّاً جميلاً اليوم وازرع بسمة في قلوب من حولك! 🌟',
    tafsirTakeawayDescEn: 'Practice a Quranic manner today and bring smiles to people around you! 🌟',
    recommendedRepeatTimes: 2,
  },
  '10-13': {
    ageBand: '10-13',
    badgeTitleAr: 'باحث المعرفة (١٠ - ١٣ سنة)',
    badgeTitleEn: 'Seeker of Wisdom (10 - 13 yrs)',
    badgeDescAr: 'تفسير وتدبر عميق، سياق نزول الآيات، ومفاهيم الإيمان والعمل',
    badgeDescEn: 'Deep reflection, context of revelation & faith insights',
    toneSummaryAr: 'نبرة عميقة وملهمة تركز على الفهم والتأمل والمسؤولية والعمل بالقرآن 🧭',
    toneSummaryEn: 'Thoughtful, inspiring tone focused on understanding, purpose & action 🧭',
    mascotGreetingAr: 'أهلاً بك يا باحث المعرفة! 🧭 القرآن يفتح أمامك آفاق الحكمة والتفكر 🌿',
    mascotGreetingEn: 'Welcome seeker of wisdom! 🧭 The Quran opens doors of reflection and purpose 🌿',
    homeMissionTitleAr: 'محطة التدبر اليومي 💡',
    homeMissionTitleEn: 'Daily Reflection Station 💡',
    homeMissionDescAr: 'تدبّر معاني سورة اليوم واكتشف أسرار كلماتها المباركة! 🌿',
    homeMissionDescEn: 'Reflect on today’s surah meanings and discover divine insights! 🌿',
    tafsirTakeawayTitleAr: 'تدبّر وبصيرة 🌿',
    tafsirTakeawayTitleEn: 'Contemplation & Insight 🌿',
    tafsirTakeawayDescAr: 'استشعر مراقبة الله في كل عمل، واجعل نيتك خالصة لوجهه الكريم في السر والعلن 💡',
    tafsirTakeawayDescEn: 'Be mindful of Allah in every deed, keeping sincerity in your heart in private and public 💡',
    recommendedRepeatTimes: 1,
  },
};

const LOCALIZED_AGE_STRINGS: Record<AgeBand, Record<Language, { badgeTitle: string; homeMissionDesc: string }>> = {
  '4-6': {
    ar: { badgeTitle: 'المستكشف الصغير (٤ - ٦ سنوات)', homeMissionDesc: 'استمع إلى آيات اليوم وردد بصوتك الحلو مع الشيخ! 🌸' },
    en: { badgeTitle: 'Little Explorer (4 - 6 yrs)', homeMissionDesc: 'Listen to today’s verses and repeat with your sweet voice! 🌸' },
    bn: { badgeTitle: 'ছোট্ট অভিযাত্রী (৪ - ৬ বছর)', homeMissionDesc: 'আজকের আয়াতগুলো শুনুন এবং আপনার মিষ্টি কণ্ঠে তিলাওয়াত করুন! 🌸' },
    ru: { badgeTitle: 'Юный исследователь (4 - 6 лет)', homeMissionDesc: 'Слушай сегодняшние аяты и повторяй своим приятным голоском! 🌸' },
    ur: { badgeTitle: 'ننھا متلاشی (۴ - ۶ سال)', homeMissionDesc: 'آج کی آیات سنیں اور اپنی پیاری آواز میں دہرائیں! 🌸' },
    id: { badgeTitle: 'Penjelajah Cilik (4 - 6 thn)', homeMissionDesc: 'Dengarkan ayat hari ini dan ulangi dengan suaramu yang merdu! 🌸' },
    tr: { badgeTitle: 'Küçük Kaşif (4 - 6 yaş)', homeMissionDesc: 'Günün ayetlerini dinle ve tatlı sesinle tekrar et! 🌸' },
    fr: { badgeTitle: 'Petit Explorateur (4 - 6 ans)', homeMissionDesc: 'Écoute les versets d’aujourd’hui et répète avec ta douce voix ! 🌸' },
    de: { badgeTitle: 'Kleiner Entdecker (4 - 6 J.)', homeMissionDesc: 'Höre die heutigen Verse und wiederhole sie mit deiner süßen Stimme! 🌸' },
    es: { badgeTitle: 'Pequeño Explorador (4 - 6 años)', homeMissionDesc: '¡Escucha los versos de hoy y repítelos con tu dulce voz! 🌸' },
  },
  '7-9': {
    ar: { badgeTitle: 'المتعلم الناشئ (٧ - ٩ سنوات)', homeMissionDesc: 'احفظ ورتل ٣ آيات جديدة وافتح ملصقاً جديداً في خزينتك! ⭐' },
    en: { badgeTitle: 'Young Learner (7 - 9 yrs)', homeMissionDesc: 'Recite and learn 3 new ayahs to unlock a new treasure sticker! ⭐' },
    bn: { badgeTitle: 'উদীয়মান শিক্ষার্থী (৭ - ৯ বছর)', homeMissionDesc: '৩টি নতুন আয়াত শিখে নতুন গুপ্তধন স্টিকার আনলক করুন! ⭐' },
    ru: { badgeTitle: 'Юный ученик (7 - 9 лет)', homeMissionDesc: 'Выучи 3 новых аята и разблокируй новую наклейку-сокровище! ⭐' },
    ur: { badgeTitle: 'ہونہار طالب علم (۷ - ۹ سال)', homeMissionDesc: '۳ نئی آیات پڑھ کر یاد کریں اور نیا خزانہ اسٹیکر حاصل کریں! ⭐' },
    id: { badgeTitle: 'Pelajar Muda (7 - 9 thn)', homeMissionDesc: 'Baca dan pelajari 3 ayat baru untuk membuka stiker harta karun! ⭐' },
    tr: { badgeTitle: 'Genç Öğrenci (7 - 9 yaş)', homeMissionDesc: '3 yeni ayet öğrenerek hazine sandığından yeni bir çıkartma kazan! ⭐' },
    fr: { badgeTitle: 'Jeune Apprenant (7 - 9 ans)', homeMissionDesc: 'Récite et apprends 3 nouveaux versets pour débloquer un sticker trésor ! ⭐' },
    de: { badgeTitle: 'Junger Lernender (7 - 9 J.)', homeMissionDesc: 'Lerne 3 neue Verse und schalte einen neuen Schatz-Sticker frei! ⭐' },
    es: { badgeTitle: 'Joven Aprendiz (7 - 9 años)', homeMissionDesc: '¡Recita y aprende 3 nuevos versos para desbloquear una pegatina tesoro! ⭐' },
  },
  '10-13': {
    ar: { badgeTitle: 'باحث المعرفة (١٠ - ١٣ سنة)', homeMissionDesc: 'تدبّر معاني سورة اليوم واكتشف أسرار كلماتها المباركة! 🌿' },
    en: { badgeTitle: 'Seeker of Wisdom (10 - 13 yrs)', homeMissionDesc: 'Reflect on today’s surah meanings and discover divine insights! 🌿' },
    bn: { badgeTitle: 'জ্ঞানের সাধক (১০ - ১৩ বছর)', homeMissionDesc: 'আজকের সূরার অর্থ নিয়ে গভীরভাবে ভাবুন এবং এর হিকমত আবিষ্কার করুন! 🌿' },
    ru: { badgeTitle: 'Искатель мудрости (10 - 13 лет)', homeMissionDesc: 'Размышляй над смыслом сегодняшней суры и открывай для себя мудрость! 🌿' },
    ur: { badgeTitle: 'علم و حکمت کے متلاشی (۱۰ - ۱۳ سال)', homeMissionDesc: 'آج کی سورت کے معانی پر غور کیجیے اور قرآنی حکمت جانیے! 🌿' },
    id: { badgeTitle: 'Pencari Hikmah (10 - 13 thn)', homeMissionDesc: 'Tadabburi makna surah hari ini dan temukan hikmah ilahi! 🌿' },
    tr: { badgeTitle: 'İlim ve Hikmet Yolcusu (10 - 13 yaş)', homeMissionDesc: 'Günün suresinin anlamını tefekkür et ve ilahi hikmetleri keşfet! 🌿' },
    fr: { badgeTitle: 'Chercheur de Sagesse (10 - 13 ans)', homeMissionDesc: 'Médite sur le sens de la sourate du jour et découvre la sagesse divine ! 🌿' },
    de: { badgeTitle: 'Sucher der Weisheit (10 - 13 J.)', homeMissionDesc: 'Reflektiere über die heutige Sure und entdecke göttliche Weisheit! 🌿' },
    es: { badgeTitle: 'Buscador de Sabiduría (10 - 13 años)', homeMissionDesc: '¡Medita en el significado de la sura de hoy y descubre la sabiduría divina! 🌿' },
  },
};

export function getAgeTone(ageBand: AgeBand = '7-9'): AgeToneProfile {
  return AGE_TONE_CONFIGS[ageBand] || AGE_TONE_CONFIGS['7-9'];
}

export function getLocalizedAgeTone(ageBand: AgeBand = '7-9', lang: Language = 'ar') {
  const cfg = getAgeTone(ageBand);
  const isAr = lang === 'ar';
  const custom = LOCALIZED_AGE_STRINGS[ageBand]?.[lang];

  return {
    badgeTitle: custom?.badgeTitle || (isAr ? cfg.badgeTitleAr : cfg.badgeTitleEn),
    badgeDesc: isAr ? cfg.badgeDescAr : cfg.badgeDescEn,
    toneSummary: isAr ? cfg.toneSummaryAr : cfg.toneSummaryEn,
    mascotGreeting: isAr ? cfg.mascotGreetingAr : cfg.mascotGreetingEn,
    homeMissionTitle: isAr ? cfg.homeMissionTitleAr : cfg.homeMissionTitleEn,
    homeMissionDesc: custom?.homeMissionDesc || (isAr ? cfg.homeMissionDescAr : cfg.homeMissionDescEn),
    tafsirTakeawayTitle: isAr ? cfg.tafsirTakeawayTitleAr : cfg.tafsirTakeawayTitleEn,
    tafsirTakeawayDesc: isAr ? cfg.tafsirTakeawayDescAr : cfg.tafsirTakeawayDescEn,
    recommendedRepeatTimes: cfg.recommendedRepeatTimes,
  };
}
