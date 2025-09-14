import React from 'react';
// @ts-ignore
import renderer, { act } from 'react-test-renderer';
import {
  StickySelectionProvider,
  getStickySelectionContext,
} from '@/features/sticky-position';
import { register, clearRegistry } from '@/features/sticky-position/registry';

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({
    begin: () => Promise.resolve(),
    end: () => Promise.resolve(),
  }),
}));

// @ts-ignore
global.requestAnimationFrame = (cb: any) => cb(0);
// @ts-ignore
global.__DEV__ = false;

describe('sticky scroll', () => {
  afterEach(() => {
    clearRegistry();
  });
  test('keeps scroll offset after theme change', async () => {
    const scrollRef = { current: { scrollTo: jest.fn(), measure: jest.fn() } } as any;

    const List = () => null;

    let tree: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <StickySelectionProvider scrollRef={scrollRef}>
          <List />
        </StickySelectionProvider>,
      );
    });

    const ctx = getStickySelectionContext();
    expect(ctx).toBeTruthy();

    const pressedRef = { current: { measureInWindow: (cb: any) => cb(0, 190, 0, 20) } } as any;

    await act(async () => {
      await ctx!.registerPress('theme:dark', pressedRef);
    });
    ctx!.onScroll({ nativeEvent: { contentOffset: { y: 150 } } } as any);
    register('theme:dark', { current: { measureInWindow: (cb: any) => cb(0, 210, 0, 20) } } as any);
    await act(async () => {
      await ctx!.applyWithSticky(async () => {});
    });
    expect(scrollRef.current.scrollTo).toHaveBeenCalledWith({ y: 170, animated: false });

    await act(async () => {
      tree!.unmount();
    });
  });
});
