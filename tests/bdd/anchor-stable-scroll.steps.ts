import React from 'react';
// @ts-ignore
import renderer, { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { UIManager } from 'react-native';
import useAnchorStableScroll from '@/features/scroll/useAnchorStableScroll';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({ isOpaque: () => true }),
}));

const feature = loadFeature('tests/bdd/anchor-stable-scroll.feature');

type HookApi = ReturnType<typeof useAnchorStableScroll>;

const Harness = ({ expose }: { expose: (api: HookApi) => void }) => {
  const api = useAnchorStableScroll();
  expose(api);
  return null;
};

defineFeature(feature, (test) => {
  let hook: HookApi | null = null;
  let scrollTo: jest.Mock;
  let measureQueue: number[] = [];
  let tree: any;

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    hook = null;
    measureQueue = [];
  });

  test('Adjusts scroll without cumulative drift', ({ given, and, when, then }) => {
    given('an anchor stable scroll hook with scroll position 150', async () => {
      scrollTo = jest.fn();
      await act(async () => {
        tree = renderer.create(
          React.createElement(Harness, {
            expose: (api) => {
              hook = api;
            },
          }),
        );
      });
      hook!.scrollRef.current = { scrollTo, nodeHandle: 'scroll' } as any;
      hook!.handleScroll(makeScrollEvent(150));
    });

    and('anchor measurements queue is prepared', () => {
      measureQueue = [100, 110, 110, 100];
      (UIManager as any).measureLayout = jest.fn(
        (_target: any, _relativeTo: any, _onFail: () => void, onSuccess: (x: number, y: number) => void) => {
          const y = measureQueue.shift() ?? 0;
          onSuccess(0, y);
        },
      );
    });

    when('two adjustment cycles run', async () => {
      const runCycle = async () => {
        await act(async () => {
          hook!.contextValue.setAnchor(1);
          hook!.contextValue.captureBeforeUpdate();
        });

        await act(async () => {
          hook!.adjustAfterLayout();
        });
      };

      await runCycle();
      await runCycle();
    });

    then('scroll offsets are corrected without accumulation', () => {
      expect(scrollTo).toHaveBeenNthCalledWith(1, { y: 160, animated: false });
      expect(scrollTo).toHaveBeenNthCalledWith(2, { y: 150, animated: false });
    });
  });
});
