import React from 'react';
// @ts-ignore
import renderer from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import SelectableRow from '@components/ui/molecules/selectable-row';

const mockTheme = {
  padding: { medium: 8, small: 4 },
  margin: { medium: 10 },
  iconSize: { large: 24, small: 12 },
  colors: { background: '#fff', accent: '#0f0', basic: '#111' },
  borderWidth: { medium: 1, xsmall: 0.5 },
  borderRadius: 4,
  fontSize: { medium: 16 },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => mockTheme));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  return (props: any) => React.createElement('Ionicons', props);
});

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  const AppText = jest.fn((props: any) => React.createElement('AppText', props, props.children));
  return { AppText, __mockAppText: AppText };
});

const feature = loadFeature('tests/bdd/selectable-row-layout.feature');

const flattenStyle = (style: any) => {
  if (Array.isArray(style)) {
    return style.reduce((acc, item) => {
      if (item && typeof item === 'object') {
        return { ...acc, ...item };
      }
      return acc;
    }, {} as Record<string, any>);
  }
  return style || {};
};

defineFeature(feature, (test) => {
  let tree: renderer.ReactTestRenderer | null = null;

  afterEach(() => {
    if (tree) {
      tree.unmount();
      tree = null;
    }
    jest.clearAllMocks();
  });

  test('Checkmark container is vertically centered', ({ given, then }) => {
    given('a selectable row is rendered', () => {
      tree = renderer.create(
        React.createElement(SelectableRow, {
          label: 'Option',
          selected: true,
          swatchColor: '#000',
          onPress: () => {},
        }),
      );
    });

    then('the absolute positioned checkmark container has top and bottom equal to zero', () => {
      const absoluteViews = tree!.root.findAll((node: any) => {
        if (node.type !== 'View') return false;
        const style = flattenStyle(node.props.style);
        return style.position === 'absolute';
      });

      expect(absoluteViews.length).toBeGreaterThan(0);
      const style = flattenStyle(absoluteViews[0].props.style);
      expect(style.top).toBe(0);
      expect(style.bottom).toBe(0);
    });
  });

  test('Label line height uses default font size when not provided', ({ given, then }) => {
    given('a selectable row is rendered without custom font size', () => {
      tree = renderer.create(
        React.createElement(SelectableRow, {
          label: 'Default size',
          selected: false,
          onPress: () => {},
        }),
      );
    });

    then('the label style uses the medium font size and padding to compute line height', () => {
      const { __mockAppText } = jest.requireMock('@components/ui/atoms');

      expect(__mockAppText).toHaveBeenCalled();
      const call = __mockAppText.mock.calls[0][0];
      const style = flattenStyle(call.style);

      expect(style.lineHeight).toBe(mockTheme.fontSize.medium + mockTheme.padding.medium);
    });
  });
});
