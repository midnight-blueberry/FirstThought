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

  const showFor2s = () => {
    const currentRunId = ++runId;

    currentAnim?.stop();
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
          resolve();
          return;
        }

        setVisible(false);
        resolve();
      });
    });
  };

  const hide = () => {
    runId += 1;
    currentAnim?.stop();
    currentAnim = null;

    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    setVisible(false);
  };

  return { showFor2s, hide };
}
