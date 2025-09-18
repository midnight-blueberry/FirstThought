import React from 'react';
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { getStickySelectionContext } from '@/features/sticky-position';
import { register } from '@/features/sticky-position/registry';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';
import { renderWithProviders } from '@tests/utils/render';

const feature = loadFeature('tests/bdd/sticky-position/stickyScroll.feature');

defineFeature(feature, (test: any) => {
  test('Сохраняет смещение прокрутки после смены темы', ({
    given,
    and,
    when,
    then,
  }: any) => {
    let scrollRef: { current: { scrollTo: jest.Mock; measure: jest.Mock } };
    let ctx: ReturnType<typeof getStickySelectionContext> | null = null;
    let tree: ReturnType<typeof renderWithProviders> | null = null;

    given('отрендерен список со scrollRef', async () => {
      scrollRef = {
        current: {
          scrollTo: jest.fn(),
          measure: jest.fn(),
        },
      } as any;
      const List = () => null;

      await act(async () => {
        tree = renderWithProviders(React.createElement(List), { scrollRef });
      });

      ctx = getStickySelectionContext();
      expect(ctx).toBeTruthy();
    });

    and('зафиксирован press по "theme:dark" с измерениями y=190 и h=20', async () => {
      const pressedRef = {
        current: {
          measureInWindow: (cb: any) => cb(0, 190, 0, 20),
        },
      } as any;

      await act(async () => {
        await ctx!.registerPress('theme:dark', pressedRef);
      });
    });

    and('текущая прокрутка равна 150', () => {
      ctx!.onScroll(makeScrollEvent(150));
    });

    when('элемент "theme:dark" после применения измеряется как y=210 и h=20', () => {
      register(
        'theme:dark',
        {
          current: {
            measureInWindow: (cb: any) => cb(0, 210, 0, 20),
          },
        } as any,
      );
    });

    and('я применяю изменения со StickySelection', async () => {
      await act(async () => {
        await ctx!.applyWithSticky(async () => {});
      });
    });

    then('scrollTo был вызван с y=170 и animated=false', () => {
      expect(scrollRef.current.scrollTo).toHaveBeenCalledWith({
        y: 170,
        animated: false,
      });
      tree!.unmount();
    });
  });
});
