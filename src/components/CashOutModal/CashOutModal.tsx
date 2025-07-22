import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import type { FC } from 'react';
import styles from './CashOutModal.module.css';

interface CashOutModalProps {
  isOpen: boolean;
  currentCoins: number;
  onConfirm: () => void;
  onCancel: () => void;
  onContinuePlaying: () => void;
}

/**
 * Cash out confirmation modal with celebration and options.
 * Provides clear feedback and smooth game flow transitions.
 * Memoized to prevent unnecessary re-renders.
 */
const CashOutModalComponent: FC<CashOutModalProps> = ({
  isOpen,
  currentCoins,
  onConfirm,
  onCancel,
  onContinuePlaying,
}) => {
  const [stage, setStage] = useState<'confirm' | 'celebrating' | 'complete'>('confirm');

  useEffect(() => {
    if (isOpen) {
      setStage('confirm');
    }
  }, [isOpen]);

  // Memoize expensive dollar amount calculation
  const dollarAmount = useMemo(() => 
    (currentCoins / 100).toFixed(2),
    [currentCoins]
  );

  // Memoize the confirm handler to prevent recreation
  const handleConfirm = useCallback(() => {
    setStage('celebrating');
    setTimeout(() => {
      setStage('complete');
      onConfirm();
    }, 2000);
  }, [onConfirm]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {stage === 'confirm' && (
          <div className={styles.confirmStage}>
            <div className={styles.icon}>💰</div>
            <h2 className={styles.title}>Cash Out?</h2>
            <p className={styles.description}>
              You're about to cash out with
            </p>
            <div className={styles.amount}>
              <span className={styles.currency}>$</span>
              <span className={styles.value}>{dollarAmount}</span>
              <span className={styles.coins}>🪙 {currentCoins}</span>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.cancelButton} 
                onClick={onCancel}
              >
                Keep Playing
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={handleConfirm}
              >
                Cash Out
              </button>
            </div>
          </div>
        )}

        {stage === 'celebrating' && (
          <div className={styles.celebratingStage}>
            <div className={styles.celebration}>
              <div className={styles.fireworks}>🎉</div>
              <div className={styles.trophy}>🏆</div>
              <div className={styles.money}>💸</div>
            </div>
            <h2 className={styles.successTitle}>Congratulations!</h2>
            <div className={styles.winAmount}>
              <span className={styles.winCurrency}>$</span>
              <span className={styles.winValue}>{dollarAmount}</span>
            </div>
            <p className={styles.winText}>successfully cashed out!</p>
          </div>
        )}

        {stage === 'complete' && (
          <div className={styles.completeStage}>
            <div className={styles.completedIcon}>✅</div>
            <h2 className={styles.completeTitle}>Cash Out Complete!</h2>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Amount:</span>
                <span className={styles.summaryValue}>${dollarAmount}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Coins:</span>
                <span className={styles.summaryValue}>{currentCoins} 🪙</span>
              </div>
            </div>
            <div className={styles.finalActions}>
              <button 
                className={styles.newGameButton} 
                onClick={onContinuePlaying}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const CashOutModal = memo(CashOutModalComponent); 