import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SaveIcon } from '@components/ui/atoms';
import { fonts } from '@constants/fonts';
import useHeaderShadow from '@hooks/useHeaderShadow';
import useThemeSaver from '@hooks/useThemeSaver';
import useSyncThemeToLocalState from '@hooks/useSyncThemeToLocalState';
import useFontControls from '@hooks/useFontControls';
import useHeaderTitleSync from '@hooks/useHeaderTitleSync';
import useTheme from '@hooks/useTheme';
import { getBaseFontName, calcFontSizeLevel } from '@utils/font';
import { getFontByName } from '@utils/fontHelpers';
import { clampLevel, resolveOverlayColor } from '@utils/theme';
import { themeList } from '@theme/buildTheme';
import buildSectionProps from './buildSectionProps';
import type { SettingsVm } from './useSettingsVm.types';
import type { SavedSettings } from '@types';
import type { TextStyle } from 'react-native';
type FontWeight = TextStyle['fontWeight'];

const FONT_WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold'] as const;

function coerceFontWeight(value: unknown, fallback: FontWeight): FontWeight {
  return typeof value === 'string' && (FONT_WEIGHTS as readonly string[]).includes(value)
    ? (value as FontWeight)
    : fallback;
}

const SETTINGS_KEY = 'user_settings';

async function readSettings(): Promise<SavedSettings | null> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    return json ? (JSON.parse(json) as SavedSettings) : null;
  } catch {
    return null;
  }
}

