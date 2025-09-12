import { themes, type ThemeName } from '@theme/buildTheme';
import { clampLevel } from '@utils/theme';
import { nearestAvailableWeight } from '@constants/fonts/resolve';
import { toFamilyKey } from '@utils/font';
import type { DefaultTheme } from 'styled-components/native';
import type { Settings } from '@/state/SettingsContext';
import type { FontWeight } from '@constants/fonts';

export type SettingsPatch = Partial<Settings>;

export function buildSettingsPatch(
  local: {
    selectedThemeName: string;
    selectedAccentColor: string;
    selectedFontName: string;
    fontWeight: FontWeight;
    fontSizeLevel: number;
    noteTextAlign: DefaultTheme['noteTextAlign'];
  },
  current: Settings,
): SettingsPatch {
  const patch: SettingsPatch = {};

  const themeId =
    (Object.keys(themes) as ThemeName[]).find(
      (k) => themes[k].name === local.selectedThemeName,
    ) ?? current.themeId;
  if (themeId !== current.themeId) {
    patch.themeId = themeId;
  }

  if (local.selectedAccentColor !== current.accent) {
    patch.accent = local.selectedAccentColor;
  }

  const familyChanged = local.selectedFontName !== current.fontFamily;
  const weightChanged = local.fontWeight !== current.fontWeight;
  if (familyChanged || weightChanged) {
    const familyKey = toFamilyKey(local.selectedFontName);
    const normalizedWeight = nearestAvailableWeight(
      familyKey,
      Number(local.fontWeight),
    );
    if (familyChanged) {
      patch.fontFamily = local.selectedFontName;
    }
    if (familyChanged || normalizedWeight !== Number(current.fontWeight)) {
      patch.fontWeight = String(normalizedWeight) as FontWeight;
    }
  }

  const sizeLevel = clampLevel(local.fontSizeLevel);
  if (sizeLevel !== current.fontSizeLevel) {
    patch.fontSizeLevel = sizeLevel;
  }

  if (local.noteTextAlign !== current.noteTextAlign) {
    patch.noteTextAlign = local.noteTextAlign;
  }

  return patch;
}

