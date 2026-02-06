import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import AppText from '@components/ui/atoms/AppText';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { __mock as rnMock } from '../__mocks__/react-native';
import { resolveFont } from '@/constants/fonts/resolve';

const themeMock = {
  colors: { basic: '#111111' },
  fontSize: { medium: 18 },
};

let settingsFontFamily = 'Roboto Slab';
let settingsFontWeight = '500';
let propFontFamily: string | undefined;
let propFontWeight: string | undefined;

const resolveFontMock = resolveFont as jest.MockedFunction<typeof resolveFont>;

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

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
  const renderAppText = () => {
    rnMock.views.length = 0;

    const props: React.ComponentProps<typeof AppText> = {
      children: 'Sample',
    };

    if (propFontFamily) {
      props.fontFamily = propFontFamily;
    }

    if (propFontWeight) {
      props.fontWeight = propFontWeight;
    }

    ReactDOMServer.renderToStaticMarkup(React.createElement(AppText, props));
  };

  afterEach(() => {
    rnMock.views.length = 0;
    resolveFontMock.mockClear();
    propFontFamily = undefined;
    propFontWeight = undefined;
  });

  test('AppText uses settings font and theme styles', ({ given, when, then }: StepDefinitions) => {
    given('settings font family is "Roboto Slab"', () => {
      settingsFontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      settingsFontWeight = '500';
    });

    when('AppText is rendered', () => {
      renderAppText();
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

    then('rendered Text style has fontFamily "font:Roboto_Slab:500"', () => {
      const textView = rnMock.views.find(({ type }) => type === 'Text');
      expect(textView).toBeDefined();
      const flattened = StyleSheet.flatten(textView!.props.style);
      expect(flattened.fontFamily).toBe('font:Roboto_Slab:500');
    });

    then('rendered Text style has color "#111111"', () => {
      const textView = rnMock.views.find(({ type }) => type === 'Text');
      expect(textView).toBeDefined();
      const flattened = StyleSheet.flatten(textView!.props.style);
      expect(flattened.color).toBe('#111111');
    });

    then('rendered Text style has fontSize 18', () => {
      const textView = rnMock.views.find(({ type }) => type === 'Text');
      expect(textView).toBeDefined();
      const flattened = StyleSheet.flatten(textView!.props.style);
      expect(flattened.fontSize).toBe(18);
    });
  });

  test('AppText props override settings', ({ given, when, then }: StepDefinitions) => {
    given('settings font family is "Roboto Slab"', () => {
      settingsFontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      settingsFontWeight = '500';
    });

    given('AppText prop font family is "Nata Sans"', () => {
      propFontFamily = 'Nata Sans';
    });

    given('AppText prop font weight is "700"', () => {
      propFontWeight = '700';
    });

    when('AppText is rendered', () => {
      renderAppText();
    });

    then('resolveFont is called with family key "Nata_Sans"', () => {
      expect(resolveFontMock).toHaveBeenCalled();
      const [familyKey] = resolveFontMock.mock.calls[0];
      expect(familyKey).toBe('Nata_Sans');
    });

    then('resolveFont is called with weight 700', () => {
      expect(resolveFontMock).toHaveBeenCalled();
      const [, weight] = resolveFontMock.mock.calls[0];
      expect(weight).toBe(700);
    });

    then('rendered Text style has fontFamily "font:Nata_Sans:700"', () => {
      const textView = rnMock.views.find(({ type }) => type === 'Text');
      expect(textView).toBeDefined();
      const flattened = StyleSheet.flatten(textView!.props.style);
      expect(flattened.fontFamily).toBe('font:Nata_Sans:700');
    });
  });
};
