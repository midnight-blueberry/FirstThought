import React from 'react';
import { act } from 'react-test-renderer';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { setItem, getItem, removeItem, reset } from '@tests/mocks/asyncStorageMock';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

jest.mock('@react-native-async-storage/async-storage', () => require('@tests/mocks/asyncStorageMock'));

const settingsContext = require('@/state/SettingsContext') as typeof import('@/state/SettingsContext');
const { SettingsProvider, useSettings } = settingsContext;

type Settings = import('@/state/SettingsContext').Settings;

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let settingsApi: ReturnType<typeof useSettings> | null = null;
  let lastResult: Settings | null = null;

  const setItemMock = setItem as jest.Mock;
  const getItemMock = getItem as jest.Mock;
  const removeItemMock = removeItem as jest.Mock;
  const resetStorage = reset;

  const TestConsumer = () => {
    settingsApi = useSettings();
    return null;
  };

  const renderSettings = () => {
    tree = renderWithProviders(
      React.createElement(
        SettingsProvider,
        null,
        React.createElement(TestConsumer),
      ),
    );
  };

  beforeEach(() => {
    resetStorage();
    setItemMock.mockClear();
    getItemMock.mockClear();
    removeItemMock.mockClear();
    lastResult = null;
  });

  afterEach(async () => {
    tree = await unmountTree(tree);
    settingsApi = null;
  });

  const registerRenderedGiven = (given: StepDefinitions['given']) => {
    given('settings context is rendered', () => {
      renderSettings();
    });
  };

  const registerUpdateSettingsWhen = (when: StepDefinitions['when']) => {
    when(
      /^I update settings with accent "([^"]+)" and font size level (\d+)$/,
      async (accent: string, fontSizeLevel: string) => {
        expect(settingsApi).not.toBeNull();
        await act(async () => {
          lastResult = settingsApi!.updateSettings({
            accent,
            fontSizeLevel: Number(fontSizeLevel),
          });
        });
      },
    );
  };

  const registerSetFontFamilyWhen = (when: StepDefinitions['when']) => {
    when(/^I set font family to "([^"]+)"$/, async (family: string) => {
      expect(settingsApi).not.toBeNull();
      await act(async () => {
        lastResult = settingsApi!.setFontFamily(family);
      });
    });
  };

  const registerSetFontWeightWhen = (when: StepDefinitions['when']) => {
    when(/^I set font weight to (\d+)$/, async (weight: string) => {
      expect(settingsApi).not.toBeNull();
      await act(async () => {
        lastResult = settingsApi!.setFontWeight(Number(weight));
      });
    });
  };

  const registerAccentThen = (then: StepDefinitions['then']) => {
    then(/^returned settings include accent "([^"]+)"$/, (accent: string) => {
      expect(lastResult).not.toBeNull();
      expect(lastResult!.accent).toBe(accent);
      expect(settingsApi).not.toBeNull();
      expect(settingsApi!.settings.accent).toBe(accent);
    });
  };

  const registerFontSizeThen = (then: StepDefinitions['then']) => {
    then(/^returned settings include font size level (\d+)$/, (fontSizeLevel: string) => {
      expect(lastResult).not.toBeNull();
      expect(lastResult!.fontSizeLevel).toBe(Number(fontSizeLevel));
      expect(settingsApi).not.toBeNull();
      expect(settingsApi!.settings.fontSizeLevel).toBe(Number(fontSizeLevel));
    });
  };

  const registerFontFamilyThen = (then: StepDefinitions['then']) => {
    then(/^returned settings include font family "([^"]+)"$/, (family: string) => {
      expect(lastResult).not.toBeNull();
      expect(lastResult!.fontFamily).toBe(family);
      expect(settingsApi).not.toBeNull();
      expect(settingsApi!.settings.fontFamily).toBe(family);
    });
  };

  const registerFontWeightThen = (then: StepDefinitions['then']) => {
    then(/^returned settings include font weight "([^"]+)"$/, (weight: string) => {
      expect(lastResult).not.toBeNull();
      expect(lastResult!.fontWeight).toBe(weight);
      expect(settingsApi).not.toBeNull();
      expect(settingsApi!.settings.fontWeight).toBe(weight);
    });
  };

  const registerStorageThen = (then: StepDefinitions['then']) => {
    then('settings are persisted to storage', () => {
      expect(lastResult).not.toBeNull();
      expect(setItemMock).toHaveBeenCalled();
      const lastCall = setItemMock.mock.calls[setItemMock.mock.calls.length - 1];
      expect(lastCall[0]).toBe('user_settings');
      const parsed = JSON.parse(lastCall[1]);
      expect(parsed).toEqual(lastResult);
    });
  };

  test('updateSettings persists new values', ({ given, when, then }: StepDefinitions) => {
    registerRenderedGiven(given);
    registerUpdateSettingsWhen(when);
    registerAccentThen(then);
    registerFontSizeThen(then);
    registerStorageThen(then);
  });

  test('setFontFamily clamps to the nearest available weight', ({ given, when, then }: StepDefinitions) => {
    registerRenderedGiven(given);
    registerSetFontFamilyWhen(when);
    registerFontFamilyThen(then);
    registerFontWeightThen(then);
    registerStorageThen(then);
  });

  test('setFontWeight clamps to the nearest available weight', ({ given, when, then }: StepDefinitions) => {
    registerRenderedGiven(given);
    registerSetFontWeightWhen(when);
    registerFontWeightThen(then);
    registerStorageThen(then);
  });
};
