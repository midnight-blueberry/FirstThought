import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  fonts,
  FONT_VARIANTS,
  nearestAvailableWeight,
  type FontWeight,
} from '@constants/fonts';
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
import { useSaveIndicator } from '@features/save-indicator';
import { showErrorToast } from '@utils/showErrorToast';
import { toFamilyKey } from '@utils/font';
import { areSettingsEqual } from '@features/settings/areSettingsEqual';

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const overlay = useOverlayTransition();
  const { show, hide, reset } = useSaveIndicator();
  const { settings, updateSettings } = useSettings();

  const [draft, setDraft] = useState<Settings>(settings);
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const saved = settings;

  const dirty = useMemo(
    () => !areSettingsEqual(draft, saved),
    [draft, saved],
  );

  useEffect(() => {
    dirty ? show() : hide();
  }, [dirty, show, hide]);

  useEffect(() => () => reset(), [reset]);

  const overlayAnim = useRef(new Animated.Value(0)).current;

  const resetToSnapshot = (s: Settings) => {
    setDraft(s);
  };

  const withSettingsTransaction = async (
    cb: () => void | Promise<void>,
    nextBackground?: string,
  ) => {
    const snapshot = JSON.parse(JSON.stringify(saved)) as Settings;
    try {
      if (nextBackground) {
        overlay.freezeBackground(nextBackground);
      }
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
      overlay.releaseBackground();
    } catch (e) {
      overlay.releaseBackground();
      showErrorToast(
        e instanceof Error ? e.message : 'Ошибка сохранения настроек',
      );
    }
  };

  const changeTheme = (name: string) => {
    const id =
      (Object.keys(themes) as ThemeName[]).find(
        (k) => themes[k].name === name,
      ) ?? 'light';
    setDraft((prev) => ({ ...prev, themeId: id }));
  };

  const changeAccent = (color: string) => {
    setDraft((prev) => ({ ...prev, accent: color }));
  };

  const changeFontFamily = (name: string) => {
    const key = toFamilyKey(name);
    const normalized = nearestAvailableWeight(key, Number(draft.fontWeight));
    setDraft((prev) => ({
      ...prev,
      fontFamily: name,
      fontWeight: String(normalized) as FontWeight,
    }));
  };

  const changeFontWeight = (weight: DefaultTheme['fontWeight']) => {
    const key = toFamilyKey(draft.fontFamily);
    const normalized = nearestAvailableWeight(key, Number(weight));
    setDraft((prev) => ({
      ...prev,
      fontWeight: String(normalized) as FontWeight,
    }));
  };

  const changeFontSize = (level: number) => {
    setDraft((prev) => ({
      ...prev,
      fontSizeLevel: clampLevel(level),
    }));
  };

  const changeAlign = (align: typeof draft.noteTextAlign) => {
    setDraft((prev) => ({ ...prev, noteTextAlign: align }));
  };

  const handleIncFontSize = () => changeFontSize(draft.fontSizeLevel + 1);
  const handleDecFontSize = () => changeFontSize(draft.fontSizeLevel - 1);

  const handleIncWeight = () => {
    const meta = getFontByName(fonts, draft.fontFamily);
    const variantMap = FONT_VARIANTS[meta.family];
    const weights = variantMap
      ? Object.keys(variantMap).map(Number).sort((a, b) => a - b)
      : [400];
    const idx = weights.indexOf(Number(draft.fontWeight));
    const next = weights[(idx + 1) % weights.length];
    changeFontWeight(String(next) as FontWeight);
  };

  const handleDecWeight = () => {
    const meta = getFontByName(fonts, draft.fontFamily);
    const variantMap = FONT_VARIANTS[meta.family];
    const weights = variantMap
      ? Object.keys(variantMap).map(Number).sort((a, b) => a - b)
      : [400];
    const idx = weights.indexOf(Number(draft.fontWeight));
    const next = weights[(idx - 1 + weights.length) % weights.length];
    changeFontWeight(String(next) as FontWeight);
  };

  const save = async () => {
    const nextBg = themes[draft.themeId].colors.background;
    await withSettingsTransaction(async () => {
      updateSettings(draft);
    }, nextBg);
  };

  const sectionProps = useMemo(
    () => ({
      ...buildSectionProps({
        selectedThemeName: themes[draft.themeId].name,
        selectedAccentColor: draft.accent,
        selectedFontName: draft.fontFamily,
        fontSizeLevel: draft.fontSizeLevel,
        fontWeight: draft.fontWeight,
        noteTextAlign: draft.noteTextAlign,
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
      preview: { noteTextAlign: draft.noteTextAlign, colors: theme.colors },
    }),
    [
      draft.themeId,
      draft.accent,
      draft.fontFamily,
      draft.fontSizeLevel,
      draft.fontWeight,
      draft.noteTextAlign,
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
    save,
  };
}
