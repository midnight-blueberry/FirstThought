import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { getStickySelectionContext } from '@/features/sticky-position';
import { register } from '@/features/sticky-position/registry';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { renderWithProviders } from '@tests/utils/render';

describe('sticky scroll', () => {
  test('keeps scroll offset after theme change', async () => {
    const scrollRef = { current: { scrollTo: jest.fn(), measure: jest.fn() } } as any;

    const List = () => null;

    let tree: any;
    await act(async () => {
      tree = renderWithProviders(<List />, { scrollRef });
    });

    const ctx = getStickySelectionContext();
    expect(ctx).toBeTruthy();

    const pressedRef = { current: { measureInWindow: (cb: any) => cb(0, 190, 0, 20) } } as any;

    await act(async () => {
      await ctx!.registerPress('theme:dark', pressedRef);
    });
    ctx!.onScroll(makeScrollEvent(150));
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
