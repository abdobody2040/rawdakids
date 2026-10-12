// Voice Recording Service for Kids Recitation Practice (Web & Native compatible)
import { Platform } from 'react-native';

class VoiceRecordService {
  private mediaRecorder: any = null;
  private audioChunks: any[] = [];
  private currentBlobUrl: string | null = null;
  private playbackAudio: any = null;
  private durationInterval: any = null;
  private currentDuration: number = 0;
  private isRecording: boolean = false;
  private isPlaying: boolean = false;

  public async startRecording(onTick?: (seconds: number) => void): Promise<boolean> {
    try {
      this.clearRecording();
      this.currentDuration = 0;

      if (Platform.OS === 'web') {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Microphone not supported on this browser');
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioChunks = [];
        const recorder = new MediaRecorder(stream);
        this.mediaRecorder = recorder;

        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        recorder.start(100);
        this.isRecording = true;

        this.durationInterval = setInterval(() => {
          this.currentDuration += 1;
          onTick?.(this.currentDuration);
        }, 1000);

        return true;
      }

      // Native fallback mock/support
      this.isRecording = true;
      this.durationInterval = setInterval(() => {
        this.currentDuration += 1;
        onTick?.(this.currentDuration);
      }, 1000);
      return true;
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

    if (Platform.OS === 'web' && this.mediaRecorder) {
      return new Promise((resolve) => {
        this.mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            if (this.currentBlobUrl) {
              URL.revokeObjectURL(this.currentBlobUrl);
            }
            this.currentBlobUrl = URL.createObjectURL(blob);

            // Stop all tracks on the stream
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

    return this.currentBlobUrl || 'native_recorded';
  }

  public playRecording(onStatusUpdate?: (status: { isPlaying: boolean; didJustFinish?: boolean }) => void): void {
    if (!this.currentBlobUrl) {
      onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
      return;
    }

    this.stopPlayback();

    if (Platform.OS === 'web') {
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
    }
  }

  public stopPlayback(): void {
    if (Platform.OS === 'web' && this.playbackAudio) {
      try {
        this.playbackAudio.pause();
        this.playbackAudio.currentTime = 0;
      } catch (_err) {
        // Safe ignore during teardown
      }
      this.playbackAudio = null;
    }
    this.isPlaying = false;
  }

  public clearRecording(): void {
    this.stopPlayback();
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
    if (Platform.OS === 'web' && this.currentBlobUrl) {
      try {
        URL.revokeObjectURL(this.currentBlobUrl);
      } catch (_err) {
        // Safe ignore revoke
      }
      this.currentBlobUrl = null;
    }
    this.audioChunks = [];
    this.isRecording = false;
    this.currentDuration = 0;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getHasRecording(): boolean {
    return !!this.currentBlobUrl;
  }
}

export const voiceRecordService = new VoiceRecordService();
