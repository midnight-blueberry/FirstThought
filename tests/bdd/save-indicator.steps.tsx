import React from 'react';
import TestRenderer = require('react-test-renderer');
const { act } = TestRenderer;
import { SaveIndicatorProvider, useSaveIndicator } from '@components/header/SaveIndicator';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

const setVisibleCalls: boolean[] = [];
const originalUseState = React.useState;
let useStateSpy: jest.SpyInstance;

type HarnessProps = {
  onReady: (api: {
    showFor2s: () => Promise<void>;
    visible: boolean;
    opacity: any;
  }) => void;
};

const getOpacityValue = (opacity: any) => {
  const getter = opacity?.__getValue ?? opacity?.getValue;
  if (typeof getter === 'function') {
    return getter.call(opacity);
  }
  if (typeof opacity?._v === 'number') {
    return opacity._v;
  }
  return 0;
};

const Harness: React.FC<HarnessProps> = ({ onReady }) => {
  const api = useSaveIndicator();
  onReady(api);

  return null;
};

describe('SaveIndicatorProvider', () => {
  beforeAll(() => {
    useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(((initial: any) => {
      const [state, setState] = (originalUseState as any)(initial);
      if (typeof initial === 'boolean') {
        const wrappedSetState = (value: any) => {
          const nextValue = typeof value === 'function' ? value(state) : value;
          setVisibleCalls.push(nextValue as boolean);
          return (setState as any)(value);
        };
        return [state, wrappedSetState];
      }
      return [state, setState];
    }) as any);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    setVisibleCalls.length = 0;
  });

  afterAll(() => {
    useStateSpy.mockRestore();
  });

  it('keeps indicator visible and restarts from zero opacity on rapid show calls', async () => {
    let handle: { showFor2s: () => Promise<void>; visible: boolean; opacity: any } | null = null;

    let rendererInstance: TestRenderer.ReactTestRenderer;
    await act(async () => {
      rendererInstance = TestRenderer.create(
        <SaveIndicatorProvider>
          <Harness
            onReady={(api) => {
              handle = api;
            }}
          />
        </SaveIndicatorProvider>,
      );
    });

    expect(rendererInstance!).toBeDefined();
    await act(async () => {});
    expect(handle).not.toBeNull();

    await act(async () => {
      handle!.showFor2s();
    });

    await act(async () => {
      jest.advanceTimersByTime(100);
      handle!.showFor2s();
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    act(() => {
      jest.advanceTimersByTime(1900);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(setVisibleCalls[0]).toBe(true);
    expect(setVisibleCalls[setVisibleCalls.length - 1]).toBe(false);
    expect(setVisibleCalls.filter((value) => value === false)).toHaveLength(1);
    const finalOpacity = getOpacityValue(handle!.opacity);
    expect(finalOpacity).toBe(0);
    expect(handle).not.toBeNull();
  });
});
