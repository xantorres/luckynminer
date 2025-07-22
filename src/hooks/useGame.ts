import { useState, useCallback, useMemo } from 'react';
import type { GameState, Cell, CellPosition, SessionStats } from '../types/game';
import { GameStatus } from '../types/game';
import { fetchBoard } from '../api/gameApi';
import { GAME_CONFIG } from '../utils/constants';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    currentCoins: 0,
    gameStatus: GameStatus.IDLE,
    amountPerWin: GAME_CONFIG.BASE_AMOUNT_PER_WIN,
    isLoading: false,
    sessionBalance: GAME_CONFIG.STARTING_BALANCE,
    currentBet: GAME_CONFIG.DEFAULT_BET,
    roundWinnings: 0,
  });

  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalCashedOut: 0,
    gamesPlayed: 0,
    totalWins: 0,
    biggestWin: 0,
    currentStreak: 0,
  });

  // Memoize game state derivations
  const { sessionBalance, currentBet, roundWinnings, gameStatus } = gameState;
  
  const canAffordBet = useMemo(() => sessionBalance >= currentBet, [sessionBalance, currentBet]);
  
  const canCashOut = useMemo(() => 
    gameStatus === GameStatus.PLAYING && roundWinnings > 0, 
    [gameStatus, roundWinnings]
  );

  /**
   * Updates the bet amount for the next round - optimized to avoid recreation
   */
  const setBetAmount = useCallback((amount: number) => {
    setGameState(prev => {
      const clampedAmount = Math.max(
        GAME_CONFIG.MIN_BET, 
        Math.min(GAME_CONFIG.MAX_BET, Math.min(amount, prev.sessionBalance))
      );
      
      return {
        ...prev,
        currentBet: clampedAmount,
      };
    });
  }, []); // No dependencies needed - we use prev state

  /**
   * Starts a new round by placing a bet and initializing the game
   */
  const initializeGame = useCallback(async () => {
    setGameState(prev => {
      // Check if player has enough balance to bet
      if (prev.sessionBalance < prev.currentBet) {
        // Reset to starting balance if broke
        return {
          ...prev,
          sessionBalance: GAME_CONFIG.STARTING_BALANCE,
          currentBet: GAME_CONFIG.DEFAULT_BET,
        };
      }

      return {
        ...prev,
        isLoading: true,
        gameStatus: GameStatus.IDLE,
        currentCoins: 0,
        roundWinnings: 0,
      };
    });

    try {
      const gameData = await fetchBoard();
      const newBoard = createGameBoard(gameData.board);

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameStatus: GameStatus.PLAYING,
        amountPerWin: gameData.amountPerWin,
        isLoading: false,
        sessionBalance: prev.sessionBalance - prev.currentBet,
        currentCoins: 0,
        roundWinnings: 0,
      }));
    } catch {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        gameStatus: GameStatus.IDLE,
      }));
    }
  }, []); // No dependencies - uses prev state

  /**
   * Handles cell flip with win/lose detection - optimized
   */
  const flipCell = useCallback((position: CellPosition) => {
    setGameState(prev => {
      if (prev.gameStatus !== GameStatus.PLAYING) return prev;

      const cell = prev.board[position.row][position.col];
      if (cell.isRevealed) return prev; // Already revealed

      const newBoard = prev.board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === position.row && colIndex === position.col) {
            return { ...cell, isRevealed: true };
          }
          return cell;
        })
      );
      
      if (cell.isWinning) {
        // Player found a winning cell
        const winAmount = prev.amountPerWin;
        const newRoundWinnings = prev.roundWinnings + winAmount;
        
        setSessionStats(prevStats => ({
          ...prevStats,
          totalWins: prevStats.totalWins + 1,
        }));

        return {
          ...prev,
          board: newBoard,
          currentCoins: prev.currentCoins + winAmount,
          roundWinnings: newRoundWinnings,
        };
      } else {
        // Player hit a mine - lose the bet, round over
        setSessionStats(prevStats => ({
          ...prevStats,
          gamesPlayed: prevStats.gamesPlayed + 1,
          currentStreak: 0,
        }));

        return {
          ...prev,
          board: revealAllCells(newBoard),
          gameStatus: GameStatus.LOST,
          currentCoins: 0,
          roundWinnings: 0,
        };
      }
    });
  }, []); // No dependencies - uses prev state

  /**
   * Initiates the cash out flow - optimized with memoized canCashOut
   */
  const initiateCashOut = useCallback(() => {
    if (!canCashOut) return;
    setShowCashOutModal(true);
  }, [canCashOut]);

  /**
   * Confirms cash out - add winnings to session balance
   */
  const confirmCashOut = useCallback(() => {
    setGameState(prev => {
      const totalWin = prev.currentBet + prev.roundWinnings;
      
      setSessionStats(prevStats => ({
        ...prevStats,
        totalCashedOut: prevStats.totalCashedOut + totalWin,
        gamesPlayed: prevStats.gamesPlayed + 1,
        biggestWin: Math.max(prevStats.biggestWin, totalWin),
        currentStreak: prevStats.currentStreak + 1,
      }));

      return {
        ...prev,
        board: revealAllCells(prev.board),
        gameStatus: GameStatus.CASHED_OUT,
        sessionBalance: prev.sessionBalance + totalWin,
      };
    });

    setShowCashOutModal(false);
  }, []); // No dependencies - uses prev state

  /**
   * Cancels cash out and continues playing
   */
  const cancelCashOut = useCallback(() => {
    setShowCashOutModal(false);
  }, []);

  /**
   * Starts a new round immediately after cashing out
   */
  const startNewRound = useCallback(() => {
    setShowCashOutModal(false);
    // Small delay for better UX
    setTimeout(initializeGame, 200);
  }, [initializeGame]);

  /**
   * Resets the entire session
   */
  const resetGame = useCallback(() => {
    setGameState({
      board: [],
      currentCoins: 0,
      gameStatus: GameStatus.IDLE,
      amountPerWin: GAME_CONFIG.BASE_AMOUNT_PER_WIN,
      isLoading: false,
      sessionBalance: GAME_CONFIG.STARTING_BALANCE,
      currentBet: GAME_CONFIG.DEFAULT_BET,
      roundWinnings: 0,
    });
    
    setSessionStats({
      totalCashedOut: 0,
      gamesPlayed: 0,
      totalWins: 0,
      biggestWin: 0,
      currentStreak: 0,
    });
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({ 
    gameState, 
    initializeGame, 
    flipCell, 
    initiateCashOut,
    resetGame,
    setBetAmount,
    // Cash out modal controls
    showCashOutModal,
    confirmCashOut,
    cancelCashOut,
    startNewRound,
    // Session stats
    sessionStats,
    // Derived state
    canAffordBet,
    canCashOut,
  }), [
    gameState,
    initializeGame,
    flipCell,
    initiateCashOut,
    resetGame,
    setBetAmount,
    showCashOutModal,
    confirmCashOut,
    cancelCashOut,
    startNewRound,
    sessionStats,
    canAffordBet,
    canCashOut,
  ]);
}

/**
 * Creates a game board with Cell objects from API response.
 * Memoized function to avoid recreation.
 */
const createGameBoard = (apiBoard: { isWinning: boolean }[][]): Cell[][] => {
  return apiBoard.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      isWinning: cell.isWinning,
      isRevealed: false,
      id: `cell-${rowIndex}-${colIndex}`,
    }))
  );
};

/**
 * Reveals all cells in the board (used at game end).
 * Memoized function to avoid recreation.
 */
const revealAllCells = (board: Cell[][]): Cell[][] => {
  return board.map(row =>
    row.map(cell => ({ ...cell, isRevealed: true }))
  );
}; 