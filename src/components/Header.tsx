import React, { useState } from 'react';
import { useCanvasStore, canvasStore } from '../store/canvasStore';
import { useNotebookStore, notebookStore } from '../store/notebookStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  onOpenThemeModal: () => void;
  onOpenHandwritingModal: () => void;
  onOpenAIPrompt: () => void;
  onOpenPDFNotes: () => void;
  onOpenResearchMode: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<Props> = ({
  onOpenThemeModal,
  onOpenHandwritingModal,
  onOpenAIPrompt,
  onOpenPDFNotes,
  onOpenResearchMode,
  onToggleSidebar,
}) => {
  const { transform, objects } = useCanvasStore();
  const { notebooks, activeNotebookId, activePageId, pages } = useNotebookStore();
  const { isDark } = useThemeStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);
  const activePage = pages[activePageId];
  const zoomPercent = Math.round(transform.scale * 100);

  const handleZoomIn = () => {
    canvasStore.setTransform({
      ...transform,
      scale: Math.min(transform.scale * 1.15, 4.0),
    });
  };

  const handleZoomOut = () => {
    canvasStore.setTransform({
      ...transform,
      scale: Math.max(transform.scale / 1.15, 0.2),
    });
  };

  const handleCenterView = () => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const scale = 1.0;
    const targetX = Math.max(40, (screenW - 900) / 2);
    const targetY = Math.max(80, (screenH - 600) / 2);
    canvasStore.setTransform({
      x: targetX,
      y: targetY,
      scale,
    });
  };

  const handleExportPNG = () => {
    setShowExportMenu(false);
    const svgElement = document.querySelector('.canvas-container svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${activePage?.title || 'krait-whiteboard'}.png`;
        downloadLink.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleExportJSON = () => {
    setShowExportMenu(false);
    const pageData = {
      title: activePage?.title || 'Krait Notes',
      subject: activeNotebook?.subject || 'General',
      objects,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(pageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePage?.title || 'krait-notes'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const headerClass = isDark ? 'neu-flat-dark' : 'neu-flat';

  return (
    <header
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className={`fixed-header px-3.5 py-2 rounded-2xl ${headerClass}`}
    >
      {/* Left: KRAIT Brand + Notebook & Page title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all shadow-sm ${
            isDark
              ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
              : 'text-rose-600 bg-rose-50 border border-rose-200'
          }`}
        >
          <span className="text-sm">⚡</span>
          <span className="font-black tracking-widest text-[13px]">KRAIT</span>
        </div>

        <div className={`w-[1px] h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

        <button
          onClick={onToggleSidebar}
          className={`px-3 py-1.5 rounded-xl ${btnClass} flex items-center gap-2 text-xs font-semibold`}
          title="Open Notebooks"
        >
          <span className="text-sm">📚</span>
          <span className="hidden sm:inline">{activeNotebook?.name || 'My Notebook'}</span>
        </button>

        <span className="text-slate-400 text-xs font-light">/</span>

        {isEditingTitle ? (
          <input
            autoFocus
            defaultValue={activePage?.title || 'Untitled Note'}
            onBlur={(e) => {
              setIsEditingTitle(false);
              notebookStore.updatePageTitle(activePageId, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingTitle(false);
                notebookStore.updatePageTitle(activePageId, (e.target as HTMLInputElement).value);
              }
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold outline-none ${insetClass} ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          />
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className={`text-xs font-semibold cursor-pointer px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'
            }`}
            title="Click to rename page"
          >
            <span>{activePage?.title || 'Untitled Note'}</span>
            <span className="text-[10px] text-slate-400 opacity-60">✎</span>
          </div>
        )}
      </div>

      {/* Center: Undo/Redo & Zoom Controls */}
      <div className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl ${insetClass}`}>
        <button
          onClick={() => canvasStore.undo()}
          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${btnClass}`}
          title="Undo (Ctrl+Z)"
        >
          ↩
        </button>
        <button
          onClick={() => canvasStore.redo()}
          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${btnClass}`}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↪
        </button>

        <div className={`w-[1px] h-3.5 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

        <button
          onClick={handleZoomOut}
          className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${btnClass}`}
          title="Zoom Out"
        >
          -
        </button>
        <span
          onClick={handleCenterView}
          className="text-xs font-mono font-medium px-2 py-0.5 rounded cursor-pointer hover:underline text-slate-600 dark:text-slate-300"
          title="Click to Fit & Center View"
        >
          {zoomPercent}%
        </span>
        <button
          onClick={handleZoomIn}
          className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${btnClass}`}
          title="Zoom In"
        >
          +
        </button>

        <button
          onClick={handleCenterView}
          className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${btnClass}`}
          title="Fit & Center Canvas View"
        >
          Fit
        </button>
      </div>

      {/* Right: PDF Notes, AI Research, Ask AI, Theme, Handwriting Profile, Export */}
      <div className="flex items-center gap-2">
        {/* PDF to Visual Notes Button */}
        <button
          onClick={onOpenPDFNotes}
          className={`px-3 py-1.5 rounded-xl ${btnClass} text-xs font-semibold flex items-center gap-1.5 text-rose-500 hover:text-rose-600`}
          title="Upload PDF to Generate Visual Colorful Study Notes"
        >
          <span className="text-sm">📄</span>
          <span className="hidden sm:inline font-bold">PDF Notes</span>
        </button>

        {/* AI Research Button */}
        <button
          onClick={onOpenResearchMode}
          className={`px-3 py-1.5 rounded-xl ${btnClass} text-xs font-semibold flex items-center gap-1.5`}
          title="AI Literature Research & Formulation"
        >
          <span className="text-sm">🔍</span>
          <span className="hidden sm:inline">Research</span>
        </button>

        {/* AI Generator Button (Neumorphic Accent) */}
        <button
          onClick={onOpenAIPrompt}
          className="neu-ai-accent px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          title="AI Scientific Illustrator & Math Assistant"
        >
          <span>✨</span>
          <span>Ask AI</span>
        </button>

        {/* Board Theme Picker */}
        <button
          onClick={onOpenThemeModal}
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${btnClass}`}
          title="Board Theme & Paper Background"
        >
          🎨
        </button>

        {/* Handwriting Profile */}
        <button
          onClick={onOpenHandwritingModal}
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${btnClass}`}
          title="Handwriting Style Profile"
        >
          ✍️
        </button>

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${btnClass}`}
            title="Export Notes"
          >
            💾
          </button>
          {showExportMenu && (
            <div
              className={`absolute right-0 top-full mt-2 w-40 rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark ? 'neu-panel-dark' : 'neu-panel'
              }`}
            >
              <button
                onClick={handleExportPNG}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold mb-1 ${btnClass}`}
              >
                📸 Export as PNG
              </button>
              <button
                onClick={handleExportJSON}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${btnClass}`}
              >
                📄 Export JSON Data
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
