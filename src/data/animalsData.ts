// Animals in the Quran and Sunnah Dataset (حديقة الحيوان في القرآن والسنة)
// Authentic theological facts, Quranic references, and kid-friendly interactive modules.

export interface QuranAnimalItem {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
  surahNameAr: string;
  surahNameEn: string;
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
  ayahTranslationEn: string;
  clueAr: string;
  clueEn: string;
  factAr: string;
  factEn: string;
  soundName?: string;
  stickerId: string;
  themeColor: string;
}

export interface AnimalMiracleStoryScene {
  sceneIndex: number;
  titleAr: string;
  titleEn: string;
  narrationYoungAr: string;
  narrationYoungEn: string;
  narrationOlderAr: string;
  narrationOlderEn: string;
  symbolIcon: string;
  reflectionAr: string;
  reflectionEn: string;
}

export interface AnimalMiracleStory {
  id: string;
  titleAr: string;
  titleEn: string;
  prophetNameAr: string;
  prophetNameEn: string;
  animalNameAr: string;
  animalNameEn: string;
  animalEmoji: string;
  coverIcon: string;
  themeColor: string;
  minAge: number;
  references: string[];
  moralValueAr: string;
  moralValueEn: string;
  shortSummaryYoungAr: string;
  shortSummaryYoungEn: string;
  shortSummaryOlderAr: string;
  shortSummaryOlderEn: string;
  coreLessonAr: string;
  coreLessonEn: string;
  linkedAyah: {
    surahNameAr: string;
    surahNameEn: string;
    surahNumber: number;
    ayahNumber: number;
    textUthmani: string;
    translationEn: string;
  };
  scenes: AnimalMiracleStoryScene[];
  fearActivity?: {
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    scenarios: {
      situationAr: string;
      situationEn: string;
      options: {
        textAr: string;
        textEn: string;
        isCourageous: boolean;
        feedbackAr: string;
        feedbackEn: string;
      }[];
    }[];
  };
  quiz: {
    id: string;
    questionAr: string;
    questionEn: string;
    optionsAr: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationAr: string;
    explanationEn: string;
  }[];
  stickerId: string;
  stickerTitleAr: string;
  stickerTitleEn: string;
}

export interface AnimalKindnessHadith {
  id: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  source: string;
  lessonAr: string;
  lessonEn: string;
  badgeEmoji: string;
}

export interface AnimalKindnessScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  animalEmoji: string;
  situationAr: string;
  situationEn: string;
  options: {
    id: string;
    textAr: string;
    textEn: string;
    isKindChoice: boolean;
    rewardStars: number;
    rewardGems: number;
    feedbackAr: string;
    feedbackEn: string;
  }[];
}

