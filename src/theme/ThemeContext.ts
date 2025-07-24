import React from 'react';
import type { DefaultTheme } from 'styled-components/native';

export type ThemeContextType = {
  setTheme: React.Dispatch<React.SetStateAction<DefaultTheme>>;
};

export const ThemeContext = React.createContext<ThemeContextType | null>(null);