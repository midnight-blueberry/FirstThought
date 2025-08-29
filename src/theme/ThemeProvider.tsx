import React, { useEffect, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { StatusBar } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { useSettings } from '@/state/SettingsContext';
import { buildTheme, themes } from './buildTheme';
import type { SavedSettings } from '@types';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  const theme = useMemo(() => {
    const saved: SavedSettings = {
      themeName: themes[settings.themeId].name,
      accentColor: settings.accent,
      fontName: settings.fontFamily,
      fontWeight: settings.fontWeight,
      fontSizeLevel: settings.fontSizeLevel,
      noteTextAlign: settings.noteTextAlign,
    };
    return buildTheme(saved);
  }, [settings]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <StyledThemeProvider theme={theme}>
      <StatusBar barStyle={theme.barStyle} />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;
