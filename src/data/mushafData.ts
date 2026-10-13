// Authentic Madinah Mushaf (مصحف المدينة النبوية - مجمع الملك فهد لطباعة المصحف الشريف)
// 604 Pages Catalog, Surah mapping, and Juz index

export interface MushafSurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  startPage: number;
  ayahCount: number;
  juzNumber: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface MushafJuzMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  startPage: number;
  endPage: number;
  startSurahName: string;
}

export interface MushafPageInfo {
  pageNumber: number;
  juzNumber: number;
  hizbNumber: number;
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  isRightPage: boolean; // Odd pages are on the right in open book, even on the left
  imageUri: string;
  backupImageUri: string;
}

export const TOTAL_MUSHAF_PAGES = 604;

// 114 Surahs with authentic start pages in the 604-page Madinah Mushaf
export const MUSHAF_SURAHS: MushafSurahMeta[] = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'The Opening', nameTransliteration: 'Al-Fatihah', startPage: 1, ayahCount: 7, juzNumber: 1, revelationType: 'Meccan' },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'The Cow', nameTransliteration: 'Al-Baqarah', startPage: 2, ayahCount: 286, juzNumber: 1, revelationType: 'Medinan' },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Family of Imran', nameTransliteration: 'Ali \'Imran', startPage: 50, ayahCount: 200, juzNumber: 3, revelationType: 'Medinan' },
  { number: 4, nameArabic: 'النساء', nameEnglish: 'The Women', nameTransliteration: 'An-Nisa', startPage: 77, ayahCount: 176, juzNumber: 4, revelationType: 'Medinan' },
  { number: 5, nameArabic: 'المائدة', nameEnglish: 'The Table Spread', nameTransliteration: 'Al-Ma\'idah', startPage: 106, ayahCount: 120, juzNumber: 6, revelationType: 'Medinan' },
  { number: 6, nameArabic: 'الأنعام', nameEnglish: 'The Cattle', nameTransliteration: 'Al-An\'am', startPage: 128, ayahCount: 165, juzNumber: 7, revelationType: 'Meccan' },
  { number: 7, nameArabic: 'الأعراف', nameEnglish: 'The Heights', nameTransliteration: 'Al-A\'raf', startPage: 151, ayahCount: 206, juzNumber: 8, revelationType: 'Meccan' },
  { number: 8, nameArabic: 'الأنفال', nameEnglish: 'The Spoils of War', nameTransliteration: 'Al-Anfal', startPage: 177, ayahCount: 75, juzNumber: 9, revelationType: 'Medinan' },
  { number: 9, nameArabic: 'التوبة', nameEnglish: 'The Repentance', nameTransliteration: 'At-Tawbah', startPage: 187, ayahCount: 129, juzNumber: 10, revelationType: 'Medinan' },
  { number: 10, nameArabic: 'يونس', nameEnglish: 'Jonah', nameTransliteration: 'Yunus', startPage: 208, ayahCount: 109, juzNumber: 11, revelationType: 'Meccan' },
  { number: 11, nameArabic: 'هود', nameEnglish: 'Hud', nameTransliteration: 'Hud', startPage: 221, ayahCount: 123, juzNumber: 11, revelationType: 'Meccan' },
  { number: 12, nameArabic: 'يوسف', nameEnglish: 'Joseph', nameTransliteration: 'Yusuf', startPage: 235, ayahCount: 111, juzNumber: 12, revelationType: 'Meccan' },
  { number: 13, nameArabic: 'الرعد', nameEnglish: 'The Thunder', nameTransliteration: 'Ar-Ra\'d', startPage: 249, ayahCount: 43, juzNumber: 13, revelationType: 'Medinan' },
  { number: 14, nameArabic: 'إبراهيم', nameEnglish: 'Abraham', nameTransliteration: 'Ibrahim', startPage: 255, ayahCount: 52, juzNumber: 13, revelationType: 'Meccan' },
  { number: 15, nameArabic: 'الحجر', nameEnglish: 'The Rocky Tract', nameTransliteration: 'Al-Hijr', startPage: 262, ayahCount: 99, juzNumber: 14, revelationType: 'Meccan' },
  { number: 16, nameArabic: 'النحل', nameEnglish: 'The Bee', nameTransliteration: 'An-Nahl', startPage: 267, ayahCount: 128, juzNumber: 14, revelationType: 'Meccan' },
  { number: 17, nameArabic: 'الإسراء', nameEnglish: 'The Night Journey', nameTransliteration: 'Al-Isra', startPage: 282, ayahCount: 111, juzNumber: 15, revelationType: 'Meccan' },
  { number: 18, nameArabic: 'الكهف', nameEnglish: 'The Cave', nameTransliteration: 'Al-Kahf', startPage: 293, ayahCount: 110, juzNumber: 15, revelationType: 'Meccan' },
  { number: 19, nameArabic: 'مريم', nameEnglish: 'Mary', nameTransliteration: 'Maryam', startPage: 305, ayahCount: 98, juzNumber: 16, revelationType: 'Meccan' },
  { number: 20, nameArabic: 'طه', nameEnglish: 'Ta-Ha', nameTransliteration: 'Ta-Ha', startPage: 312, ayahCount: 135, juzNumber: 16, revelationType: 'Meccan' },
  { number: 21, nameArabic: 'الأنبياء', nameEnglish: 'The Prophets', nameTransliteration: 'Al-Anbiya', startPage: 322, ayahCount: 112, juzNumber: 17, revelationType: 'Meccan' },
  { number: 22, nameArabic: 'الحج', nameEnglish: 'The Pilgrimage', nameTransliteration: 'Al-Hajj', startPage: 332, ayahCount: 78, juzNumber: 17, revelationType: 'Medinan' },
  { number: 23, nameArabic: 'المؤمنون', nameEnglish: 'The Believers', nameTransliteration: 'Al-Mu\'minun', startPage: 342, ayahCount: 118, juzNumber: 18, revelationType: 'Meccan' },
  { number: 24, nameArabic: 'النور', nameEnglish: 'The Light', nameTransliteration: 'An-Nur', startPage: 350, ayahCount: 64, juzNumber: 18, revelationType: 'Medinan' },
  { number: 25, nameArabic: 'الفرقان', nameEnglish: 'The Criterion', nameTransliteration: 'Al-Furqan', startPage: 359, ayahCount: 77, juzNumber: 18, revelationType: 'Meccan' },
  { number: 26, nameArabic: 'الشعراء', nameEnglish: 'The Poets', nameTransliteration: 'Ash-Shu\'ara', startPage: 367, ayahCount: 227, juzNumber: 19, revelationType: 'Meccan' },
  { number: 27, nameArabic: 'النمل', nameEnglish: 'The Ant', nameTransliteration: 'An-Naml', startPage: 377, ayahCount: 93, juzNumber: 19, revelationType: 'Meccan' },
  { number: 28, nameArabic: 'القصص', nameEnglish: 'The Stories', nameTransliteration: 'Al-Qasas', startPage: 385, ayahCount: 88, juzNumber: 20, revelationType: 'Meccan' },
  { number: 29, nameArabic: 'العنكبوت', nameEnglish: 'The Spider', nameTransliteration: 'Al-\'Ankabut', startPage: 396, ayahCount: 69, juzNumber: 20, revelationType: 'Meccan' },
  { number: 30, nameArabic: 'الروم', nameEnglish: 'The Romans', nameTransliteration: 'Ar-Rum', startPage: 404, ayahCount: 60, juzNumber: 21, revelationType: 'Meccan' },
  { number: 31, nameArabic: 'لقمان', nameEnglish: 'Luqman', nameTransliteration: 'Luqman', startPage: 411, ayahCount: 34, juzNumber: 21, revelationType: 'Meccan' },
  { number: 32, nameArabic: 'السجدة', nameEnglish: 'The Prostration', nameTransliteration: 'As-Sajdah', startPage: 415, ayahCount: 30, juzNumber: 21, revelationType: 'Meccan' },
  { number: 33, nameArabic: 'الأحزاب', nameEnglish: 'The Combined Forces', nameTransliteration: 'Al-Ahzab', startPage: 418, ayahCount: 73, juzNumber: 21, revelationType: 'Medinan' },
  { number: 34, nameArabic: 'سبأ', nameEnglish: 'Sheba', nameTransliteration: 'Saba', startPage: 428, ayahCount: 54, juzNumber: 22, revelationType: 'Meccan' },
  { number: 35, nameArabic: 'فاطر', nameEnglish: 'Originator', nameTransliteration: 'Fatir', startPage: 434, ayahCount: 45, juzNumber: 22, revelationType: 'Meccan' },
  { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', nameTransliteration: 'Ya-Sin', startPage: 440, ayahCount: 83, juzNumber: 22, revelationType: 'Meccan' },
  { number: 37, nameArabic: 'الصافات', nameEnglish: 'Those Who Set The Ranks', nameTransliteration: 'As-Saffat', startPage: 446, ayahCount: 182, juzNumber: 23, revelationType: 'Meccan' },
  { number: 38, nameArabic: 'ص', nameEnglish: 'Sad', nameTransliteration: 'Sad', startPage: 453, ayahCount: 88, juzNumber: 23, revelationType: 'Meccan' },
  { number: 39, nameArabic: 'الزمر', nameEnglish: 'The Groups', nameTransliteration: 'Az-Zumar', startPage: 458, ayahCount: 75, juzNumber: 23, revelationType: 'Meccan' },
  { number: 40, nameArabic: 'غافر', nameEnglish: 'The Forgiver', nameTransliteration: 'Ghafir', startPage: 467, ayahCount: 85, juzNumber: 24, revelationType: 'Meccan' },
  { number: 41, nameArabic: 'فصلت', nameEnglish: 'Distinguished', nameTransliteration: 'Fussilat', startPage: 477, ayahCount: 54, juzNumber: 24, revelationType: 'Meccan' },
  { number: 42, nameArabic: 'الشورى', nameEnglish: 'The Consultation', nameTransliteration: 'Ash-Shura', startPage: 483, ayahCount: 53, juzNumber: 25, revelationType: 'Meccan' },
  { number: 43, nameArabic: 'الزخرف', nameEnglish: 'The Gold Adornments', nameTransliteration: 'Az-Zukhruf', startPage: 489, ayahCount: 89, juzNumber: 25, revelationType: 'Meccan' },
  { number: 44, nameArabic: 'الدخان', nameEnglish: 'The Smoke', nameTransliteration: 'Ad-Dukhan', startPage: 496, ayahCount: 59, juzNumber: 25, revelationType: 'Meccan' },
  { number: 45, nameArabic: 'الجاثية', nameEnglish: 'The Kneeling', nameTransliteration: 'Al-Jathiyah', startPage: 499, ayahCount: 37, juzNumber: 25, revelationType: 'Meccan' },
  { number: 46, nameArabic: 'الأحقاف', nameEnglish: 'The Curved Sand-hills', nameTransliteration: 'Al-Ahqaf', startPage: 502, ayahCount: 35, juzNumber: 26, revelationType: 'Meccan' },
  { number: 47, nameArabic: 'محمد', nameEnglish: 'Muhammad', nameTransliteration: 'Muhammad', startPage: 507, ayahCount: 38, juzNumber: 26, revelationType: 'Medinan' },
  { number: 48, nameArabic: 'الفتح', nameEnglish: 'The Victory', nameTransliteration: 'Al-Fath', startPage: 511, ayahCount: 29, juzNumber: 26, revelationType: 'Medinan' },
  { number: 49, nameArabic: 'الحجرات', nameEnglish: 'The Rooms', nameTransliteration: 'Al-Hujurat', startPage: 515, ayahCount: 18, juzNumber: 26, revelationType: 'Medinan' },
  { number: 50, nameArabic: 'ق', nameEnglish: 'Qaf', nameTransliteration: 'Qaf', startPage: 518, ayahCount: 45, juzNumber: 26, revelationType: 'Meccan' },
  { number: 51, nameArabic: 'الذاريات', nameEnglish: 'The Winnowing Winds', nameTransliteration: 'Adh-Dhariyat', startPage: 520, ayahCount: 60, juzNumber: 26, revelationType: 'Meccan' },
  { number: 52, nameArabic: 'الطور', nameEnglish: 'The Mount', nameTransliteration: 'At-Tur', startPage: 523, ayahCount: 49, juzNumber: 27, revelationType: 'Meccan' },
  { number: 53, nameArabic: 'النجم', nameEnglish: 'The Star', nameTransliteration: 'An-Najm', startPage: 526, ayahCount: 62, juzNumber: 27, revelationType: 'Meccan' },
  { number: 54, nameArabic: 'القمر', nameEnglish: 'The Moon', nameTransliteration: 'Al-Qamar', startPage: 528, ayahCount: 55, juzNumber: 27, revelationType: 'Meccan' },
  { number: 55, nameArabic: 'الرحمن', nameEnglish: 'The Beneficent', nameTransliteration: 'Ar-Rahman', startPage: 531, ayahCount: 78, juzNumber: 27, revelationType: 'Medinan' },
  { number: 56, nameArabic: 'الواقعة', nameEnglish: 'The Inevitable', nameTransliteration: 'Al-Waqi\'ah', startPage: 534, ayahCount: 96, juzNumber: 27, revelationType: 'Meccan' },
  { number: 57, nameArabic: 'الحديد', nameEnglish: 'The Iron', nameTransliteration: 'Al-Hadid', startPage: 537, ayahCount: 29, juzNumber: 27, revelationType: 'Medinan' },
  { number: 58, nameArabic: 'المجادلة', nameEnglish: 'The Pleading Woman', nameTransliteration: 'Al-Mujadilah', startPage: 542, ayahCount: 22, juzNumber: 28, revelationType: 'Medinan' },
  { number: 59, nameArabic: 'الحشر', nameEnglish: 'The Exile', nameTransliteration: 'Al-Hashr', startPage: 545, ayahCount: 24, juzNumber: 28, revelationType: 'Medinan' },
  { number: 60, nameArabic: 'الممتحنة', nameEnglish: 'She That Is To Be Examined', nameTransliteration: 'Al-Mumtahanah', startPage: 549, ayahCount: 13, juzNumber: 28, revelationType: 'Medinan' },
  { number: 61, nameArabic: 'الصف', nameEnglish: 'The Ranks', nameTransliteration: 'As-Saff', startPage: 551, ayahCount: 14, juzNumber: 28, revelationType: 'Medinan' },
  { number: 62, nameArabic: 'الجمعة', nameEnglish: 'Friday', nameTransliteration: 'Al-Jumu\'ah', startPage: 553, ayahCount: 11, juzNumber: 28, revelationType: 'Medinan' },
  { number: 63, nameArabic: 'المنافقون', nameEnglish: 'The Hypocrites', nameTransliteration: 'Al-Munafiqun', startPage: 554, ayahCount: 11, juzNumber: 28, revelationType: 'Medinan' },
  { number: 64, nameArabic: 'التغابن', nameEnglish: 'Mutual Disillusion', nameTransliteration: 'At-Taghabun', startPage: 556, ayahCount: 18, juzNumber: 28, revelationType: 'Medinan' },
  { number: 65, nameArabic: 'الطلاق', nameEnglish: 'Divorce', nameTransliteration: 'At-Talaq', startPage: 558, ayahCount: 12, juzNumber: 28, revelationType: 'Medinan' },
  { number: 66, nameArabic: 'التحريم', nameEnglish: 'The Prohibition', nameTransliteration: 'At-Tahrim', startPage: 560, ayahCount: 12, juzNumber: 28, revelationType: 'Medinan' },
  { number: 67, nameArabic: 'الملك', nameEnglish: 'The Sovereignty', nameTransliteration: 'Al-Mulk', startPage: 562, ayahCount: 30, juzNumber: 29, revelationType: 'Meccan' },
  { number: 68, nameArabic: 'القلم', nameEnglish: 'The Pen', nameTransliteration: 'Al-Qalam', startPage: 564, ayahCount: 52, juzNumber: 29, revelationType: 'Meccan' },
  { number: 69, nameArabic: 'الحاقة', nameEnglish: 'The Inevitable Reality', nameTransliteration: 'Al-Haqqah', startPage: 566, ayahCount: 52, juzNumber: 29, revelationType: 'Meccan' },
  { number: 70, nameArabic: 'المعارج', nameEnglish: 'The Ascending Stairways', nameTransliteration: 'Al-Ma\'arij', startPage: 568, ayahCount: 44, juzNumber: 29, revelationType: 'Meccan' },
  { number: 71, nameArabic: 'نوح', nameEnglish: 'Noah', nameTransliteration: 'Nuh', startPage: 570, ayahCount: 28, juzNumber: 29, revelationType: 'Meccan' },
  { number: 72, nameArabic: 'الجن', nameEnglish: 'The Jinn', nameTransliteration: 'Al-Jinn', startPage: 572, ayahCount: 28, juzNumber: 29, revelationType: 'Meccan' },
  { number: 73, nameArabic: 'المزمل', nameEnglish: 'The Enshrouded One', nameTransliteration: 'Al-Muzzammil', startPage: 574, ayahCount: 20, juzNumber: 29, revelationType: 'Meccan' },
  { number: 74, nameArabic: 'المدثر', nameEnglish: 'The Cloaked One', nameTransliteration: 'Al-Muddaththir', startPage: 575, ayahCount: 56, juzNumber: 29, revelationType: 'Meccan' },
  { number: 75, nameArabic: 'القيامة', nameEnglish: 'The Resurrection', nameTransliteration: 'Al-Qiyamah', startPage: 577, ayahCount: 40, juzNumber: 29, revelationType: 'Meccan' },
  { number: 76, nameArabic: 'الإنسان', nameEnglish: 'Man', nameTransliteration: 'Al-Insan', startPage: 578, ayahCount: 31, juzNumber: 29, revelationType: 'Medinan' },
  { number: 77, nameArabic: 'المرسلات', nameEnglish: 'The Emissaries', nameTransliteration: 'Al-Mursalat', startPage: 580, ayahCount: 50, juzNumber: 29, revelationType: 'Meccan' },
  { number: 78, nameArabic: 'النبأ', nameEnglish: 'The Tidings', nameTransliteration: 'An-Naba', startPage: 582, ayahCount: 40, juzNumber: 30, revelationType: 'Meccan' },
  { number: 79, nameArabic: 'النازعات', nameEnglish: 'Those Who Drag Forth', nameTransliteration: 'An-Nazi\'at', startPage: 583, ayahCount: 46, juzNumber: 30, revelationType: 'Meccan' },
  { number: 80, nameArabic: 'عبس', nameEnglish: 'He Frowned', nameTransliteration: '\'Abasa', startPage: 585, ayahCount: 42, juzNumber: 30, revelationType: 'Meccan' },
  { number: 81, nameArabic: 'التكوير', nameEnglish: 'The Overthrowing', nameTransliteration: 'At-Takwir', startPage: 586, ayahCount: 29, juzNumber: 30, revelationType: 'Meccan' },
  { number: 82, nameArabic: 'الانفطار', nameEnglish: 'The Cleaving', nameTransliteration: 'Al-Infitar', startPage: 587, ayahCount: 19, juzNumber: 30, revelationType: 'Meccan' },
  { number: 83, nameArabic: 'المطففين', nameEnglish: 'The Defrauding', nameTransliteration: 'Al-Mutaffifin', startPage: 587, ayahCount: 36, juzNumber: 30, revelationType: 'Meccan' },
  { number: 84, nameArabic: 'الانشقاق', nameEnglish: 'The Splitting Asunder', nameTransliteration: 'Al-Inshiqaq', startPage: 589, ayahCount: 25, juzNumber: 30, revelationType: 'Meccan' },
  { number: 85, nameArabic: 'البروج', nameEnglish: 'The Constellations', nameTransliteration: 'Al-Buruj', startPage: 590, ayahCount: 22, juzNumber: 30, revelationType: 'Meccan' },
  { number: 86, nameArabic: 'الطارق', nameEnglish: 'The Nightcomer', nameTransliteration: 'At-Tariq', startPage: 591, ayahCount: 17, juzNumber: 30, revelationType: 'Meccan' },
  { number: 87, nameArabic: 'الأعلى', nameEnglish: 'The Most High', nameTransliteration: 'Al-A\'la', startPage: 591, ayahCount: 19, juzNumber: 30, revelationType: 'Meccan' },
  { number: 88, nameArabic: 'الغاشية', nameEnglish: 'The Overwhelming', nameTransliteration: 'Al-Ghashiyah', startPage: 592, ayahCount: 26, juzNumber: 30, revelationType: 'Meccan' },
  { number: 89, nameArabic: 'الفجر', nameEnglish: 'The Dawn', nameTransliteration: 'Al-Fajr', startPage: 593, ayahCount: 30, juzNumber: 30, revelationType: 'Meccan' },
  { number: 90, nameArabic: 'البلد', nameEnglish: 'The City', nameTransliteration: 'Al-Balad', startPage: 594, ayahCount: 20, juzNumber: 30, revelationType: 'Meccan' },
  { number: 91, nameArabic: 'الشمس', nameEnglish: 'The Sun', nameTransliteration: 'Ash-Shams', startPage: 595, ayahCount: 15, juzNumber: 30, revelationType: 'Meccan' },
  { number: 92, nameArabic: 'الليل', nameEnglish: 'The Night', nameTransliteration: 'Al-Layl', startPage: 595, ayahCount: 21, juzNumber: 30, revelationType: 'Meccan' },
  { number: 93, nameArabic: 'الضحى', nameEnglish: 'The Morning Brightness', nameTransliteration: 'Ad-Duha', startPage: 596, ayahCount: 11, juzNumber: 30, revelationType: 'Meccan' },
  { number: 94, nameArabic: 'الشرح', nameEnglish: 'The Relief', nameTransliteration: 'Ash-Sharh', startPage: 596, ayahCount: 8, juzNumber: 30, revelationType: 'Meccan' },
  { number: 95, nameArabic: 'التين', nameEnglish: 'The Fig', nameTransliteration: 'At-Tin', startPage: 597, ayahCount: 8, juzNumber: 30, revelationType: 'Meccan' },
  { number: 96, nameArabic: 'العلق', nameEnglish: 'The Clot', nameTransliteration: 'Al-\'Alaq', startPage: 597, ayahCount: 19, juzNumber: 30, revelationType: 'Meccan' },
  { number: 97, nameArabic: 'القدر', nameEnglish: 'The Power', nameTransliteration: 'Al-Qadr', startPage: 598, ayahCount: 5, juzNumber: 30, revelationType: 'Meccan' },
  { number: 98, nameArabic: 'البينة', nameEnglish: 'The Clear Proof', nameTransliteration: 'Al-Bayyinah', startPage: 598, ayahCount: 8, juzNumber: 30, revelationType: 'Medinan' },
  { number: 99, nameArabic: 'الزلزلة', nameEnglish: 'The Earthquake', nameTransliteration: 'Az-Zalzalah', startPage: 599, ayahCount: 8, juzNumber: 30, revelationType: 'Medinan' },
  { number: 100, nameArabic: 'العاديات', nameEnglish: 'The Courser', nameTransliteration: 'Al-\'Adiyat', startPage: 599, ayahCount: 11, juzNumber: 30, revelationType: 'Meccan' },
  { number: 101, nameArabic: 'القارعة', nameEnglish: 'The Calamity', nameTransliteration: 'Al-Qari\'ah', startPage: 600, ayahCount: 11, juzNumber: 30, revelationType: 'Meccan' },
  { number: 102, nameArabic: 'التكاثر', nameEnglish: 'The Rivalry In World Increase', nameTransliteration: 'At-Takathur', startPage: 600, ayahCount: 8, juzNumber: 30, revelationType: 'Meccan' },
  { number: 103, nameArabic: 'العصر', nameEnglish: 'The Declining Day', nameTransliteration: 'Al-\'Asr', startPage: 601, ayahCount: 3, juzNumber: 30, revelationType: 'Meccan' },
  { number: 104, nameArabic: 'الهمزة', nameEnglish: 'The Traducer', nameTransliteration: 'Al-Humazah', startPage: 601, ayahCount: 9, juzNumber: 30, revelationType: 'Meccan' },
  { number: 105, nameArabic: 'الفيل', nameEnglish: 'The Elephant', nameTransliteration: 'Al-Fil', startPage: 601, ayahCount: 5, juzNumber: 30, revelationType: 'Meccan' },
  { number: 106, nameArabic: 'قريش', nameEnglish: 'Quraysh', nameTransliteration: 'Quraysh', startPage: 602, ayahCount: 4, juzNumber: 30, revelationType: 'Meccan' },
  { number: 107, nameArabic: 'الماعون', nameEnglish: 'The Small Kindness', nameTransliteration: 'Al-Ma\'un', startPage: 602, ayahCount: 7, juzNumber: 30, revelationType: 'Meccan' },
  { number: 108, nameArabic: 'الكوثر', nameEnglish: 'The Abundance', nameTransliteration: 'Al-Kawthar', startPage: 602, ayahCount: 3, juzNumber: 30, revelationType: 'Meccan' },
  { number: 109, nameArabic: 'الكافرون', nameEnglish: 'The Disbelievers', nameTransliteration: 'Al-Kafirun', startPage: 603, ayahCount: 6, juzNumber: 30, revelationType: 'Meccan' },
  { number: 110, nameArabic: 'النصر', nameEnglish: 'The Divine Support', nameTransliteration: 'An-Nasr', startPage: 603, ayahCount: 3, juzNumber: 30, revelationType: 'Medinan' },
  { number: 111, nameArabic: 'المسد', nameEnglish: 'The Palm Fiber', nameTransliteration: 'Al-Masad', startPage: 603, ayahCount: 5, juzNumber: 30, revelationType: 'Meccan' },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'The Sincerity', nameTransliteration: 'Al-Ikhlas', startPage: 604, ayahCount: 4, juzNumber: 30, revelationType: 'Meccan' },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'The Daybreak', nameTransliteration: 'Al-Falaq', startPage: 604, ayahCount: 5, juzNumber: 30, revelationType: 'Meccan' },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'Mankind', nameTransliteration: 'An-Nas', startPage: 604, ayahCount: 6, juzNumber: 30, revelationType: 'Meccan' },
];

