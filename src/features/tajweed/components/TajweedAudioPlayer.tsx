// src/features/tajweed/components/TajweedAudioPlayer.tsx
// Interactive Audio Player for Tajweed Examples featuring Sheikh Mahmoud Khalil Al-Husary
// Clean, resilient, kid-friendly with live playback indicators and repetition support.

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { TajweedAudioExample } from '../data/tajweedLessonsData';

interface TajweedAudioPlayerProps {
  example: TajweedAudioExample;
  accentColor?: string;
  onVoicePractice?: () => void;
}

export default function TajweedAudioPlayer({
  example,
  accentColor = '#059669',
  onVoicePractice,
}: TajweedAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (Platform.OS === 'web' && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setHasError(false);
    setIsLoading(true);

    if (Platform.OS === 'web') {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(example.audioUrl);
        audioRef.current = audio;

        audio.oncanplay = () => {
          setIsLoading(false);
        };

        audio.onplaying = () => {
          setIsLoading(false);
          setIsPlaying(true);
        };

        audio.onended = () => {
          setIsPlaying(false);
          setIsLoading(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          setHasError(true);
          audioRef.current = null;
        };

        await audio.play();
      } catch {
        setIsLoading(false);
        setIsPlaying(false);
        setHasError(true);
      }
    } else {
      // Fallback on native when web Audio is unavailable
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <View style={[styles.card, { borderColor: accentColor + '35' }]}>
      {/* Top Header: Surah & Ayah Badge */}
      <View style={styles.topRow}>
        <View style={[styles.surahBadge, { backgroundColor: accentColor + '15' }]}>
          <Ionicons name="book-outline" size={13} color={accentColor} />
          <Text style={[styles.surahBadgeText, { color: accentColor }]}>
            سورة {example.surahNameAr} • الآية {example.ayahNumber}
          </Text>
        </View>

        <View style={styles.reciterBadge}>
          <Ionicons name="mic-circle" size={14} color="#065F46" />
          <Text style={styles.reciterBadgeText}>الشيخ الحصري (المعلم)</Text>
        </View>
      </View>

      {/* Arabic Ayah Text */}
      <View style={styles.textContainer}>
        <Text style={styles.ayahText} textBreakStrategy="simple">
          {example.ayahText}
        </Text>
      </View>

      {/* Target Word & Highlighted Rule */}
      <View style={styles.rulePillRow}>
        <View style={[styles.targetWordPill, { borderColor: accentColor }]}>
          <Text style={styles.targetWordLabel}>الكلمة:</Text>
          <Text style={[styles.targetWordText, { color: accentColor }]}>{example.targetWord}</Text>
        </View>

        <View style={styles.ruleDescriptionPill}>
          <Ionicons name="sparkles" size={13} color="#D97706" />
          <Text style={styles.ruleDescriptionText}>{example.highlightRule}</Text>
        </View>
      </View>

      {/* Teacher / Audio Note */}
      <View style={styles.noteBox}>
        <Ionicons name="bulb-outline" size={15} color="#059669" style={{ marginTop: 2 }} />
        <Text style={styles.noteText}>{example.audioNoteAr}</Text>
      </View>

      {/* Audio Controls Bar */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isPlaying ? '#DC2626' : accentColor },
          ]}
          onPress={handleTogglePlay}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={isPlaying ? 'pause' : 'volume-high'}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.playButtonText}>
                {isPlaying ? 'إيقاف مؤقت' : 'استمع للنطق بالصوت 🔊'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {isPlaying && (
          <View style={styles.pulsingBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.pulseText}>جاري الاستماع...</Text>
          </View>
        )}

        {onVoicePractice && (
          <TouchableOpacity
            style={styles.voicePracticeBtn}
            onPress={onVoicePractice}
            activeOpacity={0.8}
          >
            <Ionicons name="mic" size={16} color="#7C3AED" />
            <Text style={styles.voicePracticeText}>ردد الآن 🎙️</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text style={styles.errorText}>
            تعذر تشغيل المقطع الصوتي، يرجى التأكد من اتصال الإنترنت.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    flexWrap: 'wrap',
    gap: 6,
  },
  surahBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  surahBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reciterBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  reciterBadgeText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  textContainer: {
    backgroundColor: '#FAFAF9',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  ayahText: {
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'serif' }),
    fontSize: 22,
    lineHeight: 40,
    color: '#064E3B',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  rulePillRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  targetWordPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
  },
  targetWordLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  targetWordText: {
    fontSize: 14,
    fontWeight: '800',
  },
  ruleDescriptionPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    flex: 1,
  },
  ruleDescriptionText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '700',
  },
  noteBox: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    borderRightWidth: 3,
    borderRightColor: '#059669',
  },
  noteText: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 20,
    flex: 1,
    textAlign: 'right',
  },
  controlsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  playButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    elevation: 2,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pulsingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.full,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  pulseText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  voicePracticeBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#F3E8FF',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  voicePracticeText: {
    color: '#6B21A8',
    fontSize: 13,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.sm,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
  },
});

