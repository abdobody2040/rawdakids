import type { Language } from '../constants/i18n';
import type { StoryScene, ProphetStory, StoryDecisionMoment, StoryQuizQuestion } from '../data/storiesData';
import type { KidHadith } from '../data/hadithData';
import type { MannerBuilding, MannerScenario } from '../data/mannersData';
import type { PillarItem, PillarStep } from '../data/arkanData';

export interface LocalizedProphetMeta {
  name: string;
  honorific: string;
  titleBadge: string;
  era: string;
  location: string;
}

const PROPHET_NAMES_LOCALIZED: Record<string, Partial<Record<Language, LocalizedProphetMeta>>> = {
  adam: {
    ar: { name: 'آدم', honorific: 'عليه السلام', titleBadge: 'أبو البشر وأول الأنبياء', era: 'بداية الخلق', location: 'الجنة ثم الأرض المباركة' },
    en: { name: 'Adam', honorific: 'peace be upon him', titleBadge: 'Father of Mankind & First Prophet', era: 'The Beginning of Creation', location: 'Paradise, then Earth' },
    fr: { name: 'Adam', honorific: 'que la paix soit sur lui', titleBadge: 'Père de l’humanité et premier prophète', era: 'Le début de la création', location: 'Le Paradis, puis la Terre bénie' },
    de: { name: 'Adam', honorific: 'Friede sei mit ihm', titleBadge: 'Vater der Menschheit & erster Prophet', era: 'Der Beginn der Schöpfung', location: 'Das Paradies, dann die Erde' },
    es: { name: 'Adán', honorific: 'la paz sea con él', titleBadge: 'Padre de la humanidad y primer profeta', era: 'El comienzo de la creación', location: 'El Paraíso, luego la Tierra' },
  },
  idris: {
    ar: { name: 'إدريس', honorific: 'عليه السلام', titleBadge: 'نبي الحكمة والقلم', era: 'بعد آدم بقرون', location: 'بابل ثم مصر' },
    en: { name: 'Idris', honorific: 'peace be upon him', titleBadge: 'Prophet of Wisdom and the Pen', era: 'Centuries after Adam', location: 'Babylon, then Egypt' },
    fr: { name: 'Idris', honorific: 'que la paix soit sur lui', titleBadge: 'Prophète de la sagesse et de la plume', era: 'Des siècles après Adam', location: 'Babylone, puis l’Égypte' },
    de: { name: 'Idris', honorific: 'Friede sei mit ihm', titleBadge: 'Prophet der Weisheit und der Feder', era: 'Jahrhunderte nach Adam', location: 'Babylon, dann Ägypten' },
    es: { name: 'Idris', honorific: 'la paz sea con él', titleBadge: 'Profeta de la sabiduría y de la pluma', era: 'Siglos después de Adán', location: 'Babilonia, luego Egipto' },
  },
  nuh: {
    ar: { name: 'نوح', honorific: 'عليه السلام', titleBadge: 'شيخ المرسلين وصاحب السفينة', era: 'أول أولي العزم', location: 'بلاد الرافدين' },
    en: { name: 'Nuh (Noah)', honorific: 'peace be upon him', titleBadge: 'First of the Resolute Messengers & The Great Ark', era: 'Early Messengers', location: 'Mesopotamia' },
    fr: { name: 'Noé (Nouh)', honorific: 'que la paix soit sur lui', titleBadge: 'Le noble messager et la grande arche', era: 'Les premiers messagers', location: 'Mésopotamie' },
    de: { name: 'Nuh (Noah)', honorific: 'Friede sei mit ihm', titleBadge: 'Der edle Gesandte und die große Arche', era: 'Frühe Gesandte', location: 'Mesopotamien' },
    es: { name: 'Noé (Nuh)', honorific: 'la paz sea con él', titleBadge: 'El noble mensajero y la gran arca', era: 'Primeros mensajeros', location: 'Mesopotamia' },
  },
  hud: {
    ar: { name: 'هود', honorific: 'عليه السلام', titleBadge: 'نبي الصبر لقوم عاد', era: 'بعد الطوفان', location: 'الأحقاف (اليمن)' },
    en: { name: 'Hud', honorific: 'peace be upon him', titleBadge: 'Prophet of Patience to the People of ‘Ad', era: 'Post-Flood', location: 'Al-Ahqaf (Yemen)' },
    fr: { name: 'Houd', honorific: 'que la paix soit sur lui', titleBadge: 'Prophète de la patience pour le peuple de ‘Ad', era: 'Après le déluge', location: 'Al-Ahqaf (Yémen)' },
    de: { name: 'Hud', honorific: 'Friede sei mit ihm', titleBadge: 'Prophet der Geduld für das Volk von ‘Ad', era: 'Nach der Sintflut', location: 'Al-Ahqaf (Jemen)' },
    es: { name: 'Hud', honorific: 'la paz sea con él', titleBadge: 'Profeta de la paciencia para el pueblo de ‘Ad', era: 'Después del diluvio', location: 'Al-Ahqaf (Yemen)' },
  },
  salih: {
    ar: { name: 'صالح', honorific: 'عليه السلام', titleBadge: 'صاحب معجزة الناقة لقوم ثمود', era: 'قوم ثمود', location: 'مدائن صالح (شمال الحجاز)' },
    en: { name: 'Salih', honorific: 'peace be upon him', titleBadge: 'Prophet of Thamud and the Miraculous She-Camel', era: 'Thamud Era', location: 'Al-Hijr (Madain Salih)' },
    fr: { name: 'Salih', honorific: 'que la paix soit sur lui', titleBadge: 'Prophète des Thamoud et de la chamelle miraculeuse', era: 'Époque de Thamoud', location: 'Al-Hijr (Mada’in Salih)' },
    de: { name: 'Salih', honorific: 'Friede sei mit ihm', titleBadge: 'Prophet von Thamud und der Wunderkamelin', era: 'Thamud-Ära', location: 'Al-Hijr (Madain Salih)' },
    es: { name: 'Salih', honorific: 'la paz sea con él', titleBadge: 'Profeta de Zamud y la camella milagrosa', era: 'Época de Zamud', location: 'Al-Hijr (Madain Salih)' },
  },
  ibrahim: {
    ar: { name: 'إبراهيم', honorific: 'عليه السلام', titleBadge: 'خليل الله وأبو الأنبياء وباني الكعبة', era: 'أولوا العزم', location: 'أور (العراق) ثم الشام ومكة' },
    en: { name: 'Ibrahim (Abraham)', honorific: 'peace be upon him', titleBadge: 'Close Friend of Allah & Father of Prophets', era: 'Resolute Messengers', location: 'Ur, Levant & Makkah' },
    fr: { name: 'Abraham (Ibrahim)', honorific: 'que la paix soit sur lui', titleBadge: 'L’ami intime d’Allah et bâtisseur de la Kaaba', era: 'Messagers résolus', location: 'Ur, le Levant et La Mecque' },
    de: { name: 'Ibrahim (Abraham)', honorific: 'Friede sei mit ihm', titleBadge: 'Der Freund Allahs & Erbauer der Kaaba', era: 'Standhafte Gesandte', location: 'Ur, Levante & Mekka' },
    es: { name: 'Abraham (Ibrahim)', honorific: 'la paz sea con él', titleBadge: 'El amigo íntimo de Al-lah y constructor de la Kaaba', era: 'Mensajeros resueltos', location: 'Ur, Levante y La Meca' },
  },
  ismail: {
    ar: { name: 'إسماعيل', honorific: 'عليه السلام', titleBadge: 'الذبيح الصابر ورفيق بناء الكعبة', era: 'مع والده إبراهيم', location: 'مكة المكرمة' },
    en: { name: 'Isma’il (Ishmael)', honorific: 'peace be upon him', titleBadge: 'The Patient Son & Builder of the Ka’bah', era: 'With Ibrahim', location: 'Makkah Al-Mukarramah' },
    fr: { name: 'Ismaël (Isma’il)', honorific: 'que la paix soit sur lui', titleBadge: 'Le fils patient et bâtisseur de la Kaaba', era: 'Avec Ibrahim', location: 'La Mecque bénie' },
    de: { name: 'Ismail (Ismael)', honorific: 'Friede sei mit ihm', titleBadge: 'Der geduldige Sohn & Mitbauer der Kaaba', era: 'Mit Ibrahim', location: 'Mekka' },
    es: { name: 'Ismael (Ismail)', honorific: 'la paz sea con él', titleBadge: 'El hijo paciente y constructor de la Kaaba', era: 'Con Ibrahim', location: 'La Meca' },
  },
  ishaq: {
    ar: { name: 'إسحاق', honorific: 'عليه السلام', titleBadge: 'البشارة المباركة ونبي البركة', era: 'أبناء إبراهيم', location: 'أرض فلسطين' },
    en: { name: 'Ishaq (Isaac)', honorific: 'peace be upon him', titleBadge: 'The Promised Son & Prophet of Blessing', era: 'Sons of Ibrahim', location: 'Palestine' },
    fr: { name: 'Isaac (Ishaq)', honorific: 'que la paix soit sur lui', titleBadge: 'L’enfant de la bonne annonce et de la bénédiction', era: 'Fils d’Ibrahim', location: 'Palestine' },
    de: { name: 'Ishaq (Isaak)', honorific: 'Friede sei mit ihm', titleBadge: 'Der verheißene Sohn & Prophet des Segens', era: 'Söhne von Ibrahim', location: 'Palästina' },
    es: { name: 'Isaac (Ishaq)', honorific: 'la paz sea con él', titleBadge: 'El hijo prometido y profeta de la bendición', era: 'Hijos de Ibrahim', location: 'Palestina' },
  },
  yaqub: {
    ar: { name: 'يعقوب', honorific: 'عليه السلام', titleBadge: 'إسرائيل ذو الصبر الجميل', era: 'عهد الأسباط', location: 'كنعان ثم مصر' },
    en: { name: 'Ya’qub (Jacob)', honorific: 'peace be upon him', titleBadge: 'Israel, Embodiment of Beautiful Patience', era: 'Patriarchs', location: 'Canaan, then Egypt' },
    fr: { name: 'Jacob (Ya’qoub)', honorific: 'que la paix soit sur lui', titleBadge: 'Israël, modèle de patience magnifique', era: 'Les Patriarches', location: 'Canaan, puis l’Égypte' },
    de: { name: 'Yaqub (Jakob)', honorific: 'Friede sei mit ihm', titleBadge: 'Israel, Vorbild an schöner Geduld', era: 'Erzväter', location: 'Kanaan, dann Ägypten' },
    es: { name: 'Jacob (Yaqub)', honorific: 'la paz sea con él', titleBadge: 'Israel, modelo de hermosa paciencia', era: 'Patriarcas', location: 'Canaán, luego Egipto' },
  },
  yusuf: {
    ar: { name: 'يوسف', honorific: 'عليه السلام', titleBadge: 'الصديق صاحب أجمل القصص وعزيز مصر', era: 'عهد بني إسرائيل', location: 'كنعان ثم أرض مصر' },
    en: { name: 'Yusuf (Joseph)', honorific: 'peace be upon him', titleBadge: 'The Truthful, Noble Vizier of Egypt', era: 'Children of Israel', location: 'Canaan, then Egypt' },
    fr: { name: 'Joseph (Yousouf)', honorific: 'que la paix soit sur lui', titleBadge: 'Le véridique, héros du plus beau récit et grand ministre d’Égypte', era: 'Enfants d’Israël', location: 'Canaan, puis l’Égypte' },
    de: { name: 'Yusuf (Josef)', honorific: 'Friede sei mit ihm', titleBadge: 'Der Wahrhaftige, Wesir von Ägypten & schönste Geschichte', era: 'Kinder Israels', location: 'Kanaan, dann Ägypten' },
    es: { name: 'José (Yusuf)', honorific: 'la paz sea con él', titleBadge: 'El verídico, visir de Egipto y protagonista del relato más hermoso', era: 'Hijos de Israel', location: 'Canaán, luego Egipto' },
  },
  ayyub: {
    ar: { name: 'أيوب', honorific: 'عليه السلام', titleBadge: 'رمز الصبر العظيم والشكر في الشدة', era: 'بين يعقوب وموسى', location: 'أرض حوران (الشام)' },
    en: { name: 'Ayyub (Job)', honorific: 'peace be upon him', titleBadge: 'Emblem of Monumental Patience and Gratitude', era: 'Between Yaqub and Musa', location: 'Hawran (Levant)' },
    fr: { name: 'Job (Ayyoub)', honorific: 'que la paix soit sur lui', titleBadge: 'Modèle absolu de patience et de gratitude dans l’épreuve', era: 'Entre Jacob et Moïse', location: 'Hauran (Levant)' },
    de: { name: 'Ayyub (Hiob)', honorific: 'Friede sei mit ihm', titleBadge: 'Symbol grenzenloser Geduld und Dankbarkeit', era: 'Zwischen Yaqub und Musa', location: 'Hauran (Levante)' },
    es: { name: 'Job (Ayyub)', honorific: 'la paz sea con él', titleBadge: 'Símbolo supremo de paciencia y gratitud en la prueba', era: 'Entre Jacob y Moisés', location: 'Haurán (Levante)' },
  },
  musa: {
    ar: { name: 'موسى', honorific: 'عليه السلام', titleBadge: 'كليم الله وقائد بني إسرائيل العظيم', era: 'أولوا العزم العظام', location: 'مصر وسيناء ومدين' },
    en: { name: 'Musa (Moses)', honorific: 'peace be upon him', titleBadge: 'The One who Spoke to Allah (Kalimullah)', era: 'Resolute Messengers', location: 'Egypt, Madyan & Sinai' },
    fr: { name: 'Moïse (Moussa)', honorific: 'que la paix soit sur lui', titleBadge: 'Celui qui a parlé directement à Allah (Kalimoullah)', era: 'Grands messagers résolus', location: 'Égypte, Madyan et Sinaï' },
    de: { name: 'Musa (Moses)', honorific: 'Friede sei mit ihm', titleBadge: 'Derjenige, der mit Allah sprach (Kalimullah)', era: 'Standhafte Gesandte', location: 'Ägypten, Madyan & Sinai' },
    es: { name: 'Moisés (Musa)', honorific: 'la paz sea con él', titleBadge: 'Aquel que conversó con Al-lah (Kalimullah)', era: 'Grandes mensajeros resueltos', location: 'Egipto, Madián y Sinaí' },
  },
  harun: {
    ar: { name: 'هارون', honorific: 'عليه السلام', titleBadge: 'وزير موسى وأخوه الفصيح', era: 'مع موسى', location: 'مصر وسيناء' },
    en: { name: 'Harun (Aaron)', honorific: 'peace be upon him', titleBadge: 'Eloquent Brother and Supporter of Musa', era: 'With Musa', location: 'Egypt & Sinai' },
    fr: { name: 'Aaron (Haroun)', honorific: 'que la paix soit sur lui', titleBadge: 'Le frère éloquent et fidèle soutien de Moïse', era: 'Avec Moïse', location: 'Égypte et Sinaï' },
    de: { name: 'Harun (Aaron)', honorific: 'Friede sei mit ihm', titleBadge: 'Beredter Bruder und treuer Helfer von Musa', era: 'Mit Musa', location: 'Ägypten & Sinai' },
    es: { name: 'Aarón (Harun)', honorific: 'la paz sea con él', titleBadge: 'El hermano elocuente y fiel sostén de Moisés', era: 'Con Moisés', location: 'Egipto y Sinaí' },
  },
  yunus: {
    ar: { name: 'يونس', honorific: 'عليه السلام', titleBadge: 'ذو النون وصاحب دعاء بطن الحوت العظيم', era: 'أهل نينوى', location: 'نينوى (العراق) ثم البحر' },
    en: { name: 'Yunus (Jonah)', honorific: 'peace be upon him', titleBadge: 'The Companion of the Whale & Sincere Dua', era: 'Prophets of Iraq', location: 'Nineveh & The Sea' },
    fr: { name: 'Jonas (Younous)', honorific: 'que la paix soit sur lui', titleBadge: 'L’homme au poisson et l’invocation lumineuse dans les ténèbres', era: 'Ninive', location: 'Ninive (Irak) et la mer' },
    de: { name: 'Yunus (Jonas)', honorific: 'Friede sei mit ihm', titleBadge: 'Der Gefährte des Wals & das erhörte Bittgebet', era: 'Ninive', location: 'Ninive (Irak) und das Meer' },
    es: { name: 'Jonás (Yunus)', honorific: 'la paz sea con él', titleBadge: 'El compañero de la ballena y la sincera súplica en la oscuridad', era: 'Nínive', location: 'Nínive (Irak) y el mar' },
  },
  dawud: {
    ar: { name: 'داود', honorific: 'عليه السلام', titleBadge: 'الملك العادل صاحب الزبور وتليين الحديد', era: 'ملوك بني إسرائيل', location: 'القدس الشريف' },
    en: { name: 'Dawud (David)', honorific: 'peace be upon him', titleBadge: 'The Righteous King, Psalms, and Softened Iron', era: 'Kings of Israel', location: 'Jerusalem' },
    fr: { name: 'David (Daoud)', honorific: 'que la paix soit sur lui', titleBadge: 'Le roi juste, chantre des psaumes (Zabour) et du fer adouci', era: 'Rois d’Israël', location: 'Jérusalem' },
    de: { name: 'Dawud (David)', honorific: 'Friede sei mit ihm', titleBadge: 'Der gerechte König, die Psalmen und erweichtes Eisen', era: 'Könige Israels', location: 'Jerusalem' },
    es: { name: 'David (Dawud)', honorific: 'la paz sea con él', titleBadge: 'El rey justo, los salmos (Zabur) y el hierro ablandado', era: 'Reyes de Israel', location: 'Jerusalén' },
  },
  sulaiman: {
    ar: { name: 'سليمان', honorific: 'عليه السلام', titleBadge: 'الملك الشاكر عالم لغة الطير والريح', era: 'العصر الذهبي للملك', location: 'القدس وفلسطين' },
    en: { name: 'Sulaiman (Solomon)', honorific: 'peace be upon him', titleBadge: 'The Grateful King Who Spoke to Birds and Winds', era: 'Golden Kingdom', location: 'Jerusalem & Levant' },
    fr: { name: 'Salomon (Soulayman)', honorific: 'que la paix soit sur lui', titleBadge: 'Le roi reconnaissant qui comprenait le langage des oiseaux', era: 'Le Royaume d’or', location: 'Jérusalem et le Levant' },
    de: { name: 'Sulaiman (Salomo)', honorific: 'Friede sei mit ihm', titleBadge: 'Der dankbare König, der die Sprache der Vögel verstand', era: 'Goldenes Zeitalter', location: 'Jerusalem & Levante' },
    es: { name: 'Salomón (Sulaiman)', honorific: 'la paz sea con él', titleBadge: 'El rey agradecido que comprendía el lenguaje de las aves', era: 'Reino dorado', location: 'Jerusalén y Levante' },
  },
  isa: {
    ar: { name: 'عيسى', honorific: 'عليه السلام', titleBadge: 'المسيح كلمة الله وروح منه وابن مريم البتول', era: 'أولوا العزم', location: 'بيت لحم والقدس والناصرة' },
    en: { name: 'Isa (Jesus)', honorific: 'peace be upon him', titleBadge: 'The Messiah, Word of Allah, and Son of Maryam', era: 'Resolute Messengers', location: 'Bethlehem & Jerusalem' },
    fr: { name: 'Jésus (Issa)', honorific: 'que la paix soit sur lui', titleBadge: 'Le Messie, la parole d’Allah et fils de la noble Marie (Maryam)', era: 'Grands messagers résolus', location: 'Bethléem et Jérusalem' },
    de: { name: 'Isa (Jesus)', honorific: 'Friede sei mit ihm', titleBadge: 'Der Messias, das Wort Allahs und Sohn der edlen Maryam', era: 'Standhafte Gesandte', location: 'Bethlehem & Jerusalem' },
    es: { name: 'Jesús (Isa)', honorific: 'la paz sea con él', titleBadge: 'El Mesías, la palabra de Al-lah e hijo de la noble María (Maryam)', era: 'Grandes mensajeros resueltos', location: 'Belén y Jerusalén' },
  },
  muhammad: {
    ar: { name: 'محمد', honorific: 'صلى الله عليه وسلم', titleBadge: 'خاتم الأنبياء والمرسلين ورحمة الله للعالمين', era: 'الرسالة الخاتمة', location: 'مكة المكرمة والمدينة المنورة' },
    en: { name: 'Muhammad', honorific: 'peace and blessings be upon him', titleBadge: 'The Seal of the Prophets & Mercy to all Worlds', era: 'Final Revelation', location: 'Makkah & Madinah' },
    fr: { name: 'Muhammad', honorific: 'que la paix et les bénédictions soient sur lui', titleBadge: 'Le Sceau des Prophètes et miséricorde pour l’univers', era: 'Révélation finale', location: 'La Mecque et Médine' },
    de: { name: 'Muhammad', honorific: 'Friede und Segen seien auf ihm', titleBadge: 'Das Siegel der Propheten & Barmherzigkeit für die Welten', era: 'Letzte Offenbarung', location: 'Mekka & Medina' },
    es: { name: 'Muhammad', honorific: 'la paz y las bendiciones sean con él', titleBadge: 'El Sello de los Profetas y misericordia para la humanidad', era: 'Revelación final', location: 'La Meca y Medina' },
  },
};

