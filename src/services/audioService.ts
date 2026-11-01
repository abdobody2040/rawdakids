// Unified Audio Service for Noor Kids
import { Platform, ToastAndroid } from 'react-native';

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
    this.ensurePlaybackAudioMode();
  }

  public async ensurePlaybackAudioMode() {
    try {
      if (Platform.OS !== 'web' && ModernExpoAudio?.setAudioModeAsync) {
        await ModernExpoAudio.setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix',
          allowsRecording: false,
          shouldRouteThroughEarpiece: false,
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

      // Ensure Android audio session is in loudspeaker playback mode (exclusive focus)
      await this.ensurePlaybackAudioMode();

      // 1. Web Platform Playback
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && (window as any).Audio) {
          if (this.webAudio) {
            try {
              this.webAudio.pause();
              this.webAudio.currentTime = 0;
            } catch {
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
            console.warn('[AudioService] Web audio playback error on:', uri, e);
            // Automatic retry via local server audio proxy if direct CDN request failed
            if (!uri.startsWith('/api/proxy-audio') && uri.startsWith('https://everyayah.com/')) {
              const proxyUri = `/api/proxy-audio?url=${encodeURIComponent(uri)}`;
              const proxyAudio = new (window as any).Audio(proxyUri);
              this.webAudio = proxyAudio;
              proxyAudio.playbackRate = speed;
              proxyAudio.onplay = audio.onplay;
              proxyAudio.onpause = audio.onpause;
              proxyAudio.onended = audio.onended;
              proxyAudio.onerror = () => {
                this.isPlaying = false;
                this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
              };
              proxyAudio.play().catch(() => {
                this.isPlaying = false;
                this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
              });
              return;
            }
            this.isPlaying = false;
            this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
          };

          try {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch((err: any) => {
                console.warn('[AudioService] Web audio play rejected:', err);
                if (!uri.startsWith('/api/proxy-audio') && uri.startsWith('https://everyayah.com/')) {
                  const proxyUri = `/api/proxy-audio?url=${encodeURIComponent(uri)}`;
                  const proxyAudio = new (window as any).Audio(proxyUri);
                  this.webAudio = proxyAudio;
                  proxyAudio.playbackRate = speed;
                  proxyAudio.onplay = audio.onplay;
                  proxyAudio.onpause = audio.onpause;
                  proxyAudio.onended = audio.onended;
                  proxyAudio.onerror = () => {
                    this.isPlaying = false;
                    this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
                  };
                  proxyAudio.play().catch(() => {
                    this.isPlaying = false;
                    this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
                  });
                  return;
                }
                this.isPlaying = false;
                this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
              });
            }
          } catch (err) {
            console.warn('[AudioService] Web audio play sync error:', err);
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
              if (typeof this.modernPlayer.remove === 'function') {
                this.modernPlayer.remove();
              } else if (typeof this.modernPlayer.release === 'function') {
                this.modernPlayer.release();
              }
            } catch {
              // Ignore teardown error on release
            }
            this.modernPlayer = null;
          }

          this.currentUri = uri;
          // Must pass string uri directly - passing an object { uri } invokes Asset.fromURI which fails on remote streams
          const player = ModernExpoAudio.createAudioPlayer(uri);
          this.modernPlayer = player;
          try {
            player.volume = 1.0;
            player.muted = false;
          } catch {
            // Volume safe set
          }

          if (typeof player.playbackRate === 'number') {
            player.playbackRate = speed;
          }

          this.modernSubscription = player.addListener?.('playbackStatusUpdate', (status: any) => {
            if (status.didJustFinish) {
              this.isPlaying = false;
              this.onPlaybackStatusUpdate?.({ isPlaying: false, didJustFinish: true });
            } else if (status.error) {
              this.isPlaying = false;
              this.onPlaybackStatusUpdate?.({ isPlaying: false, error: true });
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

  private showToast(message: string = 'الصوت غير متاح الآن') {
    try {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        let container = document.getElementById('audio-toast-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'audio-toast-container';
          container.style.cssText =
            'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99999;pointer-events:none;display:flex;flex-direction:column;align-items:center;';
          document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText =
          'background:rgba(30,41,59,0.92);color:#fff;padding:10px 20px;border-radius:9999px;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);margin-top:8px;opacity:0;transition:opacity 0.25s ease;direction:rtl;';
        container.appendChild(toast);
        requestAnimationFrame(() => {
          toast.style.opacity = '1';
        });
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            try {
              toast.remove();
            } catch {}
          }, 300);
        }, 2500);
      } else if (Platform.OS === 'android' && ToastAndroid) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    } catch {
      // safe fallback
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

      const targetLang = langCode || 'ar';
      const cleanText = (arabicText || '').trim();
      if (!cleanText) {
        this.isPlaying = false;
        onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
        return;
      }

      // 1. Web Platform: fetch /api/tts proxy, check Content-Type starts with "audio/"
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const encodedText = encodeURIComponent(cleanText);
        const proxyUrl = `/api/tts?text=${encodedText}&tl=${targetLang}`;

        const fallbackToSpeechSynthesis = () => {
          this.playSpeechSynthesisFallback(
            cleanText,
            (status) => {
              if (status.error) {
                this.showToast('الصوت غير متاح الآن');
              }
              onStatusUpdate?.(status);
            },
            targetLang
          );
        };

        try {
          const resp = await fetch(proxyUrl);
          const contentType = resp.headers.get('content-type') || '';
          if (resp.ok && contentType.startsWith('audio/')) {
            const blob = await resp.blob();
            const blobUrl = URL.createObjectURL(blob);

            if (this.duaAudio) {
              try {
                this.duaAudio.pause();
                this.duaAudio.currentTime = 0;
              } catch {
                // Ignore pause error on uninitialized audio
              }
            }

            const audio = new (window as any).Audio(blobUrl);
            this.duaAudio = audio;
            audio.playbackRate = 0.95;

            audio.onplay = () => {
              this.isPlaying = true;
              onStatusUpdate?.({ isPlaying: true, didJustFinish: false });
            };
            audio.onended = () => {
              this.isPlaying = false;
              this.duaAudio = null;
              URL.revokeObjectURL(blobUrl);
              onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
            };
            audio.onerror = (e: any) => {
              console.warn('[AudioService] Audio playback error on blob URL:', e);
              URL.revokeObjectURL(blobUrl);
              this.duaAudio = null;
              fallbackToSpeechSynthesis();
            };

            try {
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise.catch((err: any) => {
                  console.warn('[AudioService] audio.play() rejected:', err);
                  URL.revokeObjectURL(blobUrl);
                  this.duaAudio = null;
                  fallbackToSpeechSynthesis();
                });
              }
            } catch {
              URL.revokeObjectURL(blobUrl);
              this.duaAudio = null;
              fallbackToSpeechSynthesis();
            }
            return;
          } else {
            console.warn('[AudioService] /api/tts returned non-audio Content-Type:', contentType, resp.status);
            fallbackToSpeechSynthesis();
            return;
          }
        } catch (fetchErr) {
          console.warn('[AudioService] Failed to fetch /api/tts:', fetchErr);
          fallbackToSpeechSynthesis();
          return;
        }
      }

      // 2. Native Platform: Fallback directly to ExpoSpeech (avoid direct google TTS)
      if (ExpoSpeech?.speak) {
        const nativeLang =
          targetLang === 'ar' ? 'ar-SA' :
          targetLang === 'fr' ? 'fr-FR' :
          targetLang === 'de' ? 'de-DE' :
          targetLang === 'es' ? 'es-ES' :
          targetLang === 'id' ? 'id-ID' :
          targetLang === 'tr' ? 'tr-TR' :
          targetLang === 'ru' ? 'ru-RU' :
          targetLang === 'bn' ? 'bn-BD' :
          targetLang === 'ur' ? 'ur-PK' : 'en-US';

        ExpoSpeech.speak(cleanText, {
          language: nativeLang,
          rate: 0.85,
          onDone: () => {
            this.isPlaying = false;
            onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
          },
          onError: () => {
            this.isPlaying = false;
            this.showToast('الصوت غير متاح الآن');
            onStatusUpdate?.({ isPlaying: false, error: true });
          },
        });
      } else {
        this.isPlaying = false;
        this.showToast('الصوت غير متاح الآن');
        onStatusUpdate?.({ isPlaying: false, error: true });
      }
    } catch {
      this.isPlaying = false;
      this.showToast('الصوت غير متاح الآن');
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
        const synthLang =
          langCode === 'ar' ? 'ar-SA' :
          langCode === 'fr' ? 'fr-FR' :
          langCode === 'de' ? 'de-DE' :
          langCode === 'es' ? 'es-ES' :
          langCode === 'id' ? 'id-ID' :
          langCode === 'tr' ? 'tr-TR' :
          langCode === 'ru' ? 'ru-RU' :
          langCode === 'bn' ? 'bn-BD' :
          langCode === 'ur' ? 'ur-PK' : 'en-US';
        utterance.lang = synthLang;
        utterance.rate = 0.88;

        const voices = window.speechSynthesis.getVoices();
        let matchedVoice = null;
        if (langCode === 'ar') {
          matchedVoice =
            voices.find((v) => {
              const l = v.lang.toLowerCase().replace('_', '-');
              return l === 'ar-sa' || l === 'ar-eg';
            }) ||
            voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
        } else {
          matchedVoice = voices.find((v) =>
            v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase())
          );
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => {
          this.isPlaying = true;
          onStatusUpdate?.({ isPlaying: true, didJustFinish: false });
        };
        utterance.onend = () => {
          this.isPlaying = false;
          onStatusUpdate?.({ isPlaying: false, didJustFinish: true });
        };
        utterance.onerror = (e) => {
          console.warn('[AudioService] SpeechSynthesis error:', e);
          this.isPlaying = false;
          this.showToast('الصوت غير متاح الآن');
          onStatusUpdate?.({ isPlaying: false, error: true });
        };
        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('[AudioService] SpeechSynthesis exception:', err);
        this.isPlaying = false;
        this.showToast('الصوت غير متاح الآن');
        onStatusUpdate?.({ isPlaying: false, error: true });
      }
    } else {
      this.isPlaying = false;
      this.showToast('الصوت غير متاح الآن');
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
        } catch {
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

  public playPositiveChime(): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } catch {
        // audio synthesis fallback
      }
    }
  }

  public playCelebrationFanfare(): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.35);
        });
      } catch {
        // audio synthesis fallback
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioService = new AudioService();