// 1. Stories of Miracles with Animals (القصص الثلاث الرئيسية + قصة الغراب)
export const ANIMAL_MIRACLE_STORIES: AnimalMiracleStory[] = [
  {
    id: 'isa-bird',
    titleAr: 'طير عيسى عليه السلام بإذن الله',
    titleEn: 'The Bird of Clay by Allah’s Permission',
    prophetNameAr: 'عيسى عليه السلام',
    prophetNameEn: 'Prophet Isa (Jesus)',
    animalNameAr: 'الطير المبارك',
    animalNameEn: 'The Blessed Bird',
    animalEmoji: '🕊️',
    coverIcon: 'airplane',
    themeColor: '#0284C7',
    minAge: 6,
    references: ['آل عمران 3:49', 'المائدة 5:110'],
    moralValueAr: 'المعجزة بإذن الله وحده، والله هو الخالق القدير',
    moralValueEn: 'Miracles happen only by Allah’s permission; Allah is the sole Creator.',
    shortSummaryYoungAr: 'عيسى عليه السلام صنع من الطين شكل طير، ثم نفخ فيه، فصار طيرًا حقيقيًا بإذن الله. تذكّر: كل شيء حصل بإذن الله.',
    shortSummaryYoungEn: 'Prophet Isa made the shape of a bird from clay, breathed into it, and it became a real bird by Allah’s permission.',
    shortSummaryOlderAr: 'القرآن يكرر عبارة "بإذن الله" مع كل معجزة (إحياء الموتى وشفاء الأعمى والأبرص). فالنبي لا يخلق بنفسه، بل الله هو الخالق ويظهر المعجزة على يد رسله دليلاً على صدقهم.',
    shortSummaryOlderEn: 'The Quran stresses "by Allah’s permission" with every miracle. Prophets do not create; Allah manifests miracles through them as a sign of their truthfulness.',
    coreLessonAr: 'المعجزات من الله وحده، وهي دليل ساطع على صدق أنبيائه ورسله.',
    coreLessonEn: 'Miracles come solely from Allah and are truthful signs of His messengers.',
    linkedAyah: {
      surahNameAr: 'آل عمران',
      surahNameEn: 'Ali \'Imran',
      surahNumber: 3,
      ayahNumber: 49,
      textUthmani: 'أَنِّي أَخْلُقُ لَكُم مِّنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ',
      translationEn: 'I design for you from clay that which is like the form of a bird, then I breathe into it and it becomes a bird by permission of Allah.',
    },
    scenes: [
      {
        sceneIndex: 1,
        titleAr: 'طين نقي بيد نبي الله',
        titleEn: 'Pure Clay in the Prophet’s Hands',
        narrationYoungAr: 'أخذ نبي الله عيسى عليه السلام قليلًا من الطين النقي، وشكّله برفق ومحبة على هيئة طائر جميل ذي جناحين.',
        narrationYoungEn: 'Prophet Isa took pure clean clay and lovingly shaped it into a beautiful bird with two wings.',
        narrationOlderAr: 'طلب بنو إسرائيل من عيسى عليه السلام آية تبرهن أنه مرسل من عند الله، فأخذ طينًا وشكّل منه هيئة طائر.',
        narrationOlderEn: 'When the Children of Israel asked Isa for a clear sign, he took clay and molded it into the likeness of a bird.',
        symbolIcon: 'hand-left',
        reflectionAr: 'الله علم أنبياءه كيف يوضحون الحق للناس بالحكمة والآيات.',
        reflectionEn: 'Allah guided His prophets to convey truth through wisdom and signs.',
      },
      {
        sceneIndex: 2,
        titleAr: 'النفخة المباركة بإذن الله',
        titleEn: 'The Breath by Allah’s Leave',
        narrationYoungAr: 'نفخ عيسى عليه السلام في طائر الطين، وتوجه قلبه إلى الله الخالق، فدبت الحياة في الطائر ورفرف بجناحيه!',
        narrationYoungEn: 'Prophet Isa gently breathed into the clay bird, and by Allah’s command, life stirred and it fluttered its wings!',
        narrationOlderAr: 'نفخ عيسى فيه بإذن الله وقدرته، فتحول الطين الجامد إلى طائر حي يطير في السماء أمام أعين الناس جميعًا.',
        narrationOlderEn: 'By Allah’s power and permission, Isa breathed into it, and the still clay turned into a living bird flying before their eyes.',
        symbolIcon: 'sparkles',
        reflectionAr: 'الحياة هبة من الله الخالق وحده، لا أحد يستطيع أن يخلق شيئًا إلا الله.',
        reflectionEn: 'Life is a sacred gift from Allah alone; no being can create except Him.',
      },
      {
        sceneIndex: 3,
        titleAr: 'الطائر يحلّق في السماء',
        titleEn: 'Soaring in the Sky',
        narrationYoungAr: 'طار الطير عاليًا في السماء يسبح ربه! ففرح الأطفال والمؤمنون، وشهدوا أن الله على كل شيء قدير.',
        narrationYoungEn: 'The bird soared high into the sky praising Allah! The believers rejoiced and witnessed that Allah has power over all things.',
        narrationOlderAr: 'كانت هذه المعجزة دليلاً قاطعًا أن عيسى رسول الله، وأن الفاعل الحقيقي هو الله تعالى الذي يؤيد رسله بالمعجزات.',
        narrationOlderEn: 'This miracle was definitive proof of Isa’s prophethood, demonstrating that Allah is the ultimate Creator who aids His messengers.',
        symbolIcon: 'cloud',
        reflectionAr: 'نقول دائمًا: سبحان الله الخالق العظيم!',
        reflectionEn: 'We always praise: Subhan Allah, the Supreme Creator!',
      },
    ],
    quiz: [
      {
        id: 'q-isa-1',
        questionAr: 'من أي شيء صنع عيسى عليه السلام شكل الطير؟',
        questionEn: 'From what did Prophet Isa make the shape of the bird?',
        optionsAr: ['طين', 'خشب', 'ورق'],
        optionsEn: ['Clay', 'Wood', 'Paper'],
        correctIndex: 0,
        explanationAr: 'صنعه من الطين النقي ثم نفخ فيه بإذن الله.',
        explanationEn: 'He shaped it from clean clay, then breathed into it by Allah’s leave.',
      },
      {
        id: 'q-isa-2',
        questionAr: 'كيف صار طيرًا حقيقيًا يطير في السماء؟',
        questionEn: 'How did it become a real bird flying in the sky?',
        optionsAr: ['بإذن الله وحده', 'بمهارة اليد', 'بالسحر'],
        optionsEn: ['By Allah’s permission alone', 'By hand skills', 'By magic'],
        correctIndex: 0,
        explanationAr: 'كل المعجزات تقع بأمر الله وإذنه ومشيئته وحدها.',
        explanationEn: 'All miracles happen only by Allah’s command and permission.',
      },
      {
        id: 'q-isa-3',
        questionAr: 'من هو الخالق الحقيقي لكل المخلوقات؟',
        questionEn: 'Who is the true Creator of all creatures?',
        optionsAr: ['الله وحده لا شريك له', 'عيسى عليه السلام', 'الطين'],
        optionsEn: ['Allah alone without partner', 'Prophet Isa', 'The clay'],
        correctIndex: 0,
        explanationAr: 'الله سبحانه هو الخالق البارئ المصور، والأنبياء رسل يظهر الله المعجزات على أيديهم.',
        explanationEn: 'Allah is the Creator and Originator; prophets are messengers through whom Allah shows His signs.',
      },
    ],
    stickerId: 'st-isa-bird',
    stickerTitleAr: 'طير عيسى بإذن الله 🕊️',
    stickerTitleEn: 'Isa’s Bird of Clay 🕊️',
  },
  {
    id: 'musa-staff',
    titleAr: 'عصا موسى عليه السلام والشجاعة بالله',
    titleEn: 'The Staff of Musa & Courage in Allah',
    prophetNameAr: 'موسى عليه السلام',
    prophetNameEn: 'Prophet Musa (Moses)',
    animalNameAr: 'الحية التي تسعى',
    animalNameEn: 'The Moving Serpent',
    animalEmoji: '🐍',
    coverIcon: 'shield',
    themeColor: '#059669',
    minAge: 5,
    references: ['طه 20:17–23', 'الأعراف 7:107', 'الشعراء 26:32', 'القصص 28:31'],
    moralValueAr: 'الشجاعة بالله واليقين بأن من كان الله معه فلا يخاف',
    moralValueEn: 'Courage in Allah and the certainty that whoever has Allah by their side fears nothing.',
    shortSummaryYoungAr: 'سأل الله موسى: ما في يمينك؟ قال: عصاي أتوكأ عليها. قال الله: ألقِها. فصارت حية تسعى! خاف موسى، فقال الله: لا تخف. ثم أعادها إلى حالتها الأولى.',
    shortSummaryYoungEn: 'Allah asked Musa: What is in your right hand? He said: My staff. Allah commanded: Throw it down. It became a moving serpent! Musa feared, but Allah reassured him: Do not fear.',
    shortSummaryOlderAr: 'كانت أول معجزات موسى عليه السلام. حوّل الله العصا إلى حية، ثم أعادها كما كانت ليتشجّع ويثبت قلبه باليقين قبل مواجهة فرعون وظلمه. والقصة تعلّم أن من كان الله معه لا يخاف.',
    shortSummaryOlderEn: 'This was the first miracle of Prophet Musa. Allah turned the wooden staff into a living serpent, then restored it, reassuring Musa’s heart with brave conviction before confronting Pharaoh.',
    coreLessonAr: 'لا نخاف من شيء في هذا العالم إذا كان الله معنا يحفظنا ويرعانا.',
    coreLessonEn: 'We do not fear anything in this world when Allah is with us, protecting and caring for us.',
    linkedAyah: {
      surahNameAr: 'طه',
      surahNameEn: 'Ta-Ha',
      surahNumber: 20,
      ayahNumber: 21,
      textUthmani: 'قَالَ خُذْهَا وَلَا تَخَفْ ۖ سَنُعِيدُهَا سِيرَتَهَا الْأُولَىٰ',
      translationEn: 'Allah said: Grasp it and fear not; We will restore it to its former condition.',
    },
    scenes: [
      {
        sceneIndex: 1,
        titleAr: 'عصا خشبية طيبة',
        titleEn: 'A Simple Wooden Staff',
        narrationYoungAr: 'كان موسى عليه السلام يرعى الغنم ومعه عصا خشبية يتكئ عليها ويهش بها على غنمه.',
        narrationYoungEn: 'Prophet Musa was looking after sheep, carrying a simple wooden staff to lean on and guide his flock.',
        narrationOlderAr: 'عند الوادي المقدس طوى، نادى الله موسى وسأله: {وَمَا تِلْكَ بِيَمِينِكَ يَا مُوسَىٰ}، فأجاب موسى بأدب وبساطة عن فوائد عصاه.',
        narrationOlderEn: 'In the sacred valley of Tuwa, Allah called Musa and asked what was in his hand; Musa replied humbly explaining how he used his staff.',
        symbolIcon: 'walk',
        reflectionAr: 'الأشياء البسيطة يمكن أن يجعل الله فيها بركة ومعجزات عظيمة.',
        reflectionEn: 'Through simple things, Allah can bring about magnificent blessings and signs.',
      },
      {
        sceneIndex: 2,
        titleAr: 'ألقِها يا موسى!',
        titleEn: 'Throw It Down, O Musa!',
        narrationYoungAr: 'أمره الله أن يلقي العصا على الأرض، فلما ألقاها تحولت إلى حية تسعى وتتحرك بسرعة!',
        narrationYoungEn: 'Allah commanded him to cast it down. When he did, it transformed into a living, swift serpent!',
        narrationOlderAr: 'بأمر الله، انقلبت العصا الخشبية الجامدة حية حقيقية تسعى، فتعجب موسى وخاف خوفًا بشريًا وتراجع.',
        narrationOlderEn: 'By Allah’s divine command, the wooden stick transformed into a real serpent that moved rapidly, causing Musa to step back in natural fear.',
        symbolIcon: 'flash',
        reflectionAr: 'الله قادر أن يغير أحوال الأشياء في لحظة واحدة.',
        reflectionEn: 'Allah has the supreme power to transform all circumstances in a split second.',
      },
      {
        sceneIndex: 3,
        titleAr: 'خذها ولا تخف',
        titleEn: 'Take It and Fear Not',
        narrationYoungAr: 'قال الله لموسى برحمة: "خذها ولا تخف!" فمد موسى يده بشجاعة وأمسكها، فرجعت عصا خشبية كما كانت!',
        narrationYoungEn: 'Allah gently reassured him: "Take it and fear not!" Musa bravely reached out, and it returned to being a calm wooden staff!',
        narrationOlderAr: 'طمأن الله نبيه وعلمه درساً في الشجاعة والاعتماد على الله، ليكون قلبه مطمئناً بالله حين يذهب لدعوة فرعون المتكبر.',
        narrationOlderEn: 'Allah comforted His prophet and instilled deep courage in his heart, preparing him to stand fearlessly before the tyrant Pharaoh.',
        symbolIcon: 'shield-checkmark',
        reflectionAr: 'حين نتوكل على الله، يملأ الله قلوبنا بالسكينة والأمان والشجاعة.',
        reflectionEn: 'When we place our trust in Allah, He fills our souls with tranquility and bravery.',
      },
    ],
    fearActivity: {
      titleAr: 'لعبة البطل الشجاع: "لا تخف!"',
      titleEn: 'The Brave Hero Activity: "Fear Not!"',
      descAr: 'كيف نتغلب على الخوف الصغير بالذكر والدعاء؟ اختر التصرف الشجاع!',
      descEn: 'How do we overcome small moments of fear with remembrance and prayer? Choose the courageous action!',
      scenarios: [
        {
          situationAr: 'أطفأت الأنوار عند النوم وشعرت ببعض الخوف في الغرفة المظلمة.. ماذا تفعل؟',
          situationEn: 'The lights are off at bedtime and you feel a little scared in the dark.. what do you do?',
          options: [
            {
              textAr: 'أقرأ آية الكرسي والمعوذتين وأتذكر أن الله يحفظني وأنام بسلام 🌟',
              textEn: 'I recite Ayat al-Kursi and remember that Allah protects me, then sleep peacefully 🌟',
              isCourageous: true,
              feedbackAr: 'أحسنت يا بطل! ذكر الله نور وأمان يطرد كل خوف.',
              feedbackEn: 'Bravo, champion! The remembrance of Allah brings radiant peace and security.',
            },
            {
              textAr: 'أصرخ وأبكي وأظل خائفاً',
              textEn: 'I scream and stay scared in panic',
              isCourageous: false,
              feedbackAr: 'تذكر كلام الله: "لا تخف"، اذكر الله واستعذ به تجد راحة فورية.',
              feedbackEn: 'Remember Allah’s words: "Fear not." Remember Allah and your heart will be calm.',
            },
          ],
        },
        {
          situationAr: 'سمعت صوت رعد قوي في السماء أثناء المطر.. ماذا تقول؟',
          situationEn: 'You hear a loud rumble of thunder during the rain.. what do you say?',
          options: [
            {
              textAr: 'أقول: "سبحان الذي يسبح الرعد بحمده والملائكة من خيفته" وأبتسم للغيث المبارك 🌧️',
              textEn: 'I say the Sunnah dua: "Glory be to Him whom thunder praises" and smile for the blessed rain 🌧️',
              isCourageous: true,
              feedbackAr: 'ما شاء الله! هذا دعاء النبي ﷺ عند سماع الرعد.',
              feedbackEn: 'Masha’Allah! This is the noble prophetic dua when hearing thunder.',
            },
            {
              textAr: 'أختبئ تحت الوسادة وأغضب',
              textEn: 'I hide under the pillow and stay upset',
              isCourageous: false,
              feedbackAr: 'الرعد مخلوق من مخلوقات الله يسبح ربه، لا تخف منه بل ادعُ الله.',
              feedbackEn: 'Thunder is Allah’s creation praising Him; do not fear it, make dua!',
            },
          ],
        },
      ],
    },
    quiz: [
      {
        id: 'q-musa-1',
        questionAr: 'ماذا كان في يد موسى عليه السلام عندما كلمه الله؟',
        questionEn: 'What was in Prophet Musa’s hand when Allah spoke to him?',
        optionsAr: ['عصا خشبية', 'كتاب', 'حجر'],
        optionsEn: ['A wooden staff', 'A book', 'A stone'],
        correctIndex: 0,
        explanationAr: 'كانت عصاه التي يتوكأ عليها ويهش بها على غنمه.',
        explanationEn: 'It was his wooden staff that he leaned on and used for his sheep.',
      },
      {
        id: 'q-musa-2',
        questionAr: 'ماذا أصبحت العصا حين ألقاها موسى بأمر الله؟',
        questionEn: 'What did the staff become when Musa threw it down by Allah’s command?',
        optionsAr: ['حية تسعى', 'طيرًا يطير', 'ماءً عذبًا'],
        optionsEn: ['A moving serpent', 'A flying bird', 'Fresh water'],
        correctIndex: 0,
        explanationAr: 'صارت حية تسعى بإذن الله ثم أعادها الله عصا سالمة.',
        explanationEn: 'It became a moving serpent by Allah’s leave, then returned to a staff.',
      },
      {
        id: 'q-musa-3',
        questionAr: 'ماذا قال الله لموسى عليه السلام حين خاف؟',
        questionEn: 'What did Allah say to Prophet Musa when he felt fear?',
        optionsAr: ['لا تخف', 'اهرب بسرعة', 'اصرخ'],
        optionsEn: ['Fear not', 'Run away quickly', 'Scream'],
        correctIndex: 0,
        explanationAr: 'قال الله: {قَالَ خُذْهَا وَلَا تَخَفْ ۖ سَنُعِيدُهَا سِيرَتَهَا الْأُولَىٰ}.',
        explanationEn: 'Allah told him: {Grasp it and fear not; We will restore it to its former condition}.',
      },
    ],
    stickerId: 'st-musa-staff',
    stickerTitleAr: 'عصا موسى والشجاعة 🐍',
    stickerTitleEn: 'Staff of Musa & Courage 🐍',
  },
  {
    id: 'ismail-ram',
    titleAr: 'فداء إسماعيل عليه السلام (الذبح العظيم)',
    titleEn: 'The Ransom of Ismail & Eid al-Adha',
    prophetNameAr: 'إبراهيم وإسماعيل عليهما السلام',
    prophetNameEn: 'Prophets Ibrahim & Ismail',
    animalNameAr: 'كبش الفداء المبارك',
    animalNameEn: 'The Blessed Ransom Ram',
    animalEmoji: '🐏',
    coverIcon: 'heart',
    themeColor: '#D97706',
    minAge: 7,
    references: ['الصافات 37:99–111'],
    moralValueAr: 'الطاعة والتسليم لله، والصبر الذي يتبعه الفرج الكبير وأصل عيد الأضحى',
    moralValueEn: 'Obedience, submission to Allah, and patience that yields divine relief and the origin of Eid al-Adha.',
    shortSummaryYoungAr: 'رأى إبراهيم في المنام أمر الله، فقال لابنه إسماعيل، فقال الابن البار: افعل ما تؤمر يا أبتِ. وعندما استسلما لأمر الله ونفّذا الطاعة، نادى الله إبراهيم: صدّقت الرؤيا! وفدى الله الابن بكبش عظيم. ومن هنا نفرح بعيد الأضحى المبارك ونطعم الفقراء.',
    shortSummaryYoungEn: 'Ibrahim saw in a vision Allah’s command, and his loving son Ismail said: Do what you are commanded, father. When both submitted in love and obedience, Allah ransomed him with a magnificent ram. From here we celebrate Eid al-Adha with joy and generosity.',
    shortSummaryOlderAr: 'الآيات تُبرز أسمى حوار بين أب ونبي وابنه في طاعة الله بلا تردد. القرآن سمّى الفداء "ذبحًا عظيمًا"، وكان كبشًا كريمًا افتدى الله به نبيّه إسماعيل تكريمًا لصدقهما، وصارت شعيرة الأضحية سُنّة مؤكدة تملأ بيوت الفقراء بالخير والسرور في عيد الأضحى.',
    shortSummaryOlderEn: 'The Quranic verses present the highest dialogue of unconditional submission between father and son. Allah named the ransom a "Great Sacrifice," honoring their pure devotion, which instituted the blessed Sunnah of sacrifice on Eid al-Adha.',
    coreLessonAr: 'الطاعة التامة والصبر عاقبتهما دائمًا الفرج والخير والبركة والنجاة من الله.',
    coreLessonEn: 'Full obedience and patience always culminate in divine relief, blessing, and honor from Allah.',
    linkedAyah: {
      surahNameAr: 'الصافات',
      surahNameEn: 'As-Saffat',
      surahNumber: 37,
      ayahNumber: 107,
      textUthmani: 'وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ',
      translationEn: 'And We ransomed him with a great sacrifice.',
    },
    scenes: [
      {
        sceneIndex: 1,
        titleAr: 'الابن البار المؤدب',
        titleEn: 'The Dutiful and Loving Son',
        narrationYoungAr: 'كان إسماعيل ولدًا صالحًا يحب ربه ويطيع أباه إبراهيم في كل بر وخير.',
        narrationYoungEn: 'Ismail was a righteous boy who loved Allah dearly and treated his father Ibrahim with immense respect.',
        narrationOlderAr: 'نشأ إسماعيل في مكة بارًا طائعًا، فلما بلغ السعي مع والده، أخبره إبراهيم برؤيا رآها في المنام امتحانًا لإيمانهما.',
        narrationOlderEn: 'Growing up righteous in Makkah, when Ismail reached the age of assisting his father, Ibrahim shared a dream testing their faith.',
        symbolIcon: 'heart-circle',
        reflectionAr: 'بر الوالدين وطاعة أمر الله هما أعظم ما يتحلى به الأبناء الصالحون.',
        reflectionEn: 'Honoring parents and obeying Allah are the crown jewels of righteous youth.',
      },
      {
        sceneIndex: 2,
        titleAr: 'يا أبتِ افعل ما تؤمر',
        titleEn: 'O Father, Do What You Are Commanded',
        narrationYoungAr: 'أجاب إسماعيل أباه بقلب مطمئن ولسان لطيف: "يا أبتِ افعل ما تؤمر، ستجدني إن شاء الله من الصابرين".',
        narrationYoungEn: 'Ismail answered his father with absolute calm: "O my father, do what you are commanded; you will find me patient, God willing."',
        narrationOlderAr: 'ضرب إسماعيل أروع مثل في التسليم لقضاء الله، فلم يتردد ولم يجزع، بل وثق بحكمة الله ورحمته ولطفه.',
        narrationOlderEn: 'Ismail set the timeless standard of trusting submission; he neither hesitated nor despaired, trusting Allah’s boundless wisdom.',
        symbolIcon: 'hand-left',
        reflectionAr: 'من يسلّم أمره لله بحسن ظن، يجعل الله له من كل ضيق مخرجًا.',
        reflectionEn: 'Whoever entrusts their affairs to Allah will always find divine ease and a way out.',
      },
      {
        sceneIndex: 3,
        titleAr: 'الفداء العظيم وفرحة العيد',
        titleEn: 'The Great Ransom & Eid Joy',
        narrationYoungAr: 'نادى الله إبراهيم بالرحمة: قد صدقت الرؤيا! وأنزل الله كبشًا كريمًا ليكون فداءً لإسماعيل، ففرحا فرحًا كبيرًا وشكرا الله.',
        narrationYoungEn: 'Allah called Ibrahim with boundless mercy: You have fulfilled the vision! Allah sent a noble ram as a ransom, filling them with joy!',
        narrationOlderAr: 'كافأ الله إبراهيم وإسماعيل على صدقهما بفداء عظيم، وجعل هذه المناسبة عيدًا للمسلمين نضحي فيه ونهدي الأقارب ونطعم الفقراء والمحتاجين.',
        narrationOlderEn: 'Allah rewarded their sincere devotion with a magnificent sacrifice, establishing Eid al-Adha as a celebration of sharing, charity, and gratitude.',
        symbolIcon: 'gift',
        reflectionAr: 'عيد الأضحى هو يوم الفرح والصلة وإطعام المساكين والتكبير والشكر لله.',
        reflectionEn: 'Eid al-Adha is a day of joy, family kinship, feeding the needy, and praising Allah.',
      },
    ],
    quiz: [
      {
        id: 'q-ismail-1',
        questionAr: 'بماذا فدى الله تعالى إسماعيل عليه السلام بعد أن استسلم لأمر ربه؟',
        questionEn: 'With what did Allah ransom Prophet Ismail after he submitted to Allah’s command?',
        optionsAr: ['بذبح عظيم (كبش مبارك)', 'بمال كثير', 'بشجرة خضراء'],
        optionsEn: ['With a great sacrifice (blessed ram)', 'With lots of wealth', 'With a green tree'],
        correctIndex: 0,
        explanationAr: 'قال تعالى: {وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ}.',
        explanationEn: 'Allah declared: {And We ransomed him with a great sacrifice}.',
      },
      {
        id: 'q-ismail-2',
        questionAr: 'ماذا نتعلم من موقف إسماعيل مع والده إبراهيم؟',
        questionEn: 'What do we learn from Ismail’s attitude toward his father Ibrahim?',
        optionsAr: ['الطاعة والبر والفرج من الله', 'الغضب والعناد', 'الهرب والخوف'],
        optionsEn: ['Obedience, dutifulness, and relief from Allah', 'Anger and stubbornness', 'Running away and fear'],
        correctIndex: 0,
        explanationAr: 'نتعلم الصبر وحسن الاستماع للوالدين واليقين بأن طاعة الله فرج.',
        explanationEn: 'We learn patience, loving respect for parents, and trusting in Allah’s relief.',
      },
      {
        id: 'q-ismail-3',
        questionAr: 'أي عيد مبارك يرتبط بهذه القصة العظيمة؟',
        questionEn: 'Which blessed Eid is connected to this magnificent story?',
        optionsAr: ['عيد الأضحى المبارك', 'عيد الفطر', 'يوم الجمعة'],
        optionsEn: ['Eid al-Adha', 'Eid al-Fitr', 'Friday'],
        correctIndex: 0,
        explanationAr: 'عيد الأضحى سُمي بذلك لأننا نضحي فيه اقتداءً بسيدنا إبراهيم وإسماعيل عليهما السلام.',
        explanationEn: 'Eid al-Adha is named so because we offer sacrifice following the sunnah of Ibrahim and Ismail.',
      },
    ],
    stickerId: 'st-ismail-ram',
    stickerTitleAr: 'كبش الفداء وعيد الأضحى 🐏',
    stickerTitleEn: 'Ransom Ram & Eid al-Adha 🐏',
  },
  {
    id: 'qabil-crow',
    titleAr: 'غراب ابني آدم والندم والتعلم (١٠+ سنوات)',
    titleEn: 'The Crow of Adam’s Sons & True Remorse (Age 10+)',
    prophetNameAr: 'قصة ابني آدم والغراب المعلم',
    prophetNameEn: 'Story of the Sons of Adam & The Teacher Crow',
    animalNameAr: 'الغراب الحكيم',
    animalNameEn: 'The Wise Crow',
    animalEmoji: '🦅',
    coverIcon: 'eye',
    themeColor: '#475569',
    minAge: 10,
    references: ['المائدة 5:27–31'],
    moralValueAr: 'الندم على الخطأ، والحسد يقود للندم، والتواضع للتعلم حتى من أضعف المخلوقات',
    moralValueEn: 'Envy and anger lead to deep regret; true humility means being open to learning wisdom even from birds and small creatures.',
    shortSummaryYoungAr: 'بعث الله غرابًا ليعلم ابن آدم كيف يواري جثمان أخيه في التراب بإكرام، فندم على خطئه وتعلم درسًا في احترام خلق الله.',
    shortSummaryYoungEn: 'Allah sent a crow to teach the son of Adam how to respectfully bury the body in the earth, leading him to deep remorse and learning from Allah’s creatures.',
    shortSummaryOlderAr: 'القرآن يوضح كيف أن الغضب والحسد يعميان البصيرة. أرسل الله غرابًا يبحث في الأرض ليُري الإنسان كيف يدفن أخاه، فندم قابيل وقال: {يَا وَيْلَتَا أَعَجَزْتُ أَنْ أَكُونَ مِثْلَ هَٰذَا الْغُرَابِ}. نتعلم أن الحكمة ضالة المؤمن ونتعلم من كل مخلوق.',
    shortSummaryOlderEn: 'The Quran illustrates that jealousy blinds hearts. Allah sent a crow scratching the soil to show how to bury the dead. The remorseful brother exclaimed: {Woe to me! Have I failed to be like this crow?} We learn that wisdom comes through observing creation.',
    coreLessonAr: 'الحسد والغضب يورثان الندم والخسارة، والإنسان الحكيم يتعلم من آيات الله ومخلوقاته في الأرض.',
    coreLessonEn: 'Envy and anger always bring regret; a wise believer reflects on Allah’s creation and seeks peace and humility.',
    linkedAyah: {
      surahNameAr: 'المائدة',
      surahNameEn: 'Al-Ma\'idah',
      surahNumber: 5,
      ayahNumber: 31,
      textUthmani: 'فَبَعَثَ اللَّهُ غُرَابًا يَبْحَثُ فِي الْأَرْضِ لِيُرِيَهُ كَيْفَ يُوَارِي سَوْءَةَ أَخِيهِ',
      translationEn: 'Then Allah sent a crow searching in the ground to show him how to hide the disgrace of his brother.',
    },
    scenes: [
      {
        sceneIndex: 1,
        titleAr: 'الحسد يفسد القلوب',
        titleEn: 'Envy Spoils the Heart',
        narrationYoungAr: 'تقبل الله قربان هابيل الصالح لأنه كان مخلصًا طيب القلب، بينما لم يتقبل من قابيل لأنه كان حسودًا.',
        narrationYoungEn: 'Allah accepted the offering of righteous Habil because of his pure devotion, while Qabil’s was not accepted due to envy.',
        narrationOlderAr: 'كانت بداية الخطيئة هي الحسد؛ حذره هابيل ونهاه عن الأذى، ولكن قابيل سمح لنفسه بالغضب والعدوان.',
        narrationOlderEn: 'The root of the sin was jealousy. Habil advised patience and righteousness, but Qabil surrendered to rage.',
        symbolIcon: 'warning',
        reflectionAr: 'الحسد يحرق راحة القلب، والمؤمن يفرح برزق غيره ويسأل الله من فضله.',
        reflectionEn: 'Envy robs the heart of joy; a believer delights in others’ blessings and asks Allah from His grace.',
      },
      {
        sceneIndex: 2,
        titleAr: 'الغراب المعلم من السماء',
        titleEn: 'The Crow Sent as a Teacher',
        narrationYoungAr: 'تحيّر قابيل ولم يدرِ ماذا يصنع، فبعث الله غرابًا نزل على الأرض وأخذ يحفر التراب بمنقاره ورجليه ليريه كيف يدفن الجثمان.',
        narrationYoungEn: 'Confused and troubled, Allah sent a crow that landed nearby, scratching the soil with its beak and feet to demonstrate burial.',
        narrationOlderAr: 'أراد الله أن يعطي درسًا في التواضع، فأرسل طائرًا ضعيفًا يملك حكمة إلهية ألهمه الله إياها ليعلم الإنسان كيف يواري أخاه.',
        narrationOlderEn: 'Allah provided a profound lesson in humility by sending a simple bird endowed with divine instinct to teach humanity proper burial.',
        symbolIcon: 'leaf',
        reflectionAr: 'سبحان الذي أعطى كل شيء خلقه ثم هدى! الحيوانات والطيور كلها تسير بهداية الله.',
        reflectionEn: 'Glory to Allah who gave everything its form and guided it! All creatures live under divine inspiration.',
      },
      {
        sceneIndex: 3,
        titleAr: 'الندم والتوبة إلى الله',
        titleEn: 'True Remorse and Turning to Allah',
        narrationYoungAr: 'نظر قابيل إلى الغراب وخجل من نفسه وقال: يا ويلي، أعجزت أن أكون مثل هذا الغراب؟ فأصبح من النادمين.',
        narrationYoungEn: 'Qabil watched the crow in shame and lamented his helplessness, becoming deeply remorseful for what he had done.',
        narrationOlderAr: 'كان الندم حارقًا في قلبه، والقصة تحذير لكل إنسان من عواقب الحسد والاعتداء، ودعوة للمسارعة بالصلح والتوبة.',
        narrationOlderEn: 'His remorse was profound. The story stands as an eternal warning against envy and an invitation to peaceful resolution and repentance.',
        symbolIcon: 'heart-dislike',
        reflectionAr: 'الاعتراف بالخطأ والندم الصادق أولى خطوات إصلاح النفس.',
        reflectionEn: 'Admitting one’s fault and genuine remorse are the foundational steps toward spiritual rectification.',
      },
    ],
    quiz: [
      {
        id: 'q-crow-1',
        questionAr: 'ما الطائر الذي بعثه الله ليعلم ابن آدم كيف يواري جثمان أخيه؟',
        questionEn: 'Which bird did Allah send to show the son of Adam how to bury his brother?',
        optionsAr: ['الغراب', 'الهدهد', 'الحمامة'],
        optionsEn: ['The Crow', 'The Hoopoe', 'The Dove'],
        correctIndex: 0,
        explanationAr: 'قال تعالى: {فَبَعَثَ اللَّهُ غُرَابًا يَبْحَثُ فِي الْأَرْضِ}.',
        explanationEn: 'Allah stated: {Then Allah sent a crow searching in the ground}.',
      },
      {
        id: 'q-crow-2',
        questionAr: 'ماذا كان يفعل الغراب في الأرض؟',
        questionEn: 'What was the crow doing in the ground?',
        optionsAr: ['يحفر التراب ويواري', 'يشرب الماء', 'يطير في الهواء'],
        optionsEn: ['Digging and burying', 'Drinking water', 'Flying in the air'],
        correctIndex: 0,
        explanationAr: 'كان يبحث في الأرض ويحفر ليعلمه كيف يواري الجثمان.',
        explanationEn: 'It was scratching and digging the earth to demonstrate burial.',
      },
      {
        id: 'q-crow-3',
        questionAr: 'ما الدرس العظيم الذي نتعلمه من هذه القصة؟',
        questionEn: 'What is the great lesson we learn from this story?',
        optionsAr: ['الحسد يقود للندم ونتعلم الحكمة من مخلوقات الله', 'الغضب أفضل خيار', 'عدم التوبة'],
        optionsEn: ['Envy leads to regret and we learn wisdom from Allah’s creatures', 'Anger is best', 'Never repenting'],
        correctIndex: 0,
        explanationAr: 'نتعلم البعد عن الحسد والتواضع للتعلم والتفكر في خلق الله.',
        explanationEn: 'We learn to shun envy, practice humility, and reflect upon Allah’s creation.',
      },
    ],
    stickerId: 'st-crow',
    stickerTitleAr: 'غراب ابني آدم والندم 🦅',
    stickerTitleEn: 'Crow of Adam’s Sons 🦅',
  },
];

