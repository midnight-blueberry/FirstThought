import React, { useMemo, useState, useEffect, type PropsWithChildren } from 'react';
import { ThemeProvider as StyledThemeProvider, type DefaultTheme } from 'styled-components/native';
import { ThemeContext } from '@store/ThemeContext';
import { buildTheme, themes } from './buildTheme';
import { defaultFontName } from '@constants/fonts';
import type { SavedSettings, SavedSettingsPatch } from '@types';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'react-native';

type Props = PropsWithChildren<{ initial?: SavedSettings | null }>; 

export default function ThemeProvider({ children, initial }: Props) {
  const initialSettings: SavedSettings = {
    themeName: initial?.themeName ?? themes.light.name,
    accentColor: initial?.accentColor ?? themes.light.colors.accent,
    fontName: initial?.fontName ?? defaultFontName,
    fontWeight: initial?.fontWeight ?? '400',
    fontSizeLevel: initial?.fontSizeLevel,
    iconSize: initial?.iconSize,
    noteTextAlign: initial?.noteTextAlign,
  };

  const [settings, setSettings] = useState<SavedSettings>(initialSettings);

  const theme = useMemo(() => buildTheme(settings), [settings]);

  const setThemeName = (n: string) => setSettings(prev => ({ ...prev, themeName: n }));
  const setAccent = (c: string) => setSettings(prev => ({ ...prev, accentColor: c }));
  const setFontFamily = (f: string) => setSettings(prev => ({ ...prev, fontName: f }));
  const setFontWeight = (w: DefaultTheme['fontWeight']) =>
    setSettings(prev => ({ ...prev, fontWeight: w }));
  const applyPatch = (patch: SavedSettingsPatch) =>
    setSettings(prev => ({ ...prev, ...patch }));

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
    StatusBar.setBarStyle(theme.name === themes.dark.name ? 'light-content' : 'dark-content');
  }, [theme]);

  const value = {
    themeName: settings.themeName ?? themes.light.name,
    accent: settings.accentColor ?? themes.light.colors.accent,
    fontFamily: settings.fontName ?? defaultFontName,
    fontWeight: settings.fontWeight ?? '400',
    setThemeName,
    setAccent,
    setFontFamily,
    setFontWeight,
    setTheme: applyPatch,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