// Comprehensive 10 Scenes for Prophet Adam in French, German, Spanish
const ADAM_SCENES_LOCALIZED: Partial<Record<Language, { title: string; narration: string; symbolDescription: string }[]>> = {
  ar: [], // Handled by native fields
  en: [], // Handled by native fields
  fr: [
    {
      title: "Avant l'humanité et le dialogue des anges",
      narration: "Allah Tout-Puissant informa les nobles anges qu'Il allait établir sur la terre un successeur pour la peupler de bonté, de justice et de dévotion.",
      symbolDescription: "La lumière divine et le début de la création humaine",
    },
    {
      title: "La création d'Adam et le souffle de vie",
      narration: "Allah façonna notre père Adam à partir de l'argile de la terre avec un honneur suprême, lui insuffla la vie et fit de lui un être vivant doué d'ouïe et de vue.",
      symbolDescription: "L'argile bénie et le souffle de vie",
    },
    {
      title: "L'enseignement des noms et le don du savoir",
      narration: "Allah enseigna à Adam les noms de toutes les créatures et l'éclaira de discernement, faisant de la science le plus grand honneur pour l'être humain.",
      symbolDescription: "La lumière du savoir et de l'intelligence offerte à l'humanité",
    },
    {
      title: "La prosternation des anges en signe de respect",
      narration: "Allah ordonna aux anges de se prosterner par hommage envers Adam et en reconnaissance de sa noblesse, et tous obéirent avec amour et respect.",
      symbolDescription: "L'obéissance des anges et l'honneur accordé à l'Homme",
    },
    {
      title: "La création de notre mère Hawwa et la paix du Paradis",
      narration: "Allah créa son épouse Hawwa (Ève) pour vivre ensemble dans la sérénité et les merveilles du Paradis, entre rivières limpides et arbres bienfaisants.",
      symbolDescription: "Les fleuves paisibles et les ombrages du Paradis",
    },
    {
      title: "L'épreuve de l'arbre interdit",
      narration: "Allah permit à Adam et Hawwa de profiter de tout le Paradis, excepté d'un arbre précis pour éprouver leur volonté et leur vigilance.",
      symbolDescription: "L'arbre du rappel et l'apprentissage de l'obéissance",
    },
    {
      title: "La ruse de Satan et le repentir sincère",
      narration: "Iblis (Satan) les trompa par ses chuchotements. Mais dès qu'ils réalisèrent leur erreur, ils demandèrent pardon à Allah avec un cœur sincère.",
      symbolDescription: "La noble prière du repentir et le retour vers Allah",
    },
    {
      title: "La miséricorde divine et le pardon d'Allah",
      narration: "Allah accueillit leur repentir avec un amour infini, leur pardonna complètement et leur offrit Sa guidée pour eux et toute leur descendance.",
      symbolDescription: "La lumière de la miséricorde et du pardon d'Allah",
    },
    {
      title: "L'arrivée sur Terre pour bâtir la vie",
      narration: "Adam et Hawwa descendirent sur Terre avec la mission sacrée de faire le bien, d'aider la création et d'adorer Allah avec sincérité.",
      symbolDescription: "Les graines de la vie et le travail bienfaisant sur Terre",
    },
    {
      title: "Le premier des prophètes et le flambeau de la foi",
      narration: "Adam enseigna à ses enfants la vérité, la prière et la générosité, transmettant le flambeau de la foi qui continue d'éclairer notre monde.",
      symbolDescription: "Le flambeau de la guidée prophétique transmis aux enfants",
    },
  ],
  de: [
    {
      title: "Vor der Menschheit & Das Gespräch mit den Engeln",
      narration: "Allah der Erhabene verkündete den edlen Engeln, dass Er auf Erden einen Statthalter erschaffen wird, um sie mit Güte, Gerechtigkeit und Glauben zu erfüllen.",
      symbolDescription: "Das göttliche Licht und der Beginn der menschlichen Schöpfung",
    },
    {
      title: "Die Erschaffung Adams & Der Lebensodem",
      narration: "Allah formte unseren Vater Adam aus dem Lehm der Erde, hauchte ihm von Seinem Geist ein und machte ihn zu einem lebendigen, sehenden und hörenden Menschen.",
      symbolDescription: "Der gesegnete Lehm und der Lebensodem",
    },
    {
      title: "Das Lehren der Namen & Das Geschenk des Wissens",
      narration: "Allah lehrte Adam die Namen aller Dinge und schenkte ihm Weisheit, wodurch das Wissen die größte Ehre für den Menschen wurde.",
      symbolDescription: "Das Licht des Wissens und des Verstandes",
    },
    {
      title: "Die Niederwerfung der Engel zur Ehrung",
      narration: "Allah gebot den Engeln, sich vor Adam aus Respekt niederzuwerfen, und alle Engel gehorchten voller Liebe und Demut.",
      symbolDescription: "Der Gehorsam der Engel und die Würde des Menschen",
    },
    {
      title: "Die Erschaffung von Hawwa & Die Ruhe des Paradieses",
      narration: "Allah erschuf seine Gefährtin Hawwa (Eva), damit sie gemeinsam in Frieden im Paradies lebten, umgeben von Quellen und fruchtbaren Gärten.",
      symbolDescription: "Die friedlichen Quellen und Gärten des Paradieses",
    },
    {
      title: "Die Prüfung des verbotenen Baumes",
      narration: "Allah erlaubte ihnen alle Früchte des Paradieses, warnte sie jedoch vor einem einzigen Baum als Prüfung ihres Vertrauens und Gehorsams.",
      symbolDescription: "Der Baum der Besinnung und der Achtsamkeit",
    },
    {
      title: "Die Einflüsterung des Teufels & Aufrichtige Reue",
      narration: "Der Teufel verleitete sie durch Täuschung. Doch sofort bereuten sie aufrichtig und wandten sich voller Demut und Tränen an Allah.",
      symbolDescription: "Das aufrichtige Gebet um Vergebung (Tawbah)",
    },
    {
      title: "Die göttliche Barmherzigkeit & Vergebung",
      narration: "Allah nahm ihre Reue voller Liebe an, vergab ihnen vollkommen und schenkte ihnen und ihren Nachkommen Seine Rechtleitung.",
      symbolDescription: "Das Licht der göttlichen Barmherzigkeit und Vergebung",
    },
    {
      title: "Der Neuanfang auf Erden zum Aufbau des Guten",
      narration: "Adam und Hawwa kamen auf die Erde, um mit Fleiß und Gottesfurcht das Leben aufzubauen, Gutes zu tun und Allah allein zu dienen.",
      symbolDescription: "Die Saat des Guten und der Neuanfang auf Erden",
    },
    {
      title: "Der erste der Propheten & Das Licht des Glaubens",
      narration: "Adam lehrte seine Kinder den Glauben an den einen Gott, das Gebet und die Nächstenliebe, und entzündete das Licht der Führung für alle Zeiten.",
      symbolDescription: "Das Licht des prophetischen Erbes für die Menschheit",
    },
  ],
  es: [
    {
      title: "Antes de la humanidad y el diálogo con los ángeles",
      narration: "Al-lah el Glorioso anunció a los nobles ángeles que pondría en la tierra a un vicario (sucesor) para cultivarla con rectitud, bondad y devoción.",
      symbolDescription: "La luz divina y el comienzo de la creación humana",
    },
    {
      title: "La creación de Adán y el soplo de vida",
      narration: "Al-lah formó a nuestro padre Adán del barro de la tierra con supremo honor, insufló en él la vida e hizo de él un ser vivo dotado de oído y visión.",
      symbolDescription: "El barro bendito y el soplo de vida divina",
    },
    {
      title: "La enseñanza de los nombres y el regalo del saber",
      narration: "Al-lah enseñó a Adán los nombres de todas las cosas e inspiró en su corazón entendimiento, haciendo del conocimiento la mayor bendición humana.",
      symbolDescription: "La luz del conocimiento concedida a la humanidad",
    },
    {
      title: "La postración de los ángeles en señal de honra",
      narration: "Al-lah ordenó a los ángeles postrarse ante Adán en homenaje y reconocimiento, y todos obedecieron con amor y sumisión a Dios.",
      symbolDescription: "La obediencia de los ángeles y la dignidad concedida al ser humano",
    },
    {
      title: "La creación de Hawwa y la paz del Paraíso",
      narration: "Al-lah creó a su esposa Hawwa (Eva) para vivir juntos en la serenidad del Paraíso, rodeados de manantiales cristalinos y frutos dulces.",
      symbolDescription: "Los ríos apacibles y sombras fértiles del Paraíso",
    },
    {
      title: "La prueba del árbol prohibido",
      narration: "Al-lah les permitió gozar de todas las bendiciones del Paraíso, excepto acercarse a un solo árbol como prueba de obediencia.",
      symbolDescription: "El árbol del recuerdo y la atención constante",
    },
    {
      title: "El engaño del demonio y el arrepentimiento sincero",
      narration: "Iblís (Satanás) los engañó con susurros. Al darse cuenta, se volvieron inmediatamente a Al-lah pidiendo Su perdón con sincero corazón.",
      symbolDescription: "La hermosa oración del arrepentimiento sincero",
    },
    {
      title: "La infinita misericordia y perdón divino",
      narration: "Al-lah aceptó su arrepentimiento con inmenso amor, les concedió Su perdón y les otorgó Su guía a ellos y a toda su descendencia.",
      symbolDescription: "La luz del perdón divino y la misericordia eterna",
    },
    {
      title: "La llegada a la Tierra para sembrar el bien",
      narration: "Adán y Hawwa descendieron a la Tierra con la noble misión de cultivarla con esfuerzo, ayudar a la creación y adorar a Dios con pureza.",
      symbolDescription: "La semilla de la vida y las obras virtuosas en la Tierra",
    },
    {
      title: "El primer profeta y la antorcha de la fe",
      narration: "Adán enseñó a sus hijos la fe en el Dios Único, la oración y la rectitud, encendiendo la antorcha profética que guía a todas las generaciones.",
      symbolDescription: "La antorcha de la guía profética entregada a la humanidad",
    },
  ],
};

