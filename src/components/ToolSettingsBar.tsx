import React from 'react';
import { STUDY_COLORS, HIGHLIGHTER_COLORS } from '../themes/colorPalettes';
import type { ShapeType } from '../types/canvas';
import { useToolStore, toolStore } from '../store/toolStore';
import { useThemeStore } from '../store/themeStore';

export const ToolSettingsBar: React.FC = () => {
  const toolState = useToolStore();
  const { isDark } = useThemeStore();

  const { activeTool, penColor, penSize, pressureSensitivity, shapeType, highlighterColor, highlighterSize } = toolState;

  // Don't show for select / lasso / pan
  if (activeTool === 'select' || activeTool === 'lasso' || activeTool === 'pan') {
    return null;
  }

  const isHighlighter = activeTool === 'highlighter';
  const isPenFamily = activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker' || activeTool === 'brush';

  const panelClass = isDark ? 'neu-flat-dark' : 'neu-flat';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className={`fixed-settings-bar gap-3 px-4 py-2 rounded-2xl ${panelClass}`}
    >
      {/* 1. Color Palette Swatches */}
      {(isPenFamily || activeTool === 'shape' || activeTool === 'text' || activeTool === 'arrow') && (
        <div className="flex items-center gap-2 pr-3 border-r border-slate-300/60 dark:border-slate-700/60">
          {STUDY_COLORS.slice(0, 6).map((c) => {
            const val = isDark && c.darkValue ? c.darkValue : c.value;
            const isSelected = penColor === val;
            return (
              <button
                key={c.name}
                onClick={() => toolStore.setPenColor(val)}
                title={c.name}
                className={`w-6 h-6 rounded-full transition-transform duration-150 ${
                  isSelected
                    ? 'ring-2 ring-rose-500 scale-110 shadow-inner'
                    : 'hover:scale-110 opacity-90 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: val,
                  boxShadow: isSelected
                    ? 'inset 2px 2px 4px rgba(0,0,0,0.3)'
                    : '2px 2px 5px rgba(0,0,0,0.15)',
                }}
              />
            );
          })}

          {/* Custom color input */}
          <div className="relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
            <input
              type="color"
              value={penColor.startsWith('#') ? penColor : '#2563eb'}
              onChange={(e) => toolStore.setPenColor(e.target.value)}
              title="Custom Ink Color"
              className="w-8 h-8 -top-1 -left-1 absolute cursor-pointer border-none bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Highlighter Color Swatches */}
      {isHighlighter && (
        <div className="flex items-center gap-2 pr-3 border-r border-slate-300/60 dark:border-slate-700/60">
          {HIGHLIGHTER_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => toolStore.setHighlighterColor(c.value)}
              title={c.name}
              className={`w-6 h-6 rounded-full transition-transform duration-150 ${
                highlighterColor === c.value
                  ? 'ring-2 ring-purple-500 scale-110'
                  : 'hover:scale-110 opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: c.value,
                boxShadow: highlighterColor === c.value
                  ? 'inset 2px 2px 4px rgba(0,0,0,0.2)'
                  : '2px 2px 5px rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      )}

      {/* 2. Stroke Thickness Pills */}
      {isPenFamily && (
        <div className="flex items-center gap-1.5 pr-3 border-r border-slate-300/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Width:</span>
          {[2, 3.5, 6, 10].map((sz) => (
            <button
              key={sz}
              onClick={() => toolStore.setPenSize(sz)}
              className={`px-2 py-1 rounded-xl text-xs font-semibold ${
                penSize === sz ? activeClass : btnClass
              }`}
            >
              {sz}px
            </button>
          ))}
        </div>
      )}

      {/* Highlighter Thickness */}
      {isHighlighter && (
        <div className="flex items-center gap-1.5 pr-3 border-r border-slate-300/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Width:</span>
          {[16, 24, 32].map((sz) => (
            <button
              key={sz}
              onClick={() => toolStore.setHighlighterSize(sz)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                highlighterSize === sz ? activeClass : btnClass
              }`}
            >
              {sz}px
            </button>
          ))}
        </div>
      )}

      {/* 3. Pen Pressure Sensitivity Toggle */}
      {isPenFamily && (
        <button
          onClick={() => toolStore.setPressureSensitivity(!pressureSensitivity)}
          title="Toggle Hardware Pressure Sensitivity (Pen Stylus)"
          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
            pressureSensitivity ? activeClass : btnClass
          }`}
        >
          <span>⚡</span>
          <span>Pressure {pressureSensitivity ? 'ON' : 'OFF'}</span>
        </button>
      )}

      {/* 4. Shape Subtypes Selector */}
      {activeTool === 'shape' && (
        <div className="flex items-center gap-1.5">
          {(['rectangle', 'ellipse', 'triangle', 'sticky', 'callout'] as ShapeType[]).map((st) => (
            <button
              key={st}
              onClick={() => toolStore.setShapeType(st)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold capitalize ${
                shapeType === st ? activeClass : btnClass
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* 5. Eraser Active Message */}
      {activeTool === 'eraser' && (
        <div className={`px-3 py-1 rounded-xl text-xs font-medium text-slate-500 ${insetClass}`}>
          🧹 Drag across any stroke or object to erase cleanly.
        </div>
      )}
    </div>
  );
};
