import React from 'react';
import { Animated } from 'react-native';
// @ts-ignore
import { act } from 'react-test-renderer';

import { useOverlayAnimation, type OverlayAnimationApi } from '@/components/settings/overlay/useOverlayAnimation';
import {
  OVERLAY_EASING_IN,
  OVERLAY_EASING_OUT,
  OVERLAY_HIDE_DURATION_MS,
  OVERLAY_MAX_OPACITY,
  OVERLAY_MIN_OPACITY,
  OVERLAY_SHOW_DURATION_MS,
} from '@/components/settings/overlay/transitionConfig';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let api: OverlayAnimationApi | null = null;

  const TestComponent = () => {
    api = useOverlayAnimation();
    return null;
  };

  const renderHook = () => {
    tree = renderWithProviders(React.createElement(TestComponent));
  };

  const registerHookRenderedGiven = (given: StepDefinitions['given']) => {
    given('overlay animation hook is rendered', () => {
      renderHook();
      expect(api).not.toBeNull();
    });
  };

  afterEach(async () => {
    api = null;
    tree = await unmountTree(tree);
    (Animated.timing as jest.Mock).mockClear();
  });

  test('initial opacity starts at minimum', ({ given, then }: StepDefinitions) => {
    registerHookRenderedGiven(given);

    then('overlay opacity equals OVERLAY_MIN_OPACITY', () => {
      const opacityValue = api!.opacity as unknown as { getValue: () => number };
      expect(opacityValue.getValue()).toBe(OVERLAY_MIN_OPACITY);
    });
  });

  test('show starts animation to maximum opacity', ({ given, when, then }: StepDefinitions) => {
    registerHookRenderedGiven(given);

    when('show is invoked', () => {
      act(() => {
        api!.show();
      });
    });

    then('Animated.timing is called to animate overlay to maximum opacity', () => {
      expect(Animated.timing).toHaveBeenCalledWith(api!.opacity, {
        toValue: OVERLAY_MAX_OPACITY,
        duration: OVERLAY_SHOW_DURATION_MS,
        easing: OVERLAY_EASING_IN,
        useNativeDriver: true,
      });
    });

    then('overlay animation starts immediately', () => {
      const animation = (Animated.timing as jest.Mock).mock.results[0].value;
      expect(animation.start).toHaveBeenCalledTimes(1);
    });
  });

  test('hide starts animation to minimum opacity', ({ given, when, then }: StepDefinitions) => {
    registerHookRenderedGiven(given);

    when('hide is invoked', () => {
      act(() => {
        api!.hide();
      });
    });

    then('Animated.timing is called to animate overlay to minimum opacity', () => {
      expect(Animated.timing).toHaveBeenCalledWith(api!.opacity, {
        toValue: OVERLAY_MIN_OPACITY,
        duration: OVERLAY_HIDE_DURATION_MS,
        easing: OVERLAY_EASING_OUT,
        useNativeDriver: true,
      });
    });

    then('overlay animation starts immediately after hide', () => {
      const animation = (Animated.timing as jest.Mock).mock.results[0].value;
      expect(animation.start).toHaveBeenCalledTimes(1);
    });
  });
};
