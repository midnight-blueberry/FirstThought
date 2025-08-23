import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, InteractionManager } from 'react-native';
import { useTheme } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { buildTheme } from '@/src/theme/buildTheme';
import { saveSettings } from '@/src/storage/settings';
import { sizes } from '@/theme/tokens';
import { nextIconSize } from '@/src/settings/utils/font';
import { clampLevel } from '@/src/settings/utils/theme';
import type { SavedSettingsPatch } from '@/src/settings/types';

type Params = {
  selectedThemeName: string;
  selectedAccentColor: string;
  selectedFontName: string;
  fontWeight: DefaultTheme['fontWeight'];
  fontSizeLevel: number;
  noteTextAlign: DefaultTheme['noteTextAlign'];
  setTheme: React.Dispatch<React.SetStateAction<DefaultTheme>>;
};

export default function useThemeSaver({
  selectedThemeName,
  selectedAccentColor,
  selectedFontName,
  fontWeight,
  fontSizeLevel,
  noteTextAlign,
  setTheme,
}: Params) {
  const theme = useTheme();
  const [ , setIsSaved ] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaveIcon = useCallback(() => {
    setIsSaved(true);
    fadeAnim.stopAnimation();
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => setIsSaved(false));
    }, 3000);
  }, [fadeAnim]);

  const hideSaveIcon = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    fadeAnim.stopAnimation();
    fadeAnim.setValue(0);
    setIsSaved(false);
  }, [fadeAnim]);

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [ overlayVisible, setOverlayVisible ] = useState(false);
  const [ overlayBlocks, setOverlayBlocks ] = useState(false);
  const [ overlayColor, setOverlayColor ] = useState<string>(theme.colors.background);

  useEffect(() => {
    setOverlayColor(theme.colors.background);
  }, [theme.colors.background]);

  const saveAndApply = useCallback((patch: SavedSettingsPatch) => {
    const nextSaved = {
      themeName:        patch.themeName        ?? selectedThemeName,
      accentColor:      patch.accentColor      ?? selectedAccentColor,
      fontName:         patch.fontName         ?? selectedFontName,
      fontWeight:       patch.fontWeight       ?? fontWeight,
      fontSizeLevel:    clampLevel(patch.fontSizeLevel ?? fontSizeLevel),
      iconSize:         patch.iconSize         ?? ((): DefaultTheme['iconSize'] => {
        const level = clampLevel(patch.fontSizeLevel ?? fontSizeLevel);
        return nextIconSize(level, sizes.iconSize);
      })(),
      noteTextAlign:    patch.noteTextAlign    ?? noteTextAlign,
    };

    InteractionManager.runAfterInteractions(() => {
      setTheme(buildTheme(nextSaved));
    });
    void saveSettings(nextSaved);
  }, [selectedThemeName, selectedAccentColor, selectedFontName, fontWeight, fontSizeLevel, noteTextAlign, setTheme]);

  function animate(to: 0 | 1, duration = 180) {
    return new Promise<void>((resolve) => {
      Animated.timing(overlayAnim, { toValue: to, duration, useNativeDriver: true }).start(() => resolve());
    });
  }

  const runWithOverlay = useCallback(
    async (fn: () => void | Promise<void>, color?: string) => {
      setOverlayColor(color ?? theme.colors.background);
      hideSaveIcon();

      setOverlayVisible(true);
      setOverlayBlocks(true);

      overlayAnim.stopAnimation();
      overlayAnim.setValue(0);
      await animate(1);

      try {
        await Promise.resolve(fn());
      } finally {
        overlayAnim.stopAnimation();
        await animate(0);
        setOverlayBlocks(false);
        setOverlayVisible(false);
        showSaveIcon();
      }
    },
    [theme.colors.background, hideSaveIcon, showSaveIcon, overlayAnim]
  );

  const saveWithFeedback = useCallback((withOverlay: boolean, color?: string) => {
    const performSave = () => {
      saveAndApply({});
    };

    if (withOverlay) {
      runWithOverlay(performSave, color);
    } else {
      performSave();
      showSaveIcon();
    }
  }, [runWithOverlay, saveAndApply, showSaveIcon]);

  const saveWithFeedbackRef = useRef<(withOverlay: boolean, color?: string) => void>(saveWithFeedback);
  useEffect(() => {
    saveWithFeedbackRef.current = saveWithFeedback;
  }, [saveWithFeedback]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    saveAndApply,
    saveWithFeedback,
    runWithOverlay,
    showSaveIcon,
    hideSaveIcon,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
    saveWithFeedbackRef,
  };
}
