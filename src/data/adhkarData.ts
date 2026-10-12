// adhkarData.ts — Authentic Morning & Evening Adhkar for Kids (أذكار الصباح والمساء المباركة)
// Authentic adhkars sourced from Sahih al-Bukhari, Sahih Muslim, Abu Dawud, and At-Tirmidhi

export interface AdhkarItem {
  id: string;
  period: 'morning' | 'evening';
  titleAr: string;
  titleEn: string;
  arabicText: string;
  transliteration: string;
  translationEn: string;
  repeatCount: number;
  rewardAr: string;
  rewardEn: string;
  source: string;
  iconName: string;
}

export const MORNING_ADHKAR: AdhkarItem[] = [
  {
    id: 'm-ayat-kursi',
    period: 'morning',
    titleAr: 'آية الكرسي المباركة',
    titleEn: 'Ayat al-Kursi (The Verse of the Throne)',
    arabicText:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      'Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta’khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard...',
    translationEn:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep...',
    repeatCount: 1,
    rewardAr: 'من قرأها حين يُصبح أُجير وحُفظ من الشياطين حتى يُمسي 🛡️',
    rewardEn: 'Whoever recites it in the morning is protected from evil until evening 🛡️',
    source: 'صحيح الترغيب والترهيب (رواه الحاكم وصححه الألباني)',
    iconName: 'shield-checkmark',
  },
  {
    id: 'm-ikhlas-falaq-nas',
    period: 'morning',
    titleAr: 'سورة الإخلاص والمعوّذتان',
    titleEn: 'Surah Al-Ikhlas & Al-Mu’awwidhat',
    arabicText:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration:
      'Qul Huwa Allahu Ahad... Qul a’udhu bi-Rabbil-Falaq... Qul a’udhu bi-Rabbin-Nas...',
    translationEn:
      'Say, "He is Allah, [who is] One..." Say, "I seek refuge in the Lord of daybreak..." Say, "I seek refuge in the Lord of mankind..."',
    repeatCount: 3,
    rewardAr: 'قال النبي ﷺ: «قُلْهَا حِينَ تُصْبِحُ وَحِينَ تُمْسِي ثَلاثَ مَرَّاتٍ تَكْفِيكَ مِنْ كُلِّ شَيْءٍ» ✨',
    rewardEn: 'The Prophet ﷺ said: "Recite them 3 times morning and evening, they will suffice you against all harm" ✨',
    source: 'سنن أبي داود والترمذي (حديث حسن صحيح)',
    iconName: 'book',
  },
  {
    id: 'm-asbahna-wa-asbaha',
    period: 'morning',
    titleAr: 'أصبحنا وأصبح الملك لله',
    titleEn: 'We Have Reached the Morning & Sovereignty Belongs to Allah',
    arabicText:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah...',
    translationEn:
      'We have entered the morning and kingdom belongs to Allah, and praise is to Allah. None has the right to be worshipped except Allah alone...',
    repeatCount: 1,
    rewardAr: 'بداية اليوم بتوحيد الله والاستعاذة من الكسل وسؤال الخير والبركة 🌅',
    rewardEn: 'Starts the child’s day with affirmation of Tawheed and protection from laziness 🌅',
    source: 'صحيح مسلم (حديث رقم ٢٧٢٣)',
    iconName: 'sunny',
  },
  {
    id: 'm-sayyid-istighfar',
    period: 'morning',
    titleAr: 'سيد الاستغفار المبارك',
    titleEn: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
    arabicText:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana ‘abduk, wa ana ‘ala ‘ahdika wa wa’dika mastata’t...',
    translationEn:
      'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant as best I can...',
    repeatCount: 1,
    rewardAr: 'من قالها موقناً بها حين يصبح فمات من يومه كان من أهل الجنة 👑',
    rewardEn: 'Whoever says it with firm faith in the morning and dies that day will enter Paradise 👑',
    source: 'صحيح البخاري (حديث رقم ٦٣٠٦)',
    iconName: 'sparkles',
  },
  {
    id: 'm-bismillah-alladhi',
    period: 'morning',
    titleAr: 'الحفظ التام باسم الله العظيم',
    titleEn: 'Protection in the Name of Allah',
    arabicText:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      'Bismillahil-ladhi la yadurru ma’as-mihi shay’un fil-ardi wa la fis-sama’i wa Huwas-Sami’ul-‘Alim',
    translationEn:
      'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    repeatCount: 3,
    rewardAr: 'من قالها ٣ مرات في الصباح لم يضره شيء طوال يومه بإذن الله 🛡️',
    rewardEn: 'Whoever recites it 3 times in the morning, nothing shall harm them all day 🛡️',
    source: 'سنن أبي داود والترمذي (حديث حسن صحيح)',
    iconName: 'lock-closed',
  },
  {
    id: 'm-raditu-billah',
    period: 'morning',
    titleAr: 'الرضا بالله والإسلام ورسوله',
    titleEn: 'Contentment with Allah, Islam & the Prophet',
    arabicText:
      'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration:
      'Raditu billahi Rabba, wa bil-Islami deena, wa bi-Muhammadin sallallahu ‘alayhi wa sallama Nabiyya',
    translationEn:
      'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
    repeatCount: 3,
    rewardAr: 'من قالها ثلاثاً كان حقاً على الله أن يرضيه يوم القيامة 🌸',
    rewardEn: 'Whoever says it 3 times, Allah promises to make them pleased on the Day of Resurrection 🌸',
    source: 'مسند أحمد وسنن أبي داود (حديث حسن)',
    iconName: 'heart',
  },
  {
    id: 'm-ya-hayyu-ya-qayyum',
    period: 'morning',
    titleAr: 'دعاء الاستغاثة برحمة الله وتيسير الشأن',
    titleEn: 'Supplication for Divine Help & Guidance',
    arabicText:
      'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration:
      'Ya Hayyu Ya Qayyumu bi-rahmatika astagheeth, aslih lee sha’nee kullah, wa la takilnee ila nafsee tarfata ‘ayn',
    translationEn:
      'O Ever-Living, O Sustainer! By Your mercy I seek assistance; rectify for me all of my affairs and do not leave me to myself even for the blink of an eye.',
    repeatCount: 1,
    rewardAr: 'يصلح الله به شأن الطفل الصغير ويوفقه في يومه ودراسته وطاعته 🌟',
    rewardEn: 'Rectifies the child’s day, affairs, learning, and shields from mistakes 🌟',
    source: 'سنن النسائي والحاكم (صحيح الترغيب ٦٦١)',
    iconName: 'compass',
  },
  {
    id: 'm-allahumma-bika-asbahna',
    period: 'morning',
    titleAr: 'اللهم بك أصبحنا',
    titleEn: 'O Allah, By You We Enter the Morning',
    arabicText:
      'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa ilaykan-nushoor',
    translationEn:
      'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and unto You is the resurrection.',
    repeatCount: 1,
    rewardAr: 'استشعار معيّة الله ورعايته الشاملة لحياتنا ومماتنا 🌿',
    rewardEn: 'Remembrance of Allah’s constant care for our lives and journey 🌿',
    source: 'سنن الترمذي (حديث رقم ٣٣٩١ - حسن صحيح)',
    iconName: 'partly-sunny',
  },
  {
    id: 'm-hasbiyallah',
    period: 'morning',
    titleAr: 'حسبي الله ونعم الوكيل',
    titleEn: 'Allah is Sufficient for Me',
    arabicText:
      'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration:
      'Hasbiyallahu la ilaha illa Huwa, ‘alayhi tawakkaltu wa Huwa Rabbul-‘Arshil-‘Azeem',
    translationEn:
      'Allah is sufficient for me; there is no deity except Him. Upon Him I have relied, and He is the Lord of the Great Throne.',
    repeatCount: 7,
    rewardAr: 'من قالها سبع مرات حين يصبح كفاه الله ما أهمه من أمر دنياه وآخرته ⚖️',
    rewardEn: 'Recited 7 times, Allah will suffice them against whatever worries them in this life and the next ⚖️',
    source: 'سنن أبي داود (حديث رقم ٥٠٨١)',
    iconName: 'hand-left',
  },
  {
    id: 'm-subhanallah-wa-bihamdih-100',
    period: 'morning',
    titleAr: 'تسبيح الصباح العظيم (مائة حسنة)',
    titleEn: 'Subhan Allahi wa bi-Hamdih (100 Times / or 10 for Kids)',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhan Allahi wa bi-hamdih',
    translationEn: 'Glory be to Allah and praise is due to Him.',
    repeatCount: 10,
    rewardAr: 'مَن قَالَهَا مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ 🌊',
    rewardEn: 'Erases misdeeds and multiplies good deeds like boundless ocean foam 🌊',
    source: 'صحيح البخاري ومسلم',
    iconName: 'water',
  },
];

