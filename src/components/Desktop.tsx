import React from 'react';
import styled from 'styled-components';

const DesktopWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url('/image.png') center/cover no-repeat;
`;

const DesktopIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 6px;
  width: 74px;
  user-select: none;
  border: 1px solid transparent;
  &:hover {
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.9);
  }
`;

const IconImage = styled.div`
  width: 48px;
  height: 48px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f0;
  font-size: 14px;
  font-family: 'ms_sans_serif', monospace;
  image-rendering: pixelated;
`;

const IconLabel = styled.span`
  color: white;
  font-size: 11px;
  text-align: center;
  text-shadow: 1px 1px #000;
  font-family: 'ms_sans_serif';
`;

const IconsArea = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  top: 0;
  left: 0;
`;

interface DesktopProps {
  children: React.ReactNode;
  onOpenTerminal: () => void;
  onOpenGame: () => void;
  onOpenNotepad: (fileName: string) => void;
  onOpenFileExplorer: () => void;
  onOpenTwitter: () => void;
  onOpenTelegram: () => void;
}

const Desktop: React.FC<DesktopProps> = ({ children, onOpenTerminal, onOpenGame, onOpenNotepad, onOpenFileExplorer, onOpenTwitter, onOpenTelegram }) => {
  return (
    <DesktopWrapper>
      <IconsArea>
        <DesktopIcon onDoubleClick={onOpenFileExplorer}>
          <IconImage style={{ background: '#fff', color: '#222', fontSize: 10 }}>📝</IconImage>
          <IconLabel>Notepad</IconLabel>
        </DesktopIcon>
        <DesktopIcon onDoubleClick={() => onOpenNotepad('help.txt')}>
          <IconImage style={{ background: '#fff', color: '#222', fontSize: 12 }}>TXT</IconImage>
          <IconLabel>help.txt</IconLabel>
        </DesktopIcon>
        <DesktopIcon onDoubleClick={onOpenTerminal}>
          <IconImage>C:\&gt;</IconImage>
          <IconLabel>Terminal</IconLabel>
        </DesktopIcon>
        <DesktopIcon onDoubleClick={() => onOpenNotepad('article.txt')}>
          <IconImage style={{ background: '#fff', color: '#222', fontSize: 12 }}>TXT</IconImage>
          <IconLabel>article.txt</IconLabel>
        </DesktopIcon>
        <DesktopIcon onDoubleClick={onOpenGame}>
          <IconImage style={{ background: '#D0CBC7', color: '#333344', fontSize: 24, fontWeight: 'bold' }}>&#9618;</IconImage>
          <IconLabel>Game</IconLabel>
        </DesktopIcon>
        <DesktopIcon onDoubleClick={onOpenTwitter}>
          <IconImage style={{ background: '#000', color: '#fff', fontSize: 22, fontWeight: 'bold' }}>𝕏</IconImage>
          <IconLabel>Twitter</IconLabel>
        </DesktopIcon>
        <DesktopIcon onDoubleClick={onOpenTelegram}>
          <IconImage style={{ background: '#0088cc', color: '#fff', fontSize: 22 }}>✈</IconImage>
          <IconLabel>Telegram</IconLabel>
        </DesktopIcon>
      </IconsArea>
      {children}
    </DesktopWrapper>
  );
};

export default Desktop;
