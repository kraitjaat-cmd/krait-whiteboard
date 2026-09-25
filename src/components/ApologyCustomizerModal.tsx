import React, { useState } from 'react';
import { useSecretApology, secretApologyStore } from '../store/secretApologyStore';
import { useThemeStore } from '../store/themeStore';
import { generateSecretApologyCanvasObjects } from '../ai/apologyGenerator';
import { canvasStore } from '../store/canvasStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApologyCustomizerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const config = useSecretApology();
  const { isDark } = useThemeStore();

  const [secretCode, setSecretCode] = useState(config.secretCode);
  const [recipientName, setRecipientName] = useState(config.recipientName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [title, setTitle] = useState(config.title);
  const [letterContent, setLetterContent] = useState(config.letterContent);
  const [musicUrl, setMusicUrl] = useState(config.musicUrl);
  const [useBuiltinMelody, setUseBuiltinMelody] = useState(config.useBuiltinMelodyIfNoAudio);
  const [savedStatus, setSavedStatus] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    secretApologyStore.updateConfig({
      secretCode,
      recipientName,
      senderName,
      title,
      letterContent,
      musicUrl,
      useBuiltinMelodyIfNoAudio: useBuiltinMelody,
    });
    setSavedStatus('✨ Custom letter saved successfully!');
    setTimeout(() => setSavedStatus(''), 3000);
  };

  const handleTriggerNow = () => {
    handleSave();
    // Render apology objects onto the canvas
    const objects = generateSecretApologyCanvasObjects(140, 80, isDark);
    canvasStore.addObjects(objects);
    canvasStore.setSelectedIds(objects.map((o) => o.id));
    secretApologyStore.triggerSecret(true);
    onClose();
  };

  const panelClass = isDark ? 'neu-panel-dark' : 'neu-panel';
  const insetClass = isDark ? 'neu-inset-dark' : 'neu-inset';
  const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn';

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        className={`w-full max-w-2xl rounded-3xl p-6 transition-all animate-in fade-in zoom-in-95 duration-200 my-auto ${panelClass}`}
        style={{
          boxShadow: '0 20px 50px rgba(244, 63, 94, 0.2), 0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-lg text-white shadow-lg shadow-rose-500/30">
              💌
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-500 flex items-center gap-1.5">
                <span>Secret Apology Experience Settings</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize your secret letter, trigger code, and romantic background music
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

        {/* Form Body */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Secret Trigger Code & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                🔑 Secret Trigger Code / Keyword
              </label>
              <input
                type="text"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="e.g. sorry, forgive me, special-code"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-semibold ${insetClass} ${
                  isDark ? 'text-rose-300' : 'text-rose-700'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Typing this into AI prompt or whiteboard triggers the experience.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                🌸 Recipient Name / Nickname
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. My Special Someone"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none ${insetClass} ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Letter Title & Sender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                💖 Letter Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A Message From My Heart"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none ${insetClass} ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                ✍️ Sender Signature
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="With all my love"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none ${insetClass} ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Letter Content */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              📝 Handwritten Apology Paragraph
            </label>
            <textarea
              rows={6}
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              placeholder="Write your heartfelt message here..."
              className={`w-full p-3.5 rounded-2xl text-xs font-medium outline-none resize-none leading-relaxed ${insetClass} ${
                isDark ? 'text-rose-100' : 'text-slate-800'
              }`}
              style={{ fontFamily: 'Caveat, cursive', fontSize: '16px' }}
            />
          </div>

          {/* Music Settings */}
          <div className={`p-4 rounded-2xl ${insetClass} space-y-3`}>
            <div className="font-bold text-xs text-rose-500 flex items-center gap-1.5">
              <span>🎵</span>
              <span>Background Music Configuration</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">
                Audio File Path or URL
              </label>
              <input
                type="text"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                placeholder="/music.mp3 or https://..."
                className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${insetClass} ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Place your audio file as <code>public/music.mp3</code> or paste any direct URL.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="useBuiltin"
                checked={useBuiltinMelody}
                onChange={(e) => setUseBuiltinMelody(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
              <label htmlFor="useBuiltin" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                Play automatic romantic music-box melody if MP3 file is not found
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-rose-500/20">
          <span className="text-xs text-rose-500 font-semibold">{savedStatus}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${btnClass}`}
            >
              Save Configuration
            </button>

            <button
              onClick={handleTriggerNow}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>🌸</span>
              <span>Test & Trigger Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
