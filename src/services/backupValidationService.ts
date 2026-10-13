// src/services/backupValidationService.ts
// Strict schema validator & prototype pollution defense for Noor Kids backups.
// Compliant with OWASP ASVS V5.1 (Input Validation) & V8.3 (Data Integrity).

import type { ChildProfile, AgeBand } from '../store/useAppStore';

export interface ValidatedBackupData {
  version: string;
  exportedAt: string;
  profiles: ChildProfile[];
  activeProfileId: string;
  profilesProgress: Record<string, any>;
  parentSettings: {
    dailyLimitMin: number;
    quietHoursEnabled: boolean;
    reciterId: string;
    showEnglishTranslation: boolean;
    showSimpleTafsir: boolean;
    translationSource: 'sahih' | 'clearquran' | 'abdelhaleem';
    pin: string;
    pinHash?: string;
    pinSalt?: string;
  };
  gratitudeEntries: any[];
}

export interface BackupValidationResult {
  valid: boolean;
  sanitizedData?: ValidatedBackupData;
  errorAr?: string;
  errorEn?: string;
}

const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

function sanitizeObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectKeys);
  }
  const clean: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (DANGEROUS_KEYS.includes(key)) {
      continue; // Strip prototype pollution vectors
    }
    clean[key] = sanitizeObjectKeys(obj[key]);
  }
  return clean;
}

