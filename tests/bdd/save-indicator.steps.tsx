import React from 'react';
// @ts-ignore
import renderer, { act } from 'react-test-renderer';
import { SaveIndicatorProvider, useSaveIndicator } from '@/components/header/SaveIndicator';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

describe('SaveIndicatorProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps indicator visible between quick showFor2s calls and resets opacity', async () => {
    const setVisible = jest.fn();
    (jest.spyOn(React as any, 'useState') as jest.SpyInstance)
      .mockImplementationOnce((initial: unknown) => [
        initial,
        setVisible as unknown as React.Dispatch<React.SetStateAction<unknown>>,
      ]);

    let controls: {
      showFor2s?: () => Promise<void>;
      opacity?: any;
    } = {};

    const Recorder: React.FC = () => {
      const { showFor2s, opacity, visible } = useSaveIndicator();

      controls = { showFor2s, opacity };
      void visible;

      return null;
    };

    await act(async () => {
      renderer.create(
        <SaveIndicatorProvider>
          <Recorder />
        </SaveIndicatorProvider>,
      );
    });

    const showFor2s = controls.showFor2s!;
    const opacity = controls.opacity!;

    await act(async () => {
      showFor2s();
      showFor2s();
    });

    expect(setVisible).toHaveBeenCalledWith(true);

    const opacityValue =
      (opacity as any).__getValue?.() ??
      (opacity as any).getValue?.() ??
      0;

    expect(opacityValue).toBe(0);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(setVisible.mock.calls.map(([value]) => value)).toEqual([true, true, false]);
  });
});
