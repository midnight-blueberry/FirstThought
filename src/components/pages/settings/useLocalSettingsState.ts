import { useState } from 'react';
import { themes } from '@theme/buildTheme';
import type { Settings } from '@/state/SettingsContext';
import type { FontWeight } from '@constants/fonts';

export function useLocalSettingsState(settings: Settings) {
  const [selectedThemeName, setSelectedThemeName] = useState(
    themes[settings.themeId].name,
  );
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    settings.accent,
  );
  const [selectedFontName, setSelectedFontName] = useState(settings.fontFamily);
  const [fontWeight, setFontWeightState] = useState<FontWeight>(
    settings.fontWeight,
  );
  const [fontSizeLevel, setFontSizeLevel] = useState(settings.fontSizeLevel);
  const [noteFontName, setNoteFontName] = useState(
    settings.noteFontFamily ?? settings.fontFamily,
  );
  const [noteFontWeight, setNoteFontWeightState] = useState<FontWeight>(
    settings.noteFontWeight ?? settings.fontWeight,
  );
  const [noteFontSizeLevel, setNoteFontSizeLevel] = useState(
    settings.noteFontSizeLevel ?? settings.fontSizeLevel,
  );
  const [noteTextAlign, setNoteTextAlign] = useState(settings.noteTextAlign);
  const [settingsVersion, setSettingsVersion] = useState(0);

  return {
    selectedThemeName,
    setSelectedThemeName,
    selectedAccentColor,
    setSelectedAccentColor,
    selectedFontName,
    setSelectedFontName,
    fontWeight,
    setFontWeightState,
    fontSizeLevel,
    setFontSizeLevel,
    noteFontName,
    setNoteFontName,
    noteFontWeight,
    setNoteFontWeightState,
    noteFontSizeLevel,
    setNoteFontSizeLevel,
    noteTextAlign,
    setNoteTextAlign,
    settingsVersion,
    setSettingsVersion,
  };
}

