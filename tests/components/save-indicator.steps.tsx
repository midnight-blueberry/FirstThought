import React, { useEffect } from 'react';
// @ts-ignore
import renderer, { act } from 'react-test-renderer';
import { SaveIndicatorProvider, useSaveIndicator } from '@components/header/SaveIndicator';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

type SaveIndicatorRef = {
  trigger: () => Promise<void>;
  getOpacity: () => number;
};

const SaveIndicatorConsumer: React.FC<{
  onVisibilityChange: (visible: boolean) => void;
  onReady: (api: SaveIndicatorRef) => void;
}> = ({ onVisibilityChange, onReady }) => {
  const { showFor2s, visible, opacity } = useSaveIndicator();

  useEffect(() => {
    onVisibilityChange(visible);
  }, [onVisibilityChange, visible]);

  useEffect(() => {
    onReady({
      trigger: showFor2s,
      getOpacity: () => (opacity as any).__getValue?.() ?? (opacity as any).getValue?.() ?? 0,
    });
  }, [onReady, opacity, showFor2s]);

  return null;
};

describe('SaveIndicatorProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('restarts animation cleanly when showFor2s is called back-to-back', async () => {
    const visibilityStates: boolean[] = [];
    let indicatorApi: SaveIndicatorRef | null = null;

    await act(async () => {
      renderer.create(
        <SaveIndicatorProvider>
          <SaveIndicatorConsumer
            onVisibilityChange={(visible) => visibilityStates.push(visible)}
            onReady={(api) => {
              indicatorApi = api;
            }}
          />
        </SaveIndicatorProvider>,
      );
    });

    expect(indicatorApi).toBeTruthy();

    await act(async () => {
      void indicatorApi!.trigger();
      void indicatorApi!.trigger();
    });

    const opacityAfterRestart = indicatorApi!.getOpacity();

    await act(async () => {
      jest.runAllTimers();
    });

    expect(opacityAfterRestart).toBe(0);
    expect(visibilityStates).toEqual([false, true, false]);
  });
});
