import React from 'react';
// @ts-ignore
import renderer, { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { UIManager } from 'react-native';
import useAnchorStableScroll from '@/features/scroll/useAnchorStableScroll';

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({ isOpaque: () => true }),
}));

const feature = loadFeature('tests/bdd/anchor-stable-scroll.feature');

defineFeature(feature, (test) => {
  let queue: number[] = [];
  let scrollToMock: jest.Mock;
  type ExposedMethods = ReturnType<typeof useAnchorStableScroll> & {
    setAnchor: (ref: any) => void;
    captureBeforeUpdate: () => void;
  };

  let methods: ExposedMethods | null = null;
  let tree: ReturnType<typeof renderer.create> | null = null;
  const anchorRef = { __node: 1 };

  afterEach(() => {
    if (tree) {
      tree.unmount();
      tree = null;
    }
    if ((UIManager.measureLayout as jest.Mock).mockReset) {
      (UIManager.measureLayout as jest.Mock).mockReset();
    }
    methods = null;
  });

  test('prevents cumulative scroll drift across successive adjustments', ({
    given,
    and,
    when,
    then,
  }) => {
    given('anchor stable scroll is rendered with a scroll view', async () => {
      queue = [100, 110, 110, 100];
      scrollToMock = jest.fn();
      const scrollView = { __node: 2, scrollTo: scrollToMock } as any;

      (UIManager.measureLayout as jest.Mock).mockImplementation(
        (_target, _relativeTo, _onFail, onSuccess) => {
          const nextY = queue.shift();
          if (nextY == null) {
            throw new Error('measureLayout queue is empty');
          }
          onSuccess?.(0, nextY);
        },
      );

      const TestComponent = ({ expose }: { expose: (methods: ExposedMethods) => void }) => {
        const hook = useAnchorStableScroll();

        hook.scrollRef.current = scrollView;
        expose({
          ...hook,
          setAnchor: hook.contextValue.setAnchor,
          captureBeforeUpdate: hook.contextValue.captureBeforeUpdate,
        });

        return null;
      };

      await act(async () => {
        tree = renderer.create(
          React.createElement(TestComponent, {
            expose: (value: ExposedMethods) => {
              methods = value;
            },
          }),
        );
      });

      methods!.setAnchor(anchorRef);
    });

    and('the current scroll position is 150', () => {
      methods!.handleScroll({ nativeEvent: { contentOffset: { y: 150 } } } as any);
    });

    and('measureLayout returns anchor offsets from the queue', () => {
      expect(queue.length).toBe(4);
    });

    when('layout is recalculated twice with opposite diffs', () => {
      methods!.captureBeforeUpdate();
      methods!.adjustAfterLayout();
      methods!.setAnchor(anchorRef);
      methods!.captureBeforeUpdate();
      methods!.adjustAfterLayout();
    });

    then('the scroll positions are adjusted to 160 then 150', () => {
      expect(scrollToMock).toHaveBeenNthCalledWith(1, { y: 160, animated: false });
      expect(scrollToMock).toHaveBeenNthCalledWith(2, { y: 150, animated: false });
    });
  });
});
