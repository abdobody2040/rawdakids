// Global Application Store for Noor Kids
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/i18n';
import { securityCryptoService, EncryptedBackupEnvelope } from '@/services/securityCryptoService';
import { backupValidationService, ValidatedBackupData } from '@/services/backupValidationService';
import { localDbService } from '@/services/localDbService';
import { voiceRecordService } from '@/services/voiceRecordService';

export type AgeBand = '4-6' | '7-9' | '10-13';

export interface ChildProfile {
  id: string;
  name: string;
  ageBand: AgeBand;
  avatar: string;
  gender?: 'male' | 'female';
}

export type HifzStatus = 'new' | 'learning' | 'memorized';

export interface SurahProgressItem {
  ayahsStatus: Record<number, HifzStatus>;
  stars: number;
  isCompleted: boolean;
}

export interface WeeklyChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  valueId: string;
  emoji: string;
  gemReward: number;
  completedByChild: boolean;
  confirmedByParent: boolean;
}

export interface ChildProgressData {
  surahProgress: Record<number, SurahProgressItem>;
  hadithProgress: Record<string, { completed: boolean; stars: number }>;
  storyProgress: Record<string, { completed: boolean; quizScore: number; lessonCardUnlocked: boolean }>;
  scenarioProgress: Record<string, { completed: boolean }>;
  dailyHabitsDone: Record<string, boolean>;
  dailyStepsDone?: Record<string, ('listen' | 'learn' | 'practice')[]>;
  stars: number;
  gems: number;
  streakCount: number;
  lastActiveDate: string;
  unlockedStickers: string[];
  unlockedBadges: string[];
  selectedAvatarId: string;
  gratitudeEntries: {
    id: string;
    date: string;
    category: string;
    emoji: string;
    text: string;
  }[];
  lastReadMushafPage?: number;
  mushafBookmarks?: number[];
}

export const createDefaultChildProgress = (avatar: string): ChildProgressData => ({
  surahProgress: {},
  hadithProgress: {},
  storyProgress: {},
  scenarioProgress: {},
  dailyHabitsDone: {},
  stars: 0,
  gems: 0,
  streakCount: 0,
  lastActiveDate: '',
  unlockedStickers: [],
  unlockedBadges: [],
  selectedAvatarId: avatar,
  gratitudeEntries: [],
  lastReadMushafPage: 1,
  mushafBookmarks: [1],
});

export interface AppState {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: (asGuest?: boolean) => void;
  isGuestMode: boolean;
  setGuestMode: (isGuest: boolean) => void;

  // Profiles (Local on-device only)
  profiles: ChildProfile[];
  activeProfileId: string;
  profilesProgress: Record<string, ChildProgressData>;
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Omit<ChildProfile, 'id'>) => string;
  deleteProfile: (id: string) => boolean;
  getChildProgress: (id: string) => ChildProgressData;
  cleanupDuplicateProfiles: () => void;
  resetChildProgress: (id?: string) => void;

  // Hifz & Quran Progress
  surahProgress: Record<number, SurahProgressItem>;
  setAyahStatus: (surahNumber: number, ayahNumber: number, status: HifzStatus) => void;
  addSurahStars: (surahNumber: number, stars: number) => void;
  markSurahCompleted: (surahNumber: number) => void;
  downloadedSurahs: Record<number, boolean>;
  setSurahDownloaded: (surahNumber: number, downloaded: boolean) => void;
  clearAllDownloadedSurahs: () => void;
  // Madinah Mushaf Page Reader (604 Pages)
  lastReadMushafPage: number;
  setLastReadMushafPage: (page: number) => void;
  mushafBookmarks: number[];
  toggleMushafBookmark: (page: number) => void;

  // Hadith Progress
  hadithProgress: Record<string, { completed: boolean; stars: number }>;
  completeHadith: (hadithId: string, stars: number) => void;

  // Stories Progress
  storyProgress: Record<string, { completed: boolean; quizScore: number; lessonCardUnlocked: boolean }>;
  completeStory: (storyId: string, quizScore: number) => void;

  // Manners Scenarios Progress
  scenarioProgress: Record<string, { completed: boolean }>;
  completeScenario: (buildingId: string) => void;

  // Daily Habits
  dailyHabitsDone: Record<string, boolean>;
  dailyStepsDone: Record<string, Record<string, ('listen' | 'learn' | 'practice')[]>>;
  markDailyStepDone: (profileId: string, stepId: 'listen' | 'learn' | 'practice') => void;
  getDailyStepsDone: (profileId?: string) => ('listen' | 'learn' | 'practice')[];
  toggleDailyHabit: (habitId: string) => void;

  // Weekly Manners Challenges (E3, PA4)
  weeklyChallenges: WeeklyChallenge[];
  completeWeeklyChallenge: (id: string) => void;
  confirmWeeklyChallenge: (id: string) => void;

  // Rewards & Gamification
  stars: number;
  gems: number;
  addStars: (count: number) => void;
  addGems: (count: number) => void;
  unlockedStickers: string[];
  unlockSticker: (id: string) => void;
  unlockedBadges: string[];
  unlockBadge: (id: string) => void;
  selectedAvatarId: string;
  setSelectedAvatarId: (id: string) => void;

  // Streak
  streakCount: number;
  lastActiveDate: string;
  freezesLeft: number;
  recordDailyActivity: () => void;

  // Parent Settings & Controls
  parentSettings: {
    dailyLimitMin: number;
    quietHoursEnabled: boolean;
    reciterId: string;
    showEnglishTranslation: boolean;
    showSimpleTafsir: boolean;
    translationSource: 'sahih' | 'clearquran' | 'abdelhaleem';
    madhhab: 'hanafi' | 'maliki' | 'shafii' | 'hanbali';
    prayerCity: string;
    adhanAudioEnabled: boolean;
    bedtimeLockEnabled: boolean;
    bedtimeStart: string;
    bedtimeEnd: string;
    hasCustomPin?: boolean;
    pin: string;
    pinHash?: string;
    pinSalt?: string;
    recoveryCodeHash?: string;
    recoveryCodeSalt?: string;
    pinFailedAttempts?: number;
    pinLockoutUntil?: number | null;
    audioStorageLimitMB?: number;
    analyticsEnabled?: boolean;
    soundEffectsEnabled?: boolean;
  };
  updateParentSettings: (settings: Partial<AppState['parentSettings']>) => void;
  setParentPin: (pin: string) => { success: boolean; recoveryCode?: string; errorAr?: string; errorEn?: string };
  verifyParentPin: (pin: string) => boolean;
  verifyRecoveryCode: (code: string) => boolean;
  recordFailedPinAttempt: () => { isLocked: boolean; remainingSeconds: number };
  resetPinAttempts: () => void;
  resetAllAppData: () => Promise<void>;

  // Time Limit & Safety
  timeSpentTodaySec: number;
  dailyLimitDismissed: boolean;
  incrementTimeSpent: (sec: number) => void;
  resetDailyTimeSpentIfNewDay: () => void;
  setDailyLimitDismissed: (dismissed: boolean) => void;
  extendDailyLimit: (extraMinutes: number) => void;

  // Gratitude Journal
  gratitudeEntries: {
    id: string;
    date: string;
    category: string;
    emoji: string;
    text: string;
  }[];
  addGratitudeEntry: (entry: { category: string; emoji: string; text: string }) => void;

  // Offline Hydration
  isHydrated: boolean;
  hydrate: () => Promise<void>;

  // Encrypted Backup & Restore (OWASP ASVS V8.2 / V8.3)
  exportEncryptedBackup: (passphrase: string) => EncryptedBackupEnvelope;
  importEncryptedBackup: (
    envelope: EncryptedBackupEnvelope,
    passphrase: string
  ) => { success: boolean; profileCount?: number; errorAr?: string; errorEn?: string };
  restoreValidatedData: (
    data: ValidatedBackupData
  ) => { success: boolean; profileCount: number };
}

