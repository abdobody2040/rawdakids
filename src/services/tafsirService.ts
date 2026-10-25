// Dedicated Tafsir Service for Rawda Kids (A4.1)
// Primary: Al-Muyassar (مجمع الملك فهد لطباعة المصحف الشريف)
// Secondary: As-Sa'di (تيسير الكريم الرحمن في تفسير كلام المنان - الشيخ عبد الرحمن السعدي)
// Supports local caching and offline lookup

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TafsirSource {
  id: 'muyassar' | 'saddi';
  nameArabic: string;
  authorArabic: string;
}

export const TAFSIR_SOURCES: Record<'muyassar' | 'saddi', TafsirSource> = {
  muyassar: {
    id: 'muyassar',
    nameArabic: 'التفسير الميسر',
    authorArabic: 'نخبة من العلماء بإشراف مجمع الملك فهد لطباعة المصحف الشريف',
  },
  saddi: {
    id: 'saddi',
    nameArabic: 'تفسير السعدي',
    authorArabic: 'الشيخ عبد الرحمن بن ناصر السعدي رحمه الله',
  },
};

export interface AyahTafsirContent {
  surahNumber: number;
  ayahNumber: number;
  source: TafsirSource;
  text: string;
  isOfflineCached: boolean;
}

const TAFSIR_CACHE_PREFIX = '@rawdakids_tafsir_';

export const tafsirService = {
  /**
   * Fetch Tafsir text for a specific ayah with offline caching
   */
  async getAyahTafsir(
    surahNumber: number,
    ayahNumber: number,
    sourceKey: 'muyassar' | 'saddi' = 'muyassar'
  ): Promise<AyahTafsirContent> {
    const cacheKey = `${TAFSIR_CACHE_PREFIX}${surahNumber}_${ayahNumber}_${sourceKey}`;
    const sourceInfo = TAFSIR_SOURCES[sourceKey];

    // 1. Try local cache
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        return {
          surahNumber,
          ayahNumber,
          source: sourceInfo,
          text: cached,
          isOfflineCached: true,
        };
      }
    } catch {
      // Ignore cache read error
    }

    // 2. Fetch from authentic API
    try {
      if (sourceKey === 'muyassar') {
        // Al-Muyassar from api.alquran.cloud
        const url = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.muyassar`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.data && data.data.text) {
          const tafsirText = data.data.text;
          await AsyncStorage.setItem(cacheKey, tafsirText).catch(() => {});
          return {
            surahNumber,
            ayahNumber,
            source: sourceInfo,
            text: tafsirText,
            isOfflineCached: false,
          };
        }
      } else {
        // As-Sa'di from quran.com api (resource 91 / ar-tafseer-al-saddi)
        const url = `https://api.quran.com/api/v4/tafsirs/91/by_ayah/${surahNumber}:${ayahNumber}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.tafsir && data.tafsir.text) {
          // Strip basic HTML formatting if any
          const cleanText = data.tafsir.text.replace(/<[^>]+>/g, '').trim();
          await AsyncStorage.setItem(cacheKey, cleanText).catch(() => {});
          return {
            surahNumber,
            ayahNumber,
            source: sourceInfo,
            text: cleanText,
            isOfflineCached: false,
          };
        }
      }
    } catch {
      // Network failed or offline
    }

    // Fallback message if completely offline and not in cache
    return {
      surahNumber,
      ayahNumber,
      source: sourceInfo,
      text: 'يَحْتَاجُ إِنْتَرْنِتْ لعرض هذا التفسير لأول مرة، ثم يُحفظ تلقائيًا للعمل بدون اتصال.',
      isOfflineCached: false,
    };
  },
};