// 2. Animal Kindness in the Sunnah (الأحاديث الصحيحة المتفق عليها والأنشطة)
export const ANIMAL_KINDNESS_HADITHS: AnimalKindnessHadith[] = [
  {
    id: 'hadith-dog-water',
    titleAr: 'سقيا الكلب العطشان والمغفرة العظيمة',
    titleEn: 'Quenching a Thirsty Dog & Divine Forgiveness',
    textAr: '«بَيْنَمَا رَجُلٌ يَمْشِي بِطَرِيقٍ اشْتَدَّ عَلَيْهِ الْعَطَشُ، فَوَجَدَ بِئْرًا فَنَزَلَ فِيهَا فَشَرِبَ ثُمَّ خَرَجَ، فَإِذَا كَلْبٌ يَلْهَثُ يَأْكُلُ الثَّرَى مِنَ الْعَطَشِ، فَقَالَ: لَقَدْ بَلَغَ هَذَا مِثْلُ الَّذِي بَلَغَ بِي، فَمَلَأَ خُفَّهُ مَاءً ثُمَّ أَمْسَكَهُ بِفِيهِ ثُمَّ رَقِيَ فَسَقَى الْكَلْبَ، فَشَكَرَ اللَّهُ لَهُ فَغَفَرَ لَهُ»',
    textEn: 'A man walked along a path and felt intense thirst. He found a well, went down, drank, and came out. He saw a dog panting and eating moist soil out of severe thirst. The man thought: "This dog has suffered the same thirst that I suffered." He filled his leather sock with water, held it in his mouth, climbed up, and gave the dog to drink. Allah appreciated his action and forgave him.',
    source: 'متفق عليه (صحيح البخاري ومسلم)',
    lessonAr: 'الرحمة بالحيوان عمل عظيم يحبه الله ويكون سببًا لمغفرة الذنوب ودخول الجنة.',
    lessonEn: 'Kindness to animals is a magnificent deed beloved by Allah and a reason for forgiveness.',
    badgeEmoji: '🐕',
  },
  {
    id: 'hadith-cat-locked',
    titleAr: 'المرأة والهرة: التحذير من الإساءة للحيوان',
    titleEn: 'The Woman and the Cat: Warning Against Cruelty',
    textAr: '«عُذِّبَتِ امْرَأَةٌ فِي هِرَّةٍ سَجَنَتْهَا حَتَّى مَاتَتْ، فَدَخَلَتْ فِيهَا النَّارَ، لَا هِيَ أَطْعَمَتْهَا وَلَا سَقَتْهَا إِذْ حَبَسَتْهَا، وَلَا هِيَ تَرَكَتْهَا تَأْكُلُ مِنْ خَشَاشِ الْأَرْضِ»',
    textEn: 'A woman was punished because of a cat she imprisoned until it died, and entered Hellfire because of it. She neither fed it nor gave it water while keeping it locked up, nor did she let it free to eat from the small creatures of the earth.',
    source: 'متفق عليه (صحيح البخاري ومسلم)',
    lessonAr: 'الإساءة للحيوان وحبسه ومنع الطعام عنه ذنب عظيم، والإسلام دين الرحمة والعدل مع كل كبد رطبة.',
    lessonEn: 'Mistreating animals and denying them food or water is a severe sin. Islam commands mercy to all living beings.',
    badgeEmoji: '🐱',
  },
];

