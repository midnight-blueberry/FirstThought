import useHeaderConfig from '@/hooks/useHeaderConfig';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type Theme = {
  iconSize: { medium: number };
  padding: { large: number };
  colors: { headerBackground: string };
};

type HeaderConfig = { height: number; backgroundColor: string };

export default (test: JestCucumberTestFn) => {
  test('calculates header height from theme and top inset', ({ given, when, then }: StepDefinitions) => {
    let theme: Theme = {
      iconSize: { medium: 0 },
      padding: { large: 0 },
      colors: { headerBackground: '' },
    };
    let topInset = 0;
    let result: HeaderConfig = { height: 0, backgroundColor: '' };

    given('a theme with medium icon size 24 and large padding 8', () => {
      theme = {
        iconSize: { medium: 24 },
        padding: { large: 8 },
        colors: { headerBackground: '#000000' },
      };
    });

    given('a top inset of 10', () => {
      topInset = 10;
    });

    when('I build the header config', () => {
      result = useHeaderConfig(theme, topInset);
    });

    then('the header height is 50', () => {
      expect(result.height).toBe(50);
    });
  });

  test('returns header background color from theme', ({ given, when, then }: StepDefinitions) => {
    let theme: Theme = {
      iconSize: { medium: 0 },
      padding: { large: 0 },
      colors: { headerBackground: '' },
    };
    let topInset = 0;
    let result: HeaderConfig = { height: 0, backgroundColor: '' };

    given('a theme header background "#123456"', () => {
      theme = {
        iconSize: { medium: 24 },
        padding: { large: 8 },
        colors: { headerBackground: '#123456' },
      };
    });

    when('I build the header config', () => {
      result = useHeaderConfig(theme, topInset);
    });

    then('the header background color is "#123456"', () => {
      expect(result.backgroundColor).toBe('#123456');
    });
  });
};