const STORAGE_KEY = '@noor_kids_app_state_v1';

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPersistState: AppState | null = null;

const executeSave = async (state: AppState) => {
  try {
    const currentActiveProgress: ChildProgressData = {
      surahProgress: state.surahProgress,
      hadithProgress: state.hadithProgress,
      storyProgress: state.storyProgress,
      scenarioProgress: state.scenarioProgress,
      dailyHabitsDone: state.dailyHabitsDone,
      dailyStepsDone: state.activeProfileId ? (state.dailyStepsDone[state.activeProfileId] || {}) : {},
      stars: state.stars,
      gems: state.gems,
      streakCount: state.streakCount,
      lastActiveDate: state.lastActiveDate,
      unlockedStickers: state.unlockedStickers,
      unlockedBadges: state.unlockedBadges,
      selectedAvatarId: state.selectedAvatarId,
      gratitudeEntries: state.gratitudeEntries,
      lastReadMushafPage: state.lastReadMushafPage,
      mushafBookmarks: state.mushafBookmarks,
    };
    const updatedProfilesProgress = state.activeProfileId
      ? {
          ...state.profilesProgress,
          [state.activeProfileId]: currentActiveProgress,
        }
      : state.profilesProgress;

    const stateToSave = {
      language: state.language,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      isGuestMode: state.isGuestMode,
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      profilesProgress: updatedProfilesProgress,
      surahProgress: state.surahProgress,
      hadithProgress: state.hadithProgress,
      storyProgress: state.storyProgress,
      scenarioProgress: state.scenarioProgress,
      dailyHabitsDone: state.dailyHabitsDone,
      stars: state.stars,
      gems: state.gems,
      unlockedStickers: state.unlockedStickers,
      unlockedBadges: state.unlockedBadges,
      selectedAvatarId: state.selectedAvatarId,
      streakCount: state.streakCount,
      lastActiveDate: state.lastActiveDate,
      freezesLeft: state.freezesLeft,
      parentSettings: state.parentSettings,
      dailyStepsDone: state.dailyStepsDone,
      downloadedSurahs: state.downloadedSurahs,
      lastReadMushafPage: state.lastReadMushafPage,
      mushafBookmarks: state.mushafBookmarks,
      weeklyChallenges: state.weeklyChallenges,
      gratitudeEntries: state.gratitudeEntries,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch {
    // ignore
  }
};

const persistState = (state: AppState) => {
  pendingPersistState = state;
  if (persistTimer) {
    clearTimeout(persistTimer);
  }
  persistTimer = setTimeout(() => {
    if (pendingPersistState) {
      executeSave(pendingPersistState);
      pendingPersistState = null;
    }
  }, 250);
};

export const useAppStore = create<AppState>((set, get) => ({
  language: 'ar',
  setLanguage: (language) => {
    set({ language });
    persistState(get());
  },

  hasCompletedOnboarding: false,
  isGuestMode: false,
  setGuestMode: (isGuestMode) => {
    set({ isGuestMode });
    persistState(get());
  },
  completeOnboarding: (asGuest = false) => {
    set({ hasCompletedOnboarding: true, isGuestMode: asGuest });
    persistState(get());
  },

  profiles: [],
  activeProfileId: '',
  profilesProgress: {},

  getChildProgress: (id) => {
    const state = get();
    if (id && state.activeProfileId === id) {
      return {
        surahProgress: state.surahProgress || {},
        hadithProgress: state.hadithProgress || {},
        storyProgress: state.storyProgress || {},
        scenarioProgress: state.scenarioProgress || {},
        dailyHabitsDone: state.dailyHabitsDone || {},
        dailyStepsDone: id ? (state.dailyStepsDone[id] || {}) : {},
        stars: state.stars ?? 0,
        gems: state.gems ?? 0,
        streakCount: state.streakCount ?? 0,
        lastActiveDate: state.lastActiveDate || '',
        unlockedStickers: state.unlockedStickers || [],
        unlockedBadges: state.unlockedBadges || [],
        selectedAvatarId: state.selectedAvatarId || 'av-boy1',
        gratitudeEntries: state.gratitudeEntries || [],
        lastReadMushafPage: state.lastReadMushafPage ?? 1,
        mushafBookmarks: state.mushafBookmarks ?? [1],
      };
    }
    const prof = state.profiles.find((p) => p.id === id);
    const existing = state.profilesProgress[id];
    if (existing) {
      return {
        ...existing,
        stars: existing.stars ?? 0,
        gems: existing.gems ?? 0,
        streakCount: existing.streakCount ?? 0,
        surahProgress: existing.surahProgress || {},
        hadithProgress: existing.hadithProgress || {},
        storyProgress: existing.storyProgress || {},
        scenarioProgress: existing.scenarioProgress || {},
        dailyHabitsDone: existing.dailyHabitsDone || {},
        dailyStepsDone: state.dailyStepsDone[id] || existing.dailyStepsDone || {},
        unlockedStickers: existing.unlockedStickers || [],
        unlockedBadges: existing.unlockedBadges || [],
        gratitudeEntries: existing.gratitudeEntries || [],
        lastReadMushafPage: existing.lastReadMushafPage ?? 1,
        mushafBookmarks: existing.mushafBookmarks ?? [1],
      };
    }
    return createDefaultChildProgress(prof?.avatar || 'av-boy1');
  },

  setActiveProfile: (nextId) => {
    const state = get();
    if (state.activeProfileId === nextId) return;

    // Snapshot current active child
    const currentSnapshot: ChildProgressData = {
      surahProgress: state.surahProgress,
      hadithProgress: state.hadithProgress,
      storyProgress: state.storyProgress,
      scenarioProgress: state.scenarioProgress,
      dailyHabitsDone: state.dailyHabitsDone,
      dailyStepsDone: state.activeProfileId ? (state.dailyStepsDone[state.activeProfileId] || {}) : {},
      stars: state.stars,
      gems: state.gems,
      streakCount: state.streakCount,
      lastActiveDate: state.lastActiveDate,
      unlockedStickers: state.unlockedStickers,
      unlockedBadges: state.unlockedBadges,
      selectedAvatarId: state.selectedAvatarId,
      gratitudeEntries: state.gratitudeEntries,
      lastReadMushafPage: state.lastReadMushafPage,
      mushafBookmarks: state.mushafBookmarks,
    };

    const updatedProgressMap = {
      ...state.profilesProgress,
      [state.activeProfileId]: currentSnapshot,
    };

    const targetChild = state.profiles.find((p) => p.id === nextId);
    const targetProgress =
      updatedProgressMap[nextId] ||
      createDefaultChildProgress(targetChild?.avatar || 'av-boy1');

    const updatedDailySteps = { ...state.dailyStepsDone };
    if (targetProgress.dailyStepsDone && !updatedDailySteps[nextId]) {
      updatedDailySteps[nextId] = targetProgress.dailyStepsDone;
    }

    set({
      activeProfileId: nextId,
      profilesProgress: updatedProgressMap,
      dailyStepsDone: updatedDailySteps,
      surahProgress: targetProgress.surahProgress || {},
      hadithProgress: targetProgress.hadithProgress || {},
      storyProgress: targetProgress.storyProgress || {},
      scenarioProgress: targetProgress.scenarioProgress || {},
      dailyHabitsDone: targetProgress.dailyHabitsDone || {},
      stars: targetProgress.stars ?? 0,
      gems: targetProgress.gems ?? 0,
      streakCount: targetProgress.streakCount ?? 0,
      lastActiveDate: targetProgress.lastActiveDate || '',
      unlockedStickers: targetProgress.unlockedStickers || [],
      unlockedBadges: targetProgress.unlockedBadges || [],
      selectedAvatarId: targetProgress.selectedAvatarId || targetChild?.avatar || 'av-boy1',
      gratitudeEntries: targetProgress.gratitudeEntries || [],
      lastReadMushafPage: targetProgress.lastReadMushafPage ?? 1,
      mushafBookmarks: targetProgress.mushafBookmarks ?? [1],
    });
    persistState(get());
  },

  addProfile: (newProfile) => {
    const id = 'child_' + Date.now();
    const profile: ChildProfile = { ...newProfile, id };
    const state = get();

    // Snapshot current active child
    const currentSnapshot: ChildProgressData = {
      surahProgress: state.surahProgress,
      hadithProgress: state.hadithProgress,
      storyProgress: state.storyProgress,
      scenarioProgress: state.scenarioProgress,
      dailyHabitsDone: state.dailyHabitsDone,
      dailyStepsDone: state.activeProfileId ? (state.dailyStepsDone[state.activeProfileId] || {}) : {},
      stars: state.stars,
      gems: state.gems,
      streakCount: state.streakCount,
      lastActiveDate: state.lastActiveDate,
      unlockedStickers: state.unlockedStickers,
      unlockedBadges: state.unlockedBadges,
      selectedAvatarId: state.selectedAvatarId,
      gratitudeEntries: state.gratitudeEntries,
      lastReadMushafPage: state.lastReadMushafPage,
      mushafBookmarks: state.mushafBookmarks,
    };

    const newChildProgress = createDefaultChildProgress(newProfile.avatar);

    const updatedProgressMap = {
      ...state.profilesProgress,
      ...(state.activeProfileId ? { [state.activeProfileId]: currentSnapshot } : {}),
      [id]: newChildProgress,
    };

    set({
      profiles: [...state.profiles, profile],
      activeProfileId: id,
      profilesProgress: updatedProgressMap,
      dailyStepsDone: { ...state.dailyStepsDone, [id]: {} },
      surahProgress: newChildProgress.surahProgress,
      hadithProgress: newChildProgress.hadithProgress,
      storyProgress: newChildProgress.storyProgress,
      scenarioProgress: newChildProgress.scenarioProgress,
      dailyHabitsDone: newChildProgress.dailyHabitsDone,
      stars: newChildProgress.stars,
      gems: newChildProgress.gems,
      streakCount: newChildProgress.streakCount,
      lastActiveDate: newChildProgress.lastActiveDate,
      unlockedStickers: newChildProgress.unlockedStickers,
      unlockedBadges: newChildProgress.unlockedBadges,
      selectedAvatarId: newChildProgress.selectedAvatarId,
      gratitudeEntries: newChildProgress.gratitudeEntries,
      lastReadMushafPage: 1,
      mushafBookmarks: [1],
    });
    persistState(get());
    return id;
  },

  deleteProfile: (id) => {
    const { profiles, activeProfileId, profilesProgress } = get();
    if (profiles.length <= 1) return false;

    const remaining = profiles.filter((p) => p.id !== id);
    const updatedProgressMap = { ...profilesProgress };
    delete updatedProgressMap[id];

    const updatedDailySteps = { ...get().dailyStepsDone };
    delete updatedDailySteps[id];

    if (activeProfileId === id) {
      const nextActiveId = remaining[0].id;
      const targetProgress =
        updatedProgressMap[nextActiveId] ||
        createDefaultChildProgress(remaining[0].avatar);

      set({
        profiles: remaining,
        activeProfileId: nextActiveId,
        profilesProgress: updatedProgressMap,
        dailyStepsDone: updatedDailySteps,
        surahProgress: targetProgress.surahProgress || {},
        hadithProgress: targetProgress.hadithProgress || {},
        storyProgress: targetProgress.storyProgress || {},
        scenarioProgress: targetProgress.scenarioProgress || {},
        dailyHabitsDone: targetProgress.dailyHabitsDone || {},
        stars: targetProgress.stars ?? 0,
        gems: targetProgress.gems ?? 0,
        streakCount: targetProgress.streakCount ?? 0,
        lastActiveDate: targetProgress.lastActiveDate || '',
        unlockedStickers: targetProgress.unlockedStickers || [],
        unlockedBadges: targetProgress.unlockedBadges || [],
        selectedAvatarId: targetProgress.selectedAvatarId || remaining[0].avatar || 'av-boy1',
        gratitudeEntries: targetProgress.gratitudeEntries || [],
        lastReadMushafPage: targetProgress.lastReadMushafPage ?? 1,
        mushafBookmarks: targetProgress.mushafBookmarks ?? [1],
      });
    } else {
      set({
        profiles: remaining,
        profilesProgress: updatedProgressMap,
        dailyStepsDone: updatedDailySteps,
      });
    }

    persistState(get());
    return true;
  },

  cleanupDuplicateProfiles: () => {
    const { profiles, activeProfileId, profilesProgress } = get();
    if (profiles.length <= 1) return;

    // Keep active profile and unique named profiles
    const seenNames = new Set<string>();
    const uniqueList: ChildProfile[] = [];

    const active = profiles.find((p) => p.id === activeProfileId) || profiles[0];
    uniqueList.push(active);
    seenNames.add(active.name.trim().toLowerCase());

    for (const p of profiles) {
      const normalized = p.name.trim().toLowerCase();
      if (p.id !== active.id && !seenNames.has(normalized)) {
        uniqueList.push(p);
        seenNames.add(normalized);
      }
    }

    const updatedProgressMap: Record<string, ChildProgressData> = {};
    for (const p of uniqueList) {
      if (profilesProgress[p.id]) {
        updatedProgressMap[p.id] = profilesProgress[p.id];
      }
    }

    set({
      profiles: uniqueList,
      activeProfileId: active.id,
      profilesProgress: updatedProgressMap,
    });
    persistState(get());
  },

  resetChildProgress: (targetId) => {
    const { profiles, activeProfileId, profilesProgress } = get();
    const idToReset = targetId || activeProfileId;
    const targetProfile = profiles.find((p) => p.id === idToReset);
    const cleanProgress = createDefaultChildProgress(targetProfile?.avatar || 'av-boy1');

    const updatedProgressMap = {
      ...profilesProgress,
      [idToReset]: cleanProgress,
    };

    const updatedDailySteps = { ...get().dailyStepsDone };
    delete updatedDailySteps[idToReset];

    if (idToReset === activeProfileId) {
      set({
        profilesProgress: updatedProgressMap,
        dailyStepsDone: updatedDailySteps,
        surahProgress: cleanProgress.surahProgress,
        hadithProgress: cleanProgress.hadithProgress,
        storyProgress: cleanProgress.storyProgress,
        scenarioProgress: cleanProgress.scenarioProgress,
        dailyHabitsDone: cleanProgress.dailyHabitsDone,
        stars: 0,
        gems: 0,
        streakCount: 0,
        lastActiveDate: '',
        unlockedStickers: [],
        unlockedBadges: [],
        selectedAvatarId: cleanProgress.selectedAvatarId,
        gratitudeEntries: [],
        lastReadMushafPage: 1,
        mushafBookmarks: [1],
      });
    } else {
      set({
        profilesProgress: updatedProgressMap,
        dailyStepsDone: updatedDailySteps,
      });
    }

    persistState(get());
  },

  surahProgress: {},
  setAyahStatus: (surahNumber, ayahNumber, status) => {
    set((state) => {
      const prevSurah = state.surahProgress[surahNumber] || {
        ayahsStatus: {},
        stars: 0,
        isCompleted: false,
      };
      const updatedAyahs = { ...prevSurah.ayahsStatus, [ayahNumber]: status };
      return {
        surahProgress: {
          ...state.surahProgress,
          [surahNumber]: {
            ...prevSurah,
            ayahsStatus: updatedAyahs,
          },
        },
      };
    });
    persistState(get());
  },
  addSurahStars: (surahNumber, stars) => {
    set((state) => {
      const prevSurah = state.surahProgress[surahNumber] || {
        ayahsStatus: {},
        stars: 0,
        isCompleted: false,
      };
      return {
        surahProgress: {
          ...state.surahProgress,
          [surahNumber]: {
            ...prevSurah,
            stars: Math.max(prevSurah.stars, stars),
            isCompleted: prevSurah.isCompleted,
          },
        },
        stars: state.stars + stars,
        gems: state.gems + stars * 2,
      };
    });
    persistState(get());
  },
  markSurahCompleted: (surahNumber: number) => {
    set((state) => {
      const prevSurah = state.surahProgress[surahNumber] || {
        ayahsStatus: {},
        stars: 0,
        isCompleted: false,
      };
      return {
        surahProgress: {
          ...state.surahProgress,
          [surahNumber]: {
            ...prevSurah,
            stars: Math.max(prevSurah.stars, 3),
            isCompleted: true,
          },
        },
        stars: state.stars + 5,
        gems: state.gems + 10,
      };
    });
    get().markDailyStepDone(get().activeProfileId, 'listen');
    persistState(get());
  },

  downloadedSurahs: {},
  setSurahDownloaded: (surahNumber, downloaded) => {
    set((state) => ({
      downloadedSurahs: {
        ...state.downloadedSurahs,
        [surahNumber]: downloaded,
      },
    }));
    persistState(get());
  },
  clearAllDownloadedSurahs: () => {
    set({ downloadedSurahs: {} });
    persistState(get());
  },

  lastReadMushafPage: 1,
  setLastReadMushafPage: (page: number) => {
    const validPage = Math.max(1, Math.min(604, page));
    set({ lastReadMushafPage: validPage });
    persistState(get());
  },

  mushafBookmarks: [1],
  toggleMushafBookmark: (page: number) => {
    const validPage = Math.max(1, Math.min(604, page));
    const { mushafBookmarks } = get();
    const exists = mushafBookmarks.includes(validPage);
    const updated = exists
      ? mushafBookmarks.filter((p) => p !== validPage)
      : [...mushafBookmarks, validPage].sort((a, b) => a - b);
    set({ mushafBookmarks: updated });
    persistState(get());
  },

  hadithProgress: {},
  completeHadith: (hadithId, stars) => {
    set((state) => ({
      hadithProgress: {
        ...state.hadithProgress,
        [hadithId]: { completed: true, stars },
      },
      stars: state.stars + stars,
      gems: state.gems + 3,
    }));
    persistState(get());
  },

  storyProgress: {},
  completeStory: (storyId, quizScore) => {
    set((state) => ({
      storyProgress: {
        ...state.storyProgress,
        [storyId]: { completed: true, quizScore, lessonCardUnlocked: true },
      },
      stars: state.stars + 3,
      gems: state.gems + 5,
    }));
    get().markDailyStepDone(get().activeProfileId, 'learn');
    persistState(get());
  },

  scenarioProgress: {},
  completeScenario: (buildingId) => {
    set((state) => ({
      scenarioProgress: {
        ...state.scenarioProgress,
        [buildingId]: { completed: true },
      },
      stars: state.stars + 2,
      gems: state.gems + 4,
    }));
    persistState(get());
  },

  dailyStepsDone: {},
  markDailyStepDone: (profileId, stepId) => {
    const today = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const pid = profileId || get().activeProfileId || (get().profiles?.[0]?.id ?? 'default');
    const allProfileSteps = get().dailyStepsDone[pid] || {};
    const todayList = allProfileSteps[today] || [];

    if (todayList.includes(stepId)) return;

    const newTodayList = [...todayList, stepId];
    const updated = {
      ...get().dailyStepsDone,
      [pid]: {
        ...allProfileSteps,
        [today]: newTodayList,
      },
    };

    const isAllThree = newTodayList.length === 3;
    const bonusStars = isAllThree ? 10 : 3;
    const bonusGems = isAllThree ? 3 : 1;

    set((state) => ({
      dailyStepsDone: updated,
      stars: state.stars + bonusStars,
      gems: state.gems + bonusGems,
    }));
    persistState(get());
  },
  getDailyStepsDone: (profileId) => {
    const today = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const pid = profileId || get().activeProfileId || (get().profiles?.[0]?.id ?? 'default');
    return get().dailyStepsDone[pid]?.[today] || [];
  },

  dailyHabitsDone: {},
  toggleDailyHabit: (habitId) => {
    set((state) => {
      const current = !!state.dailyHabitsDone[habitId];
      const next = !current;
      return {
        dailyHabitsDone: { ...state.dailyHabitsDone, [habitId]: next },
        stars: next ? state.stars + 1 : state.stars,
        gems: next ? state.gems + 2 : state.gems,
      };
    });
    persistState(get());
  },

  stars: 0,
  gems: 0,
  addStars: (count) => {
    set((state) => ({ stars: state.stars + count }));
    persistState(get());
  },
  addGems: (count) => {
    set((state) => ({ gems: state.gems + count }));
    persistState(get());
  },
  unlockedStickers: [],
  unlockSticker: (id) => {
    set((state) => ({
      unlockedStickers: state.unlockedStickers.includes(id)
        ? state.unlockedStickers
        : [...state.unlockedStickers, id],
    }));
    persistState(get());
  },

  weeklyChallenges: [
    {
      id: 'challenge-salam',
      titleAr: 'إفشاء السلام والمحبة',
      titleEn: 'Spread the Salam',
      descAr: 'قل «السلام عليكم ورحمة الله وبركاته» بابتسامة لـ ٣ أشخاص اليوم',
      descEn: 'Say "As-salamu alaykum" with a warm smile to 3 people today',
      valueId: 'kindness',
      emoji: '🕊️',
      gemReward: 5,
      completedByChild: false,
      confirmedByParent: false,
    },
    {
      id: 'challenge-help-parents',
      titleAr: 'مساعدة الوالدين في البيت',
      titleEn: 'Help Mother & Father',
      descAr: 'بادر بمساعدة والدتك أو والدك في ترتيب غرفتك أو حمل الأغراض بفرح',
      descEn: 'Proactively help your parents tidy up or carry groceries with joy',
      valueId: 'parents',
      emoji: '🏡',
      gemReward: 8,
      completedByChild: false,
      confirmedByParent: false,
    },
    {
      id: 'challenge-generosity',
      titleAr: 'الكلمة الطيبة والصدقة',
      titleEn: 'Kind Words & Sharing',
      descAr: 'شارك لعبتك أو وجبتك الخفيفة مع أخيك أو صديقك وقل له كلمة تسعده',
      descEn: 'Share your toy or snack with a sibling or friend and cheer them up',
      valueId: 'sharing',
      emoji: '🎁',
      gemReward: 6,
      completedByChild: false,
      confirmedByParent: false,
    },
  ],
  completeWeeklyChallenge: (id) => {
    set((state) => ({
      weeklyChallenges: state.weeklyChallenges.map((c) =>
        c.id === id ? { ...c, completedByChild: true } : c
      ),
      stars: state.stars + 2,
    }));
    persistState(get());
  },
  confirmWeeklyChallenge: (id) => {
    set((state) => {
      const challenge = state.weeklyChallenges.find((c) => c.id === id);
      const bonusGems = challenge ? challenge.gemReward : 5;
      return {
        weeklyChallenges: state.weeklyChallenges.map((c) =>
          c.id === id ? { ...c, completedByChild: true, confirmedByParent: true } : c
        ),
        gems: state.gems + bonusGems,
        stars: state.stars + 3,
      };
    });
    persistState(get());
  },
  unlockedBadges: [],
  unlockBadge: (id) => {
    set((state) => ({
      unlockedBadges: state.unlockedBadges.includes(id)
        ? state.unlockedBadges
        : [...state.unlockedBadges, id],
    }));
    persistState(get());
  },
  selectedAvatarId: 'av-boy1',
  setSelectedAvatarId: (id) => {
    const { profiles, activeProfileId } = get();
    const updatedProfiles = profiles.map((p) =>
      p.id === activeProfileId ? { ...p, avatar: id } : p
    );
    set({ selectedAvatarId: id, profiles: updatedProfiles });
    persistState(get());
  },

  streakCount: 0,
  lastActiveDate: '',
  freezesLeft: 2,
  recordDailyActivity: () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastActiveDate, streakCount, freezesLeft } = get();
    if (lastActiveDate === today) return;

    if (!lastActiveDate) {
      set({
        lastActiveDate: today,
        streakCount: 1,
        gems: get().gems + 5,
      });
      persistState(get());
      return;
    }

    const last = new Date(lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      set({
        lastActiveDate: today,
        streakCount: streakCount + 1,
        gems: get().gems + 5,
      });
    } else if (diffDays === 2 && freezesLeft > 0) {
      set({
        lastActiveDate: today,
        freezesLeft: freezesLeft - 1,
        streakCount: streakCount + 1,
        gems: get().gems + 5,
      });
    } else {
      set({
        lastActiveDate: today,
        streakCount: 1,
        gems: get().gems + 5,
      });
    }
    persistState(get());
  },

  parentSettings: {
    dailyLimitMin: 0,
    quietHoursEnabled: false,
    reciterId: 'alafasy',
    showEnglishTranslation: false,
    showSimpleTafsir: true,
    translationSource: 'sahih' as const,
    madhhab: 'shafii' as const,
    prayerCity: 'cairo',
    adhanAudioEnabled: false,
    bedtimeLockEnabled: false,
    bedtimeStart: '20:30',
    bedtimeEnd: '06:00',
    hasCustomPin: false,
    pin: '',
    pinHash: '',
    pinSalt: '',
    recoveryCodeHash: '',
    recoveryCodeSalt: '',
    pinFailedAttempts: 0,
    pinLockoutUntil: null,
    audioStorageLimitMB: 200,
    analyticsEnabled: true,
    soundEffectsEnabled: true,
  },
  updateParentSettings: (settings) => {
    set((state) => ({
      parentSettings: { ...state.parentSettings, ...settings },
    }));
    persistState(get());
  },
  setParentPin: (newPin: string) => {
    const check = securityCryptoService.validatePinFormat(newPin);
    if (!check.valid) {
      return {
        success: false,
        errorAr: check.errorAr,
        errorEn: check.errorEn,
      };
    }
    const { hash, salt } = securityCryptoService.hashPin(newPin);
    const recoveryCode = securityCryptoService.generateRecoveryCode();
    const recCrypto = securityCryptoService.hashRecoveryCode(recoveryCode);

    set((state) => ({
      parentSettings: {
        ...state.parentSettings,
        hasCustomPin: true,
        pin: '••••',
        pinHash: hash,
        pinSalt: salt,
        recoveryCodeHash: recCrypto.hash,
        recoveryCodeSalt: recCrypto.salt,
        pinFailedAttempts: 0,
        pinLockoutUntil: null,
      },
    }));
    persistState(get());
    return { success: true, recoveryCode };
  },
  verifyParentPin: (inputPin: string) => {
    const { parentSettings } = get();
    const lockout = securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    );
    if (lockout.isLocked) return false;
    if (!parentSettings.pinHash || !parentSettings.pinSalt) return false;

    const isCorrect = securityCryptoService.verifyPin(inputPin, parentSettings.pinHash, parentSettings.pinSalt);
    if (isCorrect) {
      get().resetPinAttempts();
    }
    return isCorrect;
  },
  verifyRecoveryCode: (inputCode: string) => {
    const { parentSettings } = get();
    const lockout = securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    );
    if (lockout.isLocked) return false;
    if (!parentSettings.recoveryCodeHash || !parentSettings.recoveryCodeSalt) return false;

    const isCorrect = securityCryptoService.verifyRecoveryCode(
      inputCode,
      parentSettings.recoveryCodeHash,
      parentSettings.recoveryCodeSalt
    );
    if (isCorrect) {
      get().resetPinAttempts();
    }
    return isCorrect;
  },
  recordFailedPinAttempt: () => {
    const { parentSettings } = get();
    const newCount = (parentSettings.pinFailedAttempts || 0) + 1;
    const lockoutUntil = securityCryptoService.calculateNextLockout(newCount);
    set((state) => ({
      parentSettings: {
        ...state.parentSettings,
        pinFailedAttempts: newCount,
        pinLockoutUntil: lockoutUntil,
      },
    }));
    persistState(get());
    return securityCryptoService.checkLockout(newCount, lockoutUntil);
  },
  resetPinAttempts: () => {
    set((state) => ({
      parentSettings: {
        ...state.parentSettings,
        pinFailedAttempts: 0,
        pinLockoutUntil: null,
      },
    }));
    persistState(get());
  },
  resetAllAppData: async () => {
    try {
      await AsyncStorage.clear();
      await localDbService.wipeAllData();
      voiceRecordService.clearRecording();
      if (typeof window !== 'undefined') {
        if (window.localStorage) {
          window.localStorage.clear();
        }
        if (window.sessionStorage) {
          window.sessionStorage.clear();
        }
        if ('caches' in window) {
          try {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map((k) => caches.delete(k)));
          } catch {
            // ignore cache clear error
          }
        }
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((r) => r.unregister()));
          } catch {
            // ignore sw unregister error
          }
        }
      }
    } catch {
      // ignore
    }
    set({
      hasCompletedOnboarding: false,
      isGuestMode: false,
      profiles: [],
      activeProfileId: '',
      profilesProgress: {},
      surahProgress: {},
      hadithProgress: {},
      storyProgress: {},
      scenarioProgress: {},
      dailyHabitsDone: {},
      dailyStepsDone: {},
      downloadedSurahs: {},
      lastReadMushafPage: 1,
      mushafBookmarks: [1],
      unlockedStickers: [],
      unlockedBadges: [],
      selectedAvatarId: 'av-boy1',
      timeSpentTodaySec: 0,
      dailyLimitDismissed: false,
      stars: 0,
      gems: 0,
      streakCount: 0,
      lastActiveDate: '',
      parentSettings: {
        dailyLimitMin: 0,
        quietHoursEnabled: false,
        reciterId: 'alafasy',
        showEnglishTranslation: false,
        showSimpleTafsir: true,
        translationSource: 'sahih',
        madhhab: 'shafii',
        prayerCity: 'cairo',
        adhanAudioEnabled: false,
        bedtimeLockEnabled: false,
        bedtimeStart: '20:30',
        bedtimeEnd: '06:00',
        hasCustomPin: false,
        pin: '',
        pinHash: '',
        pinSalt: '',
        recoveryCodeHash: '',
        recoveryCodeSalt: '',
        pinFailedAttempts: 0,
        pinLockoutUntil: null,
        audioStorageLimitMB: 200,
        analyticsEnabled: true,
        soundEffectsEnabled: true,
      },
      gratitudeEntries: [],
    });
  },

  timeSpentTodaySec: 0,
  dailyLimitDismissed: false,
  incrementTimeSpent: (sec) => {
    set((state) => ({ timeSpentTodaySec: state.timeSpentTodaySec + sec }));
  },
  resetDailyTimeSpentIfNewDay: () => {
    const today = new Date().toISOString().split('T')[0];
    if (get().lastActiveDate !== today) {
      set({ timeSpentTodaySec: 0, dailyLimitDismissed: false });
    }
  },
  setDailyLimitDismissed: (dailyLimitDismissed) => {
    set({ dailyLimitDismissed });
  },
  extendDailyLimit: (extraMinutes) => {
    set((state) => ({
      parentSettings: {
        ...state.parentSettings,
        dailyLimitMin: state.parentSettings.dailyLimitMin + extraMinutes,
      },
      dailyLimitDismissed: true,
    }));
    persistState(get());
  },

  gratitudeEntries: [],
  addGratitudeEntry: (entry) => {
    const newEntry = {
      id: 'gratitude_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...entry,
    };
    set((state) => ({
      gratitudeEntries: [newEntry, ...state.gratitudeEntries],
      stars: state.stars + 2,
      gems: state.gems + 3,
    }));
    persistState(get());
  },

  isHydrated: false,
  hydrate: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const activeId = parsed.activeProfileId || (parsed.profiles?.[0]?.id ?? '');
        let profilesProgress = parsed.profilesProgress || {};
        if (activeId && !profilesProgress[activeId]) {
          profilesProgress[activeId] = {
            surahProgress: parsed.surahProgress || {},
            hadithProgress: parsed.hadithProgress || {},
            storyProgress: parsed.storyProgress || {},
            scenarioProgress: parsed.scenarioProgress || {},
            dailyHabitsDone: parsed.dailyHabitsDone || {},
            stars: parsed.stars ?? 0,
            gems: parsed.gems ?? 0,
            streakCount: parsed.streakCount ?? 0,
            lastActiveDate: parsed.lastActiveDate || '',
            unlockedStickers: parsed.unlockedStickers || [],
            unlockedBadges: parsed.unlockedBadges || [],
            selectedAvatarId: parsed.selectedAvatarId || 'av-boy1',
            gratitudeEntries: parsed.gratitudeEntries || [],
            lastReadMushafPage: parsed.lastReadMushafPage ?? 1,
            mushafBookmarks: parsed.mushafBookmarks ?? [1],
          };
        }
        const dailyStepsDone = parsed.dailyStepsDone || {};
        const lastReadMushafPage = parsed.lastReadMushafPage ?? 1;
        const mushafBookmarks = parsed.mushafBookmarks ?? [1];
        set({ ...parsed, profilesProgress, dailyStepsDone, lastReadMushafPage, mushafBookmarks, isHydrated: true });
        return;
      }
    } catch {
      // ignore
    } finally {
      set({ isHydrated: true });
    }
  },

  exportEncryptedBackup: (passphrase: string) => {
    const state = get();
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      profilesProgress: state.profilesProgress,
      parentSettings: {
        dailyLimitMin: state.parentSettings.dailyLimitMin,
        quietHoursEnabled: state.parentSettings.quietHoursEnabled,
        reciterId: state.parentSettings.reciterId,
        showEnglishTranslation: state.parentSettings.showEnglishTranslation,
        showSimpleTafsir: state.parentSettings.showSimpleTafsir,
        translationSource: state.parentSettings.translationSource,
        madhhab: state.parentSettings.madhhab,
        prayerCity: state.parentSettings.prayerCity,
        adhanAudioEnabled: state.parentSettings.adhanAudioEnabled,
        bedtimeLockEnabled: state.parentSettings.bedtimeLockEnabled,
        bedtimeStart: state.parentSettings.bedtimeStart,
        bedtimeEnd: state.parentSettings.bedtimeEnd,
        hasCustomPin: state.parentSettings.hasCustomPin ?? Boolean(state.parentSettings.pinHash),
        pin: '••••',
        pinHash: state.parentSettings.pinHash || '',
        pinSalt: state.parentSettings.pinSalt || '',
        recoveryCodeHash: state.parentSettings.recoveryCodeHash || '',
        recoveryCodeSalt: state.parentSettings.recoveryCodeSalt || '',
      },
      gratitudeEntries: state.gratitudeEntries,
    };
    const jsonStr = JSON.stringify(payload);
    return securityCryptoService.encryptBackup(jsonStr, passphrase);
  },

  importEncryptedBackup: (envelope: EncryptedBackupEnvelope, passphrase: string) => {
    // 1. Authenticated decryption
    const decryptResult = securityCryptoService.decryptBackup(envelope, passphrase);
    if (!decryptResult.success || !decryptResult.dataJson) {
      return {
        success: false,
        errorAr: decryptResult.errorAr || 'فشل فك التشفير: كلمة المرور غير صحيحة.',
        errorEn: decryptResult.errorEn || 'Decryption failed: Incorrect passphrase.',
      };
    }

    // 2. Strict schema & prototype pollution validation
    const validationResult = backupValidationService.validate(decryptResult.dataJson);
    if (!validationResult.valid || !validationResult.sanitizedData) {
      return {
        success: false,
        errorAr: validationResult.errorAr || 'ملف النسخة الاحتياطية غير صالح.',
        errorEn: validationResult.errorEn || 'Invalid backup schema or corrupted data.',
      };
    }

    // 3. Hydrate state safely
    return get().restoreValidatedData(validationResult.sanitizedData);
  },

  restoreValidatedData: (data: ValidatedBackupData) => {
    const activeId = data.activeProfileId;
    const activeProg = data.profilesProgress[activeId] || {};

    set((state) => ({
      profiles: data.profiles,
      activeProfileId: data.activeProfileId,
      profilesProgress: data.profilesProgress,
      surahProgress: activeProg.surahProgress || {},
      hadithProgress: activeProg.hadithProgress || {},
      storyProgress: activeProg.storyProgress || {},
      scenarioProgress: activeProg.scenarioProgress || {},
      dailyHabitsDone: activeProg.dailyHabitsDone || {},
      unlockedStickers: activeProg.unlockedStickers || [],
      unlockedBadges: activeProg.unlockedBadges || [],
      selectedAvatarId: activeProg.selectedAvatarId || data.profiles[0]?.avatar || 'av-boy1',
      parentSettings: {
        ...state.parentSettings,
        ...data.parentSettings,
      },
      gratitudeEntries: data.gratitudeEntries || [],
      stars: activeProg.stars ?? state.stars,
      gems: activeProg.gems ?? state.gems,
      streakCount: activeProg.streakCount ?? state.streakCount,
      lastReadMushafPage: activeProg.lastReadMushafPage ?? state.lastReadMushafPage,
      mushafBookmarks: activeProg.mushafBookmarks ?? state.mushafBookmarks,
    }));
    persistState(get());

    return {
      success: true,
      profileCount: data.profiles.length,
    };
  },
}));
