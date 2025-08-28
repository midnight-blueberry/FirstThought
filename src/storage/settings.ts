import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings } from '@types';
import { SETTINGS_KEY } from '@components/pages/settings/settingsStorage';

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
