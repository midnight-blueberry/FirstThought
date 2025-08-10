import { DefaultTheme } from 'styled-components/native';

const sizes = {
  fontSize: {
    small: 14,
    medium: 18,
    large: 22,
    xlarge: 26,
  },
  iconSize: {
    small: 24,
    medium: 28,
    large: 32,
    xlarge: 36,
  },
  buttonSizes: {
    small: 48,
    medium: 56,
    large: 64,
    xlarge: 72,
  },
  padding: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
  },
  spacing: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
  },
  borderRadius: 8,
};

const lightTheme: DefaultTheme  = {
  name:       "Светлая",
  color: {
    primary:    "#FFCD00",
    primaryText: "#000000",
    secondary:  "#000000",
    secondaryText: "#000000",
    background: "#FFFFFF",
    text:       "#000000",
    disabled: "#CCCCCC",
    disabledText: "#CCCCCC",
  },
  ...sizes
};

const darkTheme: DefaultTheme = {
  name:       "Темная",
  color: {
    primary:    "#FFCD00",
    primaryText: "#000000",
    secondary:  "#FFFFFF",
    secondaryText: "#FFFFFF",
    background: "#000000",
    text:       "#FFFFFF",
    disabled: "#CCCCCC",
    disabledText: "#CCCCCC",
  },
  ...sizes
};

// Экспорт всех тем
export const themes = [
  lightTheme,
  darkTheme
];