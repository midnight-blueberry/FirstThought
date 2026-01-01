import React from 'react';
import { useSettingsDirty, type DirtyState } from '@/components/pages/settings/useSettingsDirty';
import type { Settings } from '@/state/SettingsContext';
import type { FontWeight } from '@constants/fonts';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

jest.mock('@theme/buildTheme', () => ({
  themes: {
    light: { name: 'Light', colors: { accent: '#FFFFFF', basic: '#FFFFFF' } },
    cream: { name: 'Cream', colors: { accent: '#EEEEEE', basic: '#EEEEEE' } },
    dark: { name: 'Dark', colors: { accent: '#000000', basic: '#000000' } },
  },
}));

export default (test: JestCucumberTestFn) => {
  let local: Parameters<typeof useSettingsDirty>[0];
  let current: Settings;
  let result: DirtyState | null = null;
  let tree: ReturnType<typeof renderWithProviders> | null = null;

  const TestComponent = () => {
    result = useSettingsDirty(local, current);
    return null;
  };

  const renderHook = () => {
    tree = renderWithProviders(React.createElement(TestComponent));
  };

  afterEach(async () => {
    result = null;
    tree = await unmountTree(tree);
  });

  test('returns clean state when local matches current', ({ given, when, then }: StepDefinitions) => {
    given('matching local and current settings', () => {
      const baseFontWeight = '500' as FontWeight;

      local = {
        selectedThemeName: 'Light',
        selectedAccentColor: '#FFD700',
        selectedFontName: 'Comfortaa',
        fontWeight: baseFontWeight,
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };

      current = {
        themeId: 'light',
        accent: '#FFD700',
        fontFamily: 'Comfortaa',
        fontWeight: baseFontWeight,
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };
    });

    when('the settings dirty hook is rendered', () => {
      renderHook();
    });

    then('the hook reports no dirty state', () => {
      expect(result).not.toBeNull();
      expect(result!.isDirty).toBe(false);
    });

    then('no changed keys are returned', () => {
      expect(result).not.toBeNull();
      expect(result!.changedKeys).toEqual([]);
    });
  });

  test('reports accent change', ({ given, when, then }: StepDefinitions) => {
    given('local settings differ by accent color', () => {
      const baseFontWeight = '500' as FontWeight;

      local = {
        selectedThemeName: 'Light',
        selectedAccentColor: '#00FF00',
        selectedFontName: 'Comfortaa',
        fontWeight: baseFontWeight,
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };

      current = {
        themeId: 'light',
        accent: '#FFD700',
        fontFamily: 'Comfortaa',
        fontWeight: baseFontWeight,
        fontSizeLevel: 3,
        noteTextAlign: 'left',
      };
    });

    when('the settings dirty hook is rendered', () => {
      renderHook();
    });

    then('the hook reports a dirty state', () => {
      expect(result).not.toBeNull();
      expect(result!.isDirty).toBe(true);
    });

    then('the changed keys include only the accent', () => {
      expect(result).not.toBeNull();
      expect(result!.changedKeys).toEqual(['accent']);
    });
  });
};
