import { buildSettingsPatch } from '@/components/pages/settings/buildSettingsPatch';
import type { Settings } from '@/state/SettingsContext';

jest.mock('@theme/buildTheme', () => ({
  themes: {
    light: { name: 'Светлая' },
    cream: { name: 'Кремовая' },
    dark: { name: 'Темная' },
  },
}));

jest.mock('@constants/fonts/files', () => ({
  FONT_FILES: {
    Inter: { 400: 'inter-400.ttf' },
  },
}));

const mockedThemes = {
  light: { name: 'Светлая' },
  cream: { name: 'Кремовая' },
  dark: { name: 'Темная' },
} as const;

type StepDefinitions = { given: any; when: any; then: any; and?: any };

export default (test: any) => {
  test('buildSettingsPatch clamps font size level', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    given('current settings with font size level 3', () => {
      current = {
        themeId: 'light',
        accent: '#FFD700',
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };

      local = {
        selectedThemeName: mockedThemes.light.name,
        selectedAccentColor: current.accent,
        selectedFontName: current.fontFamily,
        fontWeight: current.fontWeight,
        fontSizeLevel: current.fontSizeLevel,
        noteTextAlign: current.noteTextAlign,
      };
    });

    when('buildSettingsPatch receives local font size level 999', () => {
      local.fontSizeLevel = 999;
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { fontSizeLevel: 5 }', () => {
      expect(patch).toEqual({ fontSizeLevel: 5 });
    });
  });

  test('buildSettingsPatch maps selected theme name to theme id', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    given('current settings with theme id light', () => {
      current = {
        themeId: 'light',
        accent: '#FFD700',
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };

      local = {
        selectedThemeName: mockedThemes.light.name,
        selectedAccentColor: current.accent,
        selectedFontName: current.fontFamily,
        fontWeight: current.fontWeight,
        fontSizeLevel: current.fontSizeLevel,
        noteTextAlign: current.noteTextAlign,
      };
    });

    when('buildSettingsPatch receives local theme name "Темная"', () => {
      local.selectedThemeName = mockedThemes.dark.name;
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { themeId: "dark" }', () => {
      expect(patch).toEqual({ themeId: 'dark' });
    });
  });

  test('buildSettingsPatch returns empty patch when no fields change', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    given('local settings are identical to current settings', () => {
      current = {
        themeId: 'light',
        accent: '#FFD700',
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };

      local = {
        selectedThemeName: mockedThemes.light.name,
        selectedAccentColor: current.accent,
        selectedFontName: current.fontFamily,
        fontWeight: current.fontWeight,
        fontSizeLevel: current.fontSizeLevel,
        noteTextAlign: current.noteTextAlign,
      };
    });

    when('buildSettingsPatch receives the identical settings', () => {
      patch = buildSettingsPatch(local, current);
    });

    then('it returns {}', () => {
      expect(patch).toEqual({});
    });
  });
};
