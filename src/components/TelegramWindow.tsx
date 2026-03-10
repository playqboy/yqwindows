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

const TelegramLink = styled.a`
  display: inline-block;
  padding: 8px 24px;
  background: #0088cc;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  font-family: 'ms_sans_serif', sans-serif;
  border: 2px outset #aaa;
  cursor: pointer;
  &:hover {
    background: #006daa;
  }
  &:active {
    border-style: inset;
  }
`;

const TelegramIcon = styled.div`
  font-size: 48px;
  line-height: 1;
`;

interface TelegramWindowProps {
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

const TelegramWindow: React.FC<TelegramWindowProps> = ({ onClose, zIndex, onFocus }) => {
  const { position, onMouseDown } = useDrag(
    Math.round(window.innerWidth / 2 - 200),
    Math.round(window.innerHeight / 2 - 160)
  );

  return (
    <Wrapper $x={position.x} $y={position.y} $z={zIndex} onMouseDown={onFocus}>
      <Window style={{ width: 410, maxWidth: 'calc(100vw - 20px)' }}>
        <StyledWindowHeader onMouseDown={onMouseDown}>
          <span>Telegram - @yoaquim</span>
          <CloseButton size="sm" square onClick={onClose}>
            <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>✕</span>
          </CloseButton>
        </StyledWindowHeader>
        <Content>
          <TelegramIcon>✈</TelegramIcon>
          <div>
            <strong>Telegram</strong>
            <br />
            Message me on Telegram
          </div>
          <TelegramLink href="https://t.me/yoaquim" target="_blank" rel="noopener noreferrer">
            Open @yoaquim on Telegram
          </TelegramLink>
        </Content>
      </Window>
    </Wrapper>
  );
};

export default TelegramWindow;
