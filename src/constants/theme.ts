// Theme and Design Tokens for Noor Kids — Rawda Kids Redesign (PRD §6)
// Garden palette: warm sand backgrounds, brand emerald, coral CTA, gold rewards
import { Platform } from 'react-native';

export const COLORS = {
  // ── PRD Design Tokens ────────────────────────────────────────────
  /** Primary Action Color (Global unified action green) */
  actionGreen: '#0F9D6B',
  actionGreenLight: '#E1F5EE',
  actionGreenBorder: '#5DCAA5',
  actionGreenDark: '#0B7A53',
  /** App bar, tab bar, headings — the brand anchor */
  brandEmerald: '#064E3B',
  /** Success, growth, progress rings */
  gardenGreen: '#0F9D6B',
  /** Default screen background — warm sand */
  sand50: '#FFF8EB',
  /** Cards, grouped sections */
  sand100: '#FBEFD5',
  /** Calm accent, Quran and wonder worlds */
  sky300: '#7DD3FC',
  /** Rewards, stars, highlights (only orange/gold for rewards) */
  gold400: '#F5B83D',
  /** Primary call-to-action buttons (unified to actionGreen) */
  coral500: '#0F9D6B',
  /** Body text on light backgrounds */
  ink900: '#1F2937',
  /** Dark mode background (bedtime mode) */
  night900: '#0B2A24',

  // ── Brand & Foundation (legacy aliases kept for compatibility) ───
  primary: '#0F9D6B',
  primaryLight: '#16A34A',
  primaryDark: '#064E3B',
  secondary: '#F5B83D',
  secondaryLight: '#FEE99E',
  secondaryDark: '#B88820',

  // ── Six Worlds Color Schemes ──────────────────────────────────────
  quranGarden: {
    primary: '#059669',
    secondary: '#10B981',
    light: '#D1FAE5',
    dark: '#064E3B',
    accent: '#34D399',
    gradient: ['#064E3B', '#16A34A'] as const,
  },
  worshipWorld: {
    primary: '#7DD3FC',
    secondary: '#38BDF8',
    light: '#E0F2FE',
    dark: '#0C4A6E',
    accent: '#BAE6FD',
    gradient: ['#0284C7', '#38BDF8'] as const,
  },
  storiesWorld: {
    primary: '#A855F7',
    secondary: '#C084FC',
    light: '#F3E8FF',
    dark: '#6B21A8',
    accent: '#DDD6FE',
    gradient: ['#7C3AED', '#A855F7'] as const,
  },
  akhlaqSunnah: {
    primary: '#D97706',
    secondary: '#F59E0B',
    light: '#FEF3C7',
    dark: '#78350F',
    accent: '#FBBF24',
    gradient: ['#D97706', '#F59E0B'] as const,
  },
  asmaAllahWorld: {
    primary: '#7C3AED',
    secondary: '#8B5CF6',
    light: '#EDE9FE',
    dark: '#4C1D95',
    accent: '#C4B5FD',
    gradient: ['#5B21B6', '#7C3AED'] as const,
  },
  wonderWorld: {
    primary: '#0EA5E9',
    secondary: '#38BDF8',
    light: '#E0F2FE',
    dark: '#0369A1',
    accent: '#7DD3FC',
    gradient: ['#0284C7', '#0EA5E9'] as const,
  },

  // ── Legacy world aliases ──────────────────────────────────────────
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

  // ── Gamification & Rewards ────────────────────────────────────────
  star: '#F5B83D',
  starActive: '#E8A020',
  gem: '#EC4899',
  streak: '#16A34A', // Garden sprout (replaces flame)
  streakFreeze: '#7DD3FC',

  // ── Surfaces & Backgrounds ────────────────────────────────────────
  background: '#FFF8EB',   // sand-50 warm base
  backgroundAlt: '#FBEFD5', // sand-100 for cards
  card: '#FFFFFF',
  cardAlt: '#FFF8EB',
  border: '#E8D9BF',
  borderLight: '#F3E9D2',

  // ── Text ──────────────────────────────────────────────────────────
  text: '#1F2937',          // ink-900
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textLight: '#FFF8EB',

  // ── Feedback ──────────────────────────────────────────────────────
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F5B83D',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#0EA5E9',
  infoLight: '#E0F2FE',

  // ── Quran Specific ────────────────────────────────────────────────
  quranActiveAyah: '#ECFDF5',
  quranBorderActive: '#16A34A',
  quranText: '#064E3B',
  tafsirText: '#374151',
};

// ── PRD §6 Spacing: 4px base steps, 16px screen gutter ──────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,   // screen gutter
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ── PRD §6 Radius: 20px card radius ──────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,   // card radius per PRD
  xl: 28,
  xxl: 40,
  full: 9999,
};

// ── PRD §6 Typography ─────────────────────────────────────────────────
// Headings: Baloo Bhaijaan 2 / Cairo / Readex Pro, 22–28px
// Body: same family, 18px minimum, line-height 1.7
// Quran: KFGQPC Uthmanic Hafs / Amiri Quran, 28px min, line-height 2.0
export const TYPOGRAPHY = {
  // Arabic Quran text — NEVER replaced by decorative font
  quranFont: 'System',
  quranSize: 28,        // 28px minimum per PRD
  quranLineHeight: 56,  // line-height 2.0

  // Kids UI heading sizes
  titleLg: 28,
  titleMd: 24,
  titleSm: 22,

  // Body — 18px minimum per PRD, line-height 1.7
  bodyLg: 18,
  bodyMd: 16,
  bodySm: 14,

  // Touch target heights per PRD
  touchTargetLarge: 56,  // ages 4-9
  touchTargetSmall: 48,  // ages 10-12
};

export const SHADOWS = {
  soft: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 0,
    },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
  }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
  medium: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
    },
    android: {
      elevation: 0,
    },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
    },
  }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
  strong: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 32,
    },
    android: {
      elevation: 0,
    },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 32,
    },
  }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
  glow: (color: string) =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 0,
      },
      default: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
    }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
  // Aliases for sm / md / lg
  sm: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
    android: { elevation: 0 },
    default: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
  md: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 18 },
    android: { elevation: 0 },
    default: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 18 },
  }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
  lg: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.18, shadowRadius: 32 },
    android: { elevation: 0 },
    default: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.18, shadowRadius: 32 },
  }) as { shadowColor?: string; shadowOffset?: any; shadowOpacity?: number; shadowRadius?: number; elevation?: number },
};
