import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ayah } from '@/data/quranData';
import { voiceRecordService } from '@/services/voiceRecordService';
import { audioService } from '@/services/audioService';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import { Language } from '@/constants/i18n';

interface ChildVoiceRecorderModalProps {
  visible: boolean;
  ayah: Ayah | null;
  surahName: string;
  reciterAudioUrl?: string;
  language: Language;
  onClose: () => void;
  onAwardReward: () => void;
}

export default function ChildVoiceRecorderModal({
  visible,
  ayah,
  surahName,
  reciterAudioUrl,
  language,
  onClose,
  onAwardReward,
}: ChildVoiceRecorderModalProps) {
  const isAr = language === 'ar';
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlayingChildAudio, setIsPlayingChildAudio] = useState(false);
  const [isPlayingReciterAudio, setIsPlayingReciterAudio] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      voiceRecordService.stopRecording();
      voiceRecordService.stopPlayback();
      voiceRecordService.clearRecording();
    };
  }, []);

  const handleClose = () => {
    voiceRecordService.stopRecording();
    voiceRecordService.stopPlayback();
    voiceRecordService.clearRecording();
    audioService.pause();
    setIsRecording(false);
    setHasRecorded(false);
    setIsPlayingChildAudio(false);
    setIsPlayingReciterAudio(false);
    setRecordError(null);
    onClose();
  };

  if (!visible || !ayah) return null;

  const handleStartRecording = async () => {
    setRecordError(null);
    audioService.pause();
    setIsPlayingReciterAudio(false);
    voiceRecordService.stopPlayback();
    setIsPlayingChildAudio(false);

    const started = await voiceRecordService.startRecording((sec) => {
      setRecordedDuration(sec);
    });

    if (started) {
      setIsRecording(true);
      setRecordedDuration(0);
      setHasRecorded(false);
    } else {
      setRecordError(
        isAr
          ? 'يرجى السماح بالوصول إلى الميكروفون لبدء التسجيل'
          : 'Please allow microphone access to record recitation'
      );
    }
  };

  const handleStopRecording = async () => {
    const audioUrl = await voiceRecordService.stopRecording();
    setIsRecording(false);
    if (audioUrl) {
      setHasRecorded(true);
    }
  };

  const handlePlayChildRecitation = () => {
    if (isPlayingChildAudio) {
      voiceRecordService.stopPlayback();
      setIsPlayingChildAudio(false);
      return;
    }

    audioService.pause();
    setIsPlayingReciterAudio(false);

    setIsPlayingChildAudio(true);
    voiceRecordService.playRecording((status) => {
      if (status.didJustFinish || !status.isPlaying) {
        setIsPlayingChildAudio(false);
      }
    });
  };

  const handlePlayReciterComparison = async () => {
    if (isPlayingReciterAudio) {
      audioService.pause();
      setIsPlayingReciterAudio(false);
      return;
    }

    voiceRecordService.stopPlayback();
    setIsPlayingChildAudio(false);

    if (reciterAudioUrl) {
      setIsPlayingReciterAudio(true);
      await audioService.playAyah(reciterAudioUrl, 1.0, (status) => {
        if (status.didJustFinish || !status.isPlaying) {
          setIsPlayingReciterAudio(false);
        }
      });
    }
  };

  const handleFinishAndSave = () => {
    onAwardReward();
    handleClose();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={[styles.headerRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isAr ? 'flex-end' : 'flex-start' }}>
              <Text style={styles.headerTitle}>
                {isAr ? '🎙️ استوديو تلاوة البطل' : '🎙️ Young Reciter Studio'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isAr
                  ? `سورة ${surahName} — آية (${ayah.number})`
                  : `Surah ${surahName} — Ayah (${ayah.number})`}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Ayah Calligraphy Box */}
            <View style={styles.ayahBox}>
              <Text style={styles.ayahText}>{ayah.textUthmani}</Text>
            </View>

            {/* Error notice if microphone denied */}
            {recordError && (
              <View style={styles.errorBox}>
                <Ionicons name="warning" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{recordError}</Text>
              </View>
            )}

            {/* Main Interactive Mic Area */}
            <View style={styles.micArea}>
              {isRecording ? (
                <View style={styles.recordingStateBox}>
                  <View style={styles.pulsingMicHalo}>
                    <TouchableOpacity
                      style={styles.activeRecordingBtn}
                      onPress={handleStopRecording}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="square" size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.recordingTimer}>{formatTimer(recordedDuration)}</Text>
                  <Text style={styles.recordingHint}>
                    {isAr ? 'تلاوتك جارية... اضغط على المربع لإيقاف التسجيل' : 'Recording... tap square when done'}
                  </Text>
                </View>
              ) : (
                <View style={styles.idleStateBox}>
                  <TouchableOpacity
                    style={[styles.startRecordBtn, hasRecorded && styles.reRecordBtn]}
                    onPress={handleStartRecording}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="mic" size={40} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.idleTitle}>
                    {hasRecorded
                      ? (isAr ? 'اضغط لإعادة التسجيل 🔄' : 'Tap to Re-record 🔄')
                      : (isAr ? 'اضغط على الميكروفون وابدأ التلاوة بصوتك الجميل!' : 'Tap the microphone and recite aloud!')}
                  </Text>
                </View>
              )}
            </View>

            {/* Playback & Comparison Action Buttons (When recorded) */}
            {hasRecorded && !isRecording && (
              <View style={styles.actionsBox}>
                <View style={styles.divider} />
                <Text style={styles.actionsHeading}>
                  {isAr ? '🌟 استمع وقارن تلاوتك مع الشيخ:' : '🌟 Listen & Compare:'}
                </Text>

                <View style={[styles.buttonsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                  {/* Play Child Recitation */}
                  <TouchableOpacity
                    style={[
                      styles.actionCardBtn,
                      styles.childAudioBtn,
                      isPlayingChildAudio && styles.audioBtnActive,
                    ]}
                    onPress={handlePlayChildRecitation}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isPlayingChildAudio ? 'pause-circle' : 'play-circle'}
                      size={26}
                      color="#FFFFFF"
                    />
                    <Text style={styles.actionBtnText}>
                      {isPlayingChildAudio
                        ? (isAr ? 'إيقاف صوتك' : 'Pause Yours')
                        : (isAr ? 'تلاوتك العذبة' : 'Your Recitation')}
                    </Text>
                  </TouchableOpacity>

                  {/* Play Reciter Audio */}
                  {reciterAudioUrl && (
                    <TouchableOpacity
                      style={[
                        styles.actionCardBtn,
                        styles.reciterAudioBtn,
                        isPlayingReciterAudio && styles.audioBtnActive,
                      ]}
                      onPress={handlePlayReciterComparison}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isPlayingReciterAudio ? 'pause-circle' : 'volume-high'}
                        size={26}
                        color="#FFFFFF"
                      />
                      <Text style={styles.actionBtnText}>
                        {isPlayingReciterAudio
                          ? (isAr ? 'إيقاف الشيخ' : 'Pause Sheikh')
                          : (isAr ? 'تلاوة الشيخ' : 'Sheikh Voice')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Motivational Quote */}
                <View style={styles.cheerBox}>
                  <Text style={styles.cheerIcon}>🌟</Text>
                  <Text style={styles.cheerText}>
                    {isAr
                      ? 'ما شاء الله تبارك الله! صوتك رائع، تلاوة القرآن تملأ قلبك بركة ونوراً!'
                      : 'Masha’Allah! Beautiful recitation! Keep reading to shine brighter!'}
                  </Text>
                </View>

                {/* Save & Claim Reward Button */}
                <TouchableOpacity
                  style={styles.claimRewardBtn}
                  onPress={handleFinishAndSave}
                  activeOpacity={0.85}
                >
                  <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                  <Text style={styles.claimRewardText}>
                    {isAr ? 'أحسنت يا بطل! احصل على نجمة الإتقان ⭐' : 'Awesome! Claim Recitation Star ⭐'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  headerRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '700',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: SPACING.lg,
  },
  ayahBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  ayahText: {
    fontSize: 20,
    lineHeight: 38,
    textAlign: 'center',
    color: '#1F2937',
    fontFamily: TYPOGRAPHY.quranFont,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: SPACING.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
  },
  micArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  idleStateBox: {
    alignItems: 'center',
  },
  startRecordBtn: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  reRecordBtn: {
    backgroundColor: '#D97706',
  },
  idleTitle: {
    marginTop: SPACING.sm,
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
  },
  recordingStateBox: {
    alignItems: 'center',
  },
  pulsingMicHalo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    borderWidth: 3,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRecordingBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  recordingTimer: {
    fontSize: 24,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: SPACING.sm,
  },
  recordingHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '700',
  },
  actionsBox: {
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: SPACING.md,
  },
  actionsHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  actionCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  childAudioBtn: {
    backgroundColor: '#059669',
  },
  reciterAudioBtn: {
    backgroundColor: '#B45309',
  },
  audioBtnActive: {
    opacity: 0.85,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cheerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginVertical: SPACING.md,
  },
  cheerIcon: {
    fontSize: 22,
  },
  cheerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    fontWeight: '700',
    lineHeight: 18,
  },
  claimRewardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    ...SHADOWS.soft,
  },
  claimRewardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
