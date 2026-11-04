// Privacy-preserving no-op analytics service (Strict Zero-Tracking Policy)
// Rawdakids does not collect, record, or transmit analytics of any kind.

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
  logEvent(_event: RawdaAnalyticsEvent, _params: Record<string, any> = {}): void {
    // No-op: Strictly zero tracking and zero telemetry
  }
}

export const rawdaAnalytics = new RawdaAnalyticsService();
