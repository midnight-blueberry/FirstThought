import React from "react";

export interface AppTheme {
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  fontSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

export const defaultTheme: AppTheme = {
  colors: {
    primary: "#4a90e2",
    background: "#ffffff",
    text: "#333333",
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
};

export const ThemeContext = React.createContext<{
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
});