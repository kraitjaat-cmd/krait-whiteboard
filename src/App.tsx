import { useState } from 'react';
import { InfiniteCanvas } from './canvas/InfiniteCanvas';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { ToolSettingsBar } from './components/ToolSettingsBar';
import { BoardThemeModal } from './components/BoardThemeModal';
import { AIPromptModal } from './components/AIPromptModal';
import { NotebookSidebar } from './components/NotebookSidebar';
import { ResearchModal } from './components/ResearchModal';
import { HandwritingProfileModal } from './components/HandwritingProfileModal';
import { PDFNotesModal } from './components/PDFNotesModal';
import { SecretMusicPlayer } from './components/SecretMusicPlayer';
import { ApologyCustomizerModal } from './components/ApologyCustomizerModal';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [isPDFNotesOpen, setIsPDFNotesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isResearchModeOpen, setIsResearchModeOpen] = useState(false);
  const [isHandwritingModalOpen, setIsHandwritingModalOpen] = useState(false);
  const [isApologyCustomizerOpen, setIsApologyCustomizerOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="app-container font-sans">
        {/* 1. Master Infinite Canvas Layer */}
        <InfiniteCanvas onOpenAIForSelection={() => setIsAIPromptOpen(true)} />

        {/* 2. Top Header Navigation */}
        <Header
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onOpenHandwritingModal={() => setIsHandwritingModalOpen(true)}
          onOpenAIPrompt={() => setIsAIPromptOpen(true)}
          onOpenPDFNotes={() => setIsPDFNotesOpen(true)}
          onOpenResearchMode={() => setIsResearchModeOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* 3. Floating Pen Tools Vertical Toolbar */}
        <Toolbar onOpenAIPrompt={() => setIsAIPromptOpen(true)} />

        {/* 4. Active Tool Settings Horizontal Context Bar */}
        <ToolSettingsBar />

        {/* 5. Secret Romantic Music Player (Active when secret is triggered) */}
        <SecretMusicPlayer onOpenCustomizer={() => setIsApologyCustomizerOpen(true)} />

        {/* 6. Modals & Overlays */}
        <BoardThemeModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
        />

        <PDFNotesModal
          isOpen={isPDFNotesOpen}
          onClose={() => setIsPDFNotesOpen(false)}
        />

        <AIPromptModal
          isOpen={isAIPromptOpen}
          onClose={() => setIsAIPromptOpen(false)}
        />

        <ApologyCustomizerModal
          isOpen={isApologyCustomizerOpen}
          onClose={() => setIsApologyCustomizerOpen(false)}
        />

        <NotebookSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <ResearchModal
          isOpen={isResearchModeOpen}
          onClose={() => setIsResearchModeOpen(false)}
        />

        <HandwritingProfileModal
          isOpen={isHandwritingModalOpen}
          onClose={() => setIsHandwritingModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
