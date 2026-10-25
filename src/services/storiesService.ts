// Stories Service for Prophet Stories (B4)
// Stores read records in store 'stories', tracks 5/10/15/25 badges with sprout rewards

import { localDbService } from './localDbService';
import { rewardsService } from './rewardsService';
import { rawdaAnalytics } from './rawdaAnalyticsService';

export interface StoryReadRecord {
  childId: string;
  storyId: string;
  readAt: string;
  readCount: number;
}

export interface StoryBadgeConfig {
  threshold: number;
  badgeId: string;
  titleArabic: string;
  rewardSprouts: number;
}

export const STORY_BADGES: StoryBadgeConfig[] = [
  { threshold: 5, badgeId: 'story_badge_5', titleArabic: 'الْقَارِئُ الصَّغِيرُ (٥ قِصَصٍ)', rewardSprouts: 20 },
  { threshold: 10, badgeId: 'story_badge_10', titleArabic: 'الْبَاحِثُ النَّشِيطُ (١٠ قِصَصٍ)', rewardSprouts: 30 },
  { threshold: 15, badgeId: 'story_badge_15', titleArabic: 'مُحِبُّ الْأَنْبِيَاءِ (١٥ قِصَّةً)', rewardSprouts: 40 },
  { threshold: 25, badgeId: 'story_badge_25', titleArabic: 'خَاتِمُ قِصَصِ الْأَنْبِيَاءِ (٢٥ قِصَّةً)', rewardSprouts: 60 },
];

class StoriesService {
  /**
   * Get all read stories for a child
   */
  async getReadStories(childId: string): Promise<Record<string, StoryReadRecord>> {
    const list = await localDbService.getAllForChild<StoryReadRecord>('stories', childId);
    const map: Record<string, StoryReadRecord> = {};
    for (const r of list) {
      if (r && r.storyId) {
        map[r.storyId] = r;
      }
    }
    return map;
  }

  /**
   * Mark story as read (only called when last page reached or audio >= 90%)
   */
  async markStoryRead(
    childId: string,
    storyId: string
  ): Promise<{
    firstTime: boolean;
    totalRead: number;
    newBadge?: StoryBadgeConfig;
  }> {
    const readMap = await this.getReadStories(childId);
    const existing = readMap[storyId];
    const isFirstTime = !existing;

    const updatedRecord: StoryReadRecord = {
      childId,
      storyId,
      readAt: new Date().toISOString(),
      readCount: (existing?.readCount || 0) + 1,
    };

    await localDbService.set('stories', childId, storyId, updatedRecord);

    rawdaAnalytics.logEvent('story_read', {
      storyId,
      firstTime: isFirstTime,
      readCount: updatedRecord.readCount,
    });

    if (isFirstTime) {
      // First completion reward
      await rewardsService.addSprouts(
        childId,
        10,
        'story_read',
        `${childId}:story:${storyId}`
      );
    }

    // Recount total unique stories read
    const allRecords = await this.getReadStories(childId);
    const totalRead = Object.keys(allRecords).length;

    // Check badges (5, 10, 15, 25)
    let newBadge: StoryBadgeConfig | undefined;
    for (const badge of STORY_BADGES) {
      if (totalRead >= badge.threshold) {
        const badgeKey = `${childId}:badge:${badge.badgeId}`;
        const hasBadge = await rewardsService.hasReward(childId, badgeKey);
        if (!hasBadge) {
          const rewardRes = await rewardsService.addSprouts(
            childId,
            badge.rewardSprouts,
            'story_badge',
            badgeKey
          );
          if (rewardRes.awarded) {
            newBadge = badge;
            rawdaAnalytics.logEvent('badge_earned', {
              badgeId: badge.badgeId,
              threshold: badge.threshold,
            });
          }
        }
      }
    }

    return {
      firstTime: isFirstTime,
      totalRead,
      newBadge,
    };
  }

  /**
   * Find next target badge and stories left
   */
  getNextBadgeTarget(currentTotal: number): { nextBadge: StoryBadgeConfig | null; remaining: number } {
    for (const b of STORY_BADGES) {
      if (currentTotal < b.threshold) {
        return { nextBadge: b, remaining: b.threshold - currentTotal };
      }
    }
    return { nextBadge: null, remaining: 0 };
  }
}

export const storiesService = new StoriesService();
