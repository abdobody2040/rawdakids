// Unified Audio Service for Noor Kids
import { Platform } from 'react-native';

// Safe dynamic resolution of modern Expo Audio (SDK 53+)
let ModernExpoAudio: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ModernExpoAudio = require('expo-audio');
} catch {
  // Graceful fallback if expo-audio native module is unavailable
}

// Safe dynamic resolution of Expo Speech for TTS fallback
let ExpoSpeech: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ExpoSpeech = require('expo-speech');
} catch {
  // Graceful fallback if expo-speech native module is unavailable
}

class AudioService {
  private modernPlayer: any = null;
  private modernSubscription: any = null;
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
      if (Platform.OS !== 'web' && ModernExpoAudio?.setAudioModeAsync) {
        await ModernExpoAudio.setAudioModeAsync({
          playsInSilentMode: true,
        });
      }
    } catch {
      // Audio mode set safely
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

      // Stop any background Dua or Tafsir TTS synchronously
      this.stopDua();

      // 1. Web Platform Playback
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && (window as any).Audio) {
          if (this.webAudio) {
            try {
              this.webAudio.pause();
              this.webAudio.currentTime = 0;
            } catch (_err) {
              // Ignore pause error on uninitialized audio
            }
          }

          this.currentUri = uri;
          this.isPlaying = true;
          const audio = new (window as any).Audio(uri);
          this.webAudio = audio;
          audio.playbackRate = speed;

          audio.onplay = () => {
            this.isPlaying = true;
            this.onPlaybackStatusUpdate?.({ isPlaying: true, didJustFinish: false });
          };
          audio.onpause = () => {
            if (audio.ended) return;
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, didJustFinish: false });
          };
          audio.onended = () => {
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, didJustFinish: true });
          };
          audio.onerror = (e: any) => {
            console.warn('Web audio playback error:', e);
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
          };

          try {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch((err: any) => {
                console.warn('Web audio play rejected:', err);
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

      // 2. Native Modern Expo Audio (expo-audio SDK 53+)
      if (ModernExpoAudio?.createAudioPlayer) {
        try {
          if (this.modernPlayer) {
            try {
              this.modernSubscription?.remove?.();
              this.modernPlayer.pause?.();
              this.modernPlayer.release?.();
            } catch (_err) {
              // Ignore teardown error on release
            }
            this.modernPlayer = null;
          }

          this.currentUri = uri;
          // Must pass string uri directly - passing an object { uri } invokes Asset.fromURI which fails on remote streams
          const player = ModernExpoAudio.createAudioPlayer(uri);
          this.modernPlayer = player;
          if (typeof player.playbackRate === 'number') {
            player.playbackRate = speed;
          }

          this.modernSubscription = player.addListener?.('playbackStatusUpdate', (status: any) => {
            if (status.didJustFinish) {
              this.isPlaying = false;
              this.onPlaybackStatusUpdate?.({ isPlaying: false, didJustFinish: true });
            } else if (status.isBuffering || !status.isLoaded) {
              // During initial buffer/load, keep playing state active so UI doesn't prematurely revert to stopped
              this.isPlaying = true;
              this.onPlaybackStatusUpdate?.({ isPlaying: true, isBuffering: true, didJustFinish: false });
            } else if (status.playing !== undefined) {
              this.isPlaying = status.playing;
              this.onPlaybackStatusUpdate?.({ isPlaying: status.playing, didJustFinish: false });
            }
          });

          player.play();
          this.isPlaying = true;
          this.onPlaybackStatusUpdate?.({ isPlaying: true, didJustFinish: false });
          return;
        } catch (modernErr) {
          console.warn('[AudioService] expo-audio play error:', modernErr);
        }
      }

      // 3. Fallback: Native audio unavailable in current runtime
      this.isPlaying = false;
      this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true, unavailable: true });
    } catch (err) {
      console.warn('Error playing audio from uri:', uri, err);
      this.isPlaying = false;
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
      if (this.modernPlayer) {
        this.modernPlayer.pause?.();
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
      if (this.modernPlayer) {
        this.modernPlayer.play?.();
        this.isPlaying = true;
        return;
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
      if (this.modernPlayer) {
        this.modernPlayer.playbackRate = speed;
        return;
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
    }) => void,
    langCode: string = 'ar'
  ): Promise<void> {
    try {
      await this.stop();
      this.isPlaying = true;
      onStatusUpdate?.({ isPlaying: true, didJustFinish: false });

      // Determine TTS audio URLs
      const targetLang = langCode || 'ar';
      const encodedText = encodeURIComponent(arabicText.trim());
      const proxyUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? `/api/tts?text=${encodedText}&tl=${targetLang}`
          : `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedText}`;
      const googleFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedText}`;

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
            this.playSpeechSynthesisFallback(arabicText, onStatusUpdate, targetLang);
          });
        });
        return;
      }

      // 2. Native Modern Expo Audio playback
      if (ModernExpoAudio?.createAudioPlayer) {
        try {
          const player = ModernExpoAudio.createAudioPlayer(googleFallbackUrl);
          this.modernPlayer = player;
          this.modernSubscription = player.addListener?.('playbackStatusUpdate', (status: any) => {
            if (status.didJustFinish) {
              this.isPlaying = false;
              onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
            }
          });
          player.play();
          this.isPlaying = true;
          return;
        } catch {
          // Fall through to expo-speech
        }
      }

      // Fallback to Native expo-speech
      if (ExpoSpeech?.speak) {
        const nativeLang = targetLang === 'ar' ? 'ar-SA' : targetLang === 'fr' ? 'fr-FR' : targetLang === 'de' ? 'de-DE' : targetLang === 'es' ? 'es-ES' : 'en-US';
        ExpoSpeech.speak(arabicText, {
          language: nativeLang,
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
      } else {
        this.isPlaying = false;
        onStatusUpdate?.({ isPlaying: false, error: true });
      }
    } catch {
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
    }) => void,
    langCode: string = 'ar'
  ) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(arabicText);
        const synthLang = langCode === 'ar' ? 'ar-SA' : langCode === 'fr' ? 'fr-FR' : langCode === 'de' ? 'de-DE' : langCode === 'es' ? 'es-ES' : 'en-US';
        utterance.lang = synthLang;
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
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

  public stopDua(): void {
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
      } else if (ExpoSpeech?.stop) {
        ExpoSpeech.stop();
      }
    } catch {
      // ignore
    }
  }

  public async stop(): Promise<void> {
    try {
      this.stopDua();
      if (Platform.OS === 'web' && this.webAudio) {
        this.webAudio.pause();
        this.webAudio.currentTime = 0;
        this.isPlaying = false;
      }
      if (this.modernPlayer) {
        try {
          this.modernSubscription?.remove?.();
          this.modernPlayer.pause?.();
          this.modernPlayer.release?.();
        } catch (_err) {
          // Ignore teardown error on release
        }
        this.modernPlayer = null;
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
