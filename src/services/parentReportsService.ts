// Parent Zone Reports & Feature Reset Service (B6)
// Compiles Hifz, Tasbih, Units, and Stories metrics per child
// Supports secure per-feature progress reset behind PIN

import { localDbService, StoreName } from './localDbService';
import { PRAYER_UNITS, UnitProgressRecord } from './unitsService';
import { TasbihDailyRecord } from './tasbihService';
import { SurahHifzRecord } from './hifzFadeService';
import { StoryReadRecord, STORY_BADGES } from './storiesService';

export interface ParentHifzReport {
  totalMemorized: number;
  totalMastered: number;
  totalReview: number;
  surahs: {
    surahId: number;
    memorized: number;
    mastered: number;
    review: number;
  }[];
}

export interface ParentTasbihReport {
  totalToday: number;
  totalWeek: number;
  completionsToday: number;
}

export interface ParentUnitReport {
  unitId: string;
  titleArabic: string;
  lessonsDone: number;
  totalLessons: number;
  certificateUnlocked: boolean;
  unlockedAt: string | null;
}

export interface ParentStoriesReport {
  readCount: number;
  totalStories: number;
  earnedBadges: string[];
}

export interface ParentDashboardData {
  hifz: ParentHifzReport;
  tasbih: ParentTasbihReport;
  units: ParentUnitReport[];
  stories: ParentStoriesReport;
}

class ParentReportsService {
  /**
   * Fetch all progress metrics for a child
   */
  async getChildReport(childId: string): Promise<ParentDashboardData> {
    const today = localDbService.getLocalDateString();

    // 1. Hifz
    const hifzRecords = await localDbService.getAllForChild<SurahHifzRecord>('hifz', childId);
    let totalMemorized = 0;
    let totalMastered = 0;
    let totalReview = 0;
    const surahs: ParentHifzReport['surahs'] = [];

    for (const rec of hifzRecords) {
      let m = 0;
      let mast = 0;
      let rev = 0;
      for (const v of Object.values(rec.verses || {})) {
        if (v.color === 'memorized') m++;
        else if (v.color === 'mastered') mast++;
        else if (v.color === 'review') rev++;
      }
      totalMemorized += m;
      totalMastered += mast;
      totalReview += rev;
      if (m > 0 || mast > 0 || rev > 0) {
        surahs.push({
          surahId: rec.surahId,
          memorized: m,
          mastered: mast,
          review: rev,
        });
      }
    }

    // 2. Tasbih
    const tasbihRecords = await localDbService.getAllForChild<TasbihDailyRecord>('tasbih', childId);
    let totalToday = 0;
    let totalWeek = 0;
    let completionsToday = 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoStr = localDbService.getLocalDateString(oneWeekAgo);

    for (const rec of tasbihRecords) {
      const sumForDay = Object.values(rec.totals || {}).reduce((a, b) => a + b, 0);
      if (rec.date === today) {
        totalToday += sumForDay;
        completionsToday += rec.completions || 0;
      }
      if (rec.date >= weekAgoStr) {
        totalWeek += sumForDay;
      }
    }

    // 3. Units
    const unitsList: ParentUnitReport[] = [];
    for (const [uId, cfg] of Object.entries(PRAYER_UNITS)) {
      const uRec = await localDbService.get<UnitProgressRecord>('units', childId, uId);
      const totalLessons = cfg.lessons.length;
      let done = 0;
      if (uRec && uRec.lessons) {
        done = cfg.lessons.filter((l) => uRec.lessons[l.id]?.status === 'done').length;
      }
      unitsList.push({
        unitId: uId,
        titleArabic: cfg.titleArabic,
        lessonsDone: done,
        totalLessons,
        certificateUnlocked: Boolean(uRec?.certificate?.unlockedAt),
        unlockedAt: uRec?.certificate?.unlockedAt || null,
      });
    }

    // 4. Stories
    const storyRecords = await localDbService.getAllForChild<StoryReadRecord>('stories', childId);
    const readCount = storyRecords.length;
    const earnedBadges: string[] = [];

    for (const b of STORY_BADGES) {
      if (readCount >= b.threshold) {
        earnedBadges.push(b.titleArabic);
      }
    }

    return {
      hifz: {
        totalMemorized,
        totalMastered,
        totalReview,
        surahs,
      },
      tasbih: {
        totalToday,
        totalWeek,
        completionsToday,
      },
      units: unitsList,
      stories: {
        readCount,
        totalStories: 25,
        earnedBadges,
      },
    };
  }

  /**
   * Reset feature progress for a child
   */
  async resetFeature(childId: string, featureStore: StoreName): Promise<void> {
    await localDbService.resetChildStore(featureStore, childId);
  }
}

export const parentReportsService = new ParentReportsService();
