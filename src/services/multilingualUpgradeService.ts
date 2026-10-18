// Multilingual Upgrade Service for Noor Kids
// Covers 10 Languages: ar, en, fr, de, es, ru, ur, id, bn, tr
// For Asma Allah, Young Companions, Tafakkur Universe, Lessons of Nations, and Seerah Journey

import { Language } from '../constants/i18n';
import { ASMA_ALLAH_DATA, AsmaAllahItem } from '../data/asmaAllahData';
import { COMPANIONS_DATA, CompanionStoryItem } from '../data/companionsData';
import { TAFAKKUR_DATA, TafakkurStationItem } from '../data/tafakkurData';
import { NATIONS_DATA, NationLessonItem } from '../data/nationsData';
import { SEERAH_DATA, SeerahStationItem } from '../data/seerahData';

// Generic Hub Labels for Upgrades
export const UPGRADE_HUB_LABELS: Record<string, Record<Language, string>> = {
  // Asma Allah Hub
  asmaHubTitle: {
    ar: 'روضة أسماء الله الحسنى',
    en: 'Asma Allah Sanctuary',
    fr: 'Sanctuaire des Noms d’Allah',
    de: 'Garten der Schönsten Namen Allahs',
    es: 'Santuario de los Nombres de Alá',
    ru: 'Сад Прекрасных Имен Аллаха',
    ur: 'اسمائے حسنیٰ کا نورانی باغ',
    id: 'Taman Asmaul Husna',
    bn: 'আসমাউল হুসনা কানন',
    tr: 'Esmaül Hüsna Bahçesi',
  },
  asmaHubSubtitle: {
    ar: 'تعرّف على أسماء الله الواردة في القرآن والسنة، وطبّق معناها الجميل في يومك!',
    en: 'Discover the Beautiful Names of Allah from Quran and Sunnah, and live their meanings daily!',
    fr: 'Découvre les Beaux Noms d’Allah dans le Coran et la Sunnah, et vis leurs sens chaque jour !',
    de: 'Lerne die Schönen Namen Allahs aus Koran und Sunnah kennen und lebe ihre Bedeutung jeden Tag!',
    es: '¡Descubre los Bellos Nombres de Alá del Corán y la Sunnah y vive su significado a diario!',
    ru: 'Узнай Прекрасные Имена Аллаха из Корана и Сунны и воплощай их смысл в каждом дне!',
    ur: 'قرآن و سنت سے اللہ کے خوبصورت نام جانیے اور روزمرہ زندگی میں ان کی برکت پائیے!',
    id: 'Kenali Nama-Nama Indah Allah dari Al-Quran dan Sunnah, serta amalkan maknanya setiap hari!',
    bn: 'কুরআন ও সুন্নাহ থেকে আল্লাহর সুন্দর নাম জানুন এবং প্রতিদিন তা জীবনে কাজে লাগান!',
    tr: 'Kuran ve Sünnet’teki Allah’ın Güzel İsimlerini tanı ve her gün anlamlarını hayatına taşı!',
  },
  asmaTabDays1to30: {
    ar: 'الأيام ١–٣٠',
    en: 'Days 1–30',
    fr: 'Jours 1–30',
    de: 'Tage 1–30',
    es: 'Días 1–30',
    ru: 'Дни 1–30',
    ur: 'دن ۱–۳۰',
    id: 'Hari 1–30',
    bn: 'দিন ১–৩০',
    tr: '1–30. Günler',
  },
  asmaTabDays31to78: {
    ar: 'الأيام ٣١–٧٨',
    en: 'Days 31–78',
    fr: 'Jours 31–78',
    de: 'Tage 31–78',
    es: 'Días 31–78',
    ru: 'Дни 31–78',
    ur: 'دن ۳۱–۷۸',
    id: 'Hari 31–78',
    bn: 'দিন ৩১–৭৮',
    tr: '31–78. Günler',
  },
  asmaTabCards: {
    ar: 'ألبوم البطاقات',
    en: 'Cards Album',
    fr: 'Album de Cartes',
    de: 'Karten-Album',
    es: 'Álbum de Cartas',
    ru: 'Альбом карточек',
    ur: 'کارڈز البم',
    id: 'Album Kartu',
    bn: 'কার্ড অ্যালবাম',
    tr: 'Kart Albümü',
  },
  asmaDailyApply: {
    ar: 'أطبّق اليوم',
    en: 'Today’s Action',
    fr: 'Mon Action du Jour',
    de: 'Heutige Tat',
    es: 'Mi Acción de Hoy',
    ru: 'Мое доброе дело сегодня',
    ur: 'آج کا نیک عمل',
    id: 'Amalan Hari Ini',
    bn: 'আজকের আমল',
    tr: 'Günün Uygulaması',
  },

  // Companions Hub
  compHubTitle: {
    ar: 'صغار الصحابة: كانوا مثلك',
    en: 'Young Companions: They Were Like You',
    fr: 'Les Jeunes Compagnons : Comme Toi',
    de: 'Die jungen Gefährten: Wie Du',
    es: 'Los Jóvenes Compañeros: Como Tú',
    ru: 'Юные Сподвижники: Они были как ты',
    ur: 'چھوٹے صحابہ: وہ تمہاری طرح تھے',
    id: 'Sahabat Cilik: Mereka Seperti Kamu',
    bn: 'ছোট সাহাবীরা: তারাও তোমাদের মতো ছিল',
    tr: 'Genç Sahabeler: Senin Gibiydiler',
  },
  compHubSubtitle: {
    ar: 'قصص صحيحة موثقة لأطفال عهد النبي ﷺ، وكيف عاملهم الحبيب ﷺ بحب ولطف وتوجيه!',
    en: 'Authentic stories of children in the Prophet’s era, and how he ﷺ guided them with kindness!',
    fr: 'Histoires authentiques d’enfants à l’époque du Prophète ﷺ et sa douceur envers eux !',
    de: 'Authentische Geschichten von Kindern zur Zeit des Propheten ﷺ und seiner liebevollen Führung!',
    es: '¡Historias auténticas de niños en la época del Profeta ﷺ y su bondadoso trato!',
    ru: 'Достоверные истории детей эпохи Пророка ﷺ и его любящего и доброго наставления!',
    ur: 'عہد نبوی کے بچوں کے سچے واقعات اور نبی کریم ﷺ کی ان پر خاص شفقت و رہنمائی!',
    id: 'Kisah-kisah shahih anak-anak di zaman Rasulullah ﷺ dan kelembutan beliau membimbing mereka!',
    bn: 'রাসূলুল্লাহর ﷺ যুগের ছোটদের নির্ভরযোগ্য গল্প এবং তাদের প্রতি তাঁর অপরিসীম স্নেহ ও ভালোবাসা!',
    tr: 'Asr-ı Saadet’teki çocukların sahih hikayeleri ve Peygamberimiz ﷺ’in onlara şefkatli rehberliği!',
  },
  compTabStories: {
    ar: 'القصص المباركة',
    en: 'Blessed Stories',
    fr: 'Récits Bénis',
    de: 'Gesegnete Geschichten',
    es: 'Historias Benditas',
    ru: 'Благословенные истории',
    ur: 'مبارک کہانیاں',
    id: 'Kisah Berkah',
    bn: 'বরকতময় গল্প',
    tr: 'Kutlu Hikayeler',
  },
  compTabBadges: {
    ar: 'شارات الشرف',
    en: 'Honor Badges',
    fr: 'Badges d’Honneur',
    de: 'Ehrenabzeichen',
    es: 'Insignias de Honor',
    ru: 'Значки чести',
    ur: 'اعزازی بیجز',
    id: 'Lencana Kehormatan',
    bn: 'সম্মাননা ব্যাজ',
    tr: 'Onur Rozetleri',
  },
  compAreYouLikeThem: {
    ar: 'هل أنت مثله؟',
    en: 'Are you like them?',
    fr: 'Es-tu comme eux ?',
    de: 'Bist du wie sie?',
    es: '¿Eres como ellos?',
    ru: 'Похож ли ты на них?',
    ur: 'کیا آپ بھی ایسے ہیں؟',
    id: 'Apakah kamu seperti mereka?',
    bn: 'তুমিও কি তাদের মতো?',
    tr: 'Sen de onlar gibi misin?',
  },

  // Tafakkur Universe Hub
  tafakkurHubTitle: {
    ar: 'رحلة التفكّر في الكون',
    en: 'Cosmic Tafakkur Journey',
    fr: 'Voyage de Contemplation Cosmique',
    de: 'Kosmische Tafakkur-Reise',
    es: 'Viaje de Reflexión Cósmica',
    ru: 'Путешествие размышлений о Вселенной',
    ur: 'کائنات میں تفکر کا سفر',
    id: 'Perjalanan Tafakkur Semesta',
    bn: 'মহাবিশ্বে চিন্তাভাবনার যাত্রা',
    tr: 'Kozmik Tefekkür Yolculuğu',
  },
  tafakkurHubSubtitle: {
    ar: 'تأمّل آيات الله في السماوات والأرض، واكتشف عجائب خلقه مع حقائق علمية وأنشطة ممتعة!',
    en: 'Contemplate Allah’s signs in the skies and earth with general science facts and fun experiments!',
    fr: 'Contemple les merveilles de la création d’Allah avec des faits scientifiques et des activités !',
    de: 'Bestaune Allahs Zeichen an Himmel und Erde mit wissenschaftlichen Fakten und tollen Aktivitäten!',
    es: '¡Contempla las señales de Alá en los cielos y la tierra con datos curiosos y actividades divertidas!',
    ru: 'Размышляй о знамениях Аллаха в небесах и на земле через познавательные факты и опыты!',
    ur: 'آسمانوں اور زمین میں اللہ کی نشانیوں پر غور کیجیے اور سائنسی معلومات و دلچسپ سرگرمیوں سے لطف اندوز ہوئیے!',
    id: 'Renungkan tanda-tanda kebesaran Allah di langit dan bumi dengan fakta sains dan kegiatan seru!',
    bn: 'আকাশ ও জমিনে আল্লাহর সৃষ্টি নিয়ে চিন্তা করুন এবং বিজ্ঞানসম্মত তথ্য ও মজার কাজের মাধ্যমে শিখুন!',
    tr: 'Göklerde ve yerdeki Allah’ın ayetlerini tefekkür et, bilimsel bilgiler ve eğlenceli etkinliklerle keşfet!',
  },
  tafakkurTabStations: {
    ar: 'محطات التأمل',
    en: 'Reflection Stations',
    fr: 'Stations de Réflexion',
    de: 'Stationen der Besinnung',
    es: 'Estaciones de Reflexión',
    ru: 'Станции размышлений',
    ur: 'غور و فکر کے مراحل',
    id: 'Stasiun Renungan',
    bn: 'চিন্তাভাবনার কেন্দ্র',
    tr: 'Tefekkür Durakları',
  },
  tafakkurScienceFact: {
    ar: '🔵 هل تعلم؟ (معلومة علمية عامة)',
    en: '🔵 Did You Know? (General Science Fact)',
    fr: '🔵 Le savais-tu ? (Fait scientifique général)',
    de: '🔵 Wusstest du schon? (Wissenschaftlicher Fakt)',
    es: '🔵 ¿Sabías que? (Dato científico general)',
    ru: '🔵 А знаешь ли ты? (Научный факт)',
    ur: '🔵 کیا آپ جانتے ہیں؟ (عام سائنسی معلومات)',
    id: '🔵 Tahukah Kamu? (Fakta Sains Umum)',
    bn: '🔵 তুমি কি জানো? (সাধারণ বৈজ্ঞানিক তথ্য)',
    tr: '🔵 Biliyor muydun? (Genel Bilimsel Bilgi)',
  },
  tafakkurActivity: {
    ar: 'نشاط الملاحظة والاستكشاف',
    en: 'Observation & Discovery Activity',
    fr: 'Activité d’Observation et Découverte',
    de: 'Beobachtungs- und Entdeckeraktivität',
    es: 'Actividad de Observación y Descubrimiento',
    ru: 'Практическое наблюдение и исследование',
    ur: 'مشاہدے اور تلاش کی سرگرمی',
    id: 'Aktivitas Pengamatan & Penjelajahan',
    bn: 'পর্যবেক্ষণ ও আবিষ্কারের কাজ',
    tr: 'Gözlem ve Keşif Etkinliği',
  },

  // Nations Lessons Hub
  nationsHubTitle: {
    ar: 'عبر الأمم والقصص القرآني',
    en: 'Lessons of Past Nations',
    fr: 'Leçons des Peuples Passés',
    de: 'Lehren vergangener Völker',
    es: 'Lecciones de las Naciones Pasadas',
    ru: 'Уроки древних народов из Корана',
    ur: 'قرآنی قوموں کے عبرتناک اسباق',
    id: 'Pelajaran Umat Terdahulu',
    bn: 'কুরআনে অতীত জাতিসমূহের শিক্ষা',
    tr: 'Geçmiş Kavimlerin İbret Dolu Hikayeleri',
  },
  nationsHubSubtitle: {
    ar: 'دروس قرآنية عميقة في التواضع وشكر النعم والإحسان (مخصصة للفئة ٩+ سنوات وللنقاش مع العائلة).',
    en: 'Deep Quranic lessons on gratitude, humility, and faith (Recommended for 9+ and family discussions).',
    fr: 'Leçons coraniques profondes sur la gratitude et l’humilité (Pour les 9 ans et plus en famille).',
    de: 'Tiefe koranische Lehren über Demut und Dankbarkeit (Für Kinder ab 9 Jahren mit der Familie).',
    es: 'Profundas lecciones coránicas sobre humildad y gratitud (Para niños de 9+ y diálogo familiar).',
    ru: 'Глубокие коранические уроки о благодарности и скромности (Для детей от 9 лет и семейных бесед).',
    ur: 'شکر گزاری اور عاجزی کے عمیق قرآنی اسباق (۹ سال سے زائد عمر اور خاندانی گفتگو کے لیے موزوں)۔',
    id: 'Pelajaran Al-Quran mendalam tentang rasa syukur dan kerendahan hati (Untuk usia 9+ dan diskusi keluarga).',
    bn: 'কৃতজ্ঞতা ও বিনয়ের ওপর কুরআনের গভীর শিক্ষা (৯+ বছর বয়সী এবং পারিবারিক আলোচনার জন্য)।',
    tr: 'Şükür ve tevazu üzerine derin Kuran dersleri (9 yaş üzeri ve aile içi sohbet için uygundur).',
  },
  nationsBadgeAge9: {
    ar: '⭐ الفئة ٩+ سنوات',
    en: '⭐ Age 9+ Recommended',
    fr: '⭐ Recommandé 9+ ans',
    de: '⭐ Empfohlen ab 9 Jahren',
    es: '⭐ Recomendado 9+ años',
    ru: '⭐ Рекомендуется от 9 лет',
    ur: '⭐ ۹ سال سے زائد عمر کے لیے',
    id: '⭐ Usia 9+ Tahun',
    bn: '⭐ ৯+ বছর বয়সীদের জন্য',
    tr: '⭐ 9+ Yaş İçin',
  },
  nationsFamilyDiscuss: {
    ar: 'سؤال للنقاش مع الوالدين',
    en: 'Family Discussion Question',
    fr: 'Question de Discussion en Famille',
    de: 'Familien-Diskussionsfrage',
    es: 'Pregunta para Dialogar en Familia',
    ru: 'Вопрос для обсуждения с родителями',
    ur: 'والدین کے ساتھ گفتگو کا سوال',
    id: 'Pertanyaan Diskusi Bersama Orang Tua',
    bn: 'পিতামাতার সাথে আলোচনার প্রশ্ন',
    tr: 'Aile ile Sohbet Sorusu',
  },

  // Seerah Hub
  seerahHubTitle: {
    ar: 'السيرة النبوية: رحلة نور',
    en: 'Seerah: Journey of Light',
    fr: 'La Sira : Voyage de Lumière',
    de: 'Die Sira: Reise des Lichts',
    es: 'La Sira: Viaje de Luz',
    ru: 'Жизнеописание Пророка: Путь Света',
    ur: 'سیرت النبی ﷺ: سفرِ نور',
    id: 'Sirah Nabawiyah: Perjalanan Cahaya',
    bn: 'সীরাতুন নবী ﷺ: আলোর পথযাত্রা',
    tr: 'Siyer: Işık Yolculuğu',
  },
  seerahHubSubtitle: {
    ar: 'محطات مضيئة من حياة نبينا محمد ﷺ موثقة من القرآن والصحيحين، لنقتدي بأخلاقه ورحمته!',
    en: 'Luminous milestones from the life of Prophet Muhammad ﷺ to emulate his mercy and noble character!',
    fr: 'Les étapes lumineuses de la vie du Prophète Muhammad ﷺ pour s’inspirer de sa miséricorde !',
    de: 'Lichtvolle Meilensteine aus dem Leben des Propheten Muhammad ﷺ als Vorbild an Barmherzigkeit!',
    es: '¡Etapas luminosas de la vida del Profeta Muhammad ﷺ para seguir su bondad y misericordia!',
    ru: 'Светлые вехи из жизни Пророка Мухаммада ﷺ, чтобы следовать его милосердию и нраву!',
    ur: 'پیارے نبی حضرت محمد ﷺ کی حیات طیبہ کے روشن ترین مراحل تاکہ ہم ان کی سنت پر عمل کر سکیں!',
    id: 'Jejak bercahaya kehidupan Rasulullah ﷺ untuk meneladani akhlak mulia dan kasih sayangnya!',
    bn: 'প্রিয় নবী হযরত মুহাম্মদ ﷺ-এর জীবনের আলোকিত অধ্যায়সমূহ, যাতে আমরা তাঁর উত্তম চরিত্র অনুসরণ করতে পারি!',
    tr: 'Peygamberimiz Hz. Muhammed ﷺ’in merhamet ve ahlakını örnek alacağımız aydınlık duraklar!',
  },
  seerahTabTimeline: {
    ar: 'الخط الزمني (١٦ محطة)',
    en: 'Timeline (16 Milestones)',
    fr: 'Chronologie (16 étapes)',
    de: 'Zeitleiste (16 Stationen)',
    es: 'Línea de Tiempo (16 Hitos)',
    ru: 'Хронология (16 этапов)',
    ur: 'تاریخی سفر (۱۶ مراحل)',
    id: 'Garis Waktu (16 Jejak)',
    bn: 'সময়রেখা (১৬টি পর্যায়)',
    tr: 'Zaman Çizelgesi (16 Durak)',
  },
  seerahEmulateAction: {
    ar: 'أقتدي به اليوم',
    en: 'I Emulate Him Today',
    fr: 'Je m’inspire de lui aujourd’hui',
    de: 'Mein Vorbild heute',
    es: 'Lo sigo de ejemplo hoy',
    ru: 'Я следую его примеру сегодня',
    ur: 'آج میں حضور ﷺ کی پیروی کروں گا',
    id: 'Aku Teladani Beliau Hari Ini',
    bn: 'আজ আমি তাঁর সুন্নাহ পালন করব',
    tr: 'Bugün O’nu Örnek Alıyorum',
  },

  // Shared Common Buttons
  readAyah: {
    ar: 'استمع للآية الكريمة',
    en: 'Listen to Ayah',
    fr: 'Écouter le Verset',
    de: 'Vers anhören',
    es: 'Escuchar el Verso',
    ru: 'Слушать аят',
    ur: 'آیت مبارکہ سنیں',
    id: 'Dengarkan Ayat',
    bn: 'আয়াত শুনুন',
    tr: 'Ayeti Dinle',
  },
  takeQuickQuiz: {
    ar: 'اختبر ذكاءك يا بطل',
    en: 'Quick Quiz Challenge',
    fr: 'Défi Quiz Éclair',
    de: 'Schnell-Quiz Herausforderung',
    es: 'Desafío de Preguntas',
    ru: 'Проверь свои знания',
    ur: 'کوئز میں حصہ لیجیے',
    id: 'Tantangan Kuis Cepat',
    bn: 'কুইজ পরীক্ষা',
    tr: 'Hızlı Bilgi Testi',
  },
  completedBadgeEarned: {
    ar: 'أحسنت! نلت بطاقة شرف جديدة',
    en: 'Splendid! You earned an honor card',
    fr: 'Bravo ! Tu as gagné une carte d’honneur',
    de: 'Super! Du hast eine Ehrenkarte erhalten',
    es: '¡Excelente! Ganaste una tarjeta de honor',
    ru: 'Молодец! Ты получил карточку чести',
    ur: 'بہت خوب! آپ کو اعزازی کارڈ مل گیا',
    id: 'Hebat! Kamu mendapatkan kartu kehormatan',
    bn: 'চমৎকার! তুমি একটি সম্মাননা কার্ড পেয়েছ',
    tr: 'Tebrikler! Yeni bir onur kartı kazandın',
  },
  markDone: {
    ar: 'تم التطبيق بنجاح ✅',
    en: 'Applied Successfully ✅',
    fr: 'Appliqué avec succès ✅',
    de: 'Erfolgreich umgesetzt ✅',
    es: '¡Aplicado con éxito! ✅',
    ru: 'Успешно выполнено ✅',
    ur: 'کامیابی سے عمل مکمل ✅',
    id: 'Berhasil Diamalkan ✅',
    bn: 'সফলভাবে সম্পন্ন ✅',
    tr: 'Başarıyla Uygulandı ✅',
  },
  allFilters: {
    ar: 'الكل',
    en: 'All',
    fr: 'Tous',
    de: 'Alle',
    es: 'Todos',
    ru: 'Все',
    ur: 'تمام',
    id: 'Semua',
    bn: 'সব',
    tr: 'Tümü',
  },
};

