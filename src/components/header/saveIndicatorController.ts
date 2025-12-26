import { Animated, Easing } from 'react-native';

interface SaveIndicatorControllerParams {
  setVisible: (visible: boolean) => void;
  opacity: Animated.Value;
}

export function createSaveIndicatorController({
  setVisible,
  opacity,
}: SaveIndicatorControllerParams) {
  let runId = 0;
  let currentAnim: Animated.CompositeAnimation | null = null;

  const stopCurrent = () => {
    if (currentAnim) {
      currentAnim.stop();
      currentAnim = null;
    }
  };

  const hide = () => {
    runId += 1;
    stopCurrent();
    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    setVisible(false);
  };

  const showFor2s = () => {
    const token = ++runId;
    stopCurrent();
    setVisible(true);

    return new Promise<void>((resolve) => {
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

      currentAnim = anim;

      anim.start(() => {
        if (token !== runId) {
          resolve();
          return;
        }
        setVisible(false);
        resolve();
      });
    });
  };

  return { showFor2s, hide };
}
