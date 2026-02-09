let settings = {
  themeId: 'light',
  accent: '#000000',
  fontFamily: 'System',
  fontWeight: 400,
  fontSizeLevel: 3,
  noteTextAlign: 'left',
};

const sentinelTheme = { id: 'sentinel-theme' };
let receivedTheme: unknown;

jest.mock('@/state/SettingsContext', () => ({
  useSettings: () => ({ settings }),
}));

jest.mock('../../src/theme/buildTheme', () => ({
  themes: {
    light: { name: 'Светлая' },
    cream: { name: 'Кремовая' },
    dark: { name: 'Темная' },
  },
  buildTheme: jest.fn(() => sentinelTheme),
}));

jest.mock('styled-components/native', () => ({
  ThemeProvider: ({ theme, children }: { theme: unknown; children: React.ReactNode }) => {
    receivedTheme = theme;
    return children;
  },
}));

import React from 'react';
import renderer from 'react-test-renderer';
import ThemeProvider from '@theme/ThemeProvider';
import { buildTheme, themes } from '../../src/theme/buildTheme';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('Builds a theme from saved settings', ({ given, when, then }: StepDefinitions) => {
    given('themeId is "cream"', () => {
      settings = { ...settings, themeId: 'cream' };
    });

    given('accent is "#123456"', () => {
      settings = { ...settings, accent: '#123456' };
    });

    given('fontFamily is "Inter"', () => {
      settings = { ...settings, fontFamily: 'Inter' };
    });

    given('fontWeight is 500', () => {
      settings = { ...settings, fontWeight: 500 };
    });

    given('fontSizeLevel is 4', () => {
      settings = { ...settings, fontSizeLevel: 4 };
    });

    given('noteTextAlign is "center"', () => {
      settings = { ...settings, noteTextAlign: 'center' };
    });

    when('ThemeProvider is rendered', () => {
      receivedTheme = undefined;
      (buildTheme as jest.Mock).mockClear();
      renderer.create(
        <ThemeProvider>
          <React.Fragment />
        </ThemeProvider>,
      );
    });

    then('buildTheme is called once with mapped saved settings', () => {
      expect(buildTheme).toHaveBeenCalledTimes(1);
      expect(buildTheme).toHaveBeenCalledWith({
        themeName: themes[settings.themeId].name,
        accentColor: settings.accent,
        fontName: settings.fontFamily,
        fontWeight: settings.fontWeight,
        fontSizeLevel: settings.fontSizeLevel,
        noteTextAlign: settings.noteTextAlign,
      });
    });

    then('StyledThemeProvider receives the theme returned by buildTheme', () => {
      expect(receivedTheme).toBe(sentinelTheme);
    });
  });
};
