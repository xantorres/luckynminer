export const GAME_CONFIG = {
  BOARD_SIZE: 3,
  MIN_MINES: 1,
  MAX_MINES: 4,
  BASE_AMOUNT_PER_WIN: 10,
  API_DELAY_MS: 800,
  // New betting mechanics
  MIN_BET: 10,              // Minimum bet amount
  MAX_BET: 1000,            // Maximum bet amount  
  STARTING_BALANCE: 100,    // Starting session balance
  DEFAULT_BET: 25,          // Default bet amount
} as const;

export const CELL_STATES = {
  HIDDEN: 'hidden',
  REVEALED_WIN: 'revealed_win', 
  REVEALED_MINE: 'revealed_mine',
} as const;

export const ANIMATION_DURATION = {
  CARD_FLIP: 400,
  CELL_ENTRANCE: 100,
  CELEBRATION: 1500,
} as const; 