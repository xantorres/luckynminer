export interface Cell {
  isWinning: boolean;
  isRevealed: boolean;
  id: string;
}

export interface Board {
  cells: Cell[][];
  amountPerWin: number;
}

export interface Game {
  board: { isWinning: boolean }[][];
  amountPerWin: number;
}

export interface GameState {
  board: Cell[][];
  currentCoins: number;
  gameStatus: GameStatus;
  amountPerWin: number;
  isLoading: boolean;
  // New session-based properties
  sessionBalance: number;      // Persistent balance across rounds
  currentBet: number;          // Amount wagered this round
  roundWinnings: number;       // Winnings accumulated this round
}

export const GameStatus = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
  CASHED_OUT: 'cashed_out'
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

export interface GameConfig {
  boardSize: number;
  minMines: number;
  maxMines: number;
  baseAmountPerWin: number;
  minBet: number;
  maxBet: number;
  startingBalance: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface SessionStats {
  totalCashedOut: number;
  gamesPlayed: number;
  totalWins: number;
  biggestWin: number;
  currentStreak: number;
} 