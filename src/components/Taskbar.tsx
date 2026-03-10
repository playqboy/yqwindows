import React, { useState } from 'react';
import styled from 'styled-components';
import { AppBar, Button, Toolbar } from 'react95';

const StyledAppBar = styled(AppBar)`
  top: auto !important;
  bottom: 0 !important;
  position: fixed !important;
`;

const StartButton = styled(Button)`
  font-weight: bold;
  margin-right: 8px;
`;

const Clock = styled.div`
  border: 1px inset;
  padding: 4px 12px;
  font-size: 12px;
  font-family: 'ms_sans_serif';
  min-width: 60px;
  text-align: center;
`;

const TaskButton = styled(Button)<{ $active?: boolean }>`
  margin-right: 4px;
  min-width: 140px;
  text-align: left;
  ${(p) =>
    p.$active &&
    `
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.4);
    background: #e0e0e0;
  `}
`;

const TaskIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: middle;
  image-rendering: pixelated;
`;

const TaskIconInline = styled.span`
  margin-right: 6px;
  font-size: 14px;
  vertical-align: middle;
`;

interface NotepadInstance {
  id: string;
  fileName: string;
  zIndex: number;
}

interface TaskbarProps {
  onOpenTerminal: () => void;
  terminalOpen: boolean;
  terminalMinimized: boolean;
  onRestoreTerminal: () => void;
  portfolioOpen: boolean;
  onFocusPortfolio: () => void;
  gameOpen: boolean;
  onFocusGame: () => void;
  twitterOpen: boolean;
  onFocusTwitter: () => void;
  telegramOpen: boolean;
  onFocusTelegram: () => void;
  notepads: NotepadInstance[];
  onFocusNotepad: (id: string) => void;
  onToggleHelp: () => void;
}

const TaskbarComponent: React.FC<TaskbarProps> = ({
  onOpenTerminal,
  terminalOpen,
  terminalMinimized,
  onRestoreTerminal,
  portfolioOpen,
  onFocusPortfolio,
  gameOpen,
  onFocusGame,
  twitterOpen,
  onFocusTwitter,
  telegramOpen,
  onFocusTelegram,
  notepads,
  onFocusNotepad,
  onToggleHelp,
}) => {
  const [time] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  return (
    <StyledAppBar>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StartButton onClick={onOpenTerminal}>
            ⊞ Start
          </StartButton>

          {terminalOpen && (
            <TaskButton
              $active={!terminalMinimized}
              onClick={terminalMinimized ? onRestoreTerminal : undefined}
            >
              📟 Command Prompt
            </TaskButton>
          )}

          {portfolioOpen && (
            <TaskButton $active onClick={onFocusPortfolio}>
              <TaskIcon src="/apple-touch-icon.png" alt="" />
              Portfolio Site
            </TaskButton>
          )}

          {gameOpen && (
            <TaskButton $active onClick={onFocusGame}>
              <TaskIconInline>&#9618;</TaskIconInline>
              Stack Game
            </TaskButton>
          )}

          {notepads.map((pad) => (
            <TaskButton key={pad.id} $active onClick={() => onFocusNotepad(pad.id)}>
              <TaskIconInline>📄</TaskIconInline>
              {pad.fileName}
            </TaskButton>
          ))}

          {twitterOpen && (
            <TaskButton $active onClick={onFocusTwitter}>
              <TaskIconInline>𝕏</TaskIconInline>
              Twitter
            </TaskButton>
          )}

          {telegramOpen && (
            <TaskButton $active onClick={onFocusTelegram}>
              <TaskIconInline>✈</TaskIconInline>
              Telegram
            </TaskButton>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button size="sm" onClick={onToggleHelp} style={{ marginRight: 4, fontWeight: 'bold', fontSize: 12 }}>
            ?
          </Button>
          <Clock>{time}</Clock>
        </div>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TaskbarComponent;
