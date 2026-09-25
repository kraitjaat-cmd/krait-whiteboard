/**
 * Robust background audio controller for KRAIT Whiteboard.
 * Handles browser autoplay policies, preloading, and user gesture unlocking.
 * Supports GitHub Pages subpath deployment.
 */

export const getAudioUrl = (filename: string = 'desposition.mp3'): string => {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanFile = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${cleanBase}${cleanFile}`;
};

class BackgroundAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isUnlocked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      this.setupGlobalUnlock();
    }
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.src = getAudioUrl('desposition.mp3');
      this.audio.preload = 'auto';
      this.audio.loop = true;
      this.audio.volume = 0.85;

      // Also set fallback source listener
      this.audio.onerror = () => {
        if (this.audio && this.audio.src.includes('desposition.mp3')) {
          this.audio.src = getAudioUrl('music.mp3');
          this.audio.load();
        }
      };
    } catch (e) {
      console.warn('Audio initialization error:', e);
    }
  }

  private setupGlobalUnlock() {
    const unlock = () => {
      if (this.isUnlocked) return;
      this.isUnlocked = true;
      if (this.audio) {
        // Pre-warm audio element silently
        this.audio.load();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
  }

  public async play(url?: string): Promise<boolean> {
    this.initAudio();
    if (!this.audio) return false;

    const targetUrl = url ? getAudioUrl(url) : getAudioUrl('desposition.mp3');

    if (this.audio.src !== targetUrl && !this.audio.src.endsWith(targetUrl)) {
      this.audio.src = targetUrl;
    }

    try {
      this.audio.currentTime = this.audio.currentTime || 0;
      await this.audio.play();
      return true;
    } catch (err) {
      console.warn('Playback waiting for user gesture or loading:', err);
      // Try again on next interaction
      const retryPlay = () => {
        if (this.audio) {
          this.audio.play().catch(() => {});
        }
        window.removeEventListener('pointerdown', retryPlay);
        window.removeEventListener('click', retryPlay);
      };
      window.addEventListener('pointerdown', retryPlay, { once: true });
      window.addEventListener('click', retryPlay, { once: true });
      return false;
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public setVolume(vol: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, vol));
    }
  }

  public isPlaying(): boolean {
    return !!(this.audio && !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0);
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }
}

export const backgroundAudio = new BackgroundAudioManager();
