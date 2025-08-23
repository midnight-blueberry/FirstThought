import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, InteractionManager } from 'react-native';
import { useTheme } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { buildTheme } from '@/src/theme/buildTheme';
import { saveSettings } from '@/src/storage/settings';
import { sizes } from '@/constants/theme/tokens';
import { nextIconSize } from '@/utils/font';
import { clampLevel } from '@/utils/theme';
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
  const [ overlayColor, setOverlayColor ] = useState(theme.colors.background);
  const [ overlayBlocks, setOverlayBlocks ] = useState(false);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const runWithOverlay = useCallback(
    (action: () => void, color?: string) => {
      setOverlayColor(color ?? theme.colors.background);

      if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); saveTimerRef.current = null; }
      if (overlayTimerRef.current) { clearTimeout(overlayTimerRef.current); overlayTimerRef.current = null; }

      overlayAnim.stopAnimation();
      fadeAnim.stopAnimation();

      setOverlayVisible(true);
      setOverlayBlocks(true);
      overlayAnim.setValue(0);

      const startFadeOut = () => {
        setOverlayBlocks(false);
        overlayTimerRef.current = setTimeout(() => {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }).start(() => {
            setOverlayVisible(false);
            overlayTimerRef.current = null;
            showSaveIcon();
          });
        }, 100);
      };

      hideSaveIcon();
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        action();
        startFadeOut();
      });
    },
    [overlayAnim, fadeAnim, theme.colors.background, hideSaveIcon, showSaveIcon]
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
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
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
