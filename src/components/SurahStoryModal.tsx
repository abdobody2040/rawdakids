// Surah Story & Tadabbur Modal (بطاقة قصة السورة وتدبرها للأطفال)
import React, { useState } from 'react';
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
import { Surah } from '@/data/quranData';
import { audioService } from '@/services/audioService';
import { SHADOWS } from '@/constants/theme';

const QURAN_GARDEN_IMG = require('../../assets/images/quran-garden.jpg');

interface SurahStoryModalProps {
  visible: boolean;
  surah: Surah | null;
  language: 'ar' | 'en';
  onDismiss: () => void;
  onStartReciting: () => void;
}

export default function SurahStoryModal({
  visible,
  surah,
  language,
  onDismiss,
  onStartReciting,
}: SurahStoryModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isAr = language === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!surah) return null;

  const title = isAr ? surah.nameArabic : surah.nameTransliteration;
  const storyIntro = isAr ? surah.storyIntroAr : surah.storyIntroEn;
  const lessons = isAr ? surah.coreLessonsAr : surah.coreLessonsEn;

  const handlePlayAudioIntro = async () => {
    if (isPlayingAudio) {
      await audioService.stopDua();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await audioService.playDua(storyIntro, (status) => {
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

  const handleStart = () => {
    audioService.stopDua();
    setIsPlayingAudio(false);
    onStartReciting();
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
            colors={['#174e46', '#267960', '#3f9a75']}
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

            <View style={styles.iconCircle}>
              <Image source={QURAN_GARDEN_IMG} style={styles.iconImage} />
            </View>

            <Text style={styles.eyebrow}>
              {isAr ? 'قصة وتدبّر الآيات الكريمة' : 'Surah Story & Tadabbur'}
            </Text>
            <Text style={styles.surahTitle}>
              {isAr ? `سورة ${title}` : `Surah ${title}`}
            </Text>
            <Text style={styles.surahSubtitle}>
              {surah.ayahCount} {isAr ? 'آيات مباركات' : 'Blessed Ayahs'} •{' '}
              {surah.revelationType === 'Meccan'
                ? isAr
                  ? 'مكية'
                  : 'Meccan'
                : isAr
                ? 'مدنية'
                : 'Medinan'}
            </Text>
          </LinearGradient>

          {/* Modal Body */}
          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Story / Context Card */}
            <View style={styles.sectionBox}>
              <View
                style={[
                  styles.sectionHeadRow,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                <Text style={styles.sectionHeadEmoji}>🌟</Text>
                <Text style={styles.sectionHeadTitle}>
                  {isAr ? 'ما هي رسالة هذه السورة العظيمة؟' : 'The Message of this Surah:'}
                </Text>
              </View>
              <Text
                style={[
                  styles.storyIntroText,
                  isAr && { textAlign: 'right' },
                ]}
              >
                {storyIntro}
              </Text>

              {/* Audio Listen Button */}
              <TouchableOpacity
                style={[
                  styles.audioBtn,
                  isPlayingAudio && styles.audioBtnPlaying,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
                onPress={handlePlayAudioIntro}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlayingAudio ? 'pause-circle' : 'volume-high'}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.audioBtnText}>
                  {isPlayingAudio
                    ? isAr
                      ? 'جارٍ الاستماع... (إيقاف)'
                      : 'Listening... (Pause)'
                    : isAr
                    ? 'استمع لقصة السورة بصوت عذب'
                    : 'Listen to Surah Story'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Core Lessons (ماذا نتعلم؟) */}
            <View style={styles.sectionBox}>
              <View
                style={[
                  styles.sectionHeadRow,
                  { flexDirection: isAr ? 'row-reverse' : 'row' },
                ]}
              >
                <Text style={styles.sectionHeadEmoji}>💡</Text>
                <Text style={styles.sectionHeadTitle}>
                  {isAr ? 'ماذا نتعلم ونطبق في حياتنا؟' : 'What We Learn & Apply:'}
                </Text>
              </View>

              <View style={styles.lessonsList}>
                {lessons.map((lesson, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.lessonItem,
                      { flexDirection: isAr ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={14} color="#15803d" />
                    </View>
                    <Text
                      style={[
                        styles.lessonText,
                        isAr && { textAlign: 'right' },
                      ]}
                    >
                      {lesson}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryCtaText}>
                {isAr ? 'ابدأ تلاوة السورة المباركة' : 'Start Recitation Now'}
              </Text>
              <Ionicons
                name={isAr ? 'arrow-back' : 'arrow-forward'}
                size={18}
                color="#385540"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 25, 0.65)',
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
    maxWidth: 620,
  },

  // HEADER BANNER
  headerBanner: {
    padding: 24,
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
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#fff',
    ...SHADOWS.soft,
  },
  iconImage: {
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
  surahTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 4,
    marginBottom: 2,
  },
  surahSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d6eee1',
  },

  // BODY
  bodyScroll: {
    maxHeight: 380,
  },
  bodyContent: {
    padding: 22,
    gap: 16,
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#edf3ed',
    ...SHADOWS.soft,
  },
  sectionHeadRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionHeadEmoji: {
    fontSize: 18,
  },
  sectionHeadTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#183c38',
  },
  storyIntroText: {
    fontSize: 14,
    color: '#39534c',
    lineHeight: 24,
    fontWeight: '600',
  },
  audioBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#267960',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 12,
  },
  audioBtnPlaying: {
    backgroundColor: '#059669',
  },
  audioBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  // LESSONS
  lessonsList: {
    gap: 10,
  },
  lessonItem: {
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  lessonText: {
    flex: 1,
    fontSize: 13,
    color: '#2d433e',
    lineHeight: 20,
    fontWeight: '600',
  },

  // FOOTER
  modalFooter: {
    padding: 18,
    backgroundColor: '#f8f6ee',
    borderTopWidth: 1,
    borderTopColor: '#ede9db',
  },
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffcf5c',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#d99835',
    ...SHADOWS.glow('#d99835'),
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#385540',
  },
});
