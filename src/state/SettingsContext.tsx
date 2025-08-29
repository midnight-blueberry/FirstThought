import React, { useCallback, useEffect, useRef, useState, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultFontName, fonts, type FontWeight } from '@constants/fonts';
import { getFontByName } from '@utils/fontHelpers';
import { themes, type ThemeName } from '@theme/buildTheme';
import type { DefaultTheme } from 'styled-components/native';

export interface Settings {
  themeId: ThemeName;
  accent: string;
  fontFamily: string;
  fontWeight: FontWeight;
  fontSizeLevel: number;
  noteTextAlign: DefaultTheme['noteTextAlign'];
}

const STORAGE_KEY = 'user_settings';

const defaultFont = getFontByName(fonts, defaultFontName);
const defaultSettings: Settings = {
  themeId: 'light',
  accent: themes.light.colors.accent,
  fontFamily: defaultFontName,
  fontWeight: defaultFont.defaultWeight,
  fontSizeLevel: 3,
  noteTextAlign: 'left',
};

interface Ctx {
  settings: Settings;
  updateSettings: (p: Partial<Settings>) => Settings;
}

const SettingsContext = createContext<Ctx>({
  settings: defaultSettings,
  updateSettings: () => defaultSettings,
});

let updateRef = (p: Partial<Settings>) => defaultSettings;
export function updateSettings(p: Partial<Settings>) {
  return updateRef(p);
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const stateRef = useRef(settings);

  const apply = useCallback((p: Partial<Settings>) => {
    stateRef.current = { ...stateRef.current, ...p };
    setSettings(stateRef.current);
    return stateRef.current;
  }, []);
  updateRef = apply;

  useEffect(() => {
    void (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) apply(JSON.parse(json) as Partial<Settings>);
      } catch {}
    })();
  }, [apply]);

  useEffect(() => {
    const id = setTimeout(() => {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
    }, 200);
    return () => clearTimeout(id);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings: apply }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}

export { SettingsContext };
