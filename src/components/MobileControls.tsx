import React, { useEffect, useState } from 'react';
import './MobileControls.css';

interface MobileControlsProps {
  onLeft: (pressed: boolean) => void;
  onRight: (pressed: boolean) => void;
  onJump: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onLeft, onRight, onJump }) => {
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Show controls on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setShowControls(isTouchDevice);
  }, []);

  if (!showControls) {
    return null;
  }

  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    if (action === 'jump') {
      onJump();
    } else if (action === 'left') {
      onLeft(true);
    } else if (action === 'right') {
      onRight(true);
    }
  };

  const handleTouchEnd = (action: 'left' | 'right') => {
    if (action === 'left') {
      onLeft(false);
    } else if (action === 'right') {
      onRight(false);
    }
  };

  return (
    <div className="mobile-controls">
      <div className="left-controls">
        <button
          className="control-button left-button"
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
          onMouseDown={() => handleTouchStart('left')}
          onMouseUp={() => handleTouchEnd('left')}
          onMouseLeave={() => handleTouchEnd('left')}
        >
          ◀
        </button>
        <button
          className="control-button right-button"
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
          onMouseDown={() => handleTouchStart('right')}
          onMouseUp={() => handleTouchEnd('right')}
          onMouseLeave={() => handleTouchEnd('right')}
        >
          ▶
        </button>
      </div>
      <div className="right-controls">
        <button
          className="control-button jump-button"
          onTouchStart={() => handleTouchStart('jump')}
          onMouseDown={() => handleTouchStart('jump')}
        >
          JUMP
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
