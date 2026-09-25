import React, { useState } from 'react';
import { generateQuizFromCanvas } from '../ai/studyMode';
import { useCanvasStore, canvasStore } from '../store/canvasStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyModeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { objects } = useCanvasStore();
  const { isDark } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards'>('quiz');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const { questions, flashcards } = generateQuizFromCanvas(objects);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleAddFlashcardsToCanvas = () => {
    canvasStore.addObjects(flashcards);
    onClose();
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';
  const cardClass = isDark ? 'neu-flat-dark' : 'neu-flat';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] flex flex-col transition-all animate-in fade-in zoom-in-95 duration-200 ${panelClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 dark:border-slate-700/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl neu-accent flex items-center justify-center text-sm">
              🎯
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Study & Active Recall Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automated quizzes & flashcards synthesized from your whiteboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${btnClass}`}
          >
            ✕
          </button>
        </div>

        {/* Neumorphic Segmented Tab Controls */}
        <div className={`flex gap-2 p-1.5 rounded-2xl mb-4 ${insetClass}`}>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz' ? activeClass + ' font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            📝 Multiple Choice Quiz ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'flashcards' ? activeClass + ' font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            📇 Flashcard Cards ({flashcards.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {activeTab === 'quiz' ? (
            <div className="space-y-3.5">
              {questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl transition-all ${cardClass}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                        {q.subject}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                      {qIdx + 1}. {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        const isCorrect = q.correctIndex === optIdx;

                        let stateClass = btnClass;
                        if (showResults) {
                          if (isCorrect) stateClass = 'bg-green-500/15 border-green-500 text-green-700 dark:text-green-300 font-bold';
                          else if (isChosen) stateClass = 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-300';
                        } else if (isChosen) {
                          stateClass = activeClass + ' font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            disabled={showResults}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${stateClass}`}
                          >
                            <span>{opt}</span>
                            {showResults && isCorrect && <span className="text-green-600 font-bold">✓ Correct</span>}
                            {showResults && isChosen && !isCorrect && <span className="text-red-500">✗ Wrong</span>}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className={`mt-3 p-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 ${insetClass}`}>
                        <span className="font-bold text-blue-500">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                These flashcards were synthesized from your whiteboard notes and diagrams.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flashcards.map((fc, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl flex flex-col justify-between ${cardClass}`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-500 block mb-1">
                        {fc.subject}
                      </span>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Q: {fc.question}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-300/40 dark:border-slate-700/40">
                        <span className="font-bold text-green-500">A:</span> {fc.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-300/40 dark:border-slate-700/40 mt-3">
          {activeTab === 'quiz' ? (
            <>
              <div>
                {showResults && (
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Score: {calculateScore()} / {questions.length} ({Math.round((calculateScore() / questions.length) * 100)}%)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="neu-accent px-4 py-2 rounded-2xl text-xs font-bold transition-all"
                >
                  {showResults ? 'Reset Quiz' : 'Check Answers'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <button
                onClick={handleAddFlashcardsToCanvas}
                className="neu-accent px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span>➕</span>
                <span>Spawn Flashcards onto Whiteboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
