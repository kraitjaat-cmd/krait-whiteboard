import React, { useState } from 'react';
import { DEFAULT_HANDWRITING_PROFILES, type HandwritingProfile } from '../ai/handwritingProfile';
import { useToolStore, toolStore } from '../store/toolStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HandwritingProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { handwritingStyleProfile } = useToolStore();
  const { isDark } = useThemeStore();
  const [activeProfile, setActiveProfile] = useState<string>('profile-kalam');
  const [slant, setSlant] = useState(handwritingStyleProfile.slant);
  const [jitter, setJitter] = useState(handwritingStyleProfile.jitter);
  const [strokeThickness, setStrokeThickness] = useState(handwritingStyleProfile.strokeThickness);
  const [font, setFont] = useState(handwritingStyleProfile.font);

  if (!isOpen) return null;

  const handleSelectPreset = (p: HandwritingProfile) => {
    setActiveProfile(p.id);
    setSlant(p.slant);
    setJitter(p.jitter);
    setStrokeThickness(p.strokeThickness);
    setFont(p.font);
  };

  const handleApply = () => {
    toolStore.setHandwritingProfile({
      slant,
      jitter,
      strokeThickness,
      font,
    });
    toolStore.setSettings({
      textFontFamily: font,
    });
    onClose();
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`w-full max-w-xl rounded-3xl p-6 transition-all animate-in fade-in zoom-in-95 duration-200 ${panelClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 dark:border-slate-700/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl neu-accent flex items-center justify-center text-sm">
              ✍️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">My Handwriting Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tune the AI note generator to match your organic pen style</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${btnClass}`}
          >
            ✕
          </button>
        </div>

        {/* Presets */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
            Handwriting Styles
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {DEFAULT_HANDWRITING_PROFILES.map((p) => {
              const isSelected = activeProfile === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3 rounded-2xl text-left transition-all ${
                    isSelected ? activeClass : btnClass
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">{p.name}</div>
                  <div
                    style={{ fontFamily: p.font }}
                    className="text-base text-slate-700 dark:text-slate-300 truncate"
                  >
                    V = IR, F = ma, α β θ
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders for Slant, Jitter, Stroke Weight */}
        <div className={`space-y-3.5 mb-5 p-4 rounded-2xl ${insetClass}`}>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Slant Angle</span>
              <span>{slant}°</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={slant}
              onChange={(e) => setSlant(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Natural Jitter & Baseline Variation</span>
              <span>{Math.round(jitter * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.05"
              value={jitter}
              onChange={(e) => setJitter(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Stroke Thickness Multiplier</span>
              <span>{strokeThickness}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.8"
              step="0.1"
              value={strokeThickness}
              onChange={(e) => setStrokeThickness(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Handwriting Sample Preview */}
        <div className={`mb-5 p-4 rounded-2xl text-center ${insetClass}`}>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Live AI Handwriting Preview
          </div>
          <div
            style={{
              fontFamily: font,
              transform: `skewX(${slant}deg)`,
              fontSize: '20px',
              color: isDark ? '#E2E8F0' : '#1E293B',
              letterSpacing: '0.5px',
            }}
          >
            "The human heart pumps ~7,200 liters of blood per day."
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-300/40 dark:border-slate-700/40">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold ${btnClass}`}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="neu-accent px-5 py-2 rounded-2xl text-xs font-bold transition-all"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
