// Global Application Store for Noor Kids
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/i18n';
import { securityCryptoService, EncryptedBackupEnvelope } from '@/services/securityCryptoService';
import { backupValidationService, ValidatedBackupData } from '@/services/backupValidationService';

export type AgeBand = '4-6' | '7-9' | '10-13';

export interface ChildProfile {
  id: string;
  name: string;
  ageBand: AgeBand;
  avatar: string;
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
  completeOnboarding: () => void;

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
    pin: string;
    pinHash?: string;
    pinSalt?: string;
    pinFailedAttempts?: number;
    pinLockoutUntil?: number | null;
    audioStorageLimitMB?: number;
    analyticsEnabled?: boolean;
    soundEffectsEnabled?: boolean;
  };
  updateParentSettings: (settings: Partial<AppState['parentSettings']>) => void;
  setParentPin: (pin: string) => boolean;
  verifyParentPin: (pin: string) => boolean;
  recordFailedPinAttempt: () => { isLocked: boolean; remainingSeconds: number };
  resetPinAttempts: () => void;

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
    const updatedProfilesProgress = {
      ...state.profilesProgress,
      [state.activeProfileId]: currentActiveProgress,
    };

    const stateToSave = {
      language: state.language,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
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
  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
    persistState(get());
  },

  profiles: [
    {
      id: 'default-child',
      name: 'طارق',
      ageBand: '7-9',
      avatar: 'av-boy1',
    },
  ],
  activeProfileId: 'default-child',
  profilesProgress: {
    'default-child': {
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
      selectedAvatarId: 'av-boy1',
      gratitudeEntries: [],
      lastReadMushafPage: 1,
      mushafBookmarks: [1],
    },
  },

  getChildProgress: (id) => {
    const state = get();
    if (state.activeProfileId === id) {
      return {
        surahProgress: state.surahProgress,
        hadithProgress: state.hadithProgress,
        storyProgress: state.storyProgress,
        scenarioProgress: state.scenarioProgress,
        dailyHabitsDone: state.dailyHabitsDone,
        stars: state.stars,
        gems: state.gems,
        streakCount: state.streakCount,
        lastActiveDate: state.lastActiveDate,
        unlockedStickers: state.unlockedStickers,
        unlockedBadges: state.unlockedBadges,
        selectedAvatarId: state.selectedAvatarId,
        gratitudeEntries: state.gratitudeEntries,
      };
    }
    return state.profilesProgress[id] || createDefaultChildProgress('av-boy1');
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

    set({
      activeProfileId: nextId,
      profilesProgress: updatedProgressMap,
      surahProgress: targetProgress.surahProgress,
      hadithProgress: targetProgress.hadithProgress,
      storyProgress: targetProgress.storyProgress,
      scenarioProgress: targetProgress.scenarioProgress,
      dailyHabitsDone: targetProgress.dailyHabitsDone,
      stars: targetProgress.stars,
      gems: targetProgress.gems,
      streakCount: targetProgress.streakCount,
      lastActiveDate: targetProgress.lastActiveDate,
      unlockedStickers: targetProgress.unlockedStickers,
      unlockedBadges: targetProgress.unlockedBadges,
      selectedAvatarId: targetProgress.selectedAvatarId,
      gratitudeEntries: targetProgress.gratitudeEntries,
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
      [state.activeProfileId]: currentSnapshot,
      [id]: newChildProgress,
    };

    set({
      profiles: [...state.profiles, profile],
      activeProfileId: id,
      profilesProgress: updatedProgressMap,
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

    if (activeProfileId === id) {
      const nextActiveId = remaining[0].id;
      const targetProgress =
        updatedProgressMap[nextActiveId] ||
        createDefaultChildProgress(remaining[0].avatar);

      set({
        profiles: remaining,
        activeProfileId: nextActiveId,
        profilesProgress: updatedProgressMap,
        surahProgress: targetProgress.surahProgress,
        hadithProgress: targetProgress.hadithProgress,
        storyProgress: targetProgress.storyProgress,
        scenarioProgress: targetProgress.scenarioProgress,
        dailyHabitsDone: targetProgress.dailyHabitsDone,
        stars: targetProgress.stars,
        gems: targetProgress.gems,
        streakCount: targetProgress.streakCount,
        lastActiveDate: targetProgress.lastActiveDate,
        unlockedStickers: targetProgress.unlockedStickers,
        unlockedBadges: targetProgress.unlockedBadges,
        selectedAvatarId: targetProgress.selectedAvatarId,
        gratitudeEntries: targetProgress.gratitudeEntries,
      });
    } else {
      set({
        profiles: remaining,
        profilesProgress: updatedProgressMap,
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

    if (idToReset === activeProfileId) {
      set({
        profilesProgress: updatedProgressMap,
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
        gratitudeEntries: [],
        lastReadMushafPage: 1,
        mushafBookmarks: [1],
      });
    } else {
      set({
        profilesProgress: updatedProgressMap,
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

  streakCount: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  freezesLeft: 2,
  recordDailyActivity: () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastActiveDate, streakCount } = get();
    if (lastActiveDate !== today) {
      set({
        lastActiveDate: today,
        streakCount: streakCount + 1,
        gems: get().gems + 5,
      });
      persistState(get());
    }
  },

  parentSettings: (() => {
    const defaultCrypto = securityCryptoService.hashPin('1234', 'noor_kids_default_salt_v1');
    return {
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
      pin: '••••',
      pinHash: defaultCrypto.hash,
      pinSalt: defaultCrypto.salt,
      pinFailedAttempts: 0,
      pinLockoutUntil: null,
      audioStorageLimitMB: 200,
      analyticsEnabled: true,
      soundEffectsEnabled: true,
    };
  })(),
  updateParentSettings: (settings) => {
    set((state) => ({
      parentSettings: { ...state.parentSettings, ...settings },
    }));
    persistState(get());
  },
  setParentPin: (newPin: string) => {
    const check = securityCryptoService.validatePinFormat(newPin);
    if (!check.valid) return false;
    const { hash, salt } = securityCryptoService.hashPin(newPin);
    set((state) => ({
      parentSettings: {
        ...state.parentSettings,
        pin: '••••',
        pinHash: hash,
        pinSalt: salt,
        pinFailedAttempts: 0,
        pinLockoutUntil: null,
      },
    }));
    persistState(get());
    return true;
  },
  verifyParentPin: (inputPin: string) => {
    const { parentSettings } = get();
    const lockout = securityCryptoService.checkLockout(
      parentSettings.pinFailedAttempts || 0,
      parentSettings.pinLockoutUntil || null
    );
    if (lockout.isLocked) return false;

    let isCorrect = false;
    if (parentSettings.pinHash && parentSettings.pinSalt) {
      isCorrect = securityCryptoService.verifyPin(inputPin, parentSettings.pinHash, parentSettings.pinSalt);
    } else if (parentSettings.pin && parentSettings.pin !== '••••') {
      isCorrect = inputPin.trim() === parentSettings.pin;
      if (isCorrect) {
        get().setParentPin(inputPin);
      }
    }

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

  timeSpentTodaySec: 180,
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
        const activeId = parsed.activeProfileId || 'default-child';
        let profilesProgress = parsed.profilesProgress || {};
        if (!profilesProgress[activeId]) {
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
        const lastReadMushafPage = parsed.lastReadMushafPage ?? 1;
        const mushafBookmarks = parsed.mushafBookmarks ?? [1];
        set({ ...parsed, profilesProgress, lastReadMushafPage, mushafBookmarks, isHydrated: true });
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
        pin: '••••',
        pinHash: state.parentSettings.pinHash,
        pinSalt: state.parentSettings.pinSalt,
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
