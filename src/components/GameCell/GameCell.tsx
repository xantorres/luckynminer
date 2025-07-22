import { memo, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import type { Cell, CellPosition } from '../../types/game';
import styles from './GameCell.module.css';

interface GameCellProps {
  cell: Cell;
  position: CellPosition;
  onCellClick: (position: CellPosition) => void;
  isGameActive: boolean;
}

/**
 * Individual game cell component with 3D flip animation.
 * Handles cell state, animations, and user interactions.
 * Memoized to prevent unnecessary re-renders.
 */
const GameCellComponent: FC<GameCellProps> = ({
  cell,
  position,
  onCellClick,
  isGameActive,
}) => {
  // Memoize click handler to prevent recreation
  const handleClick = useCallback(() => {
    if (!cell.isRevealed && isGameActive) {
      onCellClick(position);
    }
  }, [cell.isRevealed, isGameActive, onCellClick, position]);

  // Memoize expensive class name calculations
  const cellClasses = useMemo(() => {
    const classes = [styles.cell];
    
    if (cell.isRevealed) {
      classes.push(styles.cellRevealed);
      if (cell.isWinning) {
        classes.push(styles.cellWin);
      } else {
        classes.push(styles.cellMine);
      }
    }
    
    return classes.join(' ');
  }, [cell.isRevealed, cell.isWinning]);

  const cellInnerClasses = useMemo(() => {
    const classes = [styles.cellInner];
    if (cell.isRevealed) {
      classes.push(styles.flipped);
    }
    return classes.join(' ');
  }, [cell.isRevealed]);

  // Memoize content calculations
  const frontContent = useMemo(() => '', []);
  
  const backContent = useMemo(() => {
    if (!cell.isRevealed) return '';
    return cell.isWinning ? '🍀' : '💣';
  }, [cell.isRevealed, cell.isWinning]);

  // Memoize animation delay
  const animationDelay = useMemo(() => 
    `${(position.row * 3 + position.col) * 0.1}s`,
    [position.row, position.col]
  );

  return (
    <button
      className={cellClasses}
      onClick={handleClick}
      disabled={cell.isRevealed || !isGameActive}
      aria-label={`Cell at row ${position.row + 1}, column ${position.col + 1}`}
      style={{ animationDelay }}
    >
      <div className={cellInnerClasses}>
        <div className={styles.cellFront}>
          {frontContent}
        </div>
        <div className={styles.cellBack}>
          {backContent}
        </div>
      </div>
    </button>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const GameCell = memo(GameCellComponent); 