export function getLocalizedProphetMeta(prophet: ProphetStory, lang: Language): LocalizedProphetMeta {
  const custom = PROPHET_NAMES_LOCALIZED[prophet.id]?.[lang];
  if (custom) return custom;

  if (lang === 'ar') {
    return {
      name: prophet.nameAr,
      honorific: prophet.honorificAr,
      titleBadge: prophet.titleBadgeAr,
      era: prophet.eraAr,
      location: prophet.locationAr,
    };
  }

  // English fallback or multilingual translations
  const baseName = prophet.nameEn;
  const honorific =
    lang === 'ur'
      ? (prophet.id === 'muhammad' ? 'صلی اللہ علیہ وسلم' : 'علیہ السلام')
      : lang === 'ru'
      ? (prophet.id === 'muhammad' ? 'мир ему и благословение Аллаха' : 'мир ему')
      : lang === 'id'
      ? (prophet.id === 'muhammad' ? 'shallallahu ‘alaihi wa sallam' : '‘alaihissalam')
      : lang === 'bn'
      ? (prophet.id === 'muhammad' ? 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম' : 'আলাইহিস সালাম')
      : lang === 'tr'
      ? (prophet.id === 'muhammad' ? 'sallallahu aleyhi ve sellem' : 'aleyhisselam')
      : lang === 'fr'
      ? (prophet.id === 'muhammad' ? 'que la paix et les bénédictions soient sur lui' : 'que la paix soit sur lui')
      : lang === 'de'
      ? (prophet.id === 'muhammad' ? 'Friede und Segen seien auf ihm' : 'Friede sei mit ihm')
      : lang === 'es'
      ? (prophet.id === 'muhammad' ? 'la paz y las bendiciones sean con él' : 'la paz sea con él')
      : prophet.honorificEn;

  return {
    name: baseName,
    honorific,
    titleBadge: prophet.titleBadgeEn,
    era: prophet.eraEn,
    location: prophet.locationEn,
  };
}

export function getLocalizedProphetStoryTitle(prophet: ProphetStory, lang: Language): string {
  const meta = getLocalizedProphetMeta(prophet, lang);
  if (lang === 'ar') return `قصة نبي الله ${meta.name} ${meta.honorific}`;
  if (lang === 'ur') return `اللہ کے نبی ${meta.name} ${meta.honorific} کا واقعہ`;
  if (lang === 'bn') return `নবী ${meta.name} (${meta.honorific})-এর ঘটনা`;
  if (lang === 'ru') return `История Пророка ${meta.name} (${meta.honorific})`;
  if (lang === 'id') return `Kisah Nabi ${meta.name} (${meta.honorific})`;
  if (lang === 'tr') return `Peygamber ${meta.name} (${meta.honorific}) Hikayesi`;
  if (lang === 'fr') return `Histoire du Prophète ${meta.name} (${meta.honorific})`;
  if (lang === 'de') return `Geschichte des Propheten ${meta.name} (${meta.honorific})`;
  if (lang === 'es') return `Historia del Profeta ${meta.name} (${meta.honorific})`;
  return `Story of Prophet ${meta.name} (${meta.honorific})`;
}

export function getLocalizedProphetScene(
  prophetId: string,
  scene: StoryScene,
  sceneIdx: number,
  lang: Language
): { title: string; narration: string; symbolDescription: string } {
  if (lang === 'ar') {
    return {
      title: scene.titleAr,
      narration: scene.narrationAr,
      symbolDescription: scene.symbolDescriptionAr,
    };
  }

  // Check Adam curated dataset
  if (prophetId === 'adam' && (lang === 'fr' || lang === 'de' || lang === 'es')) {
    const list = ADAM_SCENES_LOCALIZED[lang];
    if (list && list[sceneIdx]) {
      return list[sceneIdx];
    }
  }

  // If European language and English is present, return English as reliable baseline or native translation
  return {
    title: scene.titleEn || scene.titleAr,
    narration: scene.narrationEn || scene.narrationAr,
    symbolDescription: scene.symbolDescriptionEn || scene.symbolDescriptionAr,
  };
}

export function getLocalizedProphetDecision(
  decisionMoment: StoryDecisionMoment,
  lang: Language
): {
  prompt: string;
  question: string;
  options: { id: string; text: string; feedback: string; isBestChoice: boolean }[];
} {
  if (lang === 'ar') {
    return {
      prompt: decisionMoment.promptAr,
      question: decisionMoment.questionAr,
      options: decisionMoment.options.map((o) => ({
        id: o.id,
        text: o.textAr,
        feedback: o.feedbackAr,
        isBestChoice: o.isBestChoice,
      })),
    };
  }

  return {
    prompt: decisionMoment.promptEn,
    question: decisionMoment.questionEn,
    options: decisionMoment.options.map((o) => ({
      id: o.id,
      text: o.textEn,
      feedback: o.feedbackEn,
      isBestChoice: o.isBestChoice,
    })),
  };
}

export function getLocalizedProphetQuiz(
  quizQ: StoryQuizQuestion,
  lang: Language
): {
  question: string;
  options: string[];
  explanation: string;
} {
  if (lang === 'ar') {
    return {
      question: quizQ.questionAr,
      options: quizQ.optionsAr,
      explanation: quizQ.explanationAr,
    };
  }

  return {
    question: quizQ.questionEn,
    options: quizQ.optionsEn,
    explanation: quizQ.explanationEn,
  };
}

export function getLocalizedProphetTakeaway(
  takeawayCard: ProphetStory['takeawayCard'],
  lang: Language
): {
  title: string;
  lesson: string;
  actionForToday: string;
} {
  if (lang === 'ar') {
    return {
      title: takeawayCard.titleAr,
      lesson: takeawayCard.lessonAr,
      actionForToday: takeawayCard.actionForTodayAr,
    };
  }

  return {
    title: takeawayCard.titleEn,
    lesson: takeawayCard.lessonEn,
    actionForToday: takeawayCard.actionForTodayEn,
  };
}

const HADITH_TEXT_LOCALIZATIONS: Record<string, Partial<Record<Language, { title: string; explanation: string }>>> = {
  'smile-charity': {
    bn: {
      title: 'হাসিমুখে তাকানো একটি সদকা',
      explanation: 'তোমার ভাই বা বোনের মুখে মিষ্টি হাসি উপহার দেওয়া আল্লাহর কাছে সদকা হিসেবে গণ্য হয়!',
    },
    ru: {
      title: 'Улыбка — это милостыня',
      explanation: 'Когда ты искренне улыбаешься брату или сестре, Аллах записывает это как добрую милостыню!',
    },
    ur: {
      title: 'مسکرانا صدقہ ہے',
      explanation: 'اپنے بھائی یا بہن کے سامنے پیار سے مسکرانا اللہ کے نزدیک صدقہ شمار ہوتا ہے!',
    },
    id: {
      title: 'Senyum adalah Sedekah',
      explanation: 'Tersenyum ramah kepada saudara atau saudarimu dicatat oleh Allah sebagai sedekah!',
    },
    tr: {
      title: 'Gülümsemek Sadakadır',
      explanation: 'Kardeşine sıcak bir tebessümle bakmak, Allah katında sadaka olarak kabul edilir!',
    },
    fr: {
      title: 'Sourire est une aumône',
      explanation: 'Sourire chaleureusement à ton frère ou ta sœur est inscrit comme une aumône auprès d’Allah !',
    },
    de: {
      title: 'Lächeln ist ein Almosen',
      explanation: 'Ein herzliches Lächeln für deinen Bruder oder deine Schwester wird von Allah als Almosen belohnt!',
    },
    es: {
      title: 'Sonreír es caridad',
      explanation: '¡Sonreír con cariño a tu hermano o hermana es considerado una obra de caridad ante Allah!',
    },
  },
  'believer-mirrors-brother': {
    bn: {
      title: 'মুমিন তার মুমিন ভাইয়ের আয়না',
      explanation: 'যেভাবে একটি আয়না কোনো হৈচৈ ছাড়াই মৃদুভাবে ত্রুটি দেখিয়ে দেয় তা সংশোধনের জন্য, ঠিক তেমনি একজন মুমিন তার ভাইকে গোপনে ও নম্রভাবে উপদেশ দেয়।',
    },
    ru: {
      title: 'Верующий — зеркало для своего брата',
      explanation: 'Подобно тому, как зеркало мягко показывает недостатки без шума, верующий наставляет своего брата с кротостью и наедине.',
    },
    ur: {
      title: 'مومن اپنے بھائی کا آئینہ ہے',
      explanation: 'جیسے آئینہ بغیر کسی شور کے عیب نرمی سے دکھاتا ہے، ویسے ہی مومن اپنے بھائی کو تنہائی میں پیار سے سمجھاتا ہے۔',
    },
    id: {
      title: 'Seorang Mukmin adalah Cermin bagi Saudaranya',
      explanation: 'Sebagaimana cermin dengan lembut menampakkan cela untuk diperbaiki tanpa gaduh, seorang mukmin menasihati saudaranya dengan lembut dan bijak.',
    },
    tr: {
      title: 'Mümin, Mümin Kardeşinin Aynasıdır',
      explanation: 'Bir aynanın kusurları incitmeden ve sessizce göstermesi gibi, mümin de kardeşine gizlice ve nezaketle nasihat eder.',
    },
    fr: {
      title: 'Le croyant est le miroir de son frère',
      explanation: 'Tout comme le miroir montre les défauts sans bruit pour les corriger, le croyant conseille son frère avec discrétion et douceur.',
    },
    de: {
      title: 'Der Gläubige ist der Spiegel seines Bruders',
      explanation: 'So wie ein Spiegel Fehler still und sanft zeigt, so berät der Gläubige seinen Bruder mit Milde und im Verborgenen.',
    },
    es: {
      title: 'El creyente es el espejo de su hermano',
      explanation: 'Así como el espejo muestra los defectos en silencio para corregirlos, el creyente aconseja a su hermano con gentileza y en privado.',
    },
  },
};

const HABIT_LOCALIZATIONS: Record<string, Partial<Record<Language, { name: string; action: string }>>> = {
  'habit-smile': {
    bn: { name: 'আজ ৩ জন মানুষকে মিষ্টি হাসি উপহার দাও', action: 'আজ তোমার পিতা-মাতা, শিক্ষক ও বন্ধুদের হাসিমুখে অভিবাদন জানাও' },
    ru: { name: 'Улыбнись трем людям сегодня', action: 'Подари добрую улыбку родителям, учителю или друзьям' },
    ur: { name: 'آج 3 لوگوں کو مسکرا کر دیکھیں', action: 'اپنے والدین، استاد اور دوستوں کو پیاری مسکراہٹ دیں' },
    id: { name: 'Tersenyum kepada 3 orang hari ini', action: 'Berikan senyum hangat kepada orang tua, guru, atau temanmu' },
    tr: { name: 'Bugün 3 kişiye gülümse', action: 'Anne babana, öğretmenine veya arkadaşlarına sıcak bir tebessüm et' },
    fr: { name: 'Souris à 3 personnes aujourd’hui', action: 'Offre un beau sourire à tes parents, ton enseignant ou tes amis' },
    de: { name: 'Lächle heute 3 Menschen an', action: 'Schenke deinen Eltern, Lehrern oder Freunden ein herzliches Lächeln' },
    es: { name: 'Sonríe a 3 personas hoy', action: 'Dedica una sonrisa alegre a tus padres, maestros o amigos hoy' },
  },
  'habit-bismillah': {
    bn: { name: 'বিসমিল্লাহ বলা ও ডান হাতে খাওয়া', action: 'খাওয়ার শুরুতে বিসমিল্লাহ বলো ও ডান হাত ব্যবহার করো' },
    ru: { name: 'Произнесение Бисмиллях и еда правой рукой', action: 'Всегда говори Бисмиллях перед едой и кушай правой рукой' },
    ur: { name: 'بسم اللہ پڑھنا اور دائیں ہاتھ سے کھانا', action: 'کھانے سے پہلے بسم اللہ کہیں اور دائیں ہاتھ سے کھائیں' },
    id: { name: 'Membaca Bismillah dan makan dengan tangan kanan', action: 'Ucapkan Bismillah sebelum makan dan gunakan selalu tangan kananmu' },
    tr: { name: 'Bismillah demek ve sağ elle yemek', action: 'Yemekten önce Bismillah de ve daima sağ elinle ye' },
    fr: { name: 'Dire Bismillah et manger de la main droite', action: 'Dis Bismillah avant de manger et sers-toi toujours de la main droite' },
    de: { name: 'Bismillah sagen und mit der rechten Hand essen', action: 'Sage vor dem Essen Bismillah und nutze deine rechte Hand' },
    es: { name: 'Decir Bismillah y comer con la mano derecha', action: 'Di Bismillah antes de comer y usa siempre la mano derecha' },
  },
};

export function getLocalizedHabit(
  habit: { id: string; nameAr: string; nameEn: string; actionAr: string; actionEn: string },
  lang: Language
): { name: string; action: string } {
  if (lang === 'ar') {
    return { name: habit.nameAr, action: habit.actionAr };
  }
  const custom = HABIT_LOCALIZATIONS[habit.id]?.[lang];
  if (custom) return custom;
  return { name: habit.nameEn, action: habit.actionEn };
}

export function getLocalizedHadith(
  hadith: KidHadith,
  lang: Language
): {
  title: string;
  narrator: string;
  explanation: string;
  miniStory: { sceneNumber: number; title: string; text: string; iconName: string }[];
  scenario: {
    prompt: string;
    situation: string;
    choices: { id: string; text: string; isCorrect: boolean; explanation: string }[];
  };
} {
  if (lang === 'ar') {
    return {
      title: hadith.titleAr,
      narrator: hadith.narratorAr,
      explanation: hadith.explanationAr,
      miniStory: hadith.miniStory.map((s) => ({
        sceneNumber: s.sceneNumber,
        title: s.titleAr,
        text: s.textAr,
        iconName: s.iconName,
      })),
      scenario: {
        prompt: hadith.scenario.promptAr,
        situation: hadith.scenario.situationAr,
        choices: hadith.scenario.choices.map((c) => ({
          id: c.id,
          text: c.textAr,
          isCorrect: c.isCorrect,
          explanation: c.explanationAr,
        })),
      },
    };
  }

  const customText = HADITH_TEXT_LOCALIZATIONS[hadith.id]?.[lang];

  return {
    title: customText ? customText.title : hadith.titleEn,
    narrator: hadith.narratorEn,
    explanation: customText ? customText.explanation : hadith.explanationEn,
    miniStory: hadith.miniStory.map((s) => ({
      sceneNumber: s.sceneNumber,
      title: s.titleEn,
      text: s.textEn,
      iconName: s.iconName,
    })),
    scenario: {
      prompt: hadith.scenario.promptEn,
      situation: hadith.scenario.situationEn,
      choices: hadith.scenario.choices.map((c) => ({
        id: c.id,
        text: c.textEn,
        isCorrect: c.isCorrect,
        explanation: c.explanationEn,
      })),
    },
  };
}

export function getLocalizedMannerBuilding(
  building: MannerBuilding,
  lang: Language
): {
  name: string;
  subtitle: string;
  weeklyPledge: string;
} {
  if (lang === 'ar') {
    return {
      name: building.nameAr,
      subtitle: building.subtitleAr,
      weeklyPledge: building.weeklyPledgeAr,
    };
  }

  const buildingLocalizations: Record<string, Partial<Record<Language, { name: string; subtitle: string; weeklyPledge: string }>>> = {
  "honesty-hall": {
    "bn": {
      "name": "সত্যবাদিতা ও বিশ্বস্ততার প্রাসাদ",
      "subtitle": "মুমিন কখনো মিথ্যা বলে না এবং আমানত রক্ষা করে",
      "weeklyPledge": "আমি প্রতিশ্রুতি দিচ্ছি যে সর্বদা সত্য কথা বলব এবং আমানত রক্ষা করব।"
    },
    "ru": {
      "name": "Дворец Правдивости и Честности",
      "subtitle": "Верующий никогда не обманывает и хранит доверие",
      "weeklyPledge": "Я обещаю всегда говорить правду и беречь доверие."
    },
    "ur": {
      "name": "سچائی اور امانت داری کا محل",
      "subtitle": "مومن کبھی جھوٹ نہیں بولتا اور امانت میں خیانت نہیں کرتا",
      "weeklyPledge": "میں وعدہ کرتا ہوں کہ ہمیشہ سچ بولوں گا اور امانت داری نبھاؤں گا۔"
    },
    "id": {
      "name": "Istana Kejujuran & Amanah",
      "subtitle": "Seorang mukmin tidak pernah berbohong dan selalu menjaga amanah",
      "weeklyPledge": "Aku berjanji akan selalu berkata jujur dan menjaga amanah."
    },
    "tr": {
      "name": "Doğruluk ve Güven Sarayı",
      "subtitle": "Mümin asla yalan söylemez ve emanete hıyanet etmez",
      "weeklyPledge": "Her zaman doğruyu söyleyeceğime ve emaneti koruyacağıma söz veriyorum."
    },
    "fr": {
      "name": "Palais de la Vérité et de la Confiance",
      "subtitle": "Le croyant ne ment jamais et préserve les dépôts avec fidélité",
      "weeklyPledge": "Je m’engage à toujours dire la vérité avec douceur et à honorer la confiance de tous."
    },
    "de": {
      "name": "Halle der Wahrheit & Zuverlässigkeit",
      "subtitle": "Ein Gläubiger lügt nicht und hütet das Anvertraute stets treu",
      "weeklyPledge": "Ich verspreche, in jeder Situation die Wahrheit zu sagen und ehrlich zu sein."
    },
    "es": {
      "name": "Palacio de la Verdad y la Confianza",
      "subtitle": "Un creyente nunca miente y cuida lo encomendado con devoción",
      "weeklyPledge": "Prometo decir siempre la verdad y nunca traicionar la confianza de los demás."
    }
  },
  "parents-kindness": {
    "bn": {
      "name": "পিতা-মাতার খেদমতের উদ্যান",
      "subtitle": "মায়ের পদতলে জান্নাত এবং পিতা-মাতার সন্তুষ্টিতে আল্লাহর সন্তুষ্টি",
      "weeklyPledge": "আমি পিতা-মাতাকে হাসিমুখে ভালোবাসব ও প্রতিদিন তাদের কাজে সাহায্য করব।"
    },
    "ru": {
      "name": "Сад Почтения к Родителям",
      "subtitle": "Рай находится под ногами матерей, а довольство Аллаха — в довольстве родителей",
      "weeklyPledge": "Я обещаю с улыбкой слушаться родителей и помогать им каждый день."
    },
    "ur": {
      "name": "والدین کی خدمت کا گلشن",
      "subtitle": "جنت ماؤں کے قدموں تلے ہے اور رب کی رضا والدین کی رضا میں ہے",
      "weeklyPledge": "میں ہمیشہ مسکرا کر امی ابو کا کہنا مانوں گا اور ان کی خدمت کروں گا۔"
    },
    "id": {
      "name": "Taman Bakti kepada Orang Tua",
      "subtitle": "Surga di bawah telapak kaki ibu dan ridha Allah ada pada ridha orang tua",
      "weeklyPledge": "Aku berjanji akan berbakti kepada orang tua dan membantu mereka setiap hari."
    },
    "tr": {
      "name": "Anne Babaya İyilik Bahçesi",
      "subtitle": "Cennet annelerin ayakları altındadır ve Allah’ın rızası anne babanın rızasındadır",
      "weeklyPledge": "Anne babama her zaman sevgiyle itaat edeceğime ve onlara yardım edeceğime söz veriyorum."
    },
    "fr": {
      "name": "Jardin de la Piété envers les Parents",
      "subtitle": "Le Paradis est sous les pieds des mères et la satisfaction d’Allah est liée aux parents",
      "weeklyPledge": "Je m’engage à écouter mes parents avec un sourire et à les aider chaque jour."
    },
    "de": {
      "name": "Garten der Güte zu den Eltern",
      "subtitle": "Das Paradies liegt zu Füßen der Mütter und Allahs Wohlgefallen bei den Eltern",
      "weeklyPledge": "Ich verspreche, meinen Eltern mit einem Lächeln zu gehorchen und ihnen täglich zu helfen."
    },
    "es": {
      "name": "Jardín de la Bondad hacia los Padres",
      "subtitle": "El Paraíso está bajo los pies de las madres y la complacencia de Al-lah con los padres",
      "weeklyPledge": "Prometo escuchar a mis padres con cariño y ayudarlos alegremente cada día."
    }
  },
  "sharing-house": {
    "bn": {
      "name": "দানশীলতা ও সহমর্মিতার ঘর",
      "subtitle": "গ্রহীতার হাতের চেয়ে দাতার হাত উত্তম ও আল্লাহর কাছে প্রিয়",
      "weeklyPledge": "আমি আনন্দ ও খেলনা ভাই-বোন ও বন্ধুদের সাথে ভাগ করে নেব।"
    },
    "ru": {
      "name": "Дом Щедрости и Заботы",
      "subtitle": "Дающая рука лучше берущей перед Аллахом",
      "weeklyPledge": "Я обещаю делиться своими игрушками и радостью с братьями и друзьями."
    },
    "ur": {
      "name": "سخاوت اور ہمدردی کا گھر",
      "subtitle": "دینے والا ہاتھ لینے والے ہاتھ سے بہتر اور افضل ہے",
      "weeklyPledge": "میں اپنی خوشیاں اور کھلونے اپنے بہن بھائیوں اور دوستوں کے ساتھ بانٹوں گا۔"
    },
    "id": {
      "name": "Rumah Berbagi & Kedermawanan",
      "subtitle": "Tangan di atas lebih baik daripada tangan di bawah",
      "weeklyPledge": "Aku berjanji akan gemar berbagi mainan dan kebahagiaan dengan sesama."
    },
    "tr": {
      "name": "Cömertlik ve Paylaşma Evi",
      "subtitle": "Veren el alan elden daha üstündür ve hayırlıdır",
      "weeklyPledge": "Oyuncaklarımı ve sevincimi kardeşlerim ve arkadaşlarımla paylaşacağıma söz veriyorum."
    },
    "fr": {
      "name": "Maison du Partage et de la Générosité",
      "subtitle": "La main qui donne est meilleure que celle qui reçoit",
      "weeklyPledge": "Je m’engage à partager mes jouets et mes joies avec mes frères et amis."
    },
    "de": {
      "name": "Haus des Teilens & der Großzügigkeit",
      "subtitle": "Die gebende Hand ist besser als die nehmende Hand",
      "weeklyPledge": "Ich verspreche, meine Freude und meine Dinge gerne mit anderen zu teilen."
    },
    "es": {
      "name": "Casa de la Generosidad y el Compartir",
      "subtitle": "La mano que da es mejor y más amada que la mano que recibe",
      "weeklyPledge": "Prometo compartir mis juguetes y mi alegría con mis hermanos y amigos."
    }
  },
  "cleanliness-park": {
    "bn": {
      "name": "পবিত্রতা ও পরিচ্ছন্নতার পার্ক",
      "subtitle": "পরিচ্ছন্নতা ও পবিত্রতা ঈমানের অর্ধেক অংশ",
      "weeklyPledge": "আমি আমার পোশাক, ঘর ও পরিবেশ সর্বদা পরিষ্কার-পরিচ্ছন্ন রাখব।"
    },
    "ru": {
      "name": "Парк Чистоты и Порядка",
      "subtitle": "Чистота — половина веры",
      "weeklyPledge": "Я обещаю содержать свою одежду, комнату и природу в чистоте."
    },
    "ur": {
      "name": "صفائی اور پاکیزگی کا چمن",
      "subtitle": "پاکیزگی اور صفائی نصف ایمان ہے",
      "weeklyPledge": "میں اپنے کپڑوں، کمرے اور ماحول کو ہمیشہ صاف ستھرا رکھوں گا۔"
    },
    "id": {
      "name": "Taman Kebersihan & Kesucian",
      "subtitle": "Kebersihan adalah sebagian dari iman",
      "weeklyPledge": "Aku berjanji menjaga pakaian, kamar, dan lingkunganku tetap bersih dan rapi."
    },
    "tr": {
      "name": "Temizlik ve Saflık Parkı",
      "subtitle": "Temizlik imanın yarısıdır",
      "weeklyPledge": "Kıyafetlerimi, odamı ve çevremi her zaman tertemiz tutacağıma söz veriyorum."
    },
    "fr": {
      "name": "Parc de la Pureté et de la Propreté",
      "subtitle": "La propreté est la moitié de la foi",
      "weeklyPledge": "Je m’engage à garder mes vêtements, ma chambre et la nature propres et ordonnés."
    },
    "de": {
      "name": "Park der Reinheit & Sauberkeit",
      "subtitle": "Die Reinheit ist die halbe Kraft des Glaubens",
      "weeklyPledge": "Ich verspreche, meine Umgebung, mein Zimmer und die Natur sauber zu halten."
    },
    "es": {
      "name": "Parque de la Pureza y la Limpieza",
      "subtitle": "La pureza y el aseo son la mitad de la fe",
      "weeklyPledge": "Prometo mantener mis prendas, mi habitación y la naturaleza limpias y ordenadas."
    }
  },
  "patience-palace": {
    "bn": {
      "name": "ধৈর্য ও প্রশান্তির দুর্গ",
      "subtitle": "ধৈর্য হলো মুমিনের জন্য আলোকবর্তিকা ও মহাশক্তি",
      "weeklyPledge": "আমি কোনো সমস্যায় রাগ না করে শান্ত থাকব ও ধৈর্য ধারণ করব।"
    },
    "ru": {
      "name": "Замок Терпения и Спокойствия",
      "subtitle": "Терпение — свет и сила для верующего",
      "weeklyPledge": "Я обещаю глубоко дышать и сохранять спокойствие, когда расстроен."
    },
    "ur": {
      "name": "صبر اور بردباری کا قلعہ",
      "subtitle": "صبر مومن کے لیے روشنی اور سب سے بڑی طاقت ہے",
      "weeklyPledge": "میں غصے کے وقت صبر سے کام لوں گا اور پرسکون رہوں گا۔"
    },
    "id": {
      "name": "Istana Kesabaran & Ketenangan",
      "subtitle": "Kesabaran adalah cahaya penuntun dan kekuatan bagi orang beriman",
      "weeklyPledge": "Aku berjanji akan tetap tenang, sabar, dan menahan emosi saat menghadapi kesulitan."
    },
    "tr": {
      "name": "Sabır ve Sükunet Kalesi",
      "subtitle": "Sabır mümin için aydınlık bir nur ve güçtür",
      "weeklyPledge": "Zorluklar karşısında öfkeme hakim olup sabırla hareket edeceğime söz veriyorum."
    },
    "fr": {
      "name": "Château de la Patience et du Calme",
      "subtitle": "La patience est une lumière et une force pour le croyant",
      "weeklyPledge": "Je m’engage à respirer profondément et à rester calme quand je suis contrarié."
    },
    "de": {
      "name": "Schloss der Geduld & Ruhe",
      "subtitle": "Geduld ist ein strahlendes Licht und eine Festung für die Seele",
      "weeklyPledge": "Ich verspreche, ruhig zu bleiben und tief durchzuatmen, wenn es schwierig wird."
    },
    "es": {
      "name": "Castillo de la Paciencia y la Calma",
      "subtitle": "La paciencia es una luz brillante y una virtud suprema",
      "weeklyPledge": "Prometo respirar hondo y conservar la calma ante cualquier disgusto."
    }
  },
  "respect-elders": {
    "bn": {
      "name": "বড়দের শ্রদ্ধা ও ছোটদের স্নেহের চত্বর",
      "subtitle": "যে আমাদের বড়দের সম্মান করে না এবং ছোটদের স্নেহ করে না, সে আমাদের দলভুক্ত নয়",
      "weeklyPledge": "আমি বড়দের শ্রদ্ধা করব এবং ছোটদের স্নেহ ও যত্ন করব।"
    },
    "ru": {
      "name": "Обитель Уважения и Заботы",
      "subtitle": "Не из нас тот, кто не уважает старших и не милосерден к младшим",
      "weeklyPledge": "Я обещаю уважать старших и бережно заботиться о младших."
    },
    "ur": {
      "name": "بڑوں کے احترام اور چھوٹوں کی شفقت کا آنگن",
      "subtitle": "وہ ہم میں سے نہیں جو ہمارے بڑوں کا احترام اور چھوٹوں پر رحم نہ کرے",
      "weeklyPledge": "میں بڑوں کا ادب کروں گا اور چھوٹوں سے شفقت اور پیار کا برتاؤ کروں گا۔"
    },
    "id": {
      "name": "Pelataran Menghormati yang Tua & Menyayangi yang Muda",
      "subtitle": "Bukan golongan kami yang tidak menghormati yang lebih tua dan tidak menyayangi yang muda",
      "weeklyPledge": "Aku berjanji santun kepada orang yang lebih tua dan menyayangi adik-adik."
    },
    "tr": {
      "name": "Büyüklere Saygı ve Küçüklere Sevgi Avlusu",
      "subtitle": "Büyüklerimize saygı göstermeyen ve küçüklerimize merhamet etmeyen bizden değildir",
      "weeklyPledge": "Büyüklerime hürmetle yaklaşacağıma ve küçüklere merhametle davranacağıma söz veriyorum."
    },
    "fr": {
      "name": "Cour du Respect et de l’Affection",
      "subtitle": "Celui qui ne respecte pas nos aînés et n’est pas doux envers les petits n’est pas des nôtres",
      "weeklyPledge": "Je m’engage à saluer les plus âgés avec respect et à protéger les plus petits."
    },
    "de": {
      "name": "Hof des Respekts & der Zuneigung",
      "subtitle": "Wer die Älteren nicht ehrt und zu den Jüngeren nicht barmherzig ist, gehört nicht zu uns",
      "weeklyPledge": "Ich verspreche, älteren Menschen respektvoll zu begegnen und die Kleinen zu beschützen."
    },
    "es": {
      "name": "Patio del Respeto y el Cariño",
      "subtitle": "Quien no respeta a nuestros mayores ni muestra ternura a los pequeños no es de los nuestros",
      "weeklyPledge": "Prometo saludar a los mayores con reverencia y cuidar con ternura a los más pequeños."
    }
  }
};

  const localizedBuilding = buildingLocalizations[building.id]?.[lang];
  if (localizedBuilding) {
    return localizedBuilding;
  }
  return {
    name: building.nameEn,
    subtitle: building.subtitleEn,
    weeklyPledge: building.weeklyPledgeEn,
  };
}

export function getLocalizedMannerScenario(
  scenario: MannerScenario,
  lang: Language
): {
  title: string;
  situation: string;
  choices: { id: string; text: string; isPositive: boolean; consequence: string }[];
} {
  if (lang === 'ar') {
    return {
      title: scenario.titleAr,
      situation: scenario.situationAr,
      choices: scenario.choices.map((c) => ({
        id: c.id,
        text: c.textAr,
        isPositive: c.isPositive,
        consequence: c.consequenceAr,
      })),
    };
  }

  return {
    title: scenario.titleEn,
    situation: scenario.situationEn,
    choices: scenario.choices.map((c) => ({
      id: c.id,
      text: c.textEn,
      isPositive: c.isPositive,
      consequence: c.consequenceEn,
    })),
  };
}

const PILLAR_LOCALIZATIONS: Record<string, Partial<Record<Language, { title: string; subtitle: string; summary: string }>>> = {
  "shahada": {
    "bn": {
      "title": "ঈমানের সাক্ষ্য (শাহাদাহ্)",
      "subtitle": "জান্নাতের চাবিকাঠি ও ইসলামের মূল ভিত্তি",
      "summary": "শাহাদাহ্ হলো ইসলামের প্রথম ও সর্বশ্রেষ্ঠ স্তম্ভ—ঘোষণা করা যে আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই এবং মুহাম্মদ ﷺ তাঁর প্রেরিত বান্দা ও রাসূল।"
    },
    "ru": {
      "title": "Свидетельство веры (Шахада)",
      "subtitle": "Ключ от Рая и основание Ислама",
      "summary": "Шахада — первый и величайший столп Ислама: свидетельство того, что нет божества, достойного поклонения, кроме Аллаха, и Мухаммад — Его Посланник."
    },
    "ur": {
      "title": "کلمۂ شہادت (گواہی)",
      "subtitle": "جنت کی چابی اور اسلام کی بنیادی بنیاد",
      "summary": "شہادت اسلام کا پہلا اور سب سے عظیم رکن ہے: اس بات کی سچی گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں۔"
    },
    "id": {
      "title": "Syahadat (Kesaksian Iman)",
      "subtitle": "Kunci Surga dan Fondasi Utama Islam",
      "summary": "Syahadat adalah rukun pertama dan paling agung dalam Islam: bersaksi bahwa tiada tuhan selain Allah dan Muhammad adalah utusan Allah."
    },
    "tr": {
      "title": "Kelime-i Şehadet",
      "subtitle": "Cennetin Anahtarı ve İslam’ın Temeli",
      "summary": "Şehadet, İslam’ın ilk ve en yüce şartıdır: Allah’tan başka ilah olmadığına ve Muhammed’in O’nun kulu ve elçisi olduğuna inanıp tanıklık etmektir."
    },
    "fr": {
      "title": "L’Attestation de Foi (Chahada)",
      "subtitle": "La clé du Paradis et le premier fondement de l’Islam",
      "summary": "La Chahada est le premier et le plus grand pilier de l’Islam : proclamer qu’il n’y a de divinité digne d’adoration qu’Allah et que Muhammad est Son Messager."
    },
    "de": {
      "title": "Das Glaubensbekenntnis (Schahada)",
      "subtitle": "Der Schlüssel zum Paradies und das Fundament des Islam",
      "summary": "Die Schahada ist die erste und wichtigste Säule des Islam: das Zeugnis, dass niemand der Anbetung würdig ist außer Allah und Muhammad Sein Gesandter ist."
    },
    "es": {
      "title": "El Testimonio de Fe (Shahada)",
      "subtitle": "La llave del Paraíso y el pilar fundamental del Islam",
      "summary": "La Shahada es el primer y más grande pilar del Islam: declarar que no hay más dios que Al-lah y que Muhammad es Su Mensajero."
    }
  },
  "salah": {
    "bn": {
      "title": "দৈনন্দিন নামায (সালাত)",
      "subtitle": "দিনে পাঁচবার আল্লাহর সাথে নূর ও ভালোবাসার নিবিড় বন্ধন",
      "summary": "নামায হলো মুমিনের মিরাজ ও ইসলামের দ্বিতীয় প্রধান স্তম্ভ, যা আমাদের হৃদয়কে পবিত্র রাখে এবং আল্লাহর স্মরণ ও শান্তিতে ভরিয়ে দেয়।"
    },
    "ru": {
      "title": "Ежедневная молитва (Намаз / Салят)",
      "subtitle": "Свет и живая связь с Аллахом пять раз в день",
      "summary": "Намаз — второй столп Ислама и опора религии, которая очищает сердце, защищает от дурного и дарует спокойствие душе."
    },
    "ur": {
      "title": "روزانہ کی نماز (صلوٰۃ)",
      "subtitle": "دن میں پانچ بار اللہ تعالیٰ سے محبت و نور کا تعلق",
      "summary": "نماز دین کا ستون اور مومن کی معراج ہے، جو دل کو پاکیزگی، سکون اور اللہ کی سچی یاد سے منور رکھتی ہے۔"
    },
    "id": {
      "title": "Salat Lima Waktu",
      "subtitle": "Cahaya dan Hubungan Kasih dengan Allah 5 Kali Sehari",
      "summary": "Salat adalah rukun Islam kedua dan tiang agama, yang membersihkan hati, menjauhkan dari keburukan, dan memberi ketenangan jiwa."
    },
    "tr": {
      "title": "Günlük Namaz (Salat)",
      "subtitle": "Günde Beş Vakit Allah ile Sevgi ve Nur Bağı",
      "summary": "Namaz dinin direğidir ve müminin miracıdır; kalbi kötülüklerden korur, huzur ve arınma kazandırır."
    },
    "fr": {
      "title": "La Prière Quotidienne (Salât)",
      "subtitle": "Le lien d’amour et de lumière avec Allah cinq fois par jour",
      "summary": "La Salât est le deuxième pilier de l’Islam et le pilier de la religion, qui illumine le cœur et préserve des mauvaises actions."
    },
    "de": {
      "title": "Das tägliche Gebet (Salah)",
      "subtitle": "Die liebevolle Verbindung und das Licht zu Allah fünfmal am Tag",
      "summary": "Das Gebet ist die tragende Säule des Islam, die das Herz reinigt, vor Schlechtem bewahrt und inneren Frieden schenkt."
    },
    "es": {
      "title": "La Oración Diaria (Salat)",
      "subtitle": "La conexión de amor y luz con Al-lah cinco veces al día",
      "summary": "La oración es el segundo pilar del Islam y la columna de la fe, que purifica el corazón y brinda sosiego al alma."
    }
  },
  "zakat": {
    "bn": {
      "title": "পবিত্র যাকাত প্রদান",
      "subtitle": "সম্পদ পবিত্র করা ও অভাবীদের ভালোবাসায় সাহায্য করা",
      "summary": "যাকাত হলো সমাজের দরিদ্র ও অসহায় ভাই-বোনদের সাহায্য করার জন্য আল্লাহর নির্ধারিত ফরজ ইবাদত, যা সম্পদে বরকত বাড়ায়।"
    },
    "ru": {
      "title": "Очистительная милостыня (Закят)",
      "subtitle": "Очищение имущества и искренняя помощь нуждающимся",
      "summary": "Закят — третий столп Ислама: обязанность делиться частью своего удела с нуждающимися ради довольства Аллаха и благодати."
    },
    "ur": {
      "title": "زکوٰۃ کی ادائیگی",
      "subtitle": "مال کی پاکیزگی اور ضرورت مندوں کی محبت بھری مدد",
      "summary": "زکوٰۃ غریب اور نادار بھائی بہنوں کی مدد، مال میں برکت اور دل کو سخاوت سے بھرنے کا الٰہی فریضہ ہے۔"
    },
    "id": {
      "title": "Zakat (Sedekah Wajib)",
      "subtitle": "Membersihkan Harta dan Membantu Sesama dengan Cinta",
      "summary": "Zakat adalah rukun Islam ketiga untuk menyucikan harta dan membantu fakir miskin demi meraih ridha Allah."
    },
    "tr": {
      "title": "Zekat İbadeti",
      "subtitle": "Malları Arındırmak ve Muhtaçlara Sevgiyle Yardım Etmek",
      "summary": "Zekat, zengin Müslümanların yılda bir kez ihtiyaç sahipleriyle paylaştığı, malı temizleyen ve bereketi artıran bir ibadettir."
    },
    "fr": {
      "title": "L’Aumône Purificatrice (Zakât)",
      "subtitle": "Partager avec amour pour aider les nécessiteux et bénir nos biens",
      "summary": "La Zakât purifie les richesses et renforce la fraternité en aidant les pauvres et les nécessiteux avec générosité."
    },
    "de": {
      "title": "Die Pflichtabgabe (Zakat)",
      "subtitle": "Mit Liebe teilen, um die Bedürftigen zu unterstützen",
      "summary": "Die Zakat reinigt den Besitz und stärkt die Gemeinschaft, indem den Schwachen und Armen geholfen wird."
    },
    "es": {
      "title": "La Limosna Obligatoria (Zakat)",
      "subtitle": "Compartir con amor para apoyar a los necesitados y purificar los bienes",
      "summary": "El Zakat purifica la riqueza y fomenta la solidaridad ayudando a quienes más lo necesitan con generosidad."
    }
  },
  "sawm": {
    "bn": {
      "title": "রমযান মাসের রোজা (সাওম)",
      "subtitle": "কুরআনের মাস, ধৈর্য ও সীমাহীন আনন্দের সময়",
      "summary": "রোজা হলো সুবহে সাদিক থেকে সূর্যাস্ত পর্যন্ত পানাহার থেকে বিরত থেকে তাকওয়া, ধৈর্য ও আল্লাহর নৈকট্য অর্জন করা।"
    },
    "ru": {
      "title": "Пост в месяц Рамадан (Саум)",
      "subtitle": "Месяц Корана, терпения, милосердия и радости",
      "summary": "Пост учит терпению, благодарности Аллаху и состраданию к тем, кто испытывает голод, укрепляя богобоязненность."
    },
    "ur": {
      "title": "رمضان المبارک کے روزے (صوم)",
      "subtitle": "قرآن کا مہینہ، صبر، شکر اور خوشی کی بہار",
      "summary": "روزہ صبح صادق سے غروب آفتاب تک کھانے پینے سے رک کر اللہ کی رضا اور تقویٰ حاصل کرنے کی بہترین عبادت ہے۔"
    },
    "id": {
      "title": "Puasa Ramadan (Sawm)",
      "subtitle": "Bulan Al-Quran, Kesabaran, dan Kegembiraan Rohani",
      "summary": "Puasa melatih kesabaran, syukur, empati kepada kaum dhuafa, dan mendekatkan diri kepada Allah Yang Maha Pengasih."
    },
    "tr": {
      "title": "Ramazan Orucu (Savm)",
      "subtitle": "Kuran Ayı, Sabır, Şükür ve Sevinç Mevsimi",
      "summary": "Oruç, imsaktan akşama kadar yeme içmeden uzak durarak nefsi terbiye etmek, sabrı ve aç olanların halini anlamayı öğretir."
    },
    "fr": {
      "title": "Le Jeûne du Ramadan (Siyâm)",
      "subtitle": "Apprendre la patience, la gratitude et la maîtrise de soi",
      "summary": "Le jeûne du mois béni de Ramadan élève l’âme, enseigne l’empathie pour les affamés et rapproche d’Allah."
    },
    "de": {
      "title": "Das Fasten im Ramadan (Sawm)",
      "subtitle": "Geduld, Dankbarkeit und Beherrschung des Herzens lernen",
      "summary": "Das Fasten schult die Geduld, das Mitgefühl für Bedürftige und vertieft die Dankbarkeit gegenüber den Gaben Allahs."
    },
    "es": {
      "title": "El Ayuno de Ramadán (Sawm)",
      "subtitle": "Aprender la paciencia, la gratitud y la purificación del alma",
      "summary": "El ayuno fortalece la voluntad, despierta la compasión por los necesitados y acerca el corazón a Al-lah."
    }
  },
  "hajj": {
    "bn": {
      "title": "পবিত্র মক্কার হজ্জ",
      "subtitle": "পবিত্র কা’বার চারপাশে বিশ্ব মুসলিমের ঐক্যের মহামিলন",
      "summary": "হজ্জ হলো সামর্থ্যবান মুসলমানদের জন্য জীবনে একবার পবিত্র কা’বা জিয়ারত করে বিশ্ব মুসলিম ভ্রাতৃত্বের মিলনমেলায় শরিক হওয়া।"
    },
    "ru": {
      "title": "Паломничество в Мекку (Хадж)",
      "subtitle": "Великое путешествие братства и единства вокруг Каабы",
      "summary": "Хадж — пятый столп Ислама: паломничество к Заповедной мечети в Мекке для тех, кто имеет возможность совершить его хотя бы раз в жизни."
    },
    "ur": {
      "title": "بیت اللہ کا مبارک حج",
      "subtitle": "خانہ کعبہ کے گرد امت مسلمہ کے اتحاد کا عظیم سفر",
      "summary": "حج صاحبِ استطاعت مسلمانوں کے لیے زندگی میں ایک بار بیت اللہ کی زیارت اور امت کے اتحاد کا شاندار مظاہرہ ہے۔"
    },
    "id": {
      "title": "Haji ke Baitullah (Makkah)",
      "subtitle": "Perjalanan Agung Persaudaraan dan Persatuan Umat di Ka’bah",
      "summary": "Haji adalah ziarah suci ke Ka’bah di Makkah bagi yang mampu secara fisik dan finansial sekali seumur hidup."
    },
    "tr": {
      "title": "Kutsal Hac İbadeti",
      "subtitle": "Kabe Etrafında Kardeşlik ve Birlik Yolculuğu",
      "summary": "Hac, gücü yeten her Müslümanın ömründe bir kez Mekke’deki Kabe’yi ve mukaddes mekanları ziyaret etmesidir."
    },
    "fr": {
      "title": "Le Pèlerinage à La Mecque (Hajj)",
      "subtitle": "Le grand voyage de la fraternité et de l’unité autour de la Kaaba",
      "summary": "Le Hajj est le grand voyage spirituel à La Mecque, obligatoire une fois dans la vie pour qui en a les moyens."
    },
    "de": {
      "title": "Die Pilgerfahrt (Hadsch)",
      "subtitle": "Die große Reise des Friedens und der Einheit rund um die Kaaba",
      "summary": "Die Hadsch ist die heilige Reise nach Mekka zur Kaaba, die jedem fähigen Muslim einmal im Leben auferlegt ist."
    },
    "es": {
      "title": "La Peregrinación (Hajj)",
      "subtitle": "El gran viaje sagrado de fraternidad y unión alrededor de la Kaaba",
      "summary": "El Hajj es la peregrinación a la Sagrada Kaaba en La Meca, un viaje de unidad para quien tenga la capacidad."
    }
  },
  "iman_allah": {
    "bn": {
      "title": "আল্লাহর প্রতি ঈমান",
      "subtitle": "বিশ্বজগতের একমাত্র সৃষ্টিকর্তা ও পালনকর্তার প্রতি বিশ্বাস",
      "summary": "দৃঢ় বিশ্বাস স্থাপন করা যে আল্লাহ এক ও অদ্বিতীয়, তাঁর কোনো অংশীদার নেই, তিনি সব শোনেন, সব দেখেন এবং তিনি পরম দয়ালু।"
    },
    "ru": {
      "title": "Вера в Аллаха (Таухид)",
      "subtitle": "Вера в Единого Творца и Господа миров",
      "summary": "Искренняя вера в то, что Аллах — Единственный Создатель и Владыка всего сущего, у Которого нет сотоварищей."
    },
    "ur": {
      "title": "اللہ تعالیٰ پر ایمان",
      "subtitle": "تمام جہانوں کے اکیلے خالق اور مالک پر سچا یقین",
      "summary": "اس بات پر کامل یقین رکھنا کہ اللہ ایک ہے، اس کا کوئی شریک نہیں، وہی زندگی اور کائنات کا اکیلا مالک ہے۔"
    },
    "id": {
      "title": "Iman kepada Allah",
      "subtitle": "Keyakinan kepada Pencipta dan Pemelihara Alam Semesta",
      "summary": "Meyakini dengan sepenuh hati bahwa Allah Maha Esa, tiada sekutu bagi-Nya, Maha Mendengar dan Maha Mengetahui."
    },
    "tr": {
      "title": "Allah’a İman",
      "subtitle": "Alemlerin Tek Yaratıcısı ve Rabbine İnanmak",
      "summary": "Allah’ın varlığına, birliğine, eşi ve benzeri olmadığına, her şeyi bildiğine ve yarattığına kalpten inanmaktır."
    },
    "fr": {
      "title": "La Foi en Allah (Le Créateur Unique)",
      "subtitle": "La croyance en l’Unique Créateur et Maître des mondes",
      "summary": "Croire fermement en Allah, Seul sans associé, Créateur bienveillant de toutes choses."
    },
    "de": {
      "title": "Der Glaube an Allah",
      "subtitle": "Der Glaube an den einzigen Schöpfer und Herrn aller Welten",
      "summary": "Aus tiefstem Herzen daran glauben, dass Allah Eins ist, keinen Partner hat und alles erschaffen hat."
    },
    "es": {
      "title": "La Fe en Al-lah (Dios Único)",
      "subtitle": "Creer en el Único Creador y Sustentador de los mundos",
      "summary": "Creer con el corazón en Al-lah, Quien no tiene copartícipes, es Todopoderoso y Misericordioso."
    }
  },
  "iman_angels": {
    "bn": {
      "title": "ফেরেশতাদের প্রতি ঈমান",
      "subtitle": "নূরের তৈরি অনুগত বান্দাদের প্রতি বিশ্বাস",
      "summary": "বিশ্বাস করা যে আল্লাহর আজ্ঞাবহ ফেরেশতাগণ নূরের তৈরি এবং তারা অবিরাম আল্লাহর আদেশ নিষ্ঠার সাথে পালন করেন।"
    },
    "ru": {
      "title": "Вера в Ангелов",
      "subtitle": "Вера в благородных созданий из света",
      "summary": "Вера в то, что ангелы сотворены из света и беспрекословно исполняют все повеления Всевышнего Аллаха."
    },
    "ur": {
      "title": "فرشتوں پر ایمان",
      "subtitle": "نور سے پیدا کی گئی معصوم ہستیوں پر یقین",
      "summary": "یقین رکھنا کہ فرشتے اللہ کے باوفا اور معصوم بندے ہیں جو رات دن اللہ کے احکام کی اطاعت کرتے ہیں۔"
    },
    "id": {
      "title": "Iman kepada Malaikat",
      "subtitle": "Keyakinan kepada Makhluk Suci yang Diciptakan dari Cahaya",
      "summary": "Meyakini bahwa para malaikat diciptakan dari cahaya dan senantiasa taat menjalankan perintah Allah."
    },
    "tr": {
      "title": "Meleklere İman",
      "subtitle": "Nurdan Yaratılmış Masum Varlıklara İnanmak",
      "summary": "Meleklerin nurdan yaratıldıklarına, günahsız olduklarına ve Allah’ın emirlerini yerine getirdiklerine inanmaktır."
    },
    "fr": {
      "title": "La Foi aux Anges",
      "subtitle": "La croyance aux nobles créatures créées de lumière",
      "summary": "Croire que les anges sont des serviteurs purs créés de lumière, obéissant avec amour à Allah."
    },
    "de": {
      "title": "Der Glaube an die Engel",
      "subtitle": "Der Glaube an die aus Licht geschaffenen edlen Wesen",
      "summary": "Daran glauben, dass die Engel aus Licht erschaffen sind und stets die Befehle Allahs voller Gehorsam erfüllen."
    },
    "es": {
      "title": "La Fe en los Ángeles",
      "subtitle": "Creer en las nobles criaturas creadas de luz",
      "summary": "Creer en los ángeles, siervos puros creados de luz que cumplen fielmente los designios de Al-lah."
    }
  },
  "iman_books": {
    "bn": {
      "title": "আসমানী কিতাবসমূহের প্রতি ঈমান",
      "subtitle": "আল্লাহর প্রেরিত পথনির্দেশক বাণী ও পবিত্র কুরআনের প্রতি বিশ্বাস",
      "summary": "বিশ্বাস করা যে আল্লাহ মানবজাতির কল্যাণে আসমানী গ্রন্থ নাযিল করেছেন, যার মধ্যে পবিত্র কুরআন সর্বশেষ ও সংরক্ষিত কিতাব।"
    },
    "ru": {
      "title": "Вера в Священные Писания",
      "subtitle": "Вера в ниспосланные Божьи книги и Священный Коран",
      "summary": "Вера в то, что Аллах ниспосылал Писания для наставления людей, последним и совершенным из которых является Коран."
    },
    "ur": {
      "title": "آسمانی کتابوں پر ایمان",
      "subtitle": "اللہ کے بھیجے گئے احکامات اور قرآن مجید پر یقین",
      "summary": "تمام آسمانی کتابوں پر سچا ایمان رکھنا جن میں قرآن مجید اللہ کی آخری، محفوظ اور کامل کتاب ہے۔"
    },
    "id": {
      "title": "Iman kepada Kitab-Kitab Allah",
      "subtitle": "Keyakinan kepada Petunjuk Ilahi dan Al-Quran Al-Karim",
      "summary": "Meyakini kitab-kitab yang diturunkan Allah kepada para rasul sebagai petunjuk hidup, dengan Al-Quran sebagai kitab pamungkas."
    },
    "tr": {
      "title": "Kutsal Kitaplara İman",
      "subtitle": "İlahi Mesajlara ve Kur’an-ı Kerim’e İnanmak",
      "summary": "Allah’ın peygamberlerine gönderdiği kutsal kitaplara ve son kitap olan Kur’an-ı Kerim’e kalpten inanmaktır."
    },
    "fr": {
      "title": "La Foi aux Livres Célestes",
      "subtitle": "La croyance aux paroles d’Allah et au Saint Coran",
      "summary": "Croire aux écritures révélées par Allah, dont le Saint Coran est l’ultime livre protégé."
    },
    "de": {
      "title": "Der Glaube an die heiligen Bücher",
      "subtitle": "Der Glaube an die offenbarten Schriften und den Koran",
      "summary": "Daran glauben, dass Allah Seine Schriften zur Rechtleitung herabgesandt hat, gekrönt durch den edlen Koran."
    },
    "es": {
      "title": "La Fe en los Libros Sagrados",
      "subtitle": "Creer en las revelaciones divinas y el Sagrado Corán",
      "summary": "Creer en los libros sagrados revelados por Al-lah como guía, siendo el Corán el mensaje final y protegido."
    }
  },
  "iman_messengers": {
    "bn": {
      "title": "নবী ও রাসূলগণের প্রতি ঈমান",
      "subtitle": "মানবজাতির সত্যের পথপ্রদর্শক সম্মানিত নবীগণের প্রতি বিশ্বাস",
      "summary": "বিশ্বাস করা যে আল্লাহ মানবজাতিকে পথ দেখাতে অনেক নবী পাঠিয়েছেন এবং মুহাম্মদ ﷺ সর্বশেষ ও সর্বশ্রেষ্ঠ নবী।"
    },
    "ru": {
      "title": "Вера в Пророков и Посланников",
      "subtitle": "Вера в избранных учителей человечества",
      "summary": "Вера во всех благородных пророков Аллаха от Адама до Мухаммада ﷺ, призывавших к добру и единобожию."
    },
    "ur": {
      "title": "انبیاء اور رسولوں پر ایمان",
      "subtitle": "انسانیت کے سچے رہنماؤں پر ایمان",
      "summary": "حضرت آدمؑ سے لے کر حضرت محمد ﷺ تک تمام سچے انبیاء پر ایمان لانا، اور محمد ﷺ کو اللہ کا آخری نبی تسلیم کرنا۔"
    },
    "id": {
      "title": "Iman kepada Para Nabi & Rasul",
      "subtitle": "Keyakinan kepada Para Pembimbing Umat Manusia",
      "summary": "Meyakini semua nabi dan rasul yang diutus Allah dari Nabi Adam hingga Nabi Muhammad ﷺ sebagai teladan terbaik."
    },
    "tr": {
      "title": "Peygamberlere İman",
      "subtitle": "İnsanlığa Doğru Yolu Gösteren Elçilere İnanmak",
      "summary": "Hz. Adem’den Hz. Muhammed ﷺ’e kadar gönderilen tüm peygamberlerin Allah’ın doğru sözlü elçileri olduğuna inanmaktır."
    },
    "fr": {
      "title": "La Foi aux Prophètes et Messagers",
      "subtitle": "La croyance aux modèles d’intégrité envoyés par Allah",
      "summary": "Croire en tous les prophètes depuis Adam jusqu’à Muhammad ﷺ, le sceau des messagers."
    },
    "de": {
      "title": "Der Glaube an die Gesandten",
      "subtitle": "Der Glaube an die Vorbilder der Menschheit",
      "summary": "An alle edlen Gesandten glauben, von Adam bis zu Muhammad ﷺ, dem Siegel aller Propheten."
    },
    "es": {
      "title": "La Fe en los Profetas y Mensajeros",
      "subtitle": "Creer en los guías de la humanidad enviados por Al-lah",
      "summary": "Creer en todos los profetas desde Adán hasta Muhammad ﷺ, el último y sello de los mensajeros."
    }
  },
  "iman_day": {
    "bn": {
      "title": "আখেরাত বা পরকালের প্রতি ঈমান",
      "subtitle": "হিসাব-নিকাশ, জান্নাত ও অনন্ত জীবনের প্রতি বিশ্বাস",
      "summary": "বিশ্বাস করা যে পার্থিব জীবনের পর পুনরুত্থান সত্য এবং নেক কাজের বিনিময়ে আল্লাহ জান্নাতের অনন্ত সুখ দান করবেন।"
    },
    "ru": {
      "title": "Вера в Судный День (Ахират)",
      "subtitle": "Вера в вечную жизнь и справедливое воздаяние",
      "summary": "Вера в воскрешение после смерти, справедливый суд Всевышнего и вечную награду в райских садах за благие дела."
    },
    "ur": {
      "title": "آخرت کے دن پر ایمان",
      "subtitle": "حساب کتاب، جنت اور ابدی زندگی پر یقین",
      "summary": "اس دنیا کے بعد دوبارہ زندہ کیے جانے، اپنے اعمال کے حساب اور نیک لوگوں کے لیے جنت کی نعمتوں پر کامل یقین رکھنا۔"
    },
    "id": {
      "title": "Iman kepada Hari Kiamat (Akhirat)",
      "subtitle": "Keyakinan kepada Hari Pembalasan dan Surga yang Kekal",
      "summary": "Meyakini adanya hari kebangkitan, pertanggungjawaban amal, dan balasan surga bagi orang-orang beriman."
    },
    "tr": {
      "title": "Ahiret Gününe İman",
      "subtitle": "Hesap Gününe, Yeniden Dirilişe ve Cennete İnanmak",
      "summary": "Dünya hayatından sonra yeniden dirilişin, hesap gününün ve iyiliklerin karşılığı olarak Cennetin varlığına inanmaktır."
    },
    "fr": {
      "title": "La Foi au Jour Dernier (L’Au-delà)",
      "subtitle": "La croyance au Jugement équitable et au Paradis éternel",
      "summary": "Croire en la résurrection, au jugement des actes et à la récompense divine du Paradis pour les croyants bienfaisants."
    },
    "de": {
      "title": "Der Glaube an den Jüngsten Tag",
      "subtitle": "Der Glaube an das ewige Leben und die göttliche Gerechtigkeit",
      "summary": "Daran glauben, dass nach diesem Leben die Auferstehung folgt und gute Taten mit dem Paradies belohnt werden."
    },
    "es": {
      "title": "La Fe en el Día del Juicio",
      "subtitle": "Creer en la vida eterna y la justicia divina",
      "summary": "Creer en la resurrección, el juicio de las obras y la promesa del Paraíso eterno para los justos."
    }
  },
  "iman_destiny": {
    "bn": {
      "title": "তাকদীরের প্রতি ঈমান",
      "subtitle": "ভালো ও মন্দ সবকিছু আল্লাহর হিকমত ও জ্ঞানের অন্তর্ভুক্ত",
      "summary": "বিশ্বাস করা যে যা কিছু ঘটে তা আল্লাহর সর্বজ্ঞ জ্ঞান ও প্রজ্ঞাময় পরিকল্পনার অংশ, যা আমাদের মনকে সন্তুষ্টি দান করে।"
    },
    "ru": {
      "title": "Вера в Предопределение (Кадар)",
      "subtitle": "Вера в совершенную мудрость и замысел Аллаха",
      "summary": "Вера в то, что всё происходящее подвластно знанию и мудрости Аллаха, что дарует покой и терпение в любых испытаниях."
    },
    "ur": {
      "title": "تقدیر پر ایمان (قضاء و قدر)",
      "subtitle": "اچھے اور برے حالات میں اللہ کی حکمت پر یقین",
      "summary": "اس بات پر راضی رہنا کہ دنیا میں جو کچھ ہوتا ہے وہ اللہ کے علم، ارادے اور بہترین حکمت کے تحت ہوتا ہے۔"
    },
    "id": {
      "title": "Iman kepada Qada dan Qadar (Takdir)",
      "subtitle": "Keyakinan kepada Ketetapan dan Hikmah Allah",
      "summary": "Meyakini bahwa segala sesuatu terjadi atas kehendak dan kebijaksanaan Allah, mendatangkan ketenangan hati."
    },
    "tr": {
      "title": "Kadere İman (Kader ve Kaza)",
      "subtitle": "Allah’ın Sonsuz İlim ve Hikmetine İnanmak",
      "summary": "Her şeyin Allah’ın bilgisi, takdiri ve hikmeti dahilinde gerçekleştiğine, O’nun her işinde bir hayır olduğuna inanmaktır."
    },
    "fr": {
      "title": "La Foi au Destin (Al-Qadr)",
      "subtitle": "La croyance en la sagesse suprême d’Allah dans toute chose",
      "summary": "Croire que tout arrive selon le décret sage d’Allah, ce qui apaise l’esprit et renforce la résilience."
    },
    "de": {
      "title": "Der Glaube an die Vorherbestimmung (Qadr)",
      "subtitle": "Der Glaube an Allahs unendliche Weisheit in allem",
      "summary": "Daran glauben, dass alles nach Allahs weisem Plan geschieht, was dem Herzen tiefe Zufriedenheit schenkt."
    },
    "es": {
      "title": "La Fe en el Destino Divino (Al-Qádr)",
      "subtitle": "Creer en la infinita sabiduría y designio de Al-lah",
      "summary": "Creer que todo ocurre conforme a la sabiduría y conocimiento de Al-lah, brindando paz y aceptación al alma."
    }
  }
};

export function getLocalizedPillar(
  pillar: PillarItem,
  lang: Language
): {
  title: string;
  subtitle: string;
  summary: string;
  hadithProof: string;
} {
  if (lang === 'ar') {
    return {
      title: pillar.titleAr,
      subtitle: pillar.subtitleAr,
      summary: pillar.summaryAr,
      hadithProof: pillar.hadithProofAr,
    };
  }

  const custom = PILLAR_LOCALIZATIONS[pillar.id]?.[lang];
  if (custom) {
    return {
      title: custom.title,
      subtitle: custom.subtitle,
      summary: custom.summary,
      hadithProof: pillar.hadithProofEn || pillar.hadithProofAr,
    };
  }

  return {
    title: pillar.titleEn,
    subtitle: pillar.subtitleEn,
    summary: pillar.summaryEn || pillar.summaryAr,
    hadithProof: pillar.hadithProofEn || pillar.hadithProofAr,
  };
}

export function getLocalizedPillarStep(
  step: PillarStep,
  lang: Language
): {
  title: string;
  desc: string;
  dhikr?: string;
} {
  if (lang === 'ar') {
    return {
      title: step.titleAr,
      desc: step.descAr,
      dhikr: step.dhikrAr,
    };
  }

  return {
    title: step.titleEn,
    desc: step.descEn,
    dhikr: step.dhikrEn,
  };
}

export function formatLocalizedTodayDate(lang: Language): string {
  if (lang === 'ar') return 'الأحد، ٤ ربيع الأول';
  if (lang === 'ur') return 'اتوار، 4 ربیع الاول';
  const locale =
    lang === 'fr'
      ? 'fr-FR'
      : lang === 'de'
      ? 'de-DE'
      : lang === 'es'
      ? 'es-ES'
      : lang === 'ru'
      ? 'ru-RU'
      : lang === 'id'
      ? 'id-ID'
      : lang === 'bn'
      ? 'bn-BD'
      : lang === 'tr'
      ? 'tr-TR'
      : 'en-US';
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
export function getPillarHeroBadge(lang: Language): string {
  const map: Record<Language, string> = {
    ar: '🌟 رحلة الإيمان والعمل',
    en: '🌟 Journey of Faith',
    fr: '🌟 Voyage de la Foi',
    de: '🌟 Reise des Glaubens',
    es: '🌟 Viaje de la Fe',
    ru: '🌟 Путь веры и знаний',
    ur: '🌟 ایمان اور عمل کا سفر',
    id: '🌟 Perjalanan Iman',
    bn: '🌟 ঈমান ও আমলের যাত্রা',
    tr: '🌟 İman ve İlim Yolculuğu',
  };
  return map[lang] || map.en;
}

export function getPillarHeroSubtitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'تعلم أركان الإسلام الخمسة وأركان الإيمان الستة بأسلوب تفاعلي مشوق وجميل!',
    en: 'Explore the 5 Pillars of Islam and 6 Pillars of Iman through interactive lessons!',
    fr: 'Découvre les 5 piliers de l’Islam et les 6 piliers de la Foi à travers des leçons interactives !',
    de: 'Entdecke die 5 Säulen des Islam und die 6 Säulen des Glaubens mit interaktiven Lektionen!',
    es: '¡Descubre los 5 pilares del Islam y los 6 pilares de la Fe con lecciones interactivas!',
    ru: 'Изучайте 5 столпов Ислама и 6 столпов Имана в увлекательных интерактивных уроках!',
    ur: 'اسلام کے ۵ ارکان اور ایمان کے ۶ ارکان دلکش و دلچسپ انداز میں سیکھیں!',
    id: 'Pelajari 5 Rukun Islam dan 6 Rukun Iman melalui pembelajaran interaktif yang menyenangkan!',
    bn: '৫টি ইসলামের রুকন এবং ৬টি ঈমানের রুকন শিখুন চমৎকার ও আনন্দময় পাঠের মাধ্যমে!',
    tr: 'İslam’ın 5 şartını ve İmanın 6 şartını eğlenceli ve interaktif derslerle keşfet!',
  };
  return map[lang] || map.en;
}

