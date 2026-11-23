// src/features/tajweed/data/tajweedLessonsData.ts
// Authentic, Kid-Friendly Tajweed Lessons with Audio Examples
// Features Sheikh Mahmoud Khalil Al-Husary (Teacher Edition) recordings from EveryAyah

export interface TajweedAudioExample {
  id: string;
  surahNameAr: string;
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
  targetWord: string;
  highlightRule: string;
  audioUrl: string;
  audioNoteAr: string;
}

export interface TajweedQuizQuestion {
  id: string;
  questionAr: string;
  hintAr?: string;
  audioUrl?: string;
  sampleText?: string;
  options: {
    id: string;
    labelAr: string;
    isCorrect: boolean;
    explanationAr: string;
  }[];
}

export interface TajweedLesson {
  id: string;
  sectionId: 'nun_tanween' | 'meem_ghunnah' | 'madd' | 'qalqalah' | 'makharij';
  titleAr: string;
  titleEn: string;
  badgeColor: string;
  badgeBgColor: string;
  emoji: string;
  shortSummaryAr: string;
  detailedRuleAr: string;
  kidAnalogyAr: string;
  letters: string[];
  rulesCountDescAr: string;
  examples: TajweedAudioExample[];
  voicePracticeAvailable?: boolean;
  voicePracticeType?: 'madd' | 'ghunnah' | 'recitation';
  quiz: TajweedQuizQuestion[];
}

export interface TajweedSection {
  id: 'nun_tanween' | 'meem_ghunnah' | 'madd' | 'qalqalah' | 'makharij';
  titleAr: string;
  titleEn: string;
  emoji: string;
  color: string;
  bgColor: string;
  descriptionAr: string;
  lessons: TajweedLesson[];
}

