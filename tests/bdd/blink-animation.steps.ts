import React from 'react';
import useBlinkAnimation from '@/hooks/useBlinkAnimation';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';
import { Animated } from 'react-native';

export default (test: JestCucumberTestFn) => {
  let hookResult: ReturnType<typeof useBlinkAnimation> | null = null;
  let onEnd: jest.Mock | null = null;
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let setValueSpy: jest.SpyInstance | null = null;
  let stopAnimationSpy: jest.SpyInstance | null = null;

  const renderHook = () => {
    onEnd = jest.fn();

    const TestComponent = () => {
      hookResult = useBlinkAnimation({ onEnd: onEnd ?? undefined });
      return null;
    };

    tree = renderWithProviders(React.createElement(TestComponent));

    setValueSpy = jest.spyOn(hookResult!.blinkAnim, 'setValue');
    stopAnimationSpy = jest.spyOn(hookResult!.blinkAnim, 'stopAnimation');
  };

  afterEach(async () => {
    await unmountTree(tree);
    tree = null;
    hookResult = null;
    setValueSpy?.mockRestore();
    stopAnimationSpy?.mockRestore();
    setValueSpy = null;
    stopAnimationSpy = null;
    onEnd = null;
    jest.clearAllMocks();
  });

  test('triggerBlink starts default animation', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkAnimation is rendered with default params', () => {
      renderHook();
    });

    when('triggerBlink is invoked', () => {
      hookResult!.triggerBlink();
    });

    then('blinkAnim.setValue is called with 1', () => {
      expect(setValueSpy).not.toBeNull();
      expect(setValueSpy).toHaveBeenCalledWith(1);
    });

    then('Animated.timing is called twice for fading out and in with duration 150', () => {
      const timingMock = Animated.timing as jest.MockedFunction<typeof Animated.timing>;

      expect(timingMock).toHaveBeenCalledTimes(2);
      expect(timingMock).toHaveBeenNthCalledWith(1, hookResult!.blinkAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      });
      expect(timingMock).toHaveBeenNthCalledWith(2, hookResult!.blinkAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      });
    });

    then('Animated.loop is called with iterations 5', () => {
      const loopMock = Animated.loop as jest.MockedFunction<typeof Animated.loop>;

      expect(loopMock).toHaveBeenCalledTimes(1);
      expect(loopMock).toHaveBeenCalledWith(expect.anything(), { iterations: 5 });
    });

    then('animation start is called with onEnd callback', () => {
      const loopMock = Animated.loop as jest.MockedFunction<typeof Animated.loop>;
      const loopResult = loopMock.mock.results[0]?.value as { start?: jest.Mock } | undefined;

      expect(loopResult?.start).toHaveBeenCalledWith(onEnd!);
    });
  });

  test('stopBlink stops animation and resets', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkAnimation is rendered with default params', () => {
      renderHook();
    });

    when('stopBlink is invoked', () => {
      hookResult!.stopBlink();
    });

    then('blinkAnim.stopAnimation is called', () => {
      expect(stopAnimationSpy).not.toBeNull();
      expect(stopAnimationSpy).toHaveBeenCalled();
    });

    then('blinkAnim.setValue is called with 1', () => {
      expect(setValueSpy).not.toBeNull();
      expect(setValueSpy).toHaveBeenCalledWith(1);
    });

    then('onEnd callback is called', () => {
      expect(onEnd).not.toBeNull();
      expect(onEnd).toHaveBeenCalled();
    });
  });
};