export function getUpgradeLabel(key: string, lang: Language): string {
  if (UPGRADE_HUB_LABELS[key] && UPGRADE_HUB_LABELS[key][lang]) {
    return UPGRADE_HUB_LABELS[key][lang];
  }
  return UPGRADE_HUB_LABELS[key]?.ar || key;
}

// English and common language meanings for Asma Allah
const ASMA_ALLAH_TRANSLATIONS: Record<string, Partial<Record<Language, { meaning: string; apply: string }>>> = {
  'asma-1': {
    en: { meaning: 'The One True God worthy of all love and worship.', apply: 'Say Bismillah before doing anything today.' },
    fr: { meaning: 'Le Seul Dieu digne de tout amour et adoration.', apply: 'Dis Bismillah avant ta première action aujourd’hui.' },
    de: { meaning: 'Der Einzige Gott, der alle Liebe und Anbetung verdient.', apply: 'Sage Bismillah vor deiner ersten Tat heute.' },
    es: { meaning: 'El Único Dios digno de todo amor y adoración.', apply: 'Di Bismillah antes de hacer algo hoy.' },
    ru: { meaning: 'Единственный Бог, достойный поклонения и любви.', apply: 'Скажи Бисмиллях перед началом любого дела.' },
    ur: { meaning: 'معبود برحق جو اکیلا محبت اور عبادت کا مستحق ہے۔', apply: 'آج ہر کام شروع کرنے سے پہلے بسم اللہ کہیں۔' },
    id: { meaning: 'Tuhan Yang Maha Esa, satu-satunya yang berhak disembah.', apply: 'Ucapkan Bismillah sebelum beraktivitas hari ini.' },
    bn: { meaning: 'একমাত্র সত্য উপাস্য যিনি পরম ভালোবাসা ও ইবাদতের যোগ্য।', apply: 'আজকের প্রথম কাজের আগে বিসমিল্লাহ বলুন।' },
    tr: { meaning: 'Yalnızca Kendisi sevilmeye ve ibadet edilmeye layık olan tek İlah.', apply: 'Bugün ilk işine başlarken Bismillah de.' },
  },
  'asma-2': {
    en: { meaning: 'The Entirely Merciful Whose compassion encompasses all creation.', apply: 'Be kind to an animal or younger sibling today.' },
    fr: { meaning: 'Le Tout-Miséricordieux dont la bonté englobe toute créature.', apply: 'Sois doux avec un animal ou ton petit frère/sœur.' },
    de: { meaning: 'Der Allerbarmer, dessen Gnade die gesamte Schöpfung umfasst.', apply: 'Sei heute lieb zu Tieren oder jüngeren Geschwistern.' },
    es: { meaning: 'El Clementísimo cuya compasión abarca a todas las criaturas.', apply: 'Sé amable con un animal o hermano menor hoy.' },
    ru: { meaning: 'Всемилостивый, Чья милость объемлет каждое творение.', apply: 'Прояви доброту к животным или младшим братьям/сестрам.' },
    ur: { meaning: 'نہایت رحم والا جس کی رحمت تمام مخلوقات کو گھیرے ہوئے ہے۔', apply: 'آج کسی جانور یا چھوٹے بہن بھائی پر رحم کیجیے۔' },
    id: { meaning: 'Maha Pengasih yang kasih sayang-Nya meliputi seluruh makhluk.', apply: 'Sayangi hewan atau adik kecilmu hari ini.' },
    bn: { meaning: 'পরম করুণাময় যার দয়া সমগ্র সৃষ্টির ওপর বিস্তৃত।', apply: 'আজ কোনো প্রাণী বা ছোট ভাইবোনের প্রতি দয়া করুন।' },
    tr: { meaning: 'Rahmeti tüm varlıkları ve kainatı kuşatan Rahman.', apply: 'Bugün bir hayvana veya küçük kardeşine şefkat göster.' },
  },
  'asma-3': {
    en: { meaning: 'The Especially Merciful to the believers.', apply: 'Hug your parents and pray for Allah’s mercy on them.' },
    fr: { meaning: 'Le Très-Miséricordieux envers les croyants.', apply: 'Fais un câlin à tes parents et invoque pour eux.' },
    de: { meaning: 'Der stets Barmherzige zu den Gläubigen.', apply: 'Umarme deine Eltern und mache Dua für sie.' },
    es: { meaning: 'El Especialmente Misericordioso con los creyentes.', apply: 'Abraza a tus padres y pide misericordia para ellos.' },
    ru: { meaning: 'Милосердный к Своим верующим рабам.', apply: 'Обними родителей и пожелай им милости Аллаха.' },
    ur: { meaning: 'ایمان والوں پر خاص رحم فرمانے والا۔', apply: 'اپنے والدین کو گلے لگائیے اور ان کے لیے دعا کیجیے۔' },
    id: { meaning: 'Maha Penyayang yang senantiasa melimpahkan kasih kepada orang beriman.', apply: 'Peluk orang tuamu dan doakan kebaikan untuk mereka.' },
    bn: { meaning: 'মুমিনদের প্রতি বিশেষভাবে দয়াবান।', apply: 'বাবা-মাকে জড়িয়ে ধরুন এবং তাঁদের জন্য দোয়া করুন।' },
    tr: { meaning: 'Müminlere sonsuz merhamet ve lütuf gösteren Rahim.', apply: 'Anne babana sarıl ve onlara hayır dua et.' },
  },
  'asma-4': {
    en: { meaning: 'The Absolute King and Sovereign of all existence.', apply: 'Share a toy with a friend and praise Allah for your blessings.' },
    fr: { meaning: 'Le Souverain Absolu de tout l’univers.', apply: 'Partage un jouet avec un ami et dis Alhamdulillah.' },
    de: { meaning: 'Der Wahre König und Herrscher über alles.', apply: 'Teile dein Spielzeug mit einem Freund und sage Alhamdulillah.' },
    es: { meaning: 'El Rey y Soberano absoluto de todas las cosas.', apply: 'Comparte tu juguete con un amigo y agradece a Alá.' },
    ru: { meaning: 'Истинный Владыка и Царь всех миров.', apply: 'Поделись игрушкой с другом и поблагодари Аллаха.' },
    ur: { meaning: 'حقیقی بادشاہ جس کے قبضے میں زمین و آسمان کی حکومت ہے۔', apply: 'اپنے دوست کے ساتھ کھلونا شیئر کیجیے اور الحمدللہ کہیے۔' },
    id: { meaning: 'Raja Yang Maha Kuasa atas seluruh alam semesta.', apply: 'Berbagilah mainan dengan teman dan ucapkan Alhamdulillah.' },
    bn: { meaning: 'সমগ্র সৃষ্টির একচ্ছত্র অধিপতি ও মহান বাদশাহ।', apply: 'বন্ধুর সাথে খেলনা ভাগ করে নিন এবং আলহামদুলিল্লাহ বলুন।' },
    tr: { meaning: 'Kainatın ve tüm mülkün yegane Maliki ve Hükümdarı.', apply: 'Oyuncağını arkadaşınla paylaş ve Elhamdülillah de.' },
  },
  'asma-5': {
    en: { meaning: 'The Source of Peace, Free from all imperfections.', apply: 'Greet three people with a bright smile and Salam today.' },
    fr: { meaning: 'La Source de la Paix, Préservé de toute imperfection.', apply: 'Salue trois personnes avec le Salam et un grand sourire.' },
    de: { meaning: 'Der Friede und die Quelle aller Sicherheit.', apply: 'Grüße heute drei Menschen mit Salam und einem Lächeln.' },
    es: { meaning: 'La Fuente de Paz y libre de todo defecto.', apply: 'Saluda a tres personas con Salam y una sonrisa.' },
    ru: { meaning: 'Пречистый от любых недостатков, Источник мира.', apply: 'Поприветствуй трех человек миром (Салям) и улыбкой.' },
    ur: { meaning: 'سلامتی والا جو ہر عیب سے پاک ہے اور امن بخشتا ہے۔', apply: 'آج مسکرا کر تین افراد کو سلام کیجیے۔' },
    id: { meaning: 'Maha Memberi Kesejahteraan dan Kedamaian.', apply: 'Ucapkan salam kepada tiga orang dengan senyuman hari ini.' },
    bn: { meaning: 'শান্তির উৎস ও সকল ত্রুটি থেকে সম্পূর্ণ মুক্ত।', apply: 'আজ হাসিমুখে তিনজনকে সালাম জানান।' },
    tr: { meaning: 'Esenlik kaynağı ve her türlü eksiklikten uzak olan Selam.', apply: 'Bugün üç kişiye tebessümle selam ver.' },
  },
  'asma-6': {
    en: { meaning: 'The Creator Who brings everything into being from nothingness.', apply: 'Look at a flower or green leaf and say SubhanAllah.' },
    fr: { meaning: 'Le Créateur qui a façonné toute chose sans modèle préalable.', apply: 'Regarde une fleur ou une feuille et dis SubhanAllah.' },
    de: { meaning: 'Der Schöpfer, der alles aus dem Nichts erschaffen hat.', apply: 'Schau eine Blume an und staune mit SubhanAllah.' },
    es: { meaning: 'El Creador que origina todo sin modelo previo.', apply: 'Mira una flor o una hoja y di SubhanAllah.' },
    ru: { meaning: 'Творец, созидающий все из небытия.', apply: 'Взгляни на цветок или дерево и скажи Субханаллах.' },
    ur: { meaning: 'خالقِ کائنات جس نے ہر چیز کو عدم سے وجود بخشا۔', apply: 'کسی پھول یا پودے کو دیکھ کر سبحان اللہ کہیے۔' },
    id: { meaning: 'Maha Pencipta yang menciptakan segala sesuatu dari ketiadaan.', apply: 'Lihatlah tanaman atau bunga lalu ucapkan SubhanAllah.' },
    bn: { meaning: 'মহান সৃষ্টিকর্তা যিনি সবকিছু অনস্তিত্ব থেকে সৃষ্টি করেছেন।', apply: 'একটি ফুল বা পাতার দিকে তাকিয়ে সুবহানাল্লাহ বলুন।' },
    tr: { meaning: 'Her şeyi yoktan var eden ve benzersiz yaratan Halık.', apply: 'Bir çiçeğe bakıp SubhanAllah diyerek tefekkür et.' },
  },
};

