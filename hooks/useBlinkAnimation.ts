import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

type Params = {
  iterations?: number;
  onEnd?: () => void;
};

export default function useBlinkAnimation({ iterations = 5, onEnd }: Params = {}) {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const triggerBlink = useCallback(() => {
    blinkAnim.stopAnimation();
    blinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      { iterations }
    ).start(onEnd);
  }, [blinkAnim, iterations, onEnd]);

  const stopBlink = useCallback(() => {
    blinkAnim.stopAnimation();
    blinkAnim.setValue(1);
    onEnd?.();
  }, [blinkAnim, onEnd]);

  return {
    blinkAnim,
    triggerBlink,
    stopBlink,
  };
}