export class BackupValidationService {
  public validate(rawJson: string): BackupValidationResult {
    let parsed: any;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return {
        valid: false,
        errorAr: 'الملف لا يحتوي على صيغة JSON صحيحة.',
        errorEn: 'File content is not valid JSON.',
      };
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        valid: false,
        errorAr: 'بنية النسخة الاحتياطية غير صالحة (يجب أن تكون كائن بيانات).',
        errorEn: 'Backup payload must be a JSON object.',
      };
    }

    // Prototype pollution scrub
    const sanitized = sanitizeObjectKeys(parsed);

    // 1. Validate Profiles
    if (!Array.isArray(sanitized.profiles) || sanitized.profiles.length === 0) {
      return {
        valid: false,
        errorAr: 'النسخة الاحتياطية يجب أن تحتوي على ملف طفل واحد على الأقل.',
        errorEn: 'Backup must contain at least one valid child profile.',
      };
    }

    if (sanitized.profiles.length > 20) {
      return {
        valid: false,
        errorAr: 'عدد ملفات الأطفال يتجاوز الحد المسموح به (الحد الأقصى 20).',
        errorEn: 'Number of profiles exceeds maximum limit (max 20).',
      };
    }

    const validatedProfiles: ChildProfile[] = [];
    const validAgeBands: AgeBand[] = ['4-6', '7-9', '10-13'];

    for (let i = 0; i < sanitized.profiles.length; i++) {
      const p = sanitized.profiles[i];
      if (!p || typeof p !== 'object') {
        return {
          valid: false,
          errorAr: `ملف الطفل رقم ${i + 1} تالف.`,
          errorEn: `Child profile at index ${i} is invalid.`,
        };
      }
      const id = String(p.id || '').trim();
      const name = String(p.name || '').trim().slice(0, 40);
      const ageBand: AgeBand = validAgeBands.includes(p.ageBand) ? p.ageBand : '7-9';
      const avatar = String(p.avatar || 'av-boy1').trim().slice(0, 100);

      if (!id || !name) {
        return {
          valid: false,
          errorAr: 'اسم أو معرف أحد ملفات الأطفال مفقود.',
          errorEn: 'A child profile is missing a valid ID or name.',
        };
      }

      validatedProfiles.push({ id, name, ageBand, avatar });
    }

    // 2. Validate Active Profile ID
    let activeProfileId = String(sanitized.activeProfileId || '').trim();
    if (!validatedProfiles.some((p) => p.id === activeProfileId)) {
      activeProfileId = validatedProfiles[0].id;
    }

    // 3. Validate Profiles Progress (sanitize numbers and ranges)
    const rawProgress = sanitized.profilesProgress || {};
    const sanitizedProgress: Record<string, any> = {};

    for (const p of validatedProfiles) {
      const prog = rawProgress[p.id] || {};
      sanitizedProgress[p.id] = {
        surahProgress: typeof prog.surahProgress === 'object' && prog.surahProgress !== null ? prog.surahProgress : {},
        hadithProgress: typeof prog.hadithProgress === 'object' && prog.hadithProgress !== null ? prog.hadithProgress : {},
        storyProgress: typeof prog.storyProgress === 'object' && prog.storyProgress !== null ? prog.storyProgress : {},
        scenarioProgress: typeof prog.scenarioProgress === 'object' && prog.scenarioProgress !== null ? prog.scenarioProgress : {},
        dailyHabitsDone: typeof prog.dailyHabitsDone === 'object' && prog.dailyHabitsDone !== null ? prog.dailyHabitsDone : {},
        stars: Math.max(0, Math.min(1000000, Number(prog.stars) || 0)),
        gems: Math.max(0, Math.min(1000000, Number(prog.gems) || 0)),
        streakCount: Math.max(0, Math.min(10000, Number(prog.streakCount) || 0)),
        lastActiveDate: String(prog.lastActiveDate || new Date().toISOString().split('T')[0]).slice(0, 20),
        unlockedStickers: Array.isArray(prog.unlockedStickers) ? prog.unlockedStickers.map(String).slice(0, 100) : [],
        unlockedBadges: Array.isArray(prog.unlockedBadges) ? prog.unlockedBadges.map(String).slice(0, 100) : [],
        selectedAvatarId: String(prog.selectedAvatarId || p.avatar).slice(0, 50),
        gratitudeEntries: Array.isArray(prog.gratitudeEntries) ? prog.gratitudeEntries.slice(0, 100) : [],
        lastReadMushafPage: Math.max(1, Math.min(604, Number(prog.lastReadMushafPage) || 1)),
        mushafBookmarks: Array.isArray(prog.mushafBookmarks)
          ? prog.mushafBookmarks.map(Number).filter((n: number) => n >= 1 && n <= 604)
          : [1],
      };
    }

    // 4. Validate Parent Settings
    const ps = sanitized.parentSettings || {};
    const validSources = ['sahih', 'clearquran', 'abdelhaleem'] as const;
    const translationSource = validSources.includes(ps.translationSource) ? ps.translationSource : 'sahih';

    const sanitizedParentSettings = {
      dailyLimitMin: Math.max(0, Math.min(360, Number(ps.dailyLimitMin) || 0)),
      quietHoursEnabled: Boolean(ps.quietHoursEnabled),
      reciterId: String(ps.reciterId || 'alafasy').slice(0, 30),
      showEnglishTranslation: Boolean(ps.showEnglishTranslation),
      showSimpleTafsir: Boolean(ps.showSimpleTafsir ?? true),
      translationSource,
      pin: '••••',
      pinHash: typeof ps.pinHash === 'string' && ps.pinHash.length === 64 ? ps.pinHash : undefined,
      pinSalt: typeof ps.pinSalt === 'string' && ps.pinSalt.length === 32 ? ps.pinSalt : undefined,
    };

    // 5. Gratitude Entries
    const gratitudeEntries = Array.isArray(sanitized.gratitudeEntries)
      ? sanitized.gratitudeEntries.slice(0, 200)
      : [];

    return {
      valid: true,
      sanitizedData: {
        version: String(sanitized.version || '1.0.0'),
        exportedAt: String(sanitized.exportedAt || new Date().toISOString()),
        profiles: validatedProfiles,
        activeProfileId,
        profilesProgress: sanitizedProgress,
        parentSettings: sanitizedParentSettings,
        gratitudeEntries,
      },
    };
  }
}

export const backupValidationService = new BackupValidationService();
