import React from 'react';
import { useSettingsHandlers } from '@/components/pages/settings/useSettingsHandlers';
import type { SettingsHandlers } from '@/components/pages/settings/useSettingsHandlers';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let handlers: SettingsHandlers | null = null;
  let deps: Parameters<typeof useSettingsHandlers>[0] | null = null;

  let setSelectedThemeName!: jest.Mock;
  let setSelectedAccentColor!: jest.Mock;
  let setSelectedFontName!: jest.Mock;
  let setFontWeightState!: jest.Mock;
  let setFontSizeLevel!: jest.Mock;
  let setNoteTextAlign!: jest.Mock;
  let setSettingsVersionMock: jest.Mock | undefined;

  const TestComponent = () => {
    if (!deps) {
      throw new Error('Dependencies are not set');
    }

    handlers = useSettingsHandlers(deps);
    return null;
  };

  const renderHandlers = () => {
    tree = renderWithProviders(React.createElement(TestComponent));
  };

  afterEach(async () => {
    tree = await unmountTree(tree);
    handlers = null;
    deps = null;
    setSettingsVersionMock = undefined;
  });

  const registerRenderWithUpdaterGiven = (given: StepDefinitions['given']) => {
    given('settings handlers are rendered with a settings version updater', () => {
      setSelectedThemeName = jest.fn();
      setSelectedAccentColor = jest.fn();
      setSelectedFontName = jest.fn();
      setFontWeightState = jest.fn();
      setFontSizeLevel = jest.fn();
      setNoteTextAlign = jest.fn();
      setSettingsVersionMock = jest.fn();

      deps = {
        setSelectedThemeName,
        setSelectedAccentColor,
        setSelectedFontName,
        setFontWeightState,
        setFontSizeLevel,
        setNoteTextAlign,
        setSettingsVersion: setSettingsVersionMock,
      };

      renderHandlers();
    });
  };

  const registerRenderWithoutUpdaterGiven = (given: StepDefinitions['given']) => {
    given('settings handlers are rendered without a settings version updater', () => {
      setSelectedThemeName = jest.fn();
      setSelectedAccentColor = jest.fn();
      setSelectedFontName = jest.fn();
      setFontWeightState = jest.fn();
      setFontSizeLevel = jest.fn();
      setNoteTextAlign = jest.fn();
      setSettingsVersionMock = jest.fn();

      deps = {
        setSelectedThemeName,
        setSelectedAccentColor,
        setSelectedFontName,
        setFontWeightState,
        setFontSizeLevel,
        setNoteTextAlign,
      };

      renderHandlers();
    });
  };

  const registerSelectThemeWhen = (when: StepDefinitions['when']) => {
    when(/^I select the theme "([^"]+)"$/, (themeName: string) => {
      expect(handlers).not.toBeNull();
      handlers!.onSelectTheme(themeName as any);
    });
  };

  const registerSelectAccentWhen = (when: StepDefinitions['when']) => {
    when(/^I select the accent "([^"]+)"$/, (accent: string) => {
      expect(handlers).not.toBeNull();
      handlers!.onSelectAccent(accent);
    });
  };

  const registerThemeSelectedThen = (then: StepDefinitions['then']) => {
    then(/^setSelectedThemeName is called with "([^"]+)"$/, (themeName: string) => {
      expect(setSelectedThemeName).toHaveBeenCalledWith(themeName);
    });
  };

  const registerVersionIncrementThen = (then: StepDefinitions['then']) => {
    then('the settings version updater increases the value by one', () => {
      expect(setSettingsVersionMock).toHaveBeenCalledTimes(1);
      const updater = setSettingsVersionMock!.mock.calls[0][0] as (value: number) => number;
      expect(updater(1)).toBe(2);
    });
  };

  const registerAccentSelectedThen = (then: StepDefinitions['then']) => {
    then(/^setSelectedAccentColor is called with "([^"]+)"$/, (accent: string) => {
      expect(setSelectedAccentColor).toHaveBeenCalledWith(accent);
    });
  };

  const registerVersionNotCalledThen = (then: StepDefinitions['then']) => {
    then('setSettingsVersion is not invoked', () => {
      expect(setSettingsVersionMock).not.toHaveBeenCalled();
    });
  };

  test(
    'selecting a theme increments settings version when updater exists',
    ({ given, when, then }: StepDefinitions) => {
      registerRenderWithUpdaterGiven(given);
      registerSelectThemeWhen(when);
      registerThemeSelectedThen(then);
      registerVersionIncrementThen(then);
    },
  );

  test('selecting accent skips version bump when updater is missing', ({ given, when, then }: StepDefinitions) => {
    registerRenderWithoutUpdaterGiven(given);
    registerSelectAccentWhen(when);
    registerAccentSelectedThen(then);
    registerVersionNotCalledThen(then);
  });
};
