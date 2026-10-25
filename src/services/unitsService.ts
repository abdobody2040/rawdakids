// Units & Journey Service for Wudu and Salah (B3)
// Config-driven lessons, unlock chain, idempotent sprout rewards, and client-side certificates

import { localDbService } from './localDbService';
import { rewardsService } from './rewardsService';
import { rawdaAnalytics } from './rawdaAnalyticsService';

export interface UnitLesson {
  id: string;
  order: number;
  titleArabic: string;
  subtitleArabic: string;
  route: string;
}

export interface UnitConfig {
  id: string;
  titleArabic: string;
  descriptionArabic: string;
  icon: string;
  badgeSprouts: number;
  lessons: UnitLesson[];
}

export const PRAYER_UNITS: Record<string, UnitConfig> = {
  wudu_journey: {
    id: 'wudu_journey',
    titleArabic: 'رِحْلَةُ الْوُضُوءِ',
    descriptionArabic: 'عشر خطوات مباركة للطهارة كما توضأ حبيبنا محمد ﷺ',
    icon: 'water',
    badgeSprouts: 50,
    lessons: [
      { id: 'wudu_1', order: 1, titleArabic: 'النِّيَّةُ وَالتَّسْمِيَةُ', subtitleArabic: 'القصد بالقلب وقول باسم الله', route: '/prayer/wudu?step=1' },
      { id: 'wudu_2', order: 2, titleArabic: 'غَسْلُ الْكَفَّيْنِ', subtitleArabic: 'غسل الكفين ثلاث مرات', route: '/prayer/wudu?step=2' },
      { id: 'wudu_3', order: 3, titleArabic: 'الْمَضْمَضَةُ', subtitleArabic: 'إدارة الماء في الفم ثلاثاً', route: '/prayer/wudu?step=3' },
      { id: 'wudu_4', order: 4, titleArabic: 'الِاسْتِنْشَاقُ', subtitleArabic: 'جذب الماء بالأنف بلطف', route: '/prayer/wudu?step=4' },
      { id: 'wudu_5', order: 5, titleArabic: 'الِاسْتِنْثَارُ', subtitleArabic: 'إخراج الماء من الأنف', route: '/prayer/wudu?step=5' },
      { id: 'wudu_6', order: 6, titleArabic: 'غَسْلُ الْوَجْهِ', subtitleArabic: 'من منابت الشعر إلى الذقن', route: '/prayer/wudu?step=6' },
      { id: 'wudu_7', order: 7, titleArabic: 'غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ', subtitleArabic: 'بدءاً باليمنى ثم اليسرى', route: '/prayer/wudu?step=7' },
      { id: 'wudu_8', order: 8, titleArabic: 'مَسْحُ الرَّأْسِ', subtitleArabic: 'مسح شعر الرأس مقبلاً ومدبراً', route: '/prayer/wudu?step=8' },
      { id: 'wudu_9', order: 9, titleArabic: 'مَسْحُ الْأُذُنَيْنِ', subtitleArabic: 'بباطن السبابتين وظاهر الإبهامين', route: '/prayer/wudu?step=9' },
      { id: 'wudu_10', order: 10, titleArabic: 'غَسْلُ الرِّجْلَيْنِ إِلَى الْكَعْبَيْنِ', subtitleArabic: 'تخليل الأصابع حتى الكعبين', route: '/prayer/wudu?step=10' },
    ],
  },
  salah_journey: {
    id: 'salah_journey',
    titleArabic: 'رِحْلَتِي مَعَ الصَّلَاةِ',
    descriptionArabic: 'تعلم أركان الصلاة وهيئاتها الخاشعة خطوة بخطوة',
    icon: 'sunny',
    badgeSprouts: 75,
    lessons: [
      { id: 'salah_1', order: 1, titleArabic: 'تَكْبِيرَةُ الْإِحْرَامِ وَالْقِيَامُ', subtitleArabic: 'استقبال القبلة ورفع اليدين', route: '/prayer/salah?step=1' },
      { id: 'salah_2', order: 2, titleArabic: 'قِرَاءَةُ الْفَاتِحَةِ وَسُورَةٍ', subtitleArabic: 'قراءة القرآن بتأنٍ وخشوع', route: '/prayer/salah?step=2' },
      { id: 'salah_3', order: 3, titleArabic: 'الرُّكُوعُ وَالِاعْتِدَالُ', subtitleArabic: 'تسبيح الله العظيم باطمئنان', route: '/prayer/salah?step=3' },
      { id: 'salah_4', order: 4, titleArabic: 'السُّجُودُ عَلَى ٧ أَعْضَاءٍ', subtitleArabic: 'أقرب ما يكون العبد من ربه', route: '/prayer/salah?step=4' },
      { id: 'salah_5', order: 5, titleArabic: 'الْجُلُوسُ بَيْنَ السَّجْدَتَيْنِ', subtitleArabic: 'الدعاء بالمغفرة والرحمة', route: '/prayer/salah?step=5' },
      { id: 'salah_6', order: 6, titleArabic: 'التَّشَهُّدُ وَالتَّسْلِيمُ', subtitleArabic: 'الصلاة على النبي ﷺ والسلام', route: '/prayer/salah?step=6' },
    ],
  },
};

