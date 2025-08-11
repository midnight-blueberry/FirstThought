const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  yellow: '#FFCD00',
  gray: '#CCCCCC',
} as const;

export const lightColors = {
  primary: baseColors.yellow,
  primaryText: baseColors.black,
  secondary: baseColors.black,
  secondaryText: baseColors.white,
  background: baseColors.white,
  text: baseColors.black,
  disabled: baseColors.gray,
  disabledText: baseColors.gray,
} as const;

export const darkColors = {
  primary: baseColors.yellow,
  primaryText: baseColors.black,
  secondary: baseColors.black,
  secondaryText: baseColors.yellow,
  background: baseColors.black,
  text: baseColors.yellow,
  disabled: baseColors.gray,
  disabledText: baseColors.gray,
} as const;

export type ColorTokens = typeof lightColors;
