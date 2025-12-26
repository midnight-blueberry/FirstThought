import { defineFeature, loadFeature } from 'jest-cucumber';
import { Animated } from 'react-native';
import { createSaveIndicatorController } from '@/components/header/saveIndicatorController';

jest.mock('react-native', () => {
  const sequenceCallbacksRef: Array<(() => void) | undefined> = [];

  class MockAnimatedValue {
    private value: number;

    constructor(initial: number) {
      this.value = initial;
    }

    setValue(next: number) {
      this.value = next;
    }

    stopAnimation(callback?: (value: number) => void) {
      callback?.(this.value);
    }
  }

  const mockTiming = jest.fn(() => ({ start: jest.fn(), stop: jest.fn() }));
  const mockDelay = jest.fn(() => ({ start: jest.fn(), stop: jest.fn() }));
  const mockSequence = jest.fn(() => ({
    start: (cb?: () => void) => {
      sequenceCallbacksRef.push(cb);
    },
    stop: jest.fn(),
  }));

  return {
    Animated: {
      Value: MockAnimatedValue,
      timing: mockTiming,
      delay: mockDelay,
      sequence: mockSequence,
    },
    Easing: { inOut: (value: unknown) => value, quad: 'quad' },
    StyleSheet: { create: (styles: unknown) => styles },
    __sequenceCallbacksRef: sequenceCallbacksRef,
  };
});

const feature = loadFeature('tests/bdd/save-indicator-no-flicker.feature');

defineFeature(feature, (test) => {
  let controller: ReturnType<typeof createSaveIndicatorController> | null = null;
  let setVisible: jest.Mock;
  let sequenceCallbacks: Array<(() => void) | undefined> = [];

  afterEach(() => {
    sequenceCallbacks.length = 0;
    jest.clearAllMocks();
  });

  test('Previous animation completion does not hide indicator after a new show request', ({
    given,
    when,
    then,
    and,
  }) => {
    given('a save indicator controller', () => {
      setVisible = jest.fn();
      const { __sequenceCallbacksRef } = jest.requireMock('react-native');
      sequenceCallbacks = __sequenceCallbacksRef;
      controller = createSaveIndicatorController({
        setVisible,
        opacity: new Animated.Value(0),
      });
    });

    when('showFor2s is called twice in a row', () => {
      controller!.showFor2s();
      controller!.showFor2s();
    });

    and('the first animation completes', () => {
      const firstCompletion = sequenceCallbacks[0];
      firstCompletion?.();
    });

    then('the indicator remains visible', () => {
      expect(setVisible).not.toHaveBeenCalledWith(false);
      expect(setVisible).toHaveBeenLastCalledWith(true);
    });

    when('the second animation completes', () => {
      const secondCompletion = sequenceCallbacks[1];
      secondCompletion?.();
    });

    then('the indicator is hidden', () => {
      expect(setVisible).toHaveBeenCalledWith(false);
      expect(setVisible).toHaveBeenLastCalledWith(false);
    });
  });
});
