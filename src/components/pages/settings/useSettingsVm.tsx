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
import type { SettingsMode } from '@/components/pages/settings/buildSettingsPatch';
import { useOverlayTransition } from '@/components/settings/overlay';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import { showErrorToast } from '@utils/showErrorToast';
import { getStickySelectionContext } from '@/features/sticky-position';
import { useSettingsDirty } from './useSettingsDirty';

export default function useSettingsVm(
  mode: SettingsMode,
  captureBeforeUpdate: () => void,
): SettingsVm;
export default function useSettingsVm(
  captureBeforeUpdate: () => void,
): SettingsVm;
export default function useSettingsVm(
  modeOrCaptureBeforeUpdate: SettingsMode | (() => void),
  captureBeforeUpdateArg?: () => void,
): SettingsVm {
  const mode =
    typeof modeOrCaptureBeforeUpdate === 'function'
      ? 'appAppearance'
      : modeOrCaptureBeforeUpdate;
  const captureBeforeUpdate =
    typeof modeOrCaptureBeforeUpdate === 'function'
      ? modeOrCaptureBeforeUpdate
      : (captureBeforeUpdateArg ?? (() => {}));
  const isNotesAppearance = mode === 'notesAppearance';
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const overlay = useOverlayTransition();
  const { showFor2s } = useSaveIndicator();
  const { settings, updateSettings } = useSettings();

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
    noteFontName,
    setNoteFontName,
    noteFontWeight,
    setNoteFontWeightState,
    noteFontSizeLevel,
    setNoteFontSizeLevel,
    noteTextAlign,
    setNoteTextAlign,
    settingsVersion,
    setSettingsVersion,
  } = useLocalSettingsState(settings);

  const activeFontName = isNotesAppearance ? noteFontName : selectedFontName;
  const activeFontWeight = isNotesAppearance ? noteFontWeight : fontWeight;
  const activeFontSizeLevel = isNotesAppearance ? noteFontSizeLevel : fontSizeLevel;

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const settingsSnapshot = useRef<Settings | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const setSettingsSnapshot = (s: Settings) => {
    settingsSnapshot.current = JSON.parse(JSON.stringify(s)) as Settings;
  };

  const { isDirty, changedKeys } = useSettingsDirty(
    {
      selectedThemeName,
      selectedAccentColor,
      selectedFontName: activeFontName,
      fontWeight: activeFontWeight,
      fontSizeLevel: activeFontSizeLevel,
      noteTextAlign,
    },
    settings,
    mode,
  );

  const resetToSnapshot = (s: Settings) => {
    setSelectedThemeName(themes[s.themeId].name);
    setSelectedAccentColor(s.accent);
    setSelectedFontName(s.fontFamily);
    setFontWeightState(s.fontWeight);
    setFontSizeLevel(s.fontSizeLevel);
    setNoteFontName(s.noteFontFamily ?? s.fontFamily);
    setNoteFontWeightState(s.noteFontWeight ?? s.fontWeight);
    setNoteFontSizeLevel(s.noteFontSizeLevel ?? s.fontSizeLevel);
    setNoteTextAlign(s.noteTextAlign);
  };

  const handlers = useSettingsHandlers({
    setSelectedThemeName,
    setSelectedAccentColor,
    setSelectedFontName,
    setFontWeightState,
    setFontSizeLevel,
    setNoteFontName,
    setNoteFontWeightState,
    setNoteFontSizeLevel,
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
      if (!isMountedRef.current) {
        return;
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
      if (!isMountedRef.current) {
        return;
      }
      await showFor2s();
    } catch (e) {
      showErrorToast(
        e instanceof Error ? e.message : 'Ошибка сохранения настроек',
      );
    }
  };

  const changeTheme = (name: string) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName: name,
        selectedAccentColor,
        selectedFontName: activeFontName,
        fontWeight: activeFontWeight,
        fontSizeLevel: activeFontSizeLevel,
        noteTextAlign,
      },
      settings,
      mode,
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
        selectedFontName: activeFontName,
        fontWeight: activeFontWeight,
        fontSizeLevel: activeFontSizeLevel,
        noteTextAlign,
      },
      settings,
      mode,
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
        fontWeight: activeFontWeight,
        fontSizeLevel: activeFontSizeLevel,
        noteTextAlign,
      },
      settings,
      mode,
    );
    void withSettingsTransaction(async () => {
      if (isNotesAppearance) {
        handlers.onSelectNoteFontFamily(name);
      } else {
        handlers.onSelectFontFamily(name);
      }
      const next = updateSettings(patch);
      if (isNotesAppearance) {
        handlers.onChangeNoteFontWeight(next.noteFontWeight ?? next.fontWeight);
      } else {
        handlers.onChangeFontWeight(next.fontWeight);
      }
    });
  };

  const changeFontWeight = (weight: DefaultTheme['fontWeight']) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName: activeFontName,
        fontWeight: weight as FontWeight,
        fontSizeLevel: activeFontSizeLevel,
        noteTextAlign,
      },
      settings,
      mode,
    );
    void withSettingsTransaction(async () => {
      const next = updateSettings(patch);
      if (isNotesAppearance) {
        handlers.onChangeNoteFontWeight(next.noteFontWeight ?? next.fontWeight);
      } else {
        handlers.onChangeFontWeight(next.fontWeight);
      }
    });
  };

  const changeFontSize = (level: number) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName: activeFontName,
        fontWeight: activeFontWeight,
        fontSizeLevel: level,
        noteTextAlign,
      },
      settings,
      mode,
    );
    const nextLevel = isNotesAppearance
      ? patch.noteFontSizeLevel ?? settings.noteFontSizeLevel
      : patch.fontSizeLevel ?? settings.fontSizeLevel;
    void withSettingsTransaction(async () => {
      if (isNotesAppearance) {
        handlers.onChangeNoteFontSizeLevel(
          nextLevel ?? settings.noteFontSizeLevel ?? settings.fontSizeLevel,
        );
      } else {
        handlers.onChangeFontSizeLevel(nextLevel ?? settings.fontSizeLevel);
      }
      updateSettings(patch);
    });
  };

  const changeAlign = (align: typeof noteTextAlign) => {
    const patch = buildSettingsPatch(
      {
        selectedThemeName,
        selectedAccentColor,
        selectedFontName: activeFontName,
        fontWeight: activeFontWeight,
        fontSizeLevel: activeFontSizeLevel,
        noteTextAlign: align,
      },
      settings,
      mode,
    );
    void withSettingsTransaction(async () => {
      handlers.onChangeNoteTextAlign(align);
      updateSettings(patch);
    });
  };

  const handleIncFontSize = () => changeFontSize(activeFontSizeLevel + 1);
  const handleDecFontSize = () => changeFontSize(activeFontSizeLevel - 1);
  const handleIncWeight = () => {
    const meta = getFontByName(fonts, activeFontName);
    const variantMap = FONT_VARIANTS[meta.family];
    const weights = variantMap
      ? Object.keys(variantMap).map(Number).sort((a, b) => a - b)
      : [400];
    const idx = weights.indexOf(Number(activeFontWeight));
    const next = weights[(idx + 1) % weights.length];
    changeFontWeight(String(next) as FontWeight);
  };
  const handleDecWeight = () => {
    const meta = getFontByName(fonts, activeFontName);
    const variantMap = FONT_VARIANTS[meta.family];
    const weights = variantMap
      ? Object.keys(variantMap).map(Number).sort((a, b) => a - b)
      : [400];
    const idx = weights.indexOf(Number(activeFontWeight));
    const next = weights[(idx - 1 + weights.length) % weights.length];
    changeFontWeight(String(next) as FontWeight);
  };

  const sectionProps = useMemo(
    () => ({
      ...buildSectionProps({
        selectedThemeName,
        selectedAccentColor,
        selectedFontName: activeFontName,
        fontListSizeLevel: fontSizeLevel,
        fontSizeLevel: activeFontSizeLevel,
        fontWeight: activeFontWeight,
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
      preview: {
        noteTextAlign,
        colors: theme.colors,
        fontName: settings.noteFontFamily ?? settings.fontFamily,
        fontWeight: settings.noteFontWeight ?? settings.fontWeight,
        fontSizeLevel: settings.noteFontSizeLevel ?? settings.fontSizeLevel,
      },
    }),
    [
      selectedThemeName,
      selectedAccentColor,
      activeFontName,
      activeFontSizeLevel,
      activeFontWeight,
      fontSizeLevel,
      noteTextAlign,
      settings.noteFontFamily,
      settings.noteFontWeight,
      settings.noteFontSizeLevel,
      settings.fontFamily,
      settings.fontWeight,
      settings.fontSizeLevel,
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
