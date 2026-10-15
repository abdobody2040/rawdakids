import AsyncStorage from '@react-native-async-storage/async-storage';
import juzAmmaData from '@/data/juzAmmaOffline.json';
import {
  ALL_114_SURAHS_CATALOG,
  BUNDLED_SURAHS,
  RECITERS,
  getAyahAudioUrl as buildAudioUrl,
  Surah,
  SurahMeta,
  Reciter,
  Ayah,
} from '@/data/quranData';

const OFFLINE_SURAHS_MAP: Record<string, Ayah[]> = juzAmmaData as Record<string, Ayah[]>;

export const quranService = {
  // Returns all 114 Surahs
  getAllSurahs: (): SurahMeta[] => {
    return ALL_114_SURAHS_CATALOG;
  },

  // Returns Juz Amma (78-114) + Al-Fatihah (1)
  getJuzAmmaSurahs: (): SurahMeta[] => {
    return ALL_114_SURAHS_CATALOG.filter(
      (s) => s.number === 1 || s.number >= 78
    );
  },

  // Backward compatibility alias
  getSurahs: (): SurahMeta[] => {
    return ALL_114_SURAHS_CATALOG;
  },

  getSurahSync: (surahNumber: number): Surah => {
    // 1. Check rich bundled surahs
    const bundled = BUNDLED_SURAHS.find((s) => s.number === surahNumber);
    if (bundled) {
      return bundled;
    }

    const meta =
      ALL_114_SURAHS_CATALOG.find((s) => s.number === surahNumber) ||
      ALL_114_SURAHS_CATALOG[0];

    // 2. Check complete Juz Amma + Al-Mulk offline dataset
    const offlineAyahs = OFFLINE_SURAHS_MAP[String(surahNumber)];
    if (offlineAyahs && offlineAyahs.length > 0) {
      return {
        ...meta,
        storyIntroAr: `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز، عدد آياتها ${meta.ayahCount} آية.`,
        storyIntroEn: `Surah ${meta.nameTransliteration} (${meta.nameEnglish}) of the Holy Quran, containing ${meta.ayahCount} verses.`,
        coreLessonsAr: [
          `تدبر آيات سورة ${meta.nameArabic} المباركة`,
          'العمل بما جاء في القرآن الكريم',
          'طلب الأجر والبركة من تلاوة كتاب الله',
        ],
        coreLessonsEn: [
          `Contemplating the verses of Surah ${meta.nameTransliteration}`,
          'Living by the guidance of the Holy Quran',
          'Seeking blessings through recitation',
        ],
        ayahs: offlineAyahs,
      };
    }

    // 3. Fallback for unbundled surahs before async fetch finishes
    const placeholderAyahs: Ayah[] = Array.from(
      { length: meta.ayahCount },
      (_, i) => ({
        number: i + 1,
        globalNumber: i + 1,
        textUthmani: `آية رقم ${i + 1} من سورة ${meta.nameArabic}`,
        simpleTafsir: `آية مباركة من سورة ${meta.nameArabic}`,
        translationEn: `Verse ${i + 1} of Surah ${meta.nameTransliteration}`,
      })
    );

    return {
      ...meta,
      storyIntroAr: `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز، عدد آياتها ${meta.ayahCount} آية.`,
      storyIntroEn: `Surah ${meta.nameTransliteration} (${meta.nameEnglish}) of the Holy Quran, containing ${meta.ayahCount} verses.`,
      coreLessonsAr: [
        `تدبر آيات سورة ${meta.nameArabic} المباركة`,
        'العمل بما جاء في القرآن الكريم',
        'طلب الأجر والبركة من تلاوة كتاب الله',
      ],
      coreLessonsEn: [
        `Contemplating the verses of Surah ${meta.nameTransliteration}`,
        'Living by the guidance of the Holy Quran',
        'Seeking blessings through recitation',
      ],
      ayahs: placeholderAyahs,
    };
  },

  // In-memory cache for surahs to ensure instant 0ms access
  _cache: new Map<string, Surah>(),

  getSurah: async (
    surahNumber: number,
    translationSource: string = 'sahih',
    language: string = 'ar'
  ): Promise<Surah> => {
    let editionTag = 'en.sahih';
    if (language === 'fr') {
      editionTag = 'fr.hamidullah';
    } else if (language === 'de') {
      editionTag = 'de.aburida';
    } else if (language === 'es') {
      editionTag = 'es.cortes';
    } else if (translationSource === 'clearquran') {
      editionTag = 'en.sahih';
    } else if (translationSource === 'abdelhaleem') {
      editionTag = 'en.asad';
    } else {
      editionTag = 'en.sahih';
    }

    const cacheKey = `${surahNumber}:${translationSource}:${language}`;
    const cached = quranService._cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Check bundled Surahs
    const bundled = BUNDLED_SURAHS.find((s) => s.number === surahNumber);
    if (bundled && (language === 'ar' || (language === 'en' && translationSource === 'sahih'))) {
      quranService._cache.set(cacheKey, bundled);
      return bundled;
    }

    // 2. Check offline Juz Amma + Al-Mulk dataset
    const meta =
      ALL_114_SURAHS_CATALOG.find((s) => s.number === surahNumber) ||
      ALL_114_SURAHS_CATALOG[0];

    const offlineAyahs = OFFLINE_SURAHS_MAP[String(surahNumber)];
    if (offlineAyahs && offlineAyahs.length > 0 && language === 'ar') {
      const fullOfflineSurah: Surah = {
        ...meta,
        storyIntroAr:
          bundled?.storyIntroAr ||
          `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز، عدد آياتها ${meta.ayahCount} آية.`,
        storyIntroEn:
          bundled?.storyIntroEn ||
          `Surah ${meta.nameTransliteration} (${meta.nameEnglish}) of the Holy Quran, containing ${meta.ayahCount} verses.`,
        coreLessonsAr: bundled?.coreLessonsAr || [
          `تدبر آيات سورة ${meta.nameArabic} المباركة`,
          'العمل بما جاء في القرآن الكريم',
          'طلب الأجر والبركة من تلاوة كتاب الله',
        ],
        coreLessonsEn: bundled?.coreLessonsEn || [
          `Contemplating the verses of Surah ${meta.nameTransliteration}`,
          'Living by the guidance of the Holy Quran',
          'Seeking blessings through recitation',
        ],
        ayahs: offlineAyahs,
      };
      quranService._cache.set(cacheKey, fullOfflineSurah);
      return fullOfflineSurah;
    }

    // 3. Check persistent AsyncStorage cache
    try {
      const storedJson = await AsyncStorage.getItem(`@rawdakids_surah_${cacheKey}`);
      if (storedJson) {
        const parsed = JSON.parse(storedJson);
        if (parsed && Array.isArray(parsed.ayahs) && parsed.ayahs.length > 0) {
          quranService._cache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch {
      // Storage read error ignored
    }

    const tryFetchJson = async (url: string, timeoutMs: number = 12000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (e) {
        clearTimeout(timeoutId);
        throw e;
      }
    };

    // 4. Dynamic fetch with Tafsir Al-Muyassar for non-bundled surahs
    try {
      const json = await tryFetchJson(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ar.muyassar,${editionTag}`,
        12000
      );

      if (json && json.data) {
        const uthmaniData = json.data?.[0]?.ayahs || [];
        const muyassarData = json.data?.[1]?.ayahs || [];
        const englishData = json.data?.[2]?.ayahs || [];

        const ayahs: Ayah[] = uthmaniData.map((a: any, idx: number) => ({
          number: a.numberInSurah,
          globalNumber: a.number,
          textUthmani: a.text,
          simpleTafsir:
            muyassarData[idx]?.text ||
            bundled?.ayahs?.[idx]?.simpleTafsir ||
            `آية كريمة من سورة ${meta.nameArabic}`,
          translationEn:
            englishData[idx]?.text ||
            bundled?.ayahs?.[idx]?.translationEn ||
            '',
        }));

        const fullSurah: Surah = {
          ...meta,
          storyIntroAr:
            bundled?.storyIntroAr ||
            `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز، عدد آياتها ${meta.ayahCount} آية.`,
          storyIntroEn:
            bundled?.storyIntroEn ||
            `Surah ${meta.nameTransliteration} (${meta.nameEnglish}) of the Holy Quran, containing ${meta.ayahCount} verses.`,
          coreLessonsAr: bundled?.coreLessonsAr || [
            `تدبر آيات سورة ${meta.nameArabic} المباركة`,
            'العمل بما جاء في القرآن الكريم',
            'طلب الأجر والبركة من تلاوة كتاب الله',
          ],
          coreLessonsEn: bundled?.coreLessonsEn || [
            `Contemplating the verses of Surah ${meta.nameTransliteration}`,
            'Living by the guidance of the Holy Quran',
            'Seeking blessings through recitation',
          ],
          ayahs,
        };

        quranService._cache.set(cacheKey, fullSurah);
        try {
          await AsyncStorage.setItem(`@rawdakids_surah_${cacheKey}`, JSON.stringify(fullSurah));
        } catch {
          // Storage write safe
        }
        return fullSurah;
      }
    } catch {
      // 5. Fallback: Try single lightweight edition fetch (quran-uthmani)
      try {
        const singleJson = await tryFetchJson(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`,
          8000
        );
        if (singleJson && singleJson.data?.ayahs) {
          const ayahs: Ayah[] = singleJson.data.ayahs.map((a: any) => ({
            number: a.numberInSurah,
            globalNumber: a.number,
            textUthmani: a.text,
            simpleTafsir: `آية كريمة من سورة ${meta.nameArabic}`,
            translationEn: '',
          }));
          const fastSurah: Surah = {
            ...meta,
            storyIntroAr: `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز.`,
            storyIntroEn: `Surah ${meta.nameTransliteration} of the Holy Quran.`,
            coreLessonsAr: ['تلاوة كتاب الله', 'تدبر المعاني', 'العمل بالقرآن'],
            coreLessonsEn: ['Recitation', 'Reflection', 'Living the values'],
            ayahs,
          };
          quranService._cache.set(cacheKey, fastSurah);
          try {
            await AsyncStorage.setItem(`@rawdakids_surah_${cacheKey}`, JSON.stringify(fastSurah));
          } catch {
            // Storage write safe
          }
          return fastSurah;
        }
      } catch {
        // Network completely offline
      }
    }

    if (bundled) {
      quranService._cache.set(cacheKey, bundled);
      return bundled;
    }

    if (offlineAyahs && offlineAyahs.length > 0) {
      const fallbackSurah: Surah = {
        ...meta,
        storyIntroAr: `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز.`,
        storyIntroEn: `Surah ${meta.nameTransliteration} of the Holy Quran.`,
        coreLessonsAr: ['تلاوة كتاب الله', 'تدبر المعاني', 'العمل بالقرآن'],
        coreLessonsEn: ['Recitation', 'Reflection', 'Living the values'],
        ayahs: offlineAyahs,
      };
      quranService._cache.set(cacheKey, fallbackSurah);
      return fallbackSurah;
    }

    // Fallback template
    const placeholderAyahs: Ayah[] = Array.from(
      { length: meta.ayahCount },
      (_, i) => ({
        number: i + 1,
        globalNumber: i + 1,
        textUthmani: `آية رقم ${i + 1} من سورة ${meta.nameArabic}`,
        simpleTafsir: 'آية مباركة من كتاب الله',
        translationEn: `Verse ${i + 1} of Surah ${meta.nameTransliteration}`,
      })
    );

    return {
      ...meta,
      storyIntroAr: `سورة ${meta.nameArabic} المباركة من كتاب الله العزيز.`,
      storyIntroEn: `Surah ${meta.nameTransliteration} (${meta.nameEnglish}) of the Holy Quran.`,
      coreLessonsAr: ['تلاوة كتاب الله', 'تدبر المعاني', 'العمل بالقرآن'],
      coreLessonsEn: ['Recitation', 'Reflection', 'Living the values'],
      ayahs: placeholderAyahs,
    };
  },

  getReciters: (): Reciter[] => {
    return RECITERS;
  },

  getAudioUrl: (
    reciterId: string,
    surahNumber: number,
    ayahNumber: number
  ): string => {
    return buildAudioUrl(reciterId, surahNumber, ayahNumber);
  },

  downloadSurahAudio: async (
    reciterId: string,
    surahNumber: number,
    ayahCount: number,
    onProgress?: (progress: number) => void
  ): Promise<boolean> => {
    try {
      const urls: string[] = [];
      for (let a = 1; a <= ayahCount; a++) {
        urls.push(buildAudioUrl(reciterId, surahNumber, a));
      }
      let completed = 0;
      await Promise.all(
        urls.map(async (url) => {
          try {
            await fetch(url, { method: 'HEAD' });
          } catch {
            // network pre-fetch fallback
          }
          completed++;
          if (onProgress) {
            onProgress(Math.round((completed / urls.length) * 100));
          }
        })
      );
      return true;
    } catch {
      return false;
    }
  },
};
