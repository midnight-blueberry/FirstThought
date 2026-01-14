import { buildInputFieldStyles } from '@/components/ui/molecules/input-field.styles';
import { buildTheme } from '@/theme/buildTheme';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { StyleSheet } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

type BuildOptions = {
  size: 'sm' | 'md' | 'lg';
  variant: 'filled' | 'outline' | 'ghost';
  focused: boolean;
  hasError: boolean;
  editable: boolean;
};

const createOptions = (): BuildOptions => ({
  size: 'md',
  variant: 'outline',
  focused: false,
  hasError: false,
  editable: true,
});

export default (test: JestCucumberTestFn) => {
  test('Filled variant uses disabled background and no border', ({ given, when, then }: StepDefinitions) => {
    let theme: DefaultTheme;
    let options: BuildOptions;
    let containerStyles: ReturnType<typeof StyleSheet.flatten>;

    given('a default theme', () => {
      theme = buildTheme();
      options = createOptions();
    });

    given('the input field variant is "filled"', () => {
      options.variant = 'filled';
    });

    when('I build the input field styles', () => {
      const styles = buildInputFieldStyles(theme, options);
      containerStyles = StyleSheet.flatten(styles.container);
    });

    then('the container background color equals the theme disabled color', () => {
      expect(containerStyles.backgroundColor).toBe(theme.colors.disabled);
    });

    then('the container border width equals 0', () => {
      expect(containerStyles.borderWidth).toBe(0);
    });
  });

  test('Outline focused state uses accent border and transparent background', ({ given, when, then }: StepDefinitions) => {
    let theme: DefaultTheme;
    let options: BuildOptions;
    let containerStyles: ReturnType<typeof StyleSheet.flatten>;

    given('a default theme', () => {
      theme = buildTheme();
      options = createOptions();
    });

    given('the input field variant is "outline"', () => {
      options.variant = 'outline';
    });

    given('the input field is focused', () => {
      options.focused = true;
    });

    when('I build the input field styles', () => {
      const styles = buildInputFieldStyles(theme, options);
      containerStyles = StyleSheet.flatten(styles.container);
    });

    then('the container border color equals the theme accent color', () => {
      expect(containerStyles.borderColor).toBe(theme.colors.accent);
    });

    then('the container background color equals transparent', () => {
      expect(containerStyles.backgroundColor).toBe('transparent');
    });
  });

  test('Outline non-editable state uses disabled colors', ({ given, when, then }: StepDefinitions) => {
    let theme: DefaultTheme;
    let options: BuildOptions;
    let containerStyles: ReturnType<typeof StyleSheet.flatten>;

    given('a default theme', () => {
      theme = buildTheme();
      options = createOptions();
    });

    given('the input field variant is "outline"', () => {
      options.variant = 'outline';
    });

    given('the input field is not editable', () => {
      options.editable = false;
    });

    when('I build the input field styles', () => {
      const styles = buildInputFieldStyles(theme, options);
      containerStyles = StyleSheet.flatten(styles.container);
    });

    then('the container background color equals the theme disabled color', () => {
      expect(containerStyles.backgroundColor).toBe(theme.colors.disabled);
    });

    then('the container border color equals the theme disabled color', () => {
      expect(containerStyles.borderColor).toBe(theme.colors.disabled);
    });
  });

  test('Small size uses small metrics', ({ given, when, then }: StepDefinitions) => {
    let theme: DefaultTheme;
    let options: BuildOptions;
    let containerStyles: ReturnType<typeof StyleSheet.flatten>;
    let inputStyles: ReturnType<typeof StyleSheet.flatten>;

    given('a default theme', () => {
      theme = buildTheme();
      options = createOptions();
    });

    given('the input field size is "sm"', () => {
      options.size = 'sm';
    });

    when('I build the input field styles', () => {
      const styles = buildInputFieldStyles(theme, options);
      containerStyles = StyleSheet.flatten(styles.container);
      inputStyles = StyleSheet.flatten(styles.input);
    });

    then('the container height equals the theme small button size', () => {
      expect(containerStyles.height).toBe(theme.buttonSizes.small);
    });

    then('the container horizontal padding equals the theme medium padding', () => {
      expect(containerStyles.paddingHorizontal).toBe(theme.padding.medium);
    });

    then('the input font size equals the theme small font size', () => {
      expect(inputStyles.fontSize).toBe(theme.fontSize.small);
    });
  });
};