// Interactive Activity: "ساعد الحيوان" (Help the Animals)
export const ANIMAL_KINDNESS_SCENARIOS: AnimalKindnessScenario[] = [
  {
    id: 'cat-thirsty',
    titleAr: 'قطة صغيرة عطشانة في يوم حار',
    titleEn: 'A Thirsty Kitten on a Warm Day',
    animalEmoji: '🐱',
    situationAr: 'رأيت قطة صغيرة تموء وتلهث بجوار باب بيتك في يوم صيفي حار جداً.. ماذا تفعل؟',
    situationEn: 'You see a small kitten panting by your doorstep on a hot summer afternoon.. what do you do?',
    options: [
      {
        id: 'opt-cat-1',
        textAr: 'أملأ إناءً صغيرًا بماء بارد ونظيف وأضعه لها في الظل بلطف 🥣',
        textEn: 'I fill a small clean bowl with cool water and place it gently in the shade 🥣',
        isKindChoice: true,
        rewardStars: 3,
        rewardGems: 2,
        feedbackAr: 'بارك الله فيك يا رحيم! قال رسول الله ﷺ: "في كل كبد رطبة أجر".',
        feedbackEn: 'Bless you! The Prophet ﷺ said: "There is a reward for serving any living being."',
      },
      {
        id: 'opt-cat-2',
        textAr: 'أتجاهلها وأمشي مسرعاً',
        textEn: 'I ignore it and walk away quickly',
        isKindChoice: false,
        rewardStars: 0,
        rewardGems: 0,
        feedbackAr: 'الرحمة بالحيوان من صفات المسلم الصالح، تذكر أجر ساقي الكلب العطشان!',
        feedbackEn: 'Mercy to animals is the mark of a true Muslim. Remember the man who watered the dog!',
      },
    ],
  },
  {
    id: 'bird-hungry',
    titleAr: 'عصفور جائع يبحث عن فتات الخبز',
    titleEn: 'A Hungry Bird Looking for Crumbs',
    animalEmoji: '🐦',
    situationAr: 'رأيت عصافير صغيرة تبحث عن طعام في شرفة المنزل ولم تجد شيئاً.. ماذا تفعل؟',
    situationEn: 'You see little sparrows searching for food on the balcony and finding nothing.. what do you do?',
    options: [
      {
        id: 'opt-bird-1',
        textAr: 'أضع لها بعض الحبوب وفتات الخبز وقليلًا من الماء على سور الشرفة 🌾',
        textEn: 'I place seeds, breadcrumbs, and a small water bowl on the ledge 🌾',
        isKindChoice: true,
        rewardStars: 3,
        rewardGems: 2,
        feedbackAr: 'عمل نبيل! إطعام الطيور صدقة جارية يؤجر عليها المسلم كل يوم.',
        feedbackEn: 'Noble deed! Feeding birds is an ongoing charity rewarded by Allah every day.',
      },
      {
        id: 'opt-bird-2',
        textAr: 'أرمي عليها حجارة صغيرة لأطردها',
        textEn: 'I throw small stones to scare them away',
        isKindChoice: false,
        rewardStars: 0,
        rewardGems: 0,
        feedbackAr: 'نهى الإسلام عن إيذاء الطيور والحيوانات، العصفور مخلوق يسبح ربه ويستحق الرفق.',
        feedbackEn: 'Islam strictly forbids harming birds and animals. They praise Allah and deserve kindness.',
      },
    ],
  },
  {
    id: 'lamb-hurt',
    titleAr: 'خروف صغير تعثر في الطريق',
    titleEn: 'A Little Lamb in Need of Gentle Care',
    animalEmoji: '🐑',
    situationAr: 'أثناء زيارتك للمزرعة رأيت خروفاً صغيراً قد علق في غصن شوك ويتألم بهدوء.. ماذا تفعل؟',
    situationEn: 'Visiting a farm, you notice a little lamb caught in thorny branches in pain.. what do you do?',
    options: [
      {
        id: 'opt-lamb-1',
        textAr: 'أنادي والدي فوراً وأساعده برفق حتى نخلّصه بدون إيذاء ونمسح على رأسه 🌿',
        textEn: 'I call my parent right away and gently help free it without injury, stroking its head 🌿',
        isKindChoice: true,
        rewardStars: 3,
        rewardGems: 2,
        feedbackAr: 'أحسنت صنعاً! الرفق ما كان في شيء إلا زانه، وما نزع من شيء إلا شانه.',
        feedbackEn: 'Well done! Gentleness beautifies everything, and cruelty tarnishes everything.',
      },
      {
        id: 'opt-lamb-2',
        textAr: 'أتركه يتألم وأذهب للعب',
        textEn: 'I leave it in pain and go play',
        isKindChoice: false,
        rewardStars: 0,
        rewardGems: 0,
        feedbackAr: 'المسلم لا يترك كائناً يتألم بل يبادر لمساعدته والرحمة به.',
        feedbackEn: 'A believer never ignores a creature in distress; they rush to help with compassion.',
      },
    ],
  },
];

