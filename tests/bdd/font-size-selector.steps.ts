import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Animated, StyleSheet } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import FontSizeSelector from '@components/ui/organisms/font-size-selector';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  padding: {
    xlarge: 16,
  },
  margin: {
    small: 4,
    medium: 8,
  },
  iconSize: {
    xsmall: 10,
    small: 14,
    large: 20,
  },
  borderWidth: {
    xsmall: 1,
  },
  borderRadius: 6,
  colors: {
    basic: '#111111',
    accent: '#22AA33',
    control: {
      disabled: {
        fg: '#999999',
      },
    },
  },
  fontSize: {
    medium: 16,
    large: 20,
  },
};

let registerPressSpy: jest.Mock;

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const ReactLocal = require('react');
  const Ionicons = (props: any) =>
    ReactLocal.createElement('span', { 'data-ionicon': props?.name });

  return { __esModule: true, default: Ionicons };
});

jest.mock('@/features/sticky-position', () => ({
  __esModule: true,
  useStickySelection: () => ({ registerPress: registerPressSpy }),
}));

type RenderState = {
  fontSizeLevel: number;
};

export default (test: JestCucumberTestFn) => {
  const renderState: RenderState = { fontSizeLevel: 3 };
  let onIncreaseSpy: jest.Mock;
  let onDecreaseSpy: jest.Mock;
  let order: string[] = [];

  const renderSelector = () => {
    rnMock.views.length = 0;

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(FontSizeSelector, {
        fontSizeLevel: renderState.fontSizeLevel,
        onIncrease: onIncreaseSpy,
        onDecrease: onDecreaseSpy,
        blinkIndex: null,
        blinkAnim: new Animated.Value(0),
      }),
    );
  };

  const getButtons = () => {
    const touchables = rnMock.views.filter(view => view.type === 'TouchableOpacity');
    const decreaseButton = touchables.find(view =>
      StyleSheet.flatten(view.props.style)?.marginRight !== undefined,
    );
    const increaseButton = touchables.find(view =>
      StyleSheet.flatten(view.props.style)?.marginLeft !== undefined,
    );

    if (!decreaseButton || !increaseButton) {
      throw new Error('Expected both decrease and increase buttons');
    }

    return { decreaseButton, increaseButton };
  };

  test(
    'Max font size disables increase button',
    ({ given, when, then }: StepDefinitions) => {
      given('font size level is 5', () => {
        renderState.fontSizeLevel = 5;
      });

      when('FontSizeSelector is rendered', () => {
        registerPressSpy = jest.fn(async () => {
          order.push('registerPress');
        });
        onIncreaseSpy = jest.fn(() => {
          order.push('onIncrease');
        });
        onDecreaseSpy = jest.fn(() => {
          order.push('onDecrease');
        });
        order = [];
        renderSelector();
      });

      then('increase button is disabled', () => {
        const { increaseButton } = getButtons();
        expect(increaseButton.props.disabled).toBe(true);
      });

      then('decrease button is enabled', () => {
        const { decreaseButton } = getButtons();
        expect(decreaseButton.props.disabled).toBe(false);
      });
    },
  );

  test(
    'Pressing buttons registers sticky press before callbacks',
    ({ given, when, then }: StepDefinitions) => {
      given('font size level is 3', () => {
        renderState.fontSizeLevel = 3;
      });

      when('FontSizeSelector is rendered', () => {
        order = [];
        registerPressSpy = jest.fn(async (id: string) => {
          if (id === 'fontSize') {
            order.push('registerPress');
          }
        });
        onIncreaseSpy = jest.fn(() => {
          order.push('onIncrease');
        });
        onDecreaseSpy = jest.fn(() => {
          order.push('onDecrease');
        });
        renderSelector();
      });

      when('increase button is pressed', async () => {
        const { increaseButton } = getButtons();
        order = [];
        increaseButton.props.onPress();
        await Promise.resolve();
        await Promise.resolve();
      });

      then('registerPress is called once with id "fontSize"', () => {
        expect(registerPressSpy).toHaveBeenCalledTimes(1);
        expect(registerPressSpy).toHaveBeenNthCalledWith(1, 'fontSize', expect.anything());
      });

      then('onIncrease is called once after registerPress', () => {
        expect(onIncreaseSpy).toHaveBeenCalledTimes(1);
        expect(order).toEqual(['registerPress', 'onIncrease']);
      });

      when('decrease button is pressed', async () => {
        const { decreaseButton } = getButtons();
        order = [];
        decreaseButton.props.onPress();
        await Promise.resolve();
        await Promise.resolve();
      });

      then('registerPress is called twice with id "fontSize"', () => {
        expect(registerPressSpy).toHaveBeenCalledTimes(2);
        expect(registerPressSpy).toHaveBeenNthCalledWith(2, 'fontSize', expect.anything());
      });

      then('onDecrease is called once after registerPress', () => {
        expect(onDecreaseSpy).toHaveBeenCalledTimes(1);
        expect(order).toEqual(['registerPress', 'onDecrease']);
      });
    },
  );
};