// All 30 Juz with authentic page boundaries
export const MUSHAF_AJZAA: MushafJuzMeta[] = [
  { number: 1, nameArabic: 'الجزء الأول (الم)', nameEnglish: 'Juz 1', startPage: 1, endPage: 21, startSurahName: 'الفاتحة' },
  { number: 2, nameArabic: 'الجزء الثاني (سيقول)', nameEnglish: 'Juz 2', startPage: 22, endPage: 41, startSurahName: 'البقرة' },
  { number: 3, nameArabic: 'الجزء الثالث (تلك الرسل)', nameEnglish: 'Juz 3', startPage: 42, endPage: 61, startSurahName: 'البقرة' },
  { number: 4, nameArabic: 'الجزء الرابع (لن تنالوا)', nameEnglish: 'Juz 4', startPage: 62, endPage: 81, startSurahName: 'آل عمران' },
  { number: 5, nameArabic: 'الجزء الخامس (والمحصنات)', nameEnglish: 'Juz 5', startPage: 82, endPage: 101, startSurahName: 'النساء' },
  { number: 6, nameArabic: 'الجزء السادس (لا يحب الله)', nameEnglish: 'Juz 6', startPage: 102, endPage: 121, startSurahName: 'النساء' },
  { number: 7, nameArabic: 'الجزء السابع (وإذا سمعوا)', nameEnglish: 'Juz 7', startPage: 122, endPage: 141, startSurahName: 'المائدة' },
  { number: 8, nameArabic: 'الجزء الثامن (ولو أننا)', nameEnglish: 'Juz 8', startPage: 142, endPage: 161, startSurahName: 'الأنعام' },
  { number: 9, nameArabic: 'الجزء التاسع (قال الملأ)', nameEnglish: 'Juz 9', startPage: 162, endPage: 181, startSurahName: 'الأعراف' },
  { number: 10, nameArabic: 'الجزء العاشر (واعلموا)', nameEnglish: 'Juz 10', startPage: 182, endPage: 201, startSurahName: 'الأنفال' },
  { number: 11, nameArabic: 'الجزء الحادي عشر (يعتذرون)', nameEnglish: 'Juz 11', startPage: 202, endPage: 221, startSurahName: 'التوبة' },
  { number: 12, nameArabic: 'الجزء الثاني عشر (وما من دابة)', nameEnglish: 'Juz 12', startPage: 222, endPage: 241, startSurahName: 'هود' },
  { number: 13, nameArabic: 'الجزء الثالث عشر (وما أبرئ)', nameEnglish: 'Juz 13', startPage: 242, endPage: 261, startSurahName: 'يوسف' },
  { number: 14, nameArabic: 'الجزء الرابع عشر (ربما)', nameEnglish: 'Juz 14', startPage: 262, endPage: 281, startSurahName: 'الحجر' },
  { number: 15, nameArabic: 'الجزء الخامس عشر (سبحان)', nameEnglish: 'Juz 15', startPage: 282, endPage: 301, startSurahName: 'الإسراء' },
  { number: 16, nameArabic: 'الجزء السادس عشر (قال ألم)', nameEnglish: 'Juz 16', startPage: 302, endPage: 321, startSurahName: 'الكهف' },
  { number: 17, nameArabic: 'الجزء السابع عشر (اقترب)', nameEnglish: 'Juz 17', startPage: 322, endPage: 341, startSurahName: 'الأنبياء' },
  { number: 18, nameArabic: 'الجزء الثامن عشر (قد أفلح)', nameEnglish: 'Juz 18', startPage: 342, endPage: 361, startSurahName: 'المؤمنون' },
  { number: 19, nameArabic: 'الجزء التاسع عشر (وقال الذين)', nameEnglish: 'Juz 19', startPage: 362, endPage: 381, startSurahName: 'الفرقان' },
  { number: 20, nameArabic: 'الجزء العشرون (فما كان)', nameEnglish: 'Juz 20', startPage: 382, endPage: 401, startSurahName: 'النمل' },
  { number: 21, nameArabic: 'الجزء الحادي والعشرون (ولا تجادلوا)', nameEnglish: 'Juz 21', startPage: 402, endPage: 421, startSurahName: 'العنكبوت' },
  { number: 22, nameArabic: 'الجزء الثاني والعشرون (ومن يقنت)', nameEnglish: 'Juz 22', startPage: 422, endPage: 441, startSurahName: 'الأحزاب' },
  { number: 23, nameArabic: 'الجزء الثالث والعشرون (وما أنزلنا)', nameEnglish: 'Juz 23', startPage: 442, endPage: 461, startSurahName: 'يس' },
  { number: 24, nameArabic: 'الجزء الرابع والعشرون (فمن أظلم)', nameEnglish: 'Juz 24', startPage: 462, endPage: 481, startSurahName: 'الزمر' },
  { number: 25, nameArabic: 'الجزء الخامس والعشرون (إليه يرد)', nameEnglish: 'Juz 25', startPage: 482, endPage: 501, startSurahName: 'فصلت' },
  { number: 26, nameArabic: 'الجزء السادس والعشرون (حم)', nameEnglish: 'Juz 26', startPage: 502, endPage: 521, startSurahName: 'الأحقاف' },
  { number: 27, nameArabic: 'الجزء السابع والعشرون (قال فما خطبكم)', nameEnglish: 'Juz 27', startPage: 522, endPage: 541, startSurahName: 'الذاريات' },
  { number: 28, nameArabic: 'الجزء الثامن والعشرون (قد سمع)', nameEnglish: 'Juz 28', startPage: 542, endPage: 561, startSurahName: 'المجادلة' },
  { number: 29, nameArabic: 'الجزء التاسع والعشرون (تبارك)', nameEnglish: 'Juz 29', startPage: 562, endPage: 581, startSurahName: 'الملك' },
  { number: 30, nameArabic: 'الجزء الثلاثون (عمّ يتساءلون)', nameEnglish: 'Juz 30 (Amma)', startPage: 582, endPage: 604, startSurahName: 'النبأ' },
];