export interface LessonProgress {
  status: 'locked' | 'available' | 'done';
  doneAt?: string;
  attempts: number;
}

export interface UnitProgressRecord {
  childId: string;
  unitId: string;
  lessons: Record<string, LessonProgress>;
  certificate: {
    unlockedAt: string | null;
  };
}

class UnitsService {
  /**
   * Get progress for a unit, initializing lesson 1 as 'available'
   */
  async getUnitProgress(childId: string, unitId: string): Promise<UnitProgressRecord> {
    const config = PRAYER_UNITS[unitId];
    if (!config) {
      throw new Error(`Unit ${unitId} not found`);
    }

    const stored = await localDbService.get<UnitProgressRecord>('units', childId, unitId);
    if (stored) {
      // Ensure all current lessons exist in record (handling future lessons gracefully)
      for (let i = 0; i < config.lessons.length; i++) {
        const lId = config.lessons[i].id;
        if (!stored.lessons[lId]) {
          const prevLessonDone = i > 0 ? stored.lessons[config.lessons[i - 1].id]?.status === 'done' : false;
          stored.lessons[lId] = {
            status: i === 0 || prevLessonDone ? 'available' : 'locked',
            attempts: 0,
          };
        }
      }
      return stored;
    }

    // Initialize initial state: Lesson 1 is available, others locked
    const lessonsRecord: Record<string, LessonProgress> = {};
    config.lessons.forEach((l, idx) => {
      lessonsRecord[l.id] = {
        status: idx === 0 ? 'available' : 'locked',
        attempts: 0,
      };
    });

    const initialRecord: UnitProgressRecord = {
      childId,
      unitId,
      lessons: lessonsRecord,
      certificate: {
        unlockedAt: null,
      },
    };

    await localDbService.set('units', childId, unitId, initialRecord);
    return initialRecord;
  }

  /**
   * Mark a lesson completed and unlock the next lesson
   */
  async completeLesson(
    childId: string,
    unitId: string,
    lessonId: string
  ): Promise<{
    rewardGiven: boolean;
    certificateUnlocked: boolean;
    nextLessonId?: string;
  }> {
    const config = PRAYER_UNITS[unitId];
    const record = await this.getUnitProgress(childId, unitId);

    const lesson = record.lessons[lessonId] || { status: 'available', attempts: 0 };
    const isFirstCompletion = lesson.status !== 'done';

    lesson.status = 'done';
    lesson.doneAt = new Date().toISOString();
    lesson.attempts = (lesson.attempts || 0) + 1;
    record.lessons[lessonId] = lesson;

    rawdaAnalytics.logEvent('unit_lesson_completed', {
      unitId,
      lessonId,
      firstTime: isFirstCompletion,
    });

    // Award reward on first completion
    let rewardGiven = false;
    if (isFirstCompletion) {
      const idempotencyKey = `${childId}:${unitId}:${lessonId}`;
      const rewardResult = await rewardsService.addSprouts(
        childId,
        10, // 10 sprouts per completed lesson
        'unit_lesson',
        idempotencyKey
      );
      rewardGiven = rewardResult.awarded;
    }

    // Unlock next lesson
    const currentIdx = config.lessons.findIndex((l) => l.id === lessonId);
    let nextLessonId: string | undefined;
    if (currentIdx >= 0 && currentIdx < config.lessons.length - 1) {
      const nextLesson = config.lessons[currentIdx + 1];
      nextLessonId = nextLesson.id;
      if (record.lessons[nextLesson.id].status === 'locked') {
        record.lessons[nextLesson.id].status = 'available';
      }
    }

    // Check if entire unit is completed
    const allDone = config.lessons.every((l) => record.lessons[l.id]?.status === 'done');
    let certificateUnlocked = false;

    if (allDone && !record.certificate.unlockedAt) {
      record.certificate.unlockedAt = new Date().toISOString();
      certificateUnlocked = true;

      rawdaAnalytics.logEvent('certificate_unlocked', { unitId });

      // Award completion bonus sprouts
      await rewardsService.addSprouts(
        childId,
        config.badgeSprouts,
        'unit_complete',
        `${childId}:${unitId}:certificate`
      );
    }

    await localDbService.set('units', childId, unitId, record);
    return { rewardGiven, certificateUnlocked, nextLessonId };
  }

  /**
   * Helper to format Gregorian and approximate Hijri date
   */
  getFormattedDates(): { gregorian: string; hijri: string } {
    const now = new Date();
    const gregorian = new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(now);

    // Approximate Hijri format using Intl Islamic calendar
    let hijri = '';
    try {
      hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(now);
    } catch {
      hijri = '١٤٤٦ هـ';
    }

    return { gregorian, hijri };
  }
}

export const unitsService = new UnitsService();
