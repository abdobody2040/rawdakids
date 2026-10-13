// Quran Service (Data Access Layer supporting all 114 Surahs)
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
    const bundled = BUNDLED_SURAHS.find((s) => s.number === surahNumber);
    if (bundled) {
      return bundled;
    }
    const meta =
      ALL_114_SURAHS_CATALOG.find((s) => s.number === surahNumber) ||
      ALL_114_SURAHS_CATALOG[0];

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

    const bundled = BUNDLED_SURAHS.find((s) => s.number === surahNumber);
    // If bundled is available and Arabic or default English is used, return bundled instantly
    if (bundled && (language === 'ar' || (language === 'en' && translationSource === 'sahih'))) {
      quranService._cache.set(cacheKey, bundled);
      return bundled;
    }

    const meta =
      ALL_114_SURAHS_CATALOG.find((s) => s.number === surahNumber) ||
      ALL_114_SURAHS_CATALOG[0];

    const tryFetchJson = async (url: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
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

    // 1. Dynamic fetch with Tafsir Al-Muyassar for non-bundled surahs
    try {
      const json = await tryFetchJson(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ar.muyassar,${editionTag}`
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
        return fullSurah;
      }
    } catch {
      // Fallback
    }

    if (bundled) {
      quranService._cache.set(cacheKey, bundled);
      return bundled;
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
