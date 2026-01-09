import React from 'react';
import { AccessibilityInfo } from 'react-native';
// @ts-ignore
import { act } from 'react-test-renderer';

import {
  OverlayTransitionProvider,
  useOverlayTransition,
} from '@/components/settings/overlay/OverlayTransition';
import {
  OVERLAY_MAX_OPACITY,
  OVERLAY_MIN_OPACITY,
} from '@/components/settings/overlay/transitionConfig';
import { useOverlayAnimation } from '@/components/settings/overlay/useOverlayAnimation';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

const themeMock = { colors: { background: '#000000' } };

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('react-native-portalize', () => {
  const React = require('react');
  return {
    __esModule: true,
    Portal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

const setValueMock = jest.fn();
const addListenerMock = jest.fn(() => 'id');
const removeListenerMock = jest.fn();
const showMock = jest.fn();
const hideMock = jest.fn();

jest.mock('@/components/settings/overlay/useOverlayAnimation', () => ({
  useOverlayAnimation: jest.fn(() => ({
    opacity: {
      setValue: setValueMock,
      addListener: addListenerMock,
      removeListener: removeListenerMock,
    },
    show: showMock,
    hide: hideMock,
  })),
}));

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let ctx: ReturnType<typeof useOverlayTransition> | null = null;

  const Consumer = () => {
    ctx = useOverlayTransition();
    return null;
  };

  const renderOverlayProvider = () => {
    tree = renderWithProviders(
      <OverlayTransitionProvider>
        <Consumer />
      </OverlayTransitionProvider>,
    );
  };

  afterEach(async () => {
    ctx = null;
    tree = await unmountTree(tree);
    (useOverlayAnimation as jest.Mock).mockClear();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const registerReduceMotionGiven = (given: StepDefinitions['given']) => {
    given('reduce motion is enabled for overlay transitions', async () => {
      jest
        .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
        .mockResolvedValue(true);
      jest
        .spyOn(AccessibilityInfo, 'addEventListener')
        .mockReturnValue({ remove: jest.fn() } as any);

      renderOverlayProvider();

      await act(async () => {
        await Promise.resolve();
      });

      expect(ctx).not.toBeNull();
    });
  };

  test('begin uses reduced motion behavior', ({ given, when, then }: StepDefinitions) => {
    registerReduceMotionGiven(given);

    when('begin is called', async () => {
      await act(async () => {
        await ctx!.begin();
      });
    });

    then('opacity is set to maximum without calling show', () => {
      expect(setValueMock).toHaveBeenCalledWith(OVERLAY_MAX_OPACITY);
      expect(showMock).not.toHaveBeenCalled();
    });
  });

  test('end uses reduced motion behavior', ({ given, when, then }: StepDefinitions) => {
    registerReduceMotionGiven(given);

    when('end is called', async () => {
      await act(async () => {
        await ctx!.end();
      });
    });

    then('opacity is set to minimum without calling hide', () => {
      expect(setValueMock).toHaveBeenCalledWith(OVERLAY_MIN_OPACITY);
      expect(hideMock).not.toHaveBeenCalled();
    });
  });
};
