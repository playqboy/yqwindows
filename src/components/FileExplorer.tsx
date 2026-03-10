import React from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, Button } from 'react95';
import { useDrag } from '../hooks/useDrag';
import { TXT_FILES } from './NotepadApp';

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
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  min-height: 200px;
  background: #fff;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: 'ms_sans_serif', sans-serif;
  font-size: 13px;
  user-select: none;
  &:hover {
    background: #000080;
    color: #fff;
  }
`;

const FileIcon = styled.span`
  font-size: 14px;
`;

interface FileExplorerProps {
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  onOpenFile: (fileName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onClose, zIndex, onFocus, onOpenFile }) => {
  const { position, onMouseDown } = useDrag(
    Math.round(window.innerWidth / 2 - 160),
    Math.round(window.innerHeight / 2 - 140)
  );

  const files = Object.keys(TXT_FILES);

  return (
    <Wrapper $x={position.x} $y={position.y} $z={zIndex} onMouseDown={onFocus}>
      <Window style={{ width: 320, maxWidth: 'calc(100vw - 20px)' }}>
        <StyledWindowHeader onMouseDown={onMouseDown}>
          <span>Notepad - C:\files</span>
          <CloseButton size="sm" square onClick={onClose}>
            <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>✕</span>
          </CloseButton>
        </StyledWindowHeader>
        <Content>
          {files.map((name) => (
            <FileRow key={name} onDoubleClick={() => onOpenFile(name)}>
              <FileIcon>📄</FileIcon>
              {name}
            </FileRow>
          ))}
        </Content>
      </Window>
    </Wrapper>
  );
};

export default FileExplorer;