export function getPillarShortNumber(num: number, lang: Language): string {
  if (lang === 'ar') return `الركن ${num}`;
  if (lang === 'ur') return `رکن ${num}`;
  if (lang === 'bn') return `${num}নং স্তম্ভ`;
  if (lang === 'ru') return `Столп ${num}`;
  if (lang === 'tr') return `${num}. Şart`;
  if (lang === 'id') return `Rukun ${num}`;
  if (lang === 'fr') return `Pilier ${num}`;
  if (lang === 'de') return `Säule ${num}`;
  if (lang === 'es') return `Pilar ${num}`;
  return `Pillar ${num}`;
}

export function getPillarCategoryBadge(category: 'islam' | 'iman', num: number, lang: Language): string {
  if (category === 'islam') {
    if (lang === 'ar') return `الركن ${num} من أركان الإسلام`;
    if (lang === 'ur') return `اسلام کا رکن ${num}`;
    if (lang === 'bn') return `ইসলামের ${num}নং রুকন`;
    if (lang === 'ru') return `Столп ${num} Ислама`;
    if (lang === 'tr') return `İslam’ın ${num}. Şartı`;
    if (lang === 'id') return `Rukun Islam ke-${num}`;
    if (lang === 'fr') return `Pilier ${num} de l'Islam`;
    if (lang === 'de') return `Säule ${num} des Islam`;
    if (lang === 'es') return `Pilar ${num} del Islam`;
    return `Pillar ${num} of Islam`;
  } else {
    if (lang === 'ar') return `الركن ${num} من أركان الإيمان`;
    if (lang === 'ur') return `ایمان کا رکن ${num}`;
    if (lang === 'bn') return `ঈমানের ${num}নং রুকন`;
    if (lang === 'ru') return `Столп ${num} Имана`;
    if (lang === 'tr') return `İmanın ${num}. Şartı`;
    if (lang === 'id') return `Rukun Iman ke-${num}`;
    if (lang === 'fr') return `Pilier ${num} de la Foi`;
    if (lang === 'de') return `Säule ${num} des Glaubens`;
    if (lang === 'es') return `Pilar ${num} de la Fe`;
    return `Pillar ${num} of Iman`;
  }
}

