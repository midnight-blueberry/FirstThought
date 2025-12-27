import React from 'react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import renderer from 'react-test-renderer';
import { StyleSheet, Text, View } from 'react-native';

const mockTheme = {
  fontSize: { medium: 18 },
  padding: { medium: 8, small: 4 },
  margin: { medium: 12, small: 6 },
  iconSize: { large: 24, small: 12 },
  colors: { background: '#fff', accent: '#0f0', basic: '#111' },
  borderWidth: { medium: 2, xsmall: 1 },
  borderRadius: 6,
};

jest.mock('@hooks/useTheme', () => ({
  __esModule: true,
  default: () => mockTheme,
}));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(Text, props),
  };
});

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    AppText: (props: any) => React.createElement(Text, props),
  };
});

import SelectableRow from '@components/ui/molecules/selectable-row';

const feature = loadFeature('tests/bdd/selectable-row-layout.feature');

defineFeature(feature, (test) => {
  let tree: any = null;

  afterEach(() => {
    if (tree) {
      tree.unmount();
      tree = null;
    }
  });

  test('Checkmark container is vertically centered', ({ given, then }) => {
    given('a selectable row is rendered', () => {
      tree = renderer.create(
        React.createElement(SelectableRow, {
          label: 'Label',
          selected: true,
          onPress: () => {},
        }),
      );
    });

    then('the checkmark container spans the row height', () => {
      const containers = tree!
        .root
        .findAllByType(View)
        .filter((node: any) => StyleSheet.flatten(node.props.style)?.position === 'absolute');

      expect(containers.length).toBeGreaterThan(0);
      containers.forEach((container: any) => {
        const style = StyleSheet.flatten(container.props.style);
        expect(style?.top).toBe(0);
        expect(style?.bottom).toBe(0);
      });
    });
  });

  test('Label uses default line height without explicit font size', ({ given, then }) => {
    given('a selectable row is rendered without custom font size', () => {
      tree = renderer.create(
        React.createElement(SelectableRow, {
          label: 'Default size',
          selected: false,
          onPress: () => {},
        }),
      );
    });

    then('the label line height uses the default theme values', () => {
      const labelNode = tree!
        .root
        .findAllByType(Text)
        .find((node: any) => node.props.children === 'Default size');

      expect(labelNode).toBeDefined();
      const style = StyleSheet.flatten(labelNode!.props.style);

      expect(style?.lineHeight).toBe(mockTheme.fontSize.medium + mockTheme.padding.medium);
      expect(style?.fontSize).toBe(mockTheme.fontSize.medium);
    });
  });
});
