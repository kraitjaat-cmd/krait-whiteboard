import React, { useState } from 'react';
import { useNotebookStore, notebookStore } from '../store/notebookStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotebookSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notebooks, activePageId, pages } = useNotebookStore();
  const { isDark } = useThemeStore();
  const [newNoteName, setNewNoteName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  if (!isOpen) return null;

  const handleAddPage = (notebookId: string) => {
    const title = prompt('Enter Page Title:', 'New Chapter Notes');
    if (title) {
      notebookStore.createPage(notebookId, title);
    }
  };

  const handleCreateNotebook = () => {
    if (newNoteName.trim()) {
      notebookStore.createNotebook(newNoteName.trim(), 'Biology', '#3b82f6');
      setNewNoteName('');
      setShowAddModal(false);
    }
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const activeClass = isDark ? 'neu-active-dark' : 'neu-active';

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-y-0 left-0 z-50 w-80 animate-in slide-in-from-left duration-200"
    >
      <div className={`h-full flex flex-col p-4 border-r border-slate-300/40 dark:border-slate-700/40 ${panelClass}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-300/40 dark:border-slate-700/40 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Study Notebooks</h2>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${btnClass}`}
          >
            ✕
          </button>
        </div>

        {/* Notebooks List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {notebooks.map((nb) => {
            return (
              <div
                key={nb.id}
                className={`rounded-2xl p-3 ${isDark ? 'neu-flat-dark' : 'neu-flat'}`}
              >
                {/* Notebook Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: nb.color }}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      {nb.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddPage(nb.id)}
                    title="Add Page to this Notebook"
                    className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold ${btnClass}`}
                  >
                    +
                  </button>
                </div>

                {/* Pages inside this notebook */}
                <div className="space-y-1.5">
                  {nb.pageIds.map((pid) => {
                    const page = pages[pid];
                    if (!page) return null;
                    const isCurrent = activePageId === pid;

                    return (
                      <button
                        key={pid}
                        onClick={() => {
                          notebookStore.switchPage(pid);
                          onClose();
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                          isCurrent
                            ? activeClass + ' font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <span className="truncate">{page.title}</span>
                        {isCurrent && <span className="text-[10px] text-blue-500 font-bold">●</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Notebook Section */}
        <div className="pt-3 border-t border-slate-300/40 dark:border-slate-700/40">
          {showAddModal ? (
            <div className="space-y-2">
              <input
                type="text"
                autoFocus
                value={newNoteName}
                onChange={(e) => setNewNoteName(e.target.value)}
                placeholder="Notebook Name..."
                className={`w-full px-3 py-1.5 rounded-xl text-xs outline-none ${insetClass} ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateNotebook}
                  className="neu-accent flex-1 py-1.5 rounded-xl text-xs font-bold"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${btnClass}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddModal(true)}
              className={`w-full py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 ${btnClass}`}
            >
              <span>+</span>
              <span>New Notebook</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
