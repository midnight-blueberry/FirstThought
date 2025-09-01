import React, { useCallback, useEffect, useRef, useState, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultFontName,
  fonts,
  type FontWeight,
  nearestAvailableWeight,
  listAvailableWeights,
} from '@constants/fonts';
import { getFontByName } from '@utils/fontHelpers';
import { toFamilyKey } from '@utils/font';
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
  changeFamily: (family: string) => void;
  changeWeight: (weight: number) => void;
}

const SettingsContext = createContext<Ctx>({
  settings: defaultSettings,
  updateSettings: () => defaultSettings,
  changeFamily: () => {},
  changeWeight: () => {},
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

  const changeFamily = useCallback((nextFamily: string) => {
    const key = toFamilyKey(nextFamily);
    const clamped = nearestAvailableWeight(key, Number(stateRef.current.fontWeight));
    apply({ fontFamily: nextFamily, fontWeight: String(clamped) as FontWeight });
  }, [apply]);

  const changeWeight = useCallback((nextWeight: number) => {
    const key = toFamilyKey(stateRef.current.fontFamily);
    const clamped = nearestAvailableWeight(key, nextWeight);
    apply({ fontWeight: String(clamped) as FontWeight });
  }, [apply]);

  useEffect(() => {
    void (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const saved = JSON.parse(json) as Partial<Settings>;
          const savedKey = toFamilyKey(saved.fontFamily ?? defaultFontName);
          const weights = listAvailableWeights(savedKey);
          const normalized = weights.length
            ? nearestAvailableWeight(savedKey, Number(saved.fontWeight ?? 400))
            : 400;
          apply({
            ...saved,
            fontFamily: saved.fontFamily ?? defaultFontName,
            fontWeight: String(normalized) as FontWeight,
          });
        }
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
    <SettingsContext.Provider value={{ settings, updateSettings: apply, changeFamily, changeWeight }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}

export { SettingsContext };
