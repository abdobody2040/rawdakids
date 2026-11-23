// src/features/tajweed/components/TajweedAudioPlayer.tsx
// Visually rich, Kid-Friendly Audio Player for Tajweed Examples
// Featuring Sheikh Mahmoud Khalil Al-Husary (Teacher Edition)
// Styled to match Rawda Kids 3D Garden aesthetic with live equalizer bars & speed toggle.

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
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
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 5 animated equalizer bars
  const [bar1] = useState(() => new Animated.Value(6));
  const [bar2] = useState(() => new Animated.Value(14));
  const [bar3] = useState(() => new Animated.Value(22));
  const [bar4] = useState(() => new Animated.Value(12));
  const [bar5] = useState(() => new Animated.Value(8));

  // Equalizer animation loop
  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      const createBarAnim = (val: Animated.Value, minH: number, maxH: number, duration: number) => {
        return Animated.sequence([
          Animated.timing(val, { toValue: maxH, duration, useNativeDriver: false }),
          Animated.timing(val, { toValue: minH, duration, useNativeDriver: false }),
        ]);
      };

      animLoop = Animated.loop(
        Animated.parallel([
          createBarAnim(bar1, 4, 18, 250),
          createBarAnim(bar2, 6, 26, 320),
          createBarAnim(bar3, 8, 30, 280),
          createBarAnim(bar4, 5, 22, 350),
          createBarAnim(bar5, 4, 16, 290),
        ])
      );
      animLoop.start();
    } else {
      bar1.setValue(6);
      bar2.setValue(14);
      bar3.setValue(20);
      bar4.setValue(12);
      bar5.setValue(8);
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying, bar1, bar2, bar3, bar4, bar5]);

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
        audio.playbackRate = playbackSpeed;

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
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleToggleSpeed = () => {
    const nextSpeed = playbackSpeed === 1.0 ? 0.8 : 1.0;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  return (
    <View style={[styles.card, { borderColor: accentColor + '40' }]}>
      {/* ── Top Bar: Ornate Surah Citation & Reciter Badge ──── */}
      <View style={styles.topRow}>
        <View style={[styles.surahTag, { backgroundColor: accentColor + '15', borderColor: accentColor + '30' }]}>
          <Ionicons name="bookmark" size={13} color={accentColor} />
          <Text style={[styles.surahTagText, { color: accentColor }]}>
            سورة {example.surahNameAr} • الآية {example.ayahNumber}
          </Text>
        </View>

        <View style={styles.reciterTag}>
          <Ionicons name="sparkles" size={13} color="#D97706" />
          <Text style={styles.reciterTagText}>الشيخ الحصري (المعلم)</Text>
        </View>
      </View>

      {/* ── Quranic Parchment Card with Arabic Text ────────── */}
      <View style={styles.parchmentBox}>
        <View style={styles.ornateCornerTopRight} />
        <View style={styles.ornateCornerTopLeft} />
        <View style={styles.ornateCornerBottomRight} />
        <View style={styles.ornateCornerBottomLeft} />

        <Text style={styles.quranText} textBreakStrategy="simple">
          {`﴿ ${example.ayahText} ﴾`}
        </Text>
      </View>

      {/* ── Spotlight Tag: Target Word & Highlighted Rule ──── */}
      <View style={styles.spotlightRow}>
        <View style={[styles.wordBadge, { borderColor: accentColor, backgroundColor: accentColor + '10' }]}>
          <View style={[styles.wordDot, { backgroundColor: accentColor }]} />
          <Text style={styles.wordLabel}>الكلمة:</Text>
          <Text style={[styles.wordHighlight, { color: accentColor }]}>
            {example.targetWord}
          </Text>
        </View>

        <View style={[styles.ruleBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
          <Ionicons name="ribbon" size={14} color="#B45309" />
          <Text style={styles.ruleBadgeText} numberOfLines={1}>
            {example.highlightRule}
          </Text>
        </View>
      </View>

      {/* ── Teacher Audio Note ─────────────────────────────── */}
      <View style={styles.noteBanner}>
        <View style={styles.noteIconCircle}>
          <Ionicons name="headset" size={15} color="#059669" />
        </View>
        <Text style={styles.noteBannerText}>{example.audioNoteAr}</Text>
      </View>

      {/* ── Controls Row: Big Play Button + Equalizer + Practice ── */}
      <View style={styles.actionRow}>
        <View style={styles.leftControls}>
          {/* Tactile Play/Pause Button */}
          <TouchableOpacity
            style={[
              styles.playBtn,
              { backgroundColor: isPlaying ? '#DC2626' : accentColor },
            ]}
            onPress={handleTogglePlay}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.playBtnText}>
                  {isPlaying ? 'إيقاف' : 'استمع للشيخ 🔊'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Slow/Normal Speed Toggle */}
          <TouchableOpacity
            style={[styles.speedBtn, playbackSpeed === 0.8 && styles.speedBtnActive]}
            onPress={handleToggleSpeed}
            activeOpacity={0.8}
          >
            <Text style={[styles.speedBtnText, playbackSpeed === 0.8 && styles.speedBtnTextActive]}>
              {playbackSpeed === 0.8 ? '🐢 بطيء 0.8x' : '⚡ 1.0x'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Animated Equalizer or Voice Practice */}
        <View style={styles.rightControls}>
          {isPlaying ? (
            <View style={styles.equalizerWrap}>
              <Animated.View style={[styles.eqBar, { height: bar1, backgroundColor: accentColor }]} />
              <Animated.View style={[styles.eqBar, { height: bar2, backgroundColor: accentColor }]} />
              <Animated.View style={[styles.eqBar, { height: bar3, backgroundColor: accentColor }]} />
              <Animated.View style={[styles.eqBar, { height: bar4, backgroundColor: accentColor }]} />
              <Animated.View style={[styles.eqBar, { height: bar5, backgroundColor: accentColor }]} />
            </View>
          ) : (
            onVoicePractice && (
              <TouchableOpacity
                style={styles.voiceBtn}
                onPress={onVoicePractice}
                activeOpacity={0.85}
              >
                <Ionicons name="mic" size={15} color="#6D28D9" />
                <Text style={styles.voiceBtnText}>ردد الآن 🎙️</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {hasError && (
        <View style={styles.errorAlert}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text style={styles.errorAlertText}>
            تعذر تشغيل التسجيل الصوتي. يرجى التحقق من اتصال الإنترنت.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    padding: SPACING.md + 2,
    borderWidth: 2,
    marginBottom: SPACING.md + 2,
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm + 2,
    gap: 8,
    flexWrap: 'wrap',
  },
  surahTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  surahTagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  reciterTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reciterTagText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700',
  },
  parchmentBox: {
    backgroundColor: '#FFFDF9',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#EFE7DA',
    marginBottom: SPACING.sm + 4,
    position: 'relative',
    overflow: 'hidden',
  },
  ornateCornerTopRight: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D4AF37',
  },
  ornateCornerTopLeft: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#D4AF37',
  },
  ornateCornerBottomRight: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D4AF37',
  },
  ornateCornerBottomLeft: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 8,
    height: 8,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#D4AF37',
  },
  quranText: {
    fontFamily: Platform.select({ ios: 'Scheherazade New', android: 'Scheherazade New', default: 'Amiri, serif' }),
    fontSize: 23,
    lineHeight: 46,
    color: '#064E3B',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  spotlightRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.sm + 2,
  },
  wordBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
  },
  wordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  wordLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  wordHighlight: {
    fontSize: 15,
    fontWeight: '800',
  },
  ruleBadge: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minWidth: 140,
  },
  ruleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  noteBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  noteIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBannerText: {
    fontSize: 12.5,
    color: '#065F46',
    lineHeight: 18,
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  leftControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    ...SHADOWS.soft,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  speedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  speedBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  speedBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  speedBtnTextActive: {
    color: '#B45309',
  },
  rightControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  equalizerWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 32,
    gap: 4,
    paddingHorizontal: 12,
  },
  eqBar: {
    width: 4,
    borderRadius: 2,
  },
  voiceBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#F5F3FF',
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  voiceBtnText: {
    color: '#6D28D9',
    fontSize: 12.5,
    fontWeight: '800',
  },
  errorAlert: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.sm,
  },
  errorAlertText: {
    fontSize: 11.5,
    color: '#DC2626',
    fontWeight: '600',
  },
});
