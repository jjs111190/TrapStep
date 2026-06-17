import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/config';
import MobileControls from './components/MobileControls';
import './App.css';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [controlHandlers, setControlHandlers] = useState<{
    onLeft: (pressed: boolean) => void;
    onRight: (pressed: boolean) => void;
    onJump: () => void;
  } | null>(null);

  useEffect(() => {
    // Initialize Phaser game
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);

      // Listen for game ready event
      gameRef.current.events.on('game-ready', (handlers: any) => {
        setControlHandlers(handlers);
      });
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="app">
      <div id="game-container"></div>
      {controlHandlers && (
        <MobileControls
          onLeft={controlHandlers.onLeft}
          onRight={controlHandlers.onRight}
          onJump={controlHandlers.onJump}
        />
      )}
    </div>
  );
}

export default App;
