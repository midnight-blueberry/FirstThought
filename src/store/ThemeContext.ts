import React from 'react';
import type { DefaultTheme } from 'styled-components/native';
import type { SavedSettingsPatch } from '@types';

export type ThemeContextType = {
  themeName: string;
  accent: string;
  fontFamily: string;
  fontWeight: DefaultTheme['fontWeight'];
  setThemeName: (n: string) => void;
  setAccent: (c: string) => void;
  setFontFamily: (f: string) => void;
  setFontWeight: (w: DefaultTheme['fontWeight']) => void;
  setTheme: (patch: SavedSettingsPatch) => void;
};

export const ThemeContext = React.createContext<ThemeContextType | null>(null);
