// Global Application Store for Noor Kids
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/i18n';

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

export interface AppState {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  // Profiles
  profiles: ChildProfile[];
  activeProfileId: string;
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Omit<ChildProfile, 'id'>) => string;

  // Hifz & Quran Progress
  surahProgress: Record<number, SurahProgressItem>;
  setAyahStatus: (surahNumber: number, ayahNumber: number, status: HifzStatus) => void;
  addSurahStars: (surahNumber: number, stars: number) => void;
  downloadedSurahs: Record<number, boolean>;
  setSurahDownloaded: (surahNumber: number, downloaded: boolean) => void;

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
    pin: string;
  };
  updateParentSettings: (settings: Partial<AppState['parentSettings']>) => void;

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
}

const STORAGE_KEY = '@noor_kids_app_state_v1';

const persistState = async (state: AppState) => {
  try {
    const stateToSave = {
      language: state.language,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
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
      weeklyChallenges: state.weeklyChallenges,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch {
    // ignore
  }
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
  setActiveProfile: (activeProfileId) => {
    set({ activeProfileId });
    persistState(get());
  },
  addProfile: (newProfile) => {
    const id = 'child_' + Date.now();
    const profile: ChildProfile = { ...newProfile, id };
    set((state) => ({
      profiles: [...state.profiles, profile],
      activeProfileId: id,
    }));
    persistState(get());
    return id;
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
            isCompleted: true,
          },
        },
        stars: state.stars + stars,
        gems: state.gems + stars * 2,
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

  stars: 12,
  gems: 25,
  addStars: (count) => {
    set((state) => ({ stars: state.stars + count }));
    persistState(get());
  },
  addGems: (count) => {
    set((state) => ({ gems: state.gems + count }));
    persistState(get());
  },
  unlockedStickers: ['st-kaaba', 'st-quran', 'st-crescent', 'st-lantern'],
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
  unlockedBadges: ['badge-reciter'],
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

  parentSettings: {
    dailyLimitMin: 0,
    quietHoursEnabled: false,
    reciterId: 'alafasy',
    showEnglishTranslation: false,
    showSimpleTafsir: true,
    translationSource: 'sahih',
    pin: '1234',
  },
  updateParentSettings: (settings) => {
    set((state) => ({
      parentSettings: { ...state.parentSettings, ...settings },
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

  gratitudeEntries: [
    {
      id: 'gratitude-1',
      date: new Date().toISOString().split('T')[0],
      category: 'أهلي وأسرتي',
      emoji: '👨‍👩‍👧',
      text: 'الحمد لله على نعمة أمي وأبي اللذين يهتمان بي ويحبانني',
    },
  ],
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
        set({ ...parsed, isHydrated: true });
        return;
      }
    } catch {
      // ignore
    } finally {
      set({ isHydrated: true });
    }
  },
}));
