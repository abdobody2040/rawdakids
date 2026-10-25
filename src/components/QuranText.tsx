// Quran Word-by-Word Interactive Text Component (Part A3, A4, B1)
// Renders Hafs 'an 'Asim text where every word is an interactive element
// Words: <span class="w" data-s data-v data-p tabindex="0" role="button">
// Verse end marker: button with aria-label="الْآيَةُ N"
// Basmala header rules: verse 1 in Al-Fatihah, header line in others, omitted in At-Tawbah
// Supports font sizing (A-/A+), recitation highlighting, and gradual fade memorization

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { VerseColor } from './VerseColoringModal';
import { COLORS } from '@/constants/theme';
import { quranService } from '@/services/quranService';

export interface QuranWord {
  p: number; // 1-based word position
  t: string; // Uthmani text
}

export interface QuranVerse {
  n: number; // verse number in surah
  globalNumber?: number;
  words: QuranWord[];
  page: number;
  juz: number;
  sajda?: boolean;
}

export interface QuranSurahData {
  surahId: number;
  nameArabic: string;
  nameEnglish: string;
  revelationType: string;
  totalVerses: number;
  hasBasmala: boolean;
  basmalaIsVerse1: boolean;
  verses: QuranVerse[];
}

interface QuranTextProps {
  surahId: number;
  mode?: 'listen' | 'fade'; // 'listen' = "اسمع وردّد", 'fade' = "المحو التدريجي"
  fontSize?: number;
  activeVerseNumber?: number | null;
  activeWordPosition?: number | null;
  versesColorMap?: Record<number, VerseColor>;
  hiddenWordsMap?: Record<number, number[]>; // verseNo -> array of wordPos
  onWordTap?: (surahId: number, verseNo: number, wordPos: number) => void;
  onWordLongPress?: (surahId: number, verseNo: number, wordPos: number) => void;
  onVerseMarkerTap?: (surahId: number, verseNo: number) => void;
  onVerseNumberTap?: (surahId: number, verseNo: number) => void;
}