export const TAJWEED_SECTIONS: TajweedSection[] = [
  // ─────────────────────────────────────────────────────────
  // 1. أحكام النون الساكنة والتنوين
  // ─────────────────────────────────────────────────────────
  {
    id: 'nun_tanween',
    titleAr: 'أحكام النون والتنوين',
    titleEn: 'Nun Sakinah & Tanween',
    emoji: '🌿',
    color: '#059669',
    bgColor: '#ECFDF5',
    descriptionAr: 'للنون الساكنة والتنوين ٤ أحكام رائعة: الإظهار، الإدغام، الإقلاب، والإخفاء!',
    lessons: [
      {
        id: 'izhar_halqi',
        sectionId: 'nun_tanween',
        titleAr: 'الإظهار الحلقي',
        titleEn: 'Al-Izhar Al-Halqi (Clear Pronunciation)',
        badgeColor: '#059669',
        badgeBgColor: '#D1FAE5',
        emoji: '☀️',
        shortSummaryAr: 'ننطق النون الساكنة أو التنوين واضحة ونقية كضوء الشمس دون غنة زائدة.',
        detailedRuleAr: 'إذا جاء بعد النون الساكنة أو التنوين أحد حروف الحلق الستة (ء، هـ، ع، ح، غ، خ)، ننطق النون صافية واضحة.',
        kidAnalogyAr: 'مثل النجوم الساطعة في ليلة صافية ✨ — تظهر النون بنقاء ووضوح تام!',
        letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
        rulesCountDescAr: '٦ حروف حلقية مجموعة في أوائل: (أخي هاك علماً حازه غير خاسر)',
        examples: [
          {
            id: 'ex_izhar_1',
            surahNameAr: 'الفاتحة',
            surahNumber: 1,
            ayahNumber: 7,
            ayahText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
            targetWord: 'أَنْعَمْتَ',
            highlightRule: 'نون ساكنة بعدها عين (حرف حلقي) -> إظهار',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/001007.mp3',
            audioNoteAr: 'استمع كيف يلفظ الشيخ النون في (أَنْعَمْتَ) واضحة وصريحة دون غنة طويلة.',
          },
          {
            id: 'ex_izhar_2',
            surahNameAr: 'البقرة',
            surahNumber: 2,
            ayahNumber: 10,
            ayahText: 'فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ',
            targetWord: 'عَذَابٌ أَلِيمٌ',
            highlightRule: 'تنوين ضمة بعده همزة -> إظهار',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/002010.mp3',
            audioNoteAr: 'انتبه لتنوين (عَذَابٌ) ينطق واضحاً عند ملاقاة همزة (أَلِيمٌ).',
          },
          {
            id: 'ex_izhar_3',
            surahNameAr: 'قريش',
            surahNumber: 106,
            ayahNumber: 4,
            ayahText: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ',
            targetWord: 'مِّنْ خَوْفٍ',
            highlightRule: 'نون ساكنة بعدها خاء (حرف حلقي) -> إظهار',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/106004.mp3',
            audioNoteAr: 'استمع إلى وضوح النون في (مِّنْ خَوْفٍ) دون مد أو إخفاء.',
          },
        ],
        quiz: [
          {
            id: 'quiz_izhar_1',
            questionAr: 'ما هو حكم النون في قوله تعالى: (أَنْعَمْتَ)؟',
            sampleText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
            options: [
              { id: '1', labelAr: 'إظهار حلقي (لأن بعدها حرف العين) ☀️', isCorrect: true, explanationAr: 'أحسنت! العين من حروف الحلق الستة، فحكمها الإظهار الحلقي.' },
              { id: '2', labelAr: 'إدغام بغنة', isCorrect: false, explanationAr: 'العين ليست من حروف الإدغام (يرملون).' },
              { id: '3', labelAr: 'إخفاء حقيقي', isCorrect: false, explanationAr: 'العين حرف حلقي مظهر دائماً مع النون الساكنة.' },
            ],
          },
        ],
      },
      {
        id: 'idgham_ghunnah',
        sectionId: 'nun_tanween',
        titleAr: 'الإدغام بغُنّة (يَنْمُو)',
        titleEn: 'Idgham with Ghunnah (Merging with Nasalization)',
        badgeColor: '#16A34A',
        badgeBgColor: '#DCFCE7',
        emoji: '🤝',
        shortSummaryAr: 'ندمج النون الساكنة في الحرف التالي ونغنّ معها حركتين كصوت قطرات المطر.',
        detailedRuleAr: 'إذا جاء بعد النون الساكنة أو التنوين أحد حروف (ي، ن، م، و)، تدغم النون فيه مع غنة مقدارها حركتان.',
        kidAnalogyAr: 'صديقان يعانقان بعضهما بقوة 🤝 ويغنيان لحناً جميلاً من الأنف!',
        letters: ['ي', 'ن', 'م', 'و'],
        rulesCountDescAr: '٤ حروف مجموعة في كلمة (يَنْمُو)',
        voicePracticeAvailable: true,
        voicePracticeType: 'ghunnah',
        examples: [
          {
            id: 'ex_idgham_1',
            surahNameAr: 'المسد',
            surahNumber: 111,
            ayahNumber: 1,
            ayahText: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
            targetWord: 'لَهَبٍ وَتَبَّ',
            highlightRule: 'تنوين كسر بعده واو -> إدغام بغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/111001.mp3',
            audioNoteAr: 'استمع لاندماج تنوين (لَهَبٍ) في الواو مع رنة أنفية جميلة: (لَهَبِوّْتَبَّ).',
          },
          {
            id: 'ex_idgham_2',
            surahNameAr: 'المسد',
            surahNumber: 111,
            ayahNumber: 5,
            ayahText: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ',
            targetWord: 'حَبْلٌ مِّن مَّسَدٍ',
            highlightRule: 'تنوين ضم بعده ميم، ونون بعدها ميم -> إدغامان بغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/111005.mp3',
            audioNoteAr: 'استمع كيف يندمج التنوين والنون في الميم بكل انسيابية وغنة.',
          },
          {
            id: 'ex_idgham_3',
            surahNameAr: 'البقرة',
            surahNumber: 2,
            ayahNumber: 8,
            ayahText: 'وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ',
            targetWord: 'مَن يَقُولُ',
            highlightRule: 'نون ساكنة بعدها ياء -> إدغام بغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/002008.mp3',
            audioNoteAr: 'انتبه لنطق (مَيَّقُول) حيث اختفت النون ودخلت في الياء بغنة رنانة.',
          },
        ],
        quiz: [
          {
            id: 'quiz_idgham_1',
            questionAr: 'ما هي حروف الإدغام بغنة؟',
            options: [
              { id: '1', labelAr: 'مجموعة في كلمة (يَنْمُو) 🌟', isCorrect: true, explanationAr: 'رائع وبطل! حروف الإدغام بغنة هي الياء والنون والميم والواو.' },
              { id: '2', labelAr: 'الراء واللام', isCorrect: false, explanationAr: 'الراء واللام إدغام بغير غنة.' },
              { id: '3', labelAr: 'قطب جد', isCorrect: false, explanationAr: 'قطب جد هي حروف القلقلة.' },
            ],
          },
        ],
      },
      {
        id: 'idgham_bighunnah',
        sectionId: 'nun_tanween',
        titleAr: 'الإدغام بغير غُنّة (الراء واللام)',
        titleEn: 'Idgham without Ghunnah (Complete Merging)',
        badgeColor: '#0284C7',
        badgeBgColor: '#E0F2FE',
        emoji: '⚡',
        shortSummaryAr: 'ندمج النون الساكنة بالكامل في الراء أو اللام بسرعة كضوء البرق دون غنة.',
        detailedRuleAr: 'إذا جاء بعد النون الساكنة أو التنوين حرف (ر) أو (ل)، تدغم النون بالكامل فلا يظهر منها أي صوت ولا غنة.',
        kidAnalogyAr: 'القطار فائق السرعة 🚄 يمر مباشرة دون توقف عند محطة الغنة!',
        letters: ['ر', 'ل'],
        rulesCountDescAr: 'حرفان فقط: الراء واللام (ر، ل)',
        examples: [
          {
            id: 'ex_idgham_no_1',
            surahNameAr: 'الإخلاص',
            surahNumber: 112,
            ayahNumber: 4,
            ayahText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
            targetWord: 'يَكُن لَّهُ',
            highlightRule: 'نون ساكنة بعدها لام -> إدغام كامل بغير غنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/112004.mp3',
            audioNoteAr: 'استمع كيف تنطق: (يَكُلَّه) — تحولت النون مباشرة إلى لام مشددة دون غنة.',
          },
          {
            id: 'ex_idgham_no_2',
            surahNameAr: 'البقرة',
            surahNumber: 2,
            ayahNumber: 5,
            ayahText: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ',
            targetWord: 'مِّن رَّبِّهِمْ',
            highlightRule: 'نون ساكنة بعدها راء -> إدغام كامل بغير غنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/002005.mp3',
            audioNoteAr: 'استمع لنطق (مِرَّبِّهِم) حيث دخلت النون في الراء بسرعة ونقاء.',
          },
        ],
        quiz: [
          {
            id: 'quiz_idgham_no_1',
            questionAr: 'كيف ننطق (وَلَمْ يَكُن لَّهُ) في سورة الإخلاص؟',
            options: [
              { id: '1', labelAr: 'ندمج النون في اللام لتصبح (يَكُلَّه) دون غنة ⚡', isCorrect: true, explanationAr: 'إجابة ممتازة! اللام حرف إدغام بغير غنة.' },
              { id: '2', labelAr: 'نظهر النون واضحة', isCorrect: false, explanationAr: 'الإظهار يكون مع حروف الحلق فقط.' },
              { id: '3', labelAr: 'نغنّ النون لمدة حركتين', isCorrect: false, explanationAr: 'لا غنة مع الراء واللام.' },
            ],
          },
        ],
      },
      {
        id: 'iqlab',
        sectionId: 'nun_tanween',
        titleAr: 'الإقلاب (حرف الباء)',
        titleEn: 'Al-Iqlab (Conversion to Meem)',
        badgeColor: '#D97706',
        badgeBgColor: '#FEF3C7',
        emoji: '🎩',
        shortSummaryAr: 'نقلب النون الساكنة أو التنوين إلى ميم لطيفة مع غنة عندما تقابل حرف الباء.',
        detailedRuleAr: 'إذا جاء بعد النون الساكنة أو التنوين حرف (ب)، تُقلب النون ميماً مخفاة مع بقاء الغنة حركتين، وتوضع ميم صغيرة (مـ) فوق الحرف في المصحف.',
        kidAnalogyAr: 'القبعة السحرية 🎩 — النون ترتدي قبعة ميم صغيرة وتتحول إلى نغمة جميلة!',
        letters: ['ب'],
        rulesCountDescAr: 'حرف واحد فقط: الباء (ب)',
        voicePracticeAvailable: true,
        voicePracticeType: 'ghunnah',
        examples: [
          {
            id: 'ex_iqlab_1',
            surahNameAr: 'البقرة',
            surahNumber: 2,
            ayahNumber: 27,
            ayahText: 'الَّذِينَ يَنقُضُونَ عَهْدَ اللَّهِ مِن بَعْدِ مِيثَاقِهِ',
            targetWord: 'مِن بَعْدِ',
            highlightRule: 'نون ساكنة بعدها باء -> تقلب ميماً مخفاة بغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/002027.mp3',
            audioNoteAr: 'استمع كيف تنطق: (مِم بَعْدِ) مع غنة رنانة حركتين وانطباق لطيف للشفتين.',
          },
          {
            id: 'ex_iqlab_2',
            surahNameAr: 'الهمزة',
            surahNumber: 104,
            ayahNumber: 4,
            ayahText: 'كَلَّا ۖ لَيُنبَذَنَّ فِي الْحُطَمَةِ',
            targetWord: 'لَيُنبَذَنَّ',
            highlightRule: 'نون ساكنة بعدها باء في كلمة واحدة -> إقلاب',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/104004.mp3',
            audioNoteAr: 'انتبه للميم الصغيرة فوق النون في (لَيُنۢبَذَنَّ) واستمع للنطق الرائع من الشيخ.',
          },
        ],
        quiz: [
          {
            id: 'quiz_iqlab_1',
            questionAr: 'ما هي علامة الإقلاب في رسم المصحف الشريف؟',
            options: [
              { id: '1', labelAr: 'ميم صغيرة (مـ) فوق النون أو التنوين 🎩', isCorrect: true, explanationAr: 'أنت عبقري! الميم الصغيرة تدلنا دائماً على حكم الإقلاب عند حرف الباء.' },
              { id: '2', labelAr: 'دائرة حمراء', isCorrect: false, explanationAr: 'المصحف يستخدم الميم الصغيرة القائمة للدلالة على الإقلاب.' },
              { id: '3', labelAr: 'سكون دائري', isCorrect: false, explanationAr: 'السكون يعني الإظهار.' },
            ],
          },
        ],
      },
      {
        id: 'ikhfa_haqiqi',
        sectionId: 'nun_tanween',
        titleAr: 'الإخفاء الحقيقي (١٥ حرفاً)',
        titleEn: 'Al-Ikhfa Al-Haqiqi (Concealment)',
        badgeColor: '#9333EA',
        badgeBgColor: '#F3E8FF',
        emoji: '🫧',
        shortSummaryAr: 'تختبئ النون بلطف بين الإظهار والإدغام مع غنة أنفية ساحرة حركتين.',
        detailedRuleAr: 'إذا جاء بعد النون الساكنة أو التنوين أحد الحروف الـ ١٥ المتبقية، ننطق صوتاً رقيقاً بين الإظهار والإدغام مصحوباً بغنة.',
        kidAnalogyAr: 'لعبة الاستغماية 🫧 — النون تختبئ وراء الباب وتترك صوت رنين جميل!',
        letters: ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'],
        rulesCountDescAr: '١٥ حرفاً مجموعة في أوائل كلمات بيت الشعر: (صف ذا ثنا كم جاد شخص قد سما...)',
        voicePracticeAvailable: true,
        voicePracticeType: 'ghunnah',
        examples: [
          {
            id: 'ex_ikhfa_1',
            surahNameAr: 'الفلق',
            surahNumber: 113,
            ayahNumber: 2,
            ayahText: 'مِن شَرِّ مَا خَلَقَ',
            targetWord: 'مِن شَرِّ',
            highlightRule: 'نون ساكنة بعدها شين -> إخفاء حقيقي بغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/113002.mp3',
            audioNoteAr: 'استمع كيف تختفي النون في الشين بغنة رقيقة وناعمة.',
          },
          {
            id: 'ex_ikhfa_2',
            surahNameAr: 'العصر',
            surahNumber: 103,
            ayahNumber: 2,
            ayahText: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
            targetWord: 'الْإِنسَانَ',
            highlightRule: 'نون ساكنة بعدها سين في كلمة واحدة -> إخفاء حقيقي',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/103002.mp3',
            audioNoteAr: 'انتبه لإخفاء النون عند السين في كلمة (الْإِنسَانَ).',
          },
          {
            id: 'ex_ikhfa_3',
            surahNameAr: 'النبأ',
            surahNumber: 78,
            ayahNumber: 40,
            ayahText: 'إِنَّا أَنذَرْنَاكُمْ عَذَابًا قَرِيبًا',
            targetWord: 'عَذَابًا قَرِيبًا',
            highlightRule: 'تنوين فتح بعده قاف -> إخفاء مفخم مع الغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/078040.mp3',
            audioNoteAr: 'استمع للغنة المفخمة لأن القاف حرف قوي مفخم.',
          },
        ],
        quiz: [
          {
            id: 'quiz_ikhfa_1',
            questionAr: 'ما هو حكم قوله تعالى: (مِن شَرِّ مَا خَلَقَ) في سورة الفلق؟',
            options: [
              { id: '1', labelAr: 'إخفاء حقيقي مع الغنة حركتين 🫧', isCorrect: true, explanationAr: 'ما شاء الله عليك! الشين من حروف الإخفاء الحقيقي.' },
              { id: '2', labelAr: 'إظهار حلقي', isCorrect: false, explanationAr: 'الشين يخرج من وسط اللسان وليس من الحلق.' },
              { id: '3', labelAr: 'قلقلة', isCorrect: false, explanationAr: 'الشين ليس من حروف قطب جد.' },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. أحكام الميم الساكنة والغنة
  // ─────────────────────────────────────────────────────────
  {
    id: 'meem_ghunnah',
    titleAr: 'أحكام الميم والغُنّة',
    titleEn: 'Meem Sakinah & Ghunnah',
    emoji: '🍯',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    descriptionAr: 'أحكام الميم الشفوية الثلاثة (إخفاء، إدغام، إظهار) وصوت الغنة الرنان.',
    lessons: [
      {
        id: 'ghunnah_mushaddadah',
        sectionId: 'meem_ghunnah',
        titleAr: 'الغُنّة المشددة (النون والميم)',
        titleEn: 'The Perfect Ghunnah (N & M with Shaddah)',
        badgeColor: '#16A34A',
        badgeBgColor: '#DCFCE7',
        emoji: '🐝',
        shortSummaryAr: 'صوت جميل وعذب يخرج من الخيشوم (الأنف) لمدة حركتين كاملتين كطنين النحلة.',
        detailedRuleAr: 'النون المشددة (نّ) والميم المشددة (مّ) يجب غنهما بمقدار حركتين في الوصل والوقف.',
        kidAnalogyAr: 'طنين النحلة الذهبية 🐝 تصنع العسل بصوت رنان ومحبوب!',
        letters: ['نّ', 'مّ'],
        rulesCountDescAr: 'حرفان مشددان: النون والميم',
        voicePracticeAvailable: true,
        voicePracticeType: 'ghunnah',
        examples: [
          {
            id: 'ex_ghunnah_1',
            surahNameAr: 'الناس',
            surahNumber: 114,
            ayahNumber: 1,
            ayahText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
            targetWord: 'النَّاسِ',
            highlightRule: 'نون مشددة -> غنة حركتان كاملتان',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/114001.mp3',
            audioNoteAr: 'استمع للشيخ كيف يثبت على النون المشددة في (النَّاسِ) بحركتين هادئتين.',
          },
          {
            id: 'ex_ghunnah_2',
            surahNameAr: 'النبأ',
            surahNumber: 78,
            ayahNumber: 1,
            ayahText: 'عَمَّ يَتَسَاءَلُونَ',
            targetWord: 'عَمَّ',
            highlightRule: 'ميم مشددة -> غنة حركتان كاملتان',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/078001.mp3',
            audioNoteAr: 'استمع لطنين الميم المشددة الجميل في مطلع سورة النبأ.',
          },
          {
            id: 'ex_ghunnah_3',
            surahNameAr: 'الناس',
            surahNumber: 114,
            ayahNumber: 6,
            ayahText: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
            targetWord: 'الْجِنَّةِ وَالنَّاسِ',
            highlightRule: 'نونان مشددتان متتاليتان',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/114006.mp3',
            audioNoteAr: 'غنتان متتابعتان تملآن التلاوة خشوعاً وجمالاً.',
          },
        ],
        quiz: [
          {
            id: 'quiz_ghunnah_1',
            questionAr: 'كم حركة نغنّ النون والميم المشددتين؟',
            options: [
              { id: '1', labelAr: 'حركتان كاملتان (مثل بسط الإصبع وقبضه) 🐝', isCorrect: true, explanationAr: 'بطل التجويد! الغنة المشددة مقدارها حركتان.' },
              { id: '2', labelAr: '٦ حركات', isCorrect: false, explanationAr: '٦ حركات هي للمد اللازم.' },
              { id: '3', labelAr: 'لا نغنهما أبداً', isCorrect: false, explanationAr: 'الغنة صفة لازمة لا تفارق النون والميم المشددتين.' },
            ],
          },
        ],
      },
      {
        id: 'meem_shafawi',
        sectionId: 'meem_ghunnah',
        titleAr: 'أحكام الميم الساكنة الشفوية',
        titleEn: 'Oral Meem Rules (Shafawi)',
        badgeColor: '#0891B2',
        badgeBgColor: '#CFFAFE',
        emoji: '👄',
        shortSummaryAr: 'الميم الساكنة لها ٣ أحكام تنطلق من الشفتين: إخفاء، إدغام، وإظهار شفوي.',
        detailedRuleAr: 'الميم الساكنة: إذا جاء بعدها (ب) تخفى بغنة، وإذا جاء بعدها (م) تدغم بغنة، ومع بقية الـ ٢٦ حرفاً تُظهر إظهاراً شفوياً تاماً.',
        kidAnalogyAr: 'بوابة الشفتين 👄 — تفتح وتغلق بلطف ونعومة فائقة!',
        letters: ['ب', 'م', 'بقية الحروف'],
        rulesCountDescAr: '٣ أحكام: إخفاء شفوي (ب)، إدغام شفوي (م)، إظهار شفوي (٢٦ حرفاً)',
        examples: [
          {
            id: 'ex_meem_1',
            surahNameAr: 'الفيل',
            surahNumber: 105,
            ayahNumber: 4,
            ayahText: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
            targetWord: 'تَرْمِيهِم بِحِجَارَةٍ',
            highlightRule: 'ميم ساكنة بعدها باء -> إخفاء شفوي بغنة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/105004.mp3',
            audioNoteAr: 'انتبه لتلامس الشفتين برفق في (تَرْمِيهِم بِـ) دون كز أو ضغط زائد.',
          },
          {
            id: 'ex_meem_2',
            surahNameAr: 'الفيل',
            surahNumber: 105,
            ayahNumber: 1,
            ayahText: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
            targetWord: 'أَلَمْ تَرَ',
            highlightRule: 'ميم ساكنة بعدها تاء -> إظهار شفوي صريح',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/105001.mp3',
            audioNoteAr: 'استمع لوضوح الميم في (أَلَمْ تَرَ) دون أي تردد أو غنة.',
          },
        ],
        quiz: [
          {
            id: 'quiz_meem_1',
            questionAr: 'ما هو حكم قوله تعالى: (تَرْمِيهِم بِحِجَارَةٍ)؟',
            options: [
              { id: '1', labelAr: 'إخفاء شفوي (لأن بعد الميم الساكنة حرف الباء) 👄', isCorrect: true, explanationAr: 'إجابة صحيحة ١٠٠٪! الميم الساكنة تخفى عند حرف الباء.' },
              { id: '2', labelAr: 'إظهار حلقي', isCorrect: false, explanationAr: 'الميم تخرج من الشفتين وليس من الحلق.' },
              { id: '3', labelAr: 'مد متصل', isCorrect: false, explanationAr: 'هذا حكم خاص بالميم الساكنة.' },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. أحكام المدود
  // ─────────────────────────────────────────────────────────
  {
    id: 'madd',
    titleAr: 'أحكام المدود (عالم الأصوات الطويلة)',
    titleEn: 'Rules of Madd (Elongations)',
    emoji: '🚀',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    descriptionAr: 'رحلة ممتعة مع المد الطبيعي والمدود الفرعية: المتصل، المنفصل، اللازم، والعارض!',
    lessons: [
      {
        id: 'madd_tabiee',
        sectionId: 'madd',
        titleAr: 'المد الطبيعي (الأصلي)',
        titleEn: 'Natural Madd (2 Counts)',
        badgeColor: '#DC2626',
        badgeBgColor: '#FEE2E2',
        emoji: '🌱',
        shortSummaryAr: 'نمد الصوت بهدوء حركتين فقط (كقولنا: قَال، يَقُول، قِيل) دون زيادة ولا نقصان.',
        detailedRuleAr: 'حروف المد الثلاثة (الألف الساكنة المفتوح ما قبلها، الواو الساكنة المضموم ما قبلها، الياء الساكنة المكسور ما قبلها) تُمد حركتين إذا لم يأت بعدها همز أو سكون.',
        kidAnalogyAr: 'الخطوة الطبيعية المريحة 🚶‍♂️ خطوتان متوازنتان بلا تعجل!',
        letters: ['ا', 'و', 'ي'],
        rulesCountDescAr: 'مقدار مده حركتان فقط دائماً',
        voicePracticeAvailable: true,
        voicePracticeType: 'madd',
        examples: [
          {
            id: 'ex_madd_tab_1',
            surahNameAr: 'هود',
            surahNumber: 11,
            ayahNumber: 49,
            ayahText: 'تِلْكَ مِنْ أَنبَاءِ الْغَيْبِ نُوحِيهَا إِلَيْكَ',
            targetWord: 'نُوحِيهَا',
            highlightRule: 'اجتمعت حروف المد الثلاثة: الواو والياء والألف وكلها حركتان',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/011049.mp3',
            audioNoteAr: 'كلمة (نُوحِيهَا) تجمع كل حروف المد الثلاثة، استمع لجمال وزنها حركتين لكل حرف.',
          },
        ],
        quiz: [
          {
            id: 'quiz_madd_tab_1',
            questionAr: 'ما هي حروف المد الثلاثة؟',
            options: [
              { id: '1', labelAr: 'الألف والواو والياء الساكنة (واي) 🌱', isCorrect: true, explanationAr: 'ممتاز! مجموعة في كلمة (واي).' },
              { id: '2', labelAr: 'النون والميم واللام', isCorrect: false, explanationAr: 'ليست حروف مد.' },
              { id: '3', labelAr: 'حروف قطب جد', isCorrect: false, explanationAr: 'قطب جد هي حروف القلقلة.' },
            ],
          },
        ],
      },
      {
        id: 'madd_muttasil_munfasil',
        sectionId: 'madd',
        titleAr: 'المد المتصل والمنفصل',
        titleEn: 'Connected & Separated Madd (4-5 Counts)',
        badgeColor: '#E11D48',
        badgeBgColor: '#FFE4E6',
        emoji: '☁️',
        shortSummaryAr: 'عندما تلتقي الهمزة مع حرف المد في كلمة واحدة أو كلمتين، نمد صوتنا ٤ أو ٥ حركات.',
        detailedRuleAr: 'المد المتصل: الهمزة وحرف المد في كلمة واحدة مثل (جَاءَ) ومده واجب ٤-٥ حركات. المد المنفصل: حرف المد في آخر الكلمة والهمزة في أول الكلمة التالية مثل (إِنَّا أَعْطَيْنَاكَ) ومده ٤-٥ حركات.',
        kidAnalogyAr: 'أجنحة الطائر المحلق 🦅 يفتح جناحيه ويطير عالياً لـ ٤ أو ٥ عدات!',
        letters: ['ا + ء', 'و + ء', 'ي + ء'],
        rulesCountDescAr: 'يمد ٤ أو ٥ حركات (متصل واجب / منفصل جائز)',
        voicePracticeAvailable: true,
        voicePracticeType: 'madd',
        examples: [
          {
            id: 'ex_muttasil_1',
            surahNameAr: 'النصر',
            surahNumber: 110,
            ayahNumber: 1,
            ayahText: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
            targetWord: 'جَاءَ',
            highlightRule: 'مد متصل واجب (الألف والهمزة في كلمة واحدة) -> ٤-٥ حركات',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/110001.mp3',
            audioNoteAr: 'استمع كيف يمد الشيخ كلمة (جَاءَ) بهيبة وخشوع ٤ إلى ٥ حركات.',
          },
          {
            id: 'ex_munfasil_1',
            surahNameAr: 'الكوثر',
            surahNumber: 108,
            ayahNumber: 1,
            ayahText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
            targetWord: 'إِنَّا أَعْطَيْنَاكَ',
            highlightRule: 'مد منفصل جائز (الألف في كلمة والهمزة في كلمة ثانية) -> ٤-٥ حركات',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/108001.mp3',
            audioNoteAr: 'استمع لامتداد الصوت بين (إِنَّا) و(أَعْطَيْنَاكَ).',
          },
        ],
        quiz: [
          {
            id: 'quiz_muttasil_1',
            questionAr: 'ما الفرق بين المد المتصل والمد المنفصل؟',
            options: [
              { id: '1', labelAr: 'المتصل في كلمة واحدة، والمنفصل في كلمتين 🦅', isCorrect: true, explanationAr: 'رائع جداً! المتصل يتصل بالهمزة في نفس الكلمة والمنفصل ينفصل في كلمتين.' },
              { id: '2', labelAr: 'المتصل حركتان والمنفصل ٦ حركات', isCorrect: false, explanationAr: 'كلاهما يمد ٤ إلى ٥ حركات في رواية حفص عن عاصم.' },
            ],
          },
        ],
      },
      {
        id: 'madd_lazim',
        sectionId: 'madd',
        titleAr: 'المد اللازم (٦ حركات كاملة)',
        titleEn: 'Obligatory Madd (6 Full Counts)',
        badgeColor: '#B91C1C',
        badgeBgColor: '#FEE2E2',
        emoji: '🚀',
        shortSummaryAr: 'أطول مد في القرآن الكريم! نمد صوتنا ٦ حركات كاملة كصاروخ ينطلق إلى الفضاء.',
        detailedRuleAr: 'إذا جاء بعد حرف المد حرف مشدد أو ساكن سكوناً أصلياً، يلزم مده ٦ حركات وجوباً عند جميع القراء، مثل: (وَلَا الضَّالِّينَ).',
        kidAnalogyAr: 'انطلاق الصاروخ العملاق 🚀 يرتفع في السماء لـ ٦ ثوانٍ كاملة من الطاقة والجمال!',
        letters: ['مد + شدة', 'مد + سكون أصلي'],
        rulesCountDescAr: '٦ حركات وجوباً لا تنقص أبداً',
        voicePracticeAvailable: true,
        voicePracticeType: 'madd',
        examples: [
          {
            id: 'ex_lazim_1',
            surahNameAr: 'الفاتحة',
            surahNumber: 1,
            ayahNumber: 7,
            ayahText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
            targetWord: 'الضَّالِّينَ',
            highlightRule: 'مد لازم مثقل كلمي (حرف المد بعده لام مشددة) -> ٦ حركات كاملة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/001007.mp3',
            audioNoteAr: 'استمع لنهاية سورة الفاتحة كيف يمد الشيخ ألف (الضَّالِّينَ) ٦ حركات كاملة.',
          },
        ],
        quiz: [
          {
            id: 'quiz_lazim_1',
            questionAr: 'كم حركة نمد حرف المد في (وَلَا الضَّالِّينَ)؟',
            options: [
              { id: '1', labelAr: '٦ حركات كاملة وجوباً 🚀', isCorrect: true, explanationAr: 'أنت بطل القرآن! المد اللازم يمد ٦ حركات دائماً.' },
              { id: '2', labelAr: 'حركتان فقط', isCorrect: false, explanationAr: 'حركتان للمد الطبيعي وليس اللازم.' },
              { id: '3', labelAr: '٣ حركات', isCorrect: false, explanationAr: 'لا يوجد مد بمقدار ٣ حركات في التجويد.' },
            ],
          },
        ],
      },
      {
        id: 'madd_arid',
        sectionId: 'madd',
        titleAr: 'المد العارض للسكون',
        titleEn: 'Incidental Madd (Arid)',
        badgeColor: '#EA580C',
        badgeBgColor: '#FFEDD5',
        emoji: '🛑',
        shortSummaryAr: 'عندما نقف على آخر الكلمة ويسبق الحرف الأخير حرف مد، يجوز مدّه ٢ أو ٤ أو ٦ حركات.',
        detailedRuleAr: 'هو أن يأتي بعد حرف المد سكون عارض بسبب الوقف، مثل الوقف على: (الْعَالَمِينَ)، (الرَّحِيمِ)، (الدِّينِ).',
        kidAnalogyAr: 'إشارة التوقف الهادئة 🛑 تقف السيارة بنعومة وجمال عند نهاية الآية!',
        letters: ['نهاية الآية الموقوف عليها'],
        rulesCountDescAr: 'يجوز فيه: القصر (٢)، أو التوسط (٤)، أو الطول (٦)',
        voicePracticeAvailable: true,
        voicePracticeType: 'madd',
        examples: [
          {
            id: 'ex_arid_1',
            surahNameAr: 'الفاتحة',
            surahNumber: 1,
            ayahNumber: 2,
            ayahText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            targetWord: 'الْعَالَمِينَ',
            highlightRule: 'مد عارض للسكون عند الوقف على النون',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/001002.mp3',
            audioNoteAr: 'استمع لنهاية (الْعَالَمِينَ) كيف يقف الشيخ بهدوء وتوسط ٤ حركات.',
          },
        ],
        quiz: [
          {
            id: 'quiz_arid_1',
            questionAr: 'متى يحدث المد العارض للسكون؟',
            options: [
              { id: '1', labelAr: 'عند الوقف على آخر الكلمة إذا سبق حرفها الأخير حرف مد 🛑', isCorrect: true, explanationAr: 'أحسنت! السكون يعرض فقط بسبب الوقف.' },
              { id: '2', labelAr: 'في وسط الكلمة فقط', isCorrect: false, explanationAr: 'العارض يكون عند الوقف فقط.' },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. أحكام القلقلة
  // ─────────────────────────────────────────────────────────
  {
    id: 'qalqalah',
    titleAr: 'أحكام القلقلة (القفزة القوية)',
    titleEn: 'Rules of Qalqalah (The Echo Bounce)',
    emoji: '🏀',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    descriptionAr: 'حروف قطب جد الخمسة: تقفز وترتد بقوة ونغمة محبوبة عندما تسكن!',
    lessons: [
      {
        id: 'qalqalah_letters',
        sectionId: 'qalqalah',
        titleAr: 'حروف القلقلة (قُطْبُ جَدّ)',
        titleEn: 'The 5 Qalqalah Letters',
        badgeColor: '#2563EB',
        badgeBgColor: '#DBEAFE',
        emoji: '🏀',
        shortSummaryAr: 'خمسة حروف بطلة: (ق، ط، ب، ج، د) تقفز في النطق ككرة الترامبولين عندما تكون ساكنة!',
        detailedRuleAr: 'القلقلة هي اضطراب في المخرج عند النطق بالحرف الساكن حتى يُسمع له نبرة قوية. حروفها خمسة مجموعة في: (قُطْبُ جَدّ).',
        kidAnalogyAr: 'كرة السلة أو الترامبولين 🏀 ترتطم بالأرض ثم تقفز عالياً بقوة وحيوية!',
        letters: ['ق', 'ط', 'ب', 'ج', 'د'],
        rulesCountDescAr: '٥ حروف قوية مجموعة في: (قُطْبُ جَدّ)',
        examples: [
          {
            id: 'ex_qalq_1',
            surahNameAr: 'الإخلاص',
            surahNumber: 112,
            ayahNumber: 1,
            ayahText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
            targetWord: 'أَحَدٌ',
            highlightRule: 'الدال ساكنة عند الوقف -> قلقلة كبرى قوية',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/112001.mp3',
            audioNoteAr: 'استمع للنبرة القوية الجميلة عند الوقف على حرف الدال في (أَحَدْ).',
          },
          {
            id: 'ex_qalq_2',
            surahNameAr: 'الإخلاص',
            surahNumber: 112,
            ayahNumber: 3,
            ayahText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
            targetWord: 'يَلِدْ وَلَمْ يُولَدْ',
            highlightRule: 'دالان ساكنتان: صغرى في (يَلِدْ) وكبرى في (يُولَدْ)',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/112003.mp3',
            audioNoteAr: 'استمع للقفزة الخفيفة في (يَلِدْ) والقفزة الأقوى عند نهاية الآية في (يُولَدْ).',
          },
          {
            id: 'ex_qalq_3',
            surahNameAr: 'التين',
            surahNumber: 95,
            ayahNumber: 4,
            ayahText: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ',
            targetWord: 'خَلَقْنَا',
            highlightRule: 'قاف ساكنة في وسط الكلمة -> قلقلة صغرى',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/095004.mp3',
            audioNoteAr: 'انتبه لارتداد القاف في (خَلَقْـنَا) دون أن تخلطها بحركة.',
          },
        ],
        quiz: [
          {
            id: 'quiz_qalq_1',
            questionAr: 'ما هي الكلمات التي تجمع حروف القلقلة الخمسة؟',
            options: [
              { id: '1', labelAr: '(قُطْبُ جَدّ) 🏀', isCorrect: true, explanationAr: 'بطل أبطال التجويد! القاف والطاء والباء والجيم والدال.' },
              { id: '2', labelAr: '(يَرْمَلُون)', isCorrect: false, explanationAr: 'يرملون حروف الإدغام.' },
              { id: '3', labelAr: '(سَأَلْتُمُونِيهَا)', isCorrect: false, explanationAr: 'هذه حروف الزيادة في الصرف.' },
            ],
          },
        ],
      },
      {
        id: 'qalqalah_levels',
        sectionId: 'qalqalah',
        titleAr: 'مراتب القلقلة (صغرى وكبرى)',
        titleEn: 'Levels of Qalqalah (Minor & Major)',
        badgeColor: '#1D4ED8',
        badgeBgColor: '#DBEAFE',
        emoji: '🎯',
        shortSummaryAr: 'صغرى: إذا كان الحرف في وسط الكلمة. كبرى: إذا وقفنا عليه في نهاية الكلمة أو كان مشدداً.',
        detailedRuleAr: 'القلقلة الصغرى تكون في وسط الكلام مثل (يَقْطَعُونَ)، والقلقلة الكبرى تكون عند الوقف على آخر الكلمة مثل (الْفَلَقْ)، وأعلاها عند الوقف على المشدد مثل (وَتَبَّ).',
        kidAnalogyAr: 'القفزة الصغيرة والقفزة الذهبية الكبرى 🎯 كلاهما ممتع ورائع!',
        letters: ['ق', 'ط', 'ب', 'ج', 'د'],
        rulesCountDescAr: 'مرتبتان: صغرى (وسط الكلمة) وكبرى (عند الوقف)',
        examples: [
          {
            id: 'ex_levels_1',
            surahNameAr: 'الفلق',
            surahNumber: 113,
            ayahNumber: 1,
            ayahText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
            targetWord: 'الْفَلَقِ',
            highlightRule: 'قاف في آخر الآية موقوف عليها -> قلقلة كبرى واضحة',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/113001.mp3',
            audioNoteAr: 'استمع لقوة القلقلة الكبرى في (الْفَلَقْ).',
          },
          {
            id: 'ex_levels_2',
            surahNameAr: 'المسد',
            surahNumber: 111,
            ayahNumber: 1,
            ayahText: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
            targetWord: 'وَتَبَّ',
            highlightRule: 'باء مشددة موقوف عليها -> أعلى مراتب القلقلة (أكبر)',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/111001.mp3',
            audioNoteAr: 'استمع للنبرة القوية المحكمة في الوقف على الباء المشددة في (وَتَبَّ).',
          },
        ],
        quiz: [
          {
            id: 'quiz_levels_1',
            questionAr: 'أين تكون القلقلة الكبرى؟',
            options: [
              { id: '1', labelAr: 'عند الوقف على حرف القلقلة في نهاية الكلمة 🎯', isCorrect: true, explanationAr: 'أحسنت! الوقف على الحرف الساكن يعطيه قلقلة كبرى قوية.' },
              { id: '2', labelAr: 'في أول الكلمة فقط', isCorrect: false, explanationAr: 'حروف القلقلة لا تبدأ ساكنة في أول الكلمة.' },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. مخارج الحروف والصفات
  // ─────────────────────────────────────────────────────────
  {
    id: 'makharij',
    titleAr: 'مخارج الحروف وصفاتها',
    titleEn: 'Makharij & Letter Characteristics',
    emoji: '🎙️',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    descriptionAr: 'تعرف على البيوت الخمسة التي تخرج منها أصوات الحروف العربية في جسم الإنسان!',
    lessons: [
      {
        id: 'five_makharij',
        sectionId: 'makharij',
        titleAr: 'المخارج الرئيسية الخمسة',
        titleEn: 'The 5 Major Points of Articulation',
        badgeColor: '#7C3AED',
        badgeBgColor: '#EDE9FE',
        emoji: '🏰',
        shortSummaryAr: 'الجوف، الحلق، اللسان، الشفتان، والخيشوم — خمسة قصور جميلة تصنع أعذب الكلمات.',
        detailedRuleAr: 'المخارج العامة خمسة: ١. الجوف (حروف المد الثلاثة). ٢. الحلق (٦ حروف حلقية). ٣. اللسان (١٨ حرفاً وهو أكثر المخارج). ٤. الشفتان (٤ حروف: ف، و، ب، م). ٥. الخيشوم (مخرج صوت الغنة).',
        kidAnalogyAr: 'المدينة الموسيقية المذهلة 🏰 لكل عائلة من الحروف قصرها الخاص بها!',
        letters: ['الجوف', 'الحلق', 'اللسان', 'الشفتان', 'الخيشوم'],
        rulesCountDescAr: '٥ مخارج عامة رئيسية يتفرع منها ١٧ مخرجاً خاصاً',
        examples: [
          {
            id: 'ex_makh_1',
            surahNameAr: 'الفاتحة',
            surahNumber: 1,
            ayahNumber: 1,
            ayahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            targetWord: 'بِسْمِ',
            highlightRule: 'الباء والميم من الشفتين، والسين من طرف اللسان',
            audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/001001.mp3',
            audioNoteAr: 'استمع كيف تنطلق البسملة المباركة بمخارج واضحة ومتقنة تبدأ من الشفتين.',
          },
        ],
        quiz: [
          {
            id: 'quiz_makh_1',
            questionAr: 'من أين يخرج صوت الغنة الجميل؟',
            options: [
              { id: '1', labelAr: 'من الخيشوم (أعلى الأنف) 👃', isCorrect: true, explanationAr: 'إجابة عبقرية! الخيشوم هو المخرج المخصص لصوت الغنة الرنان.' },
              { id: '2', labelAr: 'من المعدة', isCorrect: false, explanationAr: 'الأصوات تخرج من الجهاز الصوتي والتنفسي.' },
              { id: '3', labelAr: 'من الأسنان وحدها', isCorrect: false, explanationAr: 'الأسنان مساعدة في مخارج اللسان.' },
            ],
          },
        ],
      },
    ],
  },
];

