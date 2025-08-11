const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  yellow: '#FFCD00',
  gray: '#999999',
} as const;

export interface ColorTokens {
  primary: string;
  primaryText: string;
  secondary: string;
  secondaryText: string;
  background: string;
  text: string;
  disabled: string;
  disabledText: string;
}

export const lightColors: ColorTokens = {
  primary: baseColors.yellow,
  primaryText: baseColors.black,
  secondary: baseColors.black,
  secondaryText: baseColors.white,
  background: baseColors.white,
  text: baseColors.black,
  disabled: baseColors.gray,
  disabledText: baseColors.gray,
};

export const darkColors: ColorTokens = {
  primary: baseColors.yellow,
  primaryText: baseColors.black,
  secondary: baseColors.black,
  secondaryText: baseColors.yellow,
  background: baseColors.black,
  text: baseColors.yellow,
  disabled: baseColors.gray,
  disabledText: baseColors.gray,
};
