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

const PROPHET_NAMES_LOCALIZED: Record<string, Record<Language, LocalizedProphetMeta>> = {
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
const ADAM_SCENES_LOCALIZED: Record<Language, { title: string; narration: string; symbolDescription: string }[]> = {
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

  // English fallback or European translations
  const baseName = prophet.nameEn;
  const honorific =
    lang === 'fr'
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
  if (lang === 'ar') {
    return `قصة نبي الله ${meta.name} ${meta.honorific}`;
  }
  if (lang === 'fr') {
    return `Histoire du Prophète ${meta.name} (${meta.honorific})`;
  }
  if (lang === 'de') {
    return `Geschichte des Propheten ${meta.name} (${meta.honorific})`;
  }
  if (lang === 'es') {
    return `Historia del Profeta ${meta.name} (${meta.honorific})`;
  }
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

  return {
    title: hadith.titleEn,
    narrator: hadith.narratorEn,
    explanation: hadith.explanationEn,
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

  // Curated French, German, Spanish names for the 6 core buildings
  const buildingLocalizations: Record<string, Record<'fr' | 'de' | 'es', { name: string; subtitle: string; weeklyPledge: string }>> = {
    'honesty-hall': {
      fr: {
        name: 'Palais de la Vérité et de la Confiance',
        subtitle: 'Le croyant ne ment jamais et préserve les dépôts avec fidélité',
        weeklyPledge: 'Je m’engage à toujours dire la vérité avec douceur et à honorer la confiance de tous.',
      },
      de: {
        name: 'Halle der Wahrheit & Zuverlässigkeit',
        subtitle: 'Ein Gläubiger lügt nicht und hütet das Anvertraute stets treu',
        weeklyPledge: 'Ich verspreche, in jeder Situation die Wahrheit zu sagen und ehrlich zu sein.',
      },
      es: {
        name: 'Palacio de la Verdad y la Confianza',
        subtitle: 'Un creyente nunca miente y cuida lo encomendado con devoción',
        weeklyPledge: 'Prometo decir siempre la verdad y nunca traicionar la confianza de los demás.',
      },
    },
    'parents-kindness': {
      fr: {
        name: 'Jardin de la Piété envers les Parents',
        subtitle: 'Le Paradis est sous les pieds des mères et la satisfaction d’Allah est liée aux parents',
        weeklyPledge: 'Je m’engage à écouter mes parents avec un sourire et à les aider chaque jour.',
      },
      de: {
        name: 'Garten der Güte zu den Eltern',
        subtitle: 'Das Paradies liegt zu Füßen der Mütter und Allahs Wohlgefallen bei den Eltern',
        weeklyPledge: 'Ich verspreche, meinen Eltern mit einem Lächeln zu gehorchen und ihnen täglich zu helfen.',
      },
      es: {
        name: 'Jardín de la Bondad hacia los Padres',
        subtitle: 'El Paraíso está bajo los pies de las madres y la complacencia de Al-lah con los padres',
        weeklyPledge: 'Prometo escuchar a mis padres con cariño y ayudarlos alegremente cada día.',
      },
    },
    'sharing-house': {
      fr: {
        name: 'Maison du Partage et de la Générosité',
        subtitle: 'La main qui donne est meilleure que celle qui reçoit',
        weeklyPledge: 'Je m’engage à partager mes jouets et mes joies avec mes frères et amis.',
      },
      de: {
        name: 'Haus des Teilens & der Großzügigkeit',
        subtitle: 'Die gebende Hand ist besser als die nehmende Hand',
        weeklyPledge: 'Ich verspreche, meine Freude und meine Dinge gerne mit anderen zu teilen.',
      },
      es: {
        name: 'Casa de la Generosidad y el Compartir',
        subtitle: 'La mano que da es mejor y más amada que la mano que recibe',
        weeklyPledge: 'Prometo compartir mis juguetes y mi alegría con mis hermanos y amigos.',
      },
    },
    'cleanliness-park': {
      fr: {
        name: 'Parc de la Pureté et de la Propreté',
        subtitle: 'La propreté est la moitié de la foi',
        weeklyPledge: 'Je m’engage à garder mes vêtements, ma chambre et la nature propres et ordonnés.',
      },
      de: {
        name: 'Park der Reinheit & Sauberkeit',
        subtitle: 'Die Reinheit ist die halbe Kraft des Glaubens',
        weeklyPledge: 'Ich verspreche, meine Umgebung, mein Zimmer und die Natur sauber zu halten.',
      },
      es: {
        name: 'Parque de la Pureza y la Limpieza',
        subtitle: 'La pureza y el aseo son la mitad de la fe',
        weeklyPledge: 'Prometo mantener mis prendas, mi habitación y la naturaleza limpias y ordenadas.',
      },
    },
    'patience-palace': {
      fr: {
        name: 'Château de la Patience et du Calme',
        subtitle: 'La patience est une lumière et une force pour le croyant',
        weeklyPledge: 'Je m’engage à respirer profondément et à rester calme quand je suis contrarié.',
      },
      de: {
        name: 'Schloss der Geduld & Ruhe',
        subtitle: 'Geduld ist ein strahlendes Licht und eine Festung für die Seele',
        weeklyPledge: 'Ich verspreche, ruhig zu bleiben und tief durchzuatmen, wenn es schwierig wird.',
      },
      es: {
        name: 'Castillo de la Paciencia y la Calma',
        subtitle: 'La paciencia es una luz brillante y una virtud suprema',
        weeklyPledge: 'Prometo respirar hondo y conservar la calma ante cualquier disgusto.',
      },
    },
    'respect-elders': {
      fr: {
        name: 'Cour du Respect et de l’Affection',
        subtitle: 'Celui qui ne respecte pas nos aînés et n’est pas doux envers les petits n’est pas des nôtres',
        weeklyPledge: 'Je m’engage à saluer les plus âgés avec respect et à protéger les plus petits.',
      },
      de: {
        name: 'Hof des Respekts & der Zuneigung',
        subtitle: 'Wer die Älteren nicht ehrt und zu den Jüngeren nicht barmherzig ist, gehört nicht zu uns',
        weeklyPledge: 'Ich verspreche, älteren Menschen respektvoll zu begegnen und die Kleinen zu beschützen.',
      },
      es: {
        name: 'Patio del Respeto y el Cariño',
        subtitle: 'Quien no respeta a nuestros mayores ni muestra ternura a los pequeños no es de los nuestros',
        weeklyPledge: 'Prometo saludar a los mayores con reverencia y cuidar con ternura a los más pequeños.',
      },
    },
  };

  const localizedBuilding = (lang === 'fr' || lang === 'de' || lang === 'es')
    ? buildingLocalizations[building.id]?.[lang]
    : null;

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

  // Pillar Titles in French, German, Spanish
  const pillarTitles: Record<string, Record<'fr' | 'de' | 'es', { title: string; subtitle: string }>> = {
    shahada: {
      fr: { title: 'L’Attestation de Foi (Chahada)', subtitle: 'La clé du Paradis et le premier fondement de l’Islam' },
      de: { title: 'Das Glaubensbekenntnis (Schahada)', subtitle: 'Der Schlüssel zum Paradies und das Fundament des Islam' },
      es: { title: 'El Testimonio de Fe (Shahada)', subtitle: 'La llave del Paraíso y el pilar fundamental del Islam' },
    },
    salah: {
      fr: { title: 'La Prière Quotidienne (Salât)', subtitle: 'Le lien d’amour et de lumière avec Allah cinq fois par jour' },
      de: { title: 'Das tägliche Gebet (Salah)', subtitle: 'Die liebevolle Verbindung und das Licht zu Allah fünfmal am Tag' },
      es: { title: 'La Oración Diaria (Salat)', subtitle: 'La conexión de amor y luz con Al-lah cinco veces al día' },
    },
    zakat: {
      fr: { title: 'L’Aumône Purificatrice (Zakât)', subtitle: 'Partager avec amour pour aider les nécessiteux et bénir nos biens' },
      de: { title: 'Die Pflichtabgabe (Zakat)', subtitle: 'Mit Liebe teilen, um die Bedürftigen zu unterstützen' },
      es: { title: 'La Limosna Obligatoria (Zakat)', subtitle: 'Compartir con amor para apoyar a los necesitados y purificar los bienes' },
    },
    sawm: {
      fr: { title: 'Le Jeûne du Ramadan (Siyâm)', subtitle: 'Apprendre la patience, la gratitude et la maîtrise de soi' },
      de: { title: 'Das Fasten im Ramadan (Sawm)', subtitle: 'Geduld, Dankbarkeit und Beherrschung des Herzens lernen' },
      es: { title: 'El Ayuno de Ramadán (Sawm)', subtitle: 'Aprender la paciencia, la gratitud y la purificación del alma' },
    },
    hajj: {
      fr: { title: 'Le Pèlerinage à La Mecque (Hajj)', subtitle: 'Le grand voyage de la fraternité et de l’unité autour de la Kaaba' },
      de: { title: 'Die Pilgerfahrt (Hadsch)', subtitle: 'Die große Reise des Friedens und der Einheit rund um die Kaaba' },
      es: { title: 'La Peregrinación (Hajj)', subtitle: 'El gran viaje sagrado de fraternidad y unión alrededor de la Kaaba' },
    },
  };

  const localized = (lang === 'fr' || lang === 'de' || lang === 'es')
    ? pillarTitles[pillar.id]?.[lang]
    : null;

  return {
    title: localized ? localized.title : pillar.titleEn,
    subtitle: localized ? localized.subtitle : pillar.subtitleEn,
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
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-US';
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
