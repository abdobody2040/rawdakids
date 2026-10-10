// Theme and Design Tokens for Noor Kids (نور للأطفال)

export const COLORS = {
  // Brand & Foundation
  primary: '#0D9488', // Deep Emerald Teal
  primaryLight: '#2DD4BF',
  primaryDark: '#115E59',
  secondary: '#F59E0B', // Warm Sunnah Gold
  secondaryLight: '#FDE68A',
  secondaryDark: '#B45309',

  // 4 Worlds Color Schemes
  quranGarden: {
    primary: '#059669',
    secondary: '#10B981',
    light: '#D1FAE5',
    dark: '#064E3B',
    accent: '#34D399',
    gradient: ['#059669', '#10B981'] as const,
  },
  sunnahPath: {
    primary: '#D97706',
    secondary: '#F59E0B',
    light: '#FEF3C7',
    dark: '#78350F',
    accent: '#FBBF24',
    gradient: ['#D97706', '#F59E0B'] as const,
  },
  prophetsCaravan: {
    primary: '#6366F1',
    secondary: '#818CF8',
    light: '#E0E7FF',
    dark: '#312E81',
    accent: '#A5B4FC',
    gradient: ['#4F46E5', '#7C3AED'] as const,
  },
  mannersTown: {
    primary: '#0284C7',
    secondary: '#38BDF8',
    light: '#E0F2FE',
    dark: '#0C4A6E',
    accent: '#7DD3FC',
    gradient: ['#0284C7', '#0EA5E9'] as const,
  },

  // Gamification & Rewards
  star: '#FBBF24',
  starActive: '#F59E0B',
  gem: '#EC4899',
  streak: '#EF4444',
  streakFreeze: '#38BDF8',

  // Surfaces & Backgrounds
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#F8FAFC',

  // Feedback
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Quran Specific
  quranActiveAyah: '#ECFDF5',
  quranBorderActive: '#10B981',
  quranText: '#064E3B',
  tafsirText: '#374151',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
};

export const TYPOGRAPHY = {
  // Arabic Quran text font families
  quranFont: 'System', // Uses native arabic typography with full tashkeel
  quranSize: 26,
  quranLineHeight: 52,
  
  // Kids UI sizes
  titleLg: 28,
  titleMd: 22,
  titleSm: 18,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  strong: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  }),
};
