import React from 'react';
import { AccessibilityInfo } from 'react-native';
// @ts-ignore
import { act } from 'react-test-renderer';

import OverlayTransitionProvider, {
  useOverlayTransition,
} from '@/components/settings/overlay/OverlayTransition';
import {
  OVERLAY_MAX_OPACITY,
  OVERLAY_MIN_OPACITY,
} from '@/components/settings/overlay/transitionConfig';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

const useThemeMock = jest.fn(() => ({
  colors: {
    background: 'mocked-background',
  },
}));

jest.mock('@hooks/useTheme', () => ({
  __esModule: true,
  default: () => useThemeMock(),
}));

jest.mock('react-native-portalize', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const useOverlayAnimationMock = jest.fn();

jest.mock('@/components/settings/overlay/useOverlayAnimation', () => ({
  useOverlayAnimation: () => useOverlayAnimationMock(),
}));

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let ctx: ReturnType<typeof useOverlayTransition> | null = null;

  let setValueMock: jest.Mock;
  let addListenerMock: jest.Mock;
  let removeListenerMock: jest.Mock;
  let showMock: jest.Mock;
  let hideMock: jest.Mock;

  const Consumer = () => {
    ctx = useOverlayTransition();
    return null;
  };

  const renderProvider = () => {
    tree = renderWithProviders(
      <OverlayTransitionProvider>
        <Consumer />
      </OverlayTransitionProvider>,
    );
  };

  beforeEach(() => {
    setValueMock = jest.fn();
    addListenerMock = jest.fn(() => 'id');
    removeListenerMock = jest.fn();
    showMock = jest.fn();
    hideMock = jest.fn();

    useOverlayAnimationMock.mockReturnValue({
      opacity: {
        setValue: setValueMock,
        addListener: addListenerMock,
        removeListener: removeListenerMock,
      },
      show: showMock,
      hide: hideMock,
    });

    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as any);
  });

  afterEach(async () => {
    tree = await unmountTree(tree);
    ctx = null;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const registerProviderGiven = (given: StepDefinitions['given']) => {
    given('the overlay transition provider is rendered with reduce motion enabled', () => {
      renderProvider();
      expect(ctx).not.toBeNull();
    });
  };

  test(
    'begin uses max opacity without show when reduce motion is enabled',
    ({ given, when, then }: StepDefinitions) => {
      registerProviderGiven(given);

      when('begin is invoked after reduce motion is applied', async () => {
        await act(async () => {
          await Promise.resolve();
        });

        await act(async () => {
          await ctx!.begin();
        });
      });

      then('opacity is set to maximum and show is not called', () => {
        expect(setValueMock).toHaveBeenCalledWith(OVERLAY_MAX_OPACITY);
        expect(showMock).not.toHaveBeenCalled();
      });
    },
  );

  test(
    'end uses min opacity without hide when reduce motion is enabled',
    ({ given, when, then }: StepDefinitions) => {
      registerProviderGiven(given);

      when('end is invoked after reduce motion is applied', async () => {
        await act(async () => {
          await Promise.resolve();
        });

        await act(async () => {
          await ctx!.end();
        });
      });

      then('opacity is set to minimum and hide is not called', () => {
        expect(setValueMock).toHaveBeenCalledWith(OVERLAY_MIN_OPACITY);
        expect(hideMock).not.toHaveBeenCalled();
      });
    },
  );
};
