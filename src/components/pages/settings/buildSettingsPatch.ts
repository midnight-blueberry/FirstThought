import { themes, type ThemeName } from '@theme/buildTheme';
import { clampLevel } from '@utils/theme';
import { nearestAvailableWeight } from '@constants/fonts/resolve';
import { toFamilyKey } from '@utils/font';
import type { DefaultTheme } from 'styled-components/native';
import type { Settings } from '@/state/SettingsContext';
import type { FontWeight } from '@constants/fonts';

export type SettingsPatch = Partial<Settings>;
export type SettingsMode = 'appAppearance' | 'notesAppearance';

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
  mode: SettingsMode = 'appAppearance',
): SettingsPatch {
  const patch: SettingsPatch = {};

  if (mode === 'appAppearance') {
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
  }

  const currentFontName =
    mode === 'notesAppearance'
      ? current.noteFontFamily ?? current.fontFamily
      : current.fontFamily;
  const currentFontWeight =
    mode === 'notesAppearance'
      ? current.noteFontWeight ?? current.fontWeight
      : current.fontWeight;
  const currentFontSizeLevel =
    mode === 'notesAppearance'
      ? current.noteFontSizeLevel ?? current.fontSizeLevel
      : current.fontSizeLevel;

  const familyChanged = local.selectedFontName !== currentFontName;
  const weightChanged = local.fontWeight !== currentFontWeight;
  if (familyChanged || weightChanged) {
    const familyKey = toFamilyKey(local.selectedFontName);
    const normalizedWeight = nearestAvailableWeight(
      familyKey,
      Number(local.fontWeight),
    );

    if (mode === 'notesAppearance') {
      if (familyChanged) {
        patch.noteFontFamily = local.selectedFontName;
      }
      if (familyChanged || normalizedWeight !== Number(currentFontWeight)) {
        patch.noteFontWeight = String(normalizedWeight) as FontWeight;
      }
    } else {
      if (familyChanged) {
        patch.fontFamily = local.selectedFontName;
      }
      if (familyChanged || normalizedWeight !== Number(currentFontWeight)) {
        patch.fontWeight = String(normalizedWeight) as FontWeight;
      }
    }
  }

  const sizeLevel = clampLevel(local.fontSizeLevel);
  if (sizeLevel !== currentFontSizeLevel) {
    if (mode === 'notesAppearance') {
      patch.noteFontSizeLevel = sizeLevel;
    } else {
      patch.fontSizeLevel = sizeLevel;
    }
  }

  if (local.noteTextAlign !== current.noteTextAlign) {
    patch.noteTextAlign = local.noteTextAlign;
  }

  return patch;
}

