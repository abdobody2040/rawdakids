// Gamification data: Badges, Stickers, and Avatars

export interface Badge {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  iconName: string;
  color: string;
  requiredGems: number;
}

export interface Sticker {
  id: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  category: 'quran' | 'sunnah' | 'prophets' | 'manners';
  unlockedByDefault?: boolean;
}

export interface AvatarOption {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
  color: string;
  gemCost: number;
}

export const BADGES_DATA: Badge[] = [
  {
    id: 'badge-reciter',
    nameAr: 'القارئ الصغير',
    nameEn: 'Little Reciter',
    descAr: 'استمع لسورة ورتل آياتها المباركة',
    descEn: 'Listened to a surah and recited its blessed verses',
    iconName: 'book',
    color: '#059669',
    requiredGems: 10,
  },
  {
    id: 'badge-truthful',
    nameAr: 'الصديق الصادق',
    nameEn: 'Truthful Friend',
    descAr: 'أنجز موقف الصدق والأمانة في مدينة الأخلاق',
    descEn: 'Completed the Honesty & Trust scenario in Manners Town',
    iconName: 'shield-checkmark',
    color: '#059669',
    requiredGems: 15,
  },
  {
    id: 'badge-dutiful',
    nameAr: 'البار بوالديه',
    nameEn: 'Dutiful to Parents',
    descAr: 'أنجز موقف بر الوالدين وإسعادهما',
    descEn: 'Completed the Honoring Parents scenario',
    iconName: 'heart',
    color: '#E11D48',
    requiredGems: 15,
  },
  {
    id: 'badge-generous',
    nameAr: 'الكريم المعطاء',
    nameEn: 'Generous Heart',
    descAr: 'أنجز موقف الكرم والمشاركة مع الآخرين',
    descEn: 'Completed the Sharing & Generosity scenario',
    iconName: 'gift',
    color: '#D97706',
    requiredGems: 15,
  },
  {
    id: 'badge-clean',
    nameAr: 'المسلم النظيف',
    nameEn: 'Pure & Clean',
    descAr: 'أنجز موقف النظافة وإماطة الأذى',
    descEn: 'Completed the Cleanliness scenario',
    iconName: 'sparkles',
    color: '#0284C7',
    requiredGems: 15,
  },
  {
    id: 'badge-respect',
    nameAr: 'الموقر للكبير',
    nameEn: 'Respectful to Elders',
    descAr: 'أنجز موقف احترام الكبير والعطف على الصغير',
    descEn: 'Completed the Respect & Compassion scenario',
    iconName: 'people',
    color: '#8B5CF6',
    requiredGems: 20,
  },
  {
    id: 'badge-calm',
    nameAr: 'الحليم الهادئ',
    nameEn: 'Master of Calm',
    descAr: 'أنجز موقف كظم الغيظ وضبط النفس',
    descEn: 'Completed the Anger Control scenario',
    iconName: 'water',
    color: '#0D9488',
    requiredGems: 20,
  },
  {
    id: 'badge-neighbor',
    nameAr: 'الجار الصالح',
    nameEn: 'Good Neighbor',
    descAr: 'أنجز موقف الإحسان إلى الجار وحفظ راحته',
    descEn: 'Completed the Neighbor Kindness scenario',
    iconName: 'home',
    color: '#F59E0B',
    requiredGems: 20,
  },
  {
    id: 'badge-mercy',
    nameAr: 'الرحيم بالخلق',
    nameEn: 'Merciful to Creation',
    descAr: 'أنجز موقف الرفق بالحيوان والبيئة',
    descEn: 'Completed the Animal Compassion scenario',
    iconName: 'paw',
    color: '#10B981',
    requiredGems: 20,
  },
  {
    id: 'badge-speech',
    nameAr: 'الطيب اللسان',
    nameEn: 'Pure Speech Champion',
    descAr: 'أنجز موقف الكلمة الطيبة والتشجيع',
    descEn: 'Completed the Noble Speech scenario',
    iconName: 'chatbubbles',
    color: '#6366F1',
    requiredGems: 20,
  },
  {
    id: 'badge-grateful',
    nameAr: 'الشاكر الحامد',
    nameEn: 'Grateful Soul',
    descAr: 'أنجز موقف الشكر والحمد على النعم',
    descEn: 'Completed the Gratitude scenario',
    iconName: 'sunny',
    color: '#EC4899',
    requiredGems: 20,
  },
  {
    id: 'badge-explorer',
    nameAr: 'مستكشف القصص',
    nameEn: 'Story Explorer',
    descAr: 'أكمل قصة من قصص الأنبياء واجتاز الاختبار',
    descEn: 'Finished a Prophet story and passed its quiz',
    iconName: 'compass',
    color: '#6366F1',
    requiredGems: 20,
  },
  {
    id: 'badge-sunnah',
    nameAr: 'متبع السنة',
    nameEn: 'Sunnah Follower',
    descAr: 'طبق سنن المصطفى ﷺ وأذكاره اليومية',
    descEn: 'Practiced the daily Sunnah habits and adhkar',
    iconName: 'star',
    color: '#EC4899',
    requiredGems: 25,
  },
  {
    id: 'badge-dua',
    nameAr: 'بطل الأدعية',
    nameEn: 'Dua Champion',
    descAr: 'استمع إلى أدعية اليوم المباركة',
    descEn: 'Listened to daily prayers from the Dua Library',
    iconName: 'heart',
    color: '#0284C7',
    requiredGems: 30,
  },
];

