import { memo, useCallback } from 'react';
import type { FC } from 'react';
import type { Cell, CellPosition } from '../../types/game';
import { GameCell } from '../GameCell/GameCell';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: Cell[][];
  onCellClick: (position: CellPosition) => void;
  isGameActive: boolean;
}

/**
 * Main game board component that renders the 3x3 grid of cells.
 * Manages cell interactions and layout.
 * Memoized to prevent unnecessary re-renders.
 */
const GameBoardComponent: FC<GameBoardProps> = ({
  board,
  onCellClick,
  isGameActive,
}) => {
  // Optimize cell click handler to prevent recreation
  const handleCellClick = useCallback((position: CellPosition) => {
    onCellClick(position);
  }, [onCellClick]);

  if (board.length === 0) {
    return (
      <div className={styles.emptyBoard}>
        <p>Click "Start Game" to begin</p>
      </div>
    );
  }

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position = { row: rowIndex, col: colIndex };
          return (
            <GameCell
              key={cell.id}
              cell={cell}
              position={position}
              onCellClick={handleCellClick}
              isGameActive={isGameActive}
            />
          );
        })
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const GameBoard = memo(GameBoardComponent); 