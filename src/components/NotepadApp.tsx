import React from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, Button } from 'react95';
import { useDrag } from '../hooks/useDrag';

const Wrapper = styled.div<{ $x: number; $y: number; $z: number }>`
  position: absolute;
  left: ${(p) => p.$x}px;
  top: ${(p) => p.$y}px;
  z-index: ${(p) => p.$z};
`;

const StyledWindowHeader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const CloseButton = styled(Button)`
  margin-right: -6px;
  margin-top: 1px;
`;

const Content = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  min-height: 260px;
  background: #fff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #222;
  white-space: pre-wrap;
  user-select: text;
`;

export interface TxtFile {
  name: string;
  content: string;
}

export const TXT_FILES: Record<string, TxtFile> = {
  'help.txt': {
    name: 'help.txt',
    content: `open terminal from taskbar or desktop icon.

commands:
  help             — list all commands
  whoami           — about me
  ls contributions — view my work
  cat skills.txt   — technical skills
  npm run start    — launch portfolio site
  contact          — get in touch
  clear            — clear terminal

or just double-click desktop icons.

- yq`,
  },
  'article.txt': {
    name: 'article.txt',
    content: `you can literally just do things

no mass. no friction. you don't need
permission or a mass following or an
mass audience. you just do the thing.

build. ship. write. draw. record. code.
make a site. make a game. make a tool
no one asked for but everyone needed.

the gap between "i want to" and "i did"
is mass smaller than you think.

so do the thing.

- yq`,
  },
};

interface NotepadAppProps {
  fileName: string;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

const NotepadApp: React.FC<NotepadAppProps> = ({ fileName, onClose, zIndex, onFocus }) => {
  const file = TXT_FILES[fileName];
  const { position, onMouseDown } = useDrag(
    Math.round(window.innerWidth / 2 - 230 + (Math.random() * 60 - 30)),
    Math.round(window.innerHeight / 2 - 180 + (Math.random() * 60 - 30))
  );

  return (
    <Wrapper $x={position.x} $y={position.y} $z={zIndex} onMouseDown={onFocus}>
      <Window style={{ width: 480, maxWidth: 'calc(100vw - 20px)' }}>
        <StyledWindowHeader onMouseDown={onMouseDown}>
          <span>{fileName} - Notepad</span>
          <CloseButton size="sm" square onClick={onClose}>
            <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>✕</span>
          </CloseButton>
        </StyledWindowHeader>
        <Content>{file ? file.content : `file not found: ${fileName}`}</Content>
      </Window>
    </Wrapper>
  );
};

export default NotepadApp;
