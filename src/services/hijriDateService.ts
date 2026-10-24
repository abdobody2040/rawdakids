// Hijri Date Service (خدمة التاريخ الهجري الدقيق)
// Accurate Islamic Umm al-Qura calendar calculation with algorithmic fallback
import type { Language } from '../constants/i18n';

export interface HijriDateInfo {
  day: number;
  month: number;
  year: number;
  weekdayIndex: number;
  monthName: string;
  weekdayName: string;
}

const HIJRI_MONTHS: Record<Language, string[]> = {
  ar: [
    'المحرّم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ],
  en: [
    'Muharram',
    'Safar',
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    'Jumada al-Ula',
    'Jumada al-Akhirah',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qi'dah",
    'Dhu al-Hijjah',
  ],
  ur: [
    'محرم',
    'صفر',
    'ربیع الاول',
    'ربیع الثانی',
    'جمادی الاول',
    'جمادی الثانی',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذوالقعدہ',
    'ذوالحجہ',
  ],
  fr: [
    'Mouharram',
    'Safar',
    "Rabi' al-Awwal",
    'Rabi\' ath-Thani',
    'Joumada al-Oula',
    'Joumada ath-Thania',
    'Rajab',
    "Cha'ban",
    'Ramadan',
    'Chawwal',
    'Dhou al-Qi\'da',
    'Dhou al-Hijja',
  ],
  tr: [
    'Muharrem',
    'Safer',
    'Rebiülevvel',
    'Rebiülahir',
    'Cemaziyelevvel',
    'Cemaziyelahir',
    'Recep',
    'Şaban',
    'Ramazan',
    'Şevval',
    'Zilkade',
    'Zilhicce',
  ],
  id: [
    'Muharram',
    'Safar',
    'Rabiul Awwal',
    'Rabiul Akhir',
    'Jumadil Ula',
    'Jumadil Akhir',
    'Rajab',
    'Syaban',
    'Ramadan',
    'Syawal',
    'Zulkaidah',
    'Zulhijjah',
  ],
  de: [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi ath-Thani',
    'Dschumada al-Ula',
    'Dschumada al-Achira',
    'Radschab',
    'Schaban',
    'Ramadan',
    'Schawwal',
    'Dhu al-Qada',
    'Dhu al-Hiddscha',
  ],
  es: [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Yumada al-Ula',
    'Yumada al-Ajira',
    'Rayab',
    'Shaban',
    'Ramadán',
    'Shawwal',
    'Du al-Qada',
    'Du al-Hiyya',
  ],
  ru: [
    'Мухаррам',
    'Сафар',
    'Раби аль-авваль',
    'Раби ас-сани',
    'Джумада аль-уля',
    'Джумада аль-ахира',
    'Раджаб',
    'Шаабан',
    'Рамадан',
    'Шавваль',
    'Зуль-каада',
    'Зуль-хиджа',
  ],
  bn: [
    'মুহররম',
    'সফর',
    'রবিউল আউয়াল',
    'রবিউস সানি',
    'জমাদিউল আউয়াল',
    'জমাদিউস সানি',
    'রজব',
    'শাবান',
    'রমজান',
    'শাওয়াল',
    'জিলকদ',
    'জিলহজ্জ',
  ],
};

const WEEKDAYS: Record<Language, string[]> = {
  ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ur: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  id: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  bn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
};

export function toArabicNumerals(num: number | string): string {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => digits[parseInt(d, 10)]);
}

/**
 * Computes exact Hijri date using Intl Umm al-Qura calendar with astronomical formula fallback
 */
