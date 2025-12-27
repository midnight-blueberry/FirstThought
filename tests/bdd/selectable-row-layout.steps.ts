import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { StyleSheet } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import SelectableRow from '@components/ui/molecules/selectable-row';

const themeMock = {
  colors: { background: '#ffffff', accent: '#222222', basic: '#111111' },
  padding: { medium: 8, small: 4 },
  margin: { medium: 12, small: 6 },
  iconSize: { large: 24, small: 12 },
  borderWidth: { medium: 1, xsmall: 0.5 },
  borderRadius: 6,
  fontSize: { medium: 16 },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

const appTextMock = jest.fn((props: any) => props);

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  return {
    __esModule: true,
    AppText: (props: any) => {
      appTextMock(props);
      return React.createElement('span', { style: props.style }, props.children);
    },
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  return function Ionicons(props: any) {
    return React.createElement('span', { style: props.style }, props.children);
  };
});

const feature = loadFeature('tests/bdd/selectable-row-layout.feature');

defineFeature(feature, (test) => {
  const renderSelectableRow = (props: Partial<React.ComponentProps<typeof SelectableRow>>) => {
    rnMock.views.length = 0;
    appTextMock.mockClear();

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(SelectableRow, {
        label: 'Example',
        selected: true,
        onPress: () => {},
        ...props,
      }),
    );
  };

  afterEach(() => {
    rnMock.views.length = 0;
    appTextMock.mockClear();
  });

  test('Галочка выровнена по вертикальному центру', ({ given, then }) => {
    given('компонент SelectableRow отрисован', () => {
      renderSelectableRow({ fontSize: 18 });
    });

    then('контейнер галочки имеет top 0 и bottom 0', () => {
      const checkContainer = rnMock.views.find(
        ({ props, type }) =>
          type === 'View' && StyleSheet.flatten(props.style)?.position === 'absolute',
      );

      expect(checkContainer).toBeDefined();
      const flattened = StyleSheet.flatten(checkContainer!.props.style);
      expect(flattened.top).toBe(0);
      expect(flattened.bottom).toBe(0);
    });
  });

  test('Высота текста стабильна без указания fontSize', ({ given, then }) => {
    given('компонент SelectableRow отрисован без fontSize', () => {
      renderSelectableRow({ label: 'No font' });
    });

    then('строка лейбла имеет lineHeight равный размеру шрифта плюс отступ', () => {
      const styleProp = appTextMock.mock.calls[0][0].style;
      const flattened = StyleSheet.flatten(styleProp);

      expect(flattened.lineHeight).toBe(themeMock.fontSize.medium + themeMock.padding.medium);
    });
  });
});
