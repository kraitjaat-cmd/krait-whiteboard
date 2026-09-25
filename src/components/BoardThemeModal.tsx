import React from 'react';
import { BOARD_THEMES } from '../themes/boardThemes';
import type { BoardThemeId, PaperStyleId } from '../types/canvas';
import { useThemeStore, themeStore } from '../store/themeStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PAPER_STYLES: { id: PaperStyleId; name: string; icon: string }[] = [
  { id: 'plain', name: 'Plain Blank', icon: '◻️' },
  { id: 'grid', name: 'Standard Grid', icon: '⊞' },
  { id: 'small-grid', name: 'Fine Grid', icon: '▦' },
  { id: 'dots', name: 'Bullet Dots', icon: '⠂⠂' },
  { id: 'ruled', name: 'Ruled Notebook', icon: '☰' },
  { id: 'engineering', name: 'Engineering / Graph', icon: '📐' },
];

export const BoardThemeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { themeId, paperStyle, isDark } = useThemeStore();

  if (!isOpen) return null;

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg rounded-3xl p-6 transition-all animate-in fade-in zoom-in-95 duration-200 ${panelClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 dark:border-slate-700/40 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-sm neu-ai-accent">
              🎨
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Board Theme & Paper Style</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Custom paper background with auto ink contrast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${btnClass}`}
          >
            ✕
          </button>
        </div>

        {/* 1. Board Theme Presets */}
        <div className="mb-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 block">
            1. Canvas Surface Presets
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {Object.values(BOARD_THEMES).map((theme) => {
              const isSelected = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => themeStore.setTheme(theme.id as BoardThemeId)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500 scale-105 shadow-md'
                      : btnClass
                  }`}
                  style={{ backgroundColor: theme.bg }}
                >
                  <div
                    className="w-full h-7 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{
                      color: theme.defaultInkColor,
                      boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    Abc
                  </div>
                  <span
                    className="text-[10px] font-semibold text-center truncate w-full"
                    style={{ color: theme.isDark ? '#F1F5F9' : '#1E293B' }}
                  >
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Paper Texture Grid */}
        <div className="mb-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 block">
            2. Paper Pattern & Ruling Overlay
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PAPER_STYLES.map((style) => {
              const isSelected = paperStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => themeStore.setPaperStyle(style.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isSelected ? activeClass : btnClass
                  }`}
                >
                  <span className="text-base">{style.icon}</span>
                  <span>{style.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-300/40 dark:border-slate-700/40">
          <button
            onClick={onClose}
            className="neu-accent px-5 py-2 rounded-2xl text-xs font-bold transition-all"
          >
            Apply Board Theme
          </button>
        </div>
      </div>
    </div>
  );
};