async function writeSettings(settings: SavedSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore write errors
  }
}

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();

  const [selectedThemeName, setSelectedThemeName] = useState(theme.name);
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    theme.colors.accent,
  );
  const initialFontName = getBaseFontName(theme.fontName);
  const initialFontInfo = getFontByName(fonts, initialFontName);
  const initialFontSizeLevel = calcFontSizeLevel(
    theme.fontSize.small,
    initialFontInfo.defaultSize,
  );

  const {
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    selectFont,
    bumpFontWeight,
    bumpFontSize,
    blinkState,
  } = useFontControls({
    fonts,
    initial: {
      fontName: initialFontName,
      fontWeight: theme.fontWeight,
      fontSizeLevel: initialFontSizeLevel,
    },
    clampLevel,
    maxLevel: 5,
    minLevel: 1,
  });
  const [noteTextAlign, setNoteTextAlign] = useState(theme.noteTextAlign);
  const { setTheme, setThemeName, setAccent, setFontFamily, setFontWeight } = theme;
  const {
    saveAndApply,
    runWithOverlay,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
  } = useThemeSaver({ setTheme });

  const onChangeTheme = (next: string) => {
    setSelectedThemeName(next);
    setThemeName(next);
  };

  const onChangeAccent = (next: string) => {
    setSelectedAccentColor(next);
    setAccent(next);
  };

  const onChangeFontFamily = (next: string) => {
    const meta = getFontByName(fonts, next);
    selectFont(next);
    setFontFamily(next);
    setFontWeight(meta.defaultWeight);
  };

  const onChangeFontWeight = (
    next: FontWeight,
    baseFontName: string = selectedFontName,
    baseWeight: FontWeight = fontWeight as FontWeight,
  ) => {
    const meta = getFontByName(fonts, baseFontName);
    const currentIdx = meta.weights.indexOf(baseWeight);
    const targetIdx = meta.weights.indexOf(next);
    bumpFontWeight(targetIdx - currentIdx);
    setFontWeight(next);
  };

  const onChangeFontSize = (level: number) => {
    bumpFontSize(level - fontSizeLevel);
    saveAndApply({ fontSizeLevel: level });
  };

  const onChangeAlign = (align: typeof theme.noteTextAlign) => {
    setNoteTextAlign(align);
    saveAndApply({ noteTextAlign: align });
  };

  const currentSettings = () => ({
    themeName: selectedThemeName,
    accentColor: selectedAccentColor,
    fontName: selectedFontName,
    fontWeight,
    fontSizeLevel,
    noteTextAlign,
  });

  const handleThemePick = (next: string) => {
    runWithOverlay(
      () => onChangeTheme(next),
      resolveOverlayColor(next, themeList),
    );
    void writeSettings({ ...currentSettings(), themeName: next });
  };

  const handleAccentPick = (next: string) => {
    runWithOverlay(() => onChangeAccent(next), theme.colors.background);
    void writeSettings({ ...currentSettings(), accentColor: next });
  };

  const handleFontSelect = (next: string) => {
    runWithOverlay(() => onChangeFontFamily(next));
    const meta = getFontByName(fonts, next);
    void writeSettings({
      ...currentSettings(),
      fontName: next,
      fontWeight: meta.defaultWeight,
    });
  };

  const handleIncFontSize = () => {
    const next = clampLevel(fontSizeLevel + 1);
    runWithOverlay(() => onChangeFontSize(next));
    void writeSettings({ ...currentSettings(), fontSizeLevel: next });
  };

  const handleDecFontSize = () => {
    const next = clampLevel(fontSizeLevel - 1);
    runWithOverlay(() => onChangeFontSize(next));
    void writeSettings({ ...currentSettings(), fontSizeLevel: next });
  };

  const handleIncWeight = () => {
    const meta = getFontByName(fonts, selectedFontName);
    const currentIdx = meta.weights.indexOf(fontWeight as FontWeight);
    const nextIdx = Math.min(currentIdx + 1, meta.weights.length - 1);
    const next = meta.weights[nextIdx];
    runWithOverlay(() => onChangeFontWeight(next));
    void writeSettings({ ...currentSettings(), fontWeight: next });
  };

  const handleDecWeight = () => {
    const meta = getFontByName(fonts, selectedFontName);
    const currentIdx = meta.weights.indexOf(fontWeight as FontWeight);
    const nextIdx = Math.max(currentIdx - 1, 0);
    const next = meta.weights[nextIdx];
    runWithOverlay(() => onChangeFontWeight(next));
    void writeSettings({ ...currentSettings(), fontWeight: next });
  };

  const handleAlignChange = (align: typeof theme.noteTextAlign) => {
    runWithOverlay(() => onChangeAlign(align));
    void writeSettings({ ...currentSettings(), noteTextAlign: align });
  };

  const loadSettings = React.useCallback(async () => {
    const saved = await readSettings();
    if (!saved) return;
    if (saved.themeName) onChangeTheme(saved.themeName);
    if (saved.accentColor) onChangeAccent(saved.accentColor);
    if (saved.fontName) onChangeFontFamily(saved.fontName);
    if (saved.fontWeight) {
      const meta = saved.fontName
        ? getFontByName(fonts, saved.fontName)
        : getFontByName(fonts, selectedFontName);
      const base = saved.fontName
        ? (meta.defaultWeight as FontWeight)
        : (fontWeight as FontWeight);
      onChangeFontWeight(
        coerceFontWeight(saved.fontWeight, base),
        saved.fontName ?? selectedFontName,
        base,
      );
    }
    if (saved.fontSizeLevel !== undefined) {
      onChangeFontSize(saved.fontSizeLevel);
    }
    if (saved.noteTextAlign) {
      onChangeAlign(saved.noteTextAlign);
    }
  }, [
    onChangeTheme,
    onChangeAccent,
    onChangeFontFamily,
    onChangeFontWeight,
    onChangeFontSize,
    onChangeAlign,
    fontWeight,
    selectedFontName,
  ]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useHeaderTitleSync(theme, () => <SaveIcon fadeAnim={fadeAnim} />);
  useSyncThemeToLocalState(theme, {
    setSelectedThemeName,
    setSelectedAccentColor,
    setNoteTextAlign,
  });

  const handlers = {
    onSelectTheme: handleThemePick,
    onSelectAccent: handleAccentPick,
    onSelectFont: handleFontSelect,
    onSelectWeight: () => {},
    onIncFontSize: handleIncFontSize,
    onDecFontSize: handleDecFontSize,
    onIncWeight: handleIncWeight,
    onDecWeight: handleDecWeight,
    onAlign: handleAlignChange,
  };

  const sectionProps = useMemo(
    () => ({
      ...buildSectionProps({
        selectedThemeName,
        selectedAccentColor,
        selectedFontName,
        fontSizeLevel,
        fontWeight,
        noteTextAlign,
        sizeBlinkIndex: blinkState.size.index,
        sizeBlinkAnim: blinkState.size.anim,
        weightBlinkAnim: blinkState.weight.anim,
        ...handlers,
      }),
      preview: { noteTextAlign, fontName: theme.fontName, colors: theme.colors },
    }),
    [
      selectedThemeName,
      selectedAccentColor,
      selectedFontName,
      fontSizeLevel,
      fontWeight,
      noteTextAlign,
      blinkState.size.index,
      blinkState.size.anim,
      blinkState.weight.anim,
      handlers,
      theme.fontName,
      theme.colors,
    ],
  );
  return {
    sectionProps,
    theme,
    handleScroll,
    overlayVisible,
    overlayColor,
    overlayAnim,
    overlayBlocks,
  };
}