// 3. Fast Index of All 16 Animals Mentioned in the Quran (فهرس الـ ١٦ حيواناً في القرآن)
export const QURAN_ANIMALS_CATALOG: QuranAnimalItem[] = [
  {
    id: 'ant',
    nameAr: 'النملة',
    nameEn: 'The Ant',
    emoji: '🐜',
    surahNameAr: 'سورة النمل',
    surahNameEn: 'An-Naml',
    surahNumber: 27,
    ayahNumber: 18,
    ayahText: 'قَالَتْ نَمْلَةٌ يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ لَا يَحْطِمَنَّكُمْ سُلَيْمَانُ وَجُنُودُهُ وَهُمْ لَا يَشْعُرُونَ',
    ayahTranslationEn: 'An ant said: O ants, enter your dwellings that you not be crushed by Solomon and his soldiers while they perceive not.',
    clueAr: 'حشرة صغيرة جدًا ونشيطة حذرت قومها، وسمعها نبي الله سليمان فتبسم ضاحكًا!',
    clueEn: 'A tiny, hardworking insect that warned its colony; Prophet Solomon heard and smiled warmly!',
    factAr: 'النمل منظم جدًا ويعيش في مستعمرات متعاونة، وسُميت سورة كاملة باسمها في القرآن.',
    factEn: 'Ants are highly organized and live in cooperative colonies; a whole Surah is named after them.',
    stickerId: 'st-ant',
    themeColor: '#B45309',
  },
  {
    id: 'bee',
    nameAr: 'النحلة',
    nameEn: 'The Bee',
    emoji: '🐝',
    surahNameAr: 'سورة النحل',
    surahNameEn: 'An-Nahl',
    surahNumber: 16,
    ayahNumber: 68,
    ayahText: 'وَأَوْحَىٰ رَبُّكَ إِلَى النَّحْلِ أَنِ اتَّخِذِي مِنَ الْجِبَالِ بُيُوتًا وَمِنَ الشَّجَرِ وَمِمَّا يَعْرِشُونَ',
    ayahTranslationEn: 'And your Lord inspired to the bee: Take for yourself among the mountains houses, and among the trees and in that which they construct.',
    clueAr: 'تطير بين الأزهار الجميلة وتصنع لنا عسلاً شهياً فيه شفاء للناس!',
    clueEn: 'Flies between blooming flowers to produce delicious honey which contains healing for people!',
    factAr: 'أوحى الله إلى النحل هندسة بناء خلاياها السداسية وصناعة العسل المبارك.',
    factEn: 'Allah inspired the bee with hexagonal hive engineering and the production of healing honey.',
    stickerId: 'st-bee',
    themeColor: '#D97706',
  },
  {
    id: 'hoopoe',
    nameAr: 'الهدهد',
    nameEn: 'The Hoopoe',
    emoji: '🪶',
    surahNameAr: 'سورة النمل',
    surahNameEn: 'An-Naml',
    surahNumber: 27,
    ayahNumber: 20,
    ayahText: 'وَتَفَقَّدَ الطَّيْرَ فَقَالَ مَا لِيَ لَا أَرَى الْهُدْهُدَ أَمْ كَانَ مِنَ الْغَائِبِينَ',
    ayahTranslationEn: 'And he took attendance of the birds and said: Why do I not see the hoopoe - or is he among the absent?',
    clueAr: 'طائر جميل ذو تاج بريشه حمل رسالة التوحيد من نبي الله سليمان إلى ملكة سبأ.',
    clueEn: 'A crested bird that carried Prophet Solomon’s letter of monotheism to the Queen of Sheba.',
    factAr: 'الهدهد طائر ذكي ومخلص كان سبباً في إسلام ملكة سبأ بلقيس وقومها.',
    factEn: 'The Hoopoe was a loyal and intelligent bird that led to the Islam of the Queen of Sheba and her people.',
    stickerId: 'st-hoopoe',
    themeColor: '#F59E0B',
  },
  {
    id: 'crow',
    nameAr: 'الغراب',
    nameEn: 'The Crow',
    emoji: '🦅',
    surahNameAr: 'سورة المائدة',
    surahNameEn: 'Al-Ma\'idah',
    surahNumber: 5,
    ayahNumber: 31,
    ayahText: 'فَبَعَثَ اللَّهُ غُرَابًا يَبْحَثُ فِي الْأَرْضِ لِيُرِيَهُ كَيْفَ يُوَارِي سَوْءَةَ أَخِيهِ',
    ayahTranslationEn: 'Then Allah sent a crow searching in the ground to show him how to hide the disgrace of his brother.',
    clueAr: 'طائر ذكي ذكره القرآن حين بعثه الله ليعلم الإنسان كيف يواري ويدفن في الأرض.',
    clueEn: 'A clever bird mentioned in the Quran sent by Allah to teach humanity how to bury in the soil.',
    factAr: 'الغراب من أذكى الطيور في العالم، وقد علّم أول درس في دفن الإنسان.',
    factEn: 'Crows are among the most intelligent birds in the world, teaching the first lesson in burial.',
    stickerId: 'st-crow',
    themeColor: '#334155',
  },
  {
    id: 'dog',
    nameAr: 'الكلب',
    nameEn: 'The Dog (Companions of the Cave)',
    emoji: '🐕',
    surahNameAr: 'سورة الكهف',
    surahNameEn: 'Al-Kahf',
    surahNumber: 18,
    ayahNumber: 18,
    ayahText: 'وَتَحْسَبُهُمْ أَيْقَاظًا وَهُمْ رُقُودٌ ۚ وَنُقَلِّبُهُمْ ذَاتَ الْيَمِينِ وَذَاتَ الشِّمَالِ ۖ وَكَلْبُهُم بَاسِطٌ ذِرَاعَيْهِ بِالْوَصِيدِ',
    ayahTranslationEn: 'And you would think them awake while they were asleep... and their dog stretching its forelegs at the entrance.',
    clueAr: 'حيوان وفيّ رافق الفتية المؤمنين في الكهف وحرسهم لسنوات طويلة.',
    clueEn: 'A faithful animal that accompanied the young believers in the Cave and guarded them for centuries.',
    factAr: 'خلّد القرآن ذكر كلب أهل الكهف وفاءً لرفقته بالصالحين.',
    factEn: 'The Quran commemorated the Cave Sleepers’ dog due to its loyal companionship with the righteous.',
    stickerId: 'st-kind-dog',
    themeColor: '#78350F',
  },
  {
    id: 'elephant',
    nameAr: 'الفيل',
    nameEn: 'The Elephant',
    emoji: '🐘',
    surahNameAr: 'سورة الفيل',
    surahNameEn: 'Al-Fil',
    surahNumber: 105,
    ayahNumber: 1,
    ayahText: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
    ayahTranslationEn: 'Have you not seen how your Lord dealt with the companions of the elephant?',
    clueAr: 'حيوان ضخم ذو خرطوم رفض بأمر الله أن يهدم الكعبة المشرفة في عام الفيل.',
    clueEn: 'A massive creature with a trunk that refused to march toward the Kaaba in the Year of the Elephant.',
    factAr: 'الفيل العظيم (محمود) برك على الأرض ورفض التقدم نحو مكة حماية للبيت الحرام.',
    factEn: 'The elephant knelt down and refused to advance toward Makkah, protecting the Sacred Sanctuary.',
    stickerId: 'st-elephant',
    themeColor: '#4B5563',
  },
  {
    id: 'whale',
    nameAr: 'الحوت',
    nameEn: 'The Whale (Nun)',
    emoji: '🐋',
    surahNameAr: 'سورة الصافات',
    surahNameEn: 'As-Saffat',
    surahNumber: 37,
    ayahNumber: 142,
    ayahText: 'فَالْتَقَمَهُ الْحُوتُ وَهُوَ مُلِيمٌ',
    ayahTranslationEn: 'Then the fish swallowed him, while he was blameworthy.',
    clueAr: 'مخلوق بحري عظيم التقَم نبي الله يونس في بطنه دون أن يؤذيه حتى سبح ربه ونجاه!',
    clueEn: 'A great marine creature that harbored Prophet Yunus in its belly safely until he praised Allah!',
    factAr: 'حفظ الله يونس في بطن الحوت برحمة، حيث كان يونس يسبح: لا إله إلا أنت سبحانك إني كنت من الظالمين.',
    factEn: 'Allah preserved Yunus safely in the whale’s belly where he chanted his famous prayer of monotheism.',
    stickerId: 'st-whale',
    themeColor: '#0369A1',
  },
  {
    id: 'she-camel',
    nameAr: 'الناقة',
    nameEn: 'The Miraculous She-Camel',
    emoji: '🐪',
    surahNameAr: 'سورة الشمس',
    surahNameEn: 'Ash-Shams',
    surahNumber: 91,
    ayahNumber: 13,
    ayahText: 'فَقَالَ لَهُمْ رَسُولُ اللَّهِ نَاقَةَ اللَّهِ وَسُقْيَاهَا',
    ayahTranslationEn: 'And the messenger of Allah said to them: [Do not harm] the she-camel of Allah or her drink.',
    clueAr: 'معجزة أخرجها الله من الصخرة لنبي الله صالح عليه السلام، كانت تسقيهم لبنًا وفيرًا.',
    clueEn: 'A miraculous she-camel brought forth from rock for Prophet Salih, providing rich milk for all.',
    factAr: 'سماها الله "ناقة الله" تشريفًا لها، وكانت لها نوبة شرب كاملة يوماً بيوم.',
    factEn: 'Allah honored her as "The She-Camel of Allah," having a designated drinking day.',
    stickerId: 'st-she-camel',
    themeColor: '#D97706',
  },
  {
    id: 'cow',
    nameAr: 'البقرة',
    nameEn: 'The Cow',
    emoji: '🐄',
    surahNameAr: 'سورة البقرة',
    surahNameEn: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 67,
    ayahText: 'وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا بَقَرَةً',
    ayahTranslationEn: 'And when Moses said to his people: Indeed, Allah commands you to slaughter a cow.',
    clueAr: 'سُميت بها أطول سورة في القرآن الكريم، وتضمنت قصة في عهد نبي الله موسى.',
    clueEn: 'The longest Surah in the Holy Quran is named after it, containing an event in Prophet Musa’s time.',
    factAr: 'سورة البقرة هي سنام القرآن وفيها أعظم آية وهي آية الكرسي.',
    factEn: 'Surah Al-Baqarah is the pinnacle of the Quran, containing the greatest verse, Ayat al-Kursi.',
    stickerId: 'st-cow',
    themeColor: '#059669',
  },
  {
    id: 'wolf',
    nameAr: 'الذئب',
    nameEn: 'The Wolf (in Prophet Yusuf’s story)',
    emoji: '🐺',
    surahNameAr: 'سورة يوسف',
    surahNameEn: 'Yusuf',
    surahNumber: 12,
    ayahNumber: 17,
    ayahText: 'قَالُوا يَا أَبَانَا إِنَّا ذَهَبْنَا نَسْتَبِقُ وَتَرَكْنَا يُوسُفَ عِندَ مَتَاعِنَا فَأَكَلَهُ الذِّئْبُ',
    ayahTranslationEn: 'They said: O our father, indeed we went racing each other and left Joseph with our possessions and a wolf consumed him.',
    clueAr: 'حيوان بري ادعى إخوة يوسف كذبًا أنه أكل أخاهم، وكان بريئاً من دم يوسف عليه السلام.',
    clueEn: 'A wild animal that Yusuf’s brothers falsely blamed, though it was innocent of harm.',
    factAr: 'الذئب كان بريئاً من دم يوسف، والقميص لم يكن ممزقاً فكشف يعقوب عليه السلام كذبهم.',
    factEn: 'The wolf was innocent of Yusuf’s blood, evidenced by his untorn shirt shown to Prophet Ya’qub.',
    stickerId: 'st-wolf',
    themeColor: '#64748B',
  },
  {
    id: 'spider',
    nameAr: 'العنكبوت',
    nameEn: 'The Spider',
    emoji: '🕷️',
    surahNameAr: 'سورة العنكبوت',
    surahNameEn: 'Al-\'Ankabut',
    surahNumber: 29,
    ayahNumber: 41,
    ayahText: 'مَثَلُ الَّذِينَ اتَّخَذُوا مِن دُونِ اللَّهِ أَوْلِيَاءَ كَمَثَلِ الْعَنكَبُوتِ اتَّخَذَتْ بَيْتًا ۖ وَإِنَّ أَوْهَنَ الْبُيُوتِ لَبَيْتُ الْعَنكَبُوتِ',
    ayahTranslationEn: 'The example of those who take allies other than Allah is like that of the spider who takes a home. And indeed, the weakest of homes is the home of the spider.',
    clueAr: 'حشرة تنسج خيوطاً رقيقة لبيتها، ونسجت خيوطها على غار ثور لحماية النبي ﷺ وصاحبه.',
    clueEn: 'Weaves intricate webs; spun its threads over Cave Thawr to protect Prophet Muhammad ﷺ and Abu Bakr.',
    factAr: 'سُميت سورة كاملة باسم العنكبوت، وضرب الله مثل ضعف الشرك بضعف بيت العنكبوت.',
    factEn: 'An entire Surah is named after it, illustrating the fragility of falsehood.',
    stickerId: 'st-spider',
    themeColor: '#475569',
  },
  {
    id: 'camel',
    nameAr: 'الإبل (الجمال)',
    nameEn: 'The Camels (Ship of the Desert)',
    emoji: '🐫',
    surahNameAr: 'سورة الغاشية',
    surahNameEn: 'Al-Ghashiyah',
    surahNumber: 88,
    ayahNumber: 17,
    ayahText: 'أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ',
    ayahTranslationEn: 'Then do they not look at the camels - how they are created?',
    clueAr: 'سفينة الصحراء الصبورة دعا الله الناس للتفكر في عجائب خلقها وقدرتها على الصبر والعطش.',
    clueEn: 'The patient ship of the desert; Allah invited mankind to reflect on how wonderfully it is created.',
    factAr: 'الإبل تتحمل العطش لأسابيع وتتحمل رمال الصحراء برمشين وأقدام مخصصة.',
    factEn: 'Camels can endure severe desert heat for weeks with specialized eyelids, nostrils, and padded feet.',
    stickerId: 'st-camel',
    themeColor: '#D97706',
  },
  {
    id: 'donkey',
    nameAr: 'الحمار',
    nameEn: 'The Donkey',
    emoji: '🫏',
    surahNameAr: 'سورة لقمان',
    surahNameEn: 'Luqman',
    surahNumber: 31,
    ayahNumber: 19,
    ayahText: 'وَاقْصِدْ فِي مَشْيِكَ وَاغْضُضْ مِن صَوْتِكَ ۚ إِنَّ أَنكَرَ الْأَصْوَاتِ لَصَوْتُ الْحَمِيرِ',
    ayahTranslationEn: 'And be moderate in your pace and lower your voice; indeed, the most disagreeable of sounds is the voice of donkeys.',
    clueAr: 'حيوان أليف صبور ذكر في وصايا لقمان الحكيم لابنه ليعلمه خفض الصوت والتأدب في الحديث.',
    clueEn: 'A gentle, patient animal cited in Luqman’s advice to his son to teach lowering one’s voice.',
    factAr: 'وصى لقمان ابنه بعدم الصراخ ورفع الصوت، وشبه الصوت العالي المزعج بنهيق الحمار.',
    factEn: 'Luqman instructed his son to speak gently and moderately without disruptive loudness.',
    stickerId: 'st-donkey',
    themeColor: '#6B7280',
  },
  {
    id: 'horse',
    nameAr: 'الخيل (العاديات)',
    nameEn: 'The Horses (Al-\'Adiyat)',
    emoji: '🐎',
    surahNameAr: 'سورة العاديات',
    surahNameEn: 'Al-\'Adiyat',
    surahNumber: 100,
    ayahNumber: 1,
    ayahText: 'وَالْعَادِيَاتِ ضَبْحًا * فَالْمُورِيَاتِ قَدْحًا',
    ayahTranslationEn: 'By the racers, panting, and the producers of sparks when striking...',
    clueAr: 'حيوان أصيل وسريع أقسم الله بجريه وسرعته وشرر حوافره في سورة العاديات.',
    clueEn: 'A noble, swift steed sworn by in Surah Al-Adiyat as it gallops producing sparks with its hooves.',
    factAr: 'الخيل معقود بنواصيها الخير إلى يوم القيامة كما قال النبي المصطفى ﷺ.',
    factEn: 'The Prophet ﷺ said that goodness is tied to the forelocks of noble horses until Judgment Day.',
    stickerId: 'st-horse',
    themeColor: '#92400E',
  },
  {
    id: 'fly',
    nameAr: 'الذباب',
    nameEn: 'The Fly',
    emoji: '🪰',
    surahNameAr: 'سورة الحج',
    surahNameEn: 'Al-Hajj',
    surahNumber: 22,
    ayahNumber: 73,
    ayahText: 'إِنَّ الَّذِينَ تَدْعُونَ مِن دُونِ اللَّهِ لَن يَخْلُقُوا ذُبَابًا وَلَوِ اجْتَمَعُوا لَهُ',
    ayahTranslationEn: 'Indeed, those you call upon besides Allah cannot create a fly, even if they gathered together for that purpose.',
    clueAr: 'حشرة صغيرة طائرة ضرب الله بها مثلاً أن كل من في الكون لا يستطيعون خلق ذبابة واحدة!',
    clueEn: 'A tiny flying insect cited as a divine proof that all combined beings cannot create a single fly!',
    factAr: 'تتحرك أجنحة الذبابة مئات المرات في الثانية ولها عيون مركبة تبصر في كل الاتجاهات.',
    factEn: 'A fly beats its wings hundreds of times per second and possesses complex 360-degree vision.',
    stickerId: 'st-fly',
    themeColor: '#374151',
  },
  {
    id: 'mosquito',
    nameAr: 'البعوضة',
    nameEn: 'The Mosquito',
    emoji: '🦟',
    surahNameAr: 'سورة البقرة',
    surahNameEn: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 26,
    ayahText: 'إِنَّ اللَّهَ لَا يَسْتَحْيِي أَن يَضْرِبَ مَثَلًا مَّا بَعُوضَةً فَمَا فَوْقَهَا',
    ayahTranslationEn: 'Indeed, Allah is not timid to present an example - that of a mosquito or what is above it.',
    clueAr: 'حشرة دقيقة جدًا لا يستحيي الله أن يضرب بها مثلاً، ففي جسدها الصغير مئات المعجزات والعيون والقلوب.',
    clueEn: 'A tiny creature Allah presented as an example, containing in its minuscule body intricate hearts and sensors.',
    factAr: 'اكتشف العلماء أن للبعوضة ثلاثة قلوب ومستشعرات حرارية دقيقة جدًا في قرون استشعارها.',
    factEn: 'Scientists discovered that a mosquito has three hearts and microscopic heat sensors in its antennae.',
    stickerId: 'st-mosquito',
    themeColor: '#4B5563',
  },
];

