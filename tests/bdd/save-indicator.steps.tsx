import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { SaveIndicatorProvider, useSaveIndicator } from '@components/header/SaveIndicator';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

jest.useFakeTimers();

type Callbacks = {
  onReady: (ctx: ReturnType<typeof useSaveIndicator>) => void;
};

const TestConsumer: React.FC<Callbacks> = ({ onReady }) => {
  const ctx = useSaveIndicator();

  onReady(ctx);

  return null;
};

describe('SaveIndicatorProvider', () => {
  it('does not blink on rapid showFor2s calls and restarts from zero opacity', async () => {
    const setVisibleCalls: boolean[] = [];
    const realUseState = React.useState;
    const useStateSpy = jest.spyOn(React as any, 'useState');

    useStateSpy.mockImplementation((initial: any) => {
      const [state, setState] = realUseState(initial as any);

      if (typeof initial === 'boolean') {
        const wrappedSetter: typeof setState = (value: any) => {
          const resolved = typeof value === 'function' ? (value as any)(state) : value;
          setVisibleCalls.push(resolved);
          return setState(value as any);
        };

        return [state, wrappedSetter];
      }

      return [state, setState];
    });

    let controller: ReturnType<typeof useSaveIndicator> | null = null;
    let readyResolve: () => void = () => {};
    const readyPromise = new Promise<void>((resolve) => {
      readyResolve = resolve;
    });
    await act(async () => {
      renderer.create(
        <SaveIndicatorProvider>
          <TestConsumer
            onReady={(ctx) => {
              controller = ctx;
              readyResolve();
            }}
          />
        </SaveIndicatorProvider>,
      );
    });

    await readyPromise;
    expect(controller).not.toBeNull();

    await act(async () => {
      controller!.showFor2s();
    });

    expect(setVisibleCalls).toEqual([true]);

    await act(async () => {
      controller!.showFor2s();
    });

    expect(setVisibleCalls.every((value) => value === true)).toBe(true);
    const currentOpacity =
      (controller!.opacity as any).getValue?.() ?? (controller!.opacity as any).__getValue?.();

    expect(currentOpacity).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(setVisibleCalls[setVisibleCalls.length - 1]).toBe(false);
    expect(setVisibleCalls.indexOf(false)).toBe(setVisibleCalls.length - 1);
  });
});
