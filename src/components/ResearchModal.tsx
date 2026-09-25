import React, { useState } from 'react';
import { performResearch, type ResearchResult } from '../ai/researchMode';
import { useCanvasStore, canvasStore } from '../store/canvasStore';
import { useThemeStore } from '../store/themeStore';
import type { TextObjectData } from '../types/canvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const { objects } = useCanvasStore();
  const { isDark } = useThemeStore();

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await performResearch(topic.trim());
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertToCanvas = () => {
    if (!result) return;

    // Build clean, concise summary text with line breaks and proper width
    const lines: string[] = [
      `📌 ${result.topic}`,
      ``,
      `${result.summary}`,
    ];

    if (result.formula) {
      lines.push(``);
      lines.push(`📐 Formula: ${result.formula}`);
    }

    lines.push(``);
    lines.push(`Key Takeaways:`);
    result.keyFindings.forEach((k) => lines.push(`• ${k}`));

    if (result.clinicalSignificance) {
      lines.push(``);
      lines.push(`💡 Application: ${result.clinicalSignificance}`);
    }

    lines.push(``);
    lines.push(`Sources:`);
    result.sources.forEach((s) => lines.push(`[${s.year}] ${s.title} (${s.publication})`));

    const formattedText = lines.join('\n');

    const newObj: TextObjectData = {
      id: `text-research-${Date.now()}`,
      type: 'text',
      x: 180,
      y: 120,
      text: formattedText,
      fontFamily: 'Kalam',
      fontSize: 18,
      color: isDark ? '#F8FAFC' : '#1E293B',
      isHandwrittenStyle: true,
      alignment: 'left',
      zIndex: objects.length + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    canvasStore.addObject(newObj);
    canvasStore.setSelectedIds([newObj.id]);
    onClose();
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const cardClass = isDark ? 'neu-flat-dark' : 'neu-flat';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] flex flex-col transition-all animate-in fade-in zoom-in-95 duration-200 ${panelClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 dark:border-slate-700/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl neu-accent flex items-center justify-center text-sm">
              🔍
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">AI Research Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search scientific literature, summarize key findings and attach citations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${btnClass}`}
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            autoFocus
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Enter research topic (e.g. Cardiac electrophysiology, Nephron countercurrent)..."
            className={`flex-1 px-4 py-2.5 rounded-2xl text-xs font-medium outline-none ${insetClass} ${
              isDark ? 'text-slate-100 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
            }`}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="neu-accent px-5 py-2.5 rounded-2xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Research'}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${cardClass}`}>
                <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">{result.topic}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-4">{result.summary}</p>

                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">Key Scientific Findings:</div>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 dark:text-slate-300">
                    {result.keyFindings.map((kf, idx) => (
                      <li key={idx}>{kf}</li>
                    ))}
                  </ul>
                </div>

                {result.clinicalSignificance && (
                  <div className={`p-3 rounded-2xl text-xs text-amber-800 dark:text-amber-200 mb-4 ${insetClass}`}>
                    <span className="font-bold text-amber-600">Clinical Significance:</span> {result.clinicalSignificance}
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    References & Citations:
                  </div>
                  <div className="space-y-1.5">
                    {result.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className={`text-[11px] text-slate-600 dark:text-slate-400 p-2.5 rounded-xl ${insetClass}`}
                      >
                        📖 {src.title} — <span className="italic">{src.publication} ({src.year})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Search a concept to receive an evidence-based scientific summary with cited references.
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div className="flex justify-end pt-3 border-t border-slate-300/40 dark:border-slate-700/40 mt-3">
            <button
              onClick={handleInsertToCanvas}
              className="neu-accent px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>📝</span>
              <span>Insert Notes onto Whiteboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
