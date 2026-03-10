import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useDrag(initialX: number, initialY: number) {
  const [position, setPosition] = useState<Position>({ x: initialX, y: initialY });
  const positionRef = useRef<Position>({ x: initialX, y: initialY });
  const dragging = useRef(false);
  const offset = useRef<Position>({ x: 0, y: 0 });

  positionRef.current = position;

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const newPos = {
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      };
      positionRef.current = newPos;
      setPosition(newPos);
    };

    const onMouseUp = () => {
      dragging.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return { position, onMouseDown };
}
