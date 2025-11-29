import React, { useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';

interface GameCanvasProps {
  onInit: (container: HTMLDivElement) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onInit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (containerRef.current && !initialized.current) {
      initialized.current = true;
      onInit(containerRef.current);
    }
  }, [onInit]);

  return (
    <div 
      ref={containerRef} 
      className="w-full rounded-lg overflow-hidden bg-game-bg"
      style={{ minHeight: '500px' }}
    />
  );
};
