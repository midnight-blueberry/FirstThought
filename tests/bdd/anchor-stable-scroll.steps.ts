import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import useAnchorStableScroll from '@/features/scroll/useAnchorStableScroll';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { renderWithProviders } from '@tests/utils/render';
import * as ReactNative from 'react-native';

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({
    isOpaque: () => true,
  }),
}));

const feature = loadFeature('tests/bdd/anchor-stable-scroll.feature');

type HookValue = ReturnType<typeof useAnchorStableScroll>;

const HookHost = ({ expose }: { expose: (value: HookValue) => void }) => {
  const value = useAnchorStableScroll();

  expose(value);

  React.useEffect(() => {
    expose(value);
  }, [value, expose]);

  return null;
};

defineFeature(feature, (test) => {
  let hookValue: HookValue | null = null;
  let tree: any;
  let scrollTo: jest.Mock;
  let findNodeHandleMock: jest.SpyInstance;
  let measureLayoutMock: jest.SpyInstance;
  const anchorHandle = 7;
  const scrollNodeHandle = 17;

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    if (findNodeHandleMock) findNodeHandleMock.mockRestore();
    if (measureLayoutMock) measureLayoutMock.mockRestore();
  });

  test('keeps scroll position without accumulating error', ({ given, and, when, then }) => {
    given('anchor stable scroll hook is rendered', async () => {
      scrollTo = jest.fn();
      const expose = (value: HookValue) => {
        hookValue = value;
      };

      await act(async () => {
        tree = renderWithProviders(React.createElement(HookHost, { expose }), {
          scrollRef: { current: null },
        });
      });

      const scrollView = { scrollTo } as any;
      hookValue!.scrollRef.current = scrollView;

      findNodeHandleMock = jest
        .spyOn(ReactNative, 'findNodeHandle')
        .mockImplementation((node: any) => {
          if (node === scrollView) return scrollNodeHandle;
          return typeof node === 'number' ? node : 0;
        });

      const measureQueue = [100, 110, 110, 100];
      measureLayoutMock = jest
        .spyOn(ReactNative.UIManager, 'measureLayout')
        .mockImplementation(
          (
            _node: number,
            _relativeTo: number,
            _onFail: () => void,
            onSuccess: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void,
          ) => {
            const next = measureQueue.shift();
            if (next != null && onSuccess) {
              onSuccess(0, next, 0, 0, 0, next);
            }
          },
        );

      hookValue!.contextValue.setAnchor(anchorHandle);
    });

    and('the scroll position is 150', () => {
      hookValue!.handleScroll(makeScrollEvent(150));
    });

    when('anchor position changes from 100 to 110', async () => {
      await act(async () => {
        hookValue!.contextValue.captureBeforeUpdate();
      });
      await act(async () => {
        hookValue!.adjustAfterLayout();
      });

      hookValue!.contextValue.setAnchor(anchorHandle);
    });

    and('anchor position changes from 110 to 100', async () => {
      await act(async () => {
        hookValue!.contextValue.captureBeforeUpdate();
      });
      await act(async () => {
        hookValue!.adjustAfterLayout();
      });
    });

    then('the scroll is adjusted back to 150 without extra shift', () => {
      expect(scrollTo).toHaveBeenNthCalledWith(1, { y: 160, animated: false });
      expect(scrollTo).toHaveBeenNthCalledWith(2, { y: 150, animated: false });
    });
  });
});
