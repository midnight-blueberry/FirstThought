import { useCallback, useState } from 'react';
import type { Animated } from 'react-native';
import useBlinkAnimation from '@/hooks/useBlinkAnimation';

export type BlinkIndexReturn = {
  index: number | null;
  blinkAnim: Animated.Value;
  blinkAt: (i: number) => void;
  stopBlink: () => void;
};

export default function useBlinkIndex(): BlinkIndexReturn {
  const [index, setIndex] = useState<number | null>(null);
  const { blinkAnim, triggerBlink, stopBlink: stopAnim } = useBlinkAnimation({
    onEnd: () => setIndex(null),
  });

  const stopBlink = useCallback(() => {
    stopAnim();
    setIndex(null);
  }, [stopAnim]);

  const blinkAt = useCallback(
    (i: number) => {
      stopAnim();
      setIndex(i);
      triggerBlink();
    },
    [stopAnim, triggerBlink],
  );

  return { index, blinkAnim, blinkAt, stopBlink };
}

