import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import {
  getStickySelectionContext,
  setStickySelectionContext,
} from '@/features/sticky-position/StickySelectionContext';
import { clearRegistry } from '@/features/sticky-position/registry';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  let tree: any;
  let ctx: ReturnType<typeof getStickySelectionContext>;
  let scrollRef: { current: { scrollTo: jest.Mock; measure: jest.Mock } } | null =
    null;

  afterEach(async () => {
    tree = await unmountTree(tree);
    setStickySelectionContext(null);
    clearRegistry();
  });

  test('resets selection when applyWithSticky fails', ({
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

    when('the sticky selection context is obtained', () => {
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

    when('applyWithSticky throws an error', async () => {
      await act(async () => {
        await ctx!.applyWithSticky(async () => {
          throw new Error('boom');
        });
      });
    });

    then('sticky selection resets without scrolling', () => {
      expect(ctx!.state.id).toBeNull();
      expect(ctx!.status.current).toBe('idle');
      expect(scrollRef!.current.scrollTo).not.toHaveBeenCalled();
    });
  });
};
