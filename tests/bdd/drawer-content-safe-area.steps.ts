import React from 'react';
import renderer from 'react-test-renderer';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type DrawerProps = Record<string, unknown>;

let mockTop = 0;
let mockBottom = 0;
let lastScrollViewProps: DrawerProps | null = null;
let lastItemListProps: DrawerProps | null = null;

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: mockTop,
    bottom: mockBottom,
    left: 0,
    right: 0,
  }),
}));

jest.mock('@react-navigation/drawer', () => {
  const React = require('react');
  return {
    DrawerContentScrollView: (props: DrawerProps) => {
      lastScrollViewProps = props;
      return React.createElement(React.Fragment, null, props.children);
    },
    DrawerItemList: (props: DrawerProps) => {
      lastItemListProps = props;
      return null;
    },
  };
});

const DrawerContent = require('@/navigation/drawer/DrawerContent').default;

export default (test: JestCucumberTestFn) => {
  const defineCommonSteps = ({ given, when, then }: StepDefinitions) => {
    given(/^safe area inset top is (\d+)$/, (value: string) => {
      mockTop = Number(value);
    });

    given(/^safe area inset bottom is (\d+)$/, (value: string) => {
      mockBottom = Number(value);
    });

    when('DrawerContent is rendered', () => {
      lastScrollViewProps = null;
      lastItemListProps = null;
      renderer.create(React.createElement(DrawerContent, { testProp: 'hello' } as any));
    });

    then(/^DrawerContentScrollView has paddingTop (\d+)$/, (value: string) => {
      expect(lastScrollViewProps).not.toBeNull();
      const contentContainerStyle = lastScrollViewProps?.contentContainerStyle as {
        paddingTop?: number;
      };
      expect(contentContainerStyle?.paddingTop).toBe(Number(value));
    });

    then(/^DrawerContentScrollView has paddingBottom (\d+)$/, (value: string) => {
      expect(lastScrollViewProps).not.toBeNull();
      const contentContainerStyle = lastScrollViewProps?.contentContainerStyle as {
        paddingBottom?: number;
      };
      expect(contentContainerStyle?.paddingBottom).toBe(Number(value));
    });
  };

  test('Applies safe area padding and forwards drawer props', ({ given, when, then }: StepDefinitions) => {
    defineCommonSteps({ given, when, then });

    then(/^DrawerItemList receives testProp "([^"]+)"$/, (value: string) => {
      expect(lastItemListProps).not.toBeNull();
      expect(lastItemListProps?.testProp).toBe(value);
    });
  });

  test('Applies zero safe area padding when no insets', ({ given, when, then }: StepDefinitions) => {
    defineCommonSteps({ given, when, then });
  });
};
