// Hifz Fade Memorization Service (B1)
// Model: { surahId, verses: { [verseNo]: { color, hiddenWords: number[], updatedAt } }, wordsPerStep: 1..6, lastVerse, updatedAt }
// Managed in IndexedDB store 'hifz' with Undo buffer (last 20 actions)

import { localDbService } from './localDbService';
import { VerseColor } from '@/components/VerseColoringModal';
import { rawdaAnalytics } from './rawdaAnalyticsService';
import metaData from '@/data/quran/v1/meta.json';

export interface VerseHifzState {
  color: VerseColor;
  hiddenWords: number[]; // word positions (1-based)
  updatedAt: string;
}

export interface SurahHifzRecord {
  childId: string;
  surahId: number;
  verses: Record<number, VerseHifzState>;
  wordsPerStep: number; // 1..6 (default 3)
  lastVerse: number;
  updatedAt: string;
}

export interface HifzAction {
  type: 'toggle_word' | 'fade_more' | 'reset_all_words';
  verseNo?: number;
  wordPos?: number;
  previousHiddenMap: Record<number, number[]>;
}

class HifzFadeService {
  private undoStack: HifzAction[] = [];
  public reviewedSurahs: number[] = (metaData as any).reviewedSurahs || [1, 2, 24, 32, 67, 112, 113, 114];

  /**
   * Check if surah is reviewed and available for fade mode
   */
  isSurahReviewed(surahId: number): boolean {
    return this.reviewedSurahs.includes(surahId);
  }

  /**
   * Get Hifz state for a child and surah
   */
  async getSurahHifz(childId: string, surahId: number): Promise<SurahHifzRecord> {
    const stored = await localDbService.get<SurahHifzRecord>('hifz', childId, String(surahId));
    if (stored) {
      return stored;
    }

    const initial: SurahHifzRecord = {
      childId,
      surahId,
      verses: {},
      wordsPerStep: 3,
      lastVerse: 1,
      updatedAt: new Date().toISOString(),
    };
    await localDbService.set('hifz', childId, String(surahId), initial);
    return initial;
  }

  /**
   * Save Hifz state
   */
  async saveSurahHifz(record: SurahHifzRecord): Promise<void> {
    record.updatedAt = new Date().toISOString();
    await localDbService.set('hifz', record.childId, String(record.surahId), record);
  }

  /**
   * Push an undo action (keeping max 20)
   */
  pushUndoAction(action: HifzAction) {
    this.undoStack.push(action);
    if (this.undoStack.length > 20) {
      this.undoStack.shift();
    }
  }

  /**
   * Pop and restore the last undo action
   */
  popUndoAction(): HifzAction | null {
    return this.undoStack.pop() || null;
  }

  /**
   * Clear undo stack when leaving screen
   */
  clearUndoStack() {
    this.undoStack = [];
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Clone hidden words map for undo snapshots
   */
  getHiddenWordsMap(record: SurahHifzRecord): Record<number, number[]> {
    const map: Record<number, number[]> = {};
    for (const [vNo, vState] of Object.entries(record.verses || {})) {
      map[Number(vNo)] = [...(vState.hiddenWords || [])];
    }
    return map;
  }

  /**
   * Toggle a word's hidden status in the record
   */
  toggleWordHidden(record: SurahHifzRecord, verseNo: number, wordPos: number): boolean {
    const prevMap = this.getHiddenWordsMap(record);
    if (!record.verses[verseNo]) {
      record.verses[verseNo] = {
        color: null,
        hiddenWords: [],
        updatedAt: new Date().toISOString(),
      };
    }

    const currentHidden = record.verses[verseNo].hiddenWords || [];
    const isCurrentlyHidden = currentHidden.includes(wordPos);
    let nextHidden: number[];

    if (isCurrentlyHidden) {
      nextHidden = currentHidden.filter((p) => p !== wordPos);
    } else {
      nextHidden = [...currentHidden, wordPos];
    }

    record.verses[verseNo].hiddenWords = nextHidden;
    record.verses[verseNo].updatedAt = new Date().toISOString();

    this.pushUndoAction({
      type: 'toggle_word',
      verseNo,
      wordPos,
      previousHiddenMap: prevMap,
    });

    rawdaAnalytics.logEvent('hifz_word_hidden', {
      surah: record.surahId,
      verse: verseNo,
      word: wordPos,
      hidden: !isCurrentlyHidden,
    });

    return !isCurrentlyHidden;
  }

  /**
   * Hide the next N words (N = wordsPerStep), choosing random not-yet-hidden words
   */
  fadeMoreWords(
    record: SurahHifzRecord,
    verseWordCounts: Record<number, number>
  ): { hiddenCount: number; allHidden: boolean } {
    const prevMap = this.getHiddenWordsMap(record);

    // Collect all candidates across all verses that are not hidden
    const unhiddenCandidates: { verseNo: number; wordPos: number }[] = [];

    for (const [vStr, wordCount] of Object.entries(verseWordCounts)) {
      const vNo = Number(vStr);
      const hidden = record.verses[vNo]?.hiddenWords || [];
      for (let p = 1; p <= wordCount; p++) {
        if (!hidden.includes(p)) {
          unhiddenCandidates.push({ verseNo: vNo, wordPos: p });
        }
      }
    }

    if (unhiddenCandidates.length === 0) {
      return { hiddenCount: 0, allHidden: true };
    }

    // Shuffle candidates
    const shuffled = [...unhiddenCandidates].sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, record.wordsPerStep || 3);

    for (const item of toHide) {
      if (!record.verses[item.verseNo]) {
        record.verses[item.verseNo] = {
          color: null,
          hiddenWords: [],
          updatedAt: new Date().toISOString(),
        };
      }
      const list = record.verses[item.verseNo].hiddenWords || [];
      if (!list.includes(item.wordPos)) {
        record.verses[item.verseNo].hiddenWords = [...list, item.wordPos];
        record.verses[item.verseNo].updatedAt = new Date().toISOString();
      }
    }

    this.pushUndoAction({
      type: 'fade_more',
      previousHiddenMap: prevMap,
    });

    const remaining = unhiddenCandidates.length - toHide.length;
    return {
      hiddenCount: toHide.length,
      allHidden: remaining <= 0,
    };
  }

