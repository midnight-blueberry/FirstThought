import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import DiaryList from '@components/ui/organisms/diary-list';
import { __mock as rnMock } from '../__mocks__/react-native';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  padding: { large: 20, medium: 10, small: 6, xlarge: 16 },
  margin: { medium: 12, large: 16 },
  borderRadius: 8,
  borderWidth: { medium: 4 },
  iconSize: { small: 14 },
  colors: { background: '#FAFAFA', accent: '#AABBCC', basic: '#111111' },
};

let lastIoniconsProps: any;
let lastAppTextProps: any;

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const ReactLocal = require('react');
  const Ionicons = (props: any) => {
    lastIoniconsProps = props;
    return ReactLocal.createElement('span', { 'data-ionicons': props?.name });
  };

  return { __esModule: true, default: Ionicons };
});

jest.mock('@components/ui/atoms', () => {
  const ReactLocal = require('react');
  return {
    __esModule: true,
    AppText: (props: any) => {
      lastAppTextProps = props;
      return ReactLocal.createElement('span', null, props.children);
    },
  };
});

type DiaryItem = {
  id: string;
  icon: string;
  title: string;
};

export default (test: JestCucumberTestFn) => {
  let data: DiaryItem[] = [];
  let style: any;
  let onScroll: jest.Mock | undefined;
  let flatListProps: any;

  const renderDiaryList = () => {
    rnMock.views.length = 0;
    lastIoniconsProps = undefined;
    lastAppTextProps = undefined;

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(DiaryList, {
        data: data as any,
        style,
        onScroll,
      }),
    );

    const flatListView = rnMock.views.find((view) => view.type === 'FlatList');
    if (!flatListView) {
      throw new Error('FlatList was not rendered');
    }
    flatListProps = flatListView.props;
  };

  test(
    'DiaryList renders FlatList props and item layout',
    ({ given, when, then }: StepDefinitions) => {
      given('theme is configured for DiaryList', () => {
        expect(themeMock.padding.large).toBe(20);
      });

      given('DiaryList data contains one diary with id "d1" icon "book" title "My diary"', () => {
        data = [{ id: 'd1', icon: 'book', title: 'My diary' }];
      });

      given('DiaryList style has marginTop 99', () => {
        style = { marginTop: 99 };
      });

      given('onScroll handler is provided', () => {
        onScroll = jest.fn();
      });

      when('DiaryList is rendered', () => {
        renderDiaryList();
      });

      then('FlatList receives the diary data', () => {
        expect(flatListProps.data).toEqual(data);
      });

      then('FlatList content container paddingLeft is 16', () => {
        const flattened = StyleSheet.flatten(flatListProps.contentContainerStyle);
        expect(flattened.paddingLeft).toBe(16);
      });

      then('FlatList content container paddingRight is 16', () => {
        const flattened = StyleSheet.flatten(flatListProps.contentContainerStyle);
        expect(flattened.paddingRight).toBe(16);
      });

      then('FlatList scrollEventThrottle is 16', () => {
        expect(flatListProps.scrollEventThrottle).toBe(16);
      });

      then('FlatList style includes marginTop 99', () => {
        const flattened = StyleSheet.flatten(flatListProps.style);
        expect(flattened.marginTop).toBe(99);
      });

      then('FlatList keyExtractor returns "d1" for the first item', () => {
        expect(flatListProps.keyExtractor(data[0])).toBe('d1');
      });

      when('FlatList renderItem is rendered for the first item', () => {
        const itemElement = flatListProps.renderItem({ item: data[0] });
        rnMock.views.length = 0;
        lastIoniconsProps = undefined;
        lastAppTextProps = undefined;
        ReactDOMServer.renderToStaticMarkup(itemElement);
      });

      then('item container style has flexDirection "row" and alignItems "center"', () => {
        expect(rnMock.views).toHaveLength(1);
        const itemView = rnMock.views[0];
        expect(itemView.type).toBe('View');
        const flattened = StyleSheet.flatten(itemView.props.style);
        expect(flattened.flexDirection).toBe('row');
        expect(flattened.alignItems).toBe('center');
      });

      then(
        'item container style has padding 20 and backgroundColor "#FAFAFA" and borderRadius 8 and borderColor "#AABBCC" and borderWidth 4 and marginBottom 16',
        () => {
          const itemView = rnMock.views[0];
          const flattened = StyleSheet.flatten(itemView.props.style);
          expect(flattened.padding).toBe(20);
          expect(flattened.backgroundColor).toBe('#FAFAFA');
          expect(flattened.borderRadius).toBe(8);
          expect(flattened.borderColor).toBe('#AABBCC');
          expect(flattened.borderWidth).toBe(4);
          expect(flattened.marginBottom).toBe(16);
        },
      );

      then('Ionicons is rendered with name "book" size 14 color "#111111"', () => {
        expect(lastIoniconsProps).toBeDefined();
        expect(lastIoniconsProps.name).toBe('book');
        expect(lastIoniconsProps.size).toBe(14);
        expect(lastIoniconsProps.color).toBe('#111111');
      });

      then('AppText is rendered with color "basic" marginLeft 16 and text "My diary"', () => {
        expect(lastAppTextProps).toBeDefined();
        expect(lastAppTextProps.color).toBe('basic');
        const flattened = StyleSheet.flatten(lastAppTextProps.style);
        expect(flattened.marginLeft).toBe(16);
        expect(lastAppTextProps.children).toBe('My diary');
      });
    },
  );
};
