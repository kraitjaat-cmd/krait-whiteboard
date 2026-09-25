import React, { useState, useRef } from 'react';
import { extractTextFromPDFFile, generateVisualNotesFromPDF, type PDFExtractedData } from '../ai/pdfNoteService';
import { canvasStore, useCanvasStore } from '../store/canvasStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PDFNotesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<PDFExtractedData | null>(null);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'ready' | 'placing'>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [tone, setTone] = useState<'simple' | 'visual' | 'exam'>('simple');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isDark } = useThemeStore();
  const { transform } = useCanvasStore();

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile || !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document (.pdf)');
      return;
    }

    setFile(selectedFile);
    setStatus('extracting');
    setProgressMsg('Reading PDF pages and extracting text stream...');

    try {
      const { text, pageCount } = await extractTextFromPDFFile(selectedFile);
      setProgressMsg('Synthesizing core concepts, visual rules, and structured notes...');

      const { summaryData } = await generateVisualNotesFromPDF(
        text,
        selectedFile.name,
        0,
        0,
        isDark
      );

      summaryData.pageCount = pageCount;
      setExtractedData(summaryData);
      setStatus('ready');
      setProgressMsg('');
    } catch (err: any) {
      console.error('Failed to parse PDF:', err);
      setStatus('idle');
      alert(`Error reading PDF: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInsertNotes = async () => {
    if (!file || !extractedData) return;

    setStatus('placing');
    canvasStore.setAiGenerating(true);

    try {
      // Position notes near the center of the user's current viewport in world coordinates
      const worldCenterX = (-transform.x + window.innerWidth / 2) / transform.scale;
      const worldCenterY = (-transform.y + window.innerHeight / 2) / transform.scale;

      const startX = worldCenterX - 400;
      const startY = worldCenterY - 250;

      const { objects } = await generateVisualNotesFromPDF(
        extractedData.rawText,
        file.name,
        startX,
        startY,
        isDark
      );

      // Add all generated visual objects to the canvas
      objects.forEach((obj) => {
        canvasStore.addObject(obj);
      });

      // Select newly created objects
      canvasStore.setSelectedIds(objects.map((o) => o.id));

      onClose();
    } catch (err) {
      console.error('Error placing notes:', err);
    } finally {
      setStatus('ready');
      canvasStore.setAiGenerating(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setExtractedData(null);
    setStatus('idle');
    setProgressMsg('');
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl p-6 relative transition-all max-h-[90vh] flex flex-col ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-ai-accent flex items-center justify-center text-xl shadow-md">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  PDF to Visual Study Notes
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500">
                  KRAIT AI
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Upload any PDF to extract brief, colorful, handwritten-style notes in easy language
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${btnClass} text-slate-500`}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {status === 'idle' && !extractedData && (
            <>
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-3xl border-2 border-dashed border-rose-300 dark:border-rose-900/50 text-center cursor-pointer transition-all hover:scale-[1.01] ${insetClass}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="text-4xl mb-3 animate-bounce">📚</div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Click or Drag & Drop PDF Here
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Upload textbook chapters, lecture slides, research papers, or study guides
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <span>⚡ Instant Concept Extraction</span>
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                  Study Note Style & Simplicity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'simple', label: '💡 Easy (ELI5)', desc: 'Simplified rules & plain words' },
                    { id: 'visual', label: '🎨 Visual Summary', desc: 'Color cards & diagrams' },
                    { id: 'exam', label: '🎯 High-Yield Exam', desc: 'Formulas & critical tips' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id as any)}
                      className={`p-2.5 rounded-2xl text-left transition-all ${
                        tone === t.id ? 'neu-ai-accent text-white scale-[1.02]' : btnClass
                      }`}
                    >
                      <div className="text-xs font-bold">{t.label}</div>
                      <div className="text-[10px] opacity-80">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {status === 'extracting' && (
            <div className={`p-8 rounded-3xl text-center space-y-4 ${insetClass}`}>
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Analyzing & Synthesizing Document
                </h3>
                <p className="text-xs text-rose-500 font-medium animate-pulse">{progressMsg}</p>
              </div>
            </div>
          )}

          {status === 'ready' && extractedData && (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className={`p-3 rounded-2xl flex items-center justify-between ${insetClass}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📑</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {extractedData.fileName}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Detected Topic: <strong className="text-rose-500">{extractedData.topic}</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={resetUpload}
                  className="text-xs text-rose-500 hover:underline font-semibold px-2 py-1"
                >
                  Change PDF
                </button>
              </div>

              {/* Live Preview Cards */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ✨ Generated Visual Note Highlights
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {extractedData.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border-l-4 transition-all ${
                        isDark ? 'bg-slate-900/60' : 'bg-white/80'
                      }`}
                      style={{ borderLeftColor: concept.color }}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: concept.color }}>
                        <span>{concept.icon}</span>
                        <span>{concept.title}</span>
                      </div>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 font-sans">
                        {concept.points.slice(0, 2).map((p, pIdx) => (
                          <li key={pIdx} className="line-clamp-2">
                            • {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Summary Table Preview */}
                <div className={`p-3 rounded-2xl text-xs space-y-1.5 ${isDark ? 'bg-slate-900/40' : 'bg-white/60'}`}>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>📊</span>
                    <span>Key Definitions & Formulas</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedData.keyTerms.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      >
                        {t.term}: {t.definition.slice(0, 40)}...
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {status === 'ready' && extractedData && (
          <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Generates 4 Concept Cards, 1 Equation, 1 Terminology Table & 1 Visual Diagram
            </span>

            <button
              onClick={handleInsertNotes}
              className="neu-ai-accent px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white transition-all active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>🎨</span>
              <span>Place Visual Notes on Whiteboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
