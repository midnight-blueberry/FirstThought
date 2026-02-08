import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import TextAlignButton from '@components/ui/molecules/text-align-button';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  colors: {
    accent: '#00FF00',
    basic: '#111111',
  },
  borderWidth: { medium: 4 },
  borderRadius: 10,
  padding: { large: 8 },
  iconSize: { large: 20 },
  margin: { small: 6 },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  return {
    __esModule: true,
    TextAlignIcon: (props: any) =>
      React.createElement('span', { 'data-variant': props.variant, style: { color: props.color } }),
  };
});

type RenderState = {
  variant: React.ComponentProps<typeof TextAlignButton>['variant'];
  selected: boolean;
};

export default (test: JestCucumberTestFn) => {
  const renderState: RenderState = { variant: 'left', selected: false };
  let setAnchorSpy: jest.Mock;
  let captureBeforeUpdateSpy: jest.Mock;
  let onPressSpy: jest.Mock;

  const renderButton = () => {
    rnMock.views.length = 0;
    setAnchorSpy = jest.fn();
    captureBeforeUpdateSpy = jest.fn();
    onPressSpy = jest.fn();

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        AnchorStableScrollContext.Provider,
        { value: { setAnchor: setAnchorSpy, captureBeforeUpdate: captureBeforeUpdateSpy } },
        React.createElement(TextAlignButton, {
          variant: renderState.variant,
          selected: renderState.selected,
          onPress: onPressSpy,
        }),
      ),
    );
  };

  const getTouchable = () =>
    rnMock.views.find(view => view.type === 'TouchableOpacity');

  const getBorderColor = () => {
    const touchable = getTouchable();
    if (!touchable) {
      throw new Error('TouchableOpacity not found');
    }
    return StyleSheet.flatten(touchable.props.style)?.borderColor;
  };

  test(
    'Press in stores anchor in anchor stable scroll context',
    ({ given, when, then }: StepDefinitions) => {
      given('text align button variant is left', () => {
        renderState.variant = 'left';
      });

      given('button is rendered with selected false', () => {
        renderState.selected = false;
        renderButton();
      });

      when('the button receives press in event with current target 123', () => {
        const touchable = getTouchable();
        touchable?.props.onPressIn({ currentTarget: 123 } as any);
      });

      then('anchor stable scroll context setAnchor is called with 123', () => {
        expect(setAnchorSpy).toHaveBeenCalledWith(123);
      });

      then('button border color is "transparent"', () => {
        expect(getBorderColor()).toBe('transparent');
      });
    },
  );

  test(
    'Press calls captureBeforeUpdate and onPress',
    ({ given, when, then }: StepDefinitions) => {
      given('text align button variant is justify', () => {
        renderState.variant = 'justify';
      });

      given('button is rendered with selected true', () => {
        renderState.selected = true;
        renderButton();
      });

      when('the button is pressed', () => {
        const touchable = getTouchable();
        touchable?.props.onPress();
      });

      then('anchor stable scroll context captureBeforeUpdate is called', () => {
        expect(captureBeforeUpdateSpy).toHaveBeenCalled();
      });

      then('onPress callback is called once', () => {
        expect(onPressSpy).toHaveBeenCalledTimes(1);
      });

      then('button border color is "#00FF00"', () => {
        expect(getBorderColor()).toBe('#00FF00');
      });
    },
  );
};