  /**
   * Reset all hidden words (reveal all), keeping verse colors intact
   */
  resetHiddenWords(record: SurahHifzRecord): void {
    const prevMap = this.getHiddenWordsMap(record);

    for (const vState of Object.values(record.verses || {})) {
      vState.hiddenWords = [];
      vState.updatedAt = new Date().toISOString();
    }

    this.pushUndoAction({
      type: 'reset_all_words',
      previousHiddenMap: prevMap,
    });
  }

  /**
   * Undo the last action, restoring previous hidden state
   */
  undoLastAction(record: SurahHifzRecord): boolean {
    const lastAction = this.popUndoAction();
    if (!lastAction) return false;

    // Restore previous hidden words map
    for (const [vStr, words] of Object.entries(lastAction.previousHiddenMap)) {
      const vNo = Number(vStr);
      if (!record.verses[vNo]) {
        record.verses[vNo] = {
          color: null,
          hiddenWords: words,
          updatedAt: new Date().toISOString(),
        };
      } else {
        record.verses[vNo].hiddenWords = [...words];
        record.verses[vNo].updatedAt = new Date().toISOString();
      }
    }

    // Clean up any verses that weren't in previousHiddenMap
    for (const [vStr, vState] of Object.entries(record.verses)) {
      const vNo = Number(vStr);
      if (!(vNo in lastAction.previousHiddenMap)) {
        vState.hiddenWords = [];
      }
    }

    return true;
  }

  /**
   * Set verse color
   */
  setVerseColor(record: SurahHifzRecord, verseNo: number, color: VerseColor): void {
    if (!record.verses[verseNo]) {
      record.verses[verseNo] = {
        color,
        hiddenWords: [],
        updatedAt: new Date().toISOString(),
      };
    } else {
      record.verses[verseNo].color = color;
      record.verses[verseNo].updatedAt = new Date().toISOString();
    }

    rawdaAnalytics.logEvent('hifz_verse_colored', {
      surah: record.surahId,
      verse: verseNo,
      color: color || 'none',
    });
  }

  /**
   * Calculate surah memorization progress = (memorized + mastered) / totalVerses
   */
  calculateProgress(record: SurahHifzRecord, totalVerses: number): {
    memorizedCount: number;
    masteredCount: number;
    reviewCount: number;
    percent: number;
  } {
    let memorizedCount = 0;
    let masteredCount = 0;
    let reviewCount = 0;

    for (const v of Object.values(record.verses || {})) {
      if (v.color === 'memorized') memorizedCount++;
      else if (v.color === 'mastered') masteredCount++;
      else if (v.color === 'review') reviewCount++;
    }

    const completed = memorizedCount + masteredCount;
    const percent = totalVerses > 0 ? Math.round((completed / totalVerses) * 100) : 0;

    return {
      memorizedCount,
      masteredCount,
      reviewCount,
      percent: Math.min(100, percent),
    };
  }
}

export const hifzFadeService = new HifzFadeService();

