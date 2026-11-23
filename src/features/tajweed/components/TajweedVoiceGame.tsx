// src/features/tajweed/components/TajweedVoiceGame.tsx
// Free Zero-LLM Interactive Voice Practice & Madd Meter
// Uses Web Speech API (SpeechRecognition) + Web Audio API (AnalyserNode)
// All 100% client-side, no AI, no paid APIs.

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { tajweedService, TajweedAyah } from '../tajweedService';
import { TAJWEED_CATEGORIES } from '../tajweedRules';

// ─── Arabic text normalization ───────────────────────────────────────────────

function stripTashkeel(text: string): string {
  // Strip Arabic diacritics (Fathah, Dammah, Kasrah, Sukun, Shadda, Tanwin variants, etc.)
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '');
}

function normalizeArabic(text: string): string {
  return stripTashkeel(text)
    // Normalize Alef variants → ا
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize Tah Marbuta → ه
    .replace(/ة/g, 'ه')
    // Normalize Yeh variants → ي
    .replace(/ى/g, 'ي')
    // Remove punctuation / non-Arabic
    .replace(/[^\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordMatchPercent(target: string, recognized: string): number {
  const tWords = normalizeArabic(target).split(' ').filter(Boolean);
  const rWords = normalizeArabic(recognized).split(' ').filter(Boolean);
  if (tWords.length === 0) return 0;
  let matched = 0;
  for (const tw of tWords) {
    if (rWords.some((rw) => rw === tw || rw.includes(tw) || tw.includes(rw))) {
      matched++;
    }
  }
  return Math.round((matched / tWords.length) * 100);
}

// ─── Component ───────────────────────────────────────────────────────────────

interface TajweedVoiceGameProps {
  visible: boolean;
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
  language: string;
  onClose: () => void;
  onStarsAwarded?: (count: number) => void;
}

type GamePhase =
  | 'idle'
  | 'speech_listening'
  | 'speech_result'
  | 'madd_listening'
  | 'madd_success'
  | 'madd_fail';

export default function TajweedVoiceGame({
  visible,
  surahNumber,
  ayahNumber,
  ayahText,
  language,
  onClose,
  onStarsAwarded,
}: TajweedVoiceGameProps) {
  const isAr = language === 'ar';
  const { addStars, unlockBadge } = useAppStore();

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [speechResult, setSpeechResult] = useState<string>('');
  const [matchPercent, setMatchPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [tajweedAyah, setTajweedAyah] = useState<TajweedAyah | null>(null);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [isPlayingShaykhAudio, setIsPlayingShaykhAudio] = useState(false);

  // Madd Meter state
  const [maddProgress] = useState(() => new Animated.Value(0));
  const [maddHoldMs, setMaddHoldMs] = useState(0);
  const maddHoldMsRef = useRef(0);

  // Audio refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const maddIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shaykhAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load tajweed data to know if ayah has Madd/Ghunnah
  useEffect(() => {
    if (!visible) return;
    tajweedService.getAyahTajweed(surahNumber, ayahNumber).then(setTajweedAyah);
  }, [visible, surahNumber, ayahNumber]);

  const cleanup = useCallback(() => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (maddIntervalRef.current) clearInterval(maddIntervalRef.current);
    maddIntervalRef.current = null;

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;

    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;

    mediaRecorderRef.current?.stop?.();
    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];

    shaykhAudioRef.current?.pause();
    shaykhAudioRef.current = null;

    playbackAudioRef.current?.pause();
    playbackAudioRef.current = null;

    setPhase('idle');
    setErrorMsg('');
    maddHoldMsRef.current = 0;
    setMaddHoldMs(0);
    maddProgress.setValue(0);
  }, [maddProgress]);

  const handleClose = () => {
    cleanup();
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // ─── Web Speech API ───────────────────────────────────────────────────────

  const startSpeechRecognition = () => {
    if (Platform.OS !== 'web') {
      setErrorMsg(isAr ? 'التعرف على الصوت متاح في المتصفح فقط' : 'Voice recognition is web-only');
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(isAr ? 'المتصفح لا يدعم التعرف على الصوت' : 'Browser does not support speech recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setPhase('speech_listening');
    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      setSpeechResult(transcript);
      const pct = wordMatchPercent(ayahText, transcript);
      setMatchPercent(pct);
      setPhase('speech_result');
      // Award stars if >= 75%
      if (pct >= 75) {
        const bonus = pct >= 90 ? 3 : 2;
        addStars(bonus);
        onStarsAwarded?.(bonus);
        if (tajweedAyah?.hasQalqalah) {
          unlockBadge('tajweed_qalqalah_hero');
        }
      }
    };
    recognition.onerror = (event: any) => {
      setErrorMsg(isAr ? `خطأ: ${event.error}` : `Error: ${event.error}`);
      setPhase('idle');
    };
    recognition.onend = () => {
      if (phase === 'speech_listening') setPhase('idle');
    };

    recognition.start();

    // Also start MediaRecorder for self-playback
    startRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingBlobUrl(url);
        // Stop mic tracks
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
    } catch {
      // Microphone access denied — speech recognition still works (we just won't have playback)
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop?.();
    recognitionRef.current?.stop?.();
  };

  // ─── Madd Meter (Web Audio API) ──────────────────────────────────────────

  const startMaddMeter = async () => {
    if (Platform.OS !== 'web') {
      setErrorMsg(isAr ? 'مقياس المد متاح في المتصفح فقط' : 'Madd Meter is web-only');
      return;
    }
    setErrorMsg('');
    setPhase('madd_listening');
    maddHoldMsRef.current = 0;
    setMaddHoldMs(0);
    maddProgress.setValue(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Also start MediaRecorder for playback comparison
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        setRecordingBlobUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();

      // Sample every 50ms
      const SAMPLE_INTERVAL_MS = 50;
      const NOISE_FLOOR = 20; // RMS threshold
      const targetMs = tajweedAyah?.hasMadd
        ? TAJWEED_CATEGORIES.madd.targetHoldMs
        : TAJWEED_CATEGORIES.ghunnah.targetHoldMs;

      maddIntervalRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Calculate RMS
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / bufferLength) * 128;

        if (rms > NOISE_FLOOR) {
          maddHoldMsRef.current += SAMPLE_INTERVAL_MS;
          const pct = Math.min(1, maddHoldMsRef.current / targetMs);
          setMaddHoldMs(maddHoldMsRef.current);
          Animated.timing(maddProgress, {
            toValue: pct,
            duration: SAMPLE_INTERVAL_MS,
            useNativeDriver: false,
          }).start();

          if (maddHoldMsRef.current >= targetMs) {
            // Success!
            if (maddIntervalRef.current) clearInterval(maddIntervalRef.current);
            recorder.stop();
            addStars(3);
            onStarsAwarded?.(3);
            if (tajweedAyah?.hasGhunnah && !tajweedAyah?.hasMadd) {
              unlockBadge('tajweed_ghunnah_star');
            } else {
              unlockBadge('tajweed_madd_champion');
            }
            setPhase('madd_success');
          }
        } else {
          // Reset if voice dropped below noise floor
          maddHoldMsRef.current = 0;
          Animated.timing(maddProgress, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }).start();
          setMaddHoldMs(0);
        }
      }, SAMPLE_INTERVAL_MS);
    } catch {
      setErrorMsg(isAr ? 'تعذّر الوصول إلى الميكروفون' : 'Could not access microphone');
      setPhase('idle');
    }
  };

  const stopMaddMeter = () => {
    if (maddIntervalRef.current) clearInterval(maddIntervalRef.current);
    mediaRecorderRef.current?.stop?.();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    if (phase !== 'madd_success') setPhase('idle');
  };

  // ─── Playback ────────────────────────────────────────────────────────────

  const playOwnRecording = () => {
    if (!recordingBlobUrl) return;
    const audio = new Audio(recordingBlobUrl);
    playbackAudioRef.current = audio;
    audio.onended = () => setIsPlayingBack(false);
    audio.play();
    setIsPlayingBack(true);
  };

  const playShaykhAudio = () => {
    const url = tajweedService.getHusaryMuallimUrl(surahNumber, ayahNumber);
    const audio = new Audio(url);
    shaykhAudioRef.current = audio;
    audio.onended = () => setIsPlayingShaykhAudio(false);
    audio.onerror = () => setIsPlayingShaykhAudio(false);
    audio.play();
    setIsPlayingShaykhAudio(true);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  const hasMaddOrGhunnah = tajweedAyah?.hasMadd || tajweedAyah?.hasGhunnah;
  const meterLabel = tajweedAyah?.hasMadd
    ? (isAr ? 'مقياس المد الصوتي 🚀' : 'Madd Meter 🚀')
    : (isAr ? 'مقياس الغنة 🌿' : 'Ghunnah Meter 🌿');
  const meterTargetSec = tajweedAyah?.hasMadd
    ? TAJWEED_CATEGORIES.madd.targetHoldMs / 1000
    : TAJWEED_CATEGORIES.ghunnah.targetHoldMs / 1000;

  const meterBarWidth = maddProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title */}
          <View style={[styles.titleRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <Ionicons name="mic" size={22} color="#059669" />
            <Text style={styles.title}>
              {isAr ? 'تحدي التلاوة والتجويد 🎙️' : 'Recitation & Tajweed Challenge 🎙️'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Ayah preview */}
          <View style={styles.ayahBox}>
            <Text style={styles.ayahText} numberOfLines={3}>
              {ayahText}
            </Text>
          </View>

          {/* ── Section 1: Word Match ── */}
          <Text style={[styles.sectionLabel, { textAlign: isAr ? 'right' : 'left' }]}>
            {isAr ? '١. اقرأ الآية بصوتك 🎤' : '1. Recite the Verse 🎤'}
          </Text>

          {phase === 'idle' && (
            <TouchableOpacity style={styles.primaryBtn} onPress={startSpeechRecognition} activeOpacity={0.85}>
              <Ionicons name="mic-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>
                {isAr ? 'ابدأ التسجيل' : 'Start Recording'}
              </Text>
            </TouchableOpacity>
          )}

          {phase === 'speech_listening' && (
            <View style={styles.listeningBox}>
              <ActivityIndicator color="#059669" size="large" />
              <Text style={styles.listeningText}>
                {isAr ? 'جاري الاستماع... 🎤' : 'Listening... 🎤'}
              </Text>
              <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
                <Ionicons name="stop-circle" size={18} color="#EF4444" />
                <Text style={styles.stopBtnText}>{isAr ? 'إيقاف' : 'Stop'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {phase === 'speech_result' && (
            <View style={styles.resultBox}>
              <Text style={[styles.resultPercent, { color: matchPercent >= 75 ? '#059669' : '#D97706' }]}>
                {matchPercent}%
              </Text>
              <Text style={styles.resultLabel}>
                {matchPercent >= 90
                  ? (isAr ? 'ممتاز! تلاوة رائعة 🌟🌟🌟' : 'Excellent! Wonderful recitation 🌟🌟🌟')
                  : matchPercent >= 75
                  ? (isAr ? 'أحسنت! حاول مرة أخرى لتحسين 🌟🌟' : 'Well done! Try again to improve 🌟🌟')
                  : (isAr ? 'استمر في التدريب 💪' : 'Keep practicing 💪')}
              </Text>
              {speechResult ? (
                <Text style={styles.transcriptText} numberOfLines={2}>
                  «{speechResult}»
                </Text>
              ) : null}
              <TouchableOpacity style={styles.retryBtn} onPress={() => { setPhase('idle'); setSpeechResult(''); }} activeOpacity={0.8}>
                <Text style={styles.retryBtnText}>{isAr ? 'أعد المحاولة' : 'Try Again'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Section 2: Madd Meter ── */}
          {hasMaddOrGhunnah && (
            <>
              <View style={styles.divider} />
              <Text style={[styles.sectionLabel, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? `٢. ${meterLabel}` : `2. ${meterLabel}`}
              </Text>
              <Text style={[styles.meterHint, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr
                  ? `امدد صوتك لمدة ${meterTargetSec} ثانية حتى يمتلئ المقياس`
                  : `Hold your voice for ${meterTargetSec} seconds to fill the meter`}
              </Text>

              {/* Rocket/Progress Bar */}
              <View style={styles.meterTrack}>
                <Animated.View style={[styles.meterFill, { width: meterBarWidth }]} />
                <Text style={styles.rocketEmoji}>🚀</Text>
              </View>
              <Text style={styles.meterMs}>
                {(maddHoldMs / 1000).toFixed(1)}s / {meterTargetSec}s
              </Text>

              {phase !== 'madd_listening' && phase !== 'madd_success' && (
                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#7C3AED' }]} onPress={startMaddMeter} activeOpacity={0.85}>
                  <Ionicons name="mic" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>
                    {isAr ? 'ابدأ تحدي المد' : 'Start Madd Challenge'}
                  </Text>
                </TouchableOpacity>
              )}

              {phase === 'madd_listening' && (
                <TouchableOpacity style={[styles.stopBtn, { alignSelf: 'center' }]} onPress={stopMaddMeter}>
                  <Ionicons name="stop-circle" size={18} color="#EF4444" />
                  <Text style={styles.stopBtnText}>{isAr ? 'إيقاف' : 'Stop'}</Text>
                </TouchableOpacity>
              )}

              {phase === 'madd_success' && (
                <View style={styles.successBox}>
                  <Text style={styles.successEmoji}>🌟</Text>
                  <Text style={styles.successText}>
                    {isAr ? 'مدّ رائع ونَفَس بطل! 🌟 حصلت على 3 نجوم!' : 'Amazing Madd & Champion breath! 🌟 You earned 3 stars!'}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* ── Section 3: Self-Recording Playback ── */}
          {recordingBlobUrl && (
            <>
              <View style={styles.divider} />
              <Text style={[styles.sectionLabel, { textAlign: isAr ? 'right' : 'left' }]}>
                {isAr ? '٣. اسمع صوتك وقارنه بالشيخ' : '3. Compare Your Voice with the Sheikh'}
              </Text>
              <View style={styles.comparisonRow}>
                <TouchableOpacity
                  style={[styles.compBtn, isPlayingBack && styles.compBtnActive]}
                  onPress={playOwnRecording}
                  activeOpacity={0.85}
                >
                  <Ionicons name="person" size={16} color={isPlayingBack ? '#FFFFFF' : '#059669'} />
                  <Text style={[styles.compBtnText, isPlayingBack && { color: '#FFFFFF' }]}>
                    {isAr ? 'صوتي' : 'My Voice'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.compBtn, { borderColor: '#D97706' }, isPlayingShaykhAudio && { backgroundColor: '#D97706' }]}
                  onPress={playShaykhAudio}
                  activeOpacity={0.85}
                >
                  <Ionicons name="volume-high" size={16} color={isPlayingShaykhAudio ? '#FFFFFF' : '#D97706'} />
                  <Text style={[styles.compBtnText, { color: isPlayingShaykhAudio ? '#FFFFFF' : '#D97706' }]}>
                    {isAr ? 'الشيخ الحصري' : 'Sheikh Husary'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}
        </View>
      </View>
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
    paddingBottom: SPACING.xl + 8,
    maxHeight: '90%',
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
  titleRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  ayahText: {
    fontSize: 20,
    color: '#064E3B',
    textAlign: 'right',
    fontFamily: 'serif',
    lineHeight: 36,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginBottom: SPACING.sm,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  listeningBox: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  listeningText: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '700',
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
  },
  stopBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  resultBox: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  resultPercent: {
    fontSize: 42,
    fontWeight: '900',
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  transcriptText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  retryBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
  },
  retryBtnText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: SPACING.md,
  },
  meterHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  meterTrack: {
    height: 24,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meterFill: {
    height: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
  },
  rocketEmoji: {
    position: 'absolute',
    right: 8,
    fontSize: 16,
  },
  meterMs: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  successBox: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  successEmoji: { fontSize: 36 },
  successText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  compBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
  },
  compBtnActive: {
    backgroundColor: '#059669',
  },
  compBtnText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.sm,
  },
});

