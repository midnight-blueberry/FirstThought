import { Animated, Easing } from 'react-native';

interface SaveIndicatorControllerDeps {
  setVisible: (value: boolean) => void;
  opacity: Animated.Value;
}

export interface SaveIndicatorController {
  showFor2s: () => Promise<void>;
  hide: () => void;
}

export function createSaveIndicatorController({
  setVisible,
  opacity,
}: SaveIndicatorControllerDeps): SaveIndicatorController {
  const runIdRef = { current: 0 };
  const currentAnimRef: { current: Animated.CompositeAnimation | null } = {
    current: null,
  };

  const stopCurrentAnim = () => {
    currentAnimRef.current?.stop();
    currentAnimRef.current = null;
  };

  const resetOpacity = () => {
    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
  };

  const hide = () => {
    runIdRef.current += 1;
    stopCurrentAnim();
    resetOpacity();
    setVisible(false);
  };

  const showFor2s = () =>
    new Promise<void>((resolve) => {
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;

      stopCurrentAnim();
      resetOpacity();
      setVisible(true);

      const anim = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1300),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]);

      currentAnimRef.current = anim;

      anim.start(() => {
        if (runId === runIdRef.current) {
          setVisible(false);
        }
        currentAnimRef.current = null;
        resolve();
      });
    });

  return { showFor2s, hide };
}
