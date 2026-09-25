import React, { useEffect, useState } from 'react';
import { useSecretApology, secretApologyStore } from '../store/secretApologyStore';
import { useThemeStore } from '../store/themeStore';
import { backgroundAudio } from '../utils/audioManager';

interface Props {
  onOpenCustomizer?: () => void;
}

export const SecretMusicPlayer: React.FC<Props> = ({ onOpenCustomizer }) => {
  const config = useSecretApology();
  const { isDark } = useThemeStore();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    backgroundAudio.setVolume(config.volume ?? 0.85);

    if (config.isPlayingMusic) {
      backgroundAudio
        .play(config.musicUrl || '/desposition.mp3')
        .then((ok) => {
          setIsPlaying(ok);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      backgroundAudio.pause();
      setIsPlaying(false);
    }
  }, [config.isPlayingMusic, config.musicUrl, config.volume]);

  // Keep state in sync with audio events
  useEffect(() => {
    const audio = backgroundAudio.getAudioElement();
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('playing', handlePlay);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('playing', handlePlay);
    };
  }, []);

  if (!config.isSecretActive && !config.isPlayingMusic) {
    return null;
  }

  const handleToggle = () => {
    if (isPlaying) {
      backgroundAudio.pause();
      secretApologyStore.toggleMusic(false);
    } else {
      backgroundAudio.play(config.musicUrl || '/desposition.mp3');
      secretApologyStore.toggleMusic(true);
    }
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border transition-all ${
          isDark
            ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
            : 'bg-white/95 border-rose-300 text-rose-900'
        }`}
        style={{
          boxShadow: '0 12px 35px rgba(244, 63, 94, 0.3), 0 2px 10px rgba(0,0,0,0.15)',
        }}
      >
        {/* Animated Rose Icon */}
        <div
          onClick={handleToggle}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/15 text-rose-500 text-lg cursor-pointer hover:scale-105 transition-transform"
          title={isPlaying ? 'Pause song' : 'Play song'}
        >
          <span className={isPlaying ? 'animate-pulse' : ''}>🌸</span>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          )}
        </div>

        {/* Info label */}
        <div className="flex flex-col cursor-pointer" onClick={handleToggle}>
          <span className="text-xs font-bold leading-tight text-rose-500 flex items-center gap-1">
            <span>desposition</span>
            <span className="text-[10px] font-normal px-1 py-0.2 rounded bg-rose-500/10 text-rose-400">
              MP3
            </span>
          </span>
          <span className="text-[10px] opacity-75">
            {isPlaying ? 'Playing in background' : 'Click ▶ to play audio'}
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handleToggle}
          title={isPlaying ? 'Pause music' : 'Play music'}
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-1 pl-1">
          <span className="text-xs opacity-60">🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.volume ?? 0.85}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              secretApologyStore.setVolume(val);
              backgroundAudio.setVolume(val);
            }}
            className="w-16 h-1 bg-rose-200 dark:bg-rose-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
            title="Music Volume"
          />
        </div>

        {/* Customizer Settings Button */}
        {onOpenCustomizer && (
          <button
            onClick={onOpenCustomizer}
            title="Edit letter or settings"
            className="px-2.5 py-1 text-xs rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 font-semibold transition-all"
          >
            ✏️
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={() => {
            backgroundAudio.pause();
            secretApologyStore.stopSecret();
          }}
          title="Close player"
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-50 hover:opacity-100 transition-all hover:bg-rose-500/20 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
