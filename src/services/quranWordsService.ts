import { QURAN_WORDS_DICTIONARY, WordMeaning } from '@/data/quranWordsData';

export const quranWordsService = {
  /**
   * Strip Arabic diacritics (Tashkeel) and Quranic signs for clean matching
   */
  stripTashkeel(text: string): string {
    return text
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا')
      .replace(/\u0629/g, 'ه')
      .replace(/\u0649/g, 'ي')
      .trim();
  },

  /**
   * Look up meaning for a tapped Quranic word with intelligent fallback
   */
  getWordMeaning(rawWord: string, verseContextTafsir?: string): WordMeaning {
    const clean = this.stripTashkeel(rawWord);

    // 1. Exact match in dictionary
    if (QURAN_WORDS_DICTIONARY[clean]) {
      return {
        ...QURAN_WORDS_DICTIONARY[clean],
        wordArabic: rawWord,
      };
    }

    // 2. Partial prefix/suffix match (e.g. و + الحمد, بـ + رب)
    for (const key of Object.keys(QURAN_WORDS_DICTIONARY)) {
      if (clean.includes(key) && key.length >= 3) {
        return {
          ...QURAN_WORDS_DICTIONARY[key],
          wordArabic: rawWord,
        };
      }
    }

    // 3. Fallback to contextual explanation from verse Tafsir
    const fallbackMeaningAr = verseContextTafsir
      ? `من معاني الآية الكريمة: ${verseContextTafsir.split('.')[0] || verseContextTafsir}`
      : 'كلمة مباركة من كتاب الله تدعو إلى الخير والإيمان وتدبر آيات الله.';

    return {
      wordClean: clean,
      wordArabic: rawWord,
      meaningAr: fallbackMeaningAr,
      meaningEn: 'A blessed Quranic term encouraging good deeds and reflection on Allah’s signs.',
      childExampleAr: 'كل كلمة نقرؤها في كتاب الله تنير قلوبنا وتمنحنا عشر حسنات!',
      childExampleEn: 'Every word recited from the Holy Quran brings light and 10 good deeds!',
    };
  },
};
