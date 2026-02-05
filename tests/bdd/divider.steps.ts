import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import Divider from '@components/ui/atoms/divider';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  borderWidth: { small: 2, medium: 4 },
  margin: { medium: 12 },
  colors: { basic: '#111111' },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

type DividerStyle = ReturnType<typeof StyleSheet.flatten>;

export default (test: JestCucumberTestFn) => {
  const renderDivider = (style?: React.ComponentProps<typeof Divider>['style']) => {
    rnMock.views.length = 0;

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(Divider, {
        style,
      }),
    );
  };

  const getDividerStyle = (): DividerStyle => {
    const view = rnMock.views.find(({ type }) => type === 'View');
    expect(view).toBeDefined();
    return StyleSheet.flatten(view?.props.style);
  };

  test('renders default divider styles', ({ given, then }: StepDefinitions) => {
    let style: DividerStyle | null = null;

    given('the divider is rendered without custom style', () => {
      renderDivider();
      style = getDividerStyle();
    });

    then('the divider style has height 2', () => {
      expect(style?.height).toBe(2);
    });

    then('the divider style has background color "#111111"', () => {
      expect(style?.backgroundColor).toBe('#111111');
    });

    then('the divider style has alignSelf "stretch"', () => {
      expect(style?.alignSelf).toBe('stretch');
    });

    then('the divider style has marginBottom 12', () => {
      expect(style?.marginBottom).toBe(12);
    });

    then('the divider style has borderRadius 2', () => {
      expect(style?.borderRadius).toBe(2);
    });
  });

  test('applies custom style overrides', ({ given, then }: StepDefinitions) => {
    let style: DividerStyle | null = null;

    given('the divider is rendered with custom style', () => {
      renderDivider({ marginBottom: 123, backgroundColor: '#ABCDEF' });
      style = getDividerStyle();
    });

    then('the divider style has marginBottom 123', () => {
      expect(style?.marginBottom).toBe(123);
    });

    then('the divider style has background color "#ABCDEF"', () => {
      expect(style?.backgroundColor).toBe('#ABCDEF');
    });

    then('the divider style keeps height 2', () => {
      expect(style?.height).toBe(2);
    });
  });
};
