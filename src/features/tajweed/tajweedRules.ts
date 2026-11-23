// src/features/tajweed/tajweedRules.ts
// Kid-friendly Tajweed rule definitions — 4 simplified colorful categories
// Colors chosen to match Rawda Kids theme while remaining WCAG-AA accessible

export interface TajweedRuleDefinition {
  /** Short code as used in Al Quran Cloud bracket notation */
  key: string;
  /** Category ID */
  categoryId: TajweedCategoryId;
}

export type TajweedCategoryId = 'madd' | 'ghunnah' | 'qalqalah' | 'ikhfa_idgham';

export interface TajweedCategory {
  id: TajweedCategoryId;
  nameAr: string;
  nameEn: string;
  color: string;
  bgColor: string;
  kidExplanationAr: string;
  kidExplanationEn: string;
  emoji: string;
  /** Target hold duration in ms (for Madd Meter voice game) */
  targetHoldMs: number;
}

/** 4 simplified kid-friendly categories */
export const TAJWEED_CATEGORIES: Record<TajweedCategoryId, TajweedCategory> = {
  madd: {
    id: 'madd',
    nameAr: 'المدّ',
    nameEn: 'Madd (Elongation)',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    kidExplanationAr: 'نُطيل الصوت هنا بجمال وهدوء مثل مدّ اليد 🤲',
    kidExplanationEn: 'We stretch our voice here, like reaching out our hand 🤲',
    emoji: '🚀',
    targetHoldMs: 2000,
  },
  ghunnah: {
    id: 'ghunnah',
    nameAr: 'الغُنّة',
    nameEn: 'Ghunnah (Nasalization)',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    kidExplanationAr: 'صوت جميل يخرج من الأنف لمدة حركتين 👃🌿',
    kidExplanationEn: 'A beautiful sound coming from the nose, held for 2 counts 👃🌿',
    emoji: '🌿',
    targetHoldMs: 1200,
  },
  qalqalah: {
    id: 'qalqalah',
    nameAr: 'القلقلة',
    nameEn: 'Qalqalah (Echo/Bounce)',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    kidExplanationAr: 'حرف قوي يقفز في النطق (ق ط ب ج د) 🏀',
    kidExplanationEn: 'A strong letter that bounces when it rests (ق ط ب ج د) 🏀',
    emoji: '🏀',
    targetHoldMs: 0, // Not a held-sound rule
  },
  ikhfa_idgham: {
    id: 'ikhfa_idgham',
    nameAr: 'الإخفاء والإدغام',
    nameEn: 'Ikhfa & Idgham (Hiding/Merging)',
    color: '#9333EA',
    bgColor: '#F3E8FF',
    kidExplanationAr: 'حرف يختبئ أو يندمج بلطف مع الحرف الذي بعده 🫧',
    kidExplanationEn: 'A letter hides or gently blends with the next letter 🫧',
    emoji: '🔮',
    targetHoldMs: 0,
  },
};

/**
 * Mapping from Al Quran Cloud rule codes → category.
 * Codes from https://api.alquran.cloud (quran-tajweed edition bracket notation).
 *
 * m = madd mutassil, n = madd lazim, p = madd arid, o = madd muttasil (all Madd types)
 * g = ghunnah
 * q = qalqalah
 * i = ikhfa, a = ikhfa shafawi, u = idgham mutajanisayn, w = idgham mutaqaribayn,
 * f = idgham, c = idgham shafawi
 */
export const RULE_CODE_TO_CATEGORY: Record<string, TajweedCategoryId> = {
  // Madd (elongation) variants
  m: 'madd', // madd lazim
  n: 'madd', // madd tabi'i
  p: 'madd', // madd arid
  o: 'madd', // madd ja'iz
  s: 'madd', // madd badal / silah
  // Ghunnah
  g: 'ghunnah',
  // Qalqalah
  q: 'qalqalah',
  // Ikhfa & Idgham family
  i: 'ikhfa_idgham', // ikhfa
  w: 'ikhfa_idgham', // idgham with ghunnah
  u: 'ikhfa_idgham', // idgham without ghunnah
  d: 'ikhfa_idgham', // idgham mutajanisayn
  f: 'ikhfa_idgham', // idgham mutaqaribayn / ikhfa
  a: 'ikhfa_idgham', // ikhfa shafawi
  c: 'ikhfa_idgham', // idgham shafawi
};

/** Look up a category by its rule code. Returns null for unknown/minor rules. */
export function getCategoryForCode(code: string): TajweedCategory | null {
  const catId = RULE_CODE_TO_CATEGORY[code];
  if (!catId) return null;
  return TAJWEED_CATEGORIES[catId];
}