export const STICKERS_DATA: Sticker[] = [
  { id: 'st-kaaba', nameAr: 'الكعبة المشرفة', nameEn: 'The Holy Kaaba', iconName: 'cube', category: 'quran', unlockedByDefault: true },
  { id: 'st-quran', nameAr: 'المصحف الشريف', nameEn: 'Holy Quran', iconName: 'book', category: 'quran', unlockedByDefault: true },
  { id: 'st-crescent', nameAr: 'هلال البركة', nameEn: 'Blessed Crescent', iconName: 'moon', category: 'sunnah', unlockedByDefault: true },
  { id: 'st-lantern', nameAr: 'فانوس النور', nameEn: 'Lantern of Light', iconName: 'flashlight', category: 'manners', unlockedByDefault: true },
  { id: 'st-ark', nameAr: 'سفينة نوح', nameEn: 'The Ark', iconName: 'boat', category: 'prophets' },
  { id: 'st-dates', nameAr: 'تمور المدينة', nameEn: 'Sweet Dates', iconName: 'leaf', category: 'sunnah' },
  { id: 'st-camel', nameAr: 'جمل القافلة', nameEn: 'Caravan Camel', iconName: 'paw', category: 'prophets' },
  { id: 'st-star', nameAr: 'نجمة التفوق', nameEn: 'Brilliant Star', iconName: 'star', category: 'manners' },
  // Animals in the Quran Stickers
  { id: 'st-isa-bird', nameAr: 'طير عيسى بإذن الله', nameEn: 'Isa’s Bird of Clay', iconName: 'airplane', category: 'prophets' },
  { id: 'st-musa-staff', nameAr: 'عصا موسى الشجاعة', nameEn: 'Staff of Musa', iconName: 'shield', category: 'prophets' },
  { id: 'st-ismail-ram', nameAr: 'كبش الفداء المبارك', nameEn: 'Ransom Ram of Ismail', iconName: 'heart', category: 'prophets' },
  { id: 'st-crow', nameAr: 'غراب ابني آدم الحكيم', nameEn: 'The Wise Crow', iconName: 'eye', category: 'prophets' },
  { id: 'st-ant', nameAr: 'نملة سليمان المنظمة', nameEn: 'Solomon’s Ant', iconName: 'leaf', category: 'quran' },
  { id: 'st-bee', nameAr: 'نحلة العسل المباركة', nameEn: 'The Honeybee', iconName: 'sparkles', category: 'quran' },
  { id: 'st-hoopoe', nameAr: 'هدهد سليمان الوفي', nameEn: 'The Faithful Hoopoe', iconName: 'navigate', category: 'prophets' },
  { id: 'st-elephant', nameAr: 'فيل عام الفيل', nameEn: 'The Kaaba Elephant', iconName: 'shield-checkmark', category: 'quran' },
  { id: 'st-whale', nameAr: 'حوت يونس المسبّح', nameEn: 'Yunus’s Whale', iconName: 'water', category: 'prophets' },
  { id: 'st-she-camel', nameAr: 'ناقة صالح المعجزة', nameEn: 'Salih’s She-Camel', iconName: 'sunny', category: 'prophets' },
  { id: 'st-spider', nameAr: 'عنكبوت الغار', nameEn: 'Cave Spider', iconName: 'globe', category: 'quran' },
  { id: 'st-kind-dog', nameAr: 'كلب أهل الكهف', nameEn: 'The Cave Dog', iconName: 'paw', category: 'quran' },
];

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'av-boy1', nameAr: 'البطل', nameEn: 'The Champion', emoji: '👦', color: '#0D9488', gemCost: 0 },
  { id: 'av-girl1', nameAr: 'اللطيفة', nameEn: 'The Gentle', emoji: '👧', color: '#EC4899', gemCost: 0 },
  { id: 'av-boy2', nameAr: 'الذكي', nameEn: 'The Brilliant', emoji: '🧒', color: '#3B82F6', gemCost: 15 },
  { id: 'av-girl2', nameAr: 'المبدعة', nameEn: 'The Creative', emoji: '🧕', color: '#8B5CF6', gemCost: 20 },
  { id: 'av-lantern', nameAr: 'المحبوب', nameEn: 'The Beloved', emoji: '🏮', color: '#F59E0B', gemCost: 0 },
  { id: 'av-cat', nameAr: 'القطة مشمش', nameEn: 'Mishmish the Cat', emoji: '🐱', color: '#F97316', gemCost: 30 },
  { id: 'av-boy3', nameAr: 'الحافظ الصغير', nameEn: 'The Young Hafiz', emoji: '📖', color: '#059669', gemCost: 0 },
  { id: 'av-girl3', nameAr: 'الزهرة', nameEn: 'The Blossom', emoji: '🌸', color: '#F59E0B', gemCost: 0 },
  { id: 'av-boy4', nameAr: 'المستكشف', nameEn: 'The Explorer', emoji: '🧭', color: '#0284C7', gemCost: 20 },
  { id: 'av-girl4', nameAr: 'القارئة الذكية', nameEn: 'The Smart Reader', emoji: '📚', color: '#8B5CF6', gemCost: 20 },
  { id: 'av-horse', nameAr: 'المهر الأصيل', nameEn: 'The Noble Foal', emoji: '🐴', color: '#D97706', gemCost: 25 },
  { id: 'av-falcon', nameAr: 'الصقر الشجاع', nameEn: 'The Brave Falcon', emoji: '🦅', color: '#EA580C', gemCost: 35 },
];

