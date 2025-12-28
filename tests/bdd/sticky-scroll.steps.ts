import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import {
  getStickySelectionContext,
  setStickySelectionContext,
} from '@/features/sticky-position/StickySelectionContext';
import { clearRegistry, register } from '@/features/sticky-position/registry';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { renderWithProviders } from '@tests/utils/render';

type StepDefinitions = { given: any; when: any; then: any; and?: any };

export default (test: any) => {
  let scrollRef: { current: { scrollTo: jest.Mock; measure: jest.Mock } } | null = null;
  let tree: any;
  let ctx: ReturnType<typeof getStickySelectionContext>;

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    setStickySelectionContext(null);
    clearRegistry();
  });

  test('keeps scroll offset after theme change', ({ given, and, when, then }: StepDefinitions) => {
    given('a list is rendered with a scroll ref', async () => {
      scrollRef = { current: { scrollTo: jest.fn(), measure: jest.fn() } };
      const List = () => null;

      await act(async () => {
        tree = renderWithProviders(React.createElement(List), { scrollRef });
      });
    });

    and('a sticky selection context is available', () => {
      ctx = getStickySelectionContext();
      expect(ctx).toBeTruthy();
    });

    when('a pressed item is registered at position 190', async () => {
      const pressedRef = {
        current: { measureInWindow: (cb: any) => cb(0, 190, 0, 20) },
      } as any;

      await act(async () => {
        await ctx!.registerPress('theme:dark', pressedRef);
      });
    });

    and('the scroll position is 150', () => {
      ctx!.onScroll(makeScrollEvent(150));
    });

    and('the theme dark item is registered at position 210', () => {
      register('theme:dark', {
        current: { measureInWindow: (cb: any) => cb(0, 210, 0, 20) },
      } as any);
    });

    and('sticky selection is applied', async () => {
      await act(async () => {
        await ctx!.applyWithSticky(async () => {});
      });
    });

    then('the scroll offset is adjusted to 170 without animation', () => {
      expect(scrollRef!.current.scrollTo).toHaveBeenCalledWith({ y: 170, animated: false });
    });
  });
};
