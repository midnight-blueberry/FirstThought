import React, { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  fonts,
  AVAILABLE_WEIGHTS,
  resolveAvailableWeight,
  getFontFamily,
  type FontWeight,
} from '@constants/fonts';
import useHeaderShadow from '@hooks/useHeaderShadow';
import useTheme from '@hooks/useTheme';
import { getFontByName } from '@utils/fontHelpers';
import { clampLevel } from '@utils/theme';
import { themes, type ThemeName } from '@theme/buildTheme';
import buildSectionProps from './buildSectionProps';
import type { SettingsVm } from './useSettingsVm.types';
import { useSettings } from '@/state/SettingsContext';

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const { settings, updateSettings } = useSettings();

  const [selectedThemeName, setSelectedThemeName] = useState(
    themes[settings.themeId].name,
  );
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    settings.accent,
  );
  const [selectedFontName, setSelectedFontName] = useState(settings.fontFamily);
  const [fontWeight, setFontWeight] = useState<FontWeight>(settings.fontWeight);
  const [fontSizeLevel, setFontSizeLevel] = useState(settings.fontSizeLevel);
  const [noteTextAlign, setNoteTextAlign] = useState(settings.noteTextAlign);

  const overlayAnim = useRef(new Animated.Value(0)).current;

  const changeTheme = (name: string) => {
    setSelectedThemeName(name);
    const id =
      (Object.keys(themes) as ThemeName[]).find(
        (k) => themes[k].name === name,
      ) ?? 'light';
    updateSettings({ themeId: id });
  };

  const changeAccent = (color: string) => {
    setSelectedAccentColor(color);
    updateSettings({ accent: color });
  };

  const changeFontFamily = (name: string) => {
    const meta = getFontByName(fonts, name);
    setSelectedFontName(name);
    const weight: FontWeight = meta.defaultWeight;
    setFontWeight(weight);
    updateSettings({ fontFamily: name, fontWeight: weight });
  };

  const changeFontWeight = (weight: FontWeight) => {
    const meta = getFontByName(fonts, settings.fontFamily);
    const resolved = resolveAvailableWeight(meta.family, weight);
    setFontWeight(resolved);
    updateSettings({ fontWeight: resolved });
  };

  const changeFontSize = (level: number) => {
    const next = clampLevel(level);
    setFontSizeLevel(next);
    updateSettings({ fontSizeLevel: next });
  };

  const changeAlign = (align: typeof noteTextAlign) => {
    setNoteTextAlign(align);
    updateSettings({ noteTextAlign: align });
  };

  const handleIncFontSize = () => changeFontSize(fontSizeLevel + 1);
  const handleDecFontSize = () => changeFontSize(fontSizeLevel - 1);
  const handleIncWeight = () => {
    const meta = getFontByName(fonts, settings.fontFamily);
    const weights: FontWeight[] = [...AVAILABLE_WEIGHTS[meta.family]];
    const idx = weights.indexOf(fontWeight);
    changeFontWeight(weights[(idx + 1) % weights.length]);
  };
  const handleDecWeight = () => {
    const meta = getFontByName(fonts, settings.fontFamily);
    const weights: FontWeight[] = [...AVAILABLE_WEIGHTS[meta.family]];
    const idx = weights.indexOf(fontWeight);
    changeFontWeight(weights[(idx - 1 + weights.length) % weights.length]);
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
        onSelectWeight: () => {},
        onIncFontSize: handleIncFontSize,
        onDecFontSize: handleDecFontSize,
        onIncWeight: handleIncWeight,
        onDecWeight: handleDecWeight,
        onAlign: changeAlign,
      }),
      preview: {
        noteTextAlign,
        fontName: getFontFamily(
          getFontByName(fonts, selectedFontName).family,
          String(fontWeight),
        ),
        colors: theme.colors,
      },
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
  };
}
