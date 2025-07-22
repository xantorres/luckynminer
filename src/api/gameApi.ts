import type { Game } from '../types/game';
import { GAME_CONFIG } from '../utils/constants';

/**
 * Simulates an API call to fetch a new game board configuration.
 * Generates a random 3x3 board with at least 1 mine and configurable win amount.
 */
export async function fetchBoard(): Promise<Game> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, GAME_CONFIG.API_DELAY_MS));
  
  const board = generateRandomBoard();
  const amountPerWin = generateRandomWinAmount();
  
  return {
    board,
    amountPerWin
  };
}

/**
 * Generates a random 3x3 board with mines placed randomly.
 * Ensures at least MIN_MINES and at most MAX_MINES are placed.
 */
function generateRandomBoard(): { isWinning: boolean }[][] {
  const size = GAME_CONFIG.BOARD_SIZE;
  const board: { isWinning: boolean }[][] = [];
  
  // Initialize empty board with all winning cells
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      board[row][col] = { isWinning: true };
    }
  }
  
  // Calculate number of mines to place
  const totalCells = size * size;
  const maxPossibleMines = Math.min(GAME_CONFIG.MAX_MINES, totalCells - 1);
  const mineCount = Math.floor(Math.random() * (maxPossibleMines - GAME_CONFIG.MIN_MINES + 1)) + GAME_CONFIG.MIN_MINES;
  
  // Place mines randomly
  const positions = generateRandomPositions(totalCells, mineCount);
  positions.forEach(position => {
    const row = Math.floor(position / size);
    const col = position % size;
    board[row][col] = { isWinning: false };
  });
  
  return board;
}

/**
 * Generates unique random positions for mine placement.
 */
function generateRandomPositions(totalPositions: number, count: number): number[] {
  const positions: Set<number> = new Set();
  
  while (positions.size < count) {
    const randomPosition = Math.floor(Math.random() * totalPositions);
    positions.add(randomPosition);
  }
  
  return Array.from(positions);
}

/**
 * Generates a random amount per win with some variation.
 */
function generateRandomWinAmount(): number {
  const base = GAME_CONFIG.BASE_AMOUNT_PER_WIN;
  const variation = Math.floor(Math.random() * 5) + 1; // 1-5 variation
  return base + variation;
} 