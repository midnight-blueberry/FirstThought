import React from 'react';
// @ts-ignore
import renderer, { act } from 'react-test-renderer';
import {
  StickySelectionProvider,
  getStickySelectionContext,
} from '@/features/sticky-position';
import { register } from '@/features/sticky-position/registry';

jest.mock('@components/settings/overlay/OverlayTransition', () => ({
  useOverlayTransition: () => ({
    begin: () => Promise.resolve(),
    end: () => Promise.resolve(),
  }),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    InteractionManager: { runAfterInteractions: () => Promise.resolve() },
  };
});

// @ts-ignore
global.requestAnimationFrame = (cb: any) => cb(0);

describe('sticky scroll', () => {
  it('keeps scroll offset after theme change', async () => {
    const scrollTo = jest.fn();
    const scrollRef = { current: { scrollTo } } as any;
    renderer.create(
      <StickySelectionProvider scrollRef={scrollRef}>
        {null}
      </StickySelectionProvider>,
    );
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
    expect(scrollTo).toHaveBeenCalledWith({ y: 170, animated: false });
  });
});
