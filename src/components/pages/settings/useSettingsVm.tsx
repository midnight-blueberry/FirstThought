import React, { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  fonts,
  FONT_WEIGHTS_BY_FAMILY,
  getNearestAllowedWeight,
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
  const fontMeta = getFontByName(fonts, settings.fontFamily);
  const weights = fontMeta.weights.map(Number);
  const target = Number(settings.fontWeight);
  const exactIdx = weights.indexOf(target);
  const initialIdx =
    exactIdx !== -1
      ? exactIdx
      : weights.reduce(
          (best, w, i) =>
            Math.abs(w - target) < Math.abs(weights[best] - target) ? i : best,
          0,
        );
  const initialWeight = weights[initialIdx] as FontWeight;

  const [selectedThemeName, setSelectedThemeName] = useState(
    themes[settings.themeId].name,
  );
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    settings.accent,
  );
  const [selectedFontName, setSelectedFontName] = useState(settings.fontFamily);
  const [fontWeight, setFontWeight] = useState<FontWeight>(initialWeight);
  const [fontWeightLevel, setFontWeightLevel] = useState(initialIdx + 1);
  const [fontSizeLevel, setFontSizeLevel] = useState(settings.fontSizeLevel);
  const [noteTextAlign, setNoteTextAlign] = useState(settings.noteTextAlign);

  const overlayAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    setSelectedFontName(settings.fontFamily);
    const meta = getFontByName(fonts, settings.fontFamily);
    const ws = meta.weights.map(Number);
    const tgt = Number(settings.fontWeight);
    const exact = ws.indexOf(tgt);
    const idx =
      exact !== -1
        ? exact
        : ws.reduce(
            (best, w, i) =>
              Math.abs(w - tgt) < Math.abs(ws[best] - tgt) ? i : best,
            0,
          );
    setFontWeight(ws[idx] as FontWeight);
    setFontWeightLevel(idx + 1);
  }, [settings.fontFamily, settings.fontWeight]);

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
    const ws = meta.weights.map(Number);
    setFontWeightLevel(ws.indexOf(Number(weight)) + 1);
    updateSettings({ fontFamily: name, fontWeight: weight });
  };

  const changeFontWeight = (weight: FontWeight) => {
    const meta = getFontByName(fonts, settings.fontFamily);
    const safe = getNearestAllowedWeight(meta.family, Number(weight) as FontWeight);
    setFontWeight(safe);
    const ws = FONT_WEIGHTS_BY_FAMILY[meta.family].map(Number);
    setFontWeightLevel(ws.indexOf(Number(safe)) + 1);
    updateSettings({ fontWeight: safe });
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
    const ws = FONT_WEIGHTS_BY_FAMILY[meta.family].map(Number);
    const nextIdx = Math.min(fontWeightLevel, ws.length - 1);
    changeFontWeight(ws[nextIdx] as FontWeight);
  };
  const handleDecWeight = () => {
    const meta = getFontByName(fonts, settings.fontFamily);
    const ws = FONT_WEIGHTS_BY_FAMILY[meta.family].map(Number);
    const nextIdx = Math.max(fontWeightLevel - 2, 0);
    changeFontWeight(ws[nextIdx] as FontWeight);
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
      preview: { noteTextAlign, fontName: theme.fontName, colors: theme.colors },
    }),
    [
      selectedThemeName,
      selectedAccentColor,
      selectedFontName,
      fontSizeLevel,
      fontWeight,
      noteTextAlign,
      theme.fontName,
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
