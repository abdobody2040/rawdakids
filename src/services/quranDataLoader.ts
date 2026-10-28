/**
 * Optimized Local Quran Data Loader
 * Preloads essential starter Surahs for kids offline and provides lazy loading for full 114 Surahs.
 */

const surahCache: Record<number, any> = {};

// Preloaded starter surahs frequently used in kids onboarding & daily recitation
const STARTER_SURAH_LOADERS: Record<number, () => any> = {
  1: () => require('@/data/quran/v1/1.json'),
  108: () => require('@/data/quran/v1/108.json'),
  109: () => require('@/data/quran/v1/109.json'),
  110: () => require('@/data/quran/v1/110.json'),
  111: () => require('@/data/quran/v1/111.json'),
  112: () => require('@/data/quran/v1/112.json'),
  113: () => require('@/data/quran/v1/113.json'),
  114: () => require('@/data/quran/v1/114.json'),
};

export function cacheSurahWordData(surahId: number, data: any): void {
  if (data) {
    surahCache[surahId] = data;
  }
}

export function getLocalSurahWordData(surahId: number): any {
  if (surahCache[surahId]) {
    return surahCache[surahId];
  }
  const loader = STARTER_SURAH_LOADERS[surahId];
  if (!loader) return null;
  try {
    const mod = loader();
    const data = mod && mod.default ? mod.default : mod;
    if (data) {
      surahCache[surahId] = data;
    }
    return data;
  } catch (e) {
    console.warn('Error loading local surah ' + surahId, e);
    return null;
  }
}

export async function fetchSurahWordData(surahId: number): Promise<any> {
  const cached = getLocalSurahWordData(surahId);
  if (cached) return cached;

  try {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      const res = await fetch(`/data/quran/v1/${surahId}.json`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.verses) {
          cacheSurahWordData(surahId, json);
          return json;
        }
      }
    }
  } catch (e) {
    console.warn(`Failed to fetch surah ${surahId} word data`, e);
  }
  return null;
}
