const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  accentColor: '#F2C94C',
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
  primary: baseColors.accentColor,
  primaryText: baseColors.black,
  secondary: baseColors.black,
  secondaryText: baseColors.white,
  background: baseColors.white,
  text: baseColors.black,
  disabled: baseColors.gray,
  disabledText: baseColors.gray,
};

export const darkColors: ColorTokens = {
  primary: baseColors.accentColor,
  primaryText: baseColors.black,
  secondary: baseColors.black,
  secondaryText: baseColors.accentColor,
  background: baseColors.black,
  text: baseColors.accentColor,
  disabled: baseColors.gray,
  disabledText: baseColors.gray,
};
