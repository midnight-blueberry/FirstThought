import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import useAnchorStableScroll from '@/features/scroll/useAnchorStableScroll';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';
import { UIManager } from 'react-native';

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({
    isOpaque: () => true,
  }),
}));

export default (test: JestCucumberTestFn) => {
  let tree: any;
  let hook: ReturnType<typeof useAnchorStableScroll> | null = null;
  let scrollRef: { current: { scrollTo: jest.Mock } } | null = null;
  const measureLayoutMock = UIManager.measureLayout as jest.Mock;

  const TestComponent = ({ onReady }: { onReady: (value: ReturnType<typeof useAnchorStableScroll>) => void }) => {
    const value = useAnchorStableScroll();

    hook = value;
    scrollRef = scrollRef ?? ({ current: { scrollTo: jest.fn() } } as any);
    value.scrollRef.current = scrollRef!.current as any;
    onReady(value);

    return null;
  };

  afterEach(async () => {
    tree = await unmountTree(tree);
    hook = null;
    scrollRef = null;
    measureLayoutMock.mockReset();
  });

  const renderHook = async () => {
    await act(async () => {
      tree = renderWithProviders(
        React.createElement(TestComponent, {
          onReady: (value) => {
            hook = value;
            scrollRef = { current: { scrollTo: jest.fn() } } as any;
            value.scrollRef.current = scrollRef!.current as any;
          },
        }),
      );
    });

    await act(async () => {});
  };

  const registerRenderGiven = (given: StepDefinitions['given']) => {
    given('anchor stable scroll hook is rendered', async () => {
      await renderHook();
      expect(hook).toBeTruthy();
    });
  };

  const registerScrollPositionWhen = (when: StepDefinitions['when']) => {
    when(/^scroll position becomes (-?\d+)$/, (value: string) => {
      hook!.handleScroll(makeScrollEvent(Number(value)));
    });
  };

  const registerCaptureBeforeUpdateWhen = (when: StepDefinitions['when']) => {
    when(/^anchor layout before update reports y (-?\d+)$/, (value: string) => {
      measureLayoutMock.mockImplementationOnce((_anchor: any, _relativeTo: any, _onFail: any, onSuccess: any) => {
        onSuccess(0, Number(value));
      });

      hook!.contextValue.setAnchor({});
      hook!.contextValue.captureBeforeUpdate();
    });
  };

  const registerAdjustAfterLayoutWhen = (when: StepDefinitions['when']) => {
    when(/^anchor layout after update reports y (-?\d+)$/, (value: string) => {
      measureLayoutMock.mockImplementationOnce((_anchor: any, _relativeTo: any, _onFail: any, onSuccess: any) => {
        onSuccess(0, Number(value));
      });
    });

    when('scroll adjustment runs', () => {
      hook!.adjustAfterLayout();
    });
  };

  const registerScrollCalledThen = (then: StepDefinitions['then']) => {
    then(/^scroll is called with y (-?\d+) without animation$/, (value: string) => {
      expect(scrollRef!.current.scrollTo).toHaveBeenCalledWith({ y: Number(value), animated: false });
    });
  };

  const registerScrollNotCalledThen = (then: StepDefinitions['then']) => {
    then('scroll is not called', () => {
      expect(scrollRef!.current.scrollTo).not.toHaveBeenCalled();
    });
  };

  test('Adjusts scroll when anchor moves down', ({ given, when, then }: StepDefinitions) => {
    registerRenderGiven(given);
    registerScrollPositionWhen(when);
    registerCaptureBeforeUpdateWhen(when);
    registerAdjustAfterLayoutWhen(when);
    registerScrollCalledThen(then);
  });

  test('Does not scroll when anchor position is stable', ({ given, when, then }: StepDefinitions) => {
    registerRenderGiven(given);
    registerScrollPositionWhen(when);
    registerCaptureBeforeUpdateWhen(when);
    registerAdjustAfterLayoutWhen(when);
    registerScrollNotCalledThen(then);
  });
};
