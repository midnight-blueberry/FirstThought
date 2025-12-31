import { clampLevel, resolveOverlayColor } from '@utils/theme';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type ThemeList = { name: string; colors: { background: string } }[];

export default (test: JestCucumberTestFn) => {
  test('resolveOverlayColor returns colors.background for an exact themeName match', ({ given, when, then }: StepDefinitions) => {
    let themeList: ThemeList = [];
    let result: string | undefined;

    given('a theme list with a theme named "dark" and background "#000000"', () => {
      themeList = [{ name: 'dark', colors: { background: '#000000' } }];
    });

    when('I resolve overlay color for theme "dark"', () => {
      result = resolveOverlayColor('dark', themeList);
    });

    then('the resolved color equals "#000000"', () => {
      expect(result).toBe('#000000');
    });
  });

  test('resolveOverlayColor returns undefined when the theme is not found', ({ given, when, then }: StepDefinitions) => {
    let themeList: ThemeList = [];
    let result: string | undefined;

    given('a theme list with a theme named "light" and background "#ffffff"', () => {
      themeList = [{ name: 'light', colors: { background: '#ffffff' } }];
    });

    when('I resolve overlay color for theme "unknown"', () => {
      result = resolveOverlayColor('unknown', themeList);
    });

    then('the resolved color is undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  test('clampLevel returns min when the number is below the default minimum', ({ given, when, then }: StepDefinitions) => {
    let value = 0;
    let result = 0;

    given('a number "-3"', () => {
      value = Number('-3');
    });

    when('I clamp the level with defaults', () => {
      result = clampLevel(value);
    });

    then('the clamped level equals "1"', () => {
      expect(result).toBe(1);
    });
  });

  test('clampLevel returns max when the number is above the default maximum', ({ given, when, then }: StepDefinitions) => {
    let value = 0;
    let result = 0;

    given('a number "8"', () => {
      value = Number('8');
    });

    when('I clamp the level with defaults', () => {
      result = clampLevel(value);
    });

    then('the clamped level equals "5"', () => {
      expect(result).toBe(5);
    });
  });

  test('clampLevel returns the original number when it is within the default range', ({ given, when, then }: StepDefinitions) => {
    let value = 0;
    let result = 0;

    given('a number "3"', () => {
      value = Number('3');
    });

    when('I clamp the level with defaults', () => {
      result = clampLevel(value);
    });

    then('the clamped level equals "3"', () => {
      expect(result).toBe(3);
    });
  });

  test('clampLevel respects custom min and max bounds', ({ given, when, then }: StepDefinitions) => {
    let value = 0;
    let result = 0;
    let min = 10;
    let max = 20;

    given('a number "5"', () => {
      value = Number('5');
    });

    when('I clamp the level with custom bounds min "10" and max "20"', () => {
      result = clampLevel(value, min, max);
    });

    then('the clamped level equals "10"', () => {
      expect(result).toBe(10);
    });
  });
};
