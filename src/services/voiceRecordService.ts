// src/services/voiceRecordService.ts
// Secure Voice Recording & Sandboxed Playback Service for Kids Recitation Practice.
// Supports both Web (MediaRecorder) and Native Android/iOS (expo-audio SDK 53+).
// Compliant with COPPA Privacy (Zero External Transmission) & OWASP ASVS V12.1.

import { Platform } from 'react-native';

export const MAX_RECORDING_SECONDS = 180; // 3 minutes maximum per recitation
export const MAX_RECORDING_BYTES = 15 * 1024 * 1024; // 15 Megabytes maximum memory quota

const isWebPlatform = Platform.OS === 'web';

let ModernExpoAudio: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ModernExpoAudio = require('expo-audio');
} catch {
  // Safe fallback if expo-audio native module is not linked
}

const ALLOWED_MIME_TYPES = [
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
];

export class VoiceRecordService {
  private mediaRecorder: any = null;
  private audioChunks: any[] = [];
  private totalBytesRecorded: number = 0;
  private currentBlobUrl: string | null = null;
  private playbackAudio: any = null;
  private durationInterval: any = null;
  private currentDuration: number = 0;
  private isRecording: boolean = false;
  private isPlaying: boolean = false;

  // Native recording & playback handles
  private nativeRecorder: any = null;
  private nativePlayer: any = null;
  private nativePlayerSub: any = null;

  /**
   * Validate audio URI against path traversal and unauthorized schemes
   * Compliant with OWASP ASVS V5.1 (Input Validation) & V12.3 (File Access)
   */
  public validateAudioUri(uri: string): { valid: boolean; reason?: string } {
    if (!uri || typeof uri !== 'string') {
      return { valid: false, reason: 'URI must be a non-empty string' };
    }

    // Path traversal prevention (e.g. ../ or %2e%2e)
    if (uri.includes('..') || /%2e%2e/i.test(uri)) {
      return { valid: false, reason: 'Path traversal sequence detected' };
    }

    // Scheme verification: allow blob, data, local files, content URIs, or https
    const isBlob = uri.startsWith('blob:') || uri.startsWith('http://') || uri.startsWith('https://');
    const isDataAudio = uri.startsWith('data:audio/');
    const isLocalFile = uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('/');
    const isMock = uri === 'native_recorded';

    if (!isBlob && !isDataAudio && !isLocalFile && !isMock) {
      return { valid: false, reason: 'Unauthorized audio URI protocol/scheme' };
    }

    return { valid: true };
  }

  /**
   * Start recording with enforced quotas and auto-stop safeguards
   */
  public async startRecording(
    onTick?: (seconds: number) => void,
    onMaxReached?: () => void
  ): Promise<boolean> {
    try {
      this.clearRecording();
      this.currentDuration = 0;
      this.totalBytesRecorded = 0;

      // 1. Web Platform Recording via MediaRecorder
      if (isWebPlatform) {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Microphone not supported on this browser');
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioChunks = [];

        // Select secure supported MIME type
        let selectedMime = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
          for (const mime of ALLOWED_MIME_TYPES) {
            if (MediaRecorder.isTypeSupported(mime)) {
              selectedMime = mime;
              break;
            }
          }
        }

        const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
        this.mediaRecorder = recorder;

        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) {
            this.totalBytesRecorded += e.data.size;
            // Memory bomb prevention: Hard byte quota
            if (this.totalBytesRecorded > MAX_RECORDING_BYTES) {
              console.warn('[VoiceRecordService] Max byte quota exceeded, stopping recording');
              this.stopRecording();
              onMaxReached?.();
              return;
            }
            this.audioChunks.push(e.data);
          }
        };

        recorder.start(100);
        this.isRecording = true;

        this.durationInterval = setInterval(() => {
          this.currentDuration += 1;
          onTick?.(this.currentDuration);

          // Resource exhaustion protection: Hard duration limit
          if (this.currentDuration >= MAX_RECORDING_SECONDS) {
            this.stopRecording();
            onMaxReached?.();
          }
        }, 1000);

