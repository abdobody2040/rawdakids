// Privacy-preserving Analytics Service (B0.3)
// Strictly anonymous: no personal data, only age band and anonymous IDs
// Respects parent's analytics toggle

import { useAppStore } from '@/store/useAppStore';

export type RawdaAnalyticsEvent =
  | 'hifz_word_hidden'
  | 'hifz_verse_colored'
  | 'tasbih_started'
  | 'tasbih_completed'
  | 'unit_lesson_completed'
  | 'certificate_unlocked'
  | 'story_read'
  | 'badge_earned'
  | 'tafsir_opened';

class RawdaAnalyticsService {
  logEvent(event: RawdaAnalyticsEvent, params: Record<string, any> = {}) {
    const store = useAppStore.getState();
    if (store.parentSettings?.analyticsEnabled === false) {
      return; // Respect parent's privacy opt-out
    }

    const activeChild = store.profiles?.find((p) => p.id === store.activeProfileId);
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      ageBand: activeChild?.ageBand || '7-9',
      activeChildId: store.activeProfileId || 'default_child',
      ...params,
    };

    // Keep console trace for development and offline queue
    if (__DEV__) {
      console.log('[RawdaAnalytics]', payload);
    }
  }
}

export const rawdaAnalytics = new RawdaAnalyticsService();
