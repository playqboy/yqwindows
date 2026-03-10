import React, { useState, useRef, useEffect, useCallback } from 'react';
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

const HeaderButtons = styled.div`
  display: flex;
  gap: 2px;
`;

const TerminalBody = styled.div`
  background: #000;
  color: #0f0;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  height: 350px;
  overflow-y: auto;
  line-height: 1.6;
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
`;

const Prompt = styled.span`
  color: #0f0;
  margin-right: 8px;
  white-space: nowrap;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: #0f0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  outline: none;
  flex: 1;
  caret-color: #0f0;
`;

const OutputLine = styled.div<{ color?: string }>`
  color: ${(p) => p.color || '#0f0'};
  white-space: pre-wrap;
  word-break: break-word;
`;

interface TerminalWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onServerStarted: () => void;
  zIndex: number;
  onFocus: () => void;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    'Available commands:',
    '',
    '  help          — list all commands',
    '  whoami        — about me',
    '  ls contributions   — view my work',
    '  cat skills.txt — technical skills',
    '  npm start     — launch portfolio site',
    '  contact       — get in touch',
    '  clear         — clear terminal',
  ],
  whoami: [
    '┌──────────────────────────────────────────┐',
    '│  literally just a guy that does things   │',
    '└──────────────────────────────────────────┘',
  ],
  'ls contributions': [
    'drwxr-xr-x  quanto/          x.com/quanto',
    'drwxr-xr-x  wallets.spot/    wallets.spot',
    'drwxr-xr-x  boomish/         boomish.org',
  ],
  'cat skills.txt': [
    '═══════════════════════════════',
    '  LANGUAGES:  TypeScript, Python, Rust, Go',
    '  FRONTEND:   React, Next.js, Vue, Svelte',
    '  BACKEND:    Node, Django, FastAPI',
    '  TOOLS:      Docker, K8s, AWS, Figma',
    '═══════════════════════════════',
  ],
  contact: [
    '╔══════════════════════════════════════╗',
    '║  telegram:  @yoaquim                ║',
    '║  twitter:   @yqboom                 ║',
    '║  github:    github.com/playqboy     ║',
    '╚══════════════════════════════════════╝',
  ],
};

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  onClose,
  onMinimize,
  onServerStarted,
  zIndex,
  onFocus,
}) => {
  const { position, onMouseDown } = useDrag(80, 60);
  const [history, setHistory] = useState<{ text: string; color?: string }[]>([
    { text: 'YQ Windows [Version 95.0]' },
    { text: '(C) YQ Corp. All rights reserved.' },
    { text: '' },
    { text: 'Type "help" for available commands.' },
    { text: '' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLines = useCallback((lines: { text: string; color?: string }[]) => {
    setHistory((prev) => [...prev, ...lines]);
  }, []);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      addLines([{ text: `C:\\> ${cmd}` }]);

      if (trimmed === 'clear') {
        setHistory([]);
        return;
      }

      if (trimmed === 'npm start') {
        addLines([
          { text: '' },
          { text: '> portfolio@1.0.0 start' },
          { text: '> react-scripts start' },
          { text: '' },
          { text: 'Starting development server...', color: '#ff0' },
        ]);
        setIsLoading(true);

        setTimeout(() => {
          addLines([{ text: 'Compiling...', color: '#ff0' }]);
        }, 800);

        setTimeout(() => {
          addLines([
            { text: 'Compiled successfully!', color: '#0f0' },
            { text: '' },
            { text: 'You can now view portfolio in the browser.', color: '#0f0' },
            { text: '' },
            { text: '  Local:            http://localhost:3000', color: '#0ff' },
            { text: '  On Your Network:  http://192.168.1.5:3000', color: '#0ff' },
            { text: '' },
            { text: 'Opening browser...', color: '#ff0' },
          ]);
        }, 2000);

        setTimeout(() => {
          setIsLoading(false);
          onServerStarted();
        }, 3200);

        return;
      }

      const output = COMMANDS[trimmed];
      if (output) {
        addLines([{ text: '' }, ...output.map((t) => ({ text: t })), { text: '' }]);
      } else {
        addLines([
          { text: '' },
          {
            text: `'${trimmed}' is not recognized as an internal or external command.`,
            color: '#f44',
          },
          { text: 'Type "help" for available commands.', color: '#888' },
          { text: '' },
        ]);
      }
    },
    [addLines, onServerStarted]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <Wrapper $x={position.x} $y={position.y} $z={zIndex} onMouseDown={onFocus}>
      <Window style={{ width: 620, maxWidth: 'calc(100vw - 20px)' }}>
        <StyledWindowHeader onMouseDown={onMouseDown}>
          <span>C:\WINDOWS\system32\cmd.exe</span>
          <HeaderButtons>
            <Button size="sm" square onClick={onMinimize}>
              <span style={{ fontWeight: 'bold' }}>_</span>
            </Button>
            <Button size="sm" square onClick={onClose}>
              <span style={{ fontWeight: 'bold' }}>✕</span>
            </Button>
          </HeaderButtons>
        </StyledWindowHeader>
        <TerminalBody
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <OutputLine key={i} color={line.color}>
              {line.text}
            </OutputLine>
          ))}
          {!isLoading && (
            <InputLine>
              <Prompt>C:\&gt;</Prompt>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoFocus
              />
            </InputLine>
          )}
        </TerminalBody>
      </Window>
    </Wrapper>
  );
};

export default TerminalWindow;
