// Unified Audio Service for Noor Kids
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

class AudioService {
  private sound: Audio.Sound | null = null;
  private currentUri: string | null = null;
  private isPlaying: boolean = false;
  private currentSpeed: number = 1.0;
  private onPlaybackStatusUpdate: ((status: any) => void) | null = null;
  private webAudio: any = null;
  private duaAudio: any = null;

  constructor() {
    this.initAudioMode();
  }

  private async initAudioMode() {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      }
    } catch (e) {
      console.warn('Failed to set audio mode:', e);
    }
  }

  public async playAyah(
    uri: string,
    speed: number = 1.0,
    onStatusUpdate?: (status: any) => void
  ): Promise<void> {
    try {
      this.currentSpeed = speed;
      this.onPlaybackStatusUpdate = onStatusUpdate || null;

      // Stop any background Dua or Tafsir TTS
      await this.stopDua();

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && (window as any).Audio) {
          // If repeating the exact same audio URI, rewind and replay instantly without recreation
          if (this.webAudio && this.currentUri === uri) {
            this.webAudio.currentTime = 0;
            this.webAudio.playbackRate = speed;
            this.isPlaying = true;
            try {
              const replayPromise = this.webAudio.play();
              if (replayPromise !== undefined) {
                replayPromise.catch((err: any) => {
                  console.warn('Web audio replay error:', err);
                  this.isPlaying = false;
                  this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
                });
              }
            } catch (err) {
              console.warn('Web audio replay sync error:', err);
            }
            return;
          }

          // Different URI: pause previous
          if (this.webAudio) {
            this.webAudio.pause();
            this.webAudio.currentTime = 0;
          }

          this.currentUri = uri;
          if (!this.webAudio) {
            this.webAudio = new (window as any).Audio(uri);
          } else {
            this.webAudio.src = uri;
            this.webAudio.load();
          }

          this.webAudio.playbackRate = speed;
          this.webAudio.onplay = () => {
            this.isPlaying = true;
            this.onPlaybackStatusUpdate?.({ isPlaying: true, didJustFinish: false });
          };
          this.webAudio.onpause = () => {
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, didJustFinish: false });
          };
          this.webAudio.onended = () => {
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, didJustFinish: true });
          };
          this.webAudio.onerror = (e: any) => {
            console.warn('Web audio playback error:', e);
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
          };

          try {
            const playPromise = this.webAudio.play();
            if (playPromise !== undefined) {
              playPromise.catch((err: any) => {
                console.warn('Web audio play error:', err);
                this.isPlaying = false;
                this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
              });
            }
          } catch (err) {
            console.warn('Web audio play sync error:', err);
          }
        }
        return;
      }

      // Native Expo AV
      if (this.sound) {
        if (this.currentUri === uri) {
          await this.sound.setPositionAsync(0);
          await this.sound.setRateAsync(speed, true);
          await this.sound.playAsync();
          this.isPlaying = true;
          return;
        }
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }

      this.currentUri = uri;
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, rate: speed, shouldCorrectPitch: true },
        (status) => {
          if (status.isLoaded) {
            this.isPlaying = status.isPlaying;
            this.onPlaybackStatusUpdate?.(status);
          }
        }
      );

      this.sound = sound;
      this.isPlaying = true;
    } catch (err) {
      console.warn('Error playing audio from uri:', uri, err);
      this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
    }
  }

  public async pause(): Promise<void> {
    try {
      if (Platform.OS === 'web' && this.webAudio) {
        this.webAudio.pause();
        this.isPlaying = false;
        return;
      }
      if (this.sound) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (e) {
      console.warn('Error pausing audio:', e);
    }
  }

  public async resume(): Promise<void> {
    try {
      if (Platform.OS === 'web' && this.webAudio) {
        await this.webAudio.play();
        this.isPlaying = true;
        return;
      }
      if (this.sound) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (e) {
      console.warn('Error resuming audio:', e);
    }
  }

  public async setRate(speed: number): Promise<void> {
    this.currentSpeed = speed;
    try {
      if (Platform.OS === 'web' && this.webAudio) {
        this.webAudio.playbackRate = speed;
        return;
      }
      if (this.sound) {
        await this.sound.setRateAsync(speed, true);
      }
    } catch (e) {
      console.warn('Error setting rate:', e);
    }
  }

  public async playDua(
    arabicText: string,
    onStatusUpdate?: (status: {
      isPlaying: boolean;
      didJustFinish?: boolean;
      error?: boolean;
    }) => void
  ): Promise<void> {
    try {
      await this.stop();
      this.isPlaying = true;
      onStatusUpdate?.({ isPlaying: true, didJustFinish: false });

      // Determine TTS audio URLs
      const encodedText = encodeURIComponent(arabicText.trim());
      const proxyUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? `/api/tts?text=${encodedText}`
          : `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodedText}`;
      const googleFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodedText}`;

      // 1. Try Web Audio element with proxyUrl or googleFallbackUrl
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const tryPlayHtmlAudio = (srcUrl: string, onFail: () => void) => {
          const audio = new (window as any).Audio(srcUrl);
          this.duaAudio = audio;
          audio.playbackRate = 0.95;

          audio.onplay = () => {
            this.isPlaying = true;
            onStatusUpdate?.({ isPlaying: true, didJustFinish: false });
          };
          audio.onended = () => {
            this.isPlaying = false;
            this.duaAudio = null;
            onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
          };
          audio.onerror = () => {
            onFail();
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              onFail();
            });
          }
        };

        // Attempt 1: proxy URL (avoids CORS / Referer restrictions)
        tryPlayHtmlAudio(proxyUrl, () => {
          // Attempt 2: direct Google TTS
          tryPlayHtmlAudio(googleFallbackUrl, () => {
            // Attempt 3: SpeechSynthesis fallback
            this.playSpeechSynthesisFallback(arabicText, onStatusUpdate);
          });
        });
        return;
      }

      // 2. Native Expo AV Audio playback
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: googleFallbackUrl },
          { shouldPlay: true, rate: 0.95 },
          (status) => {
            if (status.isLoaded) {
              this.isPlaying = status.isPlaying;
              if (status.didJustFinish) {
                this.isPlaying = false;
                onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
              }
            }
          }
        );
        this.sound = sound;
        this.isPlaying = true;
      } catch {
        // Fallback to Native expo-speech
        Speech.speak(arabicText, {
          language: 'ar-SA',
          rate: 0.85,
          onDone: () => {
            this.isPlaying = false;
            onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
          },
          onError: () => {
            this.isPlaying = false;
            onStatusUpdate?.({ isPlaying: false, error: true });
          },
        });
      }
    } catch (err) {
      console.warn('Error playing dua:', err);
      this.isPlaying = false;
      onStatusUpdate?.({ isPlaying: false, error: true });
    }
  }

  private playSpeechSynthesisFallback(
    arabicText: string,
    onStatusUpdate?: (status: {
      isPlaying: boolean;
      didJustFinish?: boolean;
      error?: boolean;
    }) => void
  ) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(arabicText);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
        if (arVoice) {
          utterance.voice = arVoice;
        }

        utterance.onend = () => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
        };
        utterance.onerror = () => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false, error: true });
        };
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        this.isPlaying = false;
        onStatusUpdate?.({ isPlaying: false, error: true });
      }
    } else {
      this.isPlaying = false;
      onStatusUpdate?.({ isPlaying: false, error: true });
    }
  }

  public async stopDua(): Promise<void> {
    try {
      if (Platform.OS === 'web' && this.duaAudio) {
        this.duaAudio.pause();
        this.duaAudio.currentTime = 0;
        this.duaAudio = null;
      }
      if (
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
    } catch {
      // ignore
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.stopDua();
      if (Platform.OS === 'web' && this.webAudio) {
        this.webAudio.pause();
        this.webAudio.currentTime = 0;
        this.isPlaying = false;
      }
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        this.isPlaying = false;
      }
      this.isPlaying = false;
    } catch {
      // ignore cleanup errors
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioService = new AudioService();
