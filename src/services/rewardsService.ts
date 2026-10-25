// Rawda Kids Rewards Service (B0.2)
// Handles idempotent sprout rewards and short non-flashing celebrations

import { localDbService } from './localDbService';
import { useAppStore } from '@/store/useAppStore';
import { audioService } from './audioService';

export type RewardReason =
  | 'tasbih_complete'
  | 'unit_lesson'
  | 'unit_complete'
  | 'story_read'
  | 'story_badge';

export interface RewardRecord {
  idempotencyKey: string;
  amount: number;
  reason: RewardReason;
  awardedAt: string;
}

class RewardsService {
  /**
   * Idempotently award sprouts to a child.
   * If the idempotencyKey has already been used, returns false without awarding anything.
   */
  async addSprouts(
    childId: string,
    amount: number,
    reason: RewardReason,
    idempotencyKey: string
  ): Promise<{ awarded: boolean; reason: RewardReason; amount: number }> {
    // 1. Check idempotency in rewards store
    const existing = await localDbService.get<RewardRecord>('rewards', childId, idempotencyKey);
    if (existing) {
      return { awarded: false, reason, amount: 0 };
    }

    // 2. Record reward in rewards store
    const record: RewardRecord = {
      idempotencyKey,
      amount,
      reason,
      awardedAt: new Date().toISOString(),
    };
    await localDbService.set<RewardRecord>('rewards', childId, idempotencyKey, record);

    // 3. Update active store state
    const store = useAppStore.getState();
    store.addStars(amount); // Sprouts/Stars
    store.addGems(Math.max(1, Math.floor(amount / 2)));

    // 4. Play audio if sound enabled
    if (store.parentSettings?.soundEffectsEnabled ?? true) {
      try {
        audioService.playPositiveChime();
      } catch {}
    }

    return { awarded: true, reason, amount };
  }

  /**
   * Check if a specific reward key has already been awarded
   */
  async hasReward(childId: string, idempotencyKey: string): Promise<boolean> {
    const existing = await localDbService.get<RewardRecord>('rewards', childId, idempotencyKey);
    return existing !== null;
  }
}

export const rewardsService = new RewardsService();
