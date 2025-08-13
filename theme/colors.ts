import { defaultAccentColor } from '@/constants/AccentColors';

const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  accentColor: defaultAccentColor,
  gray: '#999999',
} as const;

export interface ColorTokens {
  basic: string;
  background: string;
  accent: string;
  disabled: string;
}

export const lightColors: ColorTokens = {
  basic: baseColors.black,
  background: baseColors.white,
  accent: baseColors.accentColor,
  disabled: baseColors.gray,
};

export const darkColors: ColorTokens = {
  basic: baseColors.white,
  background: baseColors.black,
  accent: baseColors.accentColor,
  disabled: baseColors.gray,
};
