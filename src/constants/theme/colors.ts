import { defaultAccentColor } from '@constants/AccentColors';

const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  accentColor: defaultAccentColor,
  grayLight: '#C8C8C8',
  grayDark: '#5A5A5A',
  cream: '#FFF8E1',
} as const;

export interface ColorTokens {
  basic: string;
  background: string;
  accent: string;
  disabled: string;
  onBasic: string;
  onBackground: string;
  onAccent: string;
  onDisabled: string;
  headerBackground: string;
  headerForeground: string;
}

export const lightColors: ColorTokens = {
  basic: baseColors.black,
  background: baseColors.white,
  accent: baseColors.accentColor,
  disabled: baseColors.grayLight,
  onBasic: baseColors.white,
  onBackground: baseColors.black,
  onAccent: baseColors.black,
  onDisabled: baseColors.grayDark,
  headerBackground: baseColors.white,
  headerForeground: baseColors.black,
};

export const darkColors: ColorTokens = {
  basic: baseColors.white,
  background: baseColors.black,
  accent: baseColors.accentColor,
  disabled: baseColors.grayDark,
  onBasic: baseColors.black,
  onBackground: baseColors.white,
  onAccent: baseColors.black,
  onDisabled: baseColors.grayLight,
  headerBackground: baseColors.black,
  headerForeground: baseColors.white,
};

export const creamColors: ColorTokens = {
  basic: baseColors.black,
  background: baseColors.cream,
  accent: baseColors.accentColor,
  disabled: baseColors.grayLight,
  onBasic: baseColors.white,
  onBackground: baseColors.black,
  onAccent: baseColors.black,
  onDisabled: baseColors.grayDark,
  headerBackground: baseColors.cream,
  headerForeground: baseColors.black,
};
