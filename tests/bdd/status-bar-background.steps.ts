import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet, ViewStyle } from 'react-native';
import rnMock from '../__mocks__/react-native';
import StatusBarBackground from '@/components/ui/StatusBarBackground';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

let mockTop = 0;
let lastViewStyle: ViewStyle | null = null;

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: mockTop,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock('@hooks/useTheme', () => () => ({
  colors: { headerBackground: '#123456' },
}));

export default (test: JestCucumberTestFn) => {
  const renderStatusBarBackground = () => {
    rnMock.__mock.views.length = 0;
    lastViewStyle = null;

    ReactDOMServer.renderToStaticMarkup(React.createElement(StatusBarBackground));

    const view = rnMock.__mock.views.find(({ type }) => type === 'View');
    if (view) {
      lastViewStyle = StyleSheet.flatten<ViewStyle>(view.props.style as ViewStyle);
    }
  };

  test('hides when safe area top is zero', ({ given, when, then }: StepDefinitions) => {
    given(/^safe area top inset is (\d+)$/, (value: string) => {
      mockTop = Number(value);
    });

    when('StatusBarBackground is rendered', () => {
      renderStatusBarBackground();
    });

    then('no View is rendered', () => {
      expect(rnMock.__mock.views.find(({ type }) => type === 'View')).toBeUndefined();
    });
  });

  test('renders when safe area top is positive', ({ given, when, then }: StepDefinitions) => {
    given(/^safe area top inset is (\d+)$/, (value: string) => {
      mockTop = Number(value);
    });

    when('StatusBarBackground is rendered', () => {
      renderStatusBarBackground();
    });

    then('a View is rendered', () => {
      expect(rnMock.__mock.views.find(({ type }) => type === 'View')).toBeDefined();
      expect(lastViewStyle).not.toBeNull();
    });

    then('the View style has height 24', () => {
      expect(lastViewStyle?.height).toBe(24);
    });

    then('the View style has backgroundColor "#123456"', () => {
      expect(lastViewStyle?.backgroundColor).toBe('#123456');
    });

    then('the View style has position "absolute"', () => {
      expect(lastViewStyle?.position).toBe('absolute');
    });

    then('the View style has top 0', () => {
      expect(lastViewStyle?.top).toBe(0);
    });

    then('the View style has left 0', () => {
      expect(lastViewStyle?.left).toBe(0);
    });

    then('the View style has right 0', () => {
      expect(lastViewStyle?.right).toBe(0);
    });

  });
};