// 4. Guess the Animal Game Questions (خمّن حيوان القرآن)
export interface GuessAnimalRound {
  id: string;
  animalId: string;
  questionAr: string;
  questionEn: string;
  clueAr: string;
  clueEn: string;
  soundHintAr: string;
  soundHintEn: string;
  correctAnimalId: string;
  optionsAnimalIds: string[];
}

export const GUESS_ANIMAL_ROUNDS: GuessAnimalRound[] = [
  {
    id: 'g-1',
    animalId: 'ant',
    questionAr: 'من أنا؟ سمعني نبي الله سليمان وأنا أحذر قومي فتبسم ضاحكًا!',
    questionEn: 'Who am I? Prophet Solomon heard me warn my colony and smiled warmly!',
    clueAr: 'أعيش في مساكن تحت الأرض وأعمل بنشاط ومحبة..',
    clueEn: 'I live in dwellings in the earth and work with joyful teamwork..',
    soundHintAr: 'صوت خطوات دقيقة جدًا ونداء: ادخلوا مساكنكم!',
    soundHintEn: 'Tiny footsteps and a caring call: Enter your dwellings!',
    correctAnimalId: 'ant',
    optionsAnimalIds: ['ant', 'bee', 'spider', 'hoopoe'],
  },
  {
    id: 'g-2',
    animalId: 'whale',
    questionAr: 'من أنا؟ التقمت نبي الله يونس في ظلمات البحر وحفظته بأمر ربي!',
    questionEn: 'Who am I? I swallowed Prophet Yunus in the deep sea and kept him safe by Allah’s command!',
    clueAr: 'أنا أكبر مخلوقات البحر وأسبح في المحيطات الواسعة..',
    clueEn: 'I am the largest creature in the oceans, swimming in the deep blue waters..',
    soundHintAr: 'صوت أمواج المحيط العميقة وصدى الماء 🌊',
    soundHintEn: 'Deep ocean waves and echoing water resonance 🌊',
    correctAnimalId: 'whale',
    optionsAnimalIds: ['whale', 'elephant', 'she-camel', 'cow'],
  },
  {
    id: 'g-3',
    animalId: 'hoopoe',
    questionAr: 'من أنا؟ طائر جميل لدي تاج من الريش وحملت رسالة سليمان إلى ملكة سبأ!',
    questionEn: 'Who am I? A beautiful crested bird who delivered Solomon’s letter to the Queen of Sheba!',
    clueAr: 'أطير بسرعة وأبحث عن الحق..',
    clueEn: 'I fly swift and true, carrying glad tidings of truth..',
    soundHintAr: 'صوت رفرفة أجنحة وتغريد مميز: هُدْ هُدْ! 🪶',
    soundHintEn: 'Fluttering wings and a melodic call 🪶',
    correctAnimalId: 'hoopoe',
    optionsAnimalIds: ['hoopoe', 'crow', 'ant', 'bee'],
  },
  {
    id: 'g-4',
    animalId: 'elephant',
    questionAr: 'من أنا؟ أقبلت مع جيش أبرهة ولكنني بركت ورفضت هدم الكعبة المشرفة!',
    questionEn: 'Who am I? Brought with the marching army, yet knelt down refusing to harm the Kaaba!',
    clueAr: 'لدي خرطوم طويل وأذنان كبيرتان وجسم ضخم..',
    clueEn: 'I have a long trunk, large ears, and a majestic massive body..',
    soundHintAr: 'صوت هدر قوي وخطوات ثقيلة في الرمال 🐘',
    soundHintEn: 'A mighty rumble and heavy footsteps in the sand 🐘',
    correctAnimalId: 'elephant',
    optionsAnimalIds: ['elephant', 'she-camel', 'camel', 'horse'],
  },
  {
    id: 'g-5',
    animalId: 'bee',
    questionAr: 'من أنا؟ أوحى الله إليّ لأصنع بيوتاً سداسية وأخرج عسلاً فيه شفاء للناس!',
    questionEn: 'Who am I? Allah inspired me to build hexagonal homes and produce healing honey!',
    clueAr: 'أتنقل بين الزهور وأطير في البساتين..',
    clueEn: 'I buzz between blossoms and drink sweet nectar in gardens..',
    soundHintAr: 'طنين نشيط لطيف: زززززز! 🐝',
    soundHintEn: 'A gentle busy buzz: Bzzzzzz! 🐝',
    correctAnimalId: 'bee',
    optionsAnimalIds: ['bee', 'fly', 'mosquito', 'ant'],
  },
  {
    id: 'g-6',
    animalId: 'she-camel',
    questionAr: 'من أنا؟ أخرجني الله من الصخرة معجزة لنبي الله صالح عليه السلام وسقيتهم لبناً!',
    questionEn: 'Who am I? Brought forth from solid rock as a miracle for Prophet Salih, providing rich milk!',
    clueAr: 'ناقة مباركة كريمة ذات نوبة شرب معلومة..',
    clueEn: 'A blessed and honorable she-camel with a dedicated drinking day..',
    soundHintAr: 'صوت رغاء الإبل اللطيف في الوادي 🐪',
    soundHintEn: 'The gentle, resonant call of a camel across the desert 🐪',
    correctAnimalId: 'she-camel',
    optionsAnimalIds: ['she-camel', 'camel', 'cow', 'horse'],
  },
];
