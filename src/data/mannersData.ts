// Good Manners Town (مدينة الأخلاق)
// Adab & Ethics interactive scenarios linked to Quran and Sunnah
import { EXPANDED_MANNERS_50 } from './mannersData50';

export interface MannerChoice {
  id: string;
  textAr: string;
  textEn: string;
  isPositive: boolean;
  consequenceAr: string;
  consequenceEn: string;
}

export interface MannerScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  situationAr: string;
  situationEn: string;
  choices: MannerChoice[];
  supportingProof: {
    type: 'ayah' | 'hadith';
    textAr: string;
    translationEn: string;
    referenceAr: string;
    referenceEn: string;
  };
}

export interface MannerBuilding {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  iconName: string;
  color: string;
  scenarios: MannerScenario[];
  weeklyPledgeAr: string;
  weeklyPledgeEn: string;
  badgeId: string;
}

const ORIGINAL_MANNERS_BUILDINGS: MannerBuilding[] = [
  {
    id: 'honesty-hall',
    nameAr: 'دار الصدق والأمانة',
    nameEn: 'Hall of Truth & Trust',
    subtitleAr: 'المسلم لا يكذب ويؤدي الأمانات',
    subtitleEn: 'A believer always speaks truth and guards trust',
    iconName: 'shield-checkmark',
    color: '#059669',
    weeklyPledgeAr: 'أتعهد بأن أكون صادقاً في كل كلامي ولا أقول إلا الحق.',
    weeklyPledgeEn: 'I promise to speak truthfully in every situation and never deceive.',
    badgeId: 'badge-truthful',
    scenarios: [
      {
        id: 'h1',
        titleAr: 'النقود في فناء المدرسة',
        titleEn: 'Money in the Playground',
        situationAr: 'وجدت ورقة نقدية سقطت من أحد زملائك في الملعب ولا يراك أحد.',
        situationEn: 'You found money that dropped from a classmate in the yard and no one is watching.',
        choices: [
          {
            id: 'c1',
            textAr: 'آخذها فوراً وأسلمها للمعلم أو أبحث عن صاحبها لإعادتها',
            textEn: 'Take it and immediately hand it to the teacher to find the owner',
            isPositive: true,
            consequenceAr: 'ما شاء الله! هذه الأمانة الحقيقية التي يحبها الله وتجعلك بطلاً أميناً في عيون الجميع.',
            consequenceEn: 'Masha’Allah! True trust means doing what is right even when no one is looking.',
          },
          {
            id: 'c2',
            textAr: 'أضعها في جيبي وأشتري بها حلوى',
            textEn: 'Put it in my pocket to buy candy',
            isPositive: false,
            consequenceAr: 'المال الذي ليس لنا لا يجوز أخذه، وصاحبه حزين عليه الآن. الأمانة تجلب بركة أعظم من الحلوى!',
            consequenceEn: 'Money that isn’t ours brings no blessing. Returning it brings pure joy to the owner!',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'أَدِّ الْأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ وَلَا تَخُنْ مَنْ خَانَكَ',
          translationEn: 'Discharge the trust to him who has entrusted you, and do not betray him who betrays you.',
          referenceAr: 'سنن أبي داود والترمذي',
          referenceEn: 'Sunan Abi Dawud & Tirmidhi',
        },
      },
    ],
  },
  {
    id: 'parents-palace',
    nameAr: 'قصر بر الوالدين',
    nameEn: 'Palace of Honoring Parents',
    subtitleAr: 'الجنة تحت أقدام الأمهات ورضا الله في رضا الوالد',
    subtitleEn: 'Paradise lies under mothers’ feet, and Allah’s pleasure in parents’ pleasure',
    iconName: 'heart',
    color: '#E11D48',
    weeklyPledgeAr: 'أتعهد بطاعة والديّ بابتسامة وأقول لهما دائماً: حفظكما الله.',
    weeklyPledgeEn: 'I promise to obey my parents with a smile and pray for their happiness.',
    badgeId: 'badge-dutiful',
    scenarios: [
      {
        id: 'p1',
        titleAr: 'نداء الأم أثناء اللعب',
        titleEn: 'Mother’s Call During Playtime',
        situationAr: 'كنت مستمتعاً جداً بلعبتك المفضلة، فنادتك أمك لتساعدها في إحضار كوب ماء.',
        situationEn: 'You were engrossed in your favorite game when mom gently called you to bring her a cup of water.',
        choices: [
          {
            id: 'c1',
            textAr: 'أوقف اللعبة بابتسامة وأجيبها مسرعاً: "حاضر يا أمي الحبيبة!"',
            textEn: 'Pause the game cheerfully and answer: "Coming right away, beloved mother!"',
            isPositive: true,
            consequenceAr: 'أنت بطل رائع! إجابة الوالدين ببر وسرور هي من أحب الأعمال إلى الله تعالى.',
            consequenceEn: 'Splendid! Answering parents with eager warmth is one of the highest beloved deeds to Allah.',
          },
          {
            id: 'c2',
            textAr: 'أتأخر وأتأفف بصوت عالٍ لأنني ألعب',
            textEn: 'Groan loudly and delay answering because of the game',
            isPositive: false,
            consequenceAr: 'نهانا الله عن التأفف مع الوالدين وقال: "فلا تقل لهما أف ولا تنهرهما وقل لهما قولاً كريماً".',
            consequenceEn: 'Allah commanded us never to utter even a sigh of frustration to our parents, but to speak with honor.',
          },
        ],
        supportingProof: {
          type: 'ayah',
          textAr: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًا',
          translationEn: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment.',
          referenceAr: 'سورة الإسراء: 23',
          referenceEn: 'Surah Al-Isra: 23',
        },
      },
    ],
  },
  {
    id: 'sharing-center',
    nameAr: 'واحة الكرم والمشاركة',
    nameEn: 'Oasis of Sharing & Generosity',
    subtitleAr: 'المؤمن يحب لأخيه ما يحب لنفسه',
    subtitleEn: 'A believer loves for others what they love for themselves',
    iconName: 'gift',
    color: '#D97706',
    weeklyPledgeAr: 'أتعهد بمشاركة ألعابي وطعامي مع أصدقائي وإخوتي بحب.',
    weeklyPledgeEn: 'I promise to share my toys and snacks with siblings and friends joyfully.',
    badgeId: 'badge-generous',
    scenarios: [
      {
        id: 's1',
        titleAr: 'شطيرة الفسحة',
        titleEn: 'School Snack Sharing',
        situationAr: 'رأيت صديقك قد نسي طعام غدائه اليوم ويشعر بالجوع في وقت الفسحة.',
        situationEn: 'You noticed a friend forgot his lunchbox today and feels hungry during break.',
        choices: [
          {
            id: 'c1',
            textAr: 'أقسم شطيرتي نصفين وأهديه النصف بابتسامة: "تفضل يا صديقي!"',
            textEn: 'Split my sandwich in half and offer it with a smile: "Here you go, my friend!"',
            isPositive: true,
            consequenceAr: 'هذا خلق الصحابة الكرام الإيثار! طعام الاثنين يكفي الثلاثة وتحل البركة العظيمة.',
            consequenceEn: 'This is the noble spirit of generosity! Sharing multiplies joy and Allah’s blessings.',
          },
          {
            id: 'c2',
            textAr: 'آكل كل طعامي أمامه بمفردي',
            textEn: 'Eat everything quickly in front of him alone',
            isPositive: false,
            consequenceAr: 'الأجمل دائماً أن نشارك من حولنا ونشعر بهم كما علمنا رسول الله ﷺ.',
            consequenceEn: 'The beloved Prophet ﷺ taught us that a believer is never satisfied while his companion goes hungry.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
          translationEn: 'None of you truly believes until he loves for his brother what he loves for himself.',
          referenceAr: 'صحيح البخاري ومسلم',
          referenceEn: 'Sahih al-Bukhari & Muslim',
        },
      },
    ],
  },
  {
    id: 'cleanliness-corner',
    nameAr: 'حديقة النظافة والطهارة',
    nameEn: 'Garden of Cleanliness & Purity',
    subtitleAr: 'الطهور شطر الإيمان ونظافة المسلم مظهر جمال',
    subtitleEn: 'Purity is half of faith and cleanliness is beauty',
    iconName: 'sparkles',
    color: '#0284C7',
    weeklyPledgeAr: 'أتعهد بالمحافظة على نظافة غرفتي وملابسي ومدرستي ووضوئي.',
    weeklyPledgeEn: 'I promise to keep my room, clothes, school, and body clean and tidy.',
    badgeId: 'badge-clean',
    scenarios: [
      {
        id: 'cl1',
        titleAr: 'منديل ورقي في الحديقة',
        titleEn: 'Paper Wrapper in the Park',
        situationAr: 'أكلت قطعة بسكويت في الحديقة العامة وبقي غلافها في يدك وسلة المهملات على بعد خطوات.',
        situationEn: 'You finished a snack in the park with a wrapper in hand and a trash bin a few steps away.',
        choices: [
          {
            id: 'c1',
            textAr: 'أمشي بضع خطوات وألقيها في سلة المهملات لأترك المكان نظيفاً وجميلاً',
            textEn: 'Walk the few steps and place it cleanly in the bin',
            isPositive: true,
            consequenceAr: 'أحسنت! إماطة الأذى عن الطريق صدقة، والله تعالى جميل يحب الجمال.',
            consequenceEn: 'Excellent! Removing waste from pathways is an act of charity, and Allah loves beauty.',
          },
          {
            id: 'c2',
            textAr: 'أرميها على العشب الأخضر وأمشي',
            textEn: 'Toss it onto the grass and walk away',
            isPositive: false,
            consequenceAr: 'النظافة عنوان المسلم؛ رمي القمامة يؤذي النباتات والحيوانات والناس.',
            consequenceEn: 'Cleanliness defines a Muslim; littering harms nature and others.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ',
          translationEn: 'Removing a harmful object from the road is a charity.',
          referenceAr: 'صحيح البخاري ومسلم',
          referenceEn: 'Sahih al-Bukhari & Muslim',
        },
      },
    ],
  },
  {
    id: 'respect-elders',
    nameAr: 'صرح احترام الكبير والعطف على الصغير',
    nameEn: 'Hall of Respect & Compassion',
    subtitleAr: 'ليس منا من لم يرحم صغيرنا ويوقر كبيرنا',
    subtitleEn: 'He is not one of us who does not show mercy to our young and honor our elders',
    iconName: 'people',
    color: '#8B5CF6',
    weeklyPledgeAr: 'أتعهد بتقديم الكبير في المجلس والحديث، والعطف على الصغار ومساعدتهم.',
    weeklyPledgeEn: 'I promise to honor elders first and be kind and helpful to younger kids.',
    badgeId: 'badge-respect',
    scenarios: [
      {
        id: 're1',
        titleAr: 'مقعد الحافلة المزدحمة',
        titleEn: 'Seat on the Bus',
        situationAr: 'أنت جالس في الحافلة أو المترو، وصعد رجل كبير في السن أو جد متعب يبحث عن مقعد.',
        situationEn: 'You are seated on the bus when an elderly gentleman steps in looking tired and needing a seat.',
        choices: [
          {
            id: 'c1',
            textAr: 'أقف فوراً بابتسامة وأقول: "تفضل يا جدي، اجلس مكاني!"',
            textEn: 'Stand up promptly with warmth: "Please sit here, grandfather!"',
            isPositive: true,
            consequenceAr: 'بارك الله فيك! توقير ذي الشيبة المسلم من إجلال الله تعالى وينال صاحبه دعاءً مباركاً.',
            consequenceEn: 'May Allah bless you! Honoring the elderly is part of honoring Allah.',
          },
          {
            id: 'c2',
            textAr: 'أتظاهر بأنني نائم أو أنظر من النافذة لأبقى جالساً',
            textEn: 'Pretend to sleep or stare outside to keep the seat',
            isPositive: false,
            consequenceAr: 'الشاب المسلم يتميز بالمروءة والمبادرة في مساعدة الكبار وإيثارهم.',
            consequenceEn: 'A kind Muslim is always attentive and offers comfort to those older and weaker.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيرَنَا، وَيُوَقِّرْ كَبِيرَنَا',
          translationEn: 'He is not one of us who does not show mercy to our youngsters and respect to our elders.',
          referenceAr: 'سنن الترمذي - صحيح',
          referenceEn: 'Sunan al-Tirmidhi (Sahih)',
        },
      },
    ],
  },
  {
    id: 'anger-control',
    nameAr: 'برج الحلم وضبط النفس',
    nameEn: 'Tower of Calm & Self-Control',
    subtitleAr: 'ليس الشديد بالصرعة وإنما الشديد الذي يملك نفسه عند الغضب',
    subtitleEn: 'The truly strong person is the one who controls anger',
    iconName: 'water',
    color: '#0D9488',
    weeklyPledgeAr: 'أتعهد بأن أتنفس بهدوء وأتعوذ بالله من الشيطان الرجيم عندما أشعر بالغضب.',
    weeklyPledgeEn: 'I promise to seek refuge in Allah from Shaytan and remain gentle when provoked.',
    badgeId: 'badge-calm',
    scenarios: [
      {
        id: 'ac1',
        titleAr: 'سقوط برج المكعبات',
        titleEn: 'The Block Tower Fall',
        situationAr: 'قضيت وقتاً طويلاً في بناء قلعة من المكعبات، فمر أخوك الصغير دون قصد وأسقطها.',
        situationEn: 'You spent hours building a tower of blocks, and your younger sibling accidentally bumped and knocked it down.',
        choices: [
          {
            id: 'c1',
            textAr: 'أتعوذ بالله من الشيطان الرجيم، وأبتسم لأخي قائلاً: "لا بأس يا أخي، سنبنيها معاً من جديد!"',
            textEn: 'Say "A’udhu billah", smile, and tell my sibling: "It is okay! Let us rebuild it even better!"',
            isPositive: true,
            consequenceAr: 'أنت البطل القوي الحقيقي! كظم الغيظ والحلم يرفع قدرك في الدنيا والآخرة ويدخل السرور.',
            consequenceEn: 'You are the truly strong hero! Controlling anger earns immense reward and love from Allah.',
          },
          {
            id: 'c2',
            textAr: 'أصرخ بغضب وأكسر لعبته انتقاماً',
            textEn: 'Scream loudly and smash his toys in revenge',
            isPositive: false,
            consequenceAr: 'الغضب جمرة من الشيطان يندم صاحبها سريعاً، وخيرنا من يعفو ويصلح.',
            consequenceEn: 'Uncontrolled anger only causes regrets; forgiveness and patience always win.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
          translationEn: 'The strong is not the one who overcomes the people by his strength, but the one who controls himself while in anger.',
          referenceAr: 'صحيح البخاري ومسلم',
          referenceEn: 'Sahih al-Bukhari & Muslim',
        },
      },
    ],
  },
  {
    id: 'neighbor-kindness',
    nameAr: 'واحة الإحسان إلى الجار',
    nameEn: 'Oasis of Neighborly Love',
    subtitleAr: 'ما زال جبريل يوصيني بالجار حتى ظننت أنه سيورثه',
    subtitleEn: 'Jibril kept enjoining good treatment of neighbors until I thought he would give them inheritance',
    iconName: 'home',
    color: '#F59E0B',
    weeklyPledgeAr: 'أتعهد بألا أزعج جيراني بالأصوات العالية وألقي عليهم السلام وأشاركهم الخير.',
    weeklyPledgeEn: 'I promise never to disturb neighbors with noise, greet them cheerfully, and share food.',
    badgeId: 'badge-neighbor',
    scenarios: [
      {
        id: 'nk1',
        titleAr: 'اللعب في وقت الظهيرة',
        titleEn: 'Noon Playtime',
        situationAr: 'أنت تلعب بالكرة في ممر البيت أو بجوار نافذة الجار المريض وقت قيلولته.',
        situationEn: 'You are playing with a ball in the hallway near your elderly neighbor’s window during rest time.',
        choices: [
          {
            id: 'c1',
            textAr: 'أنقل اللعب إلى الحديقة أو ألعب بهدوء احتراماً لراحة جاري',
            textEn: 'Move play outside to the park and keep noise low out of respect for neighbors',
            isPositive: true,
            consequenceAr: 'رائع جداً! كف الأذى عن الجار وحفظ راحته علامة من علامات الإيمان بالله واليوم الآخر.',
            consequenceEn: 'Splendid! Protecting your neighbor from noise and annoyance is a vital branch of faith.',
          },
          {
            id: 'c2',
            textAr: 'أستمر بالضرب على الجدران بقوة ولا أبالي',
            textEn: 'Keep bouncing loudly against the shared walls without care',
            isPositive: false,
            consequenceAr: 'حذرنا النبي ﷺ من إيذاء الجيران وقال: "لا يدخل الجنة من لا يأمن جاره بوائقه".',
            consequenceEn: 'The Prophet ﷺ warned that a believer must always ensure neighbors feel peaceful and safe.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ',
          translationEn: 'Whoever believes in Allah and the Last Day, let him honor his neighbor.',
          referenceAr: 'صحيح البخاري ومسلم',
          referenceEn: 'Sahih al-Bukhari & Muslim',
        },
      },
    ],
  },
  {
    id: 'animal-compassion',
    nameAr: 'محمية الرفق بالحيوان والبيئة',
    nameEn: 'Sanctuary of Animal Mercy & Nature',
    subtitleAr: 'في كل كبد رطبة أجر',
    subtitleEn: 'There is a reward for serving any living being',
    iconName: 'paw',
    color: '#10B981',
    weeklyPledgeAr: 'أتعهد بالعطف على القطط والطيور وسقايتها، والمحافظة على الأزهار والأشجار.',
    weeklyPledgeEn: 'I promise to be gentle with animals, feed birds, and protect plants and trees.',
    badgeId: 'badge-mercy',
    scenarios: [
      {
        id: 'an1',
        titleAr: 'القطة العطشى في يوم حار',
        titleEn: 'Thirsty Kitten on a Hot Day',
        situationAr: 'رأيت قطة صغيرة تحت شجرة تلهث وتبحث عن ماء في حرارة الصيف.',
        situationEn: 'You spotted a little kitten panting under a tree looking for water in the summer heat.',
        choices: [
          {
            id: 'c1',
            textAr: 'أملأ إناءً صغيراً بماء نظيف وأضعه بهدوء قربها لتشرب',
            textEn: 'Fill a small dish with cool water and place it gently nearby for it to drink',
            isPositive: true,
            consequenceAr: 'يا لك من رحيم! أخبرنا النبي ﷺ عن رجل غفر الله له كل ذنوبه لأنه سقى كلباً كاد يموت من العطش.',
            consequenceEn: 'How merciful! The Prophet ﷺ told of a person forgiven all sins simply for quenching an animal’s thirst.',
          },
          {
            id: 'c2',
            textAr: 'أطاردها بحجر لأخيفها',
            textEn: 'Chase it with stones to scare it away',
            isPositive: false,
            consequenceAr: 'المسلم قلبه رقيق يرحم الضعفاء، والراحمون يرحمهم الرحمن تبارك وتعالى.',
            consequenceEn: 'A Muslim’s heart is full of tender mercy; Allah extends His mercy to the compassionate.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ',
          translationEn: 'There is a reward for doing good to every living being.',
          referenceAr: 'صحيح البخاري ومسلم',
          referenceEn: 'Sahih al-Bukhari & Muslim',
        },
      },
    ],
  },
  {
    id: 'noble-speech',
    nameAr: 'منتدى الكلمة الطيبة وحفظ اللسان',
    nameEn: 'Forum of Pure Speech & Gentle Words',
    subtitleAr: 'وقولوا للناس حسناً.. والكلمة الطيبة صدقة',
    subtitleEn: 'Speak good words to people.. and a good word is charity',
    iconName: 'chatbubbles',
    color: '#6366F1',
    weeklyPledgeAr: 'أتعهد بأن أنطق بأطيب الكلمات، ولا أسخر من أحد ولا أغتاب أحداً.',
    weeklyPledgeEn: 'I promise to speak kindly, never mock others, and keep my tongue pure.',
    badgeId: 'badge-speech',
    scenarios: [
      {
        id: 'ns1',
        titleAr: 'سخرية في الفصل',
        titleEn: 'Laughter in Class',
        situationAr: 'أخطأ زميلك في قراءة جملة أثناء الدرس، وبدأ بعض الطلاب بالضحك عليه وخجل زميلك.',
        situationEn: 'A classmate misread a word during class, and some kids giggled, making him feel embarrassed.',
        choices: [
          {
            id: 'c1',
            textAr: 'لا أضحك أبداً، وأشجعه بعد الدرس قائلاً: "قراءتك جميلة وتحسنت كثيراً يا بطل!"',
            textEn: 'Never join in mocking, and encourage him after class: "You read well and did great!"',
            isPositive: true,
            consequenceAr: 'بارك الله فيك! أدخلت السرور على قلب أخيك، وجبر الخواطر من أعظم شعب الإيمان.',
            consequenceEn: 'Blessed deed! Comforting a heart and speaking words of courage is great charity.',
          },
          {
            id: 'c2',
            textAr: 'أضحك معهم وأردد اللفظ الخاطئ',
            textEn: 'Laugh along and repeat the mispronounced word teasingly',
            isPositive: false,
            consequenceAr: 'قال تعالى: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ". السخرية تجرح القلوب.',
            consequenceEn: 'The Quran commands believers never to mock or ridicule others; kind words preserve dignity.',
          },
        ],
        supportingProof: {
          type: 'ayah',
          textAr: 'وَقُولُوا۟ لِلنَّاسِ حُسْنًۭا',
          translationEn: 'And speak good words to people.',
          referenceAr: 'سورة البقرة: 83',
          referenceEn: 'Surah Al-Baqarah: 83',
        },
      },
    ],
  },
  {
    id: 'gratitude-gardens',
    nameAr: 'حدائق الشكر والحمد',
    nameEn: 'Gardens of Gratitude & Praise',
    subtitleAr: 'لئن شكرتم لأزيدنكم',
    subtitleEn: 'If you are grateful, I will surely increase you',
    iconName: 'sunny',
    color: '#EC4899',
    weeklyPledgeAr: 'أتعهد بأن أقول: "الحمد لله" على كل نعمة، وأقول: "جزاك الله خيراً" لمن يسدي إلي معروفاً.',
    weeklyPledgeEn: 'I promise to say "Alhamdulillah" for every blessing and "Jazakallahu Khairan" to anyone who helps me.',
    badgeId: 'badge-grateful',
    scenarios: [
      {
        id: 'gg1',
        titleAr: 'طعام الغداء في البيت',
        titleEn: 'Family Lunch Time',
        situationAr: 'أعدت والدتك وجبة طعام بعد تعب، ولم يكن صنفك المفضل في هذا اليوم.',
        situationEn: 'Mom cooked a wholesome meal after hard work, but it was not your number-one favorite food today.',
        choices: [
          {
            id: 'c1',
            textAr: 'آكل شاكراً وأقول لأمي بابتسامة: "تسلم يداكِ يا أمي، والحمد لله على النعمة!"',
            textEn: 'Eat with gratitude, smile and thank mom warmly: "Thank you mom, Alhamdulillah for this blessing!"',
            isPositive: true,
            consequenceAr: 'اقتديت برسول الله ﷺ؛ ما عاب طعاماً قط، إن اشتهاه أكله وإن كرهه تركه دون أن يجرح أحداً.',
            consequenceEn: 'You followed the beautiful Sunnah! The Prophet ﷺ never criticized food; he thanked and appreciated.',
          },
          {
            id: 'c2',
            textAr: 'أدفع الصحن وأتذمر بصوت غاضب: "لا أحب هذا الطعام!"',
            textEn: 'Push the plate away frowning and complain loudly',
            isPositive: false,
            consequenceAr: 'النعم تدوم بالشكر، والتذمر يحزن الأم وينافي أدب المسلم مع نعم الله.',
            consequenceEn: 'Gratitude preserves blessings. Complaining hurts mother’s feelings and forgets Allah’s gifts.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'مَا عَابَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ طَعَامًا قَطُّ؛ إِنِ اشْتَهَاهُ أَكَلَهُ، وَإِلَّا تَرَكَهُ',
          translationEn: 'The Prophet ﷺ never found fault with any food; if he liked it, he ate it; if he disliked it, he left it.',
          referenceAr: 'صحيح البخاري ومسلم',
          referenceEn: 'Sahih al-Bukhari & Muslim',
        },
      },
    ],
  },
  {
    id: 'humility-haven',
    nameAr: 'دار التواضع ولين الجانب',
    nameEn: 'Haven of Humility & Modesty',
    subtitleAr: 'وما تواضع أحد لله إلا رفعه الله',
    subtitleEn: 'No one humbles himself for Allah except that Allah elevates him',
    iconName: 'leaf',
    color: '#059669',
    weeklyPledgeAr: 'أتعهد بألا أتكبر على أحد من أصدقائي وأن أكون متواضعاً ومحباً للجميع.',
    weeklyPledgeEn: 'I promise never to boast or look down on others, remaining humble and kind.',
    badgeId: 'badge-humble',
    scenarios: [
      {
        id: 'hh1',
        titleAr: 'الدرجة الكاملة في الامتحان',
        titleEn: 'Top Score in the Quiz',
        situationAr: 'حصلت على أعلى درجة في الفصل وزميلك المقرب لم يوفق في الامتحان وحزن.',
        situationEn: 'You got the highest score in the quiz, while your close friend struggled and felt sad.',
        choices: [
          {
            id: 'c1',
            textAr: 'أشكر الله بتواضع، وأجلس بجانب زميلي برفق: "أنت ذكي وسأراجع معك الدروس لننجح معاً!"',
            textEn: 'Thank Allah humbly and sit by my friend: "You are smart, let us study together next time!"',
            isPositive: true,
            consequenceAr: 'ما أروع تواضعك! التواضع يرفعك عند الله وعند الناس، والغرور يذهب البركة.',
            consequenceEn: 'Masha’Allah! Humility elevates your rank with Allah and people, while bragging destroys barakah.',
          },
          {
            id: 'c2',
            textAr: 'أتباهى بدرجتي أمامه وأقول: "أنا أذكى منك بكثير!"',
            textEn: 'Boast about my top mark in front of him and say: "I am way smarter than you!"',
            isPositive: false,
            consequenceAr: 'نهانا الله عن التكبر، والنبي ﷺ قال: "لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر".',
            consequenceEn: 'The Prophet ﷺ taught that no one with even an atom’s weight of pride in their heart enters Jannah.',
          },
        ],
        supportingProof: {
          type: 'hadith',
          textAr: 'وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ',
          translationEn: 'No one humbles himself before Allah except that Allah raises him.',
          referenceAr: 'صحيح مسلم: 2588',
          referenceEn: 'Sahih Muslim: 2588',
        },
      },
    ],
  },
  {
    id: 'peace-maker-plaza',
    nameAr: 'ساحة الإصلاح ونشر السلام',
    nameEn: 'Plaza of Peace-Making & Reconciliation',
    subtitleAr: 'إنما المؤمنون إخوة فأصلحوا بين أخويكم',
    subtitleEn: 'The believers are but brothers, so make settlement between your brothers',
    iconName: 'heart-circle',
    color: '#7C3AED',
    weeklyPledgeAr: 'أتعهد بأن أكون صانع سلام، وأبادر بالاعتذار ومصالحة من خاصمني.',
    weeklyPledgeEn: 'I promise to spread peace, initiate apologies, and reconcile friends.',
    badgeId: 'badge-peacemaker',
    scenarios: [
      {
        id: 'pm1',
        titleAr: 'شجار صديقين في الملعب',
        titleEn: 'Two Friends Arguing',
        situationAr: 'اختلف صديقان لك في لعبة كرة القدم وبدآ في الصراخ والابتعاد عن بعضهما زعلانين.',
        situationEn: 'Two of your close friends argued during a match and walked away angry at each other.',
        choices: [
          {
            id: 'c1',
            textAr: 'أقترب منهما بابتسامة وأذكرهما بأخوتهما وأصلح بينهما حتى يتصافحا',
            textEn: 'Approach both with a warm smile, remind them of friendship, and help them shake hands',
            isPositive: true,
            consequenceAr: 'طوبى لك! إصلاح ذات البين أجره أعظم من درجات الصيام والصلاة النافلة.',
            consequenceEn: 'Blessed hero! Making peace between people earns greater reward than voluntary fasting and prayer.',
          },
          {
            id: 'c2',
            textAr: 'أنحاز لأحدهما وأشعل الخلاف أكثر',
            textEn: 'Take sides loudly and fuel the quarrel',
            isPositive: false,
            consequenceAr: 'الشيطان يحب التفريق بين الإخوة، والمسلم دائماً مفتاح للخير مغلاق للشر.',
            consequenceEn: 'Shaytan seeks to divide hearts; a true believer is always a key to peace.',
          },
        ],
        supportingProof: {
          type: 'ayah',
          textAr: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ',
          translationEn: 'The believers are but brothers, so make settlement between your brothers.',
          referenceAr: 'سورة الحجرات: 10',
          referenceEn: 'Surah Al-Hujurat: 10',
        },
      },
    ],
  },
  {
    id: 'truthful-promise-palace',
    nameAr: 'قصر الوفاء بالعهد والوعد',
    nameEn: 'Palace of Keeping Promises & Loyalty',
    subtitleAr: 'وأوفوا بالعهد إن العهد كان مسئولاً',
    subtitleEn: 'And fulfill every commitment, indeed commitments will be questioned',
    iconName: 'key',
    color: '#2563EB',
    weeklyPledgeAr: 'أتعهد بأن أفي بكل وعد أقطعه لوالديّ أو لأصدقائي.',
    weeklyPledgeEn: 'I promise to keep every promise made to my parents and friends.',
    badgeId: 'badge-faithful',
    scenarios: [
      {
        id: 'tp1',
        titleAr: 'موعد اللعب المتفق عليه',
        titleEn: 'The Agreed Meeting Time',
        situationAr: 'وعدت صديقك بزيارته في الساعة الخامسة للمذاكرة معاً، لكن ظهر لك برنامج كرتوني تحبه.',
        situationEn: 'You promised to meet your friend at 5 PM to study together, but a favorite cartoon started at that exact hour.',
        choices: [
          {
            id: 'c1',
            textAr: 'ألتزم بوعدي وأذهب إليه في الموعد المحدد لأن وعد المسلم دين وأمانة',
            textEn: 'Keep my promise and go on time because a Muslim’s word is a sacred trust',
            isPositive: true,
            consequenceAr: 'أحسنت يا بطل الوفاء! المسلم يفي بوعده دائماً، والوفاء بالعهد من صفات الأنبياء والصالحين.',
            consequenceEn: 'Bravo! Fulfilling promises is the noble trait of prophets and righteous leaders.',
          },
          {
            id: 'c2',
            textAr: 'أخلف موعدي وأجلس أشاهد التلفاز دون إخباره',
            textEn: 'Break my appointment and watch TV without even notifying him',
            isPositive: false,
            consequenceAr: 'إخلاف الوعد خصلة غير محبوبة، وإذا اضطر المسلم للاعتذار فليخبر أخاه بأدب مسبقاً.',
            consequenceEn: 'Breaking promises hurts trust; polite notice and apology are required if an emergency arises.',
          },
        ],
        supportingProof: {
          type: 'ayah',
          textAr: 'وَأَوْفُوا۟ بِٱلْعَهْدِ ۖ إِنَّ ٱلْعَهْدَ كَانَ مَسْـُٔولًا',
          translationEn: 'And fulfill every commitment; indeed, the commitment is ever inquired about.',
          referenceAr: 'سورة الإسراء: 34',
          referenceEn: 'Surah Al-Isra: 34',
        },
      },
    ],
  },
  {
    id: 'cooperation-castle',
    nameAr: 'قلعة التعاون والمساعدة',
    nameEn: 'Castle of Teamwork & Cooperation',
    subtitleAr: 'وتعاونوا على البر والتقوى ولا تعاونوا على الإثم والعدوان',
    subtitleEn: 'Cooperate in righteousness and piety, and do not cooperate in sin and aggression',
    iconName: 'construct',
    color: '#0891B2',
    weeklyPledgeAr: 'أتعهد بمساعدة إخوتي وأمي وأبي في أعمال البيت بروح التعاون والمحبة.',
    weeklyPledgeEn: 'I promise to assist my family with chores and support my classmates eagerly.',
    badgeId: 'badge-helper',
    scenarios: [
      {
        id: 'cc1',
        titleAr: 'ترتيب غرفة الألعاب',
        titleEn: 'Tidying the Playroom',
        situationAr: 'لعبت أنت وإخوتك طوال المساء، وعند وقت النوم كانت الألعاب مبعثرة والجميع متعب.',
        situationEn: 'You and your siblings played all evening. At bedtime, toys were scattered and everyone was tired.',
        choices: [
          {
            id: 'c1',
            textAr: 'أبادر وأقول: "هيا نتعاون جميعاً وننهِ الترتيب في دقيقتين ونحن نردد نشيداً جميلاً!"',
            textEn: 'Step up and say: "Let’s team up and finish tidying in 2 minutes together happily!"',
            isPositive: true,
            consequenceAr: 'ما أجمل روح الفريق! التعاون يجعل الصعب سهلاً ويدخل السرور والراحة على البيت كله.',
            consequenceEn: 'What wonderful team spirit! Teamwork makes heavy tasks light and blesses the whole home.',
          },
          {
            id: 'c2',
            textAr: 'أهرب إلى سريري وأترك إخوتي أو أمي يرتبون بمفردهم',
            textEn: 'Run to bed and leave siblings or mother to clean up alone',
            isPositive: false,
            consequenceAr: 'المسلم الحق يحب التعاون، والله في عون العبد ما كان العبد في عون أخيه.',
            consequenceEn: 'A true Muslim embraces helpfulness; Allah helps those who help others.',
          },
        ],
        supportingProof: {
          type: 'ayah',
          textAr: 'وَتَعَاوَنُوا۟ عَلَى ٱلْبِرِّ وَٱلتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا۟ عَلَى ٱلْإِثْمِ وَٱلْعُدْوَٰنِ',
          translationEn: 'And cooperate in righteousness and piety, but do not cooperate in sin and aggression.',
          referenceAr: 'سورة المائدة: 2',
          referenceEn: 'Surah Al-Ma’idah: 2',
        },
      },
    ],
  },
];

const existingMannerIds = new Set(ORIGINAL_MANNERS_BUILDINGS.map((b) => b.id));
const additionalManners = EXPANDED_MANNERS_50.filter((b) => !existingMannerIds.has(b.id));

export const MANNERS_BUILDINGS: MannerBuilding[] = [
  ...ORIGINAL_MANNERS_BUILDINGS,
  ...additionalManners,
].slice(0, 50);

