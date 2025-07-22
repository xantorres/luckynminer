import { memo, useMemo } from 'react';
import type { FC } from 'react';
import type { GameStatus as GameStatusType } from '../../types/game';
import { GameStatus } from '../../types/game';
import styles from './GameControls.module.css';

interface GameControlsProps {
  gameStatus: GameStatusType;
  onStartGame: () => void;
  onResetGame: () => void;
  isLoading: boolean;
}

/**
 * Game controls component with restart button matching the mockup.
 * Memoized to prevent unnecessary re-renders.
 */
const GameControlsComponent: FC<GameControlsProps> = ({
  gameStatus,
  onStartGame,
  onResetGame,
  isLoading,
}) => {
  // Memoize button visibility to prevent recalculation
  const showStartButton = useMemo(() => 
    gameStatus === GameStatus.IDLE, 
    [gameStatus]
  );
  
  const showResetButton = useMemo(() => 
    gameStatus !== GameStatus.IDLE && gameStatus !== GameStatus.PLAYING,
    [gameStatus]
  );

  // Memoize button text to prevent recreation
  const startButtonText = useMemo(() => 
    isLoading ? 'Loading...' : 'START GAME',
    [isLoading]
  );

  return (
    <div className={styles.controls}>
      {showStartButton && (
        <button
          className={styles.startButton}
          onClick={onStartGame}
          disabled={isLoading}
        >
          {startButtonText}
        </button>
      )}
      
      {showResetButton && (
        <button
          className={styles.restartButton}
          onClick={onResetGame}
          disabled={isLoading}
        >
          RESTART
        </button>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const GameControls = memo(GameControlsComponent); 