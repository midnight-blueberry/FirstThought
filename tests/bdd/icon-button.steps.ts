import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { __mock as rnMock } from '../__mocks__/react-native';
import IconButton from '@components/ui/atoms/icon-button';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  colors: {
    basic: '#111111',
  },
  iconSize: {
    large: 20,
  },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const Ionicons = (props: any) =>
    React.createElement('span', { 'data-ionicon': props?.name });
  return { __esModule: true, default: Ionicons };
});

type RenderState = {
  disabled: boolean;
};

export default (test: JestCucumberTestFn) => {
  const renderState: RenderState = { disabled: false };
  let setAnchorSpy: jest.Mock;
  let captureBeforeUpdateSpy: jest.Mock;
  let onPressInSpy: jest.Mock;
  let onPressSpy: jest.Mock;
  let order: string[] = [];

  const renderButton = () => {
    rnMock.views.length = 0;
    order = [];
    setAnchorSpy = jest.fn((value: number) => {
      order.push(`setAnchor:${value}`);
    });
    captureBeforeUpdateSpy = jest.fn(() => {
      order.push('captureBeforeUpdate');
    });
    onPressInSpy = jest.fn(() => {
      order.push('onPressIn');
    });
    onPressSpy = jest.fn(() => {
      order.push('onPress');
    });

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        AnchorStableScrollContext.Provider,
        { value: { setAnchor: setAnchorSpy, captureBeforeUpdate: captureBeforeUpdateSpy } },
        React.createElement(IconButton, {
          icon: 'home',
          disabled: renderState.disabled,
          onPressIn: onPressInSpy,
          onPress: onPressSpy,
        }),
      ),
    );
  };

  const getTouchable = () =>
    rnMock.views.find(view => view.type === 'TouchableOpacity');

  test(
    'Press in stores anchor in anchor stable scroll context',
    ({ given, when, then }: StepDefinitions) => {
      given('icon button is rendered with disabled false', () => {
        renderState.disabled = false;
        renderButton();
      });

      when('the icon button receives press in event with current target 123', () => {
        const touchable = getTouchable();
        touchable?.props.onPressIn({ currentTarget: 123 } as any);
      });

      then('anchor stable scroll context setAnchor is called with 123', () => {
        expect(setAnchorSpy).toHaveBeenCalledWith(123);
      });

      then('onPressIn callback is called once', () => {
        expect(onPressInSpy).toHaveBeenCalledTimes(1);
      });

      then('onPressIn callback is called after setAnchor', () => {
        expect(order).toEqual(['setAnchor:123', 'onPressIn']);
      });
    },
  );

  test(
    'Press calls captureBeforeUpdate before onPress callback',
    ({ given, when, then }: StepDefinitions) => {
      given('icon button is rendered with disabled false', () => {
        renderState.disabled = false;
        renderButton();
      });

      when('the icon button is pressed', () => {
        const touchable = getTouchable();
        touchable?.props.onPress();
      });

      then('anchor stable scroll context captureBeforeUpdate is called', () => {
        expect(captureBeforeUpdateSpy).toHaveBeenCalled();
      });

      then('onPress callback is called once', () => {
        expect(onPressSpy).toHaveBeenCalledTimes(1);
      });

      then('onPress callback is called after captureBeforeUpdate', () => {
        expect(order).toEqual(['captureBeforeUpdate', 'onPress']);
      });
    },
  );
};
