// Ayah Tafsir & Tadabbur Modal (بطاقة تفسير وتدبر الآية الكريمة للأطفال)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Ayah, Surah } from '@/data/quranData';
import { audioService } from '@/services/audioService';
import { SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedAgeTone } from '@/services/ageAdaptiveService';

const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');

interface AyahTafsirModalProps {
  visible: boolean;
  surah: Surah | null;
  ayah: Ayah | null;
  language: 'ar' | 'en';
  onDismiss: () => void;
  onUnderstood?: () => void;
}

export default function AyahTafsirModal({
  visible,
  surah,
  ayah,
  language,
  onDismiss,
  onUnderstood,
}: AyahTafsirModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isAr = language === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { profiles, activeProfileId } = useAppStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const ageTone = getLocalizedAgeTone(activeProfile?.ageBand, language);

  useEffect(() => {
    return () => {
      audioService.stopDua();
    };
  }, []);

  if (!visible || !surah || !ayah) return null;

  const handlePlayTafsirAudio = async () => {
    if (isPlayingAudio) {
      await audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await audioService.playDua(ayah.simpleTafsir, (status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
  };

  const handleClose = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    onDismiss();
  };

  const handleUnderstoodClick = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    if (onUnderstood) {
      onUnderstood();
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          {/* Header Banner */}
          <LinearGradient
            colors={['#184e42', '#287d65', '#3fa580']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBanner}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.mascotCircle}>
              <Image source={MASCOT_NOOR_IMG} style={styles.mascotImage} />
            </View>

            <Text style={styles.eyebrow}>
              {isAr ? 'تفسير وتدبّر الآية الكريمة' : 'Ayah Meaning & Reflection'}
            </Text>
            <Text style={styles.modalTitle}>
              {isAr ? `سورة ${surah.nameArabic} • الآية ${ayah.number}` : `Surah ${surah.nameTransliteration} • Ayah ${ayah.number}`}
            </Text>
          </LinearGradient>

          {/* Modal Body */}
          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ayah Quran Text Card */}
            <View style={styles.ayahBox}>
              <Text style={styles.uthmaniText}>
                {ayah.textUthmani}
              </Text>
              <View style={styles.ayahNumberBadge}>
                <Text style={styles.ayahNumberBadgeText}>﴿{ayah.number}﴾</Text>
              </View>
            </View>

            {/* Tafsir Box */}
            <View style={styles.tafsirSection}>
              <View
                style={[
                  styles.tafsirSectionHeader,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                <View
                  style={[
                    styles.tafsirLabelRow,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>💡</Text>
                  <Text style={styles.tafsirHeaderTitle}>
                    {isAr ? 'التفسير الميسر للأطفال' : 'Easy Ayah Tafsir'}
                  </Text>
                </View>

                {/* Listen Audio Button */}
                <TouchableOpacity
                  style={[
                    styles.listenBtn,
                    isPlayingAudio && styles.listenBtnPlaying,
                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                  ]}
                  onPress={handlePlayTafsirAudio}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={isPlayingAudio ? 'pause-circle' : 'volume-high'}
                    size={17}
                    color={isPlayingAudio ? '#ffffff' : '#92400e'}
                  />
                  <Text
                    style={[
                      styles.listenBtnText,
                      isPlayingAudio && styles.listenBtnTextPlaying,
                    ]}
                  >
                    {isPlayingAudio
                      ? (isAr ? 'إيقاف الصوت' : 'Pause')
                      : (isAr ? 'استمع للتفسير' : 'Listen')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.tafsirParagraph,
                  isAr && { textAlign: 'right' },
                ]}
              >
                {ayah.simpleTafsir}
              </Text>
            </View>

            {/* Age-Adaptive Reflection Box */}
            <View style={styles.ageTakeawayCard}>
              <View style={[styles.ageTakeawayHeader, isAr && { flexDirection: 'row-reverse' }]}>
                <Text style={{ fontSize: 18 }}>
                  {activeProfile?.ageBand === '4-6' ? '🌱' : activeProfile?.ageBand === '7-9' ? '🚀' : '💡'}
                </Text>
                <Text style={[styles.ageTakeawayTitle, isAr && { textAlign: 'right' }]}>
                  {ageTone.tafsirTakeawayTitle}
                </Text>
                <View style={styles.ageBadgePill}>
                  <Text style={styles.ageBadgePillText}>{ageTone.badgeTitle}</Text>
                </View>
              </View>
              <Text style={[styles.ageTakeawayDesc, isAr && { textAlign: 'right' }]}>
                {ageTone.tafsirTakeawayDesc}
              </Text>
            </View>

            {/* English Translation (Only in English mode) */}
            {!isAr && ayah.translationEn ? (
              <View style={styles.translationSection}>
                <Text style={styles.translationLabel}>English Translation:</Text>
                <Text style={styles.translationText}>{ayah.translationEn}</Text>
              </View>
            ) : null}

            {/* Action CTA: Understood */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { flexDirection: isAr ? 'row-reverse' : 'row' },
              ]}
              onPress={handleUnderstoodClick}
              activeOpacity={0.88}
            >
              <Text style={{ fontSize: 20 }}>🌟</Text>
              <Text style={styles.actionBtnText}>
                {isAr ? 'فهمت معنى الآية الكريمة! (+1 نجمة)' : 'I Understood this Ayah! (+1 Star)'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 25, 0.68)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fffdf8',
    borderRadius: 28,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  modalCardDesktop: {
    maxWidth: 580,
  },
  headerBanner: {
    padding: 22,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mascotCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: '#ffc14d',
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#fff4db',
    ...SHADOWS.soft,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#bdf0d4',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 4,
  },
  bodyScroll: {
    maxHeight: 460,
  },
  bodyContent: {
    padding: 22,
    gap: 16,
  },
  ayahBox: {
    backgroundColor: '#f7faf8',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#dcece2',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  uthmaniText: {
    fontSize: 22,
    lineHeight: 42,
    fontWeight: '700',
    color: '#1a3d31',
    textAlign: 'center',
    fontFamily: 'System',
  },
  ayahNumberBadge: {
    marginTop: 10,
    backgroundColor: '#e6f3eb',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  ayahNumberBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#287d65',
  },
  tafsirSection: {
    backgroundColor: '#fffbf0',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#fde9b8',
    gap: 12,
    ...SHADOWS.soft,
  },
  tafsirSectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tafsirLabelRow: {
    alignItems: 'center',
    gap: 8,
  },
  tafsirHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400e',
  },
  listenBtn: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  listenBtnPlaying: {
    backgroundColor: '#d97706',
    borderColor: '#b45309',
  },
  listenBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
  },
  listenBtnTextPlaying: {
    color: '#ffffff',
  },
  tafsirParagraph: {
    fontSize: 14,
    lineHeight: 24,
    color: '#38463e',
    fontWeight: '600',
  },
  translationSection: {
    backgroundColor: '#f9f9fb',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  translationLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  translationText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  actionBtn: {
    backgroundColor: '#ffcf5c',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#d99835',
    ...SHADOWS.glow('#d99835'),
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#385540',
  },
  ageTakeawayCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 14,
    marginBottom: 16,
    ...SHADOWS.soft,
  },
  ageTakeawayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ageTakeawayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    flex: 1,
  },
  ageBadgePill: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ageBadgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78350F',
  },
  ageTakeawayDesc: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: '#78350F',
  },
});
