import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { fonts, FONT_VARIANTS, type FontWeight } from '@constants/fonts';
import type { DefaultTheme } from 'styled-components/native';
import useHeaderShadow from '@hooks/useHeaderShadow';
import useTheme from '@hooks/useTheme';
import { getFontByName } from '@utils/fontHelpers';
import { themes, type ThemeName } from '@theme/buildTheme';
import buildSectionProps from './buildSectionProps';
import type { SettingsVm } from './useSettingsVm.types';
import { useSettings, type Settings } from '@/state/SettingsContext';
import {
  useLocalSettingsState,
  buildSettingsPatch,
  useSettingsHandlers,
} from '@/components/pages/settings';
import { useOverlayTransition } from '@/components/settings/overlay';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import { showErrorToast } from '@utils/showErrorToast';
import { getStickySelectionContext } from '@/features/sticky-position';
import { useSettingsDirty } from './useSettingsDirty';

export default function useSettingsVm(
  captureBeforeUpdate: () => void,
): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const overlay = useOverlayTransition();
  const { showFor2s, hide } = useSaveIndicator();
  const { settings, updateSettings } = useSettings();

  const overlaySaveIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const overlaySaveIndicatorDelayMs = 250;

  const clearOverlaySaveIndicatorTimeout = () => {
    if (overlaySaveIndicatorTimeoutRef.current) {
      clearTimeout(overlaySaveIndicatorTimeoutRef.current);
      overlaySaveIndicatorTimeoutRef.current = null;
    }
  };

  const {
    selectedThemeName,
    setSelectedThemeName,
    selectedAccentColor,
    setSelectedAccentColor,
    selectedFontName,
    setSelectedFontName,
    fontWeight,
    setFontWeightState,
    fontSizeLevel,
    setFontSizeLevel,
    noteTextAlign,
    setNoteTextAlign,
    settingsVersion,
    setSettingsVersion,
  } = useLocalSettingsState(settings);

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const settingsSnapshot = useRef<Settings | null>(null);

  const setSettingsSnapshot = (s: Settings) => {
    settingsSnapshot.current = JSON.parse(JSON.stringify(s)) as Settings;
  };

  const { isDirty, changedKeys } = useSettingsDirty(
    {
      selectedThemeName,
      selectedAccentColor,
      selectedFontName,
      fontWeight,
      fontSizeLevel,
      noteTextAlign,
    },
    settings,
  );

  const resetToSnapshot = (s: Settings) => {
    setSelectedThemeName(themes[s.themeId].name);
    setSelectedAccentColor(s.accent);
    setSelectedFontName(s.fontFamily);
    setFontWeightState(s.fontWeight);
    setFontSizeLevel(s.fontSizeLevel);
    setNoteTextAlign(s.noteTextAlign);
  };

  const handlers = useSettingsHandlers({
    setSelectedThemeName,
    setSelectedAccentColor,
    setSelectedFontName,
    setFontWeightState,
    setFontSizeLevel,
    setNoteTextAlign,
    setSettingsVersion,
  });

  const withSettingsTransaction = async (
    cb: () => void | Promise<void>,
    nextBackground?: string,
  ) => {
    const snapshot = JSON.parse(JSON.stringify(settings)) as Settings;
    try {
      if (nextBackground) {
        overlay.freezeBackground(nextBackground);
      }
      const sticky = getStickySelectionContext();
      let error: unknown;
      await sticky?.applyWithSticky(
        async () => {
          try {
            await cb();
          } catch (e) {
            error = e;
            updateSettings(snapshot);
            resetToSnapshot(snapshot);
            console.warn(e);
            throw e;
          }
        },
      );
      overlay.releaseBackground();
      if (error) {
        throw error;
      }
      await showFor2s();
    } catch (e) {
      overlay.releaseBackground();
      showErrorToast(
        e instanceof Error ? e.message : 'Ошибка сохранения настроек',
      );
    }
  };

  const withOverlayTransaction = async (
    cb: () => void | Promise<void>,
    nextBackground?: string,
  ) => {
    if (overlay.isBusy()) return;
    setSettingsSnapshot(settings);
    clearOverlaySaveIndicatorTimeout();
    hide();
    try {
      if (nextBackground) {
        overlay.freezeBackground(nextBackground);
      }
      await overlay.transact(async () => {
        try {
          await cb();
        } catch (error) {
          updateSettings(settingsSnapshot.current ?? settings);
          resetToSnapshot(settingsSnapshot.current ?? settings);
          throw error;
        }
      });
      clearOverlaySaveIndicatorTimeout();
      overlaySaveIndicatorTimeoutRef.current = setTimeout(() => {
        if (!overlay.isBusy()) {
          void showFor2s();
        }
      }, overlaySaveIndicatorDelayMs);
    } catch (e) {
      showErrorToast(
        e instanceof Error ? e.message : 'Ошибка сохранения настроек',
      );
    }
  };

  useEffect(() => () => clearOverlaySaveIndicatorTimeout(), []);

  const changeTheme = (name: string) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName: name,
        selectedAccentColor,
        selectedFontName,
        fontWeight,
        fontSizeLevel,
        noteTextAlign,
      },
      settings,
    );
    const nextBg = themes[(patch.themeId ?? settings.themeId)].colors.background;
    void withOverlayTransaction(
      async () => {
        handlers.onSelectTheme(name as ThemeName);
        updateSettings(patch);
      },
      nextBg,
    );
  };

  const changeAccent = (color: string) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor: color,
        selectedFontName,
        fontWeight,
        fontSizeLevel,
        noteTextAlign,
      },
      settings,
    );
    void withSettingsTransaction(async () => {
      handlers.onSelectAccent(color);
      updateSettings(patch);
    });
  };

  const changeFontFamily = (name: string) => {
    captureBeforeUpdate();
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName: name,
        fontWeight,
        fontSizeLevel,
        noteTextAlign,
      },
      settings,
    );
    void withSettingsTransaction(async () => {
      handlers.onSelectFontFamily(name);
      const next = updateSettings(patch);
      handlers.onChangeFontWeight(next.fontWeight);
    });
  };

  const changeFontWeight = (weight: DefaultTheme['fontWeight']) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName,
        fontWeight: weight as FontWeight,
        fontSizeLevel,
        noteTextAlign,
      },
      settings,
    );
    void withSettingsTransaction(async () => {
      const next = updateSettings(patch);
      handlers.onChangeFontWeight(next.fontWeight);
    });
  };

  const changeFontSize = (level: number) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName,
        fontWeight,
        fontSizeLevel: level,
        noteTextAlign,
      },
      settings,
    );
    const nextLevel = patch.fontSizeLevel ?? settings.fontSizeLevel;
    void withSettingsTransaction(async () => {
      handlers.onChangeFontSizeLevel(nextLevel);
      updateSettings(patch);
    });
  };

  const changeAlign = (align: typeof noteTextAlign) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName,
        fontWeight,
        fontSizeLevel,
        noteTextAlign: align,
      },
      settings,
    );
    void withSettingsTransaction(async () => {
      handlers.onChangeNoteTextAlign(align);
      updateSettings(patch);
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
    settingsVersion,
    isDirty,
    changedKeys,
  };
}