export const EVENING_ADHKAR: AdhkarItem[] = [
  {
    id: 'e-ayat-kursi',
    period: 'evening',
    titleAr: 'آية الكرسي المباركة في المساء',
    titleEn: 'Ayat al-Kursi (Evening Protection)',
    arabicText:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      'Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta’khudhuhu sinatun wa la nawm...',
    translationEn:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    repeatCount: 1,
    rewardAr: 'من قرأها حين يُمسي أُجير وحُفظ في ليلته حتى يُصبح 🛡️',
    rewardEn: 'Whoever recites it in the evening is divinely sheltered and protected all night 🛡️',
    source: 'صحيح الترغيب والترهيب',
    iconName: 'shield-checkmark',
  },
  {
    id: 'e-ikhlas-falaq-nas',
    period: 'evening',
    titleAr: 'سورة الإخلاص والمعوّذتان',
    titleEn: 'Surah Al-Ikhlas & Al-Mu’awwidhat',
    arabicText:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration:
      'Qul Huwa Allahu Ahad... Qul a’udhu bi-Rabbil-Falaq... Qul a’udhu bi-Rabbin-Nas...',
    translationEn:
      'Say, "He is Allah, [who is] One..." Say, "I seek refuge in the Lord of daybreak..." Say, "I seek refuge in the Lord of mankind..."',
    repeatCount: 3,
    rewardAr: 'تكفيك من كل سوء وأذى طوال الليل حتى تشرق الشمس ✨',
    rewardEn: 'Suffices the child against every harm and darkness throughout the peaceful night ✨',
    source: 'سنن أبي داود والترمذي',
    iconName: 'book',
  },
  {
    id: 'e-amsayna-wa-amsa',
    period: 'evening',
    titleAr: 'أمسينا وأمسى الملك لله',
    titleEn: 'We Have Reached the Evening & Kingdom Belongs to Allah',
    arabicText:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      'Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah...',
    translationEn:
      'We have entered the evening and sovereignty belongs to Allah, and praise is to Allah. None has the right to be worshipped except Allah alone...',
    repeatCount: 1,
    rewardAr: 'سؤال الله خير الليلة ونورها وبركتها والاستعاذة من كل شر ومكروه 🌙',
    rewardEn: 'Asks Allah for the goodness, peace, and blessings of the night 🌙',
    source: 'صحيح مسلم (حديث رقم ٢٧٢٣)',
    iconName: 'moon',
  },
  {
    id: 'e-sayyid-istighfar',
    period: 'evening',
    titleAr: 'سيد الاستغفار في المساء',
    titleEn: 'Sayyid al-Istighfar (Evening Master Forgiveness)',
    arabicText:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana ‘abduk...',
    translationEn:
      'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant...',
    repeatCount: 1,
    rewardAr: 'من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة 👑',
    rewardEn: 'Whoever recites it with faith in the evening and passes away that night enters Jannah 👑',
    source: 'صحيح البخاري (حديث رقم ٦٣٠٦)',
    iconName: 'sparkles',
  },
  {
    id: 'e-aoodhu-bikalimatillah',
    period: 'evening',
    titleAr: 'التعوذ بكلمات الله التامات من شر ما خلق',
    titleEn: 'Seeking Refuge in Allah’s Perfect Words',
    arabicText:
      'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration:
      'A’udhu bi-kalimatil-lahit-tammati min sharri ma khalaq',
    translationEn:
      'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
    repeatCount: 3,
    rewardAr: 'من قالها ثلاث مرات حين يمسي لم تضره حُمَةٌ (لدغة عقرب أو حشرة أو سوء) تلك الليلة 🛡️',
    rewardEn: 'Said 3 times, protects against stings, insects, and harm during the night 🛡️',
    source: 'صحيح مسلم (حديث رقم ٢٧٠٩)',
    iconName: 'bug',
  },
  {
    id: 'e-bismillah-alladhi',
    period: 'evening',
    titleAr: 'الحفظ التام في المساء',
    titleEn: 'Evening Protection in Allah’s Name',
    arabicText:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      'Bismillahil-ladhi la yadurru ma’as-mihi shay’un fil-ardi wa la fis-sama’i wa Huwas-Sami’ul-‘Alim',
    translationEn:
      'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    repeatCount: 3,
    rewardAr: 'حفظ ودرع أمان إلهي من كل أذى وسوء في الليل 🌟',
    rewardEn: 'A divine shield of security from all harms at night 🌟',
    source: 'سنن أبي داود والترمذي',
    iconName: 'lock-closed',
  },
  {
    id: 'e-raditu-billah',
    period: 'evening',
    titleAr: 'الرضا بالله رباً وبالإسلام ديناً',
    titleEn: 'Pleased with Allah, Islam & the Prophet',
    arabicText:
      'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration:
      'Raditu billahi Rabba, wa bil-Islami deena, wa bi-Muhammadin sallallahu ‘alayhi wa sallama Nabiyya',
    translationEn:
      'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
    repeatCount: 3,
    rewardAr: 'يرضي الله قلب الطفل في الدنيا والآخرة ويثبته على الإيمان 🌸',
    rewardEn: 'Brings contentment and firmness in faith in this life and the next 🌸',
    source: 'مسند أحمد وأبو داود',
    iconName: 'heart',
  },
  {
    id: 'e-allahumma-bika-amsayna',
    period: 'evening',
    titleAr: 'اللهم بك أمسينا',
    titleEn: 'O Allah, By You We Enter the Evening',
    arabicText:
      'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration:
      'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu wa ilaykal-maseer',
    translationEn:
      'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and unto You is our final return.',
    repeatCount: 1,
    rewardAr: 'شكر لله على انقضاء اليوم بسلام وحفظ 🕊️',
    rewardEn: 'Thankfulness to Allah for passing the day in peace and security 🕊️',
    source: 'سنن الترمذي',
    iconName: 'cloudy-night',
  },
  {
    id: 'e-khawateem-baqarah',
    period: 'evening',
    titleAr: 'خواتيم سورة البقرة المباركة',
    titleEn: 'The Last Two Verses of Surah Al-Baqarah',
    arabicText:
      'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۞ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration:
      'Amanar-Rasoolu bima unzila ilayhi mir-Rabbihi wal-mu’minoon...',
    translationEn:
      'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers...',
    repeatCount: 1,
    rewardAr: 'قال النبي ﷺ: «مَنْ قَرَأَ بِالْآيَتَيْنِ مِنْ آخِرِ سُورَةِ الْبَقَرَةِ فِي لَيْلَةٍ كَفَتَاهُ» 📜',
    rewardEn: 'The Prophet ﷺ said: "Whoever recites the last two verses of Al-Baqarah at night, they will suffice him" 📜',
    source: 'صحيح البخاري ومسلم',
    iconName: 'bookmarks',
  },
];
