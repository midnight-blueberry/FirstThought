import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import SettingRow from '@components/ui/molecules/SettingRow';
import { __mock as rnMock } from '../__mocks__/react-native';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  margin: { small: 6, medium: 12 },
  padding: { small: 4, medium: 8 },
  iconSize: { large: 20 },
  colors: { basic: '#111111' },
  borderWidth: { medium: 2 },
  borderRadius: 10,
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const Ionicons = (props: any) =>
    React.createElement('span', { 'data-ionicon': props?.name });
  return { __esModule: true, default: Ionicons };
});

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    AppText: (props: any) =>
      React.createElement(Text, { style: props.style }, props.children),
  };
});

export default (test: JestCucumberTestFn) => {
  const renderSettingRow = (
    props: Partial<React.ComponentProps<typeof SettingRow>>,
  ) => {
    rnMock.views.length = 0;
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(SettingRow, { title: 'Title', ...props }),
    );
  };

  test('Static setting row renders a View with margin', ({ given, then }: StepDefinitions) => {
    given('SettingRow is rendered without onPress', () => {
      renderSettingRow({});
    });

    then('Root container is a View with small margin bottom', () => {
      const root = rnMock.views[0];
      expect(root.type).toBe('View');
      const flattened = StyleSheet.flatten(root.props.style);
      expect(flattened.marginBottom).toBe(themeMock.margin.small);
    });
  });

  test('Pressable setting row announces button role', ({ given, then }: StepDefinitions) => {
    given('SettingRow is rendered with onPress', () => {
      renderSettingRow({ onPress: () => {} });
    });

    then('Root container is a Pressable with button role', () => {
      const root = rnMock.views[0];
      expect(root.type).toBe('Pressable');
      expect(root.props.accessibilityRole).toBe('button');
    });
  });

  test(
    'Disabled pressable setting row exposes disabled state',
    ({ given, then }: StepDefinitions) => {
      given('SettingRow is rendered with onPress and disabled', () => {
        renderSettingRow({ onPress: () => {}, disabled: true });
      });

      then('Root container is a disabled Pressable with accessibility state', () => {
        const root = rnMock.views[0];
        expect(root.type).toBe('Pressable');
        expect(root.props.disabled).toBe(true);
        expect(root.props.accessibilityState).toEqual({ disabled: true });
      });
    },
  );
};

