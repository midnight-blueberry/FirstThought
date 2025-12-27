import React, { useEffect } from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import useAnchorStableScroll from '@/features/scroll/useAnchorStableScroll';
import { renderWithProviders } from '@tests/utils/render';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { UIManager } from 'react-native';

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({
    isOpaque: () => true,
  }),
}));

const feature = loadFeature('tests/bdd/anchor-stable-scroll.feature');

const captureQueue = [100, 110];
const adjustQueue = [110, 100];

const TestComponent = ({ expose }: { expose: (api: ReturnType<typeof useAnchorStableScroll>) => void }) => {
  const api = useAnchorStableScroll();

  expose(api);

  useEffect(() => {
    expose(api);
  }, [api, expose]);

  return null;
};

defineFeature(feature, (test) => {
  let scrollToMock: jest.Mock;
  let tree: any;
  let api: ReturnType<typeof useAnchorStableScroll> | null = null;
  let callIndex = 0;

  const anchorRef = { nodeHandle: 2 } as any;
  const scrollNode = { nodeHandle: 1, scrollTo: jest.fn() } as any;

  beforeEach(() => {
    scrollToMock = jest.fn();
    callIndex = 0;

    scrollNode.scrollTo = scrollToMock;
    UIManager.measureLayout = jest.fn((_anchor, _scrollNode, _onFail, onSuccess) => {
      const isCapture = callIndex % 2 === 0;
      const idx = Math.floor(callIndex / 2);
      callIndex += 1;
      const y = isCapture ? captureQueue[idx] : adjustQueue[idx];
      onSuccess?.(0, y, 0, 0);
    });
  });

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }

    api = null;
  });

  test('avoids cumulative drift across sequential layout diffs', ({ given, when, and, then }) => {
    given('anchor stable scroll is mounted with initial scroll 150', async () => {
      await act(async () => {
        tree = renderWithProviders(
          React.createElement(TestComponent, {
            expose: (hookApi) => {
              api = hookApi;
            },
          }),
        );
      });

      api!.scrollRef.current = scrollNode;
      api!.contextValue.setAnchor(anchorRef);
      api!.handleScroll(makeScrollEvent(150));
    });

    when('the first capture and adjust cycle completes', () => {
      api!.contextValue.captureBeforeUpdate();
      api!.adjustAfterLayout();
    });

    and('the second capture and adjust cycle completes', () => {
      api!.contextValue.setAnchor(anchorRef);
      api!.contextValue.captureBeforeUpdate();
      api!.adjustAfterLayout();
    });

    then('scroll offsets are corrected to 160 and then 150', () => {
      expect(scrollToMock).toHaveBeenNthCalledWith(1, { y: 160, animated: false });
      expect(scrollToMock).toHaveBeenNthCalledWith(2, { y: 150, animated: false });
    });
  });
});
