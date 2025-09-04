import React, { useMemo, useRef, useState } from 'react';
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
import { useSettings, type Settings } from '@/state/SettingsContext';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import { showErrorToast } from '@utils/showErrorToast';

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const overlay = useOverlayTransition();
  const { showFor2s } = useSaveIndicator();
  const {
    settings,
    updateSettings,
    setFontFamily: storeSetFontFamily,
    setFontWeight: storeSetFontWeight,
  } = useSettings();

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

  const overlayAnim = useRef(new Animated.Value(0)).current;

  const resetToSnapshot = (s: Settings) => {
    setSelectedThemeName(themes[s.themeId].name);
    setSelectedAccentColor(s.accent);
    setSelectedFontName(s.fontFamily);
    setFontWeightState(s.fontWeight);
    setFontSizeLevel(s.fontSizeLevel);
    setNoteTextAlign(s.noteTextAlign);
  };

  const withSettingsTransaction = async (
    cb: () => void | Promise<void>,
  ) => {
    const snapshot = JSON.parse(JSON.stringify(settings)) as Settings;
    try {
      await overlay.transact(async () => {
        try {
          await cb();
        } catch (e) {
          updateSettings(snapshot);
          resetToSnapshot(snapshot);
          console.warn(e);
          throw e;
        }
      });
      await showFor2s();
    } catch (e) {
      showErrorToast(
        e instanceof Error ? e.message : 'Ошибка сохранения настроек',
      );
    }
  };

  const changeTheme = (name: string) => {
    void withSettingsTransaction(async () => {
      setSelectedThemeName(name);
      const id =
        (Object.keys(themes) as ThemeName[]).find(
          (k) => themes[k].name === name,
        ) ?? 'light';
      updateSettings({ themeId: id });
    });
  };

  const changeAccent = (color: string) => {
    void withSettingsTransaction(async () => {
      setSelectedAccentColor(color);
      updateSettings({ accent: color });
    });
  };

  const changeFontFamily = (name: string) => {
    void withSettingsTransaction(async () => {
      setSelectedFontName(name);
      const next = storeSetFontFamily(name);
      setFontWeightState(next.fontWeight);
    });
  };

  const changeFontWeight = (weight: DefaultTheme['fontWeight']) => {
    void withSettingsTransaction(async () => {
      const next = storeSetFontWeight(Number(weight));
      setFontWeightState(next.fontWeight);
    });
  };

  const changeFontSize = (level: number) => {
    void withSettingsTransaction(async () => {
      const next = clampLevel(level);
      setFontSizeLevel(next);
      updateSettings({ fontSizeLevel: next });
    });
  };

  const changeAlign = (align: typeof noteTextAlign) => {
    void withSettingsTransaction(async () => {
      setNoteTextAlign(align);
      updateSettings({ noteTextAlign: align });
    });
  };

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
  };
}
