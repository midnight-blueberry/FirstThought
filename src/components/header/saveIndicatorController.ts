import { Animated, Easing } from 'react-native';

interface CreateSaveIndicatorControllerArgs {
  setVisible: (value: boolean) => void;
  opacity: Animated.Value;
}

export function createSaveIndicatorController({
  setVisible,
  opacity,
}: CreateSaveIndicatorControllerArgs) {
  let runId = 0;
  let currentAnim: Animated.CompositeAnimation | null = null;

  const stopCurrentAnimation = () => {
    if (currentAnim) {
      currentAnim.stop();
      currentAnim = null;
    }
    opacity.stopAnimation(() => {});
  };

  const hide = () => {
    runId += 1;
    stopCurrentAnimation();
    opacity.setValue(0);
    setVisible(false);
  };

  const showFor2s = () => {
    const currentRunId = ++runId;
    stopCurrentAnimation();
    opacity.setValue(0);
    setVisible(true);

    return new Promise<void>((resolve) => {
      const animation = Animated.sequence([
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

      currentAnim = animation;

      animation.start(() => {
        if (currentRunId !== runId) {
          return;
        }
        currentAnim = null;
        setVisible(false);
        resolve();
      });
    });
  };

  return { showFor2s, hide };
}