/**
 * Helper to get the primary Surah appearing on a given Mushaf page.
 */
export function getSurahForPage(page: number): MushafSurahMeta {
  const safePage = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, page));
  let result = MUSHAF_SURAHS[0];
  for (let i = 0; i < MUSHAF_SURAHS.length; i++) {
    if (MUSHAF_SURAHS[i].startPage <= safePage) {
      result = MUSHAF_SURAHS[i];
    } else {
      break;
    }
  }
  return result;
}

/**
 * Helper to get the Juz for a given Mushaf page.
 */
export function getJuzForPage(page: number): MushafJuzMeta {
  const safePage = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, page));
  const found = MUSHAF_AJZAA.find((j) => safePage >= j.startPage && safePage <= j.endPage);
  return found || MUSHAF_AJZAA[0];
}

/**
 * Returns complete page metadata including authentic image URLs from Quran.com / King Fahd Complex CDN.
 */
export function getMushafPageInfo(pageNumber: number): MushafPageInfo {
  const safePage = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, pageNumber));
  const surah = getSurahForPage(safePage);
  const juz = getJuzForPage(safePage);
  const hizb = Math.min(60, Math.ceil((safePage / TOTAL_MUSHAF_PAGES) * 60) || 1);

  const paddedStr = safePage.toString().padStart(3, '0');
  // Official ultra-high-resolution Madinah Mushaf page (1920px width)
  const imageUri = `https://files.quran.app/hafs/madani/width_1920/page${paddedStr}.png`;
  // Verified backup mirror (1260px width)
  const backupImageUri = `https://files.quran.app/hafs/madani/width_1260/page${paddedStr}.png`;

  return {
    pageNumber: safePage,
    juzNumber: juz.number,
    hizbNumber: hizb,
    surahNumber: surah.number,
    surahNameArabic: surah.nameArabic,
    surahNameEnglish: surah.nameEnglish,
    isRightPage: safePage % 2 !== 0,
    imageUri,
    backupImageUri,
  };
}
