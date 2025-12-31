jest.mock('@constants/fonts/files', () => ({
  FONT_FILES: {
    Comfortaa: {
      400: 'Comfortaa-400.ttf',
      500: 'Comfortaa-500.ttf',
    },
  },
}));

import { buildTheme } from '@/theme/buildTheme';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import type { SavedSettings } from '@types';
import type { DefaultTheme } from 'styled-components/native';

export default (test: JestCucumberTestFn) => {
  test('Falls back to light theme for unknown saved theme', ({ given, when, then }: StepDefinitions) => {
    let saved: SavedSettings | undefined;
    let theme: DefaultTheme;

    given('saved settings with unknown theme name', () => {
      saved = { themeName: 'Unknown' };
    });

    when('I build the theme', () => {
      theme = buildTheme(saved);
    });

    then('the theme name equals "Светлая"', () => {
      expect(theme.name).toBe('Светлая');
    });
  });

  test('Applies saved accent color', ({ given, when, then }: StepDefinitions) => {
    let saved: SavedSettings | undefined;
    let theme: DefaultTheme;

    given('saved settings with accent color "#123456"', () => {
      saved = { accentColor: '#123456', themeName: 'Светлая' };
    });

    when('I build the theme', () => {
      theme = buildTheme(saved);
    });

    then('the theme accent color equals "#123456"', () => {
      expect(theme.colors.accent).toBe('#123456');
    });
  });

  test('Clamps font size level to maximum and applies deltas', ({ given, when, then }: StepDefinitions) => {
    let saved: SavedSettings | undefined;
    let theme: DefaultTheme;

    given('saved settings with font size level 999', () => {
      saved = { fontSizeLevel: 999 };
    });

    when('I build the theme', () => {
      theme = buildTheme(saved);
    });

    then('the theme has medium font size 22', () => {
      expect(theme.fontSize.medium).toBe(22);
    });

    then('the theme has medium padding 10', () => {
      expect(theme.padding.medium).toBe(10);
    });

    then('the theme has medium margin 10', () => {
      expect(theme.margin.medium).toBe(10);
    });
  });
};
