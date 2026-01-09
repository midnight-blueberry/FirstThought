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

jest.mock('@hooks/useTheme', () => jest.fn(() => ({ colors: { background: '#000000' } })));

jest.mock('react-native-portalize', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/settings/overlay/useOverlayAnimation', () => ({
  useOverlayAnimation: jest.fn(),
}));

type OverlayOpacity = {
  setValue: jest.Mock;
  addListener: jest.Mock;
  removeListener: jest.Mock;
};

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let ctx: ReturnType<typeof useOverlayTransition> | null = null;
  let opacity: OverlayOpacity;
  let show: jest.Mock;
  let hide: jest.Mock;

  const Consumer = () => {
    ctx = useOverlayTransition();
    return null;
  };

  const setupOverlayAnimation = () => {
    opacity = {
      setValue: jest.fn(),
      addListener: jest.fn(() => 'id'),
      removeListener: jest.fn(),
    };
    show = jest.fn();
    hide = jest.fn();
    (useOverlayAnimation as jest.Mock).mockReturnValue({
      opacity,
      show,
      hide,
    });
  };

  const renderOverlay = async () => {
    await act(async () => {
      tree = renderWithProviders(
        <OverlayTransitionProvider>
          <Consumer />
        </OverlayTransitionProvider>,
      );
    });
    await act(async () => {
      await Promise.resolve();
    });
  };

  afterEach(async () => {
    tree = await unmountTree(tree);
    ctx = null;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('begin uses maximum opacity with reduce motion', ({ given, when, then }: StepDefinitions) => {
    given('reduce motion is enabled for overlay transitions', async () => {
      setupOverlayAnimation();
      jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
      jest
        .spyOn(AccessibilityInfo, 'addEventListener')
        .mockReturnValue({ remove: jest.fn() } as any);
      await renderOverlay();
      expect(ctx).not.toBeNull();
    });

    when('begin is invoked on the overlay transition', async () => {
      await act(async () => {
        await ctx!.begin();
      });
    });

    then('opacity is set to OVERLAY_MAX_OPACITY without showing the overlay', () => {
      expect(opacity.setValue).toHaveBeenCalledWith(OVERLAY_MAX_OPACITY);
      expect(show).not.toHaveBeenCalled();
    });
  });

  test('end uses minimum opacity with reduce motion', ({ given, when, then }: StepDefinitions) => {
    given('reduce motion is enabled for overlay transitions', async () => {
      setupOverlayAnimation();
      jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
      jest
        .spyOn(AccessibilityInfo, 'addEventListener')
        .mockReturnValue({ remove: jest.fn() } as any);
      await renderOverlay();
      expect(ctx).not.toBeNull();
    });

    when('end is invoked on the overlay transition', async () => {
      await act(async () => {
        await ctx!.end();
      });
    });

    then('opacity is set to OVERLAY_MIN_OPACITY without hiding the overlay', () => {
      expect(opacity.setValue).toHaveBeenCalledWith(OVERLAY_MIN_OPACITY);
      expect(hide).not.toHaveBeenCalled();
    });
  });
};
