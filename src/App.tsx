import React, { useState, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import TerminalWindow from './components/TerminalWindow';
import PortfolioSite from './components/PortfolioSite';
import GameWindow from './components/GameWindow';
import NotepadApp from './components/NotepadApp';
import FileExplorer from './components/FileExplorer';
import TwitterWindow from './components/TwitterWindow';
import TelegramWindow from './components/TelegramWindow';
import TaskbarComponent from './components/Taskbar';


interface NotepadInstance {
  id: string;
  fileName: string;
  zIndex: number;
}

function App() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [notepads, setNotepads] = useState<NotepadInstance[]>([]);
  const [zCounter, setZCounter] = useState(10);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({
    terminal: 9,
    portfolio: 8,
    game: 7,
    fileExplorer: 6,
    twitter: 5,
    telegram: 4,
  });
  const notepadIdCounter = useRef(0);

  const bringToFront = useCallback((id: string) => {
    setZCounter((prev) => {
      const next = prev + 1;
      setZIndexes((z) => ({ ...z, [id]: next }));
      // Also update notepad zIndex if it's a notepad
      setNotepads((pads) =>
        pads.map((p) => (p.id === id ? { ...p, zIndex: next } : p))
      );
      return next;
    });
  }, []);

  const handleOpenTerminal = () => {
    setShowTerminal(true);
    setTerminalMinimized(false);
    bringToFront('terminal');
  };

  const handleServerStarted = () => {
    setShowPortfolio(true);
    bringToFront('portfolio');
  };

  const handleOpenGame = () => {
    setShowGame(true);
    bringToFront('game');
  };

  const handleOpenTwitter = () => {
    setShowTwitter(true);
    bringToFront('twitter');
  };

  const handleOpenTelegram = () => {
    setShowTelegram(true);
    bringToFront('telegram');
  };

  const handleOpenNotepad = useCallback((fileName: string) => {
    const existing = notepads.find((p) => p.fileName === fileName);
    if (existing) {
      bringToFront(existing.id);
      return;
    }
    setZCounter((prev) => {
      const next = prev + 1;
      const id = `notepad-${notepadIdCounter.current++}`;
      setNotepads((pads) => [...pads, { id, fileName, zIndex: next }]);
      return next;
    });
  }, [notepads, bringToFront]);

  const handleCloseNotepad = useCallback((id: string) => {
    setNotepads((pads) => pads.filter((p) => p.id !== id));
  }, []);

  return (
    <Desktop
      onOpenTerminal={handleOpenTerminal}
      onOpenGame={handleOpenGame}
      onOpenNotepad={(fileName: string) => handleOpenNotepad(fileName)}
      onOpenFileExplorer={() => { setShowFileExplorer(true); bringToFront('fileExplorer'); }}
      onOpenTwitter={handleOpenTwitter}
      onOpenTelegram={handleOpenTelegram}
    >
      {showTerminal && !terminalMinimized && (
        <TerminalWindow
          onClose={() => setShowTerminal(false)}
          onMinimize={() => setTerminalMinimized(true)}
          onServerStarted={handleServerStarted}
          zIndex={zIndexes.terminal}
          onFocus={() => bringToFront('terminal')}
        />
      )}

      {showPortfolio && (
        <PortfolioSite onClose={() => setShowPortfolio(false)} />
      )}

      {showGame && (
        <GameWindow
          onClose={() => setShowGame(false)}
          zIndex={zIndexes.game}
          onFocus={() => bringToFront('game')}
        />
      )}

      {showFileExplorer && (
        <FileExplorer
          onClose={() => setShowFileExplorer(false)}
          zIndex={zIndexes.fileExplorer}
          onFocus={() => bringToFront('fileExplorer')}
          onOpenFile={(fileName: string) => handleOpenNotepad(fileName)}
        />
      )}

      {notepads.map((pad) => (
        <NotepadApp
          key={pad.id}
          fileName={pad.fileName}
          onClose={() => handleCloseNotepad(pad.id)}
          zIndex={pad.zIndex}
          onFocus={() => bringToFront(pad.id)}
        />
      ))}

      {showTwitter && (
        <TwitterWindow
          onClose={() => setShowTwitter(false)}
          zIndex={zIndexes.twitter}
          onFocus={() => bringToFront('twitter')}
        />
      )}

      {showTelegram && (
        <TelegramWindow
          onClose={() => setShowTelegram(false)}
          zIndex={zIndexes.telegram}
          onFocus={() => bringToFront('telegram')}
        />
      )}

      <TaskbarComponent
        onOpenTerminal={handleOpenTerminal}
        terminalOpen={showTerminal}
        terminalMinimized={terminalMinimized}
        onRestoreTerminal={() => {
          setTerminalMinimized(false);
          bringToFront('terminal');
        }}
        portfolioOpen={showPortfolio}
        onFocusPortfolio={() => bringToFront('portfolio')}
        gameOpen={showGame}
        onFocusGame={() => bringToFront('game')}
        twitterOpen={showTwitter}
        onFocusTwitter={() => bringToFront('twitter')}
        telegramOpen={showTelegram}
        onFocusTelegram={() => bringToFront('telegram')}
        notepads={notepads}
        onFocusNotepad={(id: string) => bringToFront(id)}
        onToggleHelp={() => handleOpenNotepad('help.txt')}
      />
    </Desktop>
  );
}

export default App;
