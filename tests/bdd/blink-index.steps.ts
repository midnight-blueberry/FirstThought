import React from 'react';
import useBlinkAnimation from '@hooks/useBlinkAnimation';
import useBlinkIndex from '@hooks/useBlinkIndex';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

let stopAnimMock: jest.Mock;
let triggerBlinkMock: jest.Mock;
let capturedOnEnd: (() => void) | null = null;

jest.mock('@hooks/useBlinkAnimation', () => ({
  __esModule: true,
  default: jest.fn(({ onEnd }: { onEnd?: () => void }) => {
    capturedOnEnd = onEnd ?? null;
    return {
      blinkAnim: {} as any,
      stopBlink: stopAnimMock,
      triggerBlink: triggerBlinkMock,
    };
  }),
}));

export default (test: JestCucumberTestFn) => {
  let hookResult: ReturnType<typeof useBlinkIndex> | null = null;
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let callOrder: string[] = [];
  let setIndexMock: jest.Mock | null = null;
  let useStateSpy: jest.SpyInstance | null = null;

  const TestComponent = () => {
    hookResult = useBlinkIndex();
    return null;
  };

  const renderHook = () => {
    callOrder = [];
    setIndexMock = jest.fn((value) => {
      callOrder.push(`setIndex:${value}`);
    });
    stopAnimMock = jest.fn(() => {
      callOrder.push('stopAnim');
    });
    triggerBlinkMock = jest.fn(() => {
      callOrder.push('triggerBlink');
    });
    capturedOnEnd = null;

    useStateSpy = jest.spyOn(React, 'useState').mockImplementation(((initial: any) => [
      initial,
      setIndexMock!,
    ]) as any);

    tree = renderWithProviders(React.createElement(TestComponent));
  };

  afterEach(async () => {
    await unmountTree(tree);
    hookResult = null;
    tree = null;
    setIndexMock = null;
    capturedOnEnd = null;
    callOrder = [];
    useStateSpy?.mockRestore();
    (useBlinkAnimation as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  test('blinkAt updates index and triggers blink', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkIndex is rendered', () => {
      renderHook();
    });

    when('blinkAt is called with 3', () => {
      hookResult!.blinkAt(3);
    });

    then('stopAnim is called before index is set to 3', () => {
      expect(callOrder).toEqual(['stopAnim', 'setIndex:3', 'triggerBlink']);
    });

    then('index setter is called with 3 before triggerBlink is called', () => {
      expect(callOrder.indexOf('setIndex:3')).toBeLessThan(callOrder.indexOf('triggerBlink'));
    });

    then('triggerBlink is called', () => {
      expect(triggerBlinkMock).toHaveBeenCalled();
    });
  });

  test('stopBlink stops animation and clears index', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkIndex is rendered', () => {
      renderHook();
    });

    when('stopBlink is called', () => {
      hookResult!.stopBlink();
    });

    then('stopAnim is called before index is set to null', () => {
      expect(callOrder).toEqual(['stopAnim', 'setIndex:null']);
    });

    then('index setter is called with null', () => {
      expect(setIndexMock).toHaveBeenCalledWith(null);
    });
  });

  test('onEnd clears the index', ({ given, when, then }: StepDefinitions) => {
    given('useBlinkIndex is rendered', () => {
      renderHook();
    });

    when('onEnd callback is invoked', () => {
      capturedOnEnd?.();
    });

    then('index setter is called with null', () => {
      expect(setIndexMock).toHaveBeenCalledWith(null);
    });
  });
};
