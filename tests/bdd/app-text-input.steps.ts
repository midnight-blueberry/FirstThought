import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import type { AppTextInputProps } from '@components/ui/atoms/AppTextInput';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { __mock as rnMock } from '../__mocks__/react-native';
import { resolveFont } from '@/constants/fonts/resolve';

let settingsFontFamily = 'Roboto Slab';
let settingsFontWeight = '500';
let appTextInputStyle: AppTextInputProps['style'];

const resolveFontMock = resolveFont as jest.MockedFunction<typeof resolveFont>;

jest.mock('@/state/SettingsContext', () => ({
  useSettings: () => ({
    settings: {
      fontFamily: settingsFontFamily,
      fontWeight: settingsFontWeight,
    },
  }),
}));

jest.mock('@/constants/fonts/resolve', () => ({
  resolveFont: jest.fn((familyKey: string, weight: number) => ({
    key: `font:${familyKey}:${weight}`,
  })),
}));

export default (test: JestCucumberTestFn) => {
  const renderAppTextInput = () => {
    rnMock.views.length = 0;

    const props: AppTextInputProps = {};

    if (appTextInputStyle) {
      props.style = appTextInputStyle;
    }

    const { default: AppTextInput } = require('@components/ui/atoms/AppTextInput');
    ReactDOMServer.renderToStaticMarkup(React.createElement(AppTextInput, props));
  };

  afterEach(() => {
    rnMock.views.length = 0;
    resolveFontMock.mockClear();
    appTextInputStyle = undefined;
  });

  test('AppTextInput uses settings font', ({ given, when, then }: StepDefinitions) => {
    given('settings font family is "Roboto Slab"', () => {
      settingsFontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      settingsFontWeight = '500';
    });

    when('AppTextInput is rendered', () => {
      renderAppTextInput();
    });

    then('resolveFont is called with family key "Roboto_Slab"', () => {
      expect(resolveFontMock).toHaveBeenCalled();
      const [familyKey] = resolveFontMock.mock.calls[0];
      expect(familyKey).toBe('Roboto_Slab');
    });

    then('resolveFont is called with weight 500', () => {
      expect(resolveFontMock).toHaveBeenCalled();
      const [, weight] = resolveFontMock.mock.calls[0];
      expect(weight).toBe(500);
    });

    then('rendered TextInput style has fontFamily "font:Roboto_Slab:500"', () => {
      const textInputView = rnMock.views.find(({ type }) => type === 'TextInput');
      expect(textInputView).toBeDefined();
      const flattened = StyleSheet.flatten(textInputView!.props.style);
      expect(flattened.fontFamily).toBe('font:Roboto_Slab:500');
    });
  });

  test('AppTextInput merges style prop', ({ given, when, then }: StepDefinitions) => {
    given('settings font family is "Roboto Slab"', () => {
      settingsFontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      settingsFontWeight = '500';
    });

    given('AppTextInput style has fontSize 22', () => {
      appTextInputStyle = { fontSize: 22 };
    });

    when('AppTextInput is rendered', () => {
      renderAppTextInput();
    });

    then('rendered TextInput style has fontFamily "font:Roboto_Slab:500"', () => {
      const textInputView = rnMock.views.find(({ type }) => type === 'TextInput');
      expect(textInputView).toBeDefined();
      const flattened = StyleSheet.flatten(textInputView!.props.style);
      expect(flattened.fontFamily).toBe('font:Roboto_Slab:500');
    });

    then('rendered TextInput style has fontSize 22', () => {
      const textInputView = rnMock.views.find(({ type }) => type === 'TextInput');
      expect(textInputView).toBeDefined();
      const flattened = StyleSheet.flatten(textInputView!.props.style);
      expect(flattened.fontSize).toBe(22);
    });
  });
};
