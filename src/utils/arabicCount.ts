/**
 * Arabic Count Grammar Utility (قواعد التمييز والعدد في العربية)
 * 
 * Rules:
 * - 0: صفر
 * - 1: مفرد (يوم واحد / آية واحدة / سورة واحدة)
 * - 2: مثنى (يومان / آيتان / سورتان)
 * - 3–10: جمع مجرور (٣ أيام / ٣ آيات / ٣ سور)
 * - 11+: مفرد منصوب (١١ يومًا / ٤٠ آيةً / ١١٤ سورةً)
 */

export const toArabicDigits = (num: number | string): string => {
  const digits = '٠١٢٣٤٥٦٧٨٩';
  return String(num).replace(/[0-9]/g, (d) => digits[parseInt(d, 10)]);
};

export interface ArabicCountForms {
  one: string;
  two: string;
  few: string;  // 3-10 (plural)
  many: string; // 11+ (singular accusative)
  enSingular?: string;
  enPlural?: string;
}

export function formatCount(count: number, forms: ArabicCountForms, isArabic = true): string {
  const c = Math.max(0, Math.floor(count));
  if (!isArabic) {
    const enS = forms.enSingular || '';
    const enP = forms.enPlural || `${enS}s`;
    return `${c} ${c === 1 ? enS : enP}`.trim();
  }

  const arDigits = toArabicDigits(c);

  if (c === 0) {
    return `٠ ${forms.many}`;
  }
  if (c === 1) {
    return forms.one;
  }
  if (c === 2) {
    return forms.two;
  }
  if (c >= 3 && c <= 10) {
    return `${arDigits} ${forms.few}`;
  }
  // 11+
  return `${arDigits} ${forms.many}`;
}

export const AYAH_FORMS: ArabicCountForms = {
  one: 'آية واحدة',
  two: 'آيتان',
  few: 'آيات',
  many: 'آيةً',
  enSingular: 'verse',
  enPlural: 'verses',
};

export const SURAH_FORMS: ArabicCountForms = {
  one: 'سورة واحدة',
  two: 'سورتان',
  few: 'سور',
  many: 'سورةً',
  enSingular: 'surah',
  enPlural: 'surahs',
};

export const STREAK_DAYS_FORMS: ArabicCountForms = {
  one: 'يوم واحد',
  two: 'يومان',
  few: 'أيام',
  many: 'يومًا',
  enSingular: 'day',
  enPlural: 'days',
};

export const HADITH_FORMS: ArabicCountForms = {
  one: 'حديث واحد',
  two: 'حديثان',
  few: 'أحاديث',
  many: 'حديثًا',
  enSingular: 'hadith',
  enPlural: 'hadiths',
};

export const formatAyahsCount = (count: number, isArabic = true): string =>
  formatCount(count, AYAH_FORMS, isArabic);

export const formatSurahsCount = (count: number, isArabic = true): string =>
  formatCount(count, SURAH_FORMS, isArabic);

export const formatStreakDays = (count: number, isArabic = true): string =>
  formatCount(count, STREAK_DAYS_FORMS, isArabic);

export const formatHadithsCount = (count: number, isArabic = true): string =>
  formatCount(count, HADITH_FORMS, isArabic);

