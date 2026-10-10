// Daily Duas for Kids (حصن المسلم الصغير المبارك - 50 دعاءً صحيحاً)
// Authentic supplications with Arabic (with full Tashkeel), transliteration, English, context & virtues

export interface KidDua {
  id: string;
  category:
    | 'daily'
    | 'sleep'
    | 'food'
    | 'home'
    | 'morning'
    | 'mosque'
    | 'travel'
    | 'health'
    | 'nature'
    | 'study'
    | 'manners';
  titleAr: string;
  titleEn: string;
  arabicText: string;
  transliteration: string;
  translationEn: string;
  whenToSayAr: string;
  whenToSayEn: string;
  virtueAr: string;
  virtueEn: string;
  iconName: string;
}

export const DUAS_DATA: KidDua[] = [
  // 1. الاستيقاظ
  {
    id: 'dua-waking',
    category: 'morning',
    titleAr: 'دعاء الاستيقاظ من النوم',
    titleEn: 'Waking Up Supplication',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba’da ma amatana wa ilayhin-nushur',
    translationEn: 'All praise is for Allah who gave us life after causing us to sleep, and unto Him is the resurrection.',
    whenToSayAr: 'أول ما نفتح أعيننا في الصباح المشرق بنشاط',
    whenToSayEn: 'First thing upon waking in the morning',
    virtueAr: 'شكر لله على نعمة يوم جديد مليء بالبركات والحسنات',
    virtueEn: 'Thanking Allah for the gift of a new blessed day',
    iconName: 'sunny',
  },

  // 2. النوم
  {
    id: 'dua-sleeping',
    category: 'sleep',
    titleAr: 'دعاء النوم المبارك',
    titleEn: 'Before Sleeping Supplication',
    arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: 'Bismika Rabbi wada’tu janbi wa bika arfa’uh, in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi ‘ibadakas-salihin',
    translationEn: 'In Your name, my Lord, I lay down my side and in Your name I raise it up. If You take my soul, have mercy upon it, and if You release it, protect it as You protect Your righteous servants.',
    whenToSayAr: 'عند الاستلقاء على الفراش الطاهر بالجانب الأيمن',
    whenToSayEn: 'When lying down on bed on your right side',
    virtueAr: 'نوم هادئ في رعاية الله وملائكته تحفظك من كل سوء حتى تصبح',
    virtueEn: 'Peaceful sleep protected by angels until dawn',
    iconName: 'moon',
  },

  // 3. قبل الطعام
  {
    id: 'dua-eating-start',
    category: 'food',
    titleAr: 'دعاء قبل تناول الطعام',
    titleEn: 'Before Eating Supplication',
    arabicText: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translationEn: 'In the name of Allah',
    whenToSayAr: 'قبل أول لقمة أو شربة ماء باليد اليمنى',
    whenToSayEn: 'Before the first bite or drink using the right hand',
    virtueAr: 'تحل البركة في الطعام ولا يستطيع الشيطان أن يشاركنا فيه',
    virtueEn: 'Brings Allah’s blessings into the meal and repels shaytan',
    iconName: 'restaurant',
  },

  // 4. نسيان التسمية
  {
    id: 'dua-eating-forgot',
    category: 'food',
    titleAr: 'دعاء من نسي التسمية في أول الطعام',
    titleEn: 'When Forgetting Bismillah at First',
    arabicText: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirah',
    translationEn: 'In the name of Allah at its beginning and its end.',
    whenToSayAr: 'إذا تذكر المسلم أثناء تناول الطعام أنه نسي أن يقول بسم الله في البداية',
    whenToSayEn: 'Whenever you remember mid-meal that you forgot Bismillah',
    virtueAr: 'تستدرك البركة فوراً ويحرم الشيطان مما كان يشاركه فيه',
    virtueEn: 'Restores the blessing immediately and denies shaytan any share',
    iconName: 'refresh',
  },

  // 5. الفراغ من الطعام
  {
    id: 'dua-eating-finish',
    category: 'food',
    titleAr: 'دعاء الفراغ من الطعام',
    titleEn: 'After Finishing Meal Supplication',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-ladhi at’amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah',
    translationEn: 'Praise be to Allah who has fed me this and provided it for me without any power or strength on my part.',
    whenToSayAr: 'بعد الانتهاء من تناول الوجبة والشبع',
    whenToSayEn: 'Immediately after finishing the meal',
    virtueAr: 'يغفر الله به ما تقدم من الذنوب جزاء حمد الرازق الكريم',
    virtueEn: 'Earns forgiveness from Allah and gratitude to the Provider',
    iconName: 'sparkles',
  },

  // 6. شرب اللبن
  {
    id: 'dua-drinking-milk',
    category: 'food',
    titleAr: 'دعاء شرب اللبن والحليب',
    titleEn: 'Supplication When Drinking Milk',
    arabicText: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
    transliteration: 'Allahumma barik lana feehi wa zidna minh',
    translationEn: 'O Allah, bless it for us and increase it for us.',
    whenToSayAr: 'عند شرب كأس الحليب أو اللبن اللذيذ',
    whenToSayEn: 'When drinking a glass of delicious milk',
    virtueAr: 'اللبن يجزئ عن الطعام والشراب ويزيد القوة والبركة في الجسد',
    virtueEn: 'Milk provides wholesome nourishment and divine increase',
    iconName: 'nutrition',
  },

  // 7. أدب شرب الماء
  {
    id: 'dua-drinking-water',
    category: 'food',
    titleAr: 'هدي النبي ﷺ في شرب الماء',
    titleEn: 'Sunnah When Drinking Water',
    arabicText: 'بِسْمِ اللَّهِ (عِنْدَ الشُّرْبِ) .. الْحَمْدُ لِلَّهِ (بَعْدَهُ)',
    transliteration: 'Bismillah (before), Alhamdu lillah (after)',
    translationEn: 'Bismillah when drinking, and Alhamdu lillah afterwards.',
    whenToSayAr: 'الشرب جالساً على ثلاث دفعات مع التسمية والحمد',
    whenToSayEn: 'Drinking while seated in three mindful sips',
    virtueAr: 'أهنأ للجسد وأمرأ وأبرأ واتباع لسنة الحبيب ﷺ',
    virtueEn: 'Optimal for health, following the beloved Prophet’s way',
    iconName: 'water',
  },

  // 8. الخروج من البيت
  {
    id: 'dua-leaving-home',
    category: 'home',
    titleAr: 'دعاء الخروج من المنزل',
    titleEn: 'Leaving Home Supplication',
    arabicText: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu ‘alallahi, wa la hawla wa la quwwata illa billah',
    translationEn: 'In the name of Allah, I place my trust in Allah; there is no power or might except with Allah.',
    whenToSayAr: 'عند فتح الباب ووضع القدم خارج البيت',
    whenToSayEn: 'When stepping out of the front door',
    virtueAr: 'يقال لك: هُديت وكُفيت ووُقيت وتنحى عنك الشيطان!',
    virtueEn: 'Angels announce: You are guided, guarded, and protected!',
    iconName: 'exit',
  },

  // 9. دخول البيت
  {
    id: 'dua-entering-home',
    category: 'home',
    titleAr: 'دعاء دخول المنزل',
    titleEn: 'Entering Home Supplication',
    arabicText: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa ‘ala Rabbina tawakkalna',
    translationEn: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we depend.',
    whenToSayAr: 'عند فتح باب البيت والعودة مع إلقاء السلام على الأهل',
    whenToSayEn: 'When opening the door upon returning and greeting family',
    virtueAr: 'يقول الشيطان لأعوانه: لا مبيت لكم هنا الليلة ولا عشاء!',
    virtueEn: 'Shaytan flees and finds no shelter or share in the home',
    iconName: 'home',
  },

  // 10. دخول المسجد
  {
    id: 'dua-entering-mosque',
    category: 'mosque',
    titleAr: 'دعاء دخول المسجد',
    titleEn: 'Entering the Mosque',
    arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaf-tah li abwaba rahmatik',
    translationEn: 'O Allah, open the gates of Your mercy for me.',
    whenToSayAr: 'عند تقديم الرجل اليمنى لدخول المسجد للصلاة',
    whenToSayEn: 'When stepping into the mosque with the right foot',
    virtueAr: 'تفتح لك أبواب الرحمات والسكينة في بيت من بيوت الله',
    virtueEn: 'Opens the gates of divine mercy and peace in Allah’s house',
    iconName: 'business',
  },

  // 11. الخروج من المسجد
  {
    id: 'dua-leaving-mosque',
    category: 'mosque',
    titleAr: 'دعاء الخروج من المسجد',
    titleEn: 'Leaving the Mosque',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allahumma inni as-aluka min fadlik',
    translationEn: 'O Allah, I ask You from Your bounty.',
    whenToSayAr: 'عند الخروج بالرجل اليسرى من باب المسجد',
    whenToSayEn: 'When stepping out of the mosque with the left foot',
    virtueAr: 'يسأل العبد فضل الله ورزقه وتوفيقه في سائر يومه',
    virtueEn: 'Invites Allah’s grace, provision, and guidance outside',
    iconName: 'walk',
  },

  // 12. قبل الوضوء
  {
    id: 'dua-wudu-start',
    category: 'daily',
    titleAr: 'التسمية قبل الوضوء',
    titleEn: 'Before Wudu Supplication',
    arabicText: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translationEn: 'In the name of Allah',
    whenToSayAr: 'قبل غسل الكفين لبدء الوضوء المبارك',
    whenToSayEn: 'Before washing the hands at the start of ablution',
    virtueAr: 'بركة في الماء وطهارة كاملة للجسد والروح',
    virtueEn: 'Blesses the water and purifies body and spirit',
    iconName: 'water-outline',
  },

  // 13. بعد الوضوء
  {
    id: 'dua-wudu-finish',
    category: 'daily',
    titleAr: 'دعاء بعد الفراغ من الوضوء',
    titleEn: 'After Wudu Supplication',
    arabicText: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Ash-hadu alla ilaha illallahu wahdahu la shareeka lah, wa ash-hadu anna Muhammadan ‘abduhu wa rasuluh. Allahummaj-‘alnee minat-tawwabeena waj-‘alnee minal-mutatahhireen',
    translationEn: 'I bear witness that there is no deity except Allah alone without partner, and Muhammad is His slave and Messenger. O Allah, make me of those who repent and make me of those who purify themselves.',
    whenToSayAr: 'فور الانتهاء من غسل القدمين في الوضوء',
    whenToSayEn: 'Immediately upon completing ablution',
    virtueAr: 'فتحت له أبواب الجنة الثمانية يدخل من أيها شاء!',
    virtueEn: 'All eight gates of Paradise are opened for the servant!',
    iconName: 'shield-checkmark',
  },

  // 14. بعد الأذان
  {
    id: 'dua-after-adhan',
    category: 'mosque',
    titleAr: 'دعاء بعد سماع الأذان',
    titleEn: 'After the Adhan Supplication',
    arabicText: 'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transliteration: 'Allahumma Rabba hadhihid-da’watit-tammah, was-salatil-qa’imah, ati Muhammadanil-waseelata wal-fadeelah, wab’ath-hu maqamam-mahmudanil-ladhi wa’adtah',
    translationEn: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and virtue, and resurrect him to the praised station which You have promised him.',
    whenToSayAr: 'بعد ترديد الأذان مع المؤذن والفراغ منه',
    whenToSayEn: 'After repeating the call to prayer after the caller',
    virtueAr: 'حلت له شفاعة النبي محمد ﷺ يوم القيامة',
    virtueEn: 'Earns the Prophet’s ﷺ intercession on the Day of Judgment',
    iconName: 'megaphone',
  },

  // 15. دخول الخلاء
  {
    id: 'dua-toilet-enter',
    category: 'daily',
    titleAr: 'دعاء دخول الخلاء (الحمام)',
    titleEn: 'Entering the Bathroom',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: 'Allahumma inni a’udhu bika minal-khubuthi wal-khaba’ith',
    translationEn: 'O Allah, I seek refuge with You from all evil and harmful spirits.',
    whenToSayAr: 'قبل الدخول بالرجل اليسرى إلى الحمام',
    whenToSayEn: 'Before stepping into the restroom with the left foot',
    virtueAr: 'ستر لعورات بني آدم وحفظ تام من وساوس وأذى الشياطين',
    virtueEn: 'Shields privacy and protects fully against harmful spirits',
    iconName: 'hand-left',
  },

  // 16. الخروج من الخلاء
  {
    id: 'dua-toilet-exit',
    category: 'daily',
    titleAr: 'دعاء الخروج من الخلاء',
    titleEn: 'Leaving the Bathroom',
    arabicText: 'غُفْرَانَكَ',
    transliteration: 'Ghufranaka',
    translationEn: 'I seek Your forgiveness, O Allah.',
    whenToSayAr: 'عند الخروج بالقدم اليمنى من الحمام',
    whenToSayEn: 'When stepping out of the restroom with the right foot',
    virtueAr: 'استغفار لله وشكر على نعمة العافية وإخراج الأذى',
    virtueEn: 'Expressing gratitude for health and seeking forgiveness',
    iconName: 'checkmark-circle-outline',
  },

  // 17. لبس الثوب الجديد
  {
    id: 'dua-clothes-new',
    category: 'daily',
    titleAr: 'دعاء لبس الثوب الجديد',
    titleEn: 'Wearing New Clothes Supplication',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَٰذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-ladhi kasani hadhath-thawba wa razaqanihi min ghayri hawlin minni wa la quwwah',
    translationEn: 'All praise is for Allah who has clothed me with this garment and provided it for me without any power or strength on my part.',
    whenToSayAr: 'عند ارتداء ملابسنا النظيفة الجميلة أو ثوب العيد',
    whenToSayEn: 'When putting on clean clothes or a new holiday outfit',
    virtueAr: 'غفر الله له ما تقدم من ذنبه شكراً على نعمة الكساء',
    virtueEn: 'Forgives past minor sins out of praise for Allah’s provision',
    iconName: 'shirt',
  },

  // 18. خلع الملابس
  {
    id: 'dua-clothes-undress',
    category: 'daily',
    titleAr: 'الذكر عند خلع الملابس',
    titleEn: 'When Taking Off Clothes',
    arabicText: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translationEn: 'In the name of Allah',
    whenToSayAr: 'عند خلع الملابس لتبديلها أو الاستحمام',
    whenToSayEn: 'When undressing to change clothes or shower',
    virtueAr: 'ستر بين أعين الجن وعورات بني آدم وحفظ مبارك',
    virtueEn: 'Creates a spiritual veil protecting modesty and dignity',
    iconName: 'body',
  },

  // 19. النظر في المرآة
  {
    id: 'dua-mirror',
    category: 'manners',
    titleAr: 'دعاء النظر في المرآة',
    titleEn: 'Looking in the Mirror Supplication',
    arabicText: 'اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    transliteration: 'Allahumma kama hassanta khalqi fa-hassin khuluqi',
    translationEn: 'O Allah, just as You have made my physical form beautiful, make my character beautiful.',
    whenToSayAr: 'عند تمشيط الشعر والنظر في المرآة للاستعداد',
    whenToSayEn: 'When styling hair and looking in the mirror',
    virtueAr: 'طلب الجمال الباطن والأخلاق الفاضلة التي ترضي الله ورسوله',
    virtueEn: 'Pleads for inner beauty and noble character pleasing to Allah',
    iconName: 'sparkles-outline',
  },

  // 20. طلب العلم
  {
    id: 'dua-knowledge',
    category: 'study',
    titleAr: 'دعاء طلب العلم والذكاء',
    titleEn: 'Seeking Knowledge Supplication',
    arabicText: 'رَّبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ‘ilma',
    translationEn: 'My Lord, increase me in knowledge.',
    whenToSayAr: 'قبل فتح كتاب المدرسة أو بدء حلقة القرآن وحفظ الدروس',
    whenToSayEn: 'Before opening your school book or starting Quran recitation',
    virtueAr: 'دعاء قرآني مبارك يفتح مدارك العقل ويفيض فهماً وحكمة',
    virtueEn: 'Quranic supplication that expands understanding and wisdom',
    iconName: 'book',
  },

  // 21. تيسير الأمر الصعب
  {
    id: 'dua-difficulty',
    category: 'study',
    titleAr: 'دعاء تيسير الأمر الصعب والمذاكرة',
    titleEn: 'Ease in Difficult Tasks Supplication',
    arabicText: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration: 'Allahumma la sahla illa ma ja’altahu sahla, wa anta taj’alul-hazna idha shi’ta sahla',
    translationEn: 'O Allah, there is nothing made easy except what You make easy, and You make hardship easy if You will.',
    whenToSayAr: 'قبل الامتحانات أو عند مواجهة مسألة دراسية صعبة',
    whenToSayEn: 'Before a test or when facing a challenging homework problem',
    virtueAr: 'توفيق الله وعونه، وتيسير ما كان عسيراً برحمته',
    virtueEn: 'Brings divine assistance and transforms difficulty into ease',
    iconName: 'school',
  },

  // 22. بر الوالدين
  {
    id: 'dua-parents',
    category: 'manners',
    titleAr: 'دعاء البر بالوالدين الحبيبين',
    titleEn: 'Supplication for Beloved Parents',
    arabicText: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi-rhamhuma kama rabbayani sagheera',
    translationEn: 'My Lord, have mercy upon them both as they brought me up when I was small.',
    whenToSayAr: 'في كل سجود ودعاء يومي لوالديك المحبين',
    whenToSayEn: 'In every prostration and prayer for your loving parents',
    virtueAr: 'أعظم هدية وبر تقدمه لوالديك يرفع درجتهما في الجنة',
    virtueEn: 'The finest gift of gratitude elevating parents in Paradise',
    iconName: 'heart',
  },

  // 23. مغفرة الوالدين
  {
    id: 'dua-parents-forgive',
    category: 'manners',
    titleAr: 'دعاء المغفرة للوالدين والمؤمنين',
    titleEn: 'Forgiveness for Parents & Believers',
    arabicText: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration: 'Rabbanagh-fir lee wa li-walidayya wa lil-mu’mineena yawma yaqoomul-hisab',
    translationEn: 'Our Lord, forgive me and my parents and the believers the Day the account is established.',
    whenToSayAr: 'في ختام الصلوات والوتر وقبل النوم',
    whenToSayEn: 'At the conclusion of prayers and before sleep',
    virtueAr: 'دعاء نبي الله إبراهيم عليه السلام يجمع الأجر لكل مؤمن',
    virtueEn: 'Prophet Ibrahim’s prayer gathering reward for all believers',
    iconName: 'people',
  },

  // 24. عطاس: الحمد لله
  {
    id: 'dua-sneezing-say',
    category: 'manners',
    titleAr: 'ذكر العاطس',
    titleEn: 'When Sneezing Supplication',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdu lillah',
    translationEn: 'All praise is for Allah.',
    whenToSayAr: 'فور العطاس مع تغطية الفم بالمنديل أو المرفق',
    whenToSayEn: 'Immediately after sneezing while covering mouth',
    virtueAr: 'حمد لله على خروج الأذى ونعمة العافية والسلامة',
    virtueEn: 'Praises Allah for relief and bodily wellness',
    iconName: 'happy',
  },

  // 25. عطاس: يرحمك الله
  {
    id: 'dua-sneezing-reply',
    category: 'manners',
    titleAr: 'تشميت العاطس إذا حمد الله',
    titleEn: 'Replying to the Sneezing Person',
    arabicText: 'يَرْحَمُكَ اللَّهُ',
    transliteration: 'Yarhamukallah',
    translationEn: 'May Allah have mercy upon you.',
    whenToSayAr: 'عند سماع صديقك أو أخيك يعطس ويقول الحمد لله',
    whenToSayEn: 'When hearing someone sneeze and say Alhamdu lillah',
    virtueAr: 'حق المسلم على أخيه المسلم ينشر المحبة والرحمة بين القلوب',
    virtueEn: 'A brotherly Islamic duty spreading warmth and care',
    iconName: 'heart-circle',
  },

  // 26. عطاس: يهديكم الله
  {
    id: 'dua-sneezing-answer',
    category: 'manners',
    titleAr: 'رد العاطس على من شَمَّته',
    titleEn: 'Sneezing Person’s Final Reply',
    arabicText: 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
    transliteration: 'Yahdeekumullahu wa yuslihu balakum',
    translationEn: 'May Allah guide you and set right your condition.',
    whenToSayAr: 'رد العاطس على من قال له: يرحمك الله',
    whenToSayEn: 'In reply to the person who said Yarhamukallah',
    virtueAr: 'دعاء جامع بالهداية وصلاح الحال وهدوء البال',
    virtueEn: 'Comprehensive prayer for divine guidance and peace of mind',
    iconName: 'shield',
  },

  // 27. ركوب السيارة
  {
    id: 'dua-vehicle-ride',
    category: 'travel',
    titleAr: 'دعاء ركوب السيارة والحافلة',
    titleEn: 'Riding Vehicle Supplication',
    arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun',
    translationEn: 'Glory unto Him who has subjected this to us, and we were not capable of it, and indeed to our Lord we shall return.',
    whenToSayAr: 'عند ركوب السيارة أو الحافلة المدرسية أو القطار',
    whenToSayEn: 'Upon getting into the car, school bus, or train',
    virtueAr: 'حفظ وسلامة في الطريق وبركة طوال المشوار',
    virtueEn: 'Guarantees safety, divine protection, and joy in travel',
    iconName: 'car',
  },

  // 28. السفر
  {
    id: 'dua-travel-journey',
    category: 'travel',
    titleAr: 'دعاء السفر المبارك',
    titleEn: 'Travel Journey Supplication',
    arabicText: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
    transliteration: 'Allahumma inna nas-aluka fee safarina hadhal-birra wat-taqwa, wa minal-‘amali ma tarda, Allahumma hawwin ‘alayna safarana hadha watwi ‘anna bu’dah',
    translationEn: 'O Allah, we ask You on this journey of ours for goodness and piety, and for deeds that please You. O Allah, make this journey easy for us and shorten its distance.',
    whenToSayAr: 'عند الانطلاق في السفر للزيارة أو العطلة أو العمرة',
    whenToSayEn: 'When setting out on a travel journey or vacation',
    virtueAr: 'يكتب الله لك الأمان والصحبة الطيبة ويسهل عليك الطريق',
    virtueEn: 'Blesses the journey with divine safety and ease',
    iconName: 'airplane',
  },

  // 29. نزول المطر
  {
    id: 'dua-rain-start',
    category: 'nature',
    titleAr: 'دعاء نزول المطر',
    titleEn: 'When Rain Falls Supplication',
    arabicText: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    transliteration: 'Allahumma sayyiban nafi’a',
    translationEn: 'O Allah, may it be a beneficial and blessed rainfall.',
    whenToSayAr: 'أول ما نرى قطرات المطر تنزل من الغيوم',
    whenToSayEn: 'At the very first drops of falling rain',
    virtueAr: 'وقت نزول المطر وقت مبارك يستجاب فيه الدعاء',
    virtueEn: 'A prime time for accepted supplication and abundant mercy',
    iconName: 'rainy',
  },

  // 30. بعد المطر
  {
    id: 'dua-rain-stop',
    category: 'nature',
    titleAr: 'دعاء بعد توقف المطر',
    titleEn: 'After the Rain Supplication',
    arabicText: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ',
    transliteration: 'Mutirna bi-fadlillahi wa rahmatih',
    translationEn: 'We have been granted rain through Allah’s bounty and His mercy.',
    whenToSayAr: 'بعد سقاء الأرض وتوقف قطرات المطر',
    whenToSayEn: 'After the rain as thanksgiving to Allah',
    virtueAr: 'اعتراف بأن الغيث والرزق كله من الله وحده لا شريك له',
    virtueEn: 'Acknowledging that sustenance comes solely from Allah',
    iconName: 'leaf',
  },

  // 31. سماع الرعد
  {
    id: 'dua-thunder',
    category: 'nature',
    titleAr: 'دعاء سماع صوت الرعد',
    titleEn: 'Hearing Thunder Supplication',
    arabicText: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
    transliteration: 'Subhanal-ladhi yusabbihur-ra’du bi-hamdihi wal-mala’ikatu min kheefatih',
    translationEn: 'Glory be to Him whom thunder praises with His glorification, and the angels out of reverence of Him.',
    whenToSayAr: 'عند سماع دوي الرعد في السماء أثناء العواصف',
    whenToSayEn: 'Upon hearing thunder echoing across the sky',
    virtueAr: 'تسبيح الله مع كل الكائنات والشعور بالأمان والاطمئنان',
    virtueEn: 'Joining creation in glorifying Allah and finding serenity',
    iconName: 'flash',
  },

  // 32. هبوب الريح
  {
    id: 'dua-wind',
    category: 'nature',
    titleAr: 'دعاء عند هبوب الريح الشديدة',
    titleEn: 'Strong Wind Supplication',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ',
    transliteration: 'Allahumma inni as-aluka khayraha wa khayra ma ursilat bih, wa a’udhu bika min sharriha wa sharri ma ursilat bih',
    translationEn: 'O Allah, I ask You for its goodness and the good it was sent with, and seek refuge in You from its harm and the harm it was sent with.',
    whenToSayAr: 'عند اشتداد الرياح وتطاير الغبار في الجو',
    whenToSayEn: 'When strong winds or storms blow outside',
    virtueAr: 'الريح جند من جنود الله وسؤال الخير يمنع الضرر ويجلب النفع',
    virtueEn: 'Seeking divine goodness protects against harm from storms',
    iconName: 'cloudy',
  },

  // 33. عيادة المريض
  {
    id: 'dua-sick-visit',
    category: 'health',
    titleAr: 'دعاء عيادة المريض',
    titleEn: 'Visiting the Sick Supplication',
    arabicText: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ، أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    transliteration: 'La ba’sa tahurun in sha Allah. As-alullahal-‘Azeem Rabbal-‘Arshil-‘Azeem an yashfiyak',
    translationEn: 'No worry, it is a purification if Allah wills. I ask Allah the Almighty, Lord of the Magnificent Throne, to cure you.',
    whenToSayAr: 'عند زيارة مريض في المشفى أو عيادة قريب مريض في البيت',
    whenToSayEn: 'When visiting a sick person in the hospital or at home',
    virtueAr: 'يبعث الأمل والشفاء في نفس المريض ونيل أجر عيادة المريض العظيم',
    virtueEn: 'Brings healing, comfort, and angels pray for the visitor',
    iconName: 'medkit',
  },

  // 34. دعاء المريض لنفسه
  {
    id: 'dua-sick-self',
    category: 'health',
    titleAr: 'دعاء المريض إذا شعر بألم في جسده',
    titleEn: 'When Feeling Pain in Body',
    arabicText: 'بِسْمِ اللَّهِ (٣ مَرَّاتٍ) .. أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧ مَرَّاتٍ)',
    transliteration: 'Bismillah (3 times) .. A’udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir (7 times)',
    translationEn: 'Bismillah (3 times) .. I seek refuge in Allah and His power from the evil of what I find and fear (7 times).',
    whenToSayAr: 'وضع اليد اليمنى على مكان الألم في الجسد وترديد الدعاء',
    whenToSayEn: 'Place the right hand on the ache and recite faithfully',
    virtueAr: 'رقية نبوية صحيحة تنزل الشفاء والعافية بإذن الله',
    virtueEn: 'Authentic prophetic remedy that relieves pain by Allah’s will',
    iconName: 'fitness',
  },

  // 35. عند الغضب
  {
    id: 'dua-anger',
    category: 'manners',
    titleAr: 'دعاء عند الشعور بالغضب والضيق',
    titleEn: 'When Feeling Angry Supplication',
    arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'A’udhu billahi minash-shaytanir-rajim',
    translationEn: 'I seek refuge in Allah from the accursed Satan.',
    whenToSayAr: 'عند الشعور بالتوتر أو الرغبة في الصراخ أو الغضب',
    whenToSayEn: 'Whenever feeling irritated, annoyed, or about to lose temper',
    virtueAr: 'يطفئ جمر الغضب ويطرد الشيطان فوراً ويهدئ النفس',
    virtueEn: 'Extinguishes anger instantly and restores inner serenity',
    iconName: 'flame',
  },

  // 36. فزع النوم
  {
    id: 'dua-fear-night',
    category: 'sleep',
    titleAr: 'دعاء الفزع والقلق أثناء النوم',
    titleEn: 'When Waking Up Scared at Night',
    arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ',
    transliteration: 'A’udhu bi-kalimatil-lahit-tammati min ghadabihi wa ‘iqabihi wa sharri ‘ibadih, wa min hamazatish-shayeetani wa an yahduroon',
    translationEn: 'I seek refuge in the perfect words of Allah from His anger and punishment, from the evil of His servants, and from the whisperings of devils.',
    whenToSayAr: 'عند الاستيقاظ خائفاً في الليل أو الشعور بالقلق في الظلام',
    whenToSayEn: 'When waking up startled or feeling nervous in the dark',
    virtueAr: 'حفظ إلهي تام يبعد الخوف ويبعث الطمأنينة والأمان في القلب',
    virtueEn: 'Absolute divine comfort replacing fear with safety',
    iconName: 'shield',
  },

  // 37. الحلم المزعج
  {
    id: 'dua-bad-dream',
    category: 'sleep',
    titleAr: 'هدي النبي ﷺ عند رؤية كابوس أو حلم مزعج',
    titleEn: 'When Having a Bad Dream',
    arabicText: 'التَّفْلُ عَنْ يَسَارِهِ ثَلَاثًا، وَالتَّعَوُّذُ بِاللَّهِ مِنَ الشَّيْطَانِ، وَالتَّحَوُّلُ إِلَى الْجَنْبِ الآخَرِ',
    transliteration: 'Dry-spit to the left thrice, say: A’udhu billahi minash-shaytan, and turn to the other side',
    translationEn: 'Lightly puff to the left 3 times, seek refuge from Satan, and change sleeping side.',
    whenToSayAr: 'فور الاستيقاظ من منام مزعج ولا يخبر به أحداً',
    whenToSayEn: 'Immediately upon waking from a nightmare; keep it private',
    virtueAr: 'توجيه نبوي يمنع ضرر الكابوس ولا يضرك شيء بإذن الله',
    virtueEn: 'Prophetic protection guaranteeing that nightmares cannot harm',
    iconName: 'bed',
  },

  // 38. كفارة المجلس
  {
    id: 'dua-gathering-end',
    category: 'manners',
    titleAr: 'دعاء كفارة المجلس',
    titleEn: 'End of Gathering Supplication',
    arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subhanakallahumma wa bi-hamdik, ash-hadu an la ilaha illa ant, astaghfiruka wa atubu ilayk',
    translationEn: 'Glory is to You, O Allah, and praise. I bear witness that none has the right to be worshiped but You. I seek Your forgiveness and turn to You.',
    whenToSayAr: 'في ختام كل جلسة أو درس أو لقاء مع الأصدقاء والأهل',
    whenToSayEn: 'At the conclusion of any meeting, study circle, or friendly chat',
    virtueAr: 'يكفر الله به كل لغو وزلل ويختم المجلس بالمغفرة والنور',
    virtueEn: 'Erases careless words and seals the gathering with divine pardon',
    iconName: 'checkmark-done-circle',
  },

  // 39. شكر من صنع معروفاً
  {
    id: 'dua-thanking-people',
    category: 'manners',
    titleAr: 'دعاء شكر من صنع إليك معروفاً',
    titleEn: 'Thanking Someone Who Did You a Favor',
    arabicText: 'جَزَاكَ اللَّهُ خَيْرًا',
    transliteration: 'JazakAllahu khayran',
    translationEn: 'May Allah reward you with goodness.',
    whenToSayAr: 'عندما يقدم لك شخص مساعدة أو هدية أو كلمة طيبة',
    whenToSayEn: 'When anyone gifts you, helps you, or treats you kindly',
    virtueAr: 'أبلغ الثناء وشكر عظيم يجمع خير الدنيا والآخرة لمن ساعدك',
    virtueEn: 'The most complete expression of Islamic gratitude',
    iconName: 'gift',
  },

  // 40. رؤية شيء جميل
  {
    id: 'dua-seeing-beauty',
    category: 'manners',
    titleAr: 'الذكر عند رؤية شيء جميل يعجبك',
    titleEn: 'When Admiring Something Beautiful',
    arabicText: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ، تَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ',
    transliteration: 'Masha’Allahu la quwwata illa billah, tabarakallahu ahsanul-khaliqeen',
    translationEn: 'What Allah wills; there is no power except with Allah. Blessed is Allah, the best of creators.',
    whenToSayAr: 'عند رؤية طفل لطيف، لعبة جميلة، أو حديقة بديعة',
    whenToSayEn: 'When seeing a cute baby, lovely toy, or lush garden',
    virtueAr: 'يحفظ النعمة من العين والحسد ويبارك فيها لصاحبها',
    virtueEn: 'Protects the blessing from envy and multiplies barakah',
    iconName: 'star',
  },

  // 41. الحب في الله
  {
    id: 'dua-love-for-allah',
    category: 'manners',
    titleAr: 'دعاء من قال لك: إني أحبك في الله',
    titleEn: 'Reply When Someone Loves You for Allah',
    arabicText: 'أَحَبَّكَ الَّذِي أَحْبَبْتَنِي لَهُ',
    transliteration: 'Ahabbakal-ladhi ahbabtani lah',
    translationEn: 'May He for whose sake you love me, also love you.',
    whenToSayAr: 'عندما يعبر لك صديق أو أخ في الله عن محبته الأخوية',
    whenToSayEn: 'When a friend tells you: "I love you for the sake of Allah"',
    virtueAr: 'ينال المتحابان في الله ظل عرش الرحمن يوم القيامة',
    virtueEn: 'Mutual love for Allah’s sake earns shade under His Throne',
    iconName: 'heart-half',
  },

  // 42. سيد أذكار الصباح
  {
    id: 'dua-morning-master',
    category: 'morning',
    titleAr: 'ذكر الصباح الأساسي',
    titleEn: 'Core Morning Remembrance',
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli shay’in qadeer',
    translationEn: 'We have reached the morning and the kingdom belongs to Allah, all praise is for Allah. None has the right to be worshiped but Allah alone without partner.',
    whenToSayAr: 'بعد صلاة الفجر ومع شروق الشمس كل صباح',
    whenToSayEn: 'After Fajr prayer and with dawn every morning',
    virtueAr: 'استفتاح اليوم بالتوحيد والحفظ والبركة في كل عمل',
    virtueEn: 'Opens the day with Tawheed and wraps your hours in barakah',
    iconName: 'sunny-outline',
  },

  // 43. شكر النعمة كل صباح
  {
    id: 'dua-morning-gratitude',
    category: 'morning',
    titleAr: 'دعاء شكر نعمة الصباح',
    titleEn: 'Morning Gratitude Supplication',
    arabicText: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: 'Allahumma ma asbaha bee min ni’matin aw bi-ahadin min khalqika fa-minka wahdaka la shareeka lak, falakal-hamdu wa lakash-shukr',
    translationEn: 'O Allah, whatever blessing has reached me or any of Your creation this morning is from You alone, without partner. To You is all praise and gratitude.',
    whenToSayAr: 'كل صباح عند تذكر نعم الصحة والأهل والأمان',
    whenToSayEn: 'Every morning reflecting on health, family, and safety',
    virtueAr: 'من قالها حين يصبح فقد أدى شكر يومه كاملاً!',
    virtueEn: 'Whoever recites it in the morning fulfills the day’s gratitude!',
    iconName: 'ribbon',
  },

  // 44. سيد الاستغفار المبسط
  {
    id: 'dua-sayyid-istighfar',
    category: 'daily',
    titleAr: 'سيد الاستغفار للأبطال الصغار',
    titleEn: 'The Master of Forgiveness Supplication',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana ‘abduk, wa ana ‘ala ‘ahdika wa wa’dika mastata’t, a’udhu bika min sharri ma sana’t, abu’u laka bi-ni’matika ‘alayya wa abu’u bi-dhanbi faghfir lee fa-innahu la yaghfirudh-dhunooba illa Ant',
    translationEn: 'O Allah, You are my Lord, none has the right to be worshiped but You. You created me and I am Your servant. I acknowledge Your favors upon me and confess my sin, so forgive me for none forgives sins except You.',
    whenToSayAr: 'مرة صباحاً ومرة مساءً كل يوم',
    whenToSayEn: 'Once in the morning and once in the evening daily',
    virtueAr: 'من قالها موقناً بها ومات في يومه أو ليلته دخل الجنة بإذن الله!',
    virtueEn: 'Whoever says it with conviction is promised Paradise by Allah!',
    iconName: 'diamond',
  },

  // 45. إفطار الصائم
  {
    id: 'dua-iftar',
    category: 'food',
    titleAr: 'دعاء إفطار الصائم في رمضان ويوم الاثنين والخميس',
    titleEn: 'Fasting Iftar Supplication',
    arabicText: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahabadh-dhama’u wabtallatil-‘urooqu wa thabatal-ajru in sha Allah',
    translationEn: 'The thirst has vanished, the veins are moistened, and the reward is confirmed if Allah wills.',
    whenToSayAr: 'عند أذان المغرب وتناول التمر والماء للإفطار',
    whenToSayEn: 'At sunset upon breaking the fast with dates and water',
    virtueAr: 'دعوة الصائم عند إفطاره لا ترد وفرحة عظيمة بثواب الصيام',
    virtueEn: 'The fasting person’s prayer at iftar is never rejected',
    iconName: 'moon-outline',
  },

  // 46. دخول السوق
  {
    id: 'dua-entering-market',
    category: 'travel',
    titleAr: 'دعاء دخول السوق والمجمع التجاري',
    titleEn: 'Entering the Market Supplication',
    arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu, yuhyee wa yumeetu wa Huwa hayyun la yamoot, bi-yadihil-khayru wa Huwa ‘ala kulli shay’in qadeer',
    translationEn: 'None has the right to be worshiped but Allah alone without partner, His is the kingdom and His is the praise, He gives life and causes death, and He is living and never dies.',
    whenToSayAr: 'عند الدخول إلى المتجر أو السوق المزدحم مع الوالدين',
    whenToSayEn: 'When entering the mall or grocery store with parents',
    virtueAr: 'كتب الله له ألف ألف حسنة (مليون حسنة) ومحا عنه ألف ألف سيئة!',
    virtueEn: 'Allah records one million rewards and forgives one million sins!',
    iconName: 'cart',
  },

  // 47. صياح الديك
  {
    id: 'dua-rooster-crow',
    category: 'nature',
    titleAr: 'الذكر عند سماع صياح الديك',
    titleEn: 'When Hearing a Rooster Crow',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allahumma inni as-aluka min fadlik',
    translationEn: 'O Allah, I ask You from Your infinite bounty.',
    whenToSayAr: 'عند سماع صوت الديك يصيح في الصباح الباكر',
    whenToSayEn: 'Upon hearing a rooster crowing in the morning',
    virtueAr: 'الديك يصيح لرؤيته الملائكة الكرام فالدعاء في حضورهم مستجاب',
    virtueEn: 'Roosters see angels; supplications in their presence are accepted',
    iconName: 'alarm',
  },

  // 48. نهيق الحمار ونباح الكلب
  {
    id: 'dua-donkey-bray',
    category: 'nature',
    titleAr: 'التعوذ عند سماع نهيق الحمار أو نباح الكلب',
    titleEn: 'When Hearing a Donkey or Barking Dog',
    arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'A’udhu billahi minash-shaytanir-rajim',
    translationEn: 'I seek refuge in Allah from the accursed Satan.',
    whenToSayAr: 'عند سماع صوت نهيق حمار أو نباح كلاب في الليل',
    whenToSayEn: 'When hearing a donkey braying or dogs barking at night',
    virtueAr: 'الحيوانات ترى ما لا يراه البشر، والتعوذ بالله يحصن من وساوس الشيطان',
    virtueEn: 'Seeking refuge shields against unseen disturbances at night',
    iconName: 'volume-mute',
  },

  // 49. رؤية الهلال الجديد
  {
    id: 'dua-new-crescent',
    category: 'nature',
    titleAr: 'دعاء رؤية الهلال الجديد في بداية الشهر الهجري',
    titleEn: 'Seeing the New Crescent Supplication',
    arabicText: 'اللَّهُ أَكْبَرُ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، وَالتَّوْفِيقِ لِمَا تُحِبُّ وَتَرْضَىٰ، رَبُّنَا وَرَبُّكَ اللَّهُ',
    transliteration: 'Allahu Akbar, Allahumma ahillahu ‘alayna bil-amni wal-iman, was-salamati wal-Islam, wat-tawfeeqi lima tuhibbu wa tarda, Rabbuna wa Rabbukallah',
    translationEn: 'Allah is the Greatest! O Allah, let this crescent dawn upon us with security and faith, safety and Islam, and guidance to what You love and are pleased with. Our Lord and your Lord is Allah.',
    whenToSayAr: 'أول ليلة من الشهر الهجري الجديد عند مراقبة هلال السماء',
    whenToSayEn: 'On the first evening of each Hijri month seeing the crescent',
    virtueAr: 'بداية شهر مبارك يعمه الأمن والإيمان والسكينة في قلوبنا',
    virtueEn: 'Inaugurates the new month with divine safety and iman',
    iconName: 'contrast',
  },

  // 50. طلب الجنة والاستعاذة من النار
  {
    id: 'dua-jannah-ask',
    category: 'daily',
    titleAr: 'دعاء طلب الفردوس الأعلى والنجاة من النار',
    titleEn: 'Asking for Paradise & Refuge from Hellfire',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ، وَأَعُوذُ بِكَ مِنَ النَّارِ',
    transliteration: 'Allahumma inni as-alukal-Jannah, wa a’udhu bika minan-Nar',
    translationEn: 'O Allah, I ask You for Paradise, and I seek refuge in You from the Fire.',
    whenToSayAr: 'في كل صلاة وسجود وخلوة مباركة مع الله (٣ مرات)',
    whenToSayEn: 'In every prayer, prostration, and quiet moment (3 times)',
    virtueAr: 'إذا قالها المسلم ٣ مرات قالت الجنة: اللهم أدخله الجنة! وقالت النار: اللهم أجره من النار!',
    virtueEn: 'Said 3 times, Jannah cries: O Allah admit him! And Hell cries: O Allah protect him!',
    iconName: 'trophy',
  },
];
