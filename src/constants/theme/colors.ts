import { defaultAccentColor } from '@constants/AccentColors';

const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  accentColor: defaultAccentColor,
  grayLight: '#888888',
  grayDark: '#BBBBBB',
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
  headerTint: string;
  headerTitle: string;
  control: {
    disabled: {
      fg: string;
      bg: string;
    };
  };
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
  headerTint: baseColors.black,
  headerTitle: baseColors.black,
  control: {
    disabled: {
      fg: '#CCCCCC',
      bg: 'transparent',
    },
  },
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
  headerTint: baseColors.white,
  headerTitle: baseColors.white,
  control: {
    disabled: {
      fg: '#777777',
      bg: 'transparent',
    },
  },
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
  headerTint: baseColors.black,
  headerTitle: baseColors.black,
  control: {
    disabled: {
      fg: '#CCCCCC',
      bg: 'transparent',
    },
  },
};
