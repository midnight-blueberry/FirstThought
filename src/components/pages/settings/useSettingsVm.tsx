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
import { useSettings } from '@/state/SettingsContext';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const overlay = useOverlayTransition();
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

  const changeTheme = (name: string) => {
    void (async () => {
      await overlay.apply(() => {
        setSelectedThemeName(name);
        const id =
          (Object.keys(themes) as ThemeName[]).find(
            (k) => themes[k].name === name,
          ) ?? 'light';
        updateSettings({ themeId: id });
      });
      await overlay.end();
    })();
  };

  const changeAccent = (color: string) => {
    void (async () => {
      await overlay.apply(() => {
        setSelectedAccentColor(color);
        updateSettings({ accent: color });
      });
      await overlay.end();
    })();
  };

  const changeFontFamily = (name: string) => {
    void (async () => {
      await overlay.apply(() => {
        setSelectedFontName(name);
        const next = storeSetFontFamily(name);
        setFontWeightState(next.fontWeight);
      });
      await overlay.end();
    })();
  };

  const changeFontWeight = (weight: DefaultTheme['fontWeight']) => {
    void (async () => {
      await overlay.apply(() => {
        const next = storeSetFontWeight(Number(weight));
        setFontWeightState(next.fontWeight);
      });
      await overlay.end();
    })();
  };

  const changeFontSize = (level: number) => {
    void (async () => {
      await overlay.apply(() => {
        const next = clampLevel(level);
        setFontSizeLevel(next);
        updateSettings({ fontSizeLevel: next });
      });
      await overlay.end();
    })();
  };

  const changeAlign = (align: typeof noteTextAlign) => {
    void (async () => {
      await overlay.apply(() => {
        setNoteTextAlign(align);
        updateSettings({ noteTextAlign: align });
      });
      await overlay.end();
    })();
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