const BASMALA_HEADER_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export default function QuranText({
  surahId,
  mode = 'listen',
  fontSize = 26,
  activeVerseNumber = null,
  activeWordPosition = null,
  versesColorMap = {},
  hiddenWordsMap = {},
  onWordTap,
  onWordLongPress,
  onVerseMarkerTap,
  onVerseNumberTap,
}: QuranTextProps) {
  const [surahData, setSurahData] = useState<QuranSurahData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const longPressTimerRef = useRef<any>(null);

  // Load word-by-word surah dataset
  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        // 1. Try static fetch from /data/quran/v1/{surahId}.json
        if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
          const res = await fetch(`/data/quran/v1/${surahId}.json`);
          if (res.ok) {
            const json = await res.json();
            if (isCurrent && json && json.verses) {
              setSurahData(json);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch {
        // Fallback to local import or quranService
      }

      try {
        // Fallback: load from sync quranService and tokenize on the fly
        const fallbackSurah = quranService.getSurahSync(surahId);
        if (fallbackSurah && fallbackSurah.ayahs) {
          const verses: QuranVerse[] = fallbackSurah.ayahs.map((a) => {
            const rawTokens = (a.textUthmani || '').trim().split(/\s+/);
            const words: QuranWord[] = [];
            const waqfRegex = /^[\u0610-\u0615\u06D6-\u06ED\u06DE\u06E9]+$/;

            for (const t of rawTokens) {
              if (!t) continue;
              if (waqfRegex.test(t) && words.length > 0) {
                words[words.length - 1].t += ' ' + t;
              } else {
                words.push({ p: words.length + 1, t });
              }
            }

            return {
              n: a.number,
              words,
              page: 1,
              juz: fallbackSurah.juzNumber,
            };
          });

          if (isCurrent) {
            setSurahData({
              surahId,
              nameArabic: fallbackSurah.nameArabic,
              nameEnglish: fallbackSurah.nameEnglish,
              revelationType: fallbackSurah.revelationType,
              totalVerses: verses.length,
              hasBasmala: surahId !== 9,
              basmalaIsVerse1: surahId === 1,
              verses,
            });
            setIsLoading(false);
          }
        }
      } catch {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isCurrent = false;
    };
  }, [surahId]);

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جَارٍ تَحْمِيلُ كَلِمَاتِ السُّورَةِ الْمُبَارَكَةِ...</Text>
      </View>
    );
  }

  if (!surahData || !surahData.verses) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>تَعَذَّرَ تَحْمِيلُ النَّصِّ الْقُرْآنِيِّ</Text>
      </View>
    );
  }

  const handlePointerDown = (verseNo: number, wordPos: number) => {
    // 500ms long-press triggers Tafsir
    longPressTimerRef.current = setTimeout(() => {
      if (onWordLongPress) {
        onWordLongPress(surahId, verseNo, wordPos);
      }
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleWordClick = (verseNo: number, wordPos: number) => {
    handlePointerUp();
    if (onWordTap) {
      onWordTap(surahId, verseNo, wordPos);
    }
  };

  return (
    <View style={styles.container} {...({ dir: 'rtl' } as any)}>
      {/* Basmala Header Line (Shown for all surahs except At-Tawbah (9) and Al-Fatihah (1, where it is verse 1)) */}
      {surahData.hasBasmala && !surahData.basmalaIsVerse1 ? (
        <View style={styles.basmalaHeaderContainer}>
          <Text style={[styles.basmalaHeaderText, { fontSize: Math.max(22, fontSize * 0.9) }]}>
            {BASMALA_HEADER_TEXT}
          </Text>
        </View>
      ) : null}

      {/* Verses Container */}
      <View style={styles.mushafTextContainer}>
        {surahData.verses.map((verse) => {
          const isVerseActive = activeVerseNumber === verse.n;
          const verseColor = versesColorMap[verse.n] || null;
          const hiddenInVerse = hiddenWordsMap[verse.n] || [];

          return (
            <View
              key={`verse_${verse.n}`}
              style={[
                styles.verseInlineBlock,
                verseColor === 'memorized' && styles.verseColorMemorized,
                verseColor === 'mastered' && styles.verseColorMastered,
                verseColor === 'review' && styles.verseColorReview,
                isVerseActive && styles.verseActiveHighlight,
              ]}
              // @ts-ignore Web accessibility attributes
              role="region"
              aria-label={`الآية ${verse.n}`}
            >
              {verse.words.map((word) => {
                const isHidden = mode === 'fade' && hiddenInVerse.includes(word.p);
                const isWordActive = isVerseActive && activeWordPosition === word.p;

                return (
                  <TouchableOpacity
                    key={`w_${verse.n}_${word.p}`}
                    activeOpacity={0.7}
                    onPress={() => handleWordClick(verse.n, word.p)}
                    onPressIn={() => handlePointerDown(verse.n, word.p)}
                    onPressOut={handlePointerUp}
                    style={[
                      styles.wordElement,
                      isHidden && styles.wordElementHidden,
                      isWordActive && styles.wordElementActive,
                    ]}
                    // Web data attributes for Part A1 & A3 compliance
                    // @ts-ignore
                    tabIndex={0}
                    role="button"
                    aria-label={isHidden ? 'كَلِمَةٌ مُخْتَفِيَةٌ' : word.t}
                    data-s={surahId}
                    data-v={verse.n}
                    data-p={word.p}
                  >
                    <Text
                      style={[
                        styles.wordText,
                        {
                          fontSize,
                          lineHeight: fontSize * 1.95,
                        },
                        isHidden && styles.wordTextHidden,
                        isWordActive && styles.wordTextActive,
                      ]}
                    >
                      {word.t}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Verse End Marker Button */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  if (mode === 'fade' && onVerseNumberTap) {
                    onVerseNumberTap(surahId, verse.n);
                  } else if (onVerseMarkerTap) {
                    onVerseMarkerTap(surahId, verse.n);
                  }
                }}
                style={[
                  styles.verseMarkerBtn,
                  verseColor === 'memorized' && styles.verseMarkerMemorized,
                  verseColor === 'mastered' && styles.verseMarkerMastered,
                  verseColor === 'review' && styles.verseMarkerReview,
                ]}
                // @ts-ignore
                tabIndex={0}
                role="button"
                aria-label={`الْآيَةُ ${verse.n}`}
              >
                <Text style={styles.verseMarkerNumber}>{verse.n}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  loadingWrap: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.error,
  },
  basmalaHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  basmalaHeaderText: {
    fontFamily: 'AmiriQuran-Regular',
    color: '#064E3B',
    textAlign: 'center',
  },
  mushafTextContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    direction: 'rtl',
  },
  verseInlineBlock: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 2,
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  verseColorMemorized: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  verseColorMastered: {
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  verseColorReview: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
  },
  verseActiveHighlight: {
    backgroundColor: 'rgba(5, 150, 105, 0.18)',
    borderRadius: 10,
  },
  wordElement: {
    paddingHorizontal: 3,
    paddingVertical: 2,
    marginHorizontal: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordElementHidden: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
    borderRadius: 9999,
    minWidth: 44,
    paddingHorizontal: 10,
  },
  wordElementActive: {
    backgroundColor: '#FDE68A',
    borderRadius: 6,
  },
  wordText: {
    fontFamily: 'AmiriQuran-Regular',
    color: '#111827',
    textAlign: 'right',
  },
  wordTextHidden: {
    color: 'transparent',
    opacity: 0,
  },
  wordTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  verseMarkerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    marginVertical: 2,
  },
  verseMarkerMemorized: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  verseMarkerMastered: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  verseMarkerReview: {
    backgroundColor: '#F43F5E',
    borderColor: '#E11D48',
  },
  verseMarkerNumber: {
    fontSize: 12,
    fontWeight: '900',
    color: '#064E3B',
    textAlign: 'center',
  },
});