export function getPillarExploreLabel(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'استكشف وتعلّم',
    en: 'Explore',
    fr: 'Explorer',
    de: 'Entdecken',
    es: 'Explorar',
    ru: 'Узнать больше',
    ur: 'سیکھیں اور جانیں',
    id: 'Pelajari',
    bn: 'শিখুন ও জানুন',
    tr: 'Keşfet',
  };
  return map[lang] || map.en;
}

export function getPillarProofLabel(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'الدليل من الحديث الشريف:',
    en: 'Prophetic Proof:',
    fr: 'Preuve du noble Hadith :',
    de: 'Beweis aus dem edlen Hadith:',
    es: 'Prueba del noble Hadiz:',
    ru: 'Довод из благородного хадиса:',
    ur: 'حدیثِ نبوی سے دلیل:',
    id: 'Dalil dari Hadis Nabi:',
    bn: 'হাদীস শরীফ থেকে প্রমাণ:',
    tr: 'Hadis-i Şeriften Delil:',
  };
  return map[lang] || map.en;
}

export function getPillarSimTab(mode: 'wudu' | 'prayer', lang: Language): string {
  if (mode === 'wudu') {
    const map: Record<Language, string> = {
      ar: '🌊 كيف أتوضأ؟ (٨ خطوات)',
      en: '🌊 How to do Wudu (8 steps)',
      fr: '🌊 Comment faire ses ablutions (8 étapes)',
      de: '🌊 Wie vollzieht man Wudu? (8 Schritte)',
      es: '🌊 ¿Cómo hacer la ablución? (8 pasos)',
      ru: '🌊 Как совершать омовение? (8 шагов)',
      ur: '🌊 وضو کا طریقہ (۸ مراحل)',
      id: '🌊 Cara Berwudu (8 langkah)',
      bn: '🌊 কীভাবে ওযু করতে হয়? (৮টি ধাপ)',
      tr: '🌊 Abdest Nasıl Alınır? (8 adım)',
    };
    return map[lang] || map.en;
  } else {
    const map: Record<Language, string> = {
      ar: '🕌 كيف أصلي؟ (١٠ خطوات)',
      en: '🕌 How to Pray (10 steps)',
      fr: '🕌 Comment faire la prière (10 étapes)',
      de: '🕌 Wie betet man? (10 Schritte)',
      es: '🕌 ¿Cómo rezar? (10 pasos)',
      ru: '🕌 Как совершать намаз? (10 шагов)',
      ur: '🕌 نماز کا طریقہ (۱۰ مراحل)',
      id: '🕌 Cara Salat (10 langkah)',
      bn: '🕌 কীভাবে নামায পড়তে হয়? (১০টি ধাপ)',
      tr: '🕌 Namaz Nasıl Kılınır? (10 adım)',
    };
    return map[lang] || map.en;
  }
}

