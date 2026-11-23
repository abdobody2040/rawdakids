// src/features/tajweed/components/TajweedRuleModal.tsx
// Kid-friendly bottom-sheet modal shown when a child taps a Tajweed-colored token.
// Shows rule name, kid explanation, and plays the ayah via Husary Muallim reciter.

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { TajweedToken, TajweedAyah, tajweedService } from '../tajweedService';
import { TAJWEED_CATEGORIES } from '../tajweedRules';

interface TajweedRuleModalProps {
  visible: boolean;
  token: TajweedToken | null;
  ayah: TajweedAyah | null;
  surahNumber: number;
  language: string;
  onClose: () => void;
}

export default function TajweedRuleModal({
  visible,
  token,
  ayah,
  surahNumber,
  language,
  onClose,
}: TajweedRuleModalProps) {
  const isAr = language === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (Platform.OS === 'web' && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
  }, []);

  const handleClose = () => {
    stopAudio();
    onClose();
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const handlePlayAudio = async () => {
    if (!ayah) return;
    setAudioError(false);

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    const url = tajweedService.getHusaryMuallimUrl(surahNumber, ayah.number);

    if (Platform.OS === 'web') {
      try {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          setAudioError(true);
        };
        await audio.play();
        setIsPlayingAudio(true);
      } catch {
        setAudioError(true);
      }
    } else {
      // Native: use expo-audio / HTML5 fallback not available, show message
      setAudioError(true);
    }
  };

  if (!visible || !token) return null;

  const category = token.category ?? null;
  const categoryFallback = TAJWEED_CATEGORIES.madd; // safe fallback

  const cat = category ?? categoryFallback;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={[styles.headerRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={[styles.colorBadge, { backgroundColor: cat.bgColor }]}>
              <Text style={styles.emojiText}>{cat.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.categoryName, { color: cat.color }]}>
                {isAr ? cat.nameAr : cat.nameEn}
              </Text>
              <Text style={[styles.ruleCodeText, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? 'قاعدة التجويد' : 'Tajweed Rule'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Highlighted word */}
          <View style={[styles.wordBox, { backgroundColor: cat.bgColor, borderColor: cat.color }]}>
            <Text style={[styles.wordText, { color: cat.color }]}>
              {token.text}
            </Text>
          </View>

          {/* Kid explanation */}
          <View style={styles.explanationBox}>
            <Ionicons name="sparkles" size={16} color={cat.color} />
            <Text style={[styles.explanationText, { textAlign: isAr ? 'right' : 'left' }]}>
              {isAr ? cat.kidExplanationAr : cat.kidExplanationEn}
            </Text>
          </View>

          {/* Listen button */}
          <TouchableOpacity
            style={[
              styles.listenBtn,
              { backgroundColor: isPlayingAudio ? cat.color : cat.bgColor, borderColor: cat.color },
            ]}
            onPress={handlePlayAudio}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={isAr ? 'استمع للنطق' : 'Listen to pronunciation'}
          >
            {isPlayingAudio ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isPlayingAudio ? 'pause-circle' : 'volume-high'}
                size={20}
                color={isPlayingAudio ? '#FFFFFF' : cat.color}
              />
            )}
            <Text
              style={[
                styles.listenBtnText,
                { color: isPlayingAudio ? '#FFFFFF' : cat.color },
              ]}
            >
              {isPlayingAudio
                ? (isAr ? 'جاري التشغيل...' : 'Playing...')
                : (isAr ? 'استمع للنطق 🔊' : 'Listen to Recitation 🔊')}
            </Text>
          </TouchableOpacity>

          {audioError && (
            <Text style={styles.errorText}>
              {isAr
                ? 'تعذّر تشغيل الصوت — تحقق من الاتصال بالإنترنت'
                : 'Could not play audio — check your internet connection'}
            </Text>
          )}

          {/* Ayah number badge */}
          {ayah && (
            <Text style={styles.ayahRefText}>
              {isAr
                ? `الآية الكريمة رقم ${ayah.number}`
                : `Verse ${ayah.number}`}
            </Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    ...SHADOWS.strong,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  headerRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  colorBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 22,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '800',
  },
  ruleCodeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBox: {
    borderWidth: 2,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  wordText: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  explanationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  explanationText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    fontWeight: '600',
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 2,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginBottom: SPACING.sm,
  },
  listenBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  ayahRefText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
});

