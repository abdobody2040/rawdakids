import { useState, useEffect } from 'react';
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
import { AsmaAllahItem } from '@/data/asmaAllahData';
import { Language, isRTL } from '@/constants/i18n';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import {
  getUpgradeLabel,
  getLocalizedAsmaAllah,
} from '@/services/multilingualUpgradeService';
import { audioService } from '@/services/audioService';

const MASCOT_NOOR_IMG = require('../../assets/images/mascot-noor.jpg');

interface AsmaDetailModalProps {
  visible: boolean;
  item: AsmaAllahItem | null;
  language: Language;
  isApplied: boolean;
  quizAnswer: number | undefined;
  onApplyToggle: (id: string) => void;
  onQuizAnswer: (id: string, optionIdx: number) => void;
  onDismiss: () => void;
}

export default function AsmaDetailModal({
  visible,
  item,
  language,
  isApplied,
  quizAnswer,
  onApplyToggle,
  onQuizAnswer,
  onDismiss,
}: AsmaDetailModalProps) {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isRtl = isRTL(language);
  const isAr = language === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, [item?.id, visible]);

  if (!visible || !item) return null;

  const localized = getLocalizedAsmaAllah(item, language);

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      await audioService.stop();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    const audioText = `اسمُ اللهِ الحُسْنَى: ${item.name}`;
    await audioService.playDua(
      audioText,
      (status) => {
        if (status.isPlaying) setIsPlayingAudio(true);
        if (status.didJustFinish || status.error) setIsPlayingAudio(false);
      },
      'ar'
    );
  };

  const handleModalClose = () => {
    audioService.stop();
    setIsPlayingAudio(false);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleModalClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={handleModalClose}
        />

        <View
          style={[
            styles.modalContainer,
            isDesktop && styles.modalContainerDesktop,
            { maxHeight: Math.min(height * 0.9, 720) },
          ]}
        >
          {/* Header Gradient */}
          <LinearGradient
            colors={['#7c3aed', '#6366f1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBar}
          >
            <View style={[styles.headerRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.mascotWrap}>
                <Image source={MASCOT_NOOR_IMG} style={styles.mascotImg} />
              </View>

              <View style={styles.headerTitleWrap}>
                <View style={[styles.dayBadge, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.dayBadgeText}>
                    {`${getUpgradeLabel('dayLabel', language)} ${item.day}`}
                  </Text>
                  <Text style={styles.emojiText}>{item.cardEmoji}</Text>
                </View>
                <Text style={[styles.headerDivineName, isRtl && { textAlign: 'right' }]}>
                  {localized.name}
                </Text>
                <TouchableOpacity
                  style={[styles.audioPillBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                  onPress={handlePlayAudio}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isPlayingAudio ? 'stop-circle' : 'volume-high'}
                    size={16}
                    color="#ffffff"
                  />
                  <Text style={styles.audioPillBtnText}>
                    {isPlayingAudio
                      ? (isAr ? 'إيقاف التلاوة' : 'Stop')
                      : (isAr ? 'استمع للاسم' : 'Listen')}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleModalClose}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.bodyScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Simple Meaning */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="sparkles" size={18} color="#8b5cf6" />
                <Text style={styles.sectionTitle}>
                  {getUpgradeLabel('asmaSimpleMeaning', language)}
                </Text>
              </View>
              <Text style={[styles.meaningText, isRtl && { textAlign: 'right' }]}>
                {localized.meaning}
              </Text>
            </View>

            {/* Quran Ayah Reference */}
            {item.ayah ? (
              <View style={styles.ayahCard}>
                <View style={[styles.ayahHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="book-outline" size={18} color="#059669" />
                  <Text style={styles.ayahLabel}>
                    {getUpgradeLabel('versesLabel', language) || 'الشاهد من القرآن'}
                  </Text>
                </View>
                <Text style={[styles.ayahText, isRtl && { textAlign: 'right' }]}>
                  {item.ayah}
                </Text>
              </View>
            ) : null}

            {/* Story / Cosmic Reflection */}
            {item.story ? (
              <View style={styles.storyCard}>
                <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="bulb-outline" size={18} color="#b45309" />
                  <Text style={styles.storyLabel}>
                    {getUpgradeLabel('storyLabel', language) || 'تأمّل وتعلّم'}
                  </Text>
                </View>
                <Text style={[styles.storyText, isRtl && { textAlign: 'right' }]}>
                  {item.story}
                </Text>
              </View>
            ) : null}

            {/* Daily Practical Application */}
            <View style={styles.applyCard}>
              <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Ionicons name="heart" size={20} color="#ec4899" />
                <Text style={styles.applyLabel}>
                  {getUpgradeLabel('asmaDailyApply', language)}
                </Text>
              </View>
              <Text style={[styles.applyText, isRtl && { textAlign: 'right' }]}>
                {localized.apply}
              </Text>

              <TouchableOpacity
                style={[styles.applyBtn, isApplied && styles.applyBtnDone]}
                onPress={() => onApplyToggle(item.id)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={isApplied ? 'checkmark-circle' : 'heart-outline'}
                  size={20}
                  color={isApplied ? '#ffffff' : '#ec4899'}
                />
                <Text style={[styles.applyBtnText, isApplied && styles.applyBtnTextDone]}>
                  {isApplied
                    ? (getUpgradeLabel('completedMannerTodayBtn', language) || 'تم التطبيق بنجاح! ⭐')
                    : (getUpgradeLabel('applyActionToday', language) || 'سأفعل ذلك اليوم!')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Interactive Quiz */}
            {item.quizQuestion ? (
              <View style={styles.quizCard}>
                <View style={[styles.sectionTitleRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="help-circle" size={18} color="#6366f1" />
                  <Text style={styles.quizLabel}>
                    {getUpgradeLabel('quickQuizTitle', language) || 'اختبر معلوماتك'}
                  </Text>
                </View>
                <Text style={[styles.quizQuestion, isRtl && { textAlign: 'right' }]}>
                  {item.quizQuestion}
                </Text>

                <View style={styles.quizOptionsCol}>
                  {item.quizOptions.map((opt, idx) => {
                    const isAnswered = quizAnswer !== undefined;
                    const isSelected = quizAnswer === idx;
                    const isCorrect = idx === item.correctOptionIndex;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.quizOptBtn,
                          isAnswered && isCorrect && styles.quizOptCorrect,
                          isAnswered && isSelected && !isCorrect && styles.quizOptWrong,
                        ]}
                        onPress={() => onQuizAnswer(item.id, idx)}
                        disabled={isAnswered}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.quizOptText,
                            isAnswered && isCorrect && styles.quizOptTextCorrect,
                            isAnswered && isSelected && !isCorrect && styles.quizOptTextWrong,
                          ]}
                        >
                          {opt}
                        </Text>
                        {isAnswered && isCorrect && (
                          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <Ionicons name="close-circle" size={18} color="#ef4444" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Footer Close Button */}
          <View style={styles.footerBar}>
            <TouchableOpacity style={styles.footerDoneBtn} onPress={handleModalClose} activeOpacity={0.85}>
              <Text style={styles.footerDoneBtnText}>
                {language === 'ar' ? 'حفظ وإغلاق' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  backdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  modalContainerDesktop: {
    maxWidth: 560,
  },
  headerBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerRow: {
    alignItems: 'center',
    gap: 12,
  },
  mascotWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  mascotImg: {
    width: '100%',
    height: '100%',
  },
  headerTitleWrap: {
    flex: 1,
  },
  dayBadge: {
    alignItems: 'center',
    gap: 6,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#e0e7ff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  emojiText: {
    fontSize: 14,
  },
  headerDivineName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  audioPillBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    gap: 6,
  },
  audioPillBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    padding: SPACING.md,
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#faf5ff',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  sectionTitleRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7c3aed',
  },
  meaningText: {
    fontSize: 15,
    color: '#4c1d95',
    lineHeight: 23,
    fontWeight: '600',
  },
  ayahCard: {
    backgroundColor: '#ecfdf5',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  ayahHeaderRow: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ayahLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  ayahText: {
    fontSize: 14,
    color: '#065f46',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  storyCard: {
    backgroundColor: '#fffbeb',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  storyLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
  },
  storyText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 22,
  },
  applyCard: {
    backgroundColor: '#fdf2f8',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  applyLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#db2777',
  },
  applyText: {
    fontSize: 14,
    color: '#9d174d',
    lineHeight: 21,
    marginBottom: 10,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#ec4899',
  },
  applyBtnDone: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ec4899',
  },
  applyBtnTextDone: {
    color: '#ffffff',
  },
  quizCard: {
    backgroundColor: '#f8fafc',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quizLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4f46e5',
  },
  quizQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  quizOptionsCol: {
    gap: 8,
  },
  quizOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  quizOptText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  quizOptCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: RADIUS.md,
  },
  quizOptTextCorrect: {
    fontSize: 13,
    color: '#065f46',
    fontWeight: '800',
  },
  quizOptWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: RADIUS.md,
  },
  quizOptTextWrong: {
    fontSize: 13,
    color: '#991b1b',
    fontWeight: '700',
  },
  footerBar: {
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  footerDoneBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerDoneBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
