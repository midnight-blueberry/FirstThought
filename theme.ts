import React from "react";

export interface AppColors {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface AppSizes {
  fontSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  iconSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  buttonSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

const calmBlueTheme = {
  name:       "Спокойная синяя",
  primary:    "#4A90E2",
  secondary:  "#7ED321",
  background: "#F0F4F8",
  text:       "#2C3E50",
};

const softGreenTheme = {
  name:       "Светло-зеленая",
  primary:    "#6DBE9E",
  secondary:  "#FFC47E",
  background: "#F4FBF8",
  text:       "#34495E",
};

const lavenderTheme = {
  name:       "Лавандовая",
  primary:    "#9B9BFF",
  secondary:  "#FFB3C1",
  background: "#F5F3FF",
  text:       "#2F2F2F",
};

const warmBeigeTheme = {
  name:       "Теплая бежевая",
  primary:    "#D8CAB8",
  secondary:  "#FF6F61",
  background: "#F9F7F3",
  text:       "#3B3B3B",
};

// Экспорт всех тем
export const themes = [
  calmBlueTheme,
  softGreenTheme,
  lavenderTheme,
  warmBeigeTheme,
];

export const defaultSizes: AppSizes = {
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
  iconSizes: {
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
};

export const ColorsContext = React.createContext<{
  colors: AppColors;
  setColors: (t: AppColors) => void;
}>({
  colors: themes[0],
  setColors: () => {},
});

export const SizesContext = React.createContext<{
  sizes: AppSizes;
  setSizes: (t: AppSizes) => void;
}>({
  sizes: defaultSizes,
  setSizes: () => {},
});