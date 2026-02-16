import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet, type ViewStyle } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import PageContainer from '@components/common/PageContainer';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

jest.mock('@hooks/useTheme', () =>
  jest.fn(() => ({
    colors: {
      background: '#123456',
    },
  })),
);

export default (test: JestCucumberTestFn) => {
  const renderPageContainer = (style?: React.ComponentProps<typeof PageContainer>['style']) => {
    rnMock.views.length = 0;

    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(PageContainer, {
        style,
        children: React.createElement('span', null, 'Child'),
      }),
    );
  };

  const getContainerStyle = (): ViewStyle => {
    const containerView = rnMock.views.find(({ type }) => type === 'View');
    expect(containerView).toBeDefined();

    return StyleSheet.flatten<ViewStyle>(containerView!.props.style as any);
  };

  test('PageContainer uses theme background color and default flex', ({ given, then }: StepDefinitions) => {
    let style: ViewStyle | undefined;
    let markup = '';

    given('PageContainer is rendered without custom style', () => {
      markup = renderPageContainer();
      style = getContainerStyle();
    });

    then('the container background color equals "#123456"', () => {
      expect(style?.backgroundColor).toBe('#123456');
    });

    then('the container flex equals 1', () => {
      expect(style?.flex).toBe(1);
    });

    then('the rendered markup contains "Child"', () => {
      expect(markup).toContain('Child');
    });
  });

  test('PageContainer merges custom style and allows overriding background', ({ given, then }: StepDefinitions) => {
    let style: ViewStyle | undefined;

    given('PageContainer is rendered with style background "#ABCDEF" and padding 10', () => {
      renderPageContainer({ backgroundColor: '#ABCDEF', padding: 10 });
      style = getContainerStyle();
    });

    then('the container background color equals "#ABCDEF"', () => {
      expect(style?.backgroundColor).toBe('#ABCDEF');
    });

    then('the container padding equals 10', () => {
      expect(style?.padding).toBe(10);
    });

    then('the container flex equals 1', () => {
      expect(style?.flex).toBe(1);
    });
  });
};
