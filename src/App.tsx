import { useMemo } from 'react';
import { useGame } from './hooks/useGame';
import { GameHeader } from './components/GameHeader/GameHeader';
import { GameBoard } from './components/GameBoard/GameBoard';
import { GameFooter } from './components/GameFooter/GameFooter';
import { GameControls } from './components/GameControls/GameControls';
import { CashOutModal } from './components/CashOutModal/CashOutModal';
import { GameStatus } from './types/game';
import styles from './App.module.css';

/**
 * Main application component for the luckynminer crash game.
 * Orchestrates all game components and manages the overall game flow.
 * Optimized with memoization to prevent unnecessary re-renders.
 */
function App() {
  const { 
    gameState, 
    initializeGame, 
    flipCell, 
    initiateCashOut, 
    resetGame,
    showCashOutModal,
    confirmCashOut,
    cancelCashOut,
    startNewRound,
  } = useGame();
  
  // Memoize derived state to prevent recalculation
  const isGameActive = useMemo(() => 
    gameState.gameStatus === GameStatus.PLAYING, 
    [gameState.gameStatus]
  );

  // Memoize component props to prevent unnecessary re-renders
  const gameHeaderProps = useMemo(() => ({
    currentCoins: gameState.currentCoins,
    gameStatus: gameState.gameStatus,
    onCashOut: initiateCashOut,
    isLoading: gameState.isLoading,
  }), [gameState.currentCoins, gameState.gameStatus, initiateCashOut, gameState.isLoading]);

  const gameBoardProps = useMemo(() => ({
    board: gameState.board,
    onCellClick: flipCell,
    isGameActive,
  }), [gameState.board, flipCell, isGameActive]);

  const gameFooterProps = useMemo(() => ({
    currentCoins: gameState.currentCoins,
    board: gameState.board,
    gameStatus: gameState.gameStatus,
    amountPerWin: gameState.amountPerWin,
  }), [gameState.currentCoins, gameState.board, gameState.gameStatus, gameState.amountPerWin]);

  const gameControlsProps = useMemo(() => ({
    gameStatus: gameState.gameStatus,
    onStartGame: initializeGame,
    onResetGame: resetGame,
    isLoading: gameState.isLoading,
  }), [gameState.gameStatus, initializeGame, resetGame, gameState.isLoading]);

  const cashOutModalProps = useMemo(() => ({
    isOpen: showCashOutModal,
    currentCoins: gameState.currentCoins,
    onConfirm: confirmCashOut,
    onCancel: cancelCashOut,
    onContinuePlaying: startNewRound,
  }), [showCashOutModal, gameState.currentCoins, confirmCashOut, cancelCashOut, startNewRound]);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.gameTitle}>
          <h1>LuckyNMiner</h1>
        </header>

        <GameHeader {...gameHeaderProps} />
        <GameBoard {...gameBoardProps} />
        <GameFooter {...gameFooterProps} />
        <GameControls {...gameControlsProps} />
        <CashOutModal {...cashOutModalProps} />
      </div>
    </div>
  );
}

export default App;