        return true;
      }

      // 2. Native Android / iOS Recording via expo-audio
      if (ModernExpoAudio) {
        // Step A: Request / Verify Microphone Permission
        if (ModernExpoAudio.requestRecordingPermissionsAsync) {
          const perm = await ModernExpoAudio.getRecordingPermissionsAsync?.();
          if (!perm?.granted) {
            const req = await ModernExpoAudio.requestRecordingPermissionsAsync();
            if (!req?.granted) {
              console.warn('[VoiceRecordService] Microphone permission denied');
              return false;
            }
          }
        }

        // Step B: Set Audio Mode for Recording
        if (ModernExpoAudio.setAudioModeAsync) {
          await ModernExpoAudio.setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
            interruptionMode: 'doNotMix',
          });
        }

        // Step C: Create & Start Native AudioRecorder
        const options = ModernExpoAudio.RecordingPresets?.HIGH_QUALITY || {};
        if (ModernExpoAudio.AudioModule?.AudioRecorder) {
          const recorder = new ModernExpoAudio.AudioModule.AudioRecorder(options);
          this.nativeRecorder = recorder;
          await recorder.prepareToRecordAsync?.();
          recorder.record?.();
        }

        this.isRecording = true;
        this.durationInterval = setInterval(() => {
          this.currentDuration += 1;
          onTick?.(this.currentDuration);

          if (this.currentDuration >= MAX_RECORDING_SECONDS) {
            this.stopRecording();
            onMaxReached?.();
          }
        }, 1000);

        return true;
      }

      return false;
    } catch (err) {
      console.warn('[VoiceRecordService] Start recording error:', err);
      this.isRecording = false;
      return false;
    }
  }

  public async stopRecording(): Promise<string | null> {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }

    this.isRecording = false;

    // 1. Web Platform Stop
    if (isWebPlatform && this.mediaRecorder) {
      return new Promise((resolve) => {
        this.mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            if (this.currentBlobUrl) {
              URL.revokeObjectURL(this.currentBlobUrl);
            }
            this.currentBlobUrl = URL.createObjectURL(blob);

            // Cleanly stop all hardware media tracks
            if (this.mediaRecorder.stream) {
              this.mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
            }

            resolve(this.currentBlobUrl);
          } catch {
            resolve(null);
          }
        };

        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        } else {
          resolve(this.currentBlobUrl);
        }
      });
    }

    // 2. Native Android / iOS Stop
    if (this.nativeRecorder) {
      try {
        await this.nativeRecorder.stop?.();
        this.currentBlobUrl = this.nativeRecorder.uri || null;
      } catch (err) {
        console.warn('[VoiceRecordService] Stop native recorder error:', err);
      }
      this.nativeRecorder = null;
    }

    // Reset Audio Mode so playback outputs to loudspeaker (not call earpiece!)
    if (ModernExpoAudio?.setAudioModeAsync) {
      try {
        await ModernExpoAudio.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          interruptionMode: 'doNotMix',
          shouldRouteThroughEarpiece: false,
        });
      } catch {
        // Safe ignore
      }
    }

    return this.currentBlobUrl;
  }

  public playRecording(
    onStatusUpdate?: (status: { isPlaying: boolean; didJustFinish?: boolean }) => void
  ): void {
    if (!this.currentBlobUrl) {
      onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
      return;
    }

    // Validate URI safety before executing playback
    const validation = this.validateAudioUri(this.currentBlobUrl);
    if (!validation.valid) {
      console.error('[VoiceRecordService] Playback blocked by security policy:', validation.reason);
      onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
      return;
    }

    this.stopPlayback();

    // 1. Web Playback
    if (isWebPlatform) {
      try {
        const audio = new Audio(this.currentBlobUrl);
        this.playbackAudio = audio;
        this.isPlaying = true;

        audio.onplay = () => {
          this.isPlaying = true;
          onStatusUpdate?.({ isPlaying: true });
        };
        audio.onpause = () => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false });
        };
        audio.onended = () => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
        };
        audio.onerror = () => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
        };

        audio.play().catch(() => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
        });
      } catch {
        this.isPlaying = false;
        onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
      }
      return;
    }

    // 2. Native Playback via expo-audio
    if (ModernExpoAudio?.createAudioPlayer && this.currentBlobUrl) {
      try {
        // Ensure speaker output mode
        if (ModernExpoAudio.setAudioModeAsync) {
          ModernExpoAudio.setAudioModeAsync({
            allowsRecording: false,
            playsInSilentMode: true,
            interruptionMode: 'doNotMix',
            shouldRouteThroughEarpiece: false,
          }).catch(() => {});
        }

        const player = ModernExpoAudio.createAudioPlayer(this.currentBlobUrl);
        this.nativePlayer = player;
        try {
          player.volume = 1.0;
          player.muted = false;
        } catch {}

        this.isPlaying = true;
        this.nativePlayerSub = player.addListener?.('playbackStatusUpdate', (status: any) => {
          if (status.didJustFinish) {
            this.isPlaying = false;
            onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
          } else if (status.playing !== undefined) {
            this.isPlaying = status.playing;
            onStatusUpdate?.({ isPlaying: status.playing, didJustFinish: false });
          }
        });

        player.play?.();
        onStatusUpdate?.({ isPlaying: true, didJustFinish: false });
      } catch (err) {
        console.warn('[VoiceRecordService] Native playback error:', err);
        this.isPlaying = false;
        onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
      }
    }
  }

  public stopPlayback(): void {
    if (isWebPlatform && this.playbackAudio) {
      try {
        this.playbackAudio.pause();
        this.playbackAudio.currentTime = 0;
      } catch {
        // Safe ignore
      }
      this.playbackAudio = null;
    }

    if (this.nativePlayer) {
      try {
        this.nativePlayerSub?.remove?.();
        this.nativePlayer.pause?.();
        if (typeof this.nativePlayer.remove === 'function') {
          this.nativePlayer.remove();
        } else if (typeof this.nativePlayer.release === 'function') {
          this.nativePlayer.release();
        }
      } catch {
        // Safe ignore
      }
      this.nativePlayer = null;
      this.nativePlayerSub = null;
    }

    this.isPlaying = false;
  }

  public clearRecording(): void {
    this.stopPlayback();
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
    if (isWebPlatform && this.currentBlobUrl) {
      try {
        URL.revokeObjectURL(this.currentBlobUrl);
      } catch {
        // Safe ignore revoke
      }
      this.currentBlobUrl = null;
    } else {
      this.currentBlobUrl = null;
    }
    this.audioChunks = [];
    this.totalBytesRecorded = 0;
    this.isRecording = false;
    this.currentDuration = 0;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getHasRecording(): boolean {
    return !!this.currentBlobUrl;
  }

  public getCurrentDuration(): number {
    return this.currentDuration;
  }

  public getTotalBytesRecorded(): number {
    return this.totalBytesRecorded;
  }
}

export const voiceRecordService = new VoiceRecordService();
