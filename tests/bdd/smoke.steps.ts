import { buildSettingsPatch } from '@/components/pages/settings/buildSettingsPatch';
import type { Settings } from '@/state/SettingsContext';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { nearestAvailableWeight } from '@constants/fonts/resolve';

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

jest.mock('@constants/fonts/resolve', () => ({ nearestAvailableWeight: jest.fn(() => 700) }));

const mockedThemes = {
  light: { name: 'Светлая' },
  cream: { name: 'Кремовая' },
  dark: { name: 'Темная' },
} as const;

const createBaseSettings = (): {
  current: Settings;
  local: Parameters<typeof buildSettingsPatch>[0];
} => {
  const current = {
    themeId: 'light',
    accent: '#FFD700',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSizeLevel: 3,
    noteTextAlign: 'left',
  } satisfies Settings;

  const local = {
    selectedThemeName: mockedThemes.light.name,
    selectedAccentColor: current.accent,
    selectedFontName: current.fontFamily,
    fontWeight: current.fontWeight,
    fontSizeLevel: current.fontSizeLevel,
    noteTextAlign: current.noteTextAlign,
  } satisfies Parameters<typeof buildSettingsPatch>[0];

  return { current, local };
};

export default (test: JestCucumberTestFn) => {
  const registerBaseSettingsGiven = (
    given: StepDefinitions['given'],
    assignSettings: (settings: ReturnType<typeof createBaseSettings>) => void,
    stepText: Parameters<StepDefinitions['given']>[0],
  ) => {
    given(stepText, () => {
      assignSettings(createBaseSettings());
    });
  };

  test('buildSettingsPatch clamps font size level', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with font size level 3',
    );

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

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with theme id light',
    );

    when('buildSettingsPatch receives local theme name "Темная"', () => {
      local.selectedThemeName = mockedThemes.dark.name;
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { themeId: "dark" }', () => {
      expect(patch).toEqual({ themeId: 'dark' });
    });
  });

  test('buildSettingsPatch updates accent when selectedAccentColor changes', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with accent "#FFD700"',
    );

    when('buildSettingsPatch receives local accent "#00FF00"', () => {
      local.selectedAccentColor = '#00FF00';
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { accent: "#00FF00" }', () => {
      expect(patch).toEqual({ accent: '#00FF00' });
    });
  });

  test('buildSettingsPatch normalizes font weight after font family change', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with font family "Inter" and weight "400"',
    );

    when('buildSettingsPatch receives local font family "Roboto" with weight "400"', () => {
      local.selectedFontName = 'Roboto';
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { fontFamily: "Roboto", fontWeight: "700" }', () => {
      expect(patch).toEqual({ fontFamily: 'Roboto', fontWeight: '700' });
    });
  });

  test('buildSettingsPatch normalizes font weight change for the same font family', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with font family "Inter" and weight "400"',
    );

    when('buildSettingsPatch receives local font weight "500"', () => {
      local.fontWeight = '500';
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { fontWeight: "700" }', () => {
      expect(patch).toEqual({ fontWeight: '700' });
    });
  });

  test('buildSettingsPatch ignores font weight change when normalized weight equals current weight', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with font family "Inter" and weight "400"',
    );

    when('buildSettingsPatch receives local font weight "500"', () => {
      const mocked = nearestAvailableWeight as unknown as jest.Mock;
      mocked.mockReturnValueOnce(400);
      local.fontWeight = '500';
      patch = buildSettingsPatch(local, current);
    });

    then('it returns {}', () => {
      expect(patch).toEqual({});
    });
  });

  test('buildSettingsPatch updates note text align', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with note text align "left"',
    );

    when('buildSettingsPatch receives local note text align "justify"', () => {
      local.noteTextAlign = 'justify';
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { noteTextAlign: "justify" }', () => {
      expect(patch).toEqual({ noteTextAlign: 'justify' });
    });
  });

  test('buildSettingsPatch returns empty patch when no fields change', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'local settings are identical to current settings',
    );

    when('buildSettingsPatch receives the identical settings', () => {
      patch = buildSettingsPatch(local, current);
    });

    then('it returns {}', () => {
      expect(patch).toEqual({});
    });
  });

  test('buildSettingsPatch clamps lower font size level', ({ given, when, then }: StepDefinitions) => {
    let current: Settings;
    let local: Parameters<typeof buildSettingsPatch>[0];
    let patch: Partial<Settings>;

    registerBaseSettingsGiven(
      given,
      ({ current: currentSettings, local: localSettings }) => {
        current = currentSettings;
        local = localSettings;
      },
      'current settings with font size level 3',
    );

    when('buildSettingsPatch receives local font size level 0', () => {
      local.fontSizeLevel = 0;
      patch = buildSettingsPatch(local, current);
    });

    then('it returns { fontSizeLevel: 1 }', () => {
      expect(patch).toEqual({ fontSizeLevel: 1 });
    });
  });
};
