import { useMemo } from 'react';
import type { Settings } from '@/state/SettingsContext';
import { buildSettingsPatch } from './buildSettingsPatch';
import type { FontWeight } from '@constants/fonts';

export type ChangedKey = keyof ReturnType<typeof buildSettingsPatch>;
export type DirtyState = { isDirty: boolean; changedKeys: ChangedKey[] };

export function useSettingsDirty(
  local: {
    selectedThemeName: string;
    selectedAccentColor: string;
    selectedFontName: string;
    fontWeight: FontWeight;
    fontSizeLevel: number;
    noteTextAlign: Settings['noteTextAlign'];
  },
  current: Settings,
): DirtyState {
  return useMemo(() => {
    const patch = buildSettingsPatch(local, current);
    const changedKeys = Object.keys(patch) as ChangedKey[];
    return { isDirty: changedKeys.length > 0, changedKeys };
  }, [local, current]);
}

