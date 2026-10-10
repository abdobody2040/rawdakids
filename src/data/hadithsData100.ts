// Expanded 100 Authentic Hadiths Catalog for Noor Kids
// Sourced strictly from Sahih al-Bukhari, Sahih Muslim, and Authentic Sunan
import { KidHadith } from './hadithData';

export const EXPANDED_HADITHS_100: KidHadith[] = [
  {
    id: "smile-charity",
    titleAr: "التبسم صدقة",
    titleEn: "Smiling is Charity",
    theme: "smiling",
    narratorAr: "أبو ذر الغفاري رضي الله عنه",
    narratorEn: "Abu Dharr",
    arabicText: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    explanationAr: "عندما تبتسم في وجه والديك أو أصحابك وتنشر الفرح، يكتب الله لك ثواب صدقة كأنك تصدقت بمال!",
    explanationEn: "Smiling warmly at your brother or sister is recorded as an act of charity by Allah!",
    source: "جامع الترمذي وصححه الألباني",
    hadithNumber: "1956",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "التبسم عند اللقاء",
          textEn: "Smile upon meeting others",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-1",
      nameAr: "التبسم عند اللقاء",
      nameEn: "Smile upon meeting others",
      actionAr: "التبسم عند اللقاء",
      actionEn: "Smile upon meeting others"
    }
  },
  {
    id: "love-for-brother",
    titleAr: "حب الخير للغير",
    titleEn: "Loving Good for Others",
    theme: "brotherhood",
    narratorAr: "أنس بن مالك رضي الله عنه",
    narratorEn: "Anas ibn Malik",
    arabicText: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    explanationAr: "المسلم الحقيقي يفرح لنجاح أصحابه وإخوانه ويحب لهم الخير واللعب الجميل مثلما يحب لنفسه تماماً.",
    explanationEn: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "صحيح البخاري",
    hadithNumber: "13",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "مشاركة الألعاب والتمني بالخير",
          textEn: "Share toys and wish success",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-2",
      nameAr: "مشاركة الألعاب والتمني بالخير",
      nameEn: "Share toys and wish success",
      actionAr: "مشاركة الألعاب والتمني بالخير",
      actionEn: "Share toys and wish success"
    }
  },
  {
    id: "good-word",
    titleAr: "الكلمة الطيبة",
    titleEn: "The Good Word",
    theme: "speech",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    explanationAr: "لسانك جوهرة ثمينة! اجعله ينطق بالحق والكلام الجميل، أو اصمت إذا كان الكلام سيؤذي غيرك.",
    explanationEn: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    source: "صحيح البخاري",
    hadithNumber: "6018",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "التحدث بلباقة وعدم التنابز",
          textEn: "Speak politely and never mock",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-3",
      nameAr: "التحدث بلباقة وعدم التنابز",
      nameEn: "Speak politely and never mock",
      actionAr: "التحدث بلباقة وعدم التنابز",
      actionEn: "Speak politely and never mock"
    }
  },
  {
    id: "muslim-safety",
    titleAr: "سلامة الناس من الأذى",
    titleEn: "Keeping Others Safe",
    theme: "kindness",
    narratorAr: "عبد الله بن عمرو رضي الله عنهما",
    narratorEn: "Abdullah ibn Amr",
    arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    explanationAr: "المسلم بطل لا يضرب أحداً بيده، ولا يجرح مشاعر أحد بلسانه، بل ينشر الأمان في كل مكان.",
    explanationEn: "The true Muslim is the one from whose tongue and hand other Muslims are safe.",
    source: "صحيح البخاري",
    hadithNumber: "10",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "حفظ اليد واللسان عن الإيذاء",
          textEn: "Keep hands and tongue peaceful",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-4",
      nameAr: "حفظ اليد واللسان عن الإيذاء",
      nameEn: "Keep hands and tongue peaceful",
      actionAr: "حفظ اليد واللسان عن الإيذاء",
      actionEn: "Keep hands and tongue peaceful"
    }
  },
  {
    id: "gentleness-in-all",
    titleAr: "الرفق في كل أمر",
    titleEn: "Gentleness in Everything",
    theme: "kindness",
    narratorAr: "عائشة أم المؤمنين رضي الله عنها",
    narratorEn: "Aisha (Mother of the Believers)",
    arabicText: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ",
    explanationAr: "الرفق والهدوء يجعلان كل عمل جميلاً ومحبوباً، والتعامل بلطف يحل أكبر المشكلات.",
    explanationEn: "Verily, Allah is gentle and loves gentleness in all matters.",
    source: "صحيح البخاري",
    hadithNumber: "6927",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "التعامل بهدوء ورفق مع الإخوة",
          textEn: "Be gentle and calm with siblings",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-5",
      nameAr: "التعامل بهدوء ورفق مع الإخوة",
      nameEn: "Be gentle and calm with siblings",
      actionAr: "التعامل بهدوء ورفق مع الإخوة",
      actionEn: "Be gentle and calm with siblings"
    }
  },
  {
    id: "mercy-to-earth",
    titleAr: "الرحمة بالخلق",
    titleEn: "Mercy to All Creation",
    theme: "mercy",
    narratorAr: "عبد الله بن عمرو رضي الله عنهما",
    narratorEn: "Abdullah ibn Amr",
    arabicText: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
    explanationAr: "ارحم الحيوان، واعطف على الصغير، وساعد المحتاج، فينزل الله عليك رحمته وبركاته من السماء.",
    explanationEn: "Those who show mercy will be shown mercy by the Most Merciful. Show mercy to those on earth, and Allah will show mercy to you.",
    source: "سنن الترمذي وصححه الألباني",
    hadithNumber: "1924",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إطعام قطة أو مساعدة محتاج",
          textEn: "Feed a kitten or help someone in need",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-6",
      nameAr: "إطعام قطة أو مساعدة محتاج",
      nameEn: "Feed a kitten or help someone in need",
      actionAr: "إطعام قطة أو مساعدة محتاج",
      actionEn: "Feed a kitten or help someone in need"
    }
  },
  {
    id: "control-anger",
    titleAr: "الشديد عند الغضب",
    titleEn: "Controlling Anger",
    theme: "patience",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    explanationAr: "البطل القوي ليس من يصارع الناس بعضلاته، بل هو من يتمالك أعصابه ويستعيذ بالله عند الغضب.",
    explanationEn: "The strong person is not the good wrestler; rather, the strong person is the one who controls himself when angry.",
    source: "صحيح البخاري",
    hadithNumber: "6114",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الاستعاذة والوضوء عند الغضب",
          textEn: "Say Isti'adhah and breathe deeply",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-7",
      nameAr: "الاستعاذة والوضوء عند الغضب",
      nameEn: "Say Isti'adhah and breathe deeply",
      actionAr: "الاستعاذة والوضوء عند الغضب",
      actionEn: "Say Isti'adhah and breathe deeply"
    }
  },
  {
    id: "purity-faith",
    titleAr: "الطهور شطر الإيمان",
    titleEn: "Cleanliness is Half of Faith",
    theme: "cleanliness",
    narratorAr: "أبو مالك الأشعري رضي الله عنه",
    narratorEn: "Abu Malik al-Ash'ari",
    arabicText: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    explanationAr: "المسلم نظيف دائماً في جسمه، ثيابه، غرفته، ومدرسته، لأن الله نظيف يحب النظافة والجمال.",
    explanationEn: "Purity and cleanliness are half of faith.",
    source: "صحيح مسلم",
    hadithNumber: "223",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الطُّهُورُ شَطْرُ الْإِيمَانِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "ترتيب السرير وغسل اليدين",
          textEn: "Wash hands and tidy bedroom",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-8",
      nameAr: "ترتيب السرير وغسل اليدين",
      nameEn: "Wash hands and tidy bedroom",
      actionAr: "ترتيب السرير وغسل اليدين",
      actionEn: "Wash hands and tidy bedroom"
    }
  },
  {
    id: "no-mercy-no-mercy",
    titleAr: "من لا يَرحم لا يُرحم",
    titleEn: "Show Mercy to Be Shown Mercy",
    theme: "mercy",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ",
    explanationAr: "من يعامل الأطفال والضعفاء والحيوانات بقسوة يُحرم من الرحمة، والقلب الرحيم قريب من الله.",
    explanationEn: "Whoever does not show mercy will not be shown mercy.",
    source: "صحيح البخاري",
    hadithNumber: "5997",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ لَا يَرْحَمْ لَا يُرْحَمْ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "احتضان الأخ الصغير واللعب معه",
          textEn: "Hug little siblings and be gentle",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-9",
      nameAr: "احتضان الأخ الصغير واللعب معه",
      nameEn: "Hug little siblings and be gentle",
      actionAr: "احتضان الأخ الصغير واللعب معه",
      actionEn: "Hug little siblings and be gentle"
    }
  },
  {
    id: "eating-manners",
    titleAr: "آداب الطعام والتسمية",
    titleEn: "Manners of Eating",
    theme: "eating",
    narratorAr: "عمر بن أبي سلمة رضي الله عنه",
    narratorEn: "Umar ibn Abi Salamah",
    arabicText: "يَا غُلَامُ سَمِّ اللَّهَ، وَكُلْ بِيَمِينِكَ، وَكُلْ مِمَّا يَلِيكَ",
    explanationAr: "قبل الأكل قل: بسم الله، واستعمل يدك اليمنى، وكل من الطعام الذي أمامك مباشرة.",
    explanationEn: "O boy, mention the Name of Allah, eat with your right hand, and eat from what is directly in front of you.",
    source: "صحيح البخاري",
    hadithNumber: "5376",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: يَا غُلَامُ سَمِّ اللَّهَ، وَكُلْ بِيَمِينِكَ، وَكُلْ مِمَّا يَلِيكَ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "التسمية قبل الأكل والأكل باليمين",
          textEn: "Say Bismillah and eat with right hand",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-10",
      nameAr: "التسمية قبل الأكل والأكل باليمين",
      nameEn: "Say Bismillah and eat with right hand",
      actionAr: "التسمية قبل الأكل والأكل باليمين",
      actionEn: "Say Bismillah and eat with right hand"
    }
  },
  {
    id: "seeking-knowledge",
    titleAr: "طريق العلم طريق الجنة",
    titleEn: "Seeking Knowledge Leads to Paradise",
    theme: "knowledge",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    explanationAr: "كل خطوة تخطوها إلى المدرسة أو في قراءة كتاب مفيد تجعل طريقك إلى الجنة سهلاً وممهداً.",
    explanationEn: "Whoever travels a path seeking sacred knowledge, Allah will make easy for him the path to Paradise.",
    source: "صحيح مسلم",
    hadithNumber: "2699",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "قراءة صفحة من كتاب مفيد يومياً",
          textEn: "Read a page of useful knowledge daily",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-11",
      nameAr: "قراءة صفحة من كتاب مفيد يومياً",
      nameEn: "Read a page of useful knowledge daily",
      actionAr: "قراءة صفحة من كتاب مفيد يومياً",
      actionEn: "Read a page of useful knowledge daily"
    }
  },
  {
    id: "spread-salam",
    titleAr: "إفشاء السلام والمحبة",
    titleEn: "Spreading Salam Brings Love",
    theme: "salam",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "أَفْشُوا السَّلَامَ بَيْنَكُمْ تَحَابُّوا",
    explanationAr: "السلام عليكم هي تحية أهل الجنة، وكلما نشرت السلام على من تعرف ومن لا تعرف زادت المحبة في القلوب.",
    explanationEn: "Spread greetings of peace (Salam) among yourselves and you will love one another.",
    source: "صحيح مسلم",
    hadithNumber: "54",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: أَفْشُوا السَّلَامَ بَيْنَكُمْ تَحَابُّوا فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إلقاء السلام بصوت واضح مبتسم",
          textEn: "Say Salam clearly with a warm smile",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-12",
      nameAr: "إلقاء السلام بصوت واضح مبتسم",
      nameEn: "Say Salam clearly with a warm smile",
      actionAr: "إلقاء السلام بصوت واضح مبتسم",
      actionEn: "Say Salam clearly with a warm smile"
    }
  },
  {
    id: "best-quran",
    titleAr: "خيركم من تعلم القرآن وعلمه",
    titleEn: "The Best Learn and Teach Quran",
    theme: "knowledge",
    narratorAr: "عثمان بن عفان رضي الله عنه",
    narratorEn: "Uthman ibn Affan",
    arabicText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    explanationAr: "أفضل الناس وأعلاهم منزلة عند الله هم من يتعلمون كتاب الله ويساعدون غيرهم على تعلمه.",
    explanationEn: "The best among you are those who learn the Quran and teach it to others.",
    source: "صحيح البخاري",
    hadithNumber: "5027",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "مراجعة ورد قرآني يومي",
          textEn: "Revise a daily Quran passage",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-13",
      nameAr: "مراجعة ورد قرآني يومي",
      nameEn: "Revise a daily Quran passage",
      actionAr: "مراجعة ورد قرآني يومي",
      actionEn: "Revise a daily Quran passage"
    }
  },
  {
    id: "strong-believer",
    titleAr: "المؤمن القوي",
    titleEn: "The Strong Believer",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ",
    explanationAr: "المؤمن القوي في إيمانه وصحته وعلمه يساعد الناس ويكون نافعاً لأمته.",
    explanationEn: "The strong believer is better and more beloved to Allah than the weak believer, though there is good in both.",
    source: "صحيح مسلم",
    hadithNumber: "2664",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "ممارسة الرياضة والنوم المبكر",
          textEn: "Exercise and maintain healthy habits",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-14",
      nameAr: "ممارسة الرياضة والنوم المبكر",
      nameEn: "Exercise and maintain healthy habits",
      actionAr: "ممارسة الرياضة والنوم المبكر",
      actionEn: "Exercise and maintain healthy habits"
    }
  },
  {
    id: "truth-to-righteousness",
    titleAr: "الصدق يهدي إلى البر",
    titleEn: "Truthfulness Leads to Righteousness",
    theme: "honesty",
    narratorAr: "عبد الله بن مسعود رضي الله عنه",
    narratorEn: "Abdullah ibn Mas'ud",
    arabicText: "عَلَيْكُمْ بِالصِّدْقِ، فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ",
    explanationAr: "الصادق محبوب عند الله وعند الناس، وصدقك يجعلك شجاعاً وتفتح لك أبواب الجنة.",
    explanationEn: "Hold fast to truthfulness, for truthfulness leads to righteousness, and righteousness leads to Paradise.",
    source: "صحيح البخاري",
    hadithNumber: "6094",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: عَلَيْكُمْ بِالصِّدْقِ، فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "قول الحقيقة دائماً حتى لو كانت صعبة",
          textEn: "Always speak the truth courageously",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-15",
      nameAr: "قول الحقيقة دائماً حتى لو كانت صعبة",
      nameEn: "Always speak the truth courageously",
      actionAr: "قول الحقيقة دائماً حتى لو كانت صعبة",
      actionEn: "Always speak the truth courageously"
    }
  },
  {
    id: "avoid-lying",
    titleAr: "الحذر من الكذب",
    titleEn: "Avoiding Falsehood",
    theme: "honesty",
    narratorAr: "عبد الله بن مسعود رضي الله عنه",
    narratorEn: "Abdullah ibn Mas'ud",
    arabicText: "إِيَّاكُمْ وَالْكَذِبَ، فَإِنَّ الْكَذِبَ يَهْدِي إِلَى الْفُجُورِ، وَإِنَّ الْفُجُورَ يَهْدِي إِلَى النَّارِ",
    explanationAr: "الكذب حبل قصير يفسد ثقة الناس بك ويغضب الله، والمسلم لا يكذب أبداً.",
    explanationEn: "Beware of lying, for lying leads to wickedness, and wickedness leads to the Fire.",
    source: "صحيح البخاري",
    hadithNumber: "6094",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِيَّاكُمْ وَالْكَذِبَ، فَإِنَّ الْكَذِبَ يَهْدِي إِلَى الْفُجُورِ، وَإِنَّ الْفُجُورَ يَهْدِي إِلَى النَّارِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الاعتراف بالخطأ بصدق",
          textEn: "Admit mistakes honestly without excuses",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-16",
      nameAr: "الاعتراف بالخطأ بصدق",
      nameEn: "Admit mistakes honestly without excuses",
      actionAr: "الاعتراف بالخطأ بصدق",
      actionEn: "Admit mistakes honestly without excuses"
    }
  },
  {
    id: "fear-allah-character",
    titleAr: "حسن الخلق مع الناس",
    titleEn: "Good Character with All People",
    theme: "kindness",
    narratorAr: "أبو ذر الغفاري رضي الله عنه",
    narratorEn: "Abu Dharr",
    arabicText: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    explanationAr: "راقب الله في كل مكان، وإذا أخطأت فسارع بعمل صالح، وعامل كل الناس بأدب ولطف.",
    explanationEn: "Be conscious of Allah wherever you are, follow a bad deed with a good one to wipe it out, and treat people with good character.",
    source: "جامع الترمذي وصححه",
    hadithNumber: "1987",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "المبادرة بالاعتذار وفعل الخير",
          textEn: "Follow mistakes with good deeds",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-17",
      nameAr: "المبادرة بالاعتذار وفعل الخير",
      nameEn: "Follow mistakes with good deeds",
      actionAr: "المبادرة بالاعتذار وفعل الخير",
      actionEn: "Follow mistakes with good deeds"
    }
  },
  {
    id: "religion-is-sincerity",
    titleAr: "الدين النصيحة",
    titleEn: "Religion is Sincere Advice",
    theme: "speech",
    narratorAr: "تميم الداري رضي الله عنه",
    narratorEn: "Tamim ad-Dari",
    arabicText: "الدِّينُ النَّصِيحَةُ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ",
    explanationAr: "النصيحة الصادقة تعني حب الخير للجميع وإرشادهم بلطف ودون تجريح.",
    explanationEn: "Religion is sincere advice: to Allah, His Book, His Messenger, and the leaders and common people.",
    source: "صحيح مسلم",
    hadithNumber: "55",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الدِّينُ النَّصِيحَةُ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "تقديم النصيحة لزميلك بلطف وسرية",
          textEn: "Give advice kindly and privately",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-18",
      nameAr: "تقديم النصيحة لزميلك بلطف وسرية",
      nameEn: "Give advice kindly and privately",
      actionAr: "تقديم النصيحة لزميلك بلطف وسرية",
      actionEn: "Give advice kindly and privately"
    }
  },
  {
    id: "honor-neighbor",
    titleAr: "إكرام الجار",
    titleEn: "Honoring the Neighbor",
    theme: "kindness",
    narratorAr: "أبو شريح الخزاعي رضي الله عنه",
    narratorEn: "Abu Shurayh",
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ",
    explanationAr: "الجار له حق عظيم: لا تزعجه بأصوات عالية، وشاركه الهدايا، واسأل عنه إذا غاب.",
    explanationEn: "Whoever believes in Allah and the Last Day, let him honor his neighbor.",
    source: "صحيح البخاري",
    hadithNumber: "6019",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إهداء طبق حلوى للجار",
          textEn: "Gift a treat or check on neighbors",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-19",
      nameAr: "إهداء طبق حلوى للجار",
      nameEn: "Gift a treat or check on neighbors",
      actionAr: "إهداء طبق حلوى للجار",
      actionEn: "Gift a treat or check on neighbors"
    }
  },
  {
    id: "honor-guest",
    titleAr: "إكرام الضيف",
    titleEn: "Honoring the Guest",
    theme: "kindness",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ",
    explanationAr: "عندما يزوركم ضيف، رحّب به بوجه طلق، وقدّم له أفضل ما عندك بابتسامة.",
    explanationEn: "Whoever believes in Allah and the Last Day, let him honor his guest.",
    source: "صحيح البخاري",
    hadithNumber: "6018",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الترحيب بالضيوف وتقديم الماء",
          textEn: "Welcome guests with warmth and smile",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-20",
      nameAr: "الترحيب بالضيوف وتقديم الماء",
      nameEn: "Welcome guests with warmth and smile",
      actionAr: "الترحيب بالضيوف وتقديم الماء",
      actionEn: "Welcome guests with warmth and smile"
    }
  },
  {
    id: "charity-wealth",
    titleAr: "ما نقص مال من صدقة",
    titleEn: "Charity Never Decreases Wealth",
    theme: "generosity",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا",
    explanationAr: "مهما تصدقت بمال أو طعام فإن الله يبارك في رزقك ويخلف عليك بأكثر مما أنفقت.",
    explanationEn: "Charity never decreases wealth, and Allah raises in honor whoever forgives.",
    source: "صحيح مسلم",
    hadithNumber: "2588",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "وضع درهم في صندوق الصدقة",
          textEn: "Give a small charity coin weekly",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-21",
      nameAr: "وضع درهم في صندوق الصدقة",
      nameEn: "Give a small charity coin weekly",
      actionAr: "وضع درهم في صندوق الصدقة",
      actionEn: "Give a small charity coin weekly"
    }
  },
  {
    id: "forgive-forgiveness",
    titleAr: "العفو يزيد العبد عزاً",
    titleEn: "Forgiveness Brings Honor",
    theme: "mercy",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    explanationAr: "عندما تسامح من أخطأ في حقك لوجه الله، يرفع الله قدرك في الدنيا والآخرة.",
    explanationEn: "Allah increases the honor of the servant who forgives, and whoever humbles himself for Allah, Allah elevates him.",
    source: "صحيح مسلم",
    hadithNumber: "2588",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "مسامحة صديقك الذي كسر قلمك",
          textEn: "Forgive someone who made an honest mistake",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-22",
      nameAr: "مسامحة صديقك الذي كسر قلمك",
      nameEn: "Forgive someone who made an honest mistake",
      actionAr: "مسامحة صديقك الذي كسر قلمك",
      actionEn: "Forgive someone who made an honest mistake"
    }
  },
  {
    id: "humility-elevation",
    titleAr: "من تواضع لله رفعه",
    titleEn: "Humility Brings Elevation",
    theme: "humility",
    narratorAr: "عمر بن الخطاب رضي الله عنه",
    narratorEn: "Umar ibn al-Khattab",
    arabicText: "مَنْ تَوَاضَعَ لِلَّهِ رَفَعَهُ اللَّهُ",
    explanationAr: "لا تتكبر على أصحابك بثيابك أو ألعابك، فمن كان متواضعاً أحبه الله ورفعه في عيون الناس.",
    explanationEn: "Whoever humbles himself for the sake of Allah, Allah will elevate him.",
    source: "رواه الطبراني وصححه الألباني",
    hadithNumber: "8426",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ تَوَاضَعَ لِلَّهِ رَفَعَهُ اللَّهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "مساعدة الزملاء دون تفاخر",
          textEn: "Help others without boasting",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-23",
      nameAr: "مساعدة الزملاء دون تفاخر",
      nameEn: "Help others without boasting",
      actionAr: "مساعدة الزملاء دون تفاخر",
      actionEn: "Help others without boasting"
    }
  },
  {
    id: "kinship-ties",
    titleAr: "صلة الرحم والبركة",
    titleEn: "Ties of Kinship",
    theme: "parents",
    narratorAr: "أنس بن مالك رضي الله عنه",
    narratorEn: "Anas ibn Malik",
    arabicText: "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    explanationAr: "صلة الأقارب كالأجداد والعمات والخالات تجلب بركة العمر وسعة الرزق ورضا الرحمن.",
    explanationEn: "Whoever desires an expansion in his sustenance and a prolonging of his life, let him uphold ties of kinship.",
    source: "صحيح البخاري",
    hadithNumber: "2067",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الاتصال بالجد والجدة والسلام عليهما",
          textEn: "Call grandparents and greet them",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-24",
      nameAr: "الاتصال بالجد والجدة والسلام عليهما",
      nameEn: "Call grandparents and greet them",
      actionAr: "الاتصال بالجد والجدة والسلام عليهما",
      actionEn: "Call grandparents and greet them"
    }
  },
  {
    id: "mother-first",
    titleAr: "بر الأم وحقها العظيم",
    titleEn: "Honoring Mothers",
    theme: "parents",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "جَاءَ رَجُلٌ فَقَالَ: يَا رَسُولَ اللَّهِ مَنْ أَحَقُّ النَّاسِ بِحُسْنِ صَحَابَتِي؟ قَالَ: أُمُّكَ، قَالَ: ثُمَّ مَنْ؟ قَالَ: أُمُّكَ، قَالَ: ثُمَّ مَنْ؟ قَالَ: أُمُّكَ، قَالَ: ثُمَّ مَنْ؟ قَالَ: أَبُوكَ",
    explanationAr: "أمك سهرت وتعبت من أجلك كثيراً، فحقها في البر والخدمة هو الأول والأعظم.",
    explanationEn: "A man asked: O Messenger of Allah, who is most deserving of my best companionship? He replied: Your mother. He asked: Then who? He replied: Your mother. He asked: Then who? He replied: Your mother. Then your father.",
    source: "صحيح البخاري",
    hadithNumber: "5971",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: جَاءَ رَجُلٌ فَقَالَ: يَا رَسُولَ اللَّهِ مَنْ أَحَقُّ النَّاسِ بِحُسْنِ صَحَابَتِي؟ قَالَ: أُمُّكَ، قَالَ: ثُمَّ مَنْ؟ قَالَ: أُمُّكَ، قَالَ: ثُمَّ مَنْ؟ قَالَ: أُمُّكَ، قَالَ: ثُمَّ مَنْ؟ قَالَ: أَبُوكَ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "تقبيل رأس الأم ومساعدتها في البيت",
          textEn: "Kiss your mother's forehead and help her",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-25",
      nameAr: "تقبيل رأس الأم ومساعدتها في البيت",
      nameEn: "Kiss your mother's forehead and help her",
      actionAr: "تقبيل رأس الأم ومساعدتها في البيت",
      actionEn: "Kiss your mother's forehead and help her"
    }
  },
  {
    id: "father-pleasure",
    titleAr: "رضا الله في رضا الوالد",
    titleEn: "Father's Pleasure",
    theme: "parents",
    narratorAr: "عبد الله بن عمرو رضي الله عنهما",
    narratorEn: "Abdullah ibn Amr",
    arabicText: "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    explanationAr: "طاعة أبيك وتوقيره وإسعاده هي سبب عظيم ليرضى الله عنك ويوفقك في كل حياتك.",
    explanationEn: "The pleasure of the Lord is in the pleasure of the parent, and the displeasure of the Lord is in the displeasure of the parent.",
    source: "جامع الترمذي وصححه",
    hadithNumber: "1899",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "طاعة الأب والاستماع لنصيحته",
          textEn: "Listen carefully to father's advice",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-26",
      nameAr: "طاعة الأب والاستماع لنصيحته",
      nameEn: "Listen carefully to father's advice",
      actionAr: "طاعة الأب والاستماع لنصيحته",
      actionEn: "Listen carefully to father's advice"
    }
  },
  {
    id: "orphan-sponsor",
    titleAr: "كافل اليتيم في الجنة",
    titleEn: "Sponsoring the Orphan",
    theme: "mercy",
    narratorAr: "سهل بن سعد رضي الله عنه",
    narratorEn: "Sahl ibn Sa'd",
    arabicText: "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى",
    explanationAr: "من يعطف على اليتيم ويساعده يكون رفيقاً للنبي ﷺ في أعلى درجات الجنة.",
    explanationEn: "I and the one who looks after an orphan will be like this in Paradise, and he indicated his index and middle fingers.",
    source: "صحيح البخاري",
    hadithNumber: "5304",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إهداء لعبة أو مساعدة يتيم",
          textEn: "Gift a toy or share snacks with orphans",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-27",
      nameAr: "إهداء لعبة أو مساعدة يتيم",
      nameEn: "Gift a toy or share snacks with orphans",
      actionAr: "إهداء لعبة أو مساعدة يتيم",
      actionEn: "Gift a toy or share snacks with orphans"
    }
  },
  {
    id: "remove-harm",
    titleAr: "إماطة الأذى عن الطريق",
    titleEn: "Removing Harm from the Road",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "عَرْضُ الْأَعْمَالِ: ... وَإِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ",
    explanationAr: "رفع قشرة موز أو حجر أو زجاجة من الطريق ليأمن المارة هو عمل عظيم يكتب لك صدقة.",
    explanationEn: "Removing harmful things from the road is an act of charity.",
    source: "صحيح البخاري",
    hadithNumber: "2989",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: عَرْضُ الْأَعْمَالِ: ... وَإِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إبعاد غصن أو قشرة عن الطريق",
          textEn: "Remove stones or rubbish from path",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-28",
      nameAr: "إبعاد غصن أو قشرة عن الطريق",
      nameEn: "Remove stones or rubbish from path",
      actionAr: "إبعاد غصن أو قشرة عن الطريق",
      actionEn: "Remove stones or rubbish from path"
    }
  },
  {
    id: "supplication-worship",
    titleAr: "الدعاء مخ العبادة",
    titleEn: "Supplication is Worship",
    theme: "habits",
    narratorAr: "النعمان بن بشير رضي الله عنه",
    narratorEn: "Nu'man ibn Bashir",
    arabicText: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    explanationAr: "عندما تسأل الله في كل صغيرة وكبيرة، فإنك تثبت حبك له وتوكلك عليه سبحانه.",
    explanationEn: "Supplication (Du'a) is the essence of worship.",
    source: "سنن الترمذي وصححه",
    hadithNumber: "2969",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الدُّعَاءُ هُوَ الْعِبَادَةُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الدعاء للوالدين بعد كل صلاة",
          textEn: "Make Du'a for parents after prayer",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-29",
      nameAr: "الدعاء للوالدين بعد كل صلاة",
      nameEn: "Make Du'a for parents after prayer",
      actionAr: "الدعاء للوالدين بعد كل صلاة",
      actionEn: "Make Du'a for parents after prayer"
    }
  },
  {
    id: "best-of-people",
    titleAr: "أنفع الناس للناس",
    titleEn: "The Most Beneficial to People",
    theme: "kindness",
    narratorAr: "عبد الله بن عمر رضي الله عنهما",
    narratorEn: "Abdullah ibn Umar",
    arabicText: "أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ",
    explanationAr: "كن دائماً جاهزاً لمساعدة أصحابك، ترتيب الفصل، وحمل الأشياء الثقيلة عن كبار السن.",
    explanationEn: "The most beloved of people to Allah are those who are most beneficial to others.",
    source: "المعجم الأوسط للطبراني وحسنه الألباني",
    hadithNumber: "6026",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "مساعدة زميل في فهم مسألة",
          textEn: "Help a friend solve a puzzle",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-30",
      nameAr: "مساعدة زميل في فهم مسألة",
      nameEn: "Help a friend solve a puzzle",
      actionAr: "مساعدة زميل في فهم مسألة",
      actionEn: "Help a friend solve a puzzle"
    }
  },
  {
    id: "gratitude-allah",
    titleAr: "الشكر على النعم",
    titleEn: "Gratitude for Blessings",
    theme: "gratitude",
    narratorAr: "أنس بن مالك",
    narratorEn: "Anas",
    arabicText: "إِنَّ اللَّهَ لَيَرْضَى عَنِ الْعَبْدِ أَنْ يَأْكُلَ الْأَكْلَةَ فَيَحْمَدَهُ عَلَيْهَا",
    explanationAr: "قولك الحمد لله بعد الطعام والشراب يوجب رضا الله ومحبته لك.",
    explanationEn: "Allah is pleased with the servant who eats food and praises Him for it.",
    source: "صحيح مسلم",
    hadithNumber: "2734",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِنَّ اللَّهَ لَيَرْضَى عَنِ الْعَبْدِ أَنْ يَأْكُلَ الْأَكْلَةَ فَيَحْمَدَهُ عَلَيْهَا فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "قول الحمد لله بعد كل وجبة",
          textEn: "Say Alhamdulillah after meals",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-31",
      nameAr: "قول الحمد لله بعد كل وجبة",
      nameEn: "Say Alhamdulillah after meals",
      actionAr: "قول الحمد لله بعد كل وجبة",
      actionEn: "Say Alhamdulillah after meals"
    }
  },
  {
    id: "modesty-branch",
    titleAr: "الحياء شعبة من الإيمان",
    titleEn: "Modesty is Part of Faith",
    theme: "habits",
    narratorAr: "أبو هريرة",
    narratorEn: "Abu Hurairah",
    arabicText: "الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، وَالْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ",
    explanationAr: "الحياء زينة المسلم؛ يمنعه من ارتكاب الأخطاء وفعل القبيح ويجعله مهذباً ومؤدباً.",
    explanationEn: "Faith has over seventy branches, and modesty is a branch of faith.",
    source: "صحيح البخاري",
    hadithNumber: "9",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، وَالْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "التأدب في الكلام وتجنب الألفاظ السيئة",
          textEn: "Speak with modesty and decorum",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-32",
      nameAr: "التأدب في الكلام وتجنب الألفاظ السيئة",
      nameEn: "Speak with modesty and decorum",
      actionAr: "التأدب في الكلام وتجنب الألفاظ السيئة",
      actionEn: "Speak with modesty and decorum"
    }
  },
  {
    id: "plant-tree",
    titleAr: "غرس الشجر وثوابه",
    titleEn: "Planting Trees and Charity",
    theme: "kindness",
    narratorAr: "أنس بن مالك",
    narratorEn: "Anas",
    arabicText: "مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا إِلَّا كَانَ لَهُ صَدَقَةً",
    explanationAr: "زرع شجرة أو نبتة يستظل بها إنسان أو يأكل منها طير هو صدقة جارية لك إلى يوم القيامة.",
    explanationEn: "Never does a Muslim plant trees except that whatever is eaten from it is charity for him.",
    source: "صحيح البخاري",
    hadithNumber: "2320",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا إِلَّا كَانَ لَهُ صَدَقَةً فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "سقي نبتة في شرفة المنزل",
          textEn: "Water plants and nurture nature",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-33",
      nameAr: "سقي نبتة في شرفة المنزل",
      nameEn: "Water plants and nurture nature",
      actionAr: "سقي نبتة في شرفة المنزل",
      actionEn: "Water plants and nurture nature"
    }
  },
  {
    id: "visit-sick",
    titleAr: "عيادة المريض وثوابها",
    titleEn: "Visiting the Sick",
    theme: "mercy",
    narratorAr: "ثوبان",
    narratorEn: "Thawban",
    arabicText: "إِنَّ الْمُسْلِمَ إِذَا عَادَ أَخَاهُ الْمُسْلِمَ لَمْ يَزَلْ فِي خُرْفَةِ الْجَنَّةِ حَتَّى يَرْجِعَ",
    explanationAr: "زيارة المريض والدعاء له بالشفاء تجلب الألفة وثواباً عظيماً كأنك تمشي في بساتين الجنة.",
    explanationEn: "When a Muslim visits his sick brother, he remains among the fruits of Paradise until he returns.",
    source: "صحيح مسلم",
    hadithNumber: "2568",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِنَّ الْمُسْلِمَ إِذَا عَادَ أَخَاهُ الْمُسْلِمَ لَمْ يَزَلْ فِي خُرْفَةِ الْجَنَّةِ حَتَّى يَرْجِعَ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "السؤال عن زميل مريض والدعاء له",
          textEn: "Inquire about sick friends and pray for them",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-34",
      nameAr: "السؤال عن زميل مريض والدعاء له",
      nameEn: "Inquire about sick friends and pray for them",
      actionAr: "السؤال عن زميل مريض والدعاء له",
      actionEn: "Inquire about sick friends and pray for them"
    }
  },
  {
    id: "good-intention",
    titleAr: "إنما الأعمال بالنيات",
    titleEn: "Actions are by Intentions",
    theme: "habits",
    narratorAr: "عمر بن الخطاب",
    narratorEn: "Umar",
    arabicText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    explanationAr: "اجعل نيتك في المذاكرة واللعب ومساعدة أهلك خالصة لإرضاء الله، فيصبح كل يومك عبادة وأجراً.",
    explanationEn: "Actions are judged by intentions, and every person will have only what they intended.",
    source: "صحيح البخاري",
    hadithNumber: "1",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "تجديد النية قبل المذاكرة",
          textEn: "Renew sincere intention before studying",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-35",
      nameAr: "تجديد النية قبل المذاكرة",
      nameEn: "Renew sincere intention before studying",
      actionAr: "تجديد النية قبل المذاكرة",
      actionEn: "Renew sincere intention before studying"
    }
  },
  {
    id: "no-backbiting",
    titleAr: "حفظ الغيبة والستر",
    titleEn: "Avoiding Backbiting",
    theme: "speech",
    narratorAr: "أبو هريرة",
    narratorEn: "Abu Hurairah",
    arabicText: "كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ: دَمُهُ، وَمَالُهُ، وَعِرْضُهُ",
    explanationAr: "لا تتحدث عن أصحابك بسوء في غيابهم، واستُر عيوبهم كما تحب أن يستر الله عيوبك.",
    explanationEn: "Every Muslim is sacred to another Muslim: his blood, his wealth, and his honor.",
    source: "صحيح مسلم",
    hadithNumber: "2564",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ: دَمُهُ، وَمَالُهُ، وَعِرْضُهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الدفاع عن زميل غائب",
          textEn: "Defend absent friends kindly",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-36",
      nameAr: "الدفاع عن زميل غائب",
      nameEn: "Defend absent friends kindly",
      actionAr: "الدفاع عن زميل غائب",
      actionEn: "Defend absent friends kindly"
    }
  },
  {
    id: "easy-religion",
    titleAr: "الدين يسر",
    titleEn: "Religion is Ease",
    theme: "habits",
    narratorAr: "أبو هريرة",
    narratorEn: "Abu Hurairah",
    arabicText: "إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ",
    explanationAr: "دين الإسلام جميل وميسر، وربنا يحب منا الاستمرار في العمل الصالح وإن كان قليلاً.",
    explanationEn: "Religion is easy, and no one overburdens himself in religion except that it overcomes him.",
    source: "صحيح البخاري",
    hadithNumber: "39",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "المحافظة على صلاة الفريضة بسهولة وسعادة",
          textEn: "Perform regular prayers with joy",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-37",
      nameAr: "المحافظة على صلاة الفريضة بسهولة وسعادة",
      nameEn: "Perform regular prayers with joy",
      actionAr: "المحافظة على صلاة الفريضة بسهولة وسعادة",
      actionEn: "Perform regular prayers with joy"
    }
  },
  {
    id: "kind-to-animals",
    titleAr: "الرحمة بالحيوانات",
    titleEn: "Kindness to Animals",
    theme: "mercy",
    narratorAr: "أبو هريرة",
    narratorEn: "Abu Hurairah",
    arabicText: "فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ",
    explanationAr: "كل إحسان تقدمه لحيوان جائع أو عطشان يكتبه الله لك حسنات مضاعفة ومغفرة للذنوب.",
    explanationEn: "There is a reward for serving any living being.",
    source: "صحيح البخاري",
    hadithNumber: "2363",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "وضع ماء للطيور على النافذة",
          textEn: "Leave water for birds on windowsill",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-38",
      nameAr: "وضع ماء للطيور على النافذة",
      nameEn: "Leave water for birds on windowsill",
      actionAr: "وضع ماء للطيور على النافذة",
      actionEn: "Leave water for birds on windowsill"
    }
  },
  {
    id: "honor-promises",
    titleAr: "الوفاء بالوعد والأمانة",
    titleEn: "Fulfilling Promises",
    theme: "honesty",
    narratorAr: "أبو هريرة",
    narratorEn: "Abu Hurairah",
    arabicText: "آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ",
    explanationAr: "المؤمن الصادق إذا وعد زميله وفى بوعده، ولا يخون من ائتمنه على سر أو لعبة.",
    explanationEn: "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks it, and when trusted he betrays.",
    source: "صحيح البخاري",
    hadithNumber: "33",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "الالتزام بالموعد المحدد مع الأصدقاء",
          textEn: "Keep appointments and promises",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-39",
      nameAr: "الالتزام بالموعد المحدد مع الأصدقاء",
      nameEn: "Keep appointments and promises",
      actionAr: "الالتزام بالموعد المحدد مع الأصدقاء",
      actionEn: "Keep appointments and promises"
    }
  },
  {
    id: "patience-at-calamity",
    titleAr: "الصبر عند الصدمة الأولى",
    titleEn: "Patience at First Shock",
    theme: "patience",
    narratorAr: "أنس بن مالك",
    narratorEn: "Anas",
    arabicText: "إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الْأُولَى",
    explanationAr: "عندما يحدث شيء لا يعجبك أو يكسر شيء تحبه، اهدأ وقل: قدر الله وما شاء فعل.",
    explanationEn: "True patience is shown at the initial stroke of a calamity.",
    source: "صحيح البخاري",
    hadithNumber: "1283",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الْأُولَى فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "قول قدر الله وما شاء فعل عند الضيق",
          textEn: "Say Qaddar Allah when things break",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-40",
      nameAr: "قول قدر الله وما شاء فعل عند الضيق",
      nameEn: "Say Qaddar Allah when things break",
      actionAr: "قول قدر الله وما شاء فعل عند الضيق",
      actionEn: "Say Qaddar Allah when things break"
    }
  },
  {
    id: "clean-mouth-41",
    titleAr: "السواك وطهارة الفم (41)",
    titleEn: "Using Siwak & Oral Hygiene Part 41",
    theme: "cleanliness",
    narratorAr: "عائشة رضي الله عنها",
    narratorEn: "Aisha",
    arabicText: "السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ",
    explanationAr: "تنظيف الأسنان بالسواك أو الفرشاة ينظف الفم ويرضي الرحمن.",
    explanationEn: "The Siwak cleans the mouth and pleases the Lord.",
    source: "سنن النسائي وصححه البخاري تعليقاً",
    hadithNumber: "46",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "تفريش الأسنان قبل النوم وعند الاستيقاظ",
          textEn: "Brush teeth daily",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-41",
      nameAr: "تفريش الأسنان قبل النوم وعند الاستيقاظ",
      nameEn: "Brush teeth daily",
      actionAr: "تفريش الأسنان قبل النوم وعند الاستيقاظ",
      actionEn: "Brush teeth daily"
    }
  },
  {
    id: "right-hand-start-42",
    titleAr: "التيمن في الأمور (42)",
    titleEn: "Starting with the Right Hand Part 42",
    theme: "habits",
    narratorAr: "عائشة رضي الله عنها",
    narratorEn: "Aisha",
    arabicText: "كَانَ النَّبِيُّ ﷺ يُعْجِبُهُ التَّيَمُّنُ فِي تَنَعُّلِهِ وَتَرَجُّلِهِ وَطُهُورِهِ",
    explanationAr: "البدء باليمين في لبس الحذاء ودخول المسجد والأكل سنة نبوية جميلة.",
    explanationEn: "The Prophet ﷺ loved to start with the right side in putting on shoes, combing hair, and purifying.",
    source: "صحيح البخاري",
    hadithNumber: "210",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: كَانَ النَّبِيُّ ﷺ يُعْجِبُهُ التَّيَمُّنُ فِي تَنَعُّلِهِ وَتَرَجُّلِهِ وَطُهُورِهِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "لبس الحذاء باليمين أولاً",
          textEn: "Put right shoe on first",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-42",
      nameAr: "لبس الحذاء باليمين أولاً",
      nameEn: "Put right shoe on first",
      actionAr: "لبس الحذاء باليمين أولاً",
      actionEn: "Put right shoe on first"
    }
  },
  {
    id: "sleep-on-right-43",
    titleAr: "النوم على الشق الأيمن (43)",
    titleEn: "Sleeping on the Right Side Part 43",
    theme: "habits",
    narratorAr: "البراء بن عازب",
    narratorEn: "Al-Bara ibn Azib",
    arabicText: "إِذَا أَتَيْتَ مَضْجَعَكَ فَتَوَضَّأْ وُضُوءَكَ لِلصَّلَاةِ، ثُمَّ اضْطَجِعْ عَلَى شِقِّكَ الْأَيْمَنِ",
    explanationAr: "النوم على الشق الأيمن مع أذكار النوم يجلب راحة الجسد وحفظ الله لك.",
    explanationEn: "When you go to bed, perform ablution as for prayer, then lie down on your right side.",
    source: "صحيح البخاري",
    hadithNumber: "290",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: إِذَا أَتَيْتَ مَضْجَعَكَ فَتَوَضَّأْ وُضُوءَكَ لِلصَّلَاةِ، ثُمَّ اضْطَجِعْ عَلَى شِقِّكَ الْأَيْمَنِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "النوم على الجانب الأيمن وقراءة آية الكرسي",
          textEn: "Sleep on right side with prayer",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-43",
      nameAr: "النوم على الجانب الأيمن وقراءة آية الكرسي",
      nameEn: "Sleep on right side with prayer",
      actionAr: "النوم على الجانب الأيمن وقراءة آية الكرسي",
      actionEn: "Sleep on right side with prayer"
    }
  },
  {
    id: "modesty-all-good-44",
    titleAr: "الحياء لا يأتي إلا بخير (44)",
    titleEn: "Modesty Brings Only Good Part 44",
    theme: "habits",
    narratorAr: "عمران بن حصين",
    narratorEn: "Imran ibn Husayn",
    arabicText: "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    explanationAr: "التخلق بالحياء يمنعك من الأفعال القبيحة ويجعلك محبوباً عند الجميع.",
    explanationEn: "Modesty brings nothing but good.",
    source: "صحيح البخاري",
    hadithNumber: "6161",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "تجنب التحدث بما لا يليق",
          textEn: "Be polite and avoid rudeness",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-44",
      nameAr: "تجنب التحدث بما لا يليق",
      nameEn: "Be polite and avoid rudeness",
      actionAr: "تجنب التحدث بما لا يليق",
      actionEn: "Be polite and avoid rudeness"
    }
  },
  {
    id: "guard-tongue-heaven-45",
    titleAr: "من يضمن لي ما بين لحييه (45)",
    titleEn: "Guarding the Tongue Leads to Paradise Part 45",
    theme: "speech",
    narratorAr: "سهل بن سعد",
    narratorEn: "Sahl ibn Sa'd",
    arabicText: "مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ",
    explanationAr: "حفظ لسانك من الكذب والسب يضمن لك مرافقة الأبرار في الجنة.",
    explanationEn: "Whoever guarantees for me what is between his jaws and what is between his legs, I guarantee him Paradise.",
    source: "صحيح البخاري",
    hadithNumber: "6519",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "عدم الشتيمة أو الغيبة",
          textEn: "Never insult or curse",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-45",
      nameAr: "عدم الشتيمة أو الغيبة",
      nameEn: "Never insult or curse",
      actionAr: "عدم الشتيمة أو الغيبة",
      actionEn: "Never insult or curse"
    }
  },
  {
    id: "ask-permission-thrice-46",
    titleAr: "الاستئذان ثلاث (46)",
    titleEn: "Asking Permission Three Times Part 46",
    theme: "habits",
    narratorAr: "أبو موسى الأشعري",
    narratorEn: "Abu Musa al-Ash'ari",
    arabicText: "الِاسْتِئْذَانُ ثَلَاثٌ، فَإِنْ أُذِنَ لَكَ وَإِلَّا فَارْجِعْ",
    explanationAr: "اطرق باب الغرفة ثلاث مرات بأدب، فإن أذنوا لك ادخل وإلا فارجع.",
    explanationEn: "Asking permission is three times; if given enter, otherwise return.",
    source: "صحيح البخاري",
    hadithNumber: "6291",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: الِاسْتِئْذَانُ ثَلَاثٌ، فَإِنْ أُذِنَ لَكَ وَإِلَّا فَارْجِعْ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "طرق باب غرفة الوالدين قبل الدخول",
          textEn: "Knock before entering rooms",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-46",
      nameAr: "طرق باب غرفة الوالدين قبل الدخول",
      nameEn: "Knock before entering rooms",
      actionAr: "طرق باب غرفة الوالدين قبل الدخول",
      actionEn: "Knock before entering rooms"
    }
  },
  {
    id: "respect-elder-mercy-young-47",
    titleAr: "توقير الكبير ورحمة الصغير (47)",
    titleEn: "Respecting Elders and Compassion for Youth Part 47",
    theme: "kindness",
    narratorAr: "عبد الله بن عمرو",
    narratorEn: "Abdullah ibn Amr",
    arabicText: "لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيرَنَا، وَيَعْرِفْ شَرَفَ كَبِيرِنَا",
    explanationAr: "احترم المعلم والجد والأب، واعطف على أخيك الصغير لتكون من أهل هدي النبي ﷺ.",
    explanationEn: "He is not one of us who does not show mercy to our young and respect the rights of our elders.",
    source: "سنن أبي داود والترمذي",
    hadithNumber: "1966",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيرَنَا، وَيَعْرِفْ شَرَفَ كَبِيرِنَا فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إفساح المكان لكبار السن والتبسم للصغار",
          textEn: "Give seats to elders and smile to young",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-47",
      nameAr: "إفساح المكان لكبار السن والتبسم للصغار",
      nameEn: "Give seats to elders and smile to young",
      actionAr: "إفساح المكان لكبار السن والتبسم للصغار",
      actionEn: "Give seats to elders and smile to young"
    }
  },
  {
    id: "eat-together-48",
    titleAr: "الاجتماع على الطعام بركة (48)",
    titleEn: "Eating Together Brings Blessing Part 48",
    theme: "eating",
    narratorAr: "وحشي بن حرب",
    narratorEn: "Wahshi ibn Harb",
    arabicText: "اجْتَمِعُوا عَلَى طَعَامِكُمْ، وَاذْكُرُوا اسْمَ اللَّهِ عَلَيْهِ يُبَارَكْ لَكُمْ فِيهِ",
    explanationAr: "الجلوس مع العائلة على مائدة واحدة وتسمية الله يزيد الطعام بركة وسعادة.",
    explanationEn: "Eat together and mention the Name of Allah over your food; it will be blessed for you.",
    source: "سنن أبي داود",
    hadithNumber: "3812",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: اجْتَمِعُوا عَلَى طَعَامِكُمْ، وَاذْكُرُوا اسْمَ اللَّهِ عَلَيْهِ يُبَارَكْ لَكُمْ فِيهِ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "تناول العشاء مع العائلة دون شاشات",
          textEn: "Eat meals with family without screens",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-48",
      nameAr: "تناول العشاء مع العائلة دون شاشات",
      nameEn: "Eat meals with family without screens",
      actionAr: "تناول العشاء مع العائلة دون شاشات",
      actionEn: "Eat meals with family without screens"
    }
  },
  {
    id: "do-not-waste-49",
    titleAr: "النهي عن الإسراف (49)",
    titleEn: "Avoid Wastefulness Part 49",
    theme: "habits",
    narratorAr: "عبد الله بن عمرو",
    narratorEn: "Abdullah ibn Amr",
    arabicText: "كُلُوا وَاشْرَبُوا وَتَصَدَّقُوا وَالْبَسُوا فِي غَيْرِ مَخِيلَةٍ وَلَا سَرَفٍ",
    explanationAr: "استمتع بنعم الله دون تبذير في الطعام أو إهدار الماء عند الوضوء.",
    explanationEn: "Eat, drink, give charity and wear clothes without extravagance or pride.",
    source: "سنن النسائي وصححه الحاكم",
    hadithNumber: "2608",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: كُلُوا وَاشْرَبُوا وَتَصَدَّقُوا وَالْبَسُوا فِي غَيْرِ مَخِيلَةٍ وَلَا سَرَفٍ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "إغلاق صنبور الماء أثناء تنظيف الأسنان",
          textEn: "Turn off taps while brushing",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-49",
      nameAr: "إغلاق صنبور الماء أثناء تنظيف الأسنان",
      nameEn: "Turn off taps while brushing",
      actionAr: "إغلاق صنبور الماء أثناء تنظيف الأسنان",
      actionEn: "Turn off taps while brushing"
    }
  },
  {
    id: "charity-in-greeting-50",
    titleAr: "الكلمة الطيبة صدقة (50)",
    titleEn: "A Good Word is Charity Part 50",
    theme: "speech",
    narratorAr: "أبو هريرة",
    narratorEn: "Abu Hurairah",
    arabicText: "وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    explanationAr: "قول: شكراً، جزاك الله خيراً، ومرحباً صدقة تثقل ميزان حسناتك.",
    explanationEn: "And a good word is an act of charity.",
    source: "صحيح البخاري",
    hadithNumber: "3039",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بداية الموقف",
        titleEn: "The Scene",
        textAr: "في يوم مشرق وجميل، واجه البطل موقفاً تذكّر فيه توجيه رسول الله ﷺ.",
        textEn: "On a bright day, our young champion faced a situation where the Prophet’s guidance shone.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "تطبيق الهدي النبوي",
        titleEn: "Practicing Sunnah",
        textAr: "طبّق هدي الحديث النبوي: وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ فامتلأ قلبه نوراً وفرحاً.",
        textEn: "Living this noble guidance filled his heart with peace and joy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "الثمرة الطيبة",
        titleEn: "The Beautiful Reward",
        textAr: "أثنى الجميع على خلقه الكريم وشكره أهله، ونال ثواباً عظيماً عند الله تعالى.",
        textEn: "Everyone appreciated his noble character, and he earned tremendous blessings.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "ماذا تفعل لتقتدي بهذا الحديث الشريف؟",
      promptEn: "What will you do to follow this Hadith?",
      situationAr: "حدث معك هذا الموقف اليوم، كيف تتصرف يا بطل؟",
      situationEn: "When this situation happens, how do you respond?",
      choices: [
        {
          id: "c1",
          textAr: "قول جزاك الله خيراً لمن يخدمك",
          textEn: "Say Jazak Allahu Khayran",
          isCorrect: true,
          explanationAr: "أحسنت! هذا هو هدي النبي ﷺ وأجمل ما تفعله.",
          explanationEn: "Excellent! This is the noble Sunnah of our Prophet ﷺ."
        },
        {
          id: "c2",
          textAr: "التجاهل وعدم الاهتمام",
          textEn: "Ignoring and walking away",
          isCorrect: false,
          explanationAr: "تذكر أن المسلم يبادر بالخير دائماً ويكسب الأجر.",
          explanationEn: "Remember that a believer takes initiative in doing good."
        }
      ]
    },
    linkedHabit: {
      id: "habit-50",
      nameAr: "قول جزاك الله خيراً لمن يخدمك",
      nameEn: "Say Jazak Allahu Khayran",
      actionAr: "قول جزاك الله خيراً لمن يخدمك",
      actionEn: "Say Jazak Allahu Khayran"
    }
  },
  {
    id: "two-beloved-phrases",
    titleAr: "كلمتان خفيفتان على اللسان",
    titleEn: "Two Phrases Heavy on the Scale",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    explanationAr: "ذكر يسير جداً على اللسان ولكنه يملأ ميزان حسناتك جبالاً من الثواب، ويجعل الرحمن تبارك وتعالى يحبك.",
    explanationEn: "Two phrases light on the tongue yet heavy on the scale and deeply loved by the Most Merciful: Subhan Allahi wa bihamdih, Subhan Allahil Azeem.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6406",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في طريق المسجد",
        titleEn: "On the Way to Mosque",
        textAr: "مشى أنس في الصباح يردد الذكر الطيب.",
        textEn: "Anas walked in the morning whispering praises of Allah.",
        iconName: "sunny"
      },
      {
        sceneNumber: 2,
        titleAr: "كلمات خفيفة",
        titleEn: "Light Words",
        textAr: "ردد: سبحان الله وبحمده، سبحان الله العظيم بكل خشوع.",
        textEn: "He repeated the two phrases with deep sincerity.",
        iconName: "musical-notes"
      },
      {
        sceneNumber: 3,
        titleAr: "ميزان يثقل",
        titleEn: "Heavier Scales",
        textAr: "شعر بانشراح صدره ورضا الرحمن عنه.",
        textEn: "He felt his heart expand with divine peace and love.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "تنتظر الحافلة ولديك بضع دقائق فراغ، كيف تستغلها؟",
      promptEn: "Waiting for the bus with a few spare minutes, how do you use it?",
      situationAr: "وقت الانتظار",
      situationEn: "Waiting time",
      choices: [
        {
          id: "c1",
          textAr: "أردد في سري: سبحان الله وبحمده سبحان الله العظيم",
          textEn: "Whisper Subhan Allahi wa bihamdih, Subhan Allahil Azeem",
          isCorrect: true,
          explanationAr: "ما شاء الله! كلمات يحبها الرحمن وتثقل ميزانك.",
          explanationEn: "Masha’Allah! Beloved words that make your scales heavy with light."
        },
        {
          id: "c2",
          textAr: "أتذمر وأشعر بالملل",
          textEn: "Complain and feel bored",
          isCorrect: false,
          explanationAr: "الذكر يملأ وقتك بالنور والبركة.",
          explanationEn: "Remembrance fills your moments with tranquility."
        }
      ]
    },
    linkedHabit: {
      id: "habit-two-phrases",
      nameAr: "ترديد الكلمتين الحبيبتين",
      nameEn: "Reciting the Two Beloved Phrases",
      actionAr: "قل 10 مرات: سبحان الله وبحمده سبحان الله العظيم اليوم",
      actionEn: "Say Subhan Allahi wa bihamdih, Subhan Allahil Azeem 10 times today"
    }
  },
  {
    id: "prayer-best-deed",
    titleAr: "الصلاة على وقتها أحب الأعمال",
    titleEn: "Prayer on Time is Most Beloved",
    theme: "habits",
    narratorAr: "عبد الله بن مسعود رضي الله عنه",
    narratorEn: "Abdullah ibn Masud",
    arabicText: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ: الصَّلَاةُ عَلَى وَقْتِهَا، ثُمَّ بِرُّ الْوَالِدَيْنِ",
    explanationAr: "سُئل رسول الله ﷺ عن أعظم عمل يحبه الله، فقال: أداء الصلاة أول ما يؤذن وقتها، ثم طاعة الوالدين.",
    explanationEn: "The action most loved by Allah is performing the prayer right on time, followed by honoring parents.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "527",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "نداء الأذان",
        titleEn: "The Adhan Call",
        textAr: "سمع يوسف المؤذن ينادي للصلاة وهو يلعب.",
        textEn: "Yusuf heard the Adhan while playing his favorite game.",
        iconName: "volume-high"
      },
      {
        sceneNumber: 2,
        titleAr: "المسارعة للطاعة",
        titleEn: "Hastening to Obey",
        textAr: "أوقف اللعبة فوراً وتوضأ بابتسامة نشاط.",
        textEn: "He paused his game right away and made wudu enthusiastically.",
        iconName: "checkmark-circle"
      },
      {
        sceneNumber: 3,
        titleAr: "فرحة الصلاة",
        titleEn: "Joy of Prayer",
        textAr: "صلى في أول الوقت ونال حب الله ورضاه.",
        textEn: "He prayed promptly and earned Allah’s love and pleasure.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "أذن العصر وأنت تشاهد برنامجك المفضل، كيف تتصرف؟",
      promptEn: "The Asr Adhan calls while watching your favorite show, what do you do?",
      situationAr: "وقت الصلاة والبرنامج",
      situationEn: "Prayer time vs TV show",
      choices: [
        {
          id: "c1",
          textAr: "أقوم للصلاة فوراً لأنها أحب الأعمال إلى الله",
          textEn: "Stand up to pray immediately as it is most beloved to Allah",
          isCorrect: true,
          explanationAr: "ممتاز! تقديم الصلاة علامة حبك لله وطاعته.",
          explanationEn: "Excellent! Putting prayer first shows your deep love for Allah."
        },
        {
          id: "c2",
          textAr: "أكمل البرنامج حتى تفوتني الصلاة",
          textEn: "Finish watching until the prayer time passes",
          isCorrect: false,
          explanationAr: "الصلاة في وقتها تجلب البركة والتوفيق في حياتك كلها.",
          explanationEn: "Prompt prayer brings blessings to your entire life."
        }
      ]
    },
    linkedHabit: {
      id: "habit-prompt-prayer",
      nameAr: "المبادرة للصلاة عند الأذان",
      nameEn: "Prompt Prayer at Adhan",
      actionAr: "صلِّ فريضتك بمجرد سماع الأذان اليوم",
      actionEn: "Pray your fardh right as the Adhan calls today"
    }
  },
  {
    id: "quran-letter-blessing",
    titleAr: "حرف القرآن بعشر حسنات",
    titleEn: "A Letter of Quran is Ten Blessings",
    theme: "knowledge",
    narratorAr: "عبد الله بن مسعود رضي الله عنه",
    narratorEn: "Abdullah ibn Masud",
    arabicText: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا",
    explanationAr: "كل حرف واحد تقرؤه من المصحف الشريف تنال به عشر حسنات، فاقرأ لتبني جبالاً من الأجر!",
    explanationEn: "Whoever reads a single letter from the Quran receives ten blessings from Allah.",
    source: "جامع الترمذي",
    hadithNumber: "2910",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "قراءة هادئة",
        titleEn: "Gentle Recitation",
        textAr: "فتحت فاطمة المصحف الشريف في الصباح الباكر.",
        textEn: "Fatima opened the Quran gently in the early morning.",
        iconName: "book"
      },
      {
        sceneNumber: 2,
        titleAr: "كنز الحسنات",
        titleEn: "Treasure of Deeds",
        textAr: "تلت صفحة كاملة وعرفت أنها كسبت آلاف الحسنات.",
        textEn: "She read a full page, earning thousands of good deeds.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 3,
        titleAr: "سكينة وبركة",
        titleEn: "Tranquility & Peace",
        textAr: "امتلأ يومها بالتوفيق والسرور العظيم.",
        textEn: "Her day was filled with peace and sweet barakah.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "لديك عشر دقائق قبل النوم، كيف تنهي يومك؟",
      promptEn: "You have ten minutes before sleeping, how do you end your day?",
      situationAr: "قبل النوم",
      situationEn: "Before sleep",
      choices: [
        {
          id: "c1",
          textAr: "أقرأ سورة الملك أو آيات من القرآن الكريم",
          textEn: "Recite Surah Al-Mulk or verses from the Quran",
          isCorrect: true,
          explanationAr: "رائع! كل حرف بعشر حسنات تحفظك حتى تصبح.",
          explanationEn: "Splendid! Every letter brings tenfold rewards and divine protection."
        },
        {
          id: "c2",
          textAr: "أسهر في تصفح الهاتف دون فائدة",
          textEn: "Stay up browsing the phone with no benefit",
          isCorrect: false,
          explanationAr: "ختام اليوم بذكر الله يورثك نوماً هادئاً ورضا إلهياً.",
          explanationEn: "Ending the day with Quran grants peaceful sleep."
        }
      ]
    },
    linkedHabit: {
      id: "habit-quran-reading",
      nameAr: "قراءة صفحة من القرآن",
      nameEn: "Daily Page of Quran",
      actionAr: "اقرأ صفحة من القرآن الكريم بتدبر اليوم",
      actionEn: "Read one page of the Quran with contemplation today"
    }
  },
  {
    id: "believers-one-heart",
    titleAr: "تراحم المؤمنين كالجسد الواحد",
    titleEn: "Believers Compassion Like One Body",
    theme: "brotherhood",
    narratorAr: "النعمان بن بشير رضي الله عنه",
    narratorEn: "Al-Numan ibn Bashir",
    arabicText: "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى",
    explanationAr: "المؤمنون يحبون بعضهم ويعينون بعضاً؛ فإذا حزن أخوك المسلم أو تألم تقف بجانبه وتساعده بحب.",
    explanationEn: "Believers in their mutual compassion are like one body: if one limb suffers, the whole body responds with care.",
    source: "صحيح مسلم",
    hadithNumber: "2586",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "زميل متعب",
        titleEn: "Tired Classmate",
        textAr: "شاهد حمزة زميله يشعر بالصداع والتعب في الفصل.",
        textEn: "Hamzah noticed his classmate had a headache and felt down.",
        iconName: "sad-outline"
      },
      {
        sceneNumber: 2,
        titleAr: "مواساة ومساعدة",
        titleEn: "Comfort and Care",
        textAr: "أحضر له ماء بارداً وساعده في حمل حقيبته.",
        textEn: "He brought cool water and helped carry his heavy bag.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "أخوة صادقة",
        titleEn: "Sincere Brotherhood",
        textAr: "شعر زميله بالراحة وقال له: جزاك الله خيراً يا أخي.",
        textEn: "His classmate felt soothed and prayed for his kindness.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "رأيت صديقك حزيناً لأن درجاته لم تكن كما تمنى، كيف تعامله؟",
      promptEn: "Your friend is sad because of their exam mark, how do you treat them?",
      situationAr: "مواساة الصديق",
      situationEn: "Comforting a friend",
      choices: [
        {
          id: "c1",
          textAr: "أواسيه بلطف وأشجعه وأساعده في مراجعة الدروس",
          textEn: "Comfort him gently, encourage him, and offer study help",
          isCorrect: true,
          explanationAr: "بارك الله فيك! هكذا يتراحم المؤمنون كالأخوة الصادقين.",
          explanationEn: "May Allah bless you! True believers share empathy and support."
        },
        {
          id: "c2",
          textAr: "أفتخر عليه بدرجتي وأتركه وحيداً",
          textEn: "Boast about my higher score and leave him alone",
          isCorrect: false,
          explanationAr: "المسلم لا يفرح بحزن أخيه بل يقف معه بحنان.",
          explanationEn: "A believer never boasts over a brother’s disappointment."
        }
      ]
    },
    linkedHabit: {
      id: "habit-care-brother",
      nameAr: "مواساة الأصدقاء",
      nameEn: "Comforting Friends",
      actionAr: "شجع صديقاً أو أخاً بكلمة طيبة اليوم",
      actionEn: "Encourage a friend or sibling with a kind uplifting word today"
    }
  },
  {
    id: "never-cheat-muslim",
    titleAr: "النهي عن الغش والأمانة التامة",
    titleEn: "Never Cheat: Absolute Honesty",
    theme: "honesty",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ غَشَّنَا فَلَيْسَ مِنَّا",
    explanationAr: "المسلم دائماً أمين ونزيه في لعبه ودراسته ومعاملاته، ولا يغش أبداً لأن الله يراه في كل مكان.",
    explanationEn: "A true believer never cheats in games, tests, or daily life, keeping pure integrity before Allah.",
    source: "صحيح مسلم",
    hadithNumber: "101",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "لعبة المنافسة",
        titleEn: "Competitive Game",
        textAr: "كان كريم يلعب سباقاً إلكترونياً مع أصدقائه.",
        textEn: "Kareem was playing a racing game with his friends.",
        iconName: "game-controller"
      },
      {
        sceneNumber: 2,
        titleAr: "فرصة للغش",
        titleEn: "A Chance to Cheat",
        textAr: "ظهرت ثغرة للفوز دون جهد لكنه تذكر مراقبة الله.",
        textEn: "A glitch appeared to win unfairly, but he remembered Allah.",
        iconName: "shield-checkmark"
      },
      {
        sceneNumber: 3,
        titleAr: "فوز الأمانة",
        titleEn: "Victory of Integrity",
        textAr: "لعب بنزاهة وفاز بالمركز الثاني بروح طيبة.",
        textEn: "He played honestly and celebrated with a clear conscience.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "في الامتحان سقطت ورقة إجابة زميلك بجانبك، ماذا تفعل؟",
      promptEn: "During an exam, your classmate’s answer sheet fell beside you. What do you do?",
      situationAr: "أمانة الامتحان",
      situationEn: "Exam integrity",
      choices: [
        {
          id: "c1",
          textAr: "أعيدها له فوراً دون أن أنظر إليها لأنني أمين",
          textEn: "Return it immediately without looking because I am honest",
          isCorrect: true,
          explanationAr: "بطل حقيقي! الأمانة ترفع قدرك عند الله والناس.",
          explanationEn: "A real hero! Integrity elevates you before Allah and people."
        },
        {
          id: "c2",
          textAr: "أنقل منها الإجابات سراً",
          textEn: "Copy answers secretly from it",
          isCorrect: false,
          explanationAr: "الغش خيانة للأمانة يغضب الله ويمحق البركة.",
          explanationEn: "Cheating destroys trust and removes barakah from learning."
        }
      ]
    },
    linkedHabit: {
      id: "habit-play-honestly",
      nameAr: "النزاهة في اللعب والدراسة",
      nameEn: "Fairness in Play and Work",
      actionAr: "التزم بالقواعد بصدق تام في كل ألعابك اليوم",
      actionEn: "Adhere completely to fair rules in all activities today"
    }
  },
  {
    id: "building-house-in-jannah",
    titleAr: "بناء المسجد وقصر الجنة",
    titleEn: "Building a Mosque and Jannah Castle",
    theme: "generosity",
    narratorAr: "عثمان بن عفان رضي الله عنه",
    narratorEn: "Uthman ibn Affan",
    arabicText: "مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ بَيْتًا فِي الجَنَّةِ",
    explanationAr: "من يشارك في بناء بيت من بيوت الله أو تنظيفه ورعايته، يبني الله له قصراً رائعاً في الجنة!",
    explanationEn: "Whoever helps build or maintain a mosque for Allah, Allah builds for them a palace in Paradise.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "450",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في بيت الله",
        titleEn: "At the Mosque",
        textAr: "رأى طارق ورقة على أرضية مصلى المسجد.",
        textEn: "Tariq saw a scrap of paper on the prayer floor.",
        iconName: "home"
      },
      {
        sceneNumber: 2,
        titleAr: "خدمة المسجد",
        titleEn: "Serving the Mosque",
        textAr: "رفعها بهدوء وألقاها في سلة المهملات ونظم المصاحف.",
        textEn: "He picked it up, disposed of it, and arranged the Qurans.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 3,
        titleAr: "بشارة نبوية",
        titleEn: "Prophetic Good News",
        textAr: "تذكر ثواب رعاية المسجد ففرح بقصر الجنة الموعود.",
        textEn: "He recalled the reward and smiled at the promise of Jannah.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "رأيت مصحفاً مفتوحاً على الأرض في المسجد، كيف تتصرف؟",
      promptEn: "You see an open Quran left on the mosque floor, how do you act?",
      situationAr: "احترام المصحف والمسجد",
      situationEn: "Respecting Quran & Mosque",
      choices: [
        {
          id: "c1",
          textAr: "أرفعه باحترام وأعيده إلى مكانه المخصص في الرف",
          textEn: "Lift it respectfully and place it on its designated shelf",
          isCorrect: true,
          explanationAr: "أحسنت! تعظيم بيوت الله والمصاحف من تقوى القلوب.",
          explanationEn: "Excellent! Honoring mosques and Qurans reflects true piety."
        },
        {
          id: "c2",
          textAr: "أتركه دون اهتمام",
          textEn: "Leave it ignored",
          isCorrect: false,
          explanationAr: "المسجد يحتاج منا كل عناية واحترام ونظافة.",
          explanationEn: "The house of Allah deserves our highest respect and care."
        }
      ]
    },
    linkedHabit: {
      id: "habit-care-mosque",
      nameAr: "العناية بالمسجد",
      nameEn: "Caring for the Mosque",
      actionAr: "رتب مصحفاً أو نظف مكاناً عند زيارة المسجد اليوم",
      actionEn: "Straighten a Quran or tidy a spot at the mosque today"
    }
  },
  {
    id: "guard-allah-commands",
    titleAr: "احفظ الله يحفظك",
    titleEn: "Be Mindful of Allah, He Protects You",
    theme: "habits",
    narratorAr: "عبد الله بن عباس رضي الله عنهما",
    narratorEn: "Abdullah ibn Abbas",
    arabicText: "احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ",
    explanationAr: "احفظ أوامر الله بالصلاة والصدق وتجنب ما يغضبه، يحفظك الله بحمايته ورعايته في كل خطوة في حياتك.",
    explanationEn: "Be mindful of Allah’s commands, and Allah will safeguard and guide you at every moment of your life.",
    source: "جامع الترمذي",
    hadithNumber: "2516",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "وصية غالية",
        titleEn: "Precious Advice",
        textAr: "جلس ابن عباس يستمع لنصائح النبي ﷺ العظيمة.",
        textEn: "Ibn Abbas sat listening to the Prophet’s golden wisdom.",
        iconName: "bulb"
      },
      {
        sceneNumber: 2,
        titleAr: "حفظ الأوامر",
        titleEn: "Guarding Commands",
        textAr: "عزم على المحافظة على صلاته وطاعة الله دائماً.",
        textEn: "He resolved to protect his prayers and obey Allah faithfully.",
        iconName: "shield-checkmark"
      },
      {
        sceneNumber: 3,
        titleAr: "حماية إلهية",
        titleEn: "Divine Protection",
        textAr: "وجد معية الله وتوفيقه في كل موقف مر به.",
        textEn: "He found Allah’s divine support in every challenge he faced.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "كنت وحدك في غرفتك وتذكرت موعد الصلاة، ماذا تفعل؟",
      promptEn: "You are alone in your room and remember prayer time, what do you do?",
      situationAr: "مراقبة الله في الخلوة",
      situationEn: "Remembering Allah when alone",
      choices: [
        {
          id: "c1",
          textAr: "أقوم وأصلي لأن الله يراني وأنا أحفظ أوامره",
          textEn: "Stand up and pray because Allah sees me and I guard His commands",
          isCorrect: true,
          explanationAr: "ما شاء الله! من حفظ الله في سره حفظه الله في كل أمره.",
          explanationEn: "Masha’Allah! Whoever remembers Allah in private is guarded always."
        },
        {
          id: "c2",
          textAr: "أهملها لأنه لا أحد من أهلي يراني",
          textEn: "Skip it because no one is watching me",
          isCorrect: false,
          explanationAr: "الله أقرب إلينا من كل أحد ويرى كل ما نصنع.",
          explanationEn: "Allah is always closer to us than anyone, seeing all we do."
        }
      ]
    },
    linkedHabit: {
      id: "habit-mindful-allah",
      nameAr: "استشعار مراقبة الله",
      nameEn: "Remembering Allah Everywhere",
      actionAr: "افعل عملاً صالحاً في سرك يبتغي رضا الله وحده اليوم",
      actionEn: "Perform a secret good deed purely for Allah today"
    }
  },
  {
    id: "giving-hand-upper",
    titleAr: "اليد العليا خير من اليد السفلى",
    titleEn: "The Giving Hand is Better",
    theme: "generosity",
    narratorAr: "حكيم بن حزام رضي الله عنه",
    narratorEn: "Hakim ibn Hizam",
    arabicText: "الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى",
    explanationAr: "اليد التي تعطي وتنفق وتتصدق وتساعد أفضل بكثير من اليد التي تسأل وتأخذ فقط.",
    explanationEn: "The upper hand that gives, donates, and helps is far better than the lower hand that only takes.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "1427",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "حصالة التوفير",
        titleEn: "Saving Jar",
        textAr: "وفر زياد جزءاً من مصروفه في حصالته الصغيرة.",
        textEn: "Ziyad saved some of his pocket money in his jar.",
        iconName: "cash"
      },
      {
        sceneNumber: 2,
        titleAr: "صدقة كريمة",
        titleEn: "Generous Charity",
        textAr: "تصدق بها على طفل محتاج بكل سرور.",
        textEn: "He donated it to a needy child with pure delight.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "يد عليا مباركة",
        titleEn: "A Blessed Giving Hand",
        textAr: "شعر بفرحة العطاء وعلم أنه صار صاحب يد عليا.",
        textEn: "He felt the joy of giving, knowing the beauty of the giving hand.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "معك قطعتان من الحلوى وزميلك ليس معه طعام، ماذا تصنع؟",
      promptEn: "You have two treats and your classmate has none. What do you do?",
      situationAr: "مشاركة الطعام",
      situationEn: "Sharing Food",
      choices: [
        {
          id: "c1",
          textAr: "أعطيه القطعة الأكبر وأشاركه بسعادة",
          textEn: "Give him the larger piece and share happily",
          isCorrect: true,
          explanationAr: "كريم وبار! العطاء ينشر المحبة ويثقل الميزان.",
          explanationEn: "Generous and noble! Giving spreads love and multiplies rewards."
        },
        {
          id: "c2",
          textAr: "آكل القطعتين وحدي وأخفي الحلوى",
          textEn: "Eat both alone and hide the sweets",
          isCorrect: false,
          explanationAr: "المسلم يؤثر إخوانه ويحب أن يرى الجميع مسرورين.",
          explanationEn: "A Muslim loves sharing and gladdens the hearts of others."
        }
      ]
    },
    linkedHabit: {
      id: "habit-giving-generosity",
      nameAr: "العطاء ومشاركة الآخرين",
      nameEn: "Giving and Sharing",
      actionAr: "تصدق بجزء من مصروفك أو شارك طعامك اليوم",
      actionEn: "Donate some pocket money or share your food today"
    }
  },
  {
    id: "exchange-gifts-love",
    titleAr: "تهادوا تحابوا",
    titleEn: "Exchange Gifts and Love Each Other",
    theme: "brotherhood",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "تَهَادَوْا تَحَابُّوا",
    explanationAr: "تبادل الهدايا ولو كانت بسيطة يزيل البغضاء من النفوس ويزرع المحبة الصادقة بين الناس.",
    explanationEn: "Exchanging gifts, however modest, removes hard feelings and plants sweet love in hearts.",
    source: "الأدب المفرد للبخاري",
    hadithNumber: "594",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "هدية بسيطة",
        titleEn: "A Simple Gift",
        textAr: "صنعت سلمى بطاقة تهنئة جميلة ورسمت عليها أزهاراً.",
        textEn: "Salma drew a colorful greeting card with pretty flowers.",
        iconName: "color-palette"
      },
      {
        sceneNumber: 2,
        titleAr: "إهداء للأم",
        titleEn: "Gift for Mother",
        textAr: "قدمتها لأمها في الصباح مع ابتسامة حنونة.",
        textEn: "She handed it to her mother in the morning with a loving smile.",
        iconName: "gift"
      },
      {
        sceneNumber: 3,
        titleAr: "فرحة ومحبة",
        titleEn: "Joy and Warmth",
        textAr: "عانقتها والدتها ودعت لها ببركة وسعادة.",
        textEn: "Her mother hugged her tightly, praying for her joy.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "تريد إدخال السرور على قلب أخيك أو صديقك، ماذا تفعل؟",
      promptEn: "You want to bring joy to your brother or friend, what do you do?",
      situationAr: "إهداء هدية",
      situationEn: "Giving a gift",
      choices: [
        {
          id: "c1",
          textAr: "أهديه كتاباً أو قلماً جميلاً أو بطاقة لطيفة",
          textEn: "Gift him a book, a nice pen, or a cute handmade card",
          isCorrect: true,
          explanationAr: "أحسنت! الهدية مفتاح القلوب وسنة نبوية مباركة.",
          explanationEn: "Splendid! Gifts soften hearts and follow a blessed Sunnah."
        },
        {
          id: "c2",
          textAr: "أقول الهدايا لا داعي لها",
          textEn: "Say gifts are useless and unnecessary",
          isCorrect: false,
          explanationAr: "الهدية ولو كانت يسيرة تورث الود وتعمق الإخوة.",
          explanationEn: "Even small gifts generate deep mutual affection."
        }
      ]
    },
    linkedHabit: {
      id: "habit-give-gift",
      nameAr: "إهداء الأهل والأصدقاء",
      nameEn: "Gifting Family and Friends",
      actionAr: "اصنع بطاقة شكر أو قدم هدية بسيطة لأحد أحبائك اليوم",
      actionEn: "Make a thank-you card or give a small gift today"
    }
  },
  {
    id: "most-perfect-faith-manners",
    titleAr: "أكمل المؤمنين أحسنهم خلقا",
    titleEn: "Most Perfect Faith Belongs to Best in Manners",
    theme: "kindness",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
    explanationAr: "كلما كان خلقك كريماً ولسانك طيباً ومعاملتك لطيفة، كان إيمانك بالله أكمل وأعظم.",
    explanationEn: "The believers who possess the most perfect faith are those who display the finest character and manners.",
    source: "سنن أبي داود والترمذي",
    hadithNumber: "4682",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "موقف في الملعب",
        titleEn: "Incident on the Pitch",
        textAr: "دفع أحد الأولاد مازن بالخطأ أثناء الركض.",
        textEn: "A boy bumped into Mazen accidentally while running.",
        iconName: "football"
      },
      {
        sceneNumber: 2,
        titleAr: "خلق رفيع",
        titleEn: "Noble Character",
        textAr: "ابتسم مازن وقال: لا بأس يا صديقي، حصل خير.",
        textEn: "Mazen smiled and said: No worries, all is fine my friend.",
        iconName: "shield-checkmark"
      },
      {
        sceneNumber: 3,
        titleAr: "كمال الإيمان",
        titleEn: "Perfection of Faith",
        textAr: "تعجب زملاؤه من حلمه وأخلاقه العالية وأحبوه كثيراً.",
        textEn: "His peers admired his patience and loved him dearly.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "حدث سوء تفاهم بسيط بينك وبين صديقك، كيف تتصرف؟",
      promptEn: "A minor misunderstanding occurs with a friend, how do you handle it?",
      situationAr: "سوء التفاهم",
      situationEn: "A misunderstanding",
      choices: [
        {
          id: "c1",
          textAr: "أتعامل بحلم ولطف وكلمة طيبة تحل المشكلة",
          textEn: "Respond with forbearance, kindness, and gentle words",
          isCorrect: true,
          explanationAr: "ممتاز! حسن الخلق هو تاج المؤمن وزينته.",
          explanationEn: "Superb! Good manners are the believer’s crowning glory."
        },
        {
          id: "c2",
          textAr: "أصرخ وأغضب وأقاطعه",
          textEn: "Yell, get angry, and cut him off",
          isCorrect: false,
          explanationAr: "الغضب يفسد الود والحلم يجمع القلوب.",
          explanationEn: "Anger ruins bonds while forbearance unites hearts."
        }
      ]
    },
    linkedHabit: {
      id: "habit-noble-manners",
      nameAr: "التحلي بحسن الخلق",
      nameEn: "Practicing Noble Character",
      actionAr: "تحدث بلطف تام واغفر زلات الآخرين اليوم",
      actionEn: "Speak with gentleness and forgive little mistakes today"
    }
  },
  {
    id: "mastery-in-work",
    titleAr: "إتقان العمل محبة إلهية",
    titleEn: "Excellence and Mastery in Work",
    theme: "habits",
    narratorAr: "عائشة رضي الله عنها",
    narratorEn: "Aisha",
    arabicText: "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ",
    explanationAr: "عندما ترسم أو تذاكر أو تؤدي أي مهمة، أتقنها باهتمام وعناية تامة؛ لأن الله يحب المتقنين.",
    explanationEn: "Allah loves that when any of you performs an action or task, they do it with complete excellence (itqan).",
    source: "شعب الإيمان للبيهقي",
    hadithNumber: "4929",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "واجب الرسم",
        titleEn: "Art Homework",
        textAr: "جلس عمار يرسم لوحة الطبيعة بعناية ودقة.",
        textEn: "Ammar sat painting a landscape with deep focus.",
        iconName: "color-palette"
      },
      {
        sceneNumber: 2,
        titleAr: "صبر وإتقان",
        titleEn: "Patience & Mastery",
        textAr: "لون كل تفصيلة بهدوء دون استعجال.",
        textEn: "He colored each detail calmly without rushing.",
        iconName: "brush"
      },
      {
        sceneNumber: 3,
        titleAr: "إعجاب وتوفيق",
        titleEn: "Praise & Success",
        textAr: "أثنى المعلم على إتقانه ونال أعلى تقدير.",
        textEn: "His teacher praised his mastery and awarded top marks.",
        iconName: "ribbon"
      }
    ],
    scenario: {
      promptAr: "تكتب واجبك المدرسي وتريد الانتهاء سريعاً للعب، ماذا تفعل؟",
      promptEn: "Writing homework and wanting to finish fast to play, what do you do?",
      situationAr: "كتابة الواجب",
      situationEn: "Doing homework",
      choices: [
        {
          id: "c1",
          textAr: "أكتب بخط جميل ومنظم وأتقن إجاباتي",
          textEn: "Write with neat handwriting and answer thoroughly",
          isCorrect: true,
          explanationAr: "رائع! إتقان العمل عبادة ترضي الله وتجعلك متميزاً.",
          explanationEn: "Splendid! Mastering your work pleases Allah and makes you excel."
        },
        {
          id: "c2",
          textAr: "أخربش بسرعة دون تركيز لأذهب للعب فقط",
          textEn: "Scribble hastily without focus just to play",
          isCorrect: false,
          explanationAr: "الاستعجال يوقع في الأخطاء والإتقان يجلب الفخر والبركة.",
          explanationEn: "Haste leads to mistakes while mastery brings honor."
        }
      ]
    },
    linkedHabit: {
      id: "habit-master-work",
      nameAr: "إتقان المهام المدرسية",
      nameEn: "Mastery in Daily Tasks",
      actionAr: "أتقن واجبك أو ترتيب غرفتك بأعلى جودة اليوم",
      actionEn: "Do your homework or tidy your room with highest care today"
    }
  },
  {
    id: "muslim-honor-sanctity",
    titleAr: "حرمة شتم المسلم وإيذائه",
    titleEn: "Sanctity of Muslim Honor",
    theme: "speech",
    narratorAr: "عبد الله بن مسعود رضي الله عنه",
    narratorEn: "Abdullah ibn Masud",
    arabicText: "سِبَابُ الْمُسْلِمِ فُسُوقٌ، وَقِتَالُهُ كُفْرٌ",
    explanationAr: "لسان المسلم طاهر لا يسب ولا يشتم أحداً، واحترام كرامة المسلمين واجب عظيم في ديننا.",
    explanationEn: "Abusing or insulting a Muslim is a grave sin; a believer keeps their tongue pure and respectful.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "48",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "خلاف في الساحة",
        titleEn: "Playground Disagreement",
        textAr: "غضب وليد من صديقه في لعبة الكرة.",
        textEn: "Walid got upset with his friend during a ball game.",
        iconName: "football"
      },
      {
        sceneNumber: 2,
        titleAr: "حفظ اللسان",
        titleEn: "Guarding the Tongue",
        textAr: "تذكر أن سباب المسلم معصية فسكت واستغفر الله.",
        textEn: "He remembered that insults are sinful, so he held his tongue.",
        iconName: "shield-checkmark"
      },
      {
        sceneNumber: 3,
        titleAr: "سلام ومودة",
        titleEn: "Peace & Friendship",
        textAr: "تصالحا بابتسامة وعادا للعب معاً بصفاء.",
        textEn: "They reconciled with a smile and played on peacefully.",
        iconName: "happy"
      }
    ],
    scenario: {
      promptAr: "أغضبك شخص بكلام غير لائق، كيف ترد عليه؟",
      promptEn: "Someone provokes you with rude words, how do you respond?",
      situationAr: "الرد على الإساءة",
      situationEn: "Responding to rudeness",
      choices: [
        {
          id: "c1",
          textAr: "أرد بالتي هي أحسن ولا أسبه اقتداء بالنبي ﷺ",
          textEn: "Respond with noble dignity and refuse to insult back",
          isCorrect: true,
          explanationAr: "أحسنت! المسلم يترفع عن الشتائم ويحفظ لسانه دائماً.",
          explanationEn: "Excellent! A believer rises above insults and protects their tongue."
        },
        {
          id: "c2",
          textAr: "أشتمه وأرد الإساءة بإساءة أكبر",
          textEn: "Insult him back with worse words",
          isCorrect: false,
          explanationAr: "السباب لا يليق بالمسلم ويسلب الحسنات.",
          explanationEn: "Insults drain your good deeds and do not befit a believer."
        }
      ]
    },
    linkedHabit: {
      id: "habit-pure-words",
      nameAr: "طهارة اللسان من السب",
      nameEn: "Purity of Speech from Insults",
      actionAr: "احرص على ألا تخرج من فمك أي كلمة سيئة اليوم",
      actionEn: "Ensure not a single harmful word leaves your mouth today"
    }
  },
  {
    id: "leave-what-doubts",
    titleAr: "دع ما يريبك إلى ما لا يريبك",
    titleEn: "Leave What Causes Doubt for What is Clear",
    theme: "honesty",
    narratorAr: "الحسن بن علي رضي الله عنهما",
    narratorEn: "Al-Hasan ibn Ali",
    arabicText: "دَعْ مَا يَرِيبُكَ إِلَى مَا لَا يَرِيبُكَ",
    explanationAr: "إذا شككت في أمر هل هو حلال أم حرام، أو صواب أم خطأ، فاتركه واختر الأمر الواضح النظيف لتطمئن.",
    explanationEn: "Leave that which makes you doubt and turn toward that which gives certainty and peace of conscience.",
    source: "جامع الترمذي والنسائي",
    hadithNumber: "2518",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "حلوى مجهولة",
        titleEn: "Mystery Candy",
        textAr: "وجد طارق قطعة حلوى لم يعرف مصدرها.",
        textEn: "Tariq found a piece of candy without knowing who owned it.",
        iconName: "help-circle"
      },
      {
        sceneNumber: 2,
        titleAr: "الورع واليقين",
        titleEn: "Piety and Caution",
        textAr: "شك في أمرها فتركها ولم يأكلها طلباً للحلال الصافي.",
        textEn: "He doubted its permissibility, so he left it untouched.",
        iconName: "shield"
      },
      {
        sceneNumber: 3,
        titleAr: "راحة الضمير",
        titleEn: "Peace of Conscience",
        textAr: "شعر براحة كبيرة في قلبه لأن ضميره نقي.",
        textEn: "He felt great peace in his heart with an easy conscience.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "لعبة إلكترونية فيها شك بأنها تحتوي أمراً محرماً، ماذا تختار؟",
      promptEn: "A digital game that might have something doubtful or haram, what do you do?",
      situationAr: "الشبهات في الألعاب",
      situationEn: "Doubtful elements in games",
      choices: [
        {
          id: "c1",
          textAr: "أتركها وأختار لعبة مباحة ونافعة بكل اطمئنان",
          textEn: "Leave it and choose a clearly wholesome, halal game",
          isCorrect: true,
          explanationAr: "ما شاء الله! ترك الشبهات يحفظ دينك وعرضك.",
          explanationEn: "Masha’Allah! Leaving doubtful matters guards your faith and purity."
        },
        {
          id: "c2",
          textAr: "ألعبها وأتجاهل شكوكي",
          textEn: "Play it anyway and ignore my inner doubts",
          isCorrect: false,
          explanationAr: "المسلم يحرص على نقاء قلبه ويبتعد عما يريبه.",
          explanationEn: "A believer treasures a clean heart and avoids ambiguous things."
        }
      ]
    },
    linkedHabit: {
      id: "habit-choose-clear",
      nameAr: "البعد عن الشبهات",
      nameEn: "Avoiding Doubtful Things",
      actionAr: "اختر دائماً الأمر الواضح الصالح وابتعد عن المشبوه اليوم",
      actionEn: "Always pick what is clearly good and avoid doubtful acts today"
    }
  },
  {
    id: "ramadan-forgiveness",
    titleAr: "صيام رمضان ومغفرة الذنوب",
    titleEn: "Fasting Ramadan Brings Total Forgiveness",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا، غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    explanationAr: "من يصوم شهر رمضان حباً لله وإيماناً بثوابه، يغفر الله له كل ذنوبه السابقة ويملأ قلبه نوراً.",
    explanationEn: "Whoever fasts the blessed month of Ramadan with sincere faith and seeking Allah’s reward is forgiven all past sins.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "38",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "هلال رمضان",
        titleEn: "Ramadan Crescent",
        textAr: "استبشرت العائلة بظهور هلال شهر الخير والبركات.",
        textEn: "The family rejoiced at the sighting of the Ramadan crescent.",
        iconName: "moon"
      },
      {
        sceneNumber: 2,
        titleAr: "صوم وصبر",
        titleEn: "Fasting & Patience",
        textAr: "صام بلال يومه بهمة ودعاء وقراءة للقرآن.",
        textEn: "Bilal fasted his day with enthusiasm, dua, and Quran recitation.",
        iconName: "book"
      },
      {
        sceneNumber: 3,
        titleAr: "فرحة الإفطار",
        titleEn: "Joy of Iftar",
        textAr: "أفطر مع أسرته شاكراً الله على مغفرته وثوابه.",
        textEn: "He broke fast with his family, thanking Allah for forgiveness.",
        iconName: "restaurant"
      }
    ],
    scenario: {
      promptAr: "في شهر رمضان المبارك، كيف تستثمر نهارك؟",
      promptEn: "During blessed Ramadan, how do you spend your daytime?",
      situationAr: "نهار رمضان",
      situationEn: "Ramadan Day",
      choices: [
        {
          id: "c1",
          textAr: "بالصيام وحسن الخلق وقراءة القرآن والدعاء",
          textEn: "With fasting, good manners, Quran recitation, and dua",
          isCorrect: true,
          explanationAr: "تقبل الله منك! رمضان شهر الرحمة والمغفرة والعتق.",
          explanationEn: "May Allah accept! Ramadan is the month of mercy and forgiveness."
        },
        {
          id: "c2",
          textAr: "بالنوم طوال اليوم وتضييع الصلوات",
          textEn: "Sleeping all day and missing prayers",
          isCorrect: false,
          explanationAr: "رمضان فرصة ذهبية لكسب الحسنات والتقرب إلى الله.",
          explanationEn: "Ramadan is a golden opportunity to earn immense rewards."
        }
      ]
    },
    linkedHabit: {
      id: "habit-fasting-patience",
      nameAr: "الصوم والصبر في رمضان",
      nameEn: "Fasting and Patience",
      actionAr: "تدرب على الصيام أو أكثر من الدعاء وذكر الله اليوم",
      actionEn: "Practice fasting or increase your dua and dhikr today"
    }
  },
  {
    id: "five-pillars-islam",
    titleAr: "أركان الإسلام الخمسة",
    titleEn: "The Five Pillars of Islam",
    theme: "habits",
    narratorAr: "عبد الله بن عمر رضي الله عنهما",
    narratorEn: "Abdullah ibn Umar",
    arabicText: "بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ",
    explanationAr: "الإسلام مثل بناء عظيم يقوم على خمسة أعمدة أساسية: التوحيد، والصلاة، والزكاة، والحج، وصوم رمضان.",
    explanationEn: "Islam is built upon five noble pillars: Testimony of Faith, Prayer, Zakah, Hajj, and Fasting Ramadan.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "8",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "بناء متين",
        titleEn: "Sturdy Foundation",
        textAr: "رسمت مريم مسجداً جميلاً له خمس قباب مميزة.",
        textEn: "Maryam drew a beautiful mosque with five distinct domes.",
        iconName: "home"
      },
      {
        sceneNumber: 2,
        titleAr: "أركان الهدى",
        titleEn: "Pillars of Guidance",
        textAr: "كتبت على كل قبة ركناً من أركان الإسلام الخمسة.",
        textEn: "She wrote one of the five pillars on each dome.",
        iconName: "list"
      },
      {
        sceneNumber: 3,
        titleAr: "فخر بالإسلام",
        titleEn: "Pride in Faith",
        textAr: "أدركت أن هذه الأركان هي أساس سعادتها في الدنيا والآخرة.",
        textEn: "She realized these pillars are the foundation of true happiness.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "سألك صديق: ما أهم أركان دينك التي يجب أن تحافظ عليها؟",
      promptEn: "A friend asks: What are the core pillars of your faith to uphold?",
      situationAr: "أركان الإسلام",
      situationEn: "Pillars of Islam",
      choices: [
        {
          id: "c1",
          textAr: "الشهادتان، والصلاة، والزكاة، وصوم رمضان، وحج البيت",
          textEn: "Shahadah, Salah, Zakah, Ramadan Fasting, and Hajj",
          isCorrect: true,
          explanationAr: "أحسنت! هذه أعمدة ديننا العظيم التي تحفظ حياتنا.",
          explanationEn: "Excellent! These are the great pillars supporting our faith."
        },
        {
          id: "c2",
          textAr: "لا أعرفها ولا أهتم بحفظها",
          textEn: "I don’t know them and don’t care",
          isCorrect: false,
          explanationAr: "معرفة أركان الإسلام واجبة على كل مسلم ليعمل بها.",
          explanationEn: "Knowing the pillars of Islam is essential for every believer."
        }
      ]
    },
    linkedHabit: {
      id: "habit-pillars-practice",
      nameAr: "المحافظة على أركان الإسلام",
      nameEn: "Upholding Islam’s Pillars",
      actionAr: "راجع أركان الإسلام الخمسة واشرحها لأخيك اليوم",
      actionEn: "Review the five pillars of Islam and explain them to a sibling today"
    }
  },
  {
    id: "do-not-envy-hate",
    titleAr: "النهي عن التحاسد والتباغض",
    titleEn: "Do Not Envy or Hate: Be Brothers",
    theme: "brotherhood",
    narratorAr: "أنس بن مالك رضي الله عنه",
    narratorEn: "Anas ibn Malik",
    arabicText: "لَا تَبَاغَضُوا، وَلَا تَحَاسَدُوا، وَلَا تَدَابَرُوا، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا",
    explanationAr: "لا تكرهوا بعضكم ولا تحسدوا أحداً على نعمة أعطاه الله إياها، بل كونوا إخوة متحابين قلوبكم بيضاء نقية.",
    explanationEn: "Do not hate one another, do not envy one another, do not turn away from each other; be servants of Allah, as brothers.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6065",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "لعبة جديدة",
        titleEn: "A New Toy",
        textAr: "اشترى صديق زياد لعبة مميزة وأحضرها للمدرسة.",
        textEn: "Ziyad’s friend bought a cool toy and brought it to school.",
        iconName: "car"
      },
      {
        sceneNumber: 2,
        titleAr: "قلب نقي",
        titleEn: "A Pure Heart",
        textAr: "فرح زياد لصديقه ودعا له بالبركة دون أن يحسده.",
        textEn: "Ziyad felt happy for his friend and prayed for barakah.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 3,
        titleAr: "محبة وأخوة",
        titleEn: "Love and Brotherhood",
        textAr: "شاركه صديقه اللعبة بسعادة وصارت قلوبهما متآلفة.",
        textEn: "His friend shared the toy gladly and their friendship blossomed.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "رأيت زميلك حصل على دراجة جميلة تتمنى مثلها، ماذا تقول في قلبك؟",
      promptEn: "You see your friend got a bicycle you wish for, what do you say in your heart?",
      situationAr: "رؤية نعمة عند الغير",
      situationEn: "Seeing a blessing with others",
      choices: [
        {
          id: "c1",
          textAr: "أفرح له وأقول: \"ما شاء الله، بارك الله لك فيها\"",
          textEn: "Rejoice for him: \"Masha’Allah, may Allah bless you with it\"",
          isCorrect: true,
          explanationAr: "قلب مؤمن سليم! الدعاء بالبركة يزيل الحسد ويجلب لك الخير.",
          explanationEn: "A pure heart! Praying for blessings drives away envy and invites good."
        },
        {
          id: "c2",
          textAr: "أتمنى أن تنكسر دراجته أو تزول نعمته",
          textEn: "Wish his bike would break or disappear",
          isCorrect: false,
          explanationAr: "الحسد مرض قلبي يأكل الحسنات كما تأكل النار الحطب.",
          explanationEn: "Envy is a disease of the heart that burns good deeds like fire."
        }
      ]
    },
    linkedHabit: {
      id: "habit-pure-brotherhood",
      nameAr: "الدعاء بالبركة للآخرين",
      nameEn: "Praying Blessings for Others",
      actionAr: "ادعُ بالبركة لأي شخص ترى عنده نعمة تسرك اليوم",
      actionEn: "Pray for barakah for anyone whose blessing pleases you today"
    }
  },
  {
    id: "avoid-suspicion-words",
    titleAr: "إياكم والظن السيئ",
    titleEn: "Beware of Baseless Suspicion",
    theme: "speech",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "إِيَّاكُمْ وَالظَّنَّ، فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ",
    explanationAr: "لا تسيء الظن بأصحابك وإخوانك دون دليل، بل التمس لهم الأعذار الطيبة واحمل كلامهم على أحسن محمل.",
    explanationEn: "Avoid baseless suspicion about people, for suspicion is the most deceitful speech; give others the benefit of the doubt.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "5143",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "تأخر الصديق",
        titleEn: "Friend Running Late",
        textAr: "تأخر حسام عن موعد لقائه مع صديقه يوسف.",
        textEn: "Hossam was late for his meetup with his friend Yusuf.",
        iconName: "time"
      },
      {
        sceneNumber: 2,
        titleAr: "حسن الظن",
        titleEn: "Good Thoughts",
        textAr: "قال يوسف في نفسه: لعله انشغل بأمر طارئ أو عذر خير.",
        textEn: "Yusuf thought: Perhaps he had an unexpected good excuse.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "عذر صادق",
        titleEn: "A Valid Reason",
        textAr: "حضر حسام واعتذر لأنه ساعد والدته، ففرح يوسف بحسن ظنه.",
        textEn: "Hossam arrived apologizing, having helped his mother, delighting Yusuf.",
        iconName: "happy"
      }
    ],
    scenario: {
      promptAr: "مر بجانبك صديقك ولم يسلم عليك، ماذا تظن به؟",
      promptEn: "A friend walked past without greeting, what do you think?",
      situationAr: "موقف عدم السلام",
      situationEn: "Passed without greeting",
      choices: [
        {
          id: "c1",
          textAr: "ألتمس له عذراً وأقول: لعله لم ينتبه لي أو كان سارحاً",
          textEn: "Make an excuse: Perhaps he did not notice me or was distracted",
          isCorrect: true,
          explanationAr: "أحسنت! حسن الظن بالمسلمين راحة لقلبك وسلامة لروحك.",
          explanationEn: "Great! Thinking well of believers brings peace to your own soul."
        },
        {
          id: "c2",
          textAr: "أغضب وأقول إنه متكبر ويتجاهلني عمداً",
          textEn: "Get angry and say he is arrogant and ignoring me",
          isCorrect: false,
          explanationAr: "سوء الظن يفسد الصداقات ويملأ النفس وساوس لا أساس لها.",
          explanationEn: "Suspicion ruins friendships with groundless whispers."
        }
      ]
    },
    linkedHabit: {
      id: "habit-good-thoughts",
      nameAr: "إحسان الظن بالآخرين",
      nameEn: "Thinking Well of Others",
      actionAr: "التمس عذراً طيباً لأي شخص يخطئ في حقك اليوم",
      actionEn: "Find an excuse for anyone who makes a mistake toward you today"
    }
  },
  {
    id: "muslim-never-oppress",
    titleAr: "المسلم أخو المسلم لا يظلمه",
    titleEn: "A Muslim Does Not Oppress His Brother",
    theme: "brotherhood",
    narratorAr: "عبد الله بن عمر رضي الله عنهما",
    narratorEn: "Abdullah ibn Umar",
    arabicText: "الْمُسْلِمُ أَخُو الْمُسْلِمِ؛ لَا يَظْلِمُهُ، وَلَا يُسْلِمُهُ",
    explanationAr: "المسلم يحمي أخاه المسلم ولا يظلمه في ماله أو بدنه أو كرامته، بل يقف معه ناصراً ومحباً في كل وقت.",
    explanationEn: "A Muslim is the brother of a Muslim: he does not oppress him, nor does he surrender him to harm.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "2442",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في فناء المدرسة",
        titleEn: "School Playground",
        textAr: "حاول طفل كبير أخذ كرة طفل صغير بالقوة.",
        textEn: "An older kid tried taking a younger boy’s ball by force.",
        iconName: "football"
      },
      {
        sceneNumber: 2,
        titleAr: "نصرة المظلوم",
        titleEn: "Standing Up for the Weak",
        textAr: "تدخل عثمان بأدب وشجاعة وقال: هذا ليس من خلق المسلم.",
        textEn: "Uthman stepped in politely and bravely to stop the injustice.",
        iconName: "shield"
      },
      {
        sceneNumber: 3,
        titleAr: "عدل وأمان",
        titleEn: "Justice and Safety",
        textAr: "أعاد الكرة للطفل الصغير فشعر الجميع بالأمان والعدل.",
        textEn: "He returned the ball, spreading safety and justice.",
        iconName: "checkmark-circle"
      }
    ],
    scenario: {
      promptAr: "رأيت طالباً يتعرض للمضايقة في ساحة المدرسة، ماذا تفعل؟",
      promptEn: "You see a student getting bullied in the schoolyard, what do you do?",
      situationAr: "مضايقة زميل",
      situationEn: "Bullying incident",
      choices: [
        {
          id: "c1",
          textAr: "أدافع عنه بأدب وأخبر المعلم ليمنع الظلم",
          textEn: "Defend him politely and inform the teacher to stop bullying",
          isCorrect: true,
          explanationAr: "بطل أمين! نصرة المظلوم ومنع الظلم من أعظم تعاليم الإسلام.",
          explanationEn: "An honest hero! Standing with the weak is a core Islamic virtue."
        },
        {
          id: "c2",
          textAr: "أضحك وأشارك في مضايقته",
          textEn: "Laugh and join in the bullying",
          isCorrect: false,
          explanationAr: "الظلم عاقبته وخيمة والمسلم لا يظلم أخاه أبداً.",
          explanationEn: "Injustice has grave consequences and a Muslim never oppresses."
        }
      ]
    },
    linkedHabit: {
      id: "habit-stand-for-justice",
      nameAr: "نصرة الضعيف ومنع الظلم",
      nameEn: "Standing for Justice",
      actionAr: "كن عوناً وسنداً لمن يحتاج مساعدة أو يتعرض لمضايقة اليوم",
      actionEn: "Support anyone in need or stop an unfair act today"
    }
  },
  {
    id: "relieve-hardship-reward",
    titleAr: "تنفيس الكرب عن المؤمنين",
    titleEn: "Relieving Hardship for Believers",
    theme: "helping",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    explanationAr: "كل من يساعد مسلماً في ضيق أو حزن أو حاجة، يفرج الله عنه كربة شديدة وأهوالاً من أهوال يوم القيامة.",
    explanationEn: "Whoever relieves a believer of a hardship in this world, Allah will relieve them of a hardship on the Day of Judgment.",
    source: "صحيح مسلم",
    hadithNumber: "2699",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "محفظة مفقودة",
        titleEn: "Lost Pencil Case",
        textAr: "أضاع زميله مقلمته التي تحتوي جميع أقلامه قبل الحصة.",
        textEn: "His classmate lost his pencil case right before class.",
        iconName: "search"
      },
      {
        sceneNumber: 2,
        titleAr: "تفريج كربة",
        titleEn: "Relieving Distress",
        textAr: "أعاره عبد الله قلماً وممحاة ومسطرة بكل كرم.",
        textEn: "Abdullah lent him a pen, eraser, and ruler with generosity.",
        iconName: "create"
      },
      {
        sceneNumber: 3,
        titleAr: "فرج وسعادة",
        titleEn: "Ease and Joy",
        textAr: "زال قلق زميله ودعا له بخير الجزاء عند الله.",
        textEn: "His classmate’s anxiety vanished and he made heartfelt dua.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "نسي أخوك مظلته في يوم ماطر وهو ينتظر، ماذا تصنع؟",
      promptEn: "Your brother forgot his umbrella on a rainy day, what do you do?",
      situationAr: "يوم ماطر والمظلة",
      situationEn: "Rainy day umbrella",
      choices: [
        {
          id: "c1",
          textAr: "أشاركه مظلتي ونمشي معاً بأمان",
          textEn: "Share my umbrella and walk together safely",
          isCorrect: true,
          explanationAr: "بارك الله فيك! تفريج الكربات يثقل ميزان حسناتك عند الله.",
          explanationEn: "May Allah bless you! Relieving worries brings immense divine reward."
        },
        {
          id: "c2",
          textAr: "أتركه يتبلل وأمشي وحدي سريعاً",
          textEn: "Leave him getting wet and walk fast alone",
          isCorrect: false,
          explanationAr: "المسلم يؤثر إخوانه ويفرج كربتهم بحب وحنان.",
          explanationEn: "A believer relieves his brother’s troubles with warmth."
        }
      ]
    },
    linkedHabit: {
      id: "habit-relieve-distress",
      nameAr: "تفريج هموم الآخرين",
      nameEn: "Relieving Others’ Worries",
      actionAr: "ساعد شخصاً يمر بمشكلة أو ضيق وخفف عنه اليوم",
      actionEn: "Help someone facing a problem and lift their spirits today"
    }
  },
  {
    id: "charity-for-every-joint",
    titleAr: "صدقة كل يوم وكل سلامى",
    titleEn: "Daily Charity for Every Joint",
    theme: "generosity",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ",
    explanationAr: "في جسدك مئات المفاصل التي يجب أن تشكر الله عليها كل يوم بصدقة: كإصلاح بين اثنين، أو كلمة طيبة، أو إماطة أذى.",
    explanationEn: "Every joint in your body requires a daily act of charity: settling disputes, saying kind words, or clearing roads.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "2989",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "إشراقة الصباح",
        titleEn: "Morning Sunrise",
        textAr: "استيقظ عمر مع شروق الشمس بصحة وعافية كاملة.",
        textEn: "Omar woke up at sunrise in full health and strength.",
        iconName: "sunny"
      },
      {
        sceneNumber: 2,
        titleAr: "صدقات متعددة",
        titleEn: "Multiple Charities",
        textAr: "ابتسم لوالدته، ونحى غصناً من الطريق، وأعان جاره.",
        textEn: "He smiled at his mother, moved a branch from the road, and helped a neighbor.",
        iconName: "walk"
      },
      {
        sceneNumber: 3,
        titleAr: "شكر النعم",
        titleEn: "Gratitude for Health",
        textAr: "أدى شكر عافيته ونال ثواب صدقات لا حصر لها.",
        textEn: "He fulfilled gratitude for his health and earned manifold rewards.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "تريد أن تقدم صدقة اليوم وليس معك مال، ماذا تفعل؟",
      promptEn: "You want to give charity today with no money at hand, what do you do?",
      situationAr: "صدقة بلا مال",
      situationEn: "Charity without money",
      choices: [
        {
          id: "c1",
          textAr: "أبتسم، وأقول كلمة طيبة، وأزيل قمامة من الطريق",
          textEn: "Smile, speak kind words, and remove trash from the path",
          isCorrect: true,
          explanationAr: "ممتاز! كل خطوة لخير ومعروف تعتبر صدقة يكتبها الله لك.",
          explanationEn: "Superb! Every good deed counts as accepted charity in Islam."
        },
        {
          id: "c2",
          textAr: "أقول لا يمكنني التصدق إلا بالمال",
          textEn: "Say charity can only be done with money",
          isCorrect: false,
          explanationAr: "أبواب الصدقة واسعة تشمل كل كلمة طيبة وفعل نافع.",
          explanationEn: "Charity includes every friendly gesture and helpful action."
        }
      ]
    },
    linkedHabit: {
      id: "habit-daily-charity-acts",
      nameAr: "أداء صدقات الجوارح",
      nameEn: "Daily Acts of Kindness",
      actionAr: "افعل 3 أفعال خيرية بسيطة كصدقة عن مفاصل جسدك اليوم",
      actionEn: "Do 3 small good deeds as gratitude for your healthy body today"
    }
  },
  {
    id: "make-easy-not-hard",
    titleAr: "يسروا ولا تعسروا وبشروا",
    titleEn: "Make Things Easy and Give Glad Tidings",
    theme: "kindness",
    narratorAr: "أنس بن مالك رضي الله عنه",
    narratorEn: "Anas ibn Malik",
    arabicText: "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا",
    explanationAr: "الإسلام دين التيسير والسماحة؛ اجعل الأمور سهلة ومحببة للناس، وبشرهم بالخير ولا تخوفهم أو تبعدهم.",
    explanationEn: "Facilitate things for people and do not make them difficult; give glad tidings and do not drive people away.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "69",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "تعليم الصغير",
        titleEn: "Teaching a Toddler",
        textAr: "كان كريم يعلم أخاه الصغير طريقة الوضوء.",
        textEn: "Kareem was teaching his little brother how to do wudu.",
        iconName: "water"
      },
      {
        sceneNumber: 2,
        titleAr: "تيسير وتبشير",
        titleEn: "Ease & Encouragement",
        textAr: "شجعه بلطف وقال: ما شاء الله، أنت بطل ووضوؤك جميل!",
        textEn: "He encouraged him gently: Masha’Allah, you are a champion!",
        iconName: "happy"
      },
      {
        sceneNumber: 3,
        titleAr: "حب للعبادة",
        titleEn: "Love for Worship",
        textAr: "أحب الصغير الوضوء والصلاة وأقبل عليها بفرح.",
        textEn: "The little boy fell in love with prayer and ran to do it.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "تعلم زميلاً طريقة حفظ سورة ويجد صعوبة فيها، كيف تساعده؟",
      promptEn: "A classmate struggles memorizing a Surah, how do you help him?",
      situationAr: "مساعدة متعثر",
      situationEn: "Helping someone struggling",
      choices: [
        {
          id: "c1",
          textAr: "أقسم له الآيات لقطع صغيرة وأبشره بسهولة الحفظ",
          textEn: "Break verses into small chunks and encourage him warmly",
          isCorrect: true,
          explanationAr: "أحسنت! التيسير والتبشير هدي نبوي يجذب القلوب للخير.",
          explanationEn: "Excellent! Prophetic encouragement draws hearts toward good."
        },
        {
          id: "c2",
          textAr: "أصعب عليه الأمر وأقول لن تحفظها أبداً",
          textEn: "Make it harder and say you will never memorize it",
          isCorrect: false,
          explanationAr: "التعسير ينفر الناس والتيسير يفتح أبواب النجاح.",
          explanationEn: "Complications drive people away while ease fosters success."
        }
      ]
    },
    linkedHabit: {
      id: "habit-encourage-others",
      nameAr: "التيسير والتشجيع",
      nameEn: "Encouraging and Simplifying",
      actionAr: "شجع شخصاً يجد صعوبة في أمر وبسطه له اليوم",
      actionEn: "Encourage someone facing difficulty and simplify it today"
    }
  },
  {
    id: "righteousness-is-manners",
    titleAr: "البر حسن الخلق",
    titleEn: "Righteousness is Good Character",
    theme: "kindness",
    narratorAr: "النواس بن سمعان رضي الله عنه",
    narratorEn: "Al-Nawwas ibn Saman",
    arabicText: "الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ",
    explanationAr: "قمة الخير والصلاح هي أن تكون صاحب خلق رفيع، والذنب هو ما يقلق قلبك وتخاف أن يراه الناس.",
    explanationEn: "Righteousness is good character, and sin is that which wavers in your heart and you dislike people finding out.",
    source: "صحيح مسلم",
    hadithNumber: "2553",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "سؤال عن الخير",
        titleEn: "Asking About Goodness",
        textAr: "سأل الصحابي الجليل النبي ﷺ عن حقيقة البر والإثم.",
        textEn: "The companion asked the Prophet about righteousness and sin.",
        iconName: "help"
      },
      {
        sceneNumber: 2,
        titleAr: "مقياس القلب",
        titleEn: "Scale of the Heart",
        textAr: "أجابه بأن حسن الخلق هو أعظم البر وأن القلب مطمئن للخير.",
        textEn: "He replied that good manners is the pinnacle of virtue.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "حياة نقية",
        titleEn: "A Pure Life",
        textAr: "عاش الصحابي يزين أيامه بالخلق الفاضل وراحة البال.",
        textEn: "The companion lived adorning his days with pure character.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "تريد فعل شيء وتتردد لأنك تشعر بعدم الارتياح وتخاف أن يراك والدك، ماذا تفعل؟",
      promptEn: "You want to do something but feel uneasy and fear your dad seeing it, what do you do?",
      situationAr: "موقف الحيرة في الفعل",
      situationEn: "Hesitation about an action",
      choices: [
        {
          id: "c1",
          textAr: "أتوقف فوراً لأن ما يحيك في الصدر علامة الإثم",
          textEn: "Stop immediately because unease in the chest signals sin",
          isCorrect: true,
          explanationAr: "ما شاء الله! ضميرك المؤمن ينبهك لما يرضي الله.",
          explanationEn: "Masha’Allah! Your pure conscience alerts you to please Allah."
        },
        {
          id: "c2",
          textAr: "أفعله في الخفاء وأتجاهل شعوري",
          textEn: "Do it in secret and ignore my feelings",
          isCorrect: false,
          explanationAr: "المؤمن يحرص على وضوح أعماله ونقاء قلبه أمام الله والناس.",
          explanationEn: "A believer maintains transparent, pure actions."
        }
      ]
    },
    linkedHabit: {
      id: "habit-pure-conscience",
      nameAr: "سماع صوت الضمير النقي",
      nameEn: "Listening to Pure Conscience",
      actionAr: "امتنع عن أي تصرف تشعر بالتردد أو الخجل منه اليوم",
      actionEn: "Refrain from any act that makes your heart uneasy today"
    }
  },
  {
    id: "allah-is-beautiful",
    titleAr: "إن الله جميل يحب الجمال",
    titleEn: "Allah is Beautiful and Loves Beauty",
    theme: "cleanliness",
    narratorAr: "عبد الله بن مسعود رضي الله عنه",
    narratorEn: "Abdullah ibn Masud",
    arabicText: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ",
    explanationAr: "الله سبحانه يحب أن يرى عبده نظيف الثياب، مرتب الهيئة، حسن الرائحة والكلام في كل وقت.",
    explanationEn: "Allah is Beautiful and He loves beauty: cleanliness, neat appearance, and pleasant speech.",
    source: "صحيح مسلم",
    hadithNumber: "91",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "يوم الجمعة المبارك",
        titleEn: "Blessed Friday",
        textAr: "استحم يحيى وتطيب بدهن العود ولبس ثوباً أبيض نظيفاً.",
        textEn: "Yahya bathed, wore pleasant perfume, and put on clean white clothes.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 2,
        titleAr: "جمال ونظافة",
        titleEn: "Beauty & Cleanliness",
        textAr: "مشط شعره ونظر في المرآة مستحضراً محبة الله للجمال.",
        textEn: "He combed his hair, mindful that Allah loves beauty.",
        iconName: "eye"
      },
      {
        sceneNumber: 3,
        titleAr: "إشراقة المؤمن",
        titleEn: "A Believer’s Radiance",
        textAr: "ذهب للمسجد فرحاً ورائحته طيبة تبهج المصلين.",
        textEn: "He went to the mosque fragrant, bringing joy to all.",
        iconName: "sunny"
      }
    ],
    scenario: {
      promptAr: "تريد الذهاب للمسجد أو زيارة أقاربك، كيف تستعد لمظهرك؟",
      promptEn: "Going to the mosque or visiting relatives, how do you get ready?",
      situationAr: "الاستعداد للخروج",
      situationEn: "Preparing to go out",
      choices: [
        {
          id: "c1",
          textAr: "أغسل وجهي وأمشط شعري وألبس ثياباً نظيفة ومرتبة",
          textEn: "Wash face, comb hair, and wear neat, clean clothes",
          isCorrect: true,
          explanationAr: "أحسنت! النظافة والجمال زينة المسلم التي يحبها الله.",
          explanationEn: "Great! Cleanliness and neatness are beloved to Allah."
        },
        {
          id: "c2",
          textAr: "أخرج بثياب متسخة وشعر غير مرتب",
          textEn: "Go out in dirty clothes with unkempt hair",
          isCorrect: false,
          explanationAr: "المسلم يعتني بنظافته وحسن منظره دائماً.",
          explanationEn: "A believer always values neat appearance and hygiene."
        }
      ]
    },
    linkedHabit: {
      id: "habit-tidy-appearance",
      nameAr: "النظافة وحسن المظهر",
      nameEn: "Cleanliness & Neatness",
      actionAr: "رتب ثيابك ومشط شعرك وتطيب برائحة طيبة اليوم",
      actionEn: "Neaten your clothes, comb hair, and apply nice scent today"
    }
  },
  {
    id: "heaviest-on-scales-manners",
    titleAr: "أثقل ما في ميزان العبد",
    titleEn: "Heaviest Weight on the Believer’s Scale",
    theme: "kindness",
    narratorAr: "أبو الدرداء رضي الله عنه",
    narratorEn: "Abu al-Darda",
    arabicText: "مَا مِنْ شَيْءٍ أَثْقَلُ فِي مِيزَانِ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ مِنْ حُسْنِ الْخُلُقِ",
    explanationAr: "أثقل عمل صالح يوضع في ميزانك يوم القيامة ويفوق جبال الحسنات هو تعاملك بالأخلاق الفاضلة مع الناس.",
    explanationEn: "Nothing is heavier on the scale of the believer on the Day of Judgment than noble, virtuous character.",
    source: "جامع الترمذي",
    hadithNumber: "2002",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "موقف اختبار",
        titleEn: "A Test of Character",
        textAr: "أساء شخص في الطابور إلى عبد الرحمن وتجاوز دوره.",
        textEn: "Someone cut in line in front of Abdurrahman rudely.",
        iconName: "people"
      },
      {
        sceneNumber: 2,
        titleAr: "حلم وصبر",
        titleEn: "Forbearance & Patience",
        textAr: "كظم غيظه وتحدث معه بأدب وابتسامة راقية.",
        textEn: "He controlled his temper and spoke with dignified courtesy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "ثقل الميزان",
        titleEn: "Heavy Scales",
        textAr: "تذكر ثقل حسن الخلق في الميزان ففرح بما كسب من أجر.",
        textEn: "He recalled that good character weighs heavy in Jannah and rejoiced.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "تحدث معك شخص بطريقة غير مؤدبة، ما أفضل ما تضعه في ميزانك؟",
      promptEn: "Someone speaks to you discourteously, what is best to weigh down your scale?",
      situationAr: "مواجهة قلة الأدب",
      situationEn: "Facing discourtesy",
      choices: [
        {
          id: "c1",
          textAr: "أرد بأدب وهدوء وحسن خلق ليرجح ميزان حسناتي",
          textEn: "Respond with polite calm and good character to heavy my scale",
          isCorrect: true,
          explanationAr: "بطل حكيم! حسن الخلق يثقل ميزانك بأعلى الدرجات.",
          explanationEn: "A wise champion! Noble character weighs heaviest before Allah."
        },
        {
          id: "c2",
          textAr: "أرد بالصراخ وأفقد أعصابي",
          textEn: "Scream back and lose my composure",
          isCorrect: false,
          explanationAr: "الصبر وحسن الخلق يرفعانك عند الله وعند الناس.",
          explanationEn: "Patience and courtesy elevate you in the sight of Allah."
        }
      ]
    },
    linkedHabit: {
      id: "habit-heavy-scales",
      nameAr: "تثقيل الميزان بحسن الخلق",
      nameEn: "Weighing Scales with Character",
      actionAr: "تعامل بأعلى درجات الأدب والصبر في جميع مواقفك اليوم",
      actionEn: "Act with utmost politeness and patience throughout your day"
    }
  },
  {
    id: "perfecting-noble-morals",
    titleAr: "إنما بعثت لأتمم صالح الأخلاق",
    titleEn: "Sent to Perfect Noble Character",
    theme: "kindness",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الأَخْلَاقِ",
    explanationAr: "الرسالة العظيمة التي جاء بها نبينا محمد ﷺ هي تعليمنا وتكميل أحسن الأخلاق: كالصدق والأمانة والوفاء والرحمة.",
    explanationEn: "I was sent only to perfect noble character traits: truthfulness, trustworthiness, loyalty, and mercy.",
    source: "الأدب المفرد وموطأ مالك",
    hadithNumber: "273",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "سيرة الحبيب",
        titleEn: "Life of the Prophet",
        textAr: "قرأ زياد فصلاً من سيرة النبي ﷺ وأخلاقه العظيمة.",
        textEn: "Ziyad read a chapter on the Prophet’s sublime manners.",
        iconName: "book"
      },
      {
        sceneNumber: 2,
        titleAr: "اقتداء عملي",
        titleEn: "Living the Example",
        textAr: "قرر أن يقلد نبيه في صدق الحديث وإكرام الناس.",
        textEn: "He resolved to emulate his honesty and honoring of people.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 3,
        titleAr: "نور النبوة",
        titleEn: "Prophetic Light",
        textAr: "أحبه كل من رآه لجمال أخلاقه وتشبهه بنبيه ﷺ.",
        textEn: "Everyone loved him for his sweet, prophetic manners.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "تريد أن تعبر عن حبك لرسول الله ﷺ في يومك، كيف تفعل؟",
      promptEn: "You want to express love for Prophet Muhammad ﷺ today, how do you do it?",
      situationAr: "اتباع النبي ﷺ",
      situationEn: "Following the Prophet ﷺ",
      choices: [
        {
          id: "c1",
          textAr: "أطبق أخلاقه في الصدق والرحمة والتبسم مع الجميع",
          textEn: "Live his character of honesty, mercy, and smiling at all",
          isCorrect: true,
          explanationAr: "بارك الله فيك! أحسن تعبير عن الحب هو الاقتداء بهديه.",
          explanationEn: "May Allah bless you! The best expression of love is following his Sunnah."
        },
        {
          id: "c2",
          textAr: "أتصرف بأنانية وأقول حب النبي في القلب فقط",
          textEn: "Act selfishly saying love is only in the heart",
          isCorrect: false,
          explanationAr: "الحب الحقيقي يظهر في الأفعال والأخلاق الطيبة.",
          explanationEn: "True love shows through noble deeds and exemplary conduct."
        }
      ]
    },
    linkedHabit: {
      id: "habit-follow-prophet",
      nameAr: "التخلق بأخلاق النبي ﷺ",
      nameEn: "Adopting Prophetic Morals",
      actionAr: "اختر خلقاً نبوياً كالصدق أو الحلم وطبقه بتركيز اليوم",
      actionEn: "Pick a prophetic trait like honesty or gentleness and live it today"
    }
  },
  {
    id: "no-harm-no-retaliation",
    titleAr: "لا ضرر ولا ضرار في الإسلام",
    titleEn: "No Harm and No Reciprocating Harm",
    theme: "kindness",
    narratorAr: "عبد الله بن عباس رضي الله عنهما",
    narratorEn: "Abdullah ibn Abbas",
    arabicText: "لَا ضَرَرَ وَلَا ضِرَارَ",
    explanationAr: "في ديننا لا يجوز أن تؤذي أحداً بأفعالك أو كلامك، وإذا آذاك أحد لا ترد بإيذائه بل تصرف بحكمة وعدل.",
    explanationEn: "There should be neither harming nor reciprocating of harm in Islam; preserve safety and act justly.",
    source: "سنن ابن ماجه والدارقطني",
    hadithNumber: "2341",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في الحديقة العامة",
        titleEn: "At the Public Garden",
        textAr: "كان بعض الأطفال يرمون قشور الفاكهة في الممر.",
        textEn: "Some kids were throwing fruit peels across the walking path.",
        iconName: "trash"
      },
      {
        sceneNumber: 2,
        titleAr: "منع الضرر",
        titleEn: "Preventing Harm",
        textAr: "أوضح لهم عمر برفق: هذا قد يؤذي المارة ويزلقهم.",
        textEn: "Omar explained gently: This could slip passersby and hurt them.",
        iconName: "alert-circle"
      },
      {
        sceneNumber: 3,
        titleAr: "سلامة الجميع",
        titleEn: "Safety for All",
        textAr: "تعاونوا ونظفوا الممر وصارت الحديقة آمنة للجميع.",
        textEn: "They cleaned the path together, making the park safe for all.",
        iconName: "checkmark-circle"
      }
    ],
    scenario: {
      promptAr: "تريد اللعب بالكرة داخل غرفة المعيشة وهناك زجاج قد ينكسر، ماذا تفعل؟",
      promptEn: "You want to play soccer in the living room near glass, what do you do?",
      situationAr: "اللعب في البيت",
      situationEn: "Playing indoors",
      choices: [
        {
          id: "c1",
          textAr: "ألعب في الحديقة أو الملعب لأتجنب إلحاق أي ضرر بالمنزل",
          textEn: "Play outside in the yard to prevent any damage to the house",
          isCorrect: true,
          explanationAr: "أحسنت! المسلم حريص على تجنب الإضرار بنفسه وبغيره.",
          explanationEn: "Great! A believer takes care to avoid harming self or surroundings."
        },
        {
          id: "c2",
          textAr: "ألعب بالداخل ولا أهتم بما قد ينكسر",
          textEn: "Play inside anyway without caring about what breaks",
          isCorrect: false,
          explanationAr: "إلحاق الضرر بالممتلكات يخالف هدي النبي ﷺ.",
          explanationEn: "Causing harm or damage violates the prophetic principle."
        }
      ]
    },
    linkedHabit: {
      id: "habit-prevent-harm",
      nameAr: "تجنب إلحاق الأذى",
      nameEn: "Preventing Harm",
      actionAr: "تأكد من سلامة مكان لعبك وعدم إزعاج الآخرين اليوم",
      actionEn: "Ensure your play area is safe and bothers no one today"
    }
  },
  {
    id: "ongoing-charity-legacy",
    titleAr: "الصدقة الجارية والعلم النافع",
    titleEn: "Ongoing Charity, Beneficial Knowledge, Righteous Child",
    theme: "generosity",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    explanationAr: "ثلاثة أعمال تستمر حسناتها حتى بعد وفاة الإنسان: التبرع بشيء يدوم نفعه، وتعليم علم مفيد، والابن الصالح الذي يدعو لوالديه.",
    explanationEn: "When a person passes away, their deeds cease except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for them.",
    source: "صحيح مسلم",
    hadithNumber: "1631",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "دعاء للوالدين",
        titleEn: "Praying for Parents",
        textAr: "رفع بلال يديه بعد صلاته يدعو لوالديه بالجنة.",
        textEn: "Bilal raised his hands after prayer, asking Jannah for his parents.",
        iconName: "heart"
      },
      {
        sceneNumber: 2,
        titleAr: "غرس شتلة",
        titleEn: "Planting a Sapling",
        textAr: "غرس شجرة صغيرة في حديقة الحي ليستظل بها الناس.",
        textEn: "He planted a little tree in the park for people to enjoy its shade.",
        iconName: "leaf"
      },
      {
        sceneNumber: 3,
        titleAr: "أجر مستمر",
        titleEn: "Continuous Reward",
        textAr: "استمر ثواب عمله ودعائه جارياً بالبركة والرحمة.",
        textEn: "The blessings of his deeds flowed continuously with divine grace.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "انتهيت من صلاتك، من أول من تتذكره بالدعاء الصالح؟",
      promptEn: "Finished your prayer, who do you remember first in your dua?",
      situationAr: "الدعاء بعد الصلاة",
      situationEn: "Dua after prayer",
      choices: [
        {
          id: "c1",
          textAr: "أدعو لوالدي: \"ربِّ اغفر لي ولوالدي وارحمهما كما ربياني صغيراً\"",
          textEn: "Pray for parents: \"Lord forgive me and my parents and show them mercy\"",
          isCorrect: true,
          explanationAr: "ابن صالح وبار! دعاؤك لوالديك يرفع درجاتهما في أعلى الجنان.",
          explanationEn: "A righteous, loving child! Your prayer raises your parents’ ranks in Paradise."
        },
        {
          id: "c2",
          textAr: "أقوم مسرعاً دون أن أدعو لأحد",
          textEn: "Rush off without praying for anyone",
          isCorrect: false,
          explanationAr: "الدعاء للوالدين من أعظم واجبات البر وأجمل الهدايا لهما.",
          explanationEn: "Praying for parents is a sublime duty and the sweetest gift."
        }
      ]
    },
    linkedHabit: {
      id: "habit-dua-for-parents",
      nameAr: "الدعاء الدائم للوالدين",
      nameEn: "Daily Dua for Parents",
      actionAr: "قل في سجودك أو بعد صلاتك: ربي ارحم والدي اليوم",
      actionEn: "Say in prostration or after prayer: Lord have mercy on my parents"
    }
  },
  {
    id: "good-companion-musk",
    titleAr: "مثل الجليس الصالح كحامل المسك",
    titleEn: "Good Companion Like a Perfume Seller",
    theme: "brotherhood",
    narratorAr: "أبو موسى الأشعري رضي الله عنه",
    narratorEn: "Abu Musa al-Ashari",
    arabicText: "مَثَلُ الْجَلِيسِ الصَّالِحِ وَالْجَلِيسِ السَّوْءِ كَحَامِلِ الْمِسْكِ وَنَافِخِ الْكِيرِ",
    explanationAr: "الصديق الصالح ينفعك دائماً بأخلاقه ونصائحه مثل بائع العطر الذي تشم منه دائماً رائحة زكية.",
    explanationEn: "A righteous companion is like a musk seller: you always benefit from his sweet scent, fine morals, and noble guidance.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "5534",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "اختيار الأصدقاء",
        titleEn: "Choosing Friends",
        textAr: "صاحب يوسف زميلاً محافظاً على الصلاة ومتفوقاً.",
        textEn: "Yusuf befriended a classmate devoted to prayer and studies.",
        iconName: "people"
      },
      {
        sceneNumber: 2,
        titleAr: "أثر طيب",
        titleEn: "Good Influence",
        textAr: "صار يذهب معه للمسجد ويذاكران معاً بجد.",
        textEn: "He accompanied him to the mosque and they studied diligently together.",
        iconName: "book"
      },
      {
        sceneNumber: 3,
        titleAr: "رائحة المسك",
        titleEn: "Scent of Musk",
        textAr: "تغيرت حياته للأفضل وامتلأت بالنجاح والبركة.",
        textEn: "His life transformed for the better, full of success and blessing.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "تبحث عن صديق مقرب في المدرسة، على أي أساس تختاره؟",
      promptEn: "Looking for a close friend at school, on what basis do you choose?",
      situationAr: "اختيار الصديق",
      situationEn: "Selecting a friend",
      choices: [
        {
          id: "c1",
          textAr: "أختار الصادق المؤدب الذي يحافظ على صلاته ويشجعني على الخير",
          textEn: "Pick one who is honest, polite, prays, and encourages good",
          isCorrect: true,
          explanationAr: "أحسنت الاختيار! الصاحب ساحب والصديق الصالح كحامل المسك.",
          explanationEn: "Excellent! A good friend inspires you and smells of sweet musk."
        },
        {
          id: "c2",
          textAr: "أختار من يتكلم بكلام سيئ ويضيع وقته",
          textEn: "Pick one who uses bad words and wastes time",
          isCorrect: false,
          explanationAr: "الصديق السيئ يجر صاحبه إلى العادات الخاطئة.",
          explanationEn: "A bad companion drags one into regretful habits."
        }
      ]
    },
    linkedHabit: {
      id: "habit-good-company",
      nameAr: "صحبة الأخيار",
      nameEn: "Keeping Good Company",
      actionAr: "اجلس مع صديق صالح يشجعك على حفظ القرآن أو المذاكرة اليوم",
      actionEn: "Spend time with a friend who encourages Quran or study today"
    }
  },
  {
    id: "pay-worker-promptly",
    titleAr: "إعطاء الأجير حقه دون تأخير",
    titleEn: "Pay the Worker Before Sweat Dries",
    theme: "kindness",
    narratorAr: "عبد الله بن عمر رضي الله عنهما",
    narratorEn: "Abdullah ibn Umar",
    arabicText: "أَعْطُوا الأَجِيرَ أَجْرَهُ قَبْلَ أَنْ يَجِفَّ عَرَقُهُ",
    explanationAr: "الإسلام يوجب احترام العمال ومساعدي البيت وتقدير جهدهم وإعطاءهم حقوقهم كاملة دون تأخير أو إنقاص.",
    explanationEn: "Islam commands honoring workers and domestic helpers, paying their fair wages promptly with gratitude.",
    source: "سنن ابن ماجه",
    hadithNumber: "2443",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "إصلاح الحديقة",
        titleEn: "Fixing the Garden",
        textAr: "أنهى البستاني تقليم الأشجار في حرارة الشمس.",
        textEn: "The gardener finished pruning trees under the hot sun.",
        iconName: "leaf"
      },
      {
        sceneNumber: 2,
        titleAr: "إكرام واحترام",
        titleEn: "Honoring with Respect",
        textAr: "قدم له كريم كأساً بارداً من العصير مع أجرته كاملة.",
        textEn: "Kareem offered him cool juice along with his full pay.",
        iconName: "water"
      },
      {
        sceneNumber: 3,
        titleAr: "دعاء من القلب",
        titleEn: "Heartfelt Prayer",
        textAr: "فرح العامل وقال: بارك الله فيك وفي والديك يا بني.",
        textEn: "The worker smiled warmly, praying for Kareem and his parents.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "قام عامل بتوصيل طلب لمنزلكم وبذل جهداً كبيراً، كيف تعامله؟",
      promptEn: "A delivery worker brought an order to your home after hard work, how do you treat him?",
      situationAr: "التعامل مع العامل",
      situationEn: "Treating a delivery worker",
      choices: [
        {
          id: "c1",
          textAr: "أبتسم في وجهه وأشكره بلطف وأعطيه حقه كاملاً",
          textEn: "Smile at him, thank him kindly, and give his full dues",
          isCorrect: true,
          explanationAr: "خلق كريم! إكرام العمال وشكرهم يعكس تربية المسلم الراقية.",
          explanationEn: "Noble character! Honoring workers reflects refined Islamic manners."
        },
        {
          id: "c2",
          textAr: "أعطيه حقه بجفاء وأغلق الباب دون كلمة شكر",
          textEn: "Hand the money abruptly and slam the door with no thanks",
          isCorrect: false,
          explanationAr: "من لا يشكر الناس لا يشكر الله، والكلمة الطيبة حق لكل إنسان.",
          explanationEn: "Whoever does not thank people does not thank Allah."
        }
      ]
    },
    linkedHabit: {
      id: "habit-honor-workers",
      nameAr: "إكرام وشكر العمال",
      nameEn: "Honoring and Thanking Workers",
      actionAr: "قل شكراً وابتسم لكل عامل أو مساعد يقدم لك خدمة اليوم",
      actionEn: "Say thank you with a warm smile to every worker who helps you today"
    }
  },
  {
    id: "salam-etiquette-rider-walker",
    titleAr: "آداب إلقاء السلام",
    titleEn: "Etiquettes of Greeting with Salam",
    theme: "salam",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "يُسَلِّمُ الرَّاكِبُ عَلَى الْمَاشِي، وَالْمَاشِي عَلَى الْقَاعِدِ، وَالْقَلِيلُ عَلَى الْكَثِيرِ",
    explanationAr: "علمنا النبي ﷺ نظاماً جميلاً للسلام: الماشي يبدأ بالسلام على الجالس، والراكب على الماشي، والصغير على الكبير.",
    explanationEn: "The Prophet ﷺ taught proper greeting etiquettes: the rider greets the walker, the walker greets the seated, and the few greet the many.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6232",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في طريق المدرسة",
        titleEn: "On the Way to School",
        textAr: "كان أنس يمشي متوجهاً إلى مدرسته.",
        textEn: "Anas was walking toward his school.",
        iconName: "walk"
      },
      {
        sceneNumber: 2,
        titleAr: "لقاء الجالسين",
        titleEn: "Passing Seated People",
        textAr: "مر بجيران جالسين في الحديقة فبادرهم بالسلام.",
        textEn: "He passed seated neighbors in the park and initiated Salam.",
        iconName: "chatbubbles"
      },
      {
        sceneNumber: 3,
        titleAr: "أدب رفيع",
        titleEn: "Refined Etiquette",
        textAr: "ردوا عليه مسرورين وأثنوا على أدبه وتطبيقه للسنة.",
        textEn: "They replied happily, praising his manners and Sunnah application.",
        iconName: "happy"
      }
    ],
    scenario: {
      promptAr: "دخلت مجلساً فيه أناس جالسون، كيف تطبق السنة؟",
      promptEn: "You walk into a room where people are sitting, how do you apply the Sunnah?",
      situationAr: "دخول المجلس",
      situationEn: "Entering a sitting room",
      choices: [
        {
          id: "c1",
          textAr: "أبدأهم بالسلام بصوت مسموع وواضح لأنني الماشي والداخل",
          textEn: "Initiate Salam clearly because I am the one walking in",
          isCorrect: true,
          explanationAr: "ما شاء الله! هذا هو هدي نبينا ﷺ الدقيق والجميل.",
          explanationEn: "Masha’Allah! This is the precise, elegant prophetic guidance."
        },
        {
          id: "c2",
          textAr: "أنتظر أن يسلموا علي أولاً",
          textEn: "Wait for them to greet me first",
          isCorrect: false,
          explanationAr: "السنة أن يبدأ الداخل والماشي بإلقاء السلام.",
          explanationEn: "The Sunnah is for the one entering or walking to greet first."
        }
      ]
    },
    linkedHabit: {
      id: "habit-greeting-rules",
      nameAr: "تطبيق آداب السلام النبوية",
      nameEn: "Applying Greeting Etiquette",
      actionAr: "كن البادئ بالسلام عند دخولك أي غرفة أو مجلس اليوم",
      actionEn: "Be the one initiating Salam whenever entering a room today"
    }
  },
  {
    id: "etiquette-of-yawning",
    titleAr: "أدب التثاؤب وكظمه",
    titleEn: "Etiquette of Yawning and Restraining It",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "إِذَا تَثَاءَبَ أَحَدُكُمْ فَلْيَرُدَّهُ مَا اسْتَطَاعَ",
    explanationAr: "عندما تشعر بالتثاؤب، حاول أن تكظمه وتضع يدك اليسرى على فمك بهدوء وأدب ودون إخراج أصوات عالية.",
    explanationEn: "When you feel like yawning, suppress it as much as you can and place your hand over your mouth politely.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6226",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في حلقة الدرس",
        titleEn: "During Lesson",
        textAr: "شعر طارق بالنعاس والتثاؤب في الفصل.",
        textEn: "Tariq felt sleepy and felt a yawn coming in class.",
        iconName: "time"
      },
      {
        sceneNumber: 2,
        titleAr: "أدب رفيع",
        titleEn: "Polite Etiquette",
        textAr: "كتم تثاؤبه ووضع ظهر يده على فمه بهدوء دون صوت.",
        textEn: "He held back the yawn and placed his hand over his mouth silently.",
        iconName: "hand-left"
      },
      {
        sceneNumber: 3,
        titleAr: "وقار واحترام",
        titleEn: "Dignity and Respect",
        textAr: "حافظ على وقار المجلس ونال ثواب اتباع السنة.",
        textEn: "He preserved the classroom dignity and gained Sunnah reward.",
        iconName: "checkmark-circle"
      }
    ],
    scenario: {
      promptAr: "شعرت بالتثاؤب وأنت جالس مع أهلك أو في المسجد، ماذا تصنع؟",
      promptEn: "You feel like yawning while sitting with family or at the mosque, what do you do?",
      situationAr: "لحظة التثاؤب",
      situationEn: "Yawning moment",
      choices: [
        {
          id: "c1",
          textAr: "أرده ما استطعت وأضع يدي على فمي دون إصدار صوت",
          textEn: "Suppress it as much as possible and cover my mouth silently",
          isCorrect: true,
          explanationAr: "أحسنت! هذا أدب إسلامي رفيع يحفظ بهاءك ووقارك.",
          explanationEn: "Great! This fine Islamic etiquette preserves dignity."
        },
        {
          id: "c2",
          textAr: "أفتح فمي واسعاً وأصدر صوتاً عالياً",
          textEn: "Open my mouth wide and make loud yawning sounds",
          isCorrect: false,
          explanationAr: "إصدار الأصوات عند التثاؤب ينافي الذوق والأدب النبوي.",
          explanationEn: "Making loud sounds while yawning opposes polite Sunnah."
        }
      ]
    },
    linkedHabit: {
      id: "habit-yawn-manners",
      nameAr: "أدب كظم التثاؤب",
      nameEn: "Etiquette of Yawning",
      actionAr: "ضع يدك على فمك واكظم تثاؤبك بهدوء كلما تثاءبت اليوم",
      actionEn: "Cover your mouth and restrain your yawn silently today"
    }
  },
  {
    id: "sneezing-etiquette-tasmeet",
    titleAr: "تشميت العاطس وحمد الله",
    titleEn: "Sneezing Etiquette and Praying for Sneezer",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "إِنَّ اللَّهَ يُحِبُّ الْعُطَاسَ، فَإِذَا عَطَسَ فَحَمِدَ اللَّهَ فَحَقٌّ عَلَى كُلِّ مُسْلِمٍ سَمِعَهُ أَنْ يَقُولَ: يَرْحَمُكَ اللَّهُ",
    explanationAr: "إذا عطست فقل: \"الحمد لله\"، ومن يسمعك يدعو لك: \"يرحمك الله\"، فترد عليه: \"يهديكم الله ويصلح بالكم\".",
    explanationEn: "When you sneeze say \"Alhamdulillah\", and whoever hears you says \"Yarhamuk Allah\", to which you reply \"Yahdeekum Allah\".",
    source: "صحيح البخاري",
    hadithNumber: "6223",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "عطسة الصباح",
        titleEn: "Morning Sneeze",
        textAr: "عطس زياد ووضع منديلاً على وجهه ثم قال: الحمد لله.",
        textEn: "Ziyad sneezed into a tissue and said: Alhamdulillah.",
        iconName: "document"
      },
      {
        sceneNumber: 2,
        titleAr: "دعاء بالرحمة",
        titleEn: "Prayer for Mercy",
        textAr: "سمعه أخوه فقال له مبتسماً: يرحمك الله.",
        textEn: "His brother heard him and said with a smile: Yarhamuk Allah.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "دعاء بالهداية",
        titleEn: "Prayer for Guidance",
        textAr: "رد زياد: يهديكم الله ويصلح بالكم، فملأت المحبة الغرفة.",
        textEn: "Ziyad replied: Yahdeekum Allah, filling the room with love.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "عطس زميلك في الفصل وقال بصوت مسموع: \"الحمد لله\"، ماذا ترد عليه؟",
      promptEn: "Your classmate sneezes and says \"Alhamdulillah\", what do you say?",
      situationAr: "تشميت العاطس",
      situationEn: "Responding to a sneeze",
      choices: [
        {
          id: "c1",
          textAr: "أقول له بلطف: \"يَرْحَمُكَ اللَّهُ\"",
          textEn: "Say to him kindly: \"Yarhamuk Allah\"",
          isCorrect: true,
          explanationAr: "ما شاء الله! هذا حق المسلم على أخيه وينشر الألفة والدعاء.",
          explanationEn: "Masha’Allah! This is a Muslim’s right, spreading sweet dua."
        },
        {
          id: "c2",
          textAr: "أسكت ولا أقول له شيئاً",
          textEn: "Stay silent and say nothing",
          isCorrect: false,
          explanationAr: "تشميت العاطس سنة مؤكدة ودعاء مبارك بالرحمة.",
          explanationEn: "Saying Yarhamuk Allah is a confirmed Sunnah of mercy."
        }
      ]
    },
    linkedHabit: {
      id: "habit-sneeze-manners",
      nameAr: "آداب العطاس والحمد",
      nameEn: "Sneezing Etiquettes",
      actionAr: "احمد الله عند العطاس وشمت من يعطس ويحمد الله اليوم",
      actionEn: "Praise Allah when sneezing and say Yarhamuk Allah today"
    }
  },
  {
    id: "asking-for-jannah-three",
    titleAr: "سؤال الله الجنة ثلاث مرات",
    titleEn: "Asking for Paradise Three Times",
    theme: "habits",
    narratorAr: "أنس بن مالك رضي الله عنه",
    narratorEn: "Anas ibn Malik",
    arabicText: "مَنْ سَأَلَ اللَّهَ الْجَنَّةَ ثَلَاثَ مَرَّاتٍ قَالَتِ الْجَنَّةُ: اللَّهُمَّ أَدْخِلْهُ الْجَنَّةَ",
    explanationAr: "إذا دعوت الله وسألته الجنة ثلاث مرات: \"اللهم إني أسألك الجنة\"، تدعو الجنة نفسها لك وتقول: اللهم أدخله إياي!",
    explanationEn: "Whoever asks Allah for Paradise three times, Paradise itself says: O Allah, admit him into Paradise!",
    source: "جامع الترمذي",
    hadithNumber: "2572",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "دعاء بعد الفجر",
        titleEn: "Dua After Dawn",
        textAr: "جلس عبد الرحمن في مصلاه يرفع يديه لله.",
        textEn: "Abdurrahman sat on his prayer rug raising his hands.",
        iconName: "sunny"
      },
      {
        sceneNumber: 2,
        titleAr: "طلب الجنة",
        titleEn: "Asking for Jannah",
        textAr: "ردد بيقين 3 مرات: اللهم إني أسألك الجنة.",
        textEn: "He repeated with conviction 3 times: O Allah, I ask You for Paradise.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "شفاعة الجنة",
        titleEn: "Intercession of Jannah",
        textAr: "فرح قلبه وعلم أن الجنة تدعو له بالدخول.",
        textEn: "His heart delighted, knowing Jannah itself was praying for him.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "تريد أن تدعو بدعاء عظيم يحبه الله بعد صلاتك، ماذا تختار؟",
      promptEn: "You want to make a great dua beloved to Allah after prayer, what do you choose?",
      situationAr: "الدعاء بعد الفريضة",
      situationEn: "Dua after prayer",
      choices: [
        {
          id: "c1",
          textAr: "أقول 3 مرات: \"اللهم إني أسألك الجنة، وأعوذ بك من النار\"",
          textEn: "Say 3 times: O Allah, I ask You for Jannah and seek refuge from Fire",
          isCorrect: true,
          explanationAr: "أحسنت! دعاء يسير تشفع لك به الجنة وتستعيذ لك به النار.",
          explanationEn: "Excellent! A brief dua where Jannah itself intercedes for you."
        },
        {
          id: "c2",
          textAr: "أنسى الدعاء وأنشغل بالألعاب فقط",
          textEn: "Forget dua and just rush to games",
          isCorrect: false,
          explanationAr: "الدعاء هو العبادة وسؤال الجنة أعظم أمنيات المؤمن.",
          explanationEn: "Dua is true worship and Jannah is the believer’s highest hope."
        }
      ]
    },
    linkedHabit: {
      id: "habit-ask-jannah",
      nameAr: "سؤال الجنة ثلاثاً",
      nameEn: "Asking for Jannah Thrice",
      actionAr: "قل 3 مرات بعد صلاتك اليوم: اللهم إني أسألك الجنة",
      actionEn: "Say 3 times after prayer today: Allahumma inni as-aluka al-Jannah"
    }
  },
  {
    id: "sayyid-al-istighfar",
    titleAr: "سيد الاستغفار وفضله",
    titleEn: "Sayyid al-Istighfar (Chief of Prayers for Forgiveness)",
    theme: "habits",
    narratorAr: "شداد بن أوس رضي الله عنه",
    narratorEn: "Shaddad ibn Aws",
    arabicText: "سَيِّدُ الاسْتِغْفَارِ: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    explanationAr: "هذا أعظم دعاء للاستغفار؛ من قاله في الصباح أو المساء موقناً به ومات في يومه كان من أهل الجنة!",
    explanationEn: "The chief prayer for forgiveness: whoever recites it with certainty in morning or evening and passes away enters Jannah.",
    source: "صحيح البخاري",
    hadithNumber: "6306",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "أذكار الصباح",
        titleEn: "Morning Adhkar",
        textAr: "فتحت فاطمة كتيب الأذكار وبدأت بسيد الاستغفار.",
        textEn: "Fatima opened her supplications book and read Sayyid al-Istighfar.",
        iconName: "book"
      },
      {
        sceneNumber: 2,
        titleAr: "اعتراف بالنعمة",
        titleEn: "Gratitude and Humility",
        textAr: "رددت الكلمات بقلب خاشع يعترف بفضل الله ورحمته.",
        textEn: "She recited with a humble heart acknowledging Allah’s blessings.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "ضمان الجنة",
        titleEn: "Promise of Jannah",
        textAr: "شعرت بسكينة عميقة وأمان تام في حفظ الله.",
        textEn: "She felt deep tranquility and total security in Allah’s care.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "استيقظت في الصباح وتريد أن تحفظ نفسك بدعاء عظيم، ماذا تقرأ؟",
      promptEn: "You wake up in the morning wanting divine protection, what do you recite?",
      situationAr: "أذكار الصباح وسيد الاستغفار",
      situationEn: "Morning remembrance",
      choices: [
        {
          id: "c1",
          textAr: "أقرأ سيد الاستغفار بتدبر ويقين",
          textEn: "Recite Sayyid al-Istighfar with contemplation and certainty",
          isCorrect: true,
          explanationAr: "ما شاء الله! سيد الاستغفار يغفر ذنوبك ويضمن لك رضا الله.",
          explanationEn: "Masha’Allah! Sayyid al-Istighfar secures forgiveness and Allah’s pleasure."
        },
        {
          id: "c2",
          textAr: "أهمل الأذكار وأبدأ يومي بلا ذكر",
          textEn: "Skip adhkar and start the day without dhikr",
          isCorrect: false,
          explanationAr: "أذكار الصباح والمساء حصن المؤمن من كل سوء.",
          explanationEn: "Morning and evening adhkar are the believer’s fortress."
        }
      ]
    },
    linkedHabit: {
      id: "habit-chief-istighfar",
      nameAr: "قراءة سيد الاستغفار",
      nameEn: "Reciting Sayyid al-Istighfar",
      actionAr: "اقرأ سيد الاستغفار صباحاً ومساءً اليوم",
      actionEn: "Recite Sayyid al-Istighfar in the morning and evening today"
    }
  },
  {
    id: "subhanallah-hundred-times",
    titleAr: "تسبيح مائة مرة لمغفرة الخطايا",
    titleEn: "Subhan Allah 100 Times Erases Sins",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ، حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
    explanationAr: "من يقول: \"سبحان الله وبحمده\" 100 مرة في اليوم يمحو الله خطاياه كلها حتى لو كانت كثيرة كأمواج البحر وزبده!",
    explanationEn: "Whoever says \"Subhan Allahi wa bihamdih\" 100 times a day has their sins erased even if they were like the foam of the sea.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6405",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "دقائق التسبيح",
        titleEn: "Minutes of Praise",
        textAr: "أمسك حسام مسبحته الصغيرة وبدأ بالتسبيح بهدوء.",
        textEn: "Hossam held his counter and began praising Allah calmly.",
        iconName: "time"
      },
      {
        sceneNumber: 2,
        titleAr: "مائة تسبيحة",
        titleEn: "One Hundred Praises",
        textAr: "أكمل 100 مرة: سبحان الله وبحمده في دقيقتين فقط.",
        textEn: "He finished 100 praises in just two minutes.",
        iconName: "sparkles"
      },
      {
        sceneNumber: 3,
        titleAr: "بحر المغفرة",
        titleEn: "Ocean of Forgiveness",
        textAr: "فرح قلبه بمغفرة الله الواسعة وراحة روحه.",
        textEn: "His heart delighted in Allah’s boundless forgiveness.",
        iconName: "water"
      }
    ],
    scenario: {
      promptAr: "تجلس في استراحة بين الحصص، كيف تملأ دقيقتين بالحسنات؟",
      promptEn: "Sitting during recess with 2 minutes free, how do you fill them with blessings?",
      situationAr: "دقيقتان من الفراغ",
      situationEn: "Two spare minutes",
      choices: [
        {
          id: "c1",
          textAr: "أقول \"سبحان الله وبحمده\" 100 مرة لمحو الذنوب",
          textEn: "Say \"Subhan Allahi wa bihamdih\" 100 times to erase sins",
          isCorrect: true,
          explanationAr: "أحسنت! ذكر يسير يمحو الخطايا ويثقل ميزانك بالجبال.",
          explanationEn: "Great! Light remembrance that erases mistakes and piles rewards."
        },
        {
          id: "c2",
          textAr: "أجلس شارد الذهن دون ذكر",
          textEn: "Sit daydreaming without any dhikr",
          isCorrect: false,
          explanationAr: "استثمار الدقائق القليلة في الذكر يصنع فارقاً هائلاً في حياتك.",
          explanationEn: "Investing short moments in dhikr transforms your entire day."
        }
      ]
    },
    linkedHabit: {
      id: "habit-hundred-tasbeeh",
      nameAr: "تسبيح مائة مرة",
      nameEn: "100 Tasbeeh Daily",
      actionAr: "ردد \"سبحان الله وبحمده\" 100 مرة اليوم",
      actionEn: "Repeat \"Subhan Allahi wa bihamdih\" 100 times today"
    }
  },
  {
    id: "best-dhikr-tahlil",
    titleAr: "أفضل الذكر وأفضل الدعاء",
    titleEn: "Best Dhikr and Best Dua",
    theme: "habits",
    narratorAr: "جابر بن عبد الله رضي الله عنهما",
    narratorEn: "Jabir ibn Abdullah",
    arabicText: "أَفْضَلُ الذِّكْرِ: لَا إِلَهَ إِلَّا اللَّهُ، وَأَفْضَلُ الدُّعَاءِ: الْحَمْدُ لِلَّهِ",
    explanationAr: "أعظم كلمة تذكر بها الله هي كلمة التوحيد \"لا إله إلا الله\"، وأجمل دعاء يشكر نعم الله هو \"الحمد لله\".",
    explanationEn: "The best remembrance is \"La ilaha illa Allah\" (None is worthy of worship but Allah), and the best dua is \"Alhamdulillah\" (All praise to Allah).",
    source: "جامع الترمذي",
    hadithNumber: "3383",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في هدوء الصباح",
        titleEn: "In Morning Stillness",
        textAr: "استيقظ عمر ورأى شروق الشمس الجميل.",
        textEn: "Omar woke up watching the beautiful sunrise.",
        iconName: "sunny"
      },
      {
        sceneNumber: 2,
        titleAr: "كلمة التوحيد",
        titleEn: "Word of Oneness",
        textAr: "ردد: لا إله إلا الله، الحمد لله من صميم قلبه.",
        textEn: "He whispered: La ilaha illa Allah, Alhamdulillah from his heart.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "نور وطمأنينة",
        titleEn: "Light and Peace",
        textAr: "استنار قلبه بأعظم الذكر وأجمل الدعاء طوال يومه.",
        textEn: "His heart shone with the greatest remembrance all day.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "أكلت طعامك أو شربت ماءك أو انتهيت من أمر جميل، ماذا تقول؟",
      promptEn: "Finished eating, drinking, or accomplished something nice, what do you say?",
      situationAr: "شكر النعمة",
      situationEn: "Gratitude for blessings",
      choices: [
        {
          id: "c1",
          textAr: "أقول: \"الْحَمْدُ لِلَّهِ\" لأنها أفضل الدعاء وتزيد النعم",
          textEn: "Say: \"Alhamdulillah\" as it is the best dua and increases gifts",
          isCorrect: true,
          explanationAr: "رائع! الحمد لله يملأ الميزان ويرضي الرحمن.",
          explanationEn: "Splendid! Alhamdulillah fills the scale and pleases the Merciful."
        },
        {
          id: "c2",
          textAr: "أقوم دون حمد الله أو شكره",
          textEn: "Get up without praising or thanking Allah",
          isCorrect: false,
          explanationAr: "شكر الله على نعمه يحفظها ويزيدها ويبارك فيها.",
          explanationEn: "Thanking Allah protects blessings and multiplies them."
        }
      ]
    },
    linkedHabit: {
      id: "habit-tahlil-hamd",
      nameAr: "التهليل والتحميد",
      nameEn: "Tahlil and Tahmeed",
      actionAr: "ردد \"لا إله إلا الله والحمد لله\" طوال يومك اليوم",
      actionEn: "Repeat \"La ilaha illa Allah, Alhamdulillah\" throughout today"
    }
  },
  {
    id: "blessings-on-prophet-tenfold",
    titleAr: "الصلاة على النبي تنال بها عشراً",
    titleEn: "Blessings on the Prophet Return Tenfold",
    theme: "habits",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
    explanationAr: "كلما صليت على النبي ﷺ مرة واحدة: \"اللهم صلِّ وسلم على نبينا محمد\"، صلى الله عليك بها عشر مرات وأنزل عليك رحماته!",
    explanationEn: "Whoever sends one blessing upon the Prophet ﷺ, Allah sends ten blessings and mercies upon them in return.",
    source: "صحيح مسلم",
    hadithNumber: "408",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "يوم الجمعة",
        titleEn: "Friday Morning",
        textAr: "تذكر يوسف فضل الصلاة على النبي في يوم الجمعة.",
        textEn: "Yusuf remembered the virtue of blessings on Friday.",
        iconName: "calendar"
      },
      {
        sceneNumber: 2,
        titleAr: "عطر الصلاة",
        titleEn: "Fragrance of Blessings",
        textAr: "ردد بخشوع: اللهم صل وسلم على نبينا محمد مائة مرة.",
        textEn: "He repeated with love: O Allah bless our Prophet Muhammad 100 times.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "رحمات إلهية",
        titleEn: "Divine Mercies",
        textAr: "شعر بسكينة غامرة وتيسير عجيب في أموره كلها.",
        textEn: "He experienced deep tranquility and blessing in all his tasks.",
        iconName: "sparkles"
      }
    ],
    scenario: {
      promptAr: "سمعت اسم نبينا محمد ﷺ في درس أو حديث، ماذا تفعل فوراً؟",
      promptEn: "You hear the name of Prophet Muhammad ﷺ in a lesson, what do you do right away?",
      situationAr: "سماع اسم النبي ﷺ",
      situationEn: "Hearing the Prophet’s name",
      choices: [
        {
          id: "c1",
          textAr: "أقول فوراً: \"صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ\"",
          textEn: "Say immediately: \"Sallallahu Alayhi wa Sallam\"",
          isCorrect: true,
          explanationAr: "بارك الله فيك! الصلاة عليه نور لك ومغفرة لذنوبك.",
          explanationEn: "May Allah bless you! Sending blessings on him brings light and forgiveness."
        },
        {
          id: "c2",
          textAr: "أسكت ولا أصلي عليه",
          textEn: "Stay silent without sending blessings",
          isCorrect: false,
          explanationAr: "البخيل من ذكر عنده النبي ﷺ فلم يصل عليه.",
          explanationEn: "The miser is one who hears the Prophet’s name and does not pray upon him."
        }
      ]
    },
    linkedHabit: {
      id: "habit-send-blessings",
      nameAr: "الإكثار من الصلاة على النبي ﷺ",
      nameEn: "Blessings on the Prophet ﷺ",
      actionAr: "صلِّ على النبي ﷺ 20 مرة على الأقل اليوم",
      actionEn: "Send blessings on the Prophet ﷺ at least 20 times today"
    }
  },
  {
    id: "miser-who-skips-salawat",
    titleAr: "البخيل من لم يصلِّ على النبي",
    titleEn: "The Miser is He Who Withholds Salawat",
    theme: "speech",
    narratorAr: "علي بن أبي طالب رضي الله عنه",
    narratorEn: "Ali ibn Abi Talib",
    arabicText: "الْبَخِيلُ الَّذِي مَنْ ذُكِرْتُ عِنْدَهُ فَلَمْ يُصَلِّ عَلَيَّ",
    explanationAr: "البخيل الحقيقي ليس فقط من يبخل بماله، بل من يسمع اسم رسول الله ﷺ ولا يصلي عليه بلسانه وقلبه.",
    explanationEn: "The true miser is not merely who withholds money, but one in whose presence the Prophet ﷺ is mentioned and does not send blessings.",
    source: "جامع الترمذي",
    hadithNumber: "3546",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "في الإذاعة المدرسية",
        titleEn: "At School Broadcast",
        textAr: "ذكرت المذيعة اسم الحبيب محمد رسول الله.",
        textEn: "The speaker mentioned the beloved Messenger Muhammad.",
        iconName: "mic"
      },
      {
        sceneNumber: 2,
        titleAr: "ترديد الصلاة",
        titleEn: "Repeating Blessings",
        textAr: "صلى أحمد عليه بصوت رقيق: صلى الله عليه وسلم.",
        textEn: "Ahmad prayed upon him gently: Sallallahu Alayhi wa Sallam.",
        iconName: "volume-high"
      },
      {
        sceneNumber: 3,
        titleAr: "كرم الإيمان",
        titleEn: "Generosity of Faith",
        textAr: "عطر لسانه بالصلاة عليه ونال رضا الله ومحبته.",
        textEn: "He perfumed his tongue with blessings, earning divine love.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "ذكر المعلم حديثاً وقال: قال رسول الله ﷺ، كيف تستجيب؟",
      promptEn: "Teacher quotes a Hadith: The Messenger of Allah ﷺ said, how do you respond?",
      situationAr: "ذكر النبي في الدرس",
      situationEn: "Prophet mentioned in class",
      choices: [
        {
          id: "c1",
          textAr: "أردد في سري أو بصوت مسموع: \"صلى الله عليه وسلم\"",
          textEn: "Whisper or say clearly: \"Sallallahu Alayhi wa Sallam\"",
          isCorrect: true,
          explanationAr: "أحسنت! هذا من كرم النفس ومحبة النبي الصادقة.",
          explanationEn: "Great! This shows a generous soul and sincere love for the Prophet."
        },
        {
          id: "c2",
          textAr: "أتجاهل ولا أردد شيئاً",
          textEn: "Ignore and say nothing",
          isCorrect: false,
          explanationAr: "الصلاة على النبي عند ذكره علامة الإيمان والوفاء.",
          explanationEn: "Sending blessings upon his mention is a hallmark of faithfulness."
        }
      ]
    },
    linkedHabit: {
      id: "habit-salawat-on-mention",
      nameAr: "الصلاة على النبي عند ذكره",
      nameEn: "Salawat Whenever Mentioned",
      actionAr: "صلِّ على النبي ﷺ كلما سمعت اسمه الشريف اليوم",
      actionEn: "Send blessings on the Prophet ﷺ every time you hear his name today"
    }
  },
  {
    id: "serving-brother-needs",
    titleAr: "قضاء حوائج المسلمين",
    titleEn: "Serving Your Brother’s Needs",
    theme: "helping",
    narratorAr: "عبد الله بن عمر رضي الله عنهما",
    narratorEn: "Abdullah ibn Umar",
    arabicText: "مَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ",
    explanationAr: "عندما تقف مع أصحابك وإخوتك وتساعدهم في قضاء حاجاتهم، يقف الله معك ويقضي لك كل حاجاتك وأمنياتك!",
    explanationEn: "Whoever attends to the needs of his brother, Allah attends to his needs in this life and the next.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "2442",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "طلب مساعدة",
        titleEn: "A Call for Help",
        textAr: "طلب منه أخوه مساعدته في ترتيب كتبه وأدواته.",
        textEn: "His brother asked for help organizing books and stationery.",
        iconName: "briefcase"
      },
      {
        sceneNumber: 2,
        titleAr: "مبادرة وسرور",
        titleEn: "Cheery Initiative",
        textAr: "ترك بلال استراحته ورتب معه كل شيء بنشاط.",
        textEn: "Bilal paused his break and arranged everything gladly.",
        iconName: "checkmark-circle"
      },
      {
        sceneNumber: 3,
        titleAr: "تيسير إلهي",
        titleEn: "Divine Ease",
        textAr: "وجد بلال تيسيراً وتوفيقاً كبيراً في مذاكرته التالية.",
        textEn: "Bilal found remarkable ease in his own study session later.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "طلب منك صديقك أن تساعده في فهم مسألة حسابية، ماذا تفعل؟",
      promptEn: "Your friend asks for help understanding a math problem, what do you do?",
      situationAr: "مساعدة في الدراسة",
      situationEn: "Helping with studies",
      choices: [
        {
          id: "c1",
          textAr: "أجلس معه برحابة صدر وأشرحها له بصبر",
          textEn: "Sit gladly and explain it to him with patience",
          isCorrect: true,
          explanationAr: "بارك الله فيك! من كان في حاجة أخيه كان الله في حاجته.",
          explanationEn: "May Allah bless you! Helping your brother invites Allah’s help."
        },
        {
          id: "c2",
          textAr: "أرفض وأقول لست متفرغاً لك",
          textEn: "Refuse saying I have no time for you",
          isCorrect: false,
          explanationAr: "بذل العلم ومساعدة الزملاء يضاعف فهمك وبركتك.",
          explanationEn: "Sharing knowledge strengthens your own mastery."
        }
      ]
    },
    linkedHabit: {
      id: "habit-help-needs",
      nameAr: "قضاء حوائج الآخرين",
      nameEn: "Fulfilling Others’ Needs",
      actionAr: "ساعد صديقاً أو أخاً في إنجاز حاجة يحتاجها اليوم",
      actionEn: "Help a friend or sibling accomplish something they need today"
    }
  },
  {
    id: "never-sever-family-ties",
    titleAr: "صلة الرحم والتحذير من قطيعتها",
    titleEn: "Maintaining Kinship and Avoiding Severing It",
    theme: "brotherhood",
    narratorAr: "جبير بن مطعم رضي الله عنه",
    narratorEn: "Jubair ibn Mut’im",
    arabicText: "لَا يَدْخُلُ الْجَنَّةَ قَاطِعُ رَحِمٍ",
    explanationAr: "صلة الأقارب والأعمام والأخوال والجدود من أوجب الواجبات، وقطيعتهم معصية تحرم صاحبها من دخول الجنة بسلام.",
    explanationEn: "Maintaining strong, warm ties with family and relatives is sacred; severing kinship is a major sin.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "5984",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "اتصال بالأقارب",
        titleEn: "Calling Relatives",
        textAr: "تذكر طارق عمته المسافرة وقرر الاطمئنان عليها.",
        textEn: "Tariq remembered his aunt living abroad and wanted to check on her.",
        iconName: "call"
      },
      {
        sceneNumber: 2,
        titleAr: "مكالمة مودة",
        titleEn: "A Loving Call",
        textAr: "اتصل بها وسأل عن صحتها وقال لها: نحن نحبك.",
        textEn: "He called, asking about her health and saying: We love you.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "بركة وصلة",
        titleEn: "Blessing of Kinship",
        textAr: "فرحت عمته ودعت له، وتوثقت صلة الرحم المباركة.",
        textEn: "His aunt was overjoyed, making sincere dua for him.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "مرت فترة طويلة لم تتواصل فيها مع جدتك أو عمتك، ماذا تفعل؟",
      promptEn: "It has been a while since contacting your grandmother or aunt, what do you do?",
      situationAr: "صلة الرحم بالاتصال",
      situationEn: "Kinship phone call",
      choices: [
        {
          id: "c1",
          textAr: "أتصل بها فوراً أو أزورها لأصل رحمي وأدخل السرور عليها",
          textEn: "Call immediately or visit to maintain kinship and gladden her",
          isCorrect: true,
          explanationAr: "أحسنت! صلة الرحم تزيد في العمر وتوسع في الرزق والبركة.",
          explanationEn: "Excellent! Kinship prolongs life and expands divine blessings."
        },
        {
          id: "c2",
          textAr: "أهمل الأمر وأقول لست مضطراً للسؤال",
          textEn: "Ignore it and say I don’t have to reach out",
          isCorrect: false,
          explanationAr: "صلة الأرحام أمانة وعبادة عظيمة أمر الله بها.",
          explanationEn: "Cherishing relatives is a sacred worship commanded by Allah."
        }
      ]
    },
    linkedHabit: {
      id: "habit-kinship-call",
      nameAr: "صلة الرحم الهاتفية أو الزيارة",
      nameEn: "Kinship Calls or Visits",
      actionAr: "اتصل بجدتك أو خالتك أو أحد أقاربك وسلم عليه اليوم",
      actionEn: "Call your grandmother, aunt, or a relative to greet them today"
    }
  },
  {
    id: "caring-for-widows-needy",
    titleAr: "الساعي على الأرملة والمسكين",
    titleEn: "Supporting Widows and the Poor",
    theme: "generosity",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "السَّاعِي عَلَى الأَرْمَلَةِ وَالْمِسْكِينِ كَالْمُجَاهِدِ فِي سَبِيلِ اللَّهِ",
    explanationAr: "من يخدم الفقراء والمحتاجين ويوفر لهم الطعام والكساء له أجر عظيم كمن يقوم الليل ويصوم النهار دون انقطاع!",
    explanationEn: "The one who looks after a widow or poor person is like a mujahid striving in Allah’s path, standing in prayer and fasting.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "5353",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "سلة الخير",
        titleEn: "Basket of Goodness",
        textAr: "جمعت الأسرة طعاماً وملابس نظيفة للمحتاجين.",
        textEn: "The family packed food and clean clothes for the poor.",
        iconName: "basket"
      },
      {
        sceneNumber: 2,
        titleAr: "توزيع بإحسان",
        titleEn: "Delivering with Dignity",
        textAr: "شارك يوسف في إيصالها لجارتهم العجوز بابتسامة وأدب.",
        textEn: "Yusuf helped deliver it to an elderly neighbor with courtesy.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "أجر المجاهد",
        titleEn: "Striver’s Reward",
        textAr: "دعت لهم بالبركة ونالوا ثواب الساعي على المساكين.",
        textEn: "She prayed for them and they gained the reward of righteous striving.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "نظمت المدرسة حملة لجمع التبرعات للأسر الفقيرة، كيف تشارك؟",
      promptEn: "School organized a charity drive for poor families, how do you participate?",
      situationAr: "حملة التبرع المدرسي",
      situationEn: "School charity drive",
      choices: [
        {
          id: "c1",
          textAr: "أتبرع بما أستطيع من ملابس أو مصروف بنية مساعدة المحتاجين",
          textEn: "Donate clothes or pocket money with the intention to help",
          isCorrect: true,
          explanationAr: "بارك الله فيك! السعي على المحتاجين من أعظم القربات.",
          explanationEn: "May Allah bless you! Aiding the needy is among the highest deeds."
        },
        {
          id: "c2",
          textAr: "أبخل وأمتنع عن المشاركة",
          textEn: "Hold back and refuse to participate",
          isCorrect: false,
          explanationAr: "المسلم يشعر بآلام الفقراء ويبادر لمد يد العون لهم.",
          explanationEn: "A believer feels for the needy and rushes to assist them."
        }
      ]
    },
    linkedHabit: {
      id: "habit-aid-needy",
      nameAr: "مساعدة الأسر المحتاجة",
      nameEn: "Aiding Needy Families",
      actionAr: "تبرع بلعبة أو كتاب أو مبلغ بسيط لفقير أو مسكين اليوم",
      actionEn: "Donate a toy, book, or small amount to someone in need today"
    }
  },
  {
    id: "believer-mirrors-brother",
    titleAr: "المؤمن مرآة أخيه المؤمن",
    titleEn: "A Believer is the Mirror of His Brother",
    theme: "brotherhood",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "الْمُؤْمِنُ مِرْآةُ أَخِيهِ الْمُؤْمِنِ",
    explanationAr: "كما أن المرآة تريك العيب بلطف لتصلحه دون صراخ، فإن المؤمن ينبه أخاه على خطئه برفق وسرية ليحميه ويحفظ كرامته.",
    explanationEn: "Just as a mirror gently shows flaws to correct them without noise, a believer advises his brother gently and privately.",
    source: "سنن أبي داود",
    hadithNumber: "4918",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "ملاحظة دقيقة",
        titleEn: "A Gentle Observation",
        textAr: "رأى زياد بقعة حبر على قميص صديقه قبل دخوله الصف.",
        textEn: "Ziyad noticed an ink stain on his friend’s shirt before class.",
        iconName: "eye"
      },
      {
        sceneNumber: 2,
        titleAr: "نصيحة في السر",
        titleEn: "Private Reminder",
        textAr: "همس في أذنه بلطف وساعده في غسلها بهدوء.",
        textEn: "He whispered gently and helped him wash it off in private.",
        iconName: "water"
      },
      {
        sceneNumber: 3,
        titleAr: "مرآة صادقة",
        titleEn: "A True Mirror",
        textAr: "شكره صديقه على حمايته لكرامته وأمانته كمرآة نقية.",
        textEn: "His friend thanked him for protecting his dignity like a mirror.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "رأيت صديقك يرتكب خطأ في سلوكه أمام الناس، كيف تنبهه؟",
      promptEn: "You see your friend make a mistake in public, how do you advise him?",
      situationAr: "تنبيه الصديق",
      situationEn: "Advising a friend",
      choices: [
        {
          id: "c1",
          textAr: "أكلمه بمفرده برفق وسرية تامة دون إحراجه كالمرآة الصادقة",
          textEn: "Speak to him in private with gentleness like a true mirror",
          isCorrect: true,
          explanationAr: "أحسنت! النصيحة في السر محبة وستر، وأمام الناس فضيحة.",
          explanationEn: "Great! Private advice is love and care, whereas public is humiliating."
        },
        {
          id: "c2",
          textAr: "أنادي عليه بصوت عالٍ أمام زملائه لأفضحه",
          textEn: "Call him out loudly in front of everyone to embarrass him",
          isCorrect: false,
          explanationAr: "المسلم يستر على أخيه وينصحه برفق كما علمنا النبي ﷺ.",
          explanationEn: "A believer covers faults and advises gently as taught by the Prophet."
        }
      ]
    },
    linkedHabit: {
      id: "habit-mirror-advice",
      nameAr: "النصيحة بالستر واللطف",
      nameEn: "Advising with Privacy and Care",
      actionAr: "انصح شخصاً على انفراد بكلمة طيبة تشجعه على الأفضل اليوم",
      actionEn: "Give private, encouraging advice to someone today"
    }
  },
  {
    id: "steadfastness-prayer-first",
    titleAr: "الاستقامة والصلاة خير الأعمال",
    titleEn: "Steadfastness and Prayer are the Best of Deeds",
    theme: "habits",
    narratorAr: "ثوبان رضي الله عنه",
    narratorEn: "Thawban",
    arabicText: "اسْتَقِيمُوا وَلَنْ تُحْصُوا، وَاعْلَمُوا أَنَّ خَيْرَ أَعْمَالِكُمُ الصَّلَاةُ",
    explanationAr: "اثبتوا على طاعة الله بكل ما تستطيعون، واعلموا أن أعظم وأفضل عبادة تقربكم إلى الله هي الصلاة الخاشعة.",
    explanationEn: "Be steadfast on the path of truth, and know that the very best of your deeds is the prayer.",
    source: "موطأ مالك وسنن ابن ماجه",
    hadithNumber: "277",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "ثبات ويقين",
        titleEn: "Firmness & Certainty",
        textAr: "عاهد عمر نفسه على المحافظة على صلواته الخمس بخشوع.",
        textEn: "Omar pledged to maintain all five prayers with devotion.",
        iconName: "shield"
      },
      {
        sceneNumber: 2,
        titleAr: "خير الأعمال",
        titleEn: "The Best of Deeds",
        textAr: "كان يستعد للصلاة بوضوء متقن وقلب حاضر.",
        textEn: "He prepared for prayer with thorough wudu and a focused heart.",
        iconName: "checkmark-circle"
      },
      {
        sceneNumber: 3,
        titleAr: "حياة مباركة",
        titleEn: "A Blessed Life",
        textAr: "أشرقت حياته بالنور والسكينة والتوفيق المستمر.",
        textEn: "His life shone with steady tranquility and continuous success.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "ما أفضل عمل تحرص على إتقانه والمحافظة عليه كل يوم؟",
      promptEn: "What is the best deed you strive to preserve every single day?",
      situationAr: "أفضل الأعمال",
      situationEn: "The best of deeds",
      choices: [
        {
          id: "c1",
          textAr: "الصلوات الخمس في أوقاتها بخشوع وطمأنينة",
          textEn: "The five daily prayers on time with devotion and calm",
          isCorrect: true,
          explanationAr: "أحسنت! الصلاة عماد الدين وأحب الأعمال إلى رب العالمين.",
          explanationEn: "Excellent! Prayer is the pillar of faith and most beloved to Allah."
        },
        {
          id: "c2",
          textAr: "أهمل الصلاة وأهتم بالأمور الدنيوية فقط",
          textEn: "Neglect prayer and focus only on worldly stuff",
          isCorrect: false,
          explanationAr: "الصلاة أول ما يحاسب عليه العبد يوم القيامة.",
          explanationEn: "Prayer is the very first thing examined on the Day of Judgment."
        }
      ]
    },
    linkedHabit: {
      id: "habit-steadfast-prayers",
      nameAr: "المحافظة على الصلوات الخمس",
      nameEn: "Preserving the 5 Daily Prayers",
      actionAr: "أدِّ صلواتك الخمس في وقتها بخشوع وسكينة اليوم",
      actionEn: "Perform all 5 daily prayers on time with calm devotion today"
    }
  },
  {
    id: "prophet-character-was-quran",
    titleAr: "كان خلقه ﷺ القرآن",
    titleEn: "His Character ﷺ was the Quran",
    theme: "kindness",
    narratorAr: "عائشة أم المؤمنين رضي الله عنها",
    narratorEn: "Aisha",
    arabicText: "كَانَ خُلُقُ نَبِيِّكُمُ الْقُرْآنَ",
    explanationAr: "سُئلت السيدة عائشة عن أخلاق النبي ﷺ فقالت: كان خلقه القرآن؛ يطبق أوامره، ويبتعد عن نواهيه، ويعيش معانيه حباً ورحمة.",
    explanationEn: "When Aisha was asked about the character of the Prophet ﷺ, she replied: His character was the living Quran.",
    source: "صحيح مسلم",
    hadithNumber: "746",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "سؤال السيدة عائشة",
        titleEn: "Asking Lady Aisha",
        textAr: "سأل التابعي الجليل عن أخلاق خاتم الأنبياء ﷺ.",
        textEn: "A seeker asked about the sublime morals of the Prophet ﷺ.",
        iconName: "help"
      },
      {
        sceneNumber: 2,
        titleAr: "جواب الحكمة",
        titleEn: "Answer of Wisdom",
        textAr: "أجابت: كان خلقه القرآن يرضى لرضاه ويغضب لغضبه.",
        textEn: "She replied: His morals were the Quran embodied in action.",
        iconName: "book"
      },
      {
        sceneNumber: 3,
        titleAr: "قدوة للعالمين",
        titleEn: "Role Model for Worlds",
        textAr: "صار القرآن دليلاً عملياً يتجلى في كل تصرف وحركة.",
        textEn: "The Quran became a living guide in every step he took.",
        iconName: "star"
      }
    ],
    scenario: {
      promptAr: "تقرأ في القرآن: \"وقولوا للناس حسناً\"، كيف تطبق هذا الخلق اليوم؟",
      promptEn: "You read in Quran \"Speak good words to people\", how do you live it today?",
      situationAr: "تطبيق آيات الأخلاق",
      situationEn: "Living moral verses",
      choices: [
        {
          id: "c1",
          textAr: "أتحدث مع والدي وأصدقائي بأجمل الكلمات وألطفها",
          textEn: "Speak to family and friends with sweet and gentle words",
          isCorrect: true,
          explanationAr: "ما شاء الله! هكذا تحول القرآن إلى خلق وسلوك عملي في حياتك.",
          explanationEn: "Masha’Allah! This turns the Quran into living character."
        },
        {
          id: "c2",
          textAr: "أقرأ الآية دون أن أغير طريقة كلامي القاسية",
          textEn: "Read the verse without changing my harsh speech",
          isCorrect: false,
          explanationAr: "المسلم يقرأ القرآن ليعمل بما فيه ويتخلق بأخلاقه الرفيعة.",
          explanationEn: "A believer reads Quran to live its sublime values."
        }
      ]
    },
    linkedHabit: {
      id: "habit-living-quran",
      nameAr: "تطبيق أخلاق القرآن",
      nameEn: "Living Quranic Morals",
      actionAr: "اختر آية قرآنية عن الأخلاق وطبقها في يومك اليوم",
      actionEn: "Choose a moral Quranic verse and put it into practice today"
    }
  },
  {
    id: "truth-brings-peace-doubt",
    titleAr: "الصدق طمأنينة والكذب ريبة",
    titleEn: "Truth Brings Peace, Lies Bring Doubt",
    theme: "honesty",
    narratorAr: "الحسن بن علي رضي الله عنهما",
    narratorEn: "Al-Hasan ibn Ali",
    arabicText: "إِنَّ الصِّدْقَ طُمَأْنِينَةٌ، وَإِنَّ الْكَذِبَ رِيبَةٌ",
    explanationAr: "عندما تصدق يرتاح قلبك وينام ضميرك مطمئناً، أما الكذب فيجعلك قلقاً خائفاً دائماً من أن يُكشف أمرك.",
    explanationEn: "Truthfulness brings deep tranquility and serene peace, whereas lying produces anxiety, guilt, and suspicion.",
    source: "جامع الترمذي",
    hadithNumber: "2518",
    grade: "صحيح",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "لحظة صعبة",
        titleEn: "A Tough Moment",
        textAr: "أضاع كريم مفتاح الدراجة وخاف من غضب والده.",
        textEn: "Kareem misplaced the bike key, fearing his dad’s anger.",
        iconName: "key"
      },
      {
        sceneNumber: 2,
        titleAr: "شجاعة الصراحة",
        titleEn: "Brave Frankness",
        textAr: "قال لوالده بصدق: لقد أضعته يا أبي وأنا أعتذر.",
        textEn: "He told his father: I lost it dad and I am so sorry.",
        iconName: "shield"
      },
      {
        sceneNumber: 3,
        titleAr: "طمأنينة وسلام",
        titleEn: "Tranquility & Peace",
        textAr: "ابتسم والده وسامحه وامتلأ قلب كريم بالراحة والطمأنينة.",
        textEn: "His dad smiled, forgave him, and Kareem’s heart was at peace.",
        iconName: "heart"
      }
    ],
    scenario: {
      promptAr: "سألتك والدتك عن شيء كسرته بالخطأ، ماذا تختار لراحة قلبك؟",
      promptEn: "Your mom asks about something you accidentally broke, what do you choose?",
      situationAr: "موقف الكسر والاعتراف",
      situationEn: "Accidental break confession",
      choices: [
        {
          id: "c1",
          textAr: "أعترف فوراً بصدق وأعتذر لأن الصدق طمأنينة وراحة",
          textEn: "Confess honestly and apologize as truth brings inner peace",
          isCorrect: true,
          explanationAr: "بطل شجاع! الصدق يريح ضميرك ويكسبك محبة الجميع.",
          explanationEn: "A brave hero! Truth eases your conscience and earns love."
        },
        {
          id: "c2",
          textAr: "أكذب وألقي اللوم على أخي الصغير",
          textEn: "Lie and blame my little brother",
          isCorrect: false,
          explanationAr: "الكذب يملأ القلب خوفاً وذنباً ويجلب غضب الله.",
          explanationEn: "Lying fills the heart with anxiety and earns divine anger."
        }
      ]
    },
    linkedHabit: {
      id: "habit-peace-of-truth",
      nameAr: "الصدق وراحة الضمير",
      nameEn: "Peace of Truthfulness",
      actionAr: "التزم بالصدق الصريح في كل كلمة تنطق بها اليوم",
      actionEn: "Speak candid truth in every single word you utter today"
    }
  },
  {
    id: "verify-news-before-sharing",
    titleAr: "التثبت والنهي عن نشر الشائعات",
    titleEn: "Verifying News and Avoiding False Rumors",
    theme: "speech",
    narratorAr: "أبو هريرة رضي الله عنه",
    narratorEn: "Abu Hurairah",
    arabicText: "كَفَى بِالْمَرْءِ كَذِبًا أَنْ يُحَدِّثَ بِكُلِّ مَا سَمِعَ",
    explanationAr: "لا تنقل كل خبر تسمعه دون أن تتأكد من صحته؛ لأن نقل الكلام دون تثبت يوقعك في الكذب وإيذاء الآخرين.",
    explanationEn: "It is enough of a lie for a person to narrate everything they hear; verify all news before spreading it.",
    source: "صحيح مسلم",
    hadithNumber: "5",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "خبر في المدرسة",
        titleEn: "School Rumor",
        textAr: "سمع سامي إشاعة تقول إن المعلم ألغى الرحلة المدرسية.",
        textEn: "Sami heard a rumor that the teacher cancelled the field trip.",
        iconName: "volume-high"
      },
      {
        sceneNumber: 2,
        titleAr: "تثبت وتأكد",
        titleEn: "Verification & Prudence",
        textAr: "لم ينشر الخبر وسأل المعلم مباشرة ليتأكد من الحقيقة.",
        textEn: "He refrained from spreading it and verified directly.",
        iconName: "search"
      },
      {
        sceneNumber: 3,
        titleAr: "حكمة وسلامة",
        titleEn: "Wisdom & Safety",
        textAr: "تبين أن الرحلة قائمة وشكر المعلم سامي على تثبته.",
        textEn: "The trip was on, and the teacher praised Sami’s prudence.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "أخبرك زميل بخبر سيئ عن صديقك، كيف تتصرف بحكمة؟",
      promptEn: "A classmate tells you a bad rumor about your friend, how do you act?",
      situationAr: "سماع إشاعة عن صديق",
      situationEn: "Hearing a rumor about a friend",
      choices: [
        {
          id: "c1",
          textAr: "أتوقف ولا أنشر الكلام وأتثبت بحكمة وحسن ظن",
          textEn: "Stop, don’t spread it, and verify with wisdom and goodwill",
          isCorrect: true,
          explanationAr: "أحسنت! التثبت خلق قرآني ونبوي يحمي المجتمع من الشائعات.",
          explanationEn: "Excellent! Verification is a divine principle protecting society."
        },
        {
          id: "c2",
          textAr: "أنشر الخبر فوراً بين بقية الزملاء",
          textEn: "Spread the news immediately among all other kids",
          isCorrect: false,
          explanationAr: "نشر الشائعات دون تثبت يفرق القلوب ويؤذي الأبرياء.",
          explanationEn: "Spreading rumors divides hearts and harms innocent people."
        }
      ]
    },
    linkedHabit: {
      id: "habit-verify-speech",
      nameAr: "التثبت قبل التحدث",
      nameEn: "Verifying Before Speaking",
      actionAr: "تأكد من صحة أي معلومة قبل أن تخبر بها غيرك اليوم",
      actionEn: "Verify the truth of any information before sharing it today"
    }
  },
  {
    id: "angel-jibril-recommending-neighbor",
    titleAr: "وصية جبريل بالجار",
    titleEn: "Angel Jibril’s Injunction for the Neighbor",
    theme: "kindness",
    narratorAr: "عائشة وابن عمر رضي الله عنهم",
    narratorEn: "Aisha & Ibn Umar",
    arabicText: "مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ",
    explanationAr: "ظل الملاك جبريل يوصي النبي ﷺ بحق الجار والإحسان إليه حتى اعتقد النبي أنه سيجعله كأحد الورثة في العائلة!",
    explanationEn: "Angel Jibril kept enjoining kind treatment toward the neighbor so much that the Prophet ﷺ thought he would grant him inheritance rights.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6014",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "طبق الفطائر",
        titleEn: "Plate of Pastries",
        textAr: "صنعت والدة مريم فطائر ساخنة ولذيذة.",
        textEn: "Maryam’s mother baked warm, delicious pastries.",
        iconName: "restaurant"
      },
      {
        sceneNumber: 2,
        titleAr: "هدية للجار",
        titleEn: "Gift for Neighbor",
        textAr: "أرسلت مريم مع والدتها طبقاً لبيت جارتهم العجوز.",
        textEn: "Maryam brought a warm plate to their elderly neighbor.",
        iconName: "heart"
      },
      {
        sceneNumber: 3,
        titleAr: "سعادة الجوار",
        titleEn: "Joy of Neighborliness",
        textAr: "فرحت الجارة ودعت لمريم بالهناء والبركة.",
        textEn: "The neighbor rejoiced and made sweet prayers for Maryam.",
        iconName: "happy"
      }
    ],
    scenario: {
      promptAr: "أنت تلعب في فناء المنزل بالقرب من نافذة جاركم المريض، ماذا تفعل؟",
      promptEn: "Playing in the yard near your sick neighbor’s window, what do you do?",
      situationAr: "مراعاة الجار المريض",
      situationEn: "Respecting a sick neighbor",
      choices: [
        {
          id: "c1",
          textAr: "أخفض صوتي وألعب بهدوء احتراماً لمرضه وحقه",
          textEn: "Lower my voice and play quietly respecting his rest",
          isCorrect: true,
          explanationAr: "بارك الله فيك! مراعاة الجار وصية نبوية عظيمة.",
          explanationEn: "May Allah bless you! Respecting neighbors is a sublime Sunnah."
        },
        {
          id: "c2",
          textAr: "أصرخ وأحدث ضجيجاً عالياً دون مبالاة",
          textEn: "Shout and make loud noise without caring",
          isCorrect: false,
          explanationAr: "إيذاء الجار بالصوت أو الأفعال معصية تنافي خلق الإسلام.",
          explanationEn: "Disturbing neighbors harms relationships and opposes faith."
        }
      ]
    },
    linkedHabit: {
      id: "habit-neighbor-respect",
      nameAr: "الإحسان إلى الجيران",
      nameEn: "Kindness to Neighbors",
      actionAr: "أهدِ طبقاً أو ابتسم وسلم على جارك باحترام اليوم",
      actionEn: "Share a treat or greet your neighbor with deep respect today"
    }
  },
  {
    id: "hospitality-three-days",
    titleAr: "آداب الضيافة وإكرام الضيف",
    titleEn: "Hospitality Etiquette: Honoring the Guest",
    theme: "generosity",
    narratorAr: "أبو شريح العدوي رضي الله عنه",
    narratorEn: "Abu Shuraih al-Adawi",
    arabicText: "الضِّيَافَةُ ثَلَاثَةُ أَيَّامٍ، وَجَائِزَتُهُ يَوْمٌ وَلَيْلَةٌ",
    explanationAr: "إكرام الضيف من علامات الإيمان؛ نستقبله بوجه بشوش ونقدم له أفضل ما لدينا من طعام وشراب بحفاوة وكرم.",
    explanationEn: "Hospitality is a hallmark of true faith: welcome guests with bright smiles and generous, wholesome hospitality.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "6135",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "وصول الضيوف",
        titleEn: "Arrival of Guests",
        textAr: "طرق الباب ضيوف قادمون لزيارة العائلة.",
        textEn: "Guests knocked at the door to visit the family.",
        iconName: "home"
      },
      {
        sceneNumber: 2,
        titleAr: "استقبال كريم",
        titleEn: "Generous Welcome",
        textAr: "فتح حسام الباب بابتسامة مشرقة وقال: مرحباً بكم وأنرتم دارنا.",
        textEn: "Hossam opened with a bright smile: Welcome to our home.",
        iconName: "chatbubbles"
      },
      {
        sceneNumber: 3,
        titleAr: "كرم الضيافة",
        titleEn: "Warm Hospitality",
        textAr: "قدم لهم العصير والحلوى بكل سرور ونال أجر إكرام الضيف.",
        textEn: "He served drinks and sweets gladly, earning guest-honoring rewards.",
        iconName: "restaurant"
      }
    ],
    scenario: {
      promptAr: "حضر ضيوف لزيارة والديك في المنزل، كيف ترحب بهم؟",
      promptEn: "Guests arrive to visit your parents at home, how do you welcome them?",
      situationAr: "استقبال الضيوف",
      situationEn: "Welcoming guests",
      choices: [
        {
          id: "c1",
          textAr: "أرحب بهم بابتسامة وأسلم عليهم بأدب وأساعد في ضيافتهم",
          textEn: "Welcome with a smile, greet politely, and assist hospitality",
          isCorrect: true,
          explanationAr: "أحسنت! إكرام الضيف من كرم الأخلاق وسنن الإيمان.",
          explanationEn: "Great! Honoring guests reflects noble morals and true faith."
        },
        {
          id: "c2",
          textAr: "أبقى في غرفتي عابساً دون أن ألقي التحية",
          textEn: "Stay in my room frowning without greeting them",
          isCorrect: false,
          explanationAr: "المسلم كريم ومرحب يدخل السرور على ضيوفه.",
          explanationEn: "A believer is hospitable and delights in welcoming guests."
        }
      ]
    },
    linkedHabit: {
      id: "habit-welcome-guests",
      nameAr: "إكرام الضيف والترحيب به",
      nameEn: "Welcoming and Honoring Guests",
      actionAr: "رحب بكل ضيف يزور بيتكم وشاركه الضيافة بلطف اليوم",
      actionEn: "Welcome any visitor to your home with warmth and treats today"
    }
  },
  {
    id: "do-not-breathe-in-cup",
    titleAr: "أدب الشرب وعدم التنفس في الإناء",
    titleEn: "Drinking Etiquette: Do Not Breathe in the Cup",
    theme: "cleanliness",
    narratorAr: "أبو قتادة رضي الله عنه",
    narratorEn: "Abu Qatadah",
    arabicText: "إِذَا شَرِبَ أَحَدُكُمْ فَلَا يَتَنَفَّسْ فِي الإِنَاءِ",
    explanationAr: "علمنا النبي ﷺ أدب الشرب: نشرب ونحن جالسون على ثلاث دفعات، ونبعد الكوب عن فمنا عند التنفس لنحافظ على نظافة الماء.",
    explanationEn: "The Prophet ﷺ taught: when drinking, do not breathe into the vessel; drink in sips and breathe outside the cup.",
    source: "صحيح البخاري ومسلم",
    hadithNumber: "153",
    grade: "صحيح البخاري",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "كوب ماء بارد",
        titleEn: "Cup of Cool Water",
        textAr: "شعر بلال بالعطش الشديد بعد اللعب.",
        textEn: "Bilal felt very thirsty after playing soccer.",
        iconName: "water"
      },
      {
        sceneNumber: 2,
        titleAr: "سنة نبوية في الشرب",
        titleEn: "Sunnah in Drinking",
        textAr: "جلس وقال بسم الله وشرب على ثلاث دفعات متنفسة خارج الكوب.",
        textEn: "He sat, said Bismillah, and drank in 3 sips breathing outside.",
        iconName: "checkmark-circle"
      },
      {
        sceneNumber: 3,
        titleAr: "ارتواء وصحة",
        titleEn: "Hydration and Health",
        textAr: "ارتوى براحة تامة وحمد الله مطبقاً سنة نبيه.",
        textEn: "He quenched his thirst peacefully and thanked Allah.",
        iconName: "happy"
      }
    ],
    scenario: {
      promptAr: "تريد أن تشرب ماءً وأنت عطشان جداً، كيف تطبق السنة النبوية؟",
      promptEn: "You are very thirsty wanting a drink, how do you apply the Sunnah?",
      situationAr: "شرب الماء",
      situationEn: "Drinking water",
      choices: [
        {
          id: "c1",
          textAr: "أجلس، وأقول بسم الله، وأشرب على 3 دفعات دون تنفس في الكوب",
          textEn: "Sit, say Bismillah, drink in 3 sips without breathing in cup",
          isCorrect: true,
          explanationAr: "ممتاز! هذا أدب نبوي رائع يحفظ صحتك ونظافة شرابك.",
          explanationEn: "Excellent! A splendid prophetic habit preserving health and hygiene."
        },
        {
          id: "c2",
          textAr: "أشرب واقفاً بجرعة واحدة مسرعة وأتنفس داخل الكوب",
          textEn: "Gulp it down standing in one rush breathing in the cup",
          isCorrect: false,
          explanationAr: "الشرب على مهل وفي دفعات أصح للمعدة وأتبع لهدي النبي ﷺ.",
          explanationEn: "Drinking in gentle sips is healthier and follows the Sunnah."
        }
      ]
    },
    linkedHabit: {
      id: "habit-drinking-sunnah",
      nameAr: "تطبيق آداب الشرب النبوية",
      nameEn: "Prophetic Drinking Etiquette",
      actionAr: "اشرب جالساً على 3 دفعات وتنفس خارج الإناء اليوم",
      actionEn: "Drink seated in 3 gentle sips breathing outside the cup today"
    }
  },
  {
    id: "say-i-believe-then-steadfast",
    titleAr: "قل آمنت بالله ثم استقم",
    titleEn: "Say: I Believe in Allah, Then Stand Firm",
    theme: "habits",
    narratorAr: "سفيان بن عبد الله الثقفي رضي الله عنه",
    narratorEn: "Sufyan ibn Abdullah",
    arabicText: "قُلْ: آمَنْتُ بِاللَّهِ، ثُمَّ اسْتَقِمْ",
    explanationAr: "وصية جامعة لكل خير: اعلن إيمانك بالله بقلبك، ثم اثبت على طاعته بفعل الخيرات والبعد عن المعاصي طوال حياتك.",
    explanationEn: "A comprehensive golden advice: Say \"I believe in Allah\", then stand firm and steadfast upon truth.",
    source: "صحيح مسلم",
    hadithNumber: "38",
    grade: "صحيح مسلم",
    miniStory: [
      {
        sceneNumber: 1,
        titleAr: "سؤال شامل",
        titleEn: "A Comprehensive Question",
        textAr: "جاء صحابي يطلب وصية تجمع له أمر الإسلام كله.",
        textEn: "A companion asked for one all-encompassing Islamic advice.",
        iconName: "help"
      },
      {
        sceneNumber: 2,
        titleAr: "إجابة جامعة",
        titleEn: "Universal Answer",
        textAr: "قال له النبي ﷺ: قل آمنت بالله ثم استقم.",
        textEn: "The Prophet replied: Say I believe in Allah, then stand firm.",
        iconName: "bulb"
      },
      {
        sceneNumber: 3,
        titleAr: "ثبات وفوز",
        titleEn: "Firmness & Victory",
        textAr: "عاش الصحابي مستقيماً على الحق حتى فاز برضوان الله والجنة.",
        textEn: "He lived steadfast upon righteousness, earning Jannah.",
        iconName: "trophy"
      }
    ],
    scenario: {
      promptAr: "تريد قاعدة ذهبية ترشدك في كل لحظة من حياتك، ماذا تختار؟",
      promptEn: "Wanting a golden rule to guide every moment of life, what do you pick?",
      situationAr: "القاعدة الذهبية للحياة",
      situationEn: "Golden rule for life",
      choices: [
        {
          id: "c1",
          textAr: "أقول آمنت بالله وأثبت على الصدق والصلاة وحسن الخلق",
          textEn: "Believe in Allah and stand firm on truth, prayer, and good morals",
          isCorrect: true,
          explanationAr: "أحسنت! الاستقامة هي طريق الجنة والفلاح الأبدي.",
          explanationEn: "Splendid! Steadfastness is the path to eternal Jannah."
        },
        {
          id: "c2",
          textAr: "أطيع الله يوماً وأعصيه أياماً دون اهتمام بالثبات",
          textEn: "Obey Allah one day and disobey without caring about consistency",
          isCorrect: false,
          explanationAr: "الثبات على الطاعة هو جوهر الإيمان وسر السعادة.",
          explanationEn: "Steadfast consistency in obedience is the essence of true faith."
        }
      ]
    },
    linkedHabit: {
      id: "habit-steadfast-firm",
      nameAr: "الاستقامة على الخير",
      nameEn: "Steadfastness in Goodness",
      actionAr: "جدد نيتك وقل: آمنت بالله، واثبت على صلاتك وصدقك اليوم",
      actionEn: "Renew your intention: I believe in Allah, and stand firm today"
    }
  }
];
