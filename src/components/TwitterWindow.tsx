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
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  min-height: 200px;
  background: #fff;
  font-family: 'ms_sans_serif', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const TwitterLink = styled.a`
  display: inline-block;
  padding: 8px 24px;
  background: #000;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  font-family: 'ms_sans_serif', sans-serif;
  border: 2px outset #aaa;
  cursor: pointer;
  &:hover {
    background: #333;
  }
  &:active {
    border-style: inset;
  }
`;

const TwitterIcon = styled.div`
  font-size: 48px;
  line-height: 1;
  font-weight: bold;
`;

interface TwitterWindowProps {
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

const TwitterWindow: React.FC<TwitterWindowProps> = ({ onClose, zIndex, onFocus }) => {
  const { position, onMouseDown } = useDrag(
    Math.round(window.innerWidth / 2 - 200),
    Math.round(window.innerHeight / 2 - 160)
  );

  return (
    <Wrapper $x={position.x} $y={position.y} $z={zIndex} onMouseDown={onFocus}>
      <Window style={{ width: 410, maxWidth: 'calc(100vw - 20px)' }}>
        <StyledWindowHeader onMouseDown={onMouseDown}>
          <span>𝕏 - @yqboom</span>
          <CloseButton size="sm" square onClick={onClose}>
            <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>✕</span>
          </CloseButton>
        </StyledWindowHeader>
        <Content>
          <TwitterIcon>𝕏</TwitterIcon>
          <div>
            <strong>@yqboom</strong>
            <br />
            Follow me on X / Twitter
          </div>
          <TwitterLink href="https://x.com/yqboom" target="_blank" rel="noopener noreferrer">
            Open @yqboom on X
          </TwitterLink>
        </Content>
      </Window>
    </Wrapper>
  );
};

export default TwitterWindow;
