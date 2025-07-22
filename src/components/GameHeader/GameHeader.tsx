import { memo, useMemo } from 'react';
import type { FC } from 'react';
import type { GameStatus as GameStatusType } from '../../types/game';
import { GameStatus } from '../../types/game';
import { AnimatedNumber } from '../AnimatedNumber/AnimatedNumber';
import styles from './GameHeader.module.css';

interface GameHeaderProps {
  currentCoins: number;
  gameStatus: GameStatusType;
  onCashOut: () => void;
  isLoading: boolean;
}

/**
 * Game header component that matches the mockup design exactly.
 * Shows balance and max prize in a pill-shaped container.
 * Memoized to prevent unnecessary re-renders.
 */
const GameHeaderComponent: FC<GameHeaderProps> = ({
  currentCoins,
  gameStatus,
  onCashOut,
  isLoading,
}) => {
  // Memoize expensive calculations
  const canCashOut = useMemo(() => 
    gameStatus === GameStatus.PLAYING && currentCoins > 0, 
    [gameStatus, currentCoins]
  );

  const dollarValue = useMemo(() => currentCoins / 100, [currentCoins]);

  return (
    <div className={styles.header}>
      <div className={styles.balancePill}>
        <div className={styles.balanceSection}>
          <div className={styles.sectionLabel}>BALANCE</div>
          <div className={styles.balanceValues}>
            <span className={styles.currencySymbol}>$</span>
            <AnimatedNumber 
              value={dollarValue} 
              decimals={2} 
              className={styles.value}
            />
            <span className={styles.coinIcon}>🪙</span>
            <AnimatedNumber 
              value={currentCoins} 
              className={styles.value}
            />
          </div>
        </div>
        <div className={styles.maxPrizeSection}>
          <div className={styles.sectionLabel}>MAX PRIZE</div>
          <div className={styles.maxPrizeValues}>
            <span className={styles.currencySymbol}>$</span>
            <span className={styles.value}>2.50K</span>
            <span className={styles.coinIcon}>🪙</span>
            <span className={styles.value}>50M</span>
          </div>
        </div>
      </div>
      
      {canCashOut && (
        <button
          className={styles.cashOutButton}
          onClick={onCashOut}
          disabled={isLoading}
        >
          💰 Cash Out
        </button>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const GameHeader = memo(GameHeaderComponent); 