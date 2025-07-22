import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import type { FC } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedNumber component that smoothly animates number changes.
 * Uses gentle, accessibility-friendly animations.
 * Memoized to prevent unnecessary re-renders.
 */
const AnimatedNumberComponent: FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  duration = 1200,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  // Memoize the easing function to prevent recreation
  const easeOutQuart = useCallback((progress: number) => 
    1 - Math.pow(1 - progress, 4),
    []
  );

  useEffect(() => {
    if (displayValue === value) return;
    
    const startValue = displayValue;
    const difference = value - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Very gentle easing - no sharp changes
      const easedProgress = easeOutQuart(progress);
      const currentValue = startValue + (difference * easedProgress);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    const animationId = requestAnimationFrame(animate);
    
    // Cleanup function to cancel animation if component unmounts
    return () => cancelAnimationFrame(animationId);
  }, [value, duration, displayValue, easeOutQuart]);

  // Memoize the formatted value to prevent recalculation
  const formattedValue = useMemo(() => {
    return decimals > 0 
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toString();
  }, [displayValue, decimals]);

  return (
    <span className={className}>
      {formattedValue}
    </span>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const AnimatedNumber = memo(AnimatedNumberComponent); 