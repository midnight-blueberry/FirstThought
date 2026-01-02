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
import { unmountTree } from '@tests/utils/unmountTree';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  let scrollRef: { current: { scrollTo: jest.Mock; measure: jest.Mock } } | null = null;
  let tree: any;
  let ctx: ReturnType<typeof getStickySelectionContext>;

  afterEach(async () => {
    tree = await unmountTree(tree);
    setStickySelectionContext(null);
    clearRegistry();
  });

  test('keeps scroll offset after theme change', ({ given, when, then }: StepDefinitions) => {
    given('a list is rendered with a scroll ref', async () => {
      scrollRef = { current: { scrollTo: jest.fn(), measure: jest.fn() } };
      const List = () => null;

      await act(async () => {
        tree = renderWithProviders(React.createElement(List), { scrollRef });
      });
    });

    given('a sticky selection context is available', () => {
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

    when('the scroll position is 150', () => {
      ctx!.onScroll(makeScrollEvent(150));
    });

    when('the theme dark item is registered at position 210', () => {
      register('theme:dark', {
        current: { measureInWindow: (cb: any) => cb(0, 210, 0, 20) },
      } as any);
    });

    when('sticky selection is applied', async () => {
      await act(async () => {
        await ctx!.applyWithSticky(async () => {});
      });
    });

    then('the scroll offset is adjusted to 170 without animation', () => {
      expect(scrollRef!.current.scrollTo).toHaveBeenCalledWith({ y: 170, animated: false });
    });
  });

  test('keeps idle state when theme position matches pressed position', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    given('a list is rendered with a scroll ref', async () => {
      scrollRef = { current: { scrollTo: jest.fn(), measure: jest.fn() } };
      const List = () => null;

      await act(async () => {
        tree = renderWithProviders(React.createElement(List), { scrollRef });
      });
    });

    given('a sticky selection context is available', () => {
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

    when('the scroll position is 150', () => {
      ctx!.onScroll(makeScrollEvent(150));
    });

    when('the theme dark item is registered at position 190', () => {
      register('theme:dark', {
        current: { measureInWindow: (cb: any) => cb(0, 190, 0, 20) },
      } as any);
    });

    when('sticky selection is applied', async () => {
      await act(async () => {
        await ctx!.applyWithSticky(async () => {});
      });
    });

    then('the scroll ref is not scrolled', () => {
      expect(scrollRef!.current.scrollTo).not.toHaveBeenCalled();
    });

    then('the sticky selection context is idle with no selection', () => {
      expect(ctx!.status.current).toBe('idle');
      expect(ctx!.state.id).toBeNull();
    });
  });
};
