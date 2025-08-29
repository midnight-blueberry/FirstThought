import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { readSettings, writeSettings } from './settingsStorage';
import { SaveIcon } from '@components/ui/atoms';
import { fonts, FONT_WEIGHTS } from '@constants/fonts';
import useHeaderShadow from '@hooks/useHeaderShadow';
import { ThemeContext } from '@store/ThemeContext';
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
import type { FontFamily, FontWeight } from '@constants/fonts';

function coerceFontWeight(
  value: unknown,
  fallback: FontWeight,
  family: FontFamily,
): FontWeight {
  const weights = FONT_WEIGHTS[family];
  return typeof value === 'string' && (weights as readonly string[]).includes(value)
    ? (value as FontWeight)
    : fallback;
}


export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const context = useContext(ThemeContext);

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
  if (!context) throw new Error('ThemeContext is missing');
  const { setTheme } = context;
  const {
    saveAndApply,
    runWithOverlay,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
  } = useThemeSaver({
    selectedThemeName,
    selectedAccentColor,
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    noteTextAlign,
    setTheme,
  });
  const onChangeTheme = (next: string) => {
    setSelectedThemeName(next);
    saveAndApply({ themeName: next });
  };

  const onChangeAccent = (next: string) => {
    setSelectedAccentColor(next);
    saveAndApply({ accentColor: next });
  };

  const onChangeFontFamily = (next: string) => {
    const meta = getFontByName(fonts, next);
    selectFont(next);
    saveAndApply({ fontName: next, fontWeight: meta.defaultWeight });
  };

  const onChangeFontWeight = (
    next: FontWeight,
    baseFontName: string = selectedFontName,
    baseWeight: FontWeight = fontWeight as FontWeight,
  ) => {
    const meta = getFontByName(fonts, baseFontName);
    const weights = FONT_WEIGHTS[meta.family] as readonly FontWeight[];
    const currentIdx = weights.indexOf(baseWeight);
    const targetIdx = weights.indexOf(next);
    bumpFontWeight(targetIdx - currentIdx);
    saveAndApply({ fontWeight: next });
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
    const weights = FONT_WEIGHTS[meta.family] as readonly FontWeight[];
    const idx = weights.indexOf(fontWeight as FontWeight);
    const next = weights[(idx + 1) % weights.length];
    runWithOverlay(() => onChangeFontWeight(next));
    void writeSettings({ ...currentSettings(), fontWeight: next });
  };

  const handleDecWeight = () => {
    const meta = getFontByName(fonts, selectedFontName);
    const weights = FONT_WEIGHTS[meta.family] as readonly FontWeight[];
    const idx = weights.indexOf(fontWeight as FontWeight);
    const next = weights[(idx - 1 + weights.length) % weights.length];
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
        coerceFontWeight(saved.fontWeight, base, meta.family),
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