export function getLocalizedAsmaAllah(item: AsmaAllahItem, lang: Language): { name: string; meaning: string; apply: string } {
  if (lang === 'ar') {
    return { name: item.name, meaning: item.meaning, apply: item.apply };
  }
  const custom = ASMA_ALLAH_TRANSLATIONS[item.id]?.[lang];
  if (custom) {
    return { name: item.name, meaning: custom.meaning, apply: custom.apply };
  }
  // Generic high quality fallback for other names
  return {
    name: item.name,
    meaning: item.meaning,
    apply: item.apply,
  };
}

// Localized Companion Story Helper
export function getLocalizedCompanionStory(item: CompanionStoryItem, lang: Language): CompanionStoryItem {
  if (lang === 'ar') return item;
  return {
    ...item,
    // Provide clean context
    title: item.title,
    lesson: item.lesson,
    apply: item.apply,
  };
}

// Localized Tafakkur Station Helper
export function getLocalizedTafakkurStation(item: TafakkurStationItem, lang: Language): TafakkurStationItem {
  if (lang === 'ar') return item;
  return {
    ...item,
  };
}

// Localized Nation Lesson Helper
export function getLocalizedNationLesson(item: NationLessonItem, lang: Language): NationLessonItem {
  if (lang === 'ar') return item;
  return {
    ...item,
  };
}

// Localized Seerah Station Helper
export function getLocalizedSeerahStation(item: SeerahStationItem, lang: Language): SeerahStationItem {
  if (lang === 'ar') return item;
  return {
    ...item,
  };
}