export function getPillarSimBadge(mode: 'wudu' | 'prayer', lang: Language): string {
  if (mode === 'wudu') {
    const map: Record<Language, string> = {
      ar: 'خطوات الوضوء المبارك',
      en: 'Steps of Wudu',
      fr: 'Étapes des ablutions',
      de: 'Schritte des Wudu',
      es: 'Pasos de la ablución',
      ru: 'Шаги омовения',
      ur: 'وضو کے مبارک مراحل',
      id: 'Langkah-langkah Wudu',
      bn: 'পবিত্র ওযুর ধাপসমূহ',
      tr: 'Mübarek Abdest Adımları',
    };
    return map[lang] || map.en;
  } else {
    const map: Record<Language, string> = {
      ar: 'طريقة وأركان الصلاة',
      en: 'How to Pray (Step-by-Step)',
      fr: 'Manière et piliers de la prière',
      de: 'Ablauf und Säulen des Gebets',
      es: 'Guía y pilares de la oración',
      ru: 'Порядок и столпы намаза',
      ur: 'نماز کا طریقہ اور ارکان',
      id: 'Panduan dan Rukun Salat',
      bn: 'নামাযের নিয়ম ও রুকনসমূহ',
      tr: 'Namazın Kılınışı ve Rükünleri',
    };
    return map[lang] || map.en;
  }
}

