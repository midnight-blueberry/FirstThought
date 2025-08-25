import { useCallback, useMemo } from 'react';
import { themeList } from '@theme/buildTheme';
import { resolveOverlayColor } from '@utils/theme';
import type { SavedSettingsPatch } from '@types';
import type { DefaultTheme } from 'styled-components/native';

export interface HandlersDeps {
  runWithOverlay: (fn: () => void, overlayColor?: string) => void;
  saveAndApply: (patch: SavedSettingsPatch) => void;
  bumpFontSize: (delta: number) => void;
  bumpFontWeight: (delta: number) => void;
  setSelectedAccentColor: (c: string) => void;
  setSelectedThemeName: (n: string) => void;
  setNoteTextAlign: (a: DefaultTheme['noteTextAlign']) => void;
  themeBg: string;
}

export default function useSettingsHandlers(d: HandlersDeps) {
  const noopSelectWeight = useCallback(() => {}, []);

  const handleAccentChange = useCallback(
    (next: string) => {
      d.runWithOverlay(() => {
        d.setSelectedAccentColor(next);
        d.saveAndApply({ accentColor: next });
      }, d.themeBg);
    },
    [d],
  );

  const handleThemeChange = useCallback(
    (name: string) => {
      const oc = resolveOverlayColor(name, themeList);
      d.runWithOverlay(() => {
        d.setSelectedThemeName(name);
        d.saveAndApply({ themeName: name });
      }, oc);
    },
    [d],
  );

  const handleIncreaseFontSize = useCallback(() => d.bumpFontSize(1), [d]);
  const handleDecreaseFontSize = useCallback(() => d.bumpFontSize(-1), [d]);

  const handleIncreaseFontWeight = useCallback(() => d.bumpFontWeight(1), [d]);
  const handleDecreaseFontWeight = useCallback(() => d.bumpFontWeight(-1), [d]);

  const handleAlignChange = useCallback(
    (align: any) => {
      d.runWithOverlay(() => {
        d.setNoteTextAlign(align);
        d.saveAndApply({ noteTextAlign: align });
      });
    },
    [d],
  );

  return useMemo(
    () => ({
      onSelectWeight: noopSelectWeight,
      onSelectAccent: handleAccentChange,
      onSelectTheme: handleThemeChange,
      onIncFontSize: handleIncreaseFontSize,
      onDecFontSize: handleDecreaseFontSize,
      onIncWeight: handleIncreaseFontWeight,
      onDecWeight: handleDecreaseFontWeight,
      onAlign: handleAlignChange,
    }),
    [
      noopSelectWeight,
      handleAccentChange,
      handleThemeChange,
      handleIncreaseFontSize,
      handleDecreaseFontSize,
      handleIncreaseFontWeight,
      handleDecreaseFontWeight,
      handleAlignChange,
    ],
  );
}

