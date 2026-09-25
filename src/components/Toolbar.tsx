import React from 'react';
import type { ToolType } from '../types/canvas';
import { useToolStore, toolStore } from '../store/toolStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  onOpenAIPrompt: () => void;
}

interface ToolItem {
  id: ToolType | 'ai';
  label: string;
  icon: string;
  shortcut?: string;
  isAi?: boolean;
}

const DRAWING_TOOLS: ToolItem[] = [
  { id: 'select', label: 'Select (V)', icon: '↖', shortcut: 'V' },
  { id: 'lasso', label: 'Lasso Select (L)', icon: '⚯', shortcut: 'L' },
  { id: 'pen', label: 'Fountain Pen (P)', icon: '✒️', shortcut: 'P' },
  { id: 'pencil', label: 'Graphite Pencil', icon: '✏️', shortcut: 'B' },
  { id: 'marker', label: 'Marker', icon: '🖊️', shortcut: 'M' },
  { id: 'highlighter', label: 'Highlighter (H)', icon: '🖍️', shortcut: 'H' },
  { id: 'brush', label: 'Art Brush', icon: '🖌️' },
  { id: 'eraser', label: 'Eraser (E)', icon: '🧹', shortcut: 'E' },
];

const OBJECT_TOOLS: ToolItem[] = [
  { id: 'text', label: 'Handwritten Text (T)', icon: '🔤', shortcut: 'T' },
  { id: 'shape', label: 'Geometry Shapes (S)', icon: '▢', shortcut: 'S' },
  { id: 'arrow', label: 'Vector Arrow (A)', icon: '➔', shortcut: 'A' },
  { id: 'equation', label: 'Math Equation', icon: '∑' },
  { id: 'table', label: 'Comparison Table', icon: '▦' },
  { id: 'graph', label: 'Scientific Graph', icon: '📈' },
];

export const Toolbar: React.FC<Props> = ({ onOpenAIPrompt }) => {
  const { activeTool } = useToolStore();
  const { isDark } = useThemeStore();

  const handleToolClick = (tool: ToolItem) => {
    if (tool.isAi) {
      onOpenAIPrompt();
      return;
    }
    toolStore.setActiveTool(tool.id as ToolType);
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';

  return (
    <aside
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className={`fixed-toolbar gap-1.5 p-2 rounded-3xl ${panelClass}`}
    >
      {/* 1. AI Quick Spawn Action */}
      <button
        onClick={onOpenAIPrompt}
        title="AI Scientific Illustrator & Smart Tutor"
        className="neu-ai-accent w-9 h-9 rounded-2xl flex items-center justify-center text-sm mb-1 active:scale-95"
      >
        ✨
      </button>

      <div className={`w-6 h-[1px] my-0.5 ${isDark ? 'bg-slate-700/60' : 'bg-slate-300/80'}`} />

      {/* 2. Freehand Drawing & Selection Tools */}
      <div className="flex flex-col gap-1.5">
        {DRAWING_TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              title={tool.label}
              className={`relative w-9 h-9 rounded-2xl flex items-center justify-center text-base ${
                isActive ? activeClass : btnClass
              }`}
            >
              <span>{tool.icon}</span>

              {/* Minimal Active Indicator Dot */}
              {isActive && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className={`w-6 h-[1px] my-0.5 ${isDark ? 'bg-slate-700/60' : 'bg-slate-300/80'}`} />

      {/* 3. Structured Vector Objects Tools */}
      <div className="flex flex-col gap-1.5">
        {OBJECT_TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              title={tool.label}
              className={`relative w-9 h-9 rounded-2xl flex items-center justify-center text-base ${
                isActive ? activeClass : btnClass
              }`}
            >
              <span className="font-semibold">{tool.icon}</span>

              {/* Minimal Active Indicator Dot */}
              {isActive && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
