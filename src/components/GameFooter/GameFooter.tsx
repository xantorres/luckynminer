import { memo, useMemo } from 'react';
import type { FC } from 'react';
import type { Cell, GameStatus as GameStatusType } from '../../types/game';
import { GameStatus } from '../../types/game';
import styles from './GameFooter.module.css';

interface GameFooterProps {
  currentCoins: number;
  board: Cell[][];
  gameStatus: GameStatusType;
  amountPerWin: number;
}

// Memoize coin tiers to prevent recreation
const COIN_TIERS = [
  { amount: 75.00, coins: '2M' },
  { amount: 100.00, coins: '2M' },
  { amount: 250.00, coins: '5M' },
] as const;

/**
 * Game footer component showing coin progression and next prize info.
 * Dynamically calculates and displays progress towards next milestone.
 * Memoized with expensive calculations optimized.
 */
const GameFooterComponent: FC<GameFooterProps> = ({ 
  currentCoins, 
  board, 
  gameStatus, 
  amountPerWin 
}) => {
  // Memoize expensive game progress calculation
  const gameProgress = useMemo(() => {
    if (gameStatus === GameStatus.IDLE || board.length === 0) {
      return { found: 0, total: 0, remaining: 0 };
    }

    const flatBoard = board.flat();
    const totalWinningCells = flatBoard.filter(cell => cell.isWinning).length;
    const foundWinningCells = flatBoard.filter(cell => cell.isWinning && cell.isRevealed).length;
    const remaining = totalWinningCells - foundWinningCells;

    return {
      found: foundWinningCells,
      total: totalWinningCells,
      remaining: Math.max(0, remaining)
    };
  }, [gameStatus, board]);

  // Memoize next prize calculation
  const nextPrizeInfo = useMemo(() => {
    if (gameStatus === GameStatus.IDLE) {
      return { label: 'NEXT PRIZE', value: `$${COIN_TIERS[0].amount.toFixed(0)}` };
    }
    
    if (gameStatus === GameStatus.LOST) {
      return { label: 'GAME OVER', value: '💥' };
    }
    
    if (gameStatus === GameStatus.CASHED_OUT) {
      return { label: 'CASHED OUT', value: '💰' };
    }

    if (gameStatus === GameStatus.PLAYING) {
      if (gameProgress.remaining === 0 && gameProgress.total > 0) {
        return { label: 'ALL FOUND!', value: '🎉' };
      }

      // Show current progress and what's needed for next tier
      const currentDollars = currentCoins / 100;
      const nextTier = COIN_TIERS.find(tier => tier.amount > currentDollars);
      
      if (nextTier && gameProgress.remaining > 0) {
        const coinsNeeded = Math.ceil((nextTier.amount - currentDollars) / (amountPerWin / 100));
        const winsNeeded = Math.min(coinsNeeded, gameProgress.remaining);
        
        return { 
          label: `NEXT: $${nextTier.amount.toFixed(0)}`, 
          value: `${winsNeeded}🍀` 
        };
      }

      // Show general progress
      return { 
        label: 'PROGRESS', 
        value: `${gameProgress.found}/${gameProgress.total}` 
      };
    }

    // Default fallback
    return { label: 'NEXT PRIZE', value: '--' };
  }, [gameStatus, gameProgress, currentCoins, amountPerWin]);

  // Memoize tier achievement status to prevent recalculation
  const tierAchievements = useMemo(() => 
    COIN_TIERS.map(tier => currentCoins >= tier.amount * 100),
    [currentCoins]
  );

  return (
    <div className={styles.footer}>
      <div className={styles.coinTiers}>
        {COIN_TIERS.map((tier, index) => (
          <div 
            key={index} 
            className={`${styles.coinTier} ${tierAchievements[index] ? styles.achieved : ''}`}
          >
            <span className={styles.currencySymbol}>$</span>
            <span className={styles.amount}>{tier.amount.toFixed(2)}</span>
            <span className={styles.coinIcon}>🪙</span>
            <span className={styles.coins}>{tier.coins}</span>
          </div>
        ))}
      </div>
      
      <div className={styles.nextPrize}>
        <div className={styles.nextPrizeLabel}>{nextPrizeInfo.label}</div>
        <div className={styles.nextPrizeValue}>
          <span 
            key={`${nextPrizeInfo.label}-${nextPrizeInfo.value}`}
            className={styles.prizeDisplay}
          >
            {nextPrizeInfo.value}
          </span>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const GameFooter = memo(GameFooterComponent); 