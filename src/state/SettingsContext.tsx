import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultFontName, fonts, type FontWeight } from '@constants/fonts';
import { listAvailableWeights, nearestAvailableWeight } from '@/constants/fonts/resolve';
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

const isEqual = (a: Settings, b: Settings) =>
  a.themeId === b.themeId &&
  a.accent === b.accent &&
  a.fontFamily === b.fontFamily &&
  a.fontWeight === b.fontWeight &&
  a.fontSizeLevel === b.fontSizeLevel &&
  a.noteTextAlign === b.noteTextAlign;

interface Ctx {
  settings: Settings;
  updateSettings: (p: Partial<Settings>) => Settings;
  setFontFamily: (family: string) => Settings;
  setFontWeight: (weight: number) => Settings;
  saveSettings: () => Promise<void>;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
}

const SettingsContext = createContext<Ctx>({
  settings: defaultSettings,
  updateSettings: () => defaultSettings,
  setFontFamily: () => defaultSettings,
  setFontWeight: () => defaultSettings,
  saveSettings: async () => {},
  isDirty: false,
  setDirty: () => {},
});

let updateRef = (p: Partial<Settings>) => defaultSettings;
export function updateSettings(p: Partial<Settings>) {
  return updateRef(p);
}

let setFamilyRef = (family: string) => defaultSettings;
export function setFontFamily(family: string) {
  return setFamilyRef(family);
}

let setWeightRef = (weight: number) => defaultSettings;
export function setFontWeight(weight: number) {
  return setWeightRef(weight);
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const stateRef = useRef(settings);
  const savedRef = useRef<Settings>(defaultSettings);
  const [isDirty, setDirty] = useState(false);

  const apply = useCallback((p: Partial<Settings>) => {
    stateRef.current = { ...stateRef.current, ...p };
    setSettings(stateRef.current);
    setDirty(!isEqual(stateRef.current, savedRef.current));
    return stateRef.current;
  }, []);
  updateRef = apply;
  const changeFamily = useCallback(
    (nextFamily: string) => {
      const key = toFamilyKey(nextFamily);
      const clamped = nearestAvailableWeight(
        key,
        Number(stateRef.current.fontWeight),
      );
      return apply({
        fontFamily: nextFamily,
        fontWeight: String(clamped) as FontWeight,
      });
    },
    [apply],
  );
  const changeWeight = useCallback(
    (nextWeight: number) => {
      const key = toFamilyKey(stateRef.current.fontFamily);
      const clamped = nearestAvailableWeight(key, nextWeight);
      return apply({ fontWeight: String(clamped) as FontWeight });
    },
    [apply],
  );
  setFamilyRef = changeFamily;
  setWeightRef = changeWeight;

  const saveSettings = useCallback(async () => {
    savedRef.current = { ...stateRef.current };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedRef.current));
    setDirty(false);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const saved = JSON.parse(json) as Partial<Settings>;
          const savedKey = toFamilyKey(saved.fontFamily ?? defaultFontName);
          const weights = listAvailableWeights(savedKey);
          const normalized = weights.length
            ? nearestAvailableWeight(
                savedKey,
                Number(saved.fontWeight ?? 400),
              )
            : 400;
          const loaded: Settings = {
            ...defaultSettings,
            ...saved,
            fontFamily: saved.fontFamily ?? defaultFontName,
            fontWeight: String(normalized) as FontWeight,
          };
          stateRef.current = loaded;
          savedRef.current = loaded;
          setSettings(loaded);
          setDirty(false);
        }
      } catch {}
    })();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings: apply,
        setFontFamily: changeFamily,
        setFontWeight: changeWeight,
        saveSettings,
        isDirty,
        setDirty,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}

export { SettingsContext };
