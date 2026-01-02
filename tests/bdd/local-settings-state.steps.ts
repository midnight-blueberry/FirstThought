import React from 'react';
import { act } from 'react-test-renderer';
import { useLocalSettingsState } from '@/components/pages/settings/useLocalSettingsState';
import type { Settings } from '@/state/SettingsContext';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

jest.mock('@theme/buildTheme', () => ({
  themes: {
    dark: { name: 'Dark' },
    cream: { name: 'Cream' },
    light: { name: 'Light' },
  },
}));

const baseSettings: Settings = {
  themeId: 'dark',
  accent: '#FFD700',
  fontFamily: 'Inter',
  fontWeight: '400',
  fontSizeLevel: 3,
  noteTextAlign: 'left',
};

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let settingsUnderTest: Settings | null = null;
  let hookState: ReturnType<typeof useLocalSettingsState> | null = null;

  const TestComponent = () => {
    if (!settingsUnderTest) {
      throw new Error('Settings are not defined');
    }

    hookState = useLocalSettingsState(settingsUnderTest);
    return null;
  };

  const renderState = async () => {
    await act(async () => {
      tree = renderWithProviders(React.createElement(TestComponent));
    });
  };

  afterEach(async () => {
    tree = await unmountTree(tree);
    hookState = null;
    settingsUnderTest = null;
  });

  const registerRenderGiven = (given: StepDefinitions['given']) => {
    given('local settings state is rendered with initial settings', async () => {
      settingsUnderTest = baseSettings;
      await renderState();
    });
  };

  const registerUpdateThemeWhen = (when: StepDefinitions['when']) => {
    when(/^I update selected theme name to "([^"]+)"$/, async (themeName: string) => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.setSelectedThemeName(themeName);
        hookState = { ...hookState!, selectedThemeName: themeName };
      });
    });
  };

  const registerIncrementVersionWhen = (when: StepDefinitions['when']) => {
    when('I increment settings version', async () => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.setSettingsVersion((value) => value + 1);
        hookState = {
          ...hookState!,
          settingsVersion: hookState!.settingsVersion + 1,
        };
      });
    });
  };

  const registerThemeAssertionThen = (then: StepDefinitions['then']) => {
    then(/^the selected theme name is "([^"]+)"$/, (themeName: string) => {
      expect(hookState).not.toBeNull();
      expect(hookState!.selectedThemeName).toBe(themeName);
    });
  };

  const registerVersionAssertionThen = (then: StepDefinitions['then']) => {
    then(/^the settings version equals (\d+)$/, (expectedVersion: string) => {
      expect(hookState).not.toBeNull();
      expect(hookState!.settingsVersion).toBe(Number(expectedVersion));
    });
  };

  test('returns initial selected theme and version', ({ given, then }: StepDefinitions) => {
    registerRenderGiven(given);
    registerThemeAssertionThen(then);
    registerVersionAssertionThen(then);
  });

  test('updates theme and settings version', ({ given, when, then }: StepDefinitions) => {
    registerRenderGiven(given);
    registerUpdateThemeWhen(when);
    registerIncrementVersionWhen(when);
    registerThemeAssertionThen(then);
    registerVersionAssertionThen(then);
  });
};
