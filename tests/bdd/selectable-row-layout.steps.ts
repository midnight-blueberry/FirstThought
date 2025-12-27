import React from 'react';
jest.mock('react-native', () => {
  const React = require('react');
  const actual = jest.requireActual('react-native');

  return {
    ...actual,
    Platform: { OS: 'ios' },
    Text: ({ children }: any) => React.createElement('span', null, children),
    View: ({ children }: any) => React.createElement('div', null, children),
    TouchableOpacity: ({ children }: any) => React.createElement('div', null, children),
  };
});
// @ts-ignore
import renderer, { act } from 'react-test-renderer/cjs/react-test-renderer.development.js';
import { Text } from 'react-native';
import { defineFeature, loadFeature } from 'jest-cucumber';

const mockTheme = {
  fontSize: { medium: 16 },
  padding: { medium: 6, small: 2 },
  margin: { medium: 8, small: 4 },
  iconSize: { large: 24, small: 12 },
  borderWidth: { medium: 1, xsmall: 0.5 },
  colors: { background: '#fff', accent: '#f00', basic: '#000' },
  borderRadius: 4,
};

jest.mock('@hooks/useTheme', () => jest.fn(() => mockTheme));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  return function Ionicons(props: any) {
    return React.createElement('Ionicon', props);
  };
});

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    AppText: (props: any) => React.createElement(Text, props),
  };
});

import SelectableRow from '@components/ui/molecules/selectable-row';

const feature = loadFeature('tests/bdd/selectable-row-layout.feature');

defineFeature(feature, (test) => {
  let tree: renderer.ReactTestRenderer;

  const renderRow = (props?: Partial<React.ComponentProps<typeof SelectableRow>>) => {
    act(() => {
      tree = renderer.create(
        React.createElement(SelectableRow, {
          label: 'Test row',
          selected: true,
          onPress: () => {},
          ...props,
        })
      );
    });
  };

  test('Check icon container vertical alignment', ({ given, then }) => {
    given('a rendered selectable row', () => {
      renderRow();
    });

    then('the absolute positioned container aligns vertically', () => {
      const container = tree.root.find(
        (node: any) => node.props?.style?.position === 'absolute'
      );
      const style = container.props.style;

      expect(style.top).toBe(0);
      expect(style.bottom).toBe(0);
    });
  });

  test('Label line height uses default font size when not provided', ({ given, then }) => {
    given('a rendered selectable row without custom font size', () => {
      renderRow({ fontSize: undefined });
    });

    then('the label uses the default line height value', () => {
      const label = tree.root.findByType(Text);
      const style = label.props.style;
      const mergedStyle = Array.isArray(style)
        ? Object.assign({}, ...style.filter(Boolean))
        : style || {};

      expect(mergedStyle.lineHeight).toBe(
        mockTheme.fontSize.medium + mockTheme.padding.medium
      );
    });
  });

  afterEach(() => {
    tree?.unmount();
  });
});
