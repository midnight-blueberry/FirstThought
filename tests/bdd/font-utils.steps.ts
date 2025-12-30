import { calcFontSizeLevel, getBaseFontName, nextIconSize, toFamilyKey } from '@/utils/font';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('toFamilyKey strips weight suffix and converts spaces to underscores', ({ given, when, then }: StepDefinitions) => {
    let fontName = '';
    let result = '';

    given('a font name "Bad Script-400-italic"', () => {
      fontName = 'Bad Script-400-italic';
    });

    when('I convert it to a family key', () => {
      result = toFamilyKey(fontName);
    });

    then('it equals "Bad_Script"', () => {
      expect(result).toBe('Bad_Script');
    });
  });

  test('getBaseFontName strips weight suffix and converts underscores to spaces', ({ given, when, then }: StepDefinitions) => {
    let fontName = '';
    let result = '';

    given('a theme font name "Bad_Script-400-italic"', () => {
      fontName = 'Bad_Script-400-italic';
    });

    when('I get the base font name', () => {
      result = getBaseFontName(fontName);
    });

    then('it equals "Bad Script"', () => {
      expect(result).toBe('Bad Script');
    });
  });

  test('calcFontSizeLevel clamps to minimum 1', ({ given, when, then }: StepDefinitions) => {
    let themeSmallPx = 0;
    let defaultFontSize = 16;
    let result: number | null = null;

    given('theme small font size 0 and default font size 16', () => {
      themeSmallPx = 0;
      defaultFontSize = 16;
    });

    when('I calculate the font size level', () => {
      result = calcFontSizeLevel(themeSmallPx, defaultFontSize);
    });

    then('it equals 1', () => {
      expect(result).toBe(1);
    });
  });

  test('nextIconSize increases all icon sizes by 8 at level 5', ({ given, when, then }: StepDefinitions) => {
    let sizes = { xsmall: 1, small: 2, medium: 3, large: 4, xlarge: 5 };
    let result = { xsmall: 0, small: 0, medium: 0, large: 0, xlarge: 0 };

    given('icon sizes xsmall 1 small 2 medium 3 large 4 xlarge 5', () => {
      sizes = { xsmall: 1, small: 2, medium: 3, large: 4, xlarge: 5 };
    });

    when('I apply icon size level 5', () => {
      result = nextIconSize(5, sizes);
    });

    then('icon sizes equal xsmall 9 small 10 medium 11 large 12 xlarge 13', () => {
      expect(result).toEqual({ xsmall: 9, small: 10, medium: 11, large: 12, xlarge: 13 });
    });
  });
};
