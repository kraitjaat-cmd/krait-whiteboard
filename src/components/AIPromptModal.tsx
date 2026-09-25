import React, { useState } from 'react';
import type { AICommandType } from '../types/ai';
import { processAICommand } from '../ai/aiService';
import { useCanvasStore, canvasStore } from '../store/canvasStore';
import { useThemeStore } from '../store/themeStore';
import { useAIConfig, aiConfigStore, type AIProvider } from '../store/aiConfigStore';
import { secretApologyStore } from '../store/secretApologyStore';
import { backgroundAudio } from '../utils/audioManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPromptModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { objects, selectedIds } = useCanvasStore();
  const selectedObjects = objects.filter((o) => selectedIds.includes(o.id));

  const [activeTab, setActiveTab] = useState<'prompt' | 'settings'>('prompt');
  const [query, setQuery] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<AICommandType>(() => {
    if (selectedObjects.length > 0) {
      const hasMath = selectedObjects.some(
        (o) =>
          o.type === 'equation' ||
          o.type === 'stroke' ||
          (o.type === 'text' && (o.text.includes('=') || o.text.includes('+') || o.text.includes('-') || o.text.includes('*')))
      );
      if (hasMath) return 'solve';
      return 'explain';
    }
    return 'solve';
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const { isDark } = useThemeStore();
  const aiConfig = useAIConfig();

  // Local settings edit state
  const [provider, setProvider] = useState<AIProvider>(aiConfig.provider);
  const [anthropicKey, setAnthropicKey] = useState(aiConfig.anthropicApiKey);
  const [anthropicModel, setAnthropicModel] = useState(aiConfig.anthropicModel);
  const [openaiKey, setOpenaiKey] = useState(aiConfig.openaiApiKey);
  const [openaiModel, setOpenaiModel] = useState(aiConfig.openaiModel);
  const [ollamaEndpoint, setOllamaEndpoint] = useState(aiConfig.ollamaEndpoint);
  const [ollamaModel, setOllamaModel] = useState(aiConfig.ollamaModel);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    aiConfigStore.setConfig({
      provider,
      anthropicApiKey: anthropicKey,
      anthropicModel,
      openaiApiKey: openaiKey,
      openaiModel,
      ollamaEndpoint,
      ollamaModel,
    });
    setStatusMsg('Settings saved successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleExecute = async (customQuery?: string, customCommand?: AICommandType) => {
    const q = customQuery !== undefined ? customQuery : query;
    const cmd = customCommand || selectedCommand;
    if (!q.trim() && selectedObjects.length === 0) return;

    // Direct synchronous audio play within user gesture context
    if (secretApologyStore.matchesSecretCode(q)) {
      backgroundAudio.play('/desposition.mp3').catch(() => {});
      secretApologyStore.triggerSecret(true);
    }

    setLoading(true);
    canvasStore.setAiGenerating(true);

    try {
      const response = await processAICommand(
        {
          command: cmd,
          query: q,
          selectedObjects,
          canvasContext: {
            themeIsDark: isDark,
            centerPosition: { x: 220, y: 120 },
          },
        },
        objects,
        isDark
      );

      if (response.objects && response.objects.length > 0) {
        canvasStore.addObjects(response.objects);
        canvasStore.setSelectedIds(response.objects.map((o) => o.id));
        if (secretApologyStore.matchesSecretCode(q)) {
          canvasStore.setTransform({ x: 50, y: 50, scale: 0.8 });
        }
      }
    } catch (err) {
      console.error('AI Command execution error:', err);
    } finally {
      setLoading(false);
      canvasStore.setAiGenerating(false);
      onClose();
    }
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';

  const COMMAND_MODES: { id: AICommandType; label: string; icon: string }[] = [
    { id: 'solve', label: 'Solve & Steps', icon: '🧮' },
    { id: 'explain', label: 'Explain Concept', icon: '💡' },
    { id: 'draw_diagram', label: 'Draw Diagram', icon: '🎨' },
    { id: 'derive_equation', label: 'Derive Formula', icon: '📐' },
    { id: 'make_table', label: 'Comparison Table', icon: '▦' },
    { id: 'make_graph', label: 'Scientific Graph', icon: '📈' },
    { id: 'create_flashcards', label: 'Quiz Flashcards', icon: '📇' },
  ];

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
    >
      <div className={`w-full max-w-xl rounded-3xl p-6 transition-all animate-in fade-in zoom-in-95 duration-200 ${panelClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 dark:border-slate-700/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl neu-ai-accent flex items-center justify-center text-base">
              ✨
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">KRAIT AI Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate diagrams, equations, tables, and graphs natively on canvas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${btnClass}`}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation (Draw vs Settings) */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prompt' ? activeClass : btnClass
            }`}
          >
            🎨 Ask & Generate
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'settings' ? activeClass : btnClass
            }`}
          >
            <span>⚙️ Connect Claude / LLM</span>
            {aiConfig.provider !== 'built-in' && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </button>
        </div>

        {activeTab === 'prompt' ? (
          <>
            {/* Selected Context Indicator */}
            {selectedObjects.length > 0 && (
              <div className={`mb-3 px-3.5 py-2 rounded-2xl ${insetClass} text-xs flex items-center justify-between text-rose-500 dark:text-rose-400 font-medium`}>
                <span>🎯 Context: {selectedObjects.length} object(s) selected on canvas</span>
                <span className="font-bold uppercase tracking-wider">{selectedObjects[0].type}</span>
              </div>
            )}

            {/* Mode Selector Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {COMMAND_MODES.map((mode) => {
                const isSelected = selectedCommand === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedCommand(mode.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected ? 'neu-ai-accent text-white scale-105' : btnClass
                    }`}
                  >
                    <span>{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Natural Language Prompt Input */}
            <div className="relative mb-3">
              <textarea
                autoFocus
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
                    e.preventDefault();
                    handleExecute();
                  }
                }}
                placeholder={
                  selectedCommand === 'solve'
                    ? 'Enter equation to solve (e.g. X + 2 = 4, 3x - 5 = 10, x^2 - 5x + 6 = 0, d/dx(x^2), \\int x dx)...'
                    : selectedCommand === 'explain'
                    ? 'Ask to explain concept or selected part (e.g. Explain selected equation, action potential, SN1 vs SN2)...'
                    : selectedCommand === 'derive_equation'
                    ? 'Enter equation or concept to derive (e.g. Mean deviation, Standard deviation, Schrödinger, Bayes theorem)...'
                    : selectedCommand === 'make_table'
                    ? 'Enter concepts to compare (e.g. Mitosis vs Meiosis, Arteries vs Veins, SN1 vs SN2)...'
                    : selectedCommand === 'make_graph'
                    ? 'Enter function or relationship to plot (e.g. Velocity vs time, Exponential decay)...'
                    : 'Type anything you want to draw or study (e.g. Human heart, Solar system, DNA helix, Electric circuit)...'
                }
                className={`w-full p-3.5 rounded-2xl text-xs font-medium outline-none transition-all resize-none ${insetClass} ${
                  isDark ? 'text-slate-100 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedObjects.length > 0 ? (
                <>
                  <button
                    onClick={() => handleExecute('Explain the selected part and solve step-by-step', 'solve')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold text-rose-500 dark:text-rose-400 hover:scale-105 transition-all ${btnClass}`}
                  >
                    🧮 Solve Selected Equation
                  </button>
                  <button
                    onClick={() => handleExecute('Explain the selected concept and mechanism in detail', 'explain')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold text-amber-500 dark:text-amber-400 hover:scale-105 transition-all ${btnClass}`}
                  >
                    💡 Deep Concept Breakdown
                  </button>
                  <button
                    onClick={() => handleExecute('Compare features of selected items', 'make_table')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold text-sky-500 dark:text-sky-400 hover:scale-105 transition-all ${btnClass}`}
                  >
                    ▦ Summary Table
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setQuery('X + 2 = 4'); setSelectedCommand('solve'); }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-all ${btnClass}`}
                  >
                    X + 2 = 4
                  </button>
                  <button
                    onClick={() => { setQuery('x^2 - 5x + 6 = 0'); setSelectedCommand('solve'); }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-all ${btnClass}`}
                  >
                    x² - 5x + 6 = 0
                  </button>
                  <button
                    onClick={() => { setQuery('Human Heart Anatomy'); setSelectedCommand('draw_diagram'); }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-all ${btnClass}`}
                  >
                    Human Heart
                  </button>
                  <button
                    onClick={() => { setQuery('SN1 vs SN2 Mechanisms'); setSelectedCommand('make_table'); }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-all ${btnClass}`}
                  >
                    SN1 vs SN2 Table
                  </button>
                </>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">Enter</kbd> to generate
              </span>

              <button
                onClick={() => handleExecute()}
                disabled={loading || (!query.trim() && selectedObjects.length === 0)}
                className="neu-ai-accent px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <span>✨</span>
                <span>{loading ? 'Generating...' : 'Generate onto Canvas'}</span>
              </button>
            </div>
          </>
        ) : (
          /* Claude & LLM Connection Settings */
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            <div className={`p-3.5 rounded-2xl ${insetClass} text-xs text-slate-600 dark:text-slate-300 space-y-1`}>
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>🤖</span>
                <span>Connect with Claude AI or Local LLM</span>
              </div>
              <p>
                Connect your official Anthropic Claude API Key to let Claude generate custom SVG vector paths, complex physics models, and LaTeX derivations in real-time.
              </p>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                AI Provider
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'built-in', label: 'Built-in Engine', desc: 'Zero Config (Offline)' },
                  { id: 'anthropic', label: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet' },
                  { id: 'openai', label: 'OpenAI GPT', desc: 'GPT-4o' },
                  { id: 'ollama', label: 'Local Ollama', desc: 'Llama 3 / Mistral' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id as AIProvider)}
                    className={`p-2.5 rounded-2xl text-left text-xs transition-all ${
                      provider === p.id ? activeClass : btnClass
                    }`}
                  >
                    <div className="font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-400">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Anthropic Claude Settings */}
            {provider === 'anthropic' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Anthropic API Key
                  </label>
                  <input
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${insetClass} ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Stored locally in your browser storage only.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Claude Model
                  </label>
                  <select
                    value={anthropicModel}
                    onChange={(e) => setAnthropicModel(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer ${insetClass} ${
                      isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                    <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (Hybrid Reasoning)</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fast)</option>
                  </select>
                </div>
              </div>
            )}

            {/* OpenAI Settings */}
            {provider === 'openai' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${insetClass} ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Stored locally in your browser storage only.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    OpenAI Model
                  </label>
                  <select
                    value={openaiModel}
                    onChange={(e) => setOpenaiModel(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer ${insetClass} ${
                      isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <option value="gpt-4o">GPT-4o (Omni)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Ollama Settings */}
            {provider === 'ollama' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Ollama Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={ollamaEndpoint}
                    onChange={(e) => setOllamaEndpoint(e.target.value)}
                    placeholder="http://localhost:11434"
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${insetClass} ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    placeholder="llama3"
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${insetClass} ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-green-500 font-semibold">{statusMsg}</span>
              <button
                onClick={handleSaveSettings}
                className="neu-accent px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Save AI Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
