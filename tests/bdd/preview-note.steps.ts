import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { __mock as rnMock } from '../__mocks__/react-native';
import { resolveFont } from '@/constants/fonts/resolve';

const themeMock = {
  margin: { medium: 12, large: 16 },
  borderWidth: { medium: 2 },
  borderRadius: 8,
  padding: { medium: 10 },
};

let settingsFontFamily = 'Roboto Slab';
let settingsFontWeight = '500';
let noteTextAlign: 'justify' | 'left' | 'center' | 'right' = 'justify';
let accentColor = '#00FF00';

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
  const renderPreviewNote = () => {
    rnMock.views.length = 0;
    const { default: PreviewNote } = require('@components/ui/organisms/preview-note');

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(PreviewNote, {
        noteTextAlign,
        colors: { accent: accentColor },
      }),
    );
  };

  afterEach(() => {
    rnMock.views.length = 0;
    resolveFontMock.mockClear();
    settingsFontFamily = 'Roboto Slab';
    settingsFontWeight = '500';
    noteTextAlign = 'justify';
    accentColor = '#00FF00';
  });

  test(
    'PreviewNote resolves font and applies align and accent styles',
    ({ given, when, then }: StepDefinitions) => {
      given('settings font family is "Roboto Slab" for PreviewNote', () => {
        settingsFontFamily = 'Roboto Slab';
      });

      given('settings font weight is "500" for PreviewNote', () => {
        settingsFontWeight = '500';
      });

      when('PreviewNote is rendered with justify align and accent color "#00FF00"', () => {
        noteTextAlign = 'justify';
        accentColor = '#00FF00';
        renderPreviewNote();
      });

      then('resolveFont is called with family key "Roboto_Slab" for PreviewNote', () => {
        expect(resolveFontMock).toHaveBeenCalled();
        const [familyKey] = resolveFontMock.mock.calls[0];
        expect(familyKey).toBe('Roboto_Slab');
      });

      then('resolveFont is called with weight 500 for PreviewNote', () => {
        expect(resolveFontMock).toHaveBeenCalled();
        const [, weight] = resolveFontMock.mock.calls[0];
        expect(weight).toBe(500);
      });

      then('rendered preview text style includes justify alignment and resolved font family', () => {
        const textView = rnMock.views.find(({ type }) => type === 'Text');
        expect(textView).toBeDefined();
        const flattened = StyleSheet.flatten(textView!.props.style);
        expect(flattened.textAlign).toBe('justify');
        expect(flattened.fontFamily).toBe('font:Roboto_Slab:500');
      });

      then('preview container style includes border color "#00FF00"', () => {
        const containerView = rnMock.views.find(({ type, props }) => {
          if (type !== 'View') {
            return false;
          }

          const flattened = StyleSheet.flatten(props.style);
          return flattened?.borderColor !== undefined;
        });

        expect(containerView).toBeDefined();
        const flattened = StyleSheet.flatten(containerView!.props.style);
        expect(flattened.borderColor).toBe('#00FF00');
      });
    },
  );
};
