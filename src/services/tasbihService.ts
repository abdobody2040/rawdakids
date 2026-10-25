// Tasbih Service (B2)
// 5 verified Azkar, targets [3, 7, 33, 100], daily reward cap = 3, session persistence in IndexedDB store 'tasbih'

import { localDbService } from './localDbService';
import { rewardsService } from './rewardsService';
import { rawdaAnalytics } from './rawdaAnalyticsService';

export interface TasbihZikr {
  id: string;
  textArabic: string;
  transliteration: string;
  meaningAr: string;
  meaningEn: string;
  defaultTarget: number;
}

export const VERIFIED_AZKAR: TasbihZikr[] = [
  {
    id: 'subhanallah',
    textArabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhan Allah',
    meaningAr: 'تنزيه الله تعالى عن كل عيب ونقص',
    meaningEn: 'Glory be to Allah, above all imperfection',
    defaultTarget: 33,
  },
  {
    id: 'alhamdulillah',
    textArabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaningAr: 'الثناء والشكر كله لله رب العالمين',
    meaningEn: 'All praise and gratitude belong to Allah',
    defaultTarget: 33,
  },
  {
    id: 'allahuakbar',
    textArabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaningAr: 'الله أعظم وأجل من كل شيء',
    meaningEn: 'Allah is the Greatest above all things',
    defaultTarget: 33,
  },
  {
    id: 'la_ilaha_illa_allah',
    textArabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La Ilaha Illa Allah',
    meaningAr: 'لا معبود بحق إلا الله وحده لا شريك له',
    meaningEn: 'There is no deity worthy of worship except Allah',
    defaultTarget: 33,
  },
  {
    id: 'astaghfirullah',
    textArabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaningAr: 'طلب المغفرة والرحمة من الله الغفور الرحيم',
    meaningEn: 'I seek forgiveness from Allah the Most Forgiving',
    defaultTarget: 33,
  },
];

export const TASBIH_TARGETS = [3, 7, 33, 100] as const;

export interface TasbihDailyRecord {
  date: string; // YYYY-MM-DD
  totals: Record<string, number>;
  completions: number;
  lastSession: {
    azkarId: string;
    target: number;
    count: number;
    startedAt: string;
  };
}

class TasbihService {
  /**
   * Get active Azkar list filtered by age mode
   */
  getAzkarForAge(ageMode?: string): TasbihZikr[] {
    if (ageMode === '4-6') {
      return VERIFIED_AZKAR.slice(0, 3);
    }
    return VERIFIED_AZKAR;
  }

  /**
   * Get targets available for age mode
   */
  getTargetsForAge(ageMode?: string): number[] {
    if (ageMode === '4-6') {
      return [3, 7, 33];
    }
    return [3, 7, 33, 100];
  }

  /**
   * Load today's record and restore lastSession
   */
  async getDailyRecord(childId: string): Promise<TasbihDailyRecord> {
    const today = localDbService.getLocalDateString();
    const stored = await localDbService.get<TasbihDailyRecord>('tasbih', childId, today);

    if (stored && stored.date === today) {
      return stored;
    }

    // Try finding any previous day's record to retrieve lastSession
    const all = await localDbService.getAllForChild<TasbihDailyRecord>('tasbih', childId);
    const sorted = all.sort((a, b) => (b.date > a.date ? 1 : -1));
    const previous = sorted[0];

    const newRecord: TasbihDailyRecord = {
      date: today,
      totals: {},
      completions: 0,
      lastSession: previous?.lastSession || {
        azkarId: 'subhanallah',
        target: 33,
        count: 0,
        startedAt: new Date().toISOString(),
      },
    };

    await localDbService.set('tasbih', childId, today, newRecord);
    return newRecord;
  }

  /**
   * Save session progress
   */
  async saveSession(
    childId: string,
    azkarId: string,
    target: number,
    count: number
  ): Promise<TasbihDailyRecord> {
    const today = localDbService.getLocalDateString();
    const record = await this.getDailyRecord(childId);

    // If day changed mid-session, update to current day
    if (record.date !== today) {
      record.date = today;
      record.completions = 0;
      record.totals = {};
    }

    record.totals[azkarId] = (record.totals[azkarId] || 0) + 1;
    record.lastSession = {
      azkarId,
      target,
      count,
      startedAt: record.lastSession?.startedAt || new Date().toISOString(),
    };

    await localDbService.set('tasbih', childId, today, record);
    return record;
  }

  /**
   * Process completion when count reaches target
   */
  async handleTargetReached(
    childId: string,
    azkarId: string,
    target: number
  ): Promise<{ rewarded: boolean; totalCompletions: number; sproutsAwarded: number }> {
    const today = localDbService.getLocalDateString();
    const record = await this.getDailyRecord(childId);

    const completionNo = (record.completions || 0) + 1;
    record.completions = completionNo;

    rawdaAnalytics.logEvent('tasbih_completed', {
      azkarId,
      target,
      completionNo,
    });

    let sproutsAwarded = 0;
    let rewarded = false;

    // Daily reward cap: max 3 reward-giving completions per child per day
    if (completionNo <= 3) {
      const idempotencyKey = `${childId}:${today}:${azkarId}:${target}:${completionNo}`;
      const rewardResult = await rewardsService.addSprouts(
        childId,
        15, // 15 sprouts per tasbih round
        'tasbih_complete',
        idempotencyKey
      );
      if (rewardResult.awarded) {
        rewarded = true;
        sproutsAwarded = rewardResult.amount;
      }
    }

    await localDbService.set('tasbih', childId, today, record);
    return { rewarded, totalCompletions: completionNo, sproutsAwarded };
  }

  /**
   * Reset session count
   */
  async resetSession(childId: string, azkarId: string, target: number): Promise<void> {
    const today = localDbService.getLocalDateString();
    const record = await this.getDailyRecord(childId);
    record.lastSession = {
      azkarId,
      target,
      count: 0,
      startedAt: new Date().toISOString(),
    };
    await localDbService.set('tasbih', childId, today, record);
  }
}

export const tasbihService = new TasbihService();
