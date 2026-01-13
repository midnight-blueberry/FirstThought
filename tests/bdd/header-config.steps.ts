import useHeaderConfig from '@/hooks/useHeaderConfig';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { lightColors, sizes } from '@constants/theme';
import { headerTypography } from '@theme/tokens/typography';
import { DefaultTheme } from 'styled-components/native';

type HeaderConfig = { height: number; backgroundColor: string };

const baseTheme: DefaultTheme = {
  name: 'Test',
  colors: lightColors,
  ...sizes,
  fontName: 'Test',
  fontWeight: '500',
  noteTextAlign: 'left',
  barStyle: 'dark-content',
  isDark: false,
  headerShadowVisible: false,
  typography: { header: headerTypography },
};

export default (test: JestCucumberTestFn) => {
  test('calculates header height from theme and top inset', ({ given, when, then }: StepDefinitions) => {
    let theme: DefaultTheme = baseTheme;
    let topInset = 0;
    let result: HeaderConfig = { height: 0, backgroundColor: '' };

    given('a theme with medium icon size 24 and large padding 8', () => {
      theme = {
        ...baseTheme,
        iconSize: { ...baseTheme.iconSize, medium: 24 },
        padding: { ...baseTheme.padding, large: 8 },
        colors: { ...baseTheme.colors, headerBackground: '#000000' },
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
    let theme: DefaultTheme = baseTheme;
    let topInset = 0;
    let result: HeaderConfig = { height: 0, backgroundColor: '' };

    given('a theme header background "#123456"', () => {
      theme = {
        ...baseTheme,
        iconSize: { ...baseTheme.iconSize, medium: 24 },
        padding: { ...baseTheme.padding, large: 8 },
        colors: { ...baseTheme.colors, headerBackground: '#123456' },
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