export function getPillarStepCounter(step: number, total: number, lang: Language): string {
  if (lang === 'ar') return `خطوة ${step} من ${total}`;
  if (lang === 'ur') return `مرحلہ ${step} از ${total}`;
  if (lang === 'bn') return `${step}নং ধাপ (${total}টির মধ্যে)`;
  if (lang === 'ru') return `Шаг ${step} из ${total}`;
  if (lang === 'id') return `Langkah ${step} dari ${total}`;
  if (lang === 'tr') return `Adım ${step} / ${total}`;
  if (lang === 'fr') return `Étape ${step} sur ${total}`;
  if (lang === 'de') return `Schritt ${step} von ${total}`;
  if (lang === 'es') return `Paso ${step} de ${total}`;
  return `Step ${step} of ${total}`;
}

export function getPillarDhikrLabel(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'ما نقوله في هذه الخطوة:',
    en: 'What to say in this step:',
    fr: 'Ce que l’on dit à cette étape :',
    de: 'Was wir in diesem Schritt sagen:',
    es: 'Lo que decimos en este paso:',
    ru: 'Что мы говорим на этом шаге:',
    ur: 'اس مرحلے میں کیا پڑھتے ہیں:',
    id: 'Bacaan pada langkah ini:',
    bn: 'এই ধাপে যা বলতে হয়:',
    tr: 'Bu adımda söylenen dua:',
  };
  return map[lang] || map.en;
}

export function getPillarAudioBtnLabel(isPlaying: boolean, lang: Language): string {
  if (isPlaying) {
    const map: Record<Language, string> = {
      ar: 'إيقاف الصوت',
      en: 'Stop Audio',
      fr: 'Arrêter l’audio',
      de: 'Ton anhalten',
      es: 'Detener audio',
      ru: 'Остановить',
      ur: 'آواز روکیں',
      id: 'Hentikan Audio',
      bn: 'অডিও থামান',
      tr: 'Sesi Durdur',
    };
    return map[lang] || map.en;
  } else {
    const map: Record<Language, string> = {
      ar: '🔊 استمع لنطق الذكر',
      en: '🔊 Listen to Dhikr',
      fr: '🔊 Écouter l’invocation',
      de: '🔊 Bittgebet anhören',
      es: '🔊 Escuchar la súplica',
      ru: '🔊 Слушать зикр',
      ur: '🔊 ذکر سنیں',
      id: '🔊 Dengarkan Zikir',
      bn: '🔊 যিকির শুনুন',
      tr: '🔊 Zikri Dinle',
    };
    return map[lang] || map.en;
  }
}

export function getPillarNavBtnLabel(action: 'prev' | 'next' | 'wuduDone' | 'prayerDone', lang: Language): string {
  if (action === 'prev') {
    const map: Record<Language, string> = {
      ar: 'السابق',
      en: 'Previous',
      fr: 'Précédent',
      de: 'Zurück',
      es: 'Anterior',
      ru: 'Назад',
      ur: 'پچھلا',
      id: 'Sebelumnya',
      bn: 'পূর্ববর্তী',
      tr: 'Önceki',
    };
    return map[lang] || map.en;
  }
  if (action === 'next') {
    const map: Record<Language, string> = {
      ar: 'التالي',
      en: 'Next',
      fr: 'Suivant',
      de: 'Weiter',
      es: 'Siguiente',
      ru: 'Далее',
      ur: 'اگلا',
      id: 'Berikutnya',
      bn: 'পরবর্তী',
      tr: 'Sonraki',
    };
    return map[lang] || map.en;
  }
  if (action === 'wuduDone') {
    const map: Record<Language, string> = {
      ar: 'أتقنت الوضوء ✓',
      en: 'Wudu Completed ✓',
      fr: 'Ablutions maîtrisées ✓',
      de: 'Wudu gemeistert ✓',
      es: '¡Ablución completada! ✓',
      ru: 'Омовение освоено ✓',
      ur: 'وضو مکمل ہوا ✓',
      id: 'Wudu Selesai ✓',
      bn: 'ওযু সম্পন্ন হয়েছে ✓',
      tr: 'Abdest Tamamlandı ✓',
    };
    return map[lang] || map.en;
  }
  const map: Record<Language, string> = {
    ar: 'أتقنت الصلاة ✓',
    en: 'Prayer Completed ✓',
    fr: 'Prière maîtrisée ✓',
    de: 'Gebet gemeistert ✓',
    es: '¡Oración completada! ✓',
    ru: 'Намаз освоен ✓',
    ur: 'نماز مکمل ہوئی ✓',
    id: 'Salat Selesai ✓',
    bn: 'নামায সম্পন্ন হয়েছে ✓',
    tr: 'Namaz Tamamlandı ✓',
  };
  return map[lang] || map.en;
}

