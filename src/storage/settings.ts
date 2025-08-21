import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DefaultTheme } from 'styled-components/native';

const SETTINGS_KEY = 'user_settings';

export type AppSettings = {
  themeName: string;
  accentColor: string;
  fontSizeLevel: number;
  fontName: string;
  fontWeight: DefaultTheme['fontWeight'];
  iconSize: DefaultTheme['iconSize'];
  noteTextAlign: DefaultTheme['noteTextAlign'];
};

export async function loadSettings(): Promise<AppSettings | null> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    return json ? (JSON.parse(json) as AppSettings) : null;
  } catch {
    return null;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore write errors
  }
}
