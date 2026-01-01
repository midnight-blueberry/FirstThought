import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import {
  getStickySelectionContext,
  setStickySelectionContext,
} from '@/features/sticky-position/StickySelectionContext';
import { clearRegistry } from '@/features/sticky-position/registry';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  let tree: any;
  let ctx: ReturnType<typeof getStickySelectionContext>;
  let scrollRef: { current: any } | null = null;

  afterEach(async () => {
    tree = await unmountTree(tree);
    setStickySelectionContext(null);
    clearRegistry();
  });

  test('registerPress leaves selection idle without measurement', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    given('a sticky tree is rendered with a scroll ref', async () => {
      scrollRef = { current: null };
      const List = () => null;

      await act(async () => {
        tree = renderWithProviders(React.createElement(List), { scrollRef });
      });
    });

    when('the sticky selection context is obtained', () => {
      ctx = getStickySelectionContext();
      expect(ctx).toBeTruthy();
    });

    when('registerPress is invoked without measureInWindow', async () => {
      const pressedRef = { current: {} } as any;

      await act(async () => {
        await ctx!.registerPress('theme:dark', pressedRef);
      });
    });

    then('the sticky selection state remains null and status is idle', () => {
      expect(ctx!.state.id).toBeNull();
      expect(ctx!.status.current).toBe('idle');
    });
  });
};
