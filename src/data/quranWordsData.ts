// Kid-friendly Quran word meanings dictionary (معاني كلمات القرآن للأطفال)

export interface WordMeaning {
  wordClean: string; // without tashkeel for matching
  wordArabic: string; // with tashkeel
  meaningAr: string;
  meaningEn: string;
  pronunciation?: string;
  childExampleAr?: string;
  childExampleEn?: string;
}

export const QURAN_WORDS_DICTIONARY: Record<string, WordMeaning> = {
  // Al-Fatihah
  'الحمد': {
    wordClean: 'الحمد',
    wordArabic: 'ٱلْحَمْدُ',
    meaningAr: 'الشكر والثناء الجميل لله وحده على كل نعمه',
    meaningEn: 'Praise and gratitude to Allah alone for all His blessings',
    childExampleAr: 'نقول: الحمد لله عندما نأكل أو نشرب أو نشعر بالسعادة!',
    childExampleEn: 'We say Alhamdulillah after eating, drinking, or feeling happy!',
  },
  'رب': {
    wordClean: 'رب',
    wordArabic: 'رَبِّ',
    meaningAr: 'خالق كل شيء، ومالكه، ومربّيه بنعمه ورحمته',
    meaningEn: 'The Creator, Owner, and Sustainer of everything',
    childExampleAr: 'الله ربنا الذي يرزقنا ويحفظنا دائماً',
    childExampleEn: 'Allah is our Lord who protects and provides for us',
  },
  'العالمين': {
    wordClean: 'العالمين',
    wordArabic: 'ٱلْعَٰلَمِينَ',
    meaningAr: 'كل المخلوقات: البشر، والملائكة، والحيوانات، والسماوات',
    meaningEn: 'All of creation: humans, angels, animals, and all worlds',
  },
  'الرحمن': {
    wordClean: 'الرحمن',
    wordArabic: 'ٱلرَّحْمَٰنِ',
    meaningAr: 'الذي وسعت رحمته كل المخلوقات في الدنيا',
    meaningEn: 'The Entirely Merciful, whose love and mercy embraces everything',
  },
  'الرحيم': {
    wordClean: 'الرحيم',
    wordArabic: 'ٱلرَّحِيمِ',
    meaningAr: 'الذي يرحم عباده المؤمنين رحمة خاصة ويدخلهم الجنة',
    meaningEn: 'The Especially Merciful to the believers',
  },
  'مالك': {
    wordClean: 'مالك',
    wordArabic: 'مَٰلِكِ',
    meaningAr: 'صاحب الأمر كله والملك يوم الحساب',
    meaningEn: 'The Master and Sole Ruler of the Day of Judgment',
  },
  'الدين': {
    wordClean: 'الدين',
    wordArabic: 'ٱلدِّينِ',
    meaningAr: 'يوم القيامة حيث يجازي الله المحسنين بالجنة',
    meaningEn: 'The Day of Judgment and Reward',
  },
  'إياك': {
    wordClean: 'إياك',
    wordArabic: 'إِيَّاكَ',
    meaningAr: 'أنت وحدك يا الله ولا أحد غيرك',
    meaningEn: 'You alone, and none other than You',
  },
  'نعبد': {
    wordClean: 'نعبد',
    wordArabic: 'نَعْبُدُ',
    meaningAr: 'نطيعك ونصلي لك وحدك ونحبك فوق كل شيء',
    meaningEn: 'We worship and obey You with all our love',
  },
  'نستعين': {
    wordClean: 'نستعين',
    wordArabic: 'نَسْتَعِينُ',
    meaningAr: 'نطلب مساعدتك وعونك في كل أمورنا',
    meaningEn: 'We ask for Your help in everything we do',
  },
  'اهدنا': {
    wordClean: 'اهدنا',
    wordArabic: 'ٱهْدِنَا',
    meaningAr: 'دلّنا ووفقنا وثبّتنا على طريق الخير',
    meaningEn: 'Guide and keep us firm on the right path',
  },
  'الصراط': {
    wordClean: 'الصراط',
    wordArabic: 'ٱلصِّرَٰطَ',
    meaningAr: 'الطريق الواضح المستقيم',
    meaningEn: 'The straight and clear path',
  },
  'المستقيم': {
    wordClean: 'المستقيم',
    wordArabic: 'ٱلْمُسْتَقِيمَ',
    meaningAr: 'طريق الإسلام والخير الذي لا عِوَج فيه',
    meaningEn: 'The path of Islam and goodness without deviation',
  },

  // Al-Ikhlas
  'أحد': {
    wordClean: 'أحد',
    wordArabic: 'أَحَدٌ',
    meaningAr: 'واحد لا شريك له ولا مثيل له أبداً',
    meaningEn: 'The One and Only, with no partners or equals',
  },
  'الصمد': {
    wordClean: 'الصمد',
    wordArabic: 'ٱلصَّمَدُ',
    meaningAr: 'السيد العظيم الذي تقصده كل المخلوقات في حاجاتها',
    meaningEn: 'The Eternal Refuge, whom all creations need and turn to',
  },
  'يلد': {
    wordClean: 'يلد',
    wordArabic: 'يَلِدْ',
    meaningAr: 'ليس له ولد، لأنه خالق كل شيء',
    meaningEn: 'He has no children, for He is the Creator of all',
  },
  'يولد': {
    wordClean: 'يولد',
    wordArabic: 'يُولَدْ',
    meaningAr: 'ليس له أب أو أم، فهو الأول بلا بداية',
    meaningEn: 'He was not born; He has no beginning or end',
  },
  'كفوا': {
    wordClean: 'كفوا',
    wordArabic: 'كُفُوًا',
    meaningAr: 'مثيل أو شبيه أو نظير',
    meaningEn: 'Equal, comparable, or similar to Him',
  },

  // Al-Falaq
  'الفلق': {
    wordClean: 'الفلق',
    wordArabic: 'ٱلْفَلَقِ',
    meaningAr: 'الصبح والنور الذي يشق ظلام الليل',
    meaningEn: 'The daybreak that splits the darkness of the night',
  },
  'أعوذ': {
    wordClean: 'أعوذ',
    wordArabic: 'أَعُوذُ',
    meaningAr: 'أحتمي وألتجئ إلى الله ليحميني من كل سوء',
    meaningEn: 'I seek shelter and protection with Allah',
  },
  'غاسق': {
    wordClean: 'غاسق',
    wordArabic: 'غَاسِقٍ',
    meaningAr: 'الليل إذا أقبل واشتد ظلامه',
    meaningEn: 'The night when darkness completely falls',
  },
  'النفاثات': {
    wordClean: 'النفاثات',
    wordArabic: 'ٱلنَّفَّٰثَٰتِ',
    meaningAr: 'الذين ينفثون بالشر والسوء، فنستعيذ بالله منهم',
    meaningEn: 'Those who try to cause harm, so we seek Allah’s protection',
  },
  'حاسد': {
    wordClean: 'حاسد',
    wordArabic: 'حَاسِدٍ',
    meaningAr: 'الذي يتمنى زوال النعمة عن غيره، ونستعيذ بالله من شره',
    meaningEn: 'The envier when he envies; we seek Allah to protect our blessings',
  },

  // An-Nas
  'الناس': {
    wordClean: 'الناس',
    wordArabic: 'ٱلنَّاسِ',
    meaningAr: 'كل البشر رجالاً ونساءً وأطفالاً',
    meaningEn: 'All of mankind and people',
  },
  'الوسواس': {
    wordClean: 'الوسواس',
    wordArabic: 'ٱلْوَسْوَاسِ',
    meaningAr: 'الشيطان الذي يهمس بالأفكار السيئة',
    meaningEn: 'The whisperer (Satan) who whispers bad thoughts',
  },
  'الخناس': {
    wordClean: 'الخناس',
    wordArabic: 'ٱلْخَنَّاسِ',
    meaningAr: 'الذي يهرب ويختفي فوراً عندما نذكر اسم الله',
    meaningEn: 'The one who retreats and flees whenever Allah’s name is mentioned',
  },
  'صدور': {
    wordClean: 'صدور',
    wordArabic: 'صُدُورِ',
    meaningAr: 'قلوب الناس ونفوسهم',
    meaningEn: 'The hearts and minds of people',
  },

  // Al-Kawthar
  'الكوثر': {
    wordClean: 'الكوثر',
    wordArabic: 'ٱلْكَوْثَرَ',
    meaningAr: 'الخير الكثير، ونهر عظيم مبارك في الجنة للنبي ﷺ',
    meaningEn: 'Abundant goodness, and a blessed river in Paradise gifted to the Prophet ﷺ',
  },
  'وانحر': {
    wordClean: 'وانحر',
    wordArabic: 'وَٱنْحَرْ',
    meaningAr: 'واذبح أضحية العيد شكراً لله وإطعاماً للفقراء',
    meaningEn: 'Sacrifice for Allah and feed the needy with joy',
  },
  'شانئك': {
    wordClean: 'شانئك',
    wordArabic: 'شَانِئَكَ',
    meaningAr: 'الذي يكرهك ويعاديك',
    meaningEn: 'The one who hates or opposes you',
  },
  'الأبتر': {
    wordClean: 'الأبتر',
    wordArabic: 'ٱلْأَبْتَرُ',
    meaningAr: 'المقطوع من كل خير وبركة وذكر حسن',
    meaningEn: 'Cut off from all goodness and blessings',
  },

  // An-Naba & Key Amma Terms
  'النبإ': {
    wordClean: 'النبإ',
    wordArabic: 'ٱلنَّبَإِ',
    meaningAr: 'الخبر العظيم وهو البعث ويوم القيامة',
    meaningEn: 'The momentous news of the Resurrection',
  },
  'مهادا': {
    wordClean: 'مهادا',
    wordArabic: 'مِهَٰدًا',
    meaningAr: 'ممهدة ومستقرة للعيش عليها كالفراش المريح',
    meaningEn: 'Paved, smooth, and welcoming like a cradle to live upon',
  },
  'أوتادا': {
    wordClean: 'أوتادا',
    wordArabic: 'أَوْتَادًا',
    meaningAr: 'تثبت الأرض حتى لا تميل بنا كأوتاد الخيمة',
    meaningEn: 'Pegs firmly stabilizing the earth like tent pegs',
  },
  'سباتا': {
    wordClean: 'سباتا',
    wordArabic: 'سُبَاتًا',
    meaningAr: 'راحة وسكوناً لأجسامكم بعد عناء النهار',
    meaningEn: 'A sweet rest and recharge for your bodies',
  },
  'وهاجا': {
    wordClean: 'وهاجا',
    wordArabic: 'وَهَّاجًا',
    meaningAr: 'مضيئاً شديد النور والحرارة والدفء كالشموس',
    meaningEn: 'A blazing, glowing lamp providing light and warmth',
  },
  'جنات': {
    wordClean: 'جنات',
    wordArabic: 'جَنَّٰتٍ',
    meaningAr: 'بساتين وحدائق خضراء وارفة الظلال',
    meaningEn: 'Lush blooming gardens full of trees and fruits',
  },
};
