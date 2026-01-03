import React from 'react';
import useBlinkIndex from '@/hooks/useBlinkIndex';
import useBlinkAnimation from '@hooks/useBlinkAnimation';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

type BlinkAnimationMock = jest.MockedFunction<typeof useBlinkAnimation>;

jest.mock('@hooks/useBlinkAnimation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

export default (test: JestCucumberTestFn) => {
  let hookResult: ReturnType<typeof useBlinkIndex> | null = null;
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let stopAnimMock: jest.Mock | null = null;
  let triggerBlinkMock: jest.Mock | null = null;
  let capturedOnEnd: (() => void) | undefined;
  let setIndexMock: jest.Mock | null = null;
  let useStateSpy: jest.SpyInstance | null = null;
  const useBlinkAnimationMock = useBlinkAnimation as BlinkAnimationMock;

  const renderHook = () => {
    stopAnimMock = jest.fn();
    triggerBlinkMock = jest.fn();
    setIndexMock = jest.fn();

    useStateSpy = jest.spyOn(React, 'useState').mockImplementation((initial) => [
      initial,
      setIndexMock!,
    ] as any);

    useBlinkAnimationMock.mockImplementation(({ onEnd }) => {
      capturedOnEnd = onEnd;
      return {
        blinkAnim: {} as any,
        stopBlink: stopAnimMock!,
        triggerBlink: triggerBlinkMock!,
      };
    });

    const TestComponent = () => {
      hookResult = useBlinkIndex();
      return null;
    };

    tree = renderWithProviders(React.createElement(TestComponent));
  };

  afterEach(async () => {
    await unmountTree(tree);
    tree = null;
    hookResult = null;
    useStateSpy?.mockRestore();
    useStateSpy = null;
    setIndexMock = null;
    stopAnimMock = null;
    triggerBlinkMock = null;
    capturedOnEnd = undefined;
    useBlinkAnimationMock.mockReset();
    jest.clearAllMocks();
  });

  test('blinkAt triggers stop, updates index, and starts blink animation', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    given('useBlinkIndex is rendered', () => {
      renderHook();
    });

    when('blinkAt is called with index 3', () => {
      hookResult!.blinkAt(3);
    });

    then('stop animation handler is called before index setter', () => {
      expect(stopAnimMock).not.toBeNull();
      expect(setIndexMock).not.toBeNull();
      expect(stopAnimMock!.mock.invocationCallOrder[0]).toBeLessThan(
        setIndexMock!.mock.invocationCallOrder[0]!,
      );
    });

    then('index setter is called with 3', () => {
      expect(setIndexMock).toHaveBeenCalledWith(3);
    });

    then('triggerBlink handler is called after index setter', () => {
      expect(triggerBlinkMock).not.toBeNull();
      expect(setIndexMock).not.toBeNull();
      expect(triggerBlinkMock!.mock.invocationCallOrder[0]).toBeGreaterThan(
        setIndexMock!.mock.invocationCallOrder[0]!,
      );
    });
  });

  test('stopBlink stops animation and clears index', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkIndex is rendered', () => {
      renderHook();
    });

    when('stopBlink is invoked', () => {
      hookResult!.stopBlink();
    });

    then('stop animation handler is called', () => {
      expect(stopAnimMock).toHaveBeenCalled();
    });

    then('index setter is called with null', () => {
      expect(setIndexMock).toHaveBeenCalledWith(null);
    });
  });

  test('onEnd callback clears index', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkIndex is rendered', () => {
      renderHook();
    });

    when('the captured onEnd callback is invoked', () => {
      capturedOnEnd?.();
    });

    then('index setter is called with null', () => {
      expect(setIndexMock).toHaveBeenCalledWith(null);
    });
  });
};
