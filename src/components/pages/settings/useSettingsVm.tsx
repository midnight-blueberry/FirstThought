import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useOverlayTransition } from '@features/overlay/useOverlayTransition';
import { useSaveIndicator } from '@features/save-indicator';
import { toFamilyKey } from '@utils/font';
import { areSettingsEqual } from '@features/settings/areSettingsEqual';

export default function useSettingsVm(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const { withOverlay } = useOverlayTransition();
  const { show, hide, reset } = useSaveIndicator();
  const lastDirtyRef = useRef<boolean>(false);
  const { settings, updateSettings } = useSettings();

  const previewing = useRef(false);
  const [draft, setDraft] = useState<Settings>(settings);
  const [saved, setSaved] = useState<Settings>(settings);

  useEffect(() => {
    if (previewing.current) {
      previewing.current = false;
      return;
    }
    setDraft(settings);
    setSaved(settings);
  }, [settings]);

  const dirty = useMemo(
    () => !areSettingsEqual(draft, saved),
    [draft, saved],
  );

  useEffect(() => {
    if (dirty !== lastDirtyRef.current) {
      dirty ? show() : hide();
      lastDirtyRef.current = dirty;
    }
  }, [dirty, show, hide]);

  useEffect(() =>
    () => {
      lastDirtyRef.current = false;
      reset();
    },
  [reset]);

  const changeTheme = (name: string) => {
    const id =
      (Object.keys(themes) as ThemeName[]).find(
        (k) => themes[k].name === name,
      ) ?? 'light';
    setDraft((prev) => ({ ...prev, themeId: id }));
    withOverlay(() => {
      previewing.current = true;
      updateSettings({ themeId: id });
    });
  };

  const changeAccent = (color: string) => {
    setDraft((prev) => ({ ...prev, accent: color }));
  };

  const changeFontFamily = (name: string) => {
    const key = toFamilyKey(name);
    const normalized = nearestAvailableWeight(key, Number(draft.fontWeight));
    const nextWeight = String(normalized) as FontWeight;
    setDraft((prev) => ({
      ...prev,
      fontFamily: name,
      fontWeight: nextWeight,
    }));
    withOverlay(() => {
      previewing.current = true;
      updateSettings({ fontFamily: name, fontWeight: nextWeight });
    });
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
    updateSettings(draft);
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
    save,
  };
}
