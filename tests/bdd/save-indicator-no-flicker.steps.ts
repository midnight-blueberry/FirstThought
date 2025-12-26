import { defineFeature, loadFeature } from 'jest-cucumber';
import { Animated } from 'react-native';
import { createSaveIndicatorController } from '@components/header/saveIndicatorController';

const animationCompletions: Array<() => void> = [];

jest.mock('react-native', () => {
  const completions = animationCompletions;
  const createMockAnimation = () => ({
    start: (cb?: () => void) => {
      if (cb) completions.push(cb);
    },
    stop: jest.fn(),
  });

  class MockAnimatedValue {
    private value: number;

    constructor(initial: number) {
      this.value = initial;
    }

    setValue = (v: number) => {
      this.value = v;
    };

    stopAnimation = (cb?: (value: number) => void) => {
      cb?.(this.value);
    };
  }

  return {
    Animated: {
      Value: MockAnimatedValue,
      timing: () => createMockAnimation(),
      delay: () => createMockAnimation(),
      sequence: () => createMockAnimation(),
    },
    Easing: { inOut: (fn: unknown) => fn, quad: 'quad' },
    StyleSheet: { create: (styles: any) => styles },
  };
});

const feature = loadFeature('tests/bdd/save-indicator-no-flicker.feature');

defineFeature(feature, (test) => {
  let controller: ReturnType<typeof createSaveIndicatorController>;
  let setVisible: jest.MockedFn<(visible: boolean) => void>;
  let opacity: Animated.Value;

  beforeEach(() => {
    animationCompletions.splice(0, animationCompletions.length);
    setVisible = jest.fn();
    opacity = new Animated.Value(0);
    controller = createSaveIndicatorController({ setVisible, opacity });
  });

  test('Old animation completions cannot hide the indicator after a new show', ({
    given,
    when,
    and,
    then,
  }) => {
    given('a save indicator controller', () => {
      expect(controller).toBeTruthy();
    });

    when('the indicator is shown twice quickly', () => {
      void controller.showFor2s();
      void controller.showFor2s();
      expect(animationCompletions).toHaveLength(2);
    });

    and('the first animation completes', () => {
      const firstCompletion = animationCompletions.shift();
      firstCompletion?.();
    });

    then('the indicator stays visible', () => {
      expect(setVisible).not.toHaveBeenCalledWith(false);
    });

    and('the second animation completes', () => {
      const secondCompletion = animationCompletions.shift();
      secondCompletion?.();
    });

    then('the indicator hides', () => {
      expect(setVisible).toHaveBeenCalledWith(false);
    });
  });
});