export function getPillarQuizTitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'اختبر فهمك يا بطل',
    en: 'Check Your Knowledge',
    fr: 'Vérifie tes connaissances',
    de: 'Teste dein Wissen',
    es: 'Pon a prueba lo aprendido',
    ru: 'Проверь свои знания',
    ur: 'اپنا علم آزمائیں',
    id: 'Uji Pengetahuanmu',
    bn: 'তোমার জ্ঞান যাচাই করো',
    tr: 'Bilgini Test Et',
  };
  return map[lang] || map.en;
}

export function getPillarClaimRewardText(stars: number, lang: Language): string {
  if (lang === 'ar') return `أتممت الركن! احصل على +${stars} نجوم 🌟`;
  if (lang === 'ur') return `مکمل ہوا! +${stars} ستارے حاصل کریں 🌟`;
  if (lang === 'bn') return `সম্পন্ন হয়েছে! +${stars}টি তারা গ্রহণ করো 🌟`;
  if (lang === 'ru') return `Завершено! Забери +${stars} звёзд 🌟`;
  if (lang === 'id') return `Selesai! Klaim +${stars} Bintang 🌟`;
  if (lang === 'tr') return `Tamamlandı! +${stars} Yıldız Kazan 🌟`;
  if (lang === 'fr') return `Terminé ! Récupère +${stars} étoiles 🌟`;
  if (lang === 'de') return `Geschafft! Hole dir +${stars} Sterne 🌟`;
  if (lang === 'es') return `¡Completado! Reclama +${stars} estrellas 🌟`;
  return `Completed! Claim +${stars} Stars 🌟`;
}

export function getPillarCelebrationMeta(title: string, lang: Language): { title: string; subtitle: string } {
  if (lang === 'ar') return { title: 'بارك الله فيك يا بطل!', subtitle: `أتممت تعلم واستيعاب ${title}` };
  if (lang === 'ur') return { title: 'ماشاءاللہ! شاباش پیارے بچے!', subtitle: `آپ نے کامیابی سے ${title} سیکھ لیا` };
  if (lang === 'bn') return { title: 'মাশাআল্লাহ! সাবাশ প্রিয় বন্ধু!', subtitle: `তুমি সফলভাবে ${title} শিখেছো` };
  if (lang === 'ru') return { title: 'МашаАллах! Молодец, герой!', subtitle: `Вы успешно изучили «${title}»` };
  if (lang === 'id') return { title: 'Masya Allah! Hebat, Juara!', subtitle: `Kamu berhasil mempelajari ${title}` };
  if (lang === 'tr') return { title: 'MaşaAllah! Harikasın şampiyon!', subtitle: `${title} konusunu başarıyla tamamladın` };
  if (lang === 'fr') return { title: 'Macha’Allah ! Bravo champion !', subtitle: `Tu as maîtrisé l’apprentissage de : ${title}` };
  if (lang === 'de') return { title: 'Mascha’Allah! Großartig gemacht!', subtitle: `Du hast ${title} erfolgreich gelernt` };
  if (lang === 'es') return { title: '¡Masha’Al-lah! ¡Muy bien, campeón!', subtitle: `Has dominado el aprendizaje de ${title}` };
  return { title: 'Masha’Allah! Champion!', subtitle: `You mastered learning ${title}` };
}

// --- Sunnah Localizations ---
export function getHadithActionBtnLabel(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'تدبر وتعلّم',
    en: 'Learn',
    fr: 'Découvrir',
    de: 'Lernen',
    es: 'Aprender',
    ru: 'Изучить',
    ur: 'سیکھیں',
    id: 'Pelajari',
    bn: 'শিখুন',
    tr: 'Öğren',
  };
  return map[lang] || map.en;
}

export function getHadithHabitsIntro(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'طبق هذه السنن المباركة اليوم واكسب النجوم والجواهر!',
    en: 'Practice these blessed sunnah habits today to earn rewards!',
    fr: 'Applique ces nobles traditions aujourd’hui pour gagner des récompenses !',
    de: 'Wende diese edlen Sunnah-Gewohnheiten heute an, um Sterne zu sammeln!',
    es: '¡Aplica estas nobles tradiciones hoy para ganar estrellas y gemas!',
    ru: 'Следуйте благословенным суннам сегодня и получайте звёзды и кристаллы!',
    ur: 'آج ان مبارک سنتوں پر عمل کریں اور ستارے اور ہیرے حاصل کریں!',
    id: 'Amalkan sunnah yang penuh berkah ini hari ini dan dapatkan bintang serta permata!',
    bn: 'আজই এই বরকতময় সুন্নাহগুলো পালন করুন এবং তারা ও রত্ন অর্জন করুন!',
    tr: 'Bu mübarek sünnetleri bugün uygula, yıldız ve elmaslar kazan!',
  };
  return map[lang] || map.en;
}

export function getHadithMiniStoryTitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'قصة مصورة عن الحديث',
    en: 'Illustrated Mini-Story',
    fr: 'Mini-histoire illustrée',
    de: 'Illustrierte Kurzgeschichte',
    es: 'Mini-historia ilustrada',
    ru: 'Иллюстрированная история',
    ur: 'حدیث کی تصویری کہانی',
    id: 'Cerita Bergambar Hadis',
    bn: 'চিত্রিত শিক্ষণীয় গল্প',
    tr: 'Resimli Hadis Hikayesi',
  };
  return map[lang] || map.en;
}

export function getHadithCelebrationSubtitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'أحسنت اختيار السلوك النبوي الشريف!',
    en: 'Well done choosing the noble Sunnah way!',
    fr: 'Bravo ! Tu as choisi la noble voie prophétique !',
    de: 'Gut gemacht! Du hast den edlen prophetischen Weg gewählt!',
    es: '¡Bien hecho! ¡Elegiste el noble camino de la Sunnah!',
    ru: 'Отлично! Вы выбрали благородный путь Сунны!',
    ur: 'شاباش! آپ نے پیاری سنت کا مبارک راستہ چنا!',
    id: 'Bagus sekali! Kamu telah memilih jalan sunnah yang mulia!',
    bn: 'সাবাশ! তুমি প্রিয় নবীর আদর্শ ও সুন্নাহর পথ বেছে নিয়েছো!',
    tr: 'Tebrikler! Nebevî sünnet yolunu en güzel şekilde seçtin!',
  };
  return map[lang] || map.en;
}

// --- Manners Localizations ---
export function getMannersJournalBannerTitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'دفتر شكر الله والامتنان 🌸',
    en: 'My Gratitude Journal 🌸',
    fr: 'Mon Carnet de Gratitude envers Allah 🌸',
    de: 'Mein Dankbarkeitstagebuch für Allah 🌸',
    es: 'Mi Diario de Gratitud a Al-lah 🌸',
    ru: 'Дневник благодарности Аллаху 🌸',
    ur: 'اللہ کے شکر اور تشکر کی ڈائری 🌸',
    id: 'Buku Syukur dan Rasa Terima Kasihku 🌸',
    bn: 'আল্লাহর প্রতি কৃতজ্ঞতার ডায়েরি 🌸',
    tr: 'Allah’a Şükür Günlüğüm 🌸',
  };
  return map[lang] || map.en;
}

export function getMannersJournalBannerSub(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'سجّل نعمة تشكر الله عليها اليوم واكسب نجوماً!',
    en: 'Thank Allah for a blessing today & earn stars!',
    fr: 'Remercie Allah pour un bienfait aujourd’hui et gagne des étoiles !',
    de: 'Danke Allah heute für einen Segen & verdiene Sterne!',
    es: '¡Agradece a Al-lah por una bendición hoy y gana estrellas!',
    ru: 'Поблагодарите Аллаха за милость сегодня и получите звёзды!',
    ur: 'آج کسی نعمت پر اللہ کا شکر ادا کریں اور ستارے حاصل کریں!',
    id: 'Ucapkan syukur atas nikmat Allah hari ini dan dapatkan bintang!',
    bn: 'আজ আল্লাহর একটি নিয়ামতের শুকরিয়া আদায় করো এবং তারা অর্জন করো!',
    tr: 'Bugün bir nimet için Allah’a şükret ve yıldız kazan!',
  };
  return map[lang] || map.en;
}

export function getMannersBuildingsHeading(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'معالم الأخلاق في المدينة',
    en: 'Buildings of Manners',
    fr: 'Édifices des nobles manières',
    de: 'Stätten der guten Manieren',
    es: 'Edificios de los buenos modales',
    ru: 'Здания благородных нравов',
    ur: 'اخلاق کے خوبصورت مراکز',
    id: 'Bangunan Akhlak Terpuji',
    bn: 'উত্তম চরিত্রের ভবনসমূহ',
    tr: 'Güzel Ahlak Konakları',
  };
  return map[lang] || map.en;
}

export function getMannersLandmarksCountBadge(lang: Language): string {
  const map: Record<Language, string> = {
    ar: '٥٠ مَعلماً وخُلقاً حسناً',
    en: '50 Moral Landmarks',
    fr: '50 monuments moraux',
    de: '50 moralische Stätten',
    es: '50 monumentos morales',
    ru: '50 нравственных мест',
    ur: '۵۰ اخلاقی مقامات',
    id: '50 Tempat Akhlak Mulia',
    bn: '৫০টি চারিত্রিক নিদর্শন',
    tr: '50 Ahlaki Mekan',
  };
  return map[lang] || map.en;
}

export function getMannersProofType(type: 'ayah' | 'hadith', lang: Language): string {
  if (type === 'ayah') {
    const map: Record<Language, string> = {
      ar: 'من القرآن الكريم',
      en: 'From the Quran',
      fr: 'Du Saint Coran',
      de: 'Aus dem Heiligen Koran',
      es: 'Del Sagrado Corán',
      ru: 'Из Священного Корана',
      ur: 'قرآن مجید سے',
      id: 'Dari Al-Quran',
      bn: 'পবিত্র কুরআন থেকে',
      tr: 'Kur’an-ı Kerim’den',
    };
    return map[lang] || map.en;
  } else {
    const map: Record<Language, string> = {
      ar: 'من الحديث الشريف',
      en: 'From the Hadith',
      fr: 'Du noble Hadith',
      de: 'Aus dem edlen Hadith',
      es: 'Del noble Hadiz',
      ru: 'Из благородного хадиса',
      ur: 'حدیث شریف سے',
      id: 'Dari Hadis Nabi',
      bn: 'হাদীস শরীফ থেকে',
      tr: 'Hadis-i Şerif’ten',
    };
    return map[lang] || map.en;
  }
}

export function getMannersPledgeText(hasPledged: boolean, lang: Language): string {
  if (hasPledged) {
    const map: Record<Language, string> = {
      ar: 'تم قطع العهد بنجاح!',
      en: 'Pledge Confirmed!',
      fr: 'Engagement confirmé !',
      de: 'Gelöbnis bestätigt!',
      es: '¡Compromiso confirmado!',
      ru: 'Обещание дано!',
      ur: 'عہد کامیابی سے مکمل ہوا!',
      id: 'Janji Berhasil Diikrarkan!',
      bn: 'অঙ্গীকার সফলভাবে গৃহীত হয়েছে!',
      tr: 'Söz Başarıyla Verildi!',
    };
    return map[lang] || map.en;
  } else {
    const map: Record<Language, string> = {
      ar: 'أتعهد وألتزم بهذا الخُلق',
      en: 'I take this pledge',
      fr: 'Je prends cet engagement',
      de: 'Ich nehme dieses Gelöbnis an',
      es: 'Asumo este compromiso',
      ru: 'Я обещаю следовать этому нраву',
      ur: 'میں اس اخلاق پر عمل کا عہد کرتا ہوں',
      id: 'Saya berjanji menjaga akhlak ini',
      bn: 'আমি এই উত্তম চরিত্র অনুসরণের অঙ্গীকার করছি',
      tr: 'Bu ahlaka bağlı kalacağıma söz veriyorum',
    };
    return map[lang] || map.en;
  }
}

export function getMannersCelebrationSubtitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'بارك الله فيك يا صاحب الخلق الرفيع!',
    en: 'Masha’Allah for your noble character!',
    fr: 'Qu’Allah te bénisse pour tes nobles manières !',
    de: 'Möge Allah dich für deinen edlen Charakter segnen!',
    es: '¡Que Al-lah te bendiga por tu noble carácter!',
    ru: 'Да благословит тебя Аллах за твои прекрасные нравы!',
    ur: 'اللہ آپ کو بہترین اخلاق پر برکت عطا فرمائے!',
    id: 'Masya Allah atas akhlak muliamu!',
    bn: 'মাশাআল্লাহ! তোমার উত্তম ও সুন্দর চরিত্রের জন্য শুভকামনা!',
    tr: 'Allah seni bu güzel ve üstün ahlakınla mübarek kılsın!',
  };
  return map[lang] || map.en;
}

// --- Quran Localizations ---
export function getQuranSaveBtnLabel(isDownloaded: boolean, lang: Language): string {
  if (isDownloaded) {
    const map: Record<Language, string> = {
      ar: 'محفوظة',
      en: 'Saved',
      fr: 'Enregistrée',
      de: 'Gespeichert',
      es: 'Guardada',
      ru: 'Сохранено',
      ur: 'محفوظ',
      id: 'Tersimpan',
      bn: 'সংরক্ষিত',
      tr: 'Kaydedildi',
    };
    return map[lang] || map.en;
  } else {
    const map: Record<Language, string> = {
      ar: 'تنزيل',
      en: 'Save',
      fr: 'Télécharger',
      de: 'Laden',
      es: 'Descargar',
      ru: 'Скачать',
      ur: 'ڈاؤنلوڈ',
      id: 'Unduh',
      bn: 'ডাউনলোড',
      tr: 'İndir',
    };
    return map[lang] || map.en;
  }
}

export function getQuranStoryShowcaseTitle(lang: Language): string {
  const map: Record<Language, string> = {
    ar: 'قصة السورة وعبرها المباركة:',
    en: 'Surah Story & Wisdom:',
    fr: 'Histoire et sagesse de la sourate :',
    de: 'Geschichte und Weisheit der Sure:',
    es: 'Historia y sabiduría de la sura:',
    ru: 'История суры и её мудрость:',
    ur: 'سورت کا واقعہ اور مبارک حکمت:',
    id: 'Kisah Surah & Hikmah Berkahnya:',
    bn: 'সূরার কাহিনী ও বরকতময় শিক্ষা:',
    tr: 'Surenin Hikayesi ve Hikmetleri:',
  };
  return map[lang] || map.en;
}

export function getQuranGoldenLessonTag(lang: Language): string {
  const map: Record<Language, string> = {
    ar: '🌱 العبرة الذهبية:',
    en: '🌱 Core Lesson:',
    fr: '🌱 Leçon clé :',
    de: '🌱 Wichtigste Lehre:',
    es: '🌱 Lección clave:',
    ru: '🌱 Главный урок:',
    ur: '🌱 سنہری سبق:',
    id: '🌱 Pelajaran Utama:',
    bn: '🌱 সোনালী শিক্ষা:',
    tr: '🌱 Altın Öğüt:',
  };
  return map[lang] || map.en;
}

