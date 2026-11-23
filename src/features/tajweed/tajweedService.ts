// src/features/tajweed/tajweedService.ts
// Fetches Tajweed-annotated Ayah data from Al Quran Cloud and parses bracket notation.
// Fully isolated — no changes to existing Quran data stores.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoryForCode, TajweedCategory } from './tajweedRules';

const CACHE_PREFIX = '@rawda_tajweed_v1_';
const BASE_URL = 'https://api.alquran.cloud/v1';

// ─────────────────────────────────────────────────────────
// Token types returned by the parser
// ─────────────────────────────────────────────────────────
export interface TajweedToken {
  text: string;
  ruleCode?: string;
  category?: TajweedCategory;
  isTajweed: boolean;
}

/** A single ayah with its parsed tokens */
export interface TajweedAyah {
  number: number;
  surahNumber: number;
  rawText: string;         // Original annotated text from API
  tokens: TajweedToken[];  // Parsed tokens ready for rendering
  hasAnyTajweed: boolean;
  hasMadd: boolean;
  hasGhunnah: boolean;
  hasQalqalah: boolean;
}

// ─────────────────────────────────────────────────────────
// Parser
// ─────────────────────────────────────────────────────────

/**
 * Parse Al Quran Cloud bracket notation into TajweedToken[].
 *
 * Formats seen:
 *   [h:1[ٱ]]           → rule=h, text=ٱ  (with sub-rule suffix)
 *   [g[نّ]]             → rule=g, text=نّ
 *   [q[بْ]]             → rule=q, text=بْ
 *   [m[آ]]              → rule=m, text=آ
 *   Normal text between brackets is plain.
 */
export function parseTajweedText(raw: string): TajweedToken[] {
  const tokens: TajweedToken[] = [];
  // Regex: matches [<code>[<text>]] with optional :digit suffix on code
  const tajweedPattern = /\[([a-z])(?::\d+)?\[([^\]]*)\]\]/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tajweedPattern.exec(raw)) !== null) {
    // Plain text before this match
    const plainBefore = raw.slice(lastIndex, match.index);
    if (plainBefore) {
      tokens.push({ text: plainBefore, isTajweed: false });
    }

    const ruleCode = match[1];
    const text = match[2];
    const category = getCategoryForCode(ruleCode) ?? undefined;

    tokens.push({
      text,
      ruleCode,
      category,
      isTajweed: true,
    });

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  const tail = raw.slice(lastIndex);
  if (tail) {
    tokens.push({ text: tail, isTajweed: false });
  }

  return tokens.length > 0 ? tokens : [{ text: raw, isTajweed: false }];
}

// ─────────────────────────────────────────────────────────
// API fetch with AsyncStorage caching
// ─────────────────────────────────────────────────────────

interface AlQuranSurahResponse {
  code: number;
  status: string;
  data: {
    number: number;
    ayahs: {
      number: number;
      numberInSurah: number;
      text: string;
    }[];
  };
}

class TajweedService {
  /** In-memory cache (per-surah) so we don't hit AsyncStorage on every render */
  private memCache: Map<number, TajweedAyah[]> = new Map();

  /**
   * Get Tajweed tokens for all ayahs in a surah.
   * Falls back to plain text tokens on any error.
   */
  async getSurahTajweed(surahNumber: number): Promise<TajweedAyah[]> {
    // 1. Memory cache
    if (this.memCache.has(surahNumber)) {
      return this.memCache.get(surahNumber)!;
    }

    // 2. AsyncStorage cache
    const cacheKey = `${CACHE_PREFIX}surah_${surahNumber}`;
    try {
      const stored = await AsyncStorage.getItem(cacheKey);
      if (stored) {
        const parsed: TajweedAyah[] = JSON.parse(stored);
        this.memCache.set(surahNumber, parsed);
        return parsed;
      }
    } catch {
      // Cache read failure — fall through to fetch
    }

    // 3. Network fetch
    try {
      const timeoutSignal = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
        ? (AbortSignal as any).timeout(8000)
        : undefined;
      const response = await fetch(
        `${BASE_URL}/surah/${surahNumber}/quran-tajweed`,
        { signal: timeoutSignal }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json: AlQuranSurahResponse = await response.json();

      const tajweedAyahs: TajweedAyah[] = json.data.ayahs.map((a) => {
        const tokens = parseTajweedText(a.text);
        const hasMadd = tokens.some((t) => t.category?.id === 'madd');
        const hasGhunnah = tokens.some((t) => t.category?.id === 'ghunnah');
        const hasQalqalah = tokens.some((t) => t.category?.id === 'qalqalah');
        return {
          number: a.numberInSurah,
          surahNumber,
          rawText: a.text,
          tokens,
          hasAnyTajweed: tokens.some((t) => t.isTajweed && t.category),
          hasMadd,
          hasGhunnah,
          hasQalqalah,
        };
      });

      // 4. Persist to AsyncStorage
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(tajweedAyahs));
      } catch {
        // Storage write failure is non-fatal
      }

      this.memCache.set(surahNumber, tajweedAyahs);
      return tajweedAyahs;
    } catch {
      // Network / parse failure — return empty (caller shows plain text)
      return [];
    }
  }

  /** Get Tajweed data for a single ayah */
  async getAyahTajweed(surahNumber: number, ayahNumber: number): Promise<TajweedAyah | null> {
    const surahData = await this.getSurahTajweed(surahNumber);
    return surahData.find((a) => a.number === ayahNumber) ?? null;
  }

  /** Clear in-memory cache (useful when switching surahs) */
  clearMemCache(): void {
    this.memCache.clear();
  }

  /**
   * Build the Husary Muallim audio URL for a given surah + ayah.
   * Sheikh Al-Husary Teacher edition — slow & clear for children.
   */
  getHusaryMuallimUrl(surahNumber: number, ayahNumber: number): string {
    const surahPad = String(surahNumber).padStart(3, '0');
    const ayahPad = String(ayahNumber).padStart(3, '0');
    return `https://everyayah.com/data/Husary_Muallim_128kbps/${surahPad}${ayahPad}.mp3`;
  }
}

export const tajweedService = new TajweedService();

