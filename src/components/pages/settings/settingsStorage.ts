import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedSettings } from '@types';

export const SETTINGS_KEY = 'user_settings';

export async function readSettings(): Promise<SavedSettings | null> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    return json ? (JSON.parse(json) as SavedSettings) : null;
  } catch {
    return null;
  }
}

export async function writeSettings(settings: SavedSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore write errors
  }
}