export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0): HijriDateInfo {
  const adjusted = new Date(date.getTime() + adjustmentDays * 86400000);
  const weekdayIndex = adjusted.getDay();

  let day = 0;
  let month = 0;
  let year = 0;

  // 1. Primary: Use Intl.DateTimeFormat with islamic-umalqura
  try {
    const intlFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = intlFormatter.formatToParts(adjusted);
    const dVal = parts.find((p) => p.type === 'day')?.value;
    const mVal = parts.find((p) => p.type === 'month')?.value;
    const yVal = parts.find((p) => p.type === 'year')?.value;

    if (dVal && mVal && yVal) {
      const parsedD = parseInt(dVal, 10);
      const parsedM = parseInt(mVal, 10);
      const parsedY = parseInt(yVal, 10);

      // Validate Islamic calendar range
      if (
        parsedY >= 1400 &&
        parsedY <= 1600 &&
        parsedM >= 1 &&
        parsedM <= 12 &&
        parsedD >= 1 &&
        parsedD <= 30
      ) {
        day = parsedD;
        month = parsedM;
        year = parsedY;
      }
    }
  } catch {
    // Continue to algorithmic fallback
  }

  // 2. Fallback: High-precision astronomical Umm Al-Qura / Tabular algorithm
  if (!day || !month || !year) {
    let d = adjusted.getDate();
    let m = adjusted.getMonth() + 1;
    let y = adjusted.getFullYear();

    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;

    const iyear = 10631.0 / 30.0;
    const epochastro = 1948084;
    const shift1 = 8.01 / 60.0;

    let z = jd - epochastro;
    const cyc = Math.floor(z / 10631.0);
    z = z - 10631 * cyc;
    const j = Math.floor((z - shift1) / iyear);
    const iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    let im = Math.floor((z + 28.5001) / 29.5);
    if (im === 13) im = 12;
    const id = Math.floor(z - Math.floor(29.5001 * im - 29));

    day = id;
    month = im;
    year = iy;
  }

  const safeMonthIndex = Math.max(0, Math.min(11, month - 1));
  const monthName = (HIJRI_MONTHS.ar || HIJRI_MONTHS.en)[safeMonthIndex];
  const weekdayName = (WEEKDAYS.ar || WEEKDAYS.en)[weekdayIndex];

  return {
    day,
    month,
    year,
    weekdayIndex,
    monthName,
    weekdayName,
  };
}

/**
 * Formats full localized today Hijri date string for the dashboard header
 * e.g. "السبت، ١٣ جمادى الأولى ١٤٤٨ هـ"
 */
export function formatLocalizedTodayDate(lang: Language = 'ar', date: Date = new Date()): string {
  const hijri = getHijriDate(date);
  const weekdayList = WEEKDAYS[lang] || WEEKDAYS.en;
  const monthList = HIJRI_MONTHS[lang] || HIJRI_MONTHS.en;

  const weekday = weekdayList[hijri.weekdayIndex] || weekdayList[0];
  const monthName = monthList[Math.max(0, Math.min(11, hijri.month - 1))] || monthList[0];

  if (lang === 'ar') {
    const dayStr = toArabicNumerals(hijri.day);
    const yearStr = toArabicNumerals(hijri.year);
    return `${weekday}، ${dayStr} ${monthName} ${yearStr} هـ`;
  }

  if (lang === 'ur') {
    return `${weekday}، ${hijri.day} ${monthName} ${hijri.year} ھ`;
  }

  if (lang === 'tr') {
    return `${weekday}, ${hijri.day} ${monthName} ${hijri.year} H`;
  }

  if (lang === 'id') {
    return `${weekday}, ${hijri.day} ${monthName} ${hijri.year} H`;
  }

  if (lang === 'fr') {
    return `${weekday}, ${hijri.day} ${monthName} ${hijri.year} AH`;
  }

  if (lang === 'es') {
    return `${weekday}, ${hijri.day} de ${monthName} de ${hijri.year} H`;
  }

  if (lang === 'de') {
    return `${weekday}, ${hijri.day}. ${monthName} ${hijri.year} AH`;
  }

  if (lang === 'ru') {
    return `${weekday}, ${hijri.day} ${monthName} ${hijri.year} г.х.`;
  }

  if (lang === 'bn') {
    return `${weekday}, ${hijri.day} ${monthName} ${hijri.year} হিজরি`;
  }

  return `${weekday}, ${hijri.day} ${monthName} ${hijri.year} AH`;
}
