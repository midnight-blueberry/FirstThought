import React from 'react';
import renderer from 'react-test-renderer';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const mockedInsets = { top: 12, bottom: 24, left: 0, right: 0 };

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => mockedInsets),
}));

jest.mock('@react-navigation/drawer', () => {
  const React = require('react');
  const mockProps = {
    scrollViewProps: null as any,
    itemListProps: null as any,
  };

  const DrawerContentScrollView = (props: any) => {
    mockProps.scrollViewProps = props;
    return React.createElement('DrawerContentScrollView', props, props.children);
  };

  const DrawerItemList = (props: any) => {
    mockProps.itemListProps = props;
    return React.createElement('DrawerItemList', props);
  };

  return {
    DrawerContentScrollView,
    DrawerItemList,
    __mockProps: mockProps,
  };
});

const { __mockProps: drawerMocks } = jest.requireMock('@react-navigation/drawer') as {
  __mockProps: {
    scrollViewProps: any;
    itemListProps: any;
  };
};

const { useSafeAreaInsets } = jest.requireMock('react-native-safe-area-context') as {
  useSafeAreaInsets: jest.Mock;
};

const DrawerContent = require('@/navigation/drawer/DrawerContent').default as typeof import(
  '@/navigation/drawer/DrawerContent'
).default;

export default (test: JestCucumberTestFn) => {
  test('Passes props and insets to drawer components', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    let navigation: any;
    let state: any;
    let descriptors: any;
    let props: any;

    given('safe area insets are mocked', () => {
      expect(useSafeAreaInsets()).toBe(mockedInsets);
    });

    given('drawer navigation props are prepared', () => {
      navigation = { navigate: jest.fn(), dispatch: jest.fn() } as any;
      state = {
        type: 'drawer',
        key: 'drawer-key',
        index: 0,
        routeNames: ['Home'],
        history: [],
        routes: [{ key: 'Home', name: 'Home' }],
        stale: false,
      } as any;
      descriptors = { Home: { key: 'Home', options: {}, navigation, render: jest.fn() } } as any;
      props = { navigation, state, descriptors } as any;
      drawerMocks.scrollViewProps = null;
      drawerMocks.itemListProps = null;
    });

    when('I render DrawerContent', () => {
      renderer.create(React.createElement(DrawerContent, props));
    });

    then('DrawerContentScrollView uses safe area paddings', () => {
      expect(drawerMocks.scrollViewProps).not.toBeNull();
      expect(drawerMocks.scrollViewProps.contentContainerStyle).toMatchObject({
        paddingTop: mockedInsets.top,
        paddingBottom: mockedInsets.bottom,
      });
    });

    then('DrawerContentScrollView receives navigation props', () => {
      expect(drawerMocks.scrollViewProps.navigation).toBe(navigation);
      expect(drawerMocks.scrollViewProps.state).toBe(state);
      expect(drawerMocks.scrollViewProps.descriptors).toBe(descriptors);
    });

    then('DrawerItemList receives navigation props', () => {
      expect(drawerMocks.itemListProps).not.toBeNull();
      expect(drawerMocks.itemListProps.navigation).toBe(navigation);
      expect(drawerMocks.itemListProps.state).toBe(state);
      expect(drawerMocks.itemListProps.descriptors).toBe(descriptors);
    });
  });
};
