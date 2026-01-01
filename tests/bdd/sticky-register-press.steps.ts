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
  const originalRequestAnimationFrame = global.requestAnimationFrame;

  afterEach(async () => {
    tree = await unmountTree(tree);
    setStickySelectionContext(null);
    clearRegistry();
    global.requestAnimationFrame = originalRequestAnimationFrame;
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

  test('registerPress waits for measureInWindow before resolving', ({
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

    when(
      'registerPress waits for measureInWindow after a delayed measurement',
      async () => {
        const queuedCallbacks: FrameRequestCallback[] = [];
        global.requestAnimationFrame = (cb: FrameRequestCallback) => {
          queuedCallbacks.push(cb);
          return queuedCallbacks.length;
        };

        const pressedRef = { current: {} } as any;
        let promise: Promise<void>;

        await act(async () => {
          promise = ctx!.registerPress('theme:dark', pressedRef) as Promise<void>;
        });

        expect(queuedCallbacks.length).toBeGreaterThan(0);

        await act(async () => {
          queuedCallbacks.shift()!(0);
        });

        pressedRef.current = {
          measureInWindow: (cb: any) => cb(0, 190, 0, 20),
        };

        await act(async () => {
          queuedCallbacks.shift()!(0);
          await promise!;
        });
      },
    );

    then('the sticky selection state is updated and status is idle', () => {
      expect(ctx!.state.id).toBe('theme:dark');
      expect(ctx!.status.current).toBe('idle');
    });
  });
};
