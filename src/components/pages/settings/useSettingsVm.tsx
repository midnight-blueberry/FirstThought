import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { fonts, FONT_VARIANTS, type FontWeight } from '@constants/fonts';
import type { DefaultTheme } from 'styled-components/native';
import useHeaderShadow from '@hooks/useHeaderShadow';
import useTheme from '@hooks/useTheme';
import { getFontByName } from '@utils/fontHelpers';
import { clampLevel } from '@utils/theme';
import { themes, type ThemeName } from '@theme/buildTheme';
import buildSectionProps from './buildSectionProps';
import type { SettingsVm } from './useSettingsVm.types';
import { useSettings } from '@/state/SettingsContext';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import { showErrorToast } from '@utils/showErrorToast';

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const { showFor2s } = useSaveIndicator();
  const { settings, updateSettings } = useSettings();

  const [selectedThemeName, setSelectedThemeName] = useState(
    themes[settings.themeId].name,
  );
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    settings.accent,
  );
  const [selectedFontName, setSelectedFontName] = useState(settings.fontFamily);
  const [fontWeight, setFontWeightState] = useState<FontWeight>(settings.fontWeight);
  const [fontSizeLevel, setFontSizeLevel] = useState(settings.fontSizeLevel);
  const [noteTextAlign, setNoteTextAlign] = useState(settings.noteTextAlign);

  const [settingsVersion, setSettingsVersion] = useState(0);

  const overlayAnim = useRef(new Animated.Value(0)).current;

  const changeTheme = (name: string) => {
    setSelectedThemeName(name);
  };

  const changeAccent = (color: string) => {
    setSelectedAccentColor(color);
  };

  const changeFontFamily = (name: string) => {
    setSelectedFontName(name);
    const meta = getFontByName(fonts, name);
    setFontWeightState(meta.defaultWeight as FontWeight);
  };

  const changeFontWeight = (weight: DefaultTheme['fontWeight']) => {
    setFontWeightState(weight as FontWeight);
  };

  const changeFontSize = (level: number) => {
    const next = clampLevel(level);
    setFontSizeLevel(next);
  };

  const changeAlign = (align: typeof noteTextAlign) => {
    setNoteTextAlign(align);
  };

  const applySelectedChange = useCallback(async () => {
    try {
      const themeId =
        (Object.keys(themes) as ThemeName[]).find(
          (k) => themes[k].name === selectedThemeName,
        ) ?? 'light';
      updateSettings({
        themeId,
        accent: selectedAccentColor,
        fontFamily: selectedFontName,
        fontWeight,
        fontSizeLevel,
        noteTextAlign,
      });
      setSettingsVersion((v) => v + 1);
      await showFor2s();
    } catch (e) {
      showErrorToast(
        e instanceof Error ? e.message : 'Ошибка сохранения настроек',
      );
    }
  }, [
    selectedThemeName,
    selectedAccentColor,
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    noteTextAlign,
    updateSettings,
    showFor2s,
  ]);

  const handleIncFontSize = () => changeFontSize(fontSizeLevel + 1);
  const handleDecFontSize = () => changeFontSize(fontSizeLevel - 1);
  const handleIncWeight = () => {
    const meta = getFontByName(fonts, selectedFontName);
    const variantMap = FONT_VARIANTS[meta.family];
    const weights = variantMap
      ? Object.keys(variantMap).map(Number).sort((a, b) => a - b)
      : [400];
    const idx = weights.indexOf(Number(fontWeight));
    const next = weights[(idx + 1) % weights.length];
    changeFontWeight(String(next) as FontWeight);
  };
  const handleDecWeight = () => {
    const meta = getFontByName(fonts, selectedFontName);
    const variantMap = FONT_VARIANTS[meta.family];
    const weights = variantMap
      ? Object.keys(variantMap).map(Number).sort((a, b) => a - b)
      : [400];
    const idx = weights.indexOf(Number(fontWeight));
    const next = weights[(idx - 1 + weights.length) % weights.length];
    changeFontWeight(String(next) as FontWeight);
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
        sizeBlinkIndex: null,
        sizeBlinkAnim: null,
        weightBlinkAnim: null,
        onSelectTheme: changeTheme,
        onSelectAccent: changeAccent,
        onSelectFont: changeFontFamily,
        onSelectWeight: changeFontWeight,
        onIncFontSize: handleIncFontSize,
        onDecFontSize: handleDecFontSize,
        onIncWeight: handleIncWeight,
        onDecWeight: handleDecWeight,
        onAlign: changeAlign,
      }),
      preview: { noteTextAlign, colors: theme.colors },
    }),
    [
      selectedThemeName,
      selectedAccentColor,
      selectedFontName,
      fontSizeLevel,
      fontWeight,
      noteTextAlign,
      theme.colors,
    ],
  );

  return {
    sectionProps,
    theme,
    handleScroll,
    overlayVisible: false,
    overlayColor: 'transparent',
    overlayAnim,
    overlayBlocks: false,
    settingsVersion,
    applySelectedChange,
  };
}
