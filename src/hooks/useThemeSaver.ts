import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedSettingsPatch, SavedSettings } from '@types';
import type { DefaultTheme } from 'styled-components/native';

export interface UseThemeSaverArgs {
  selectedThemeName: string;
  selectedAccentColor: string;
  selectedFontName: string;
  fontWeight: DefaultTheme['fontWeight'];
  fontSizeLevel: number;
  noteTextAlign: DefaultTheme['noteTextAlign'];
  setTheme: Dispatch<SetStateAction<DefaultTheme>>;
}

const SETTINGS_KEY = 'ft:settings';

export function useThemeSaver({
  selectedThemeName,
  selectedAccentColor,
  selectedFontName,
  fontWeight,
  fontSizeLevel,
  noteTextAlign,
  setTheme,
}: UseThemeSaverArgs) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState<string>('transparent');
  const [overlayBlocks, setOverlayBlocks] = useState(false);

  const saveAndApply = useCallback(
    (patch: SavedSettingsPatch) => {
      const payload: SavedSettings = {
        themeName: selectedThemeName,
        accentColor: selectedAccentColor,
        fontName: selectedFontName,
        fontWeight,
        fontSizeLevel,
        noteTextAlign,
        ...patch,
      };
      void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
      setTheme(prev => ({ ...prev, ...patch }));
    },
    [
      selectedThemeName,
      selectedAccentColor,
      selectedFontName,
      fontWeight,
      fontSizeLevel,
      noteTextAlign,
      setTheme,
    ],
  );

  const runWithOverlay = useCallback((fn: () => void, color?: string) => {
    setOverlayBlocks(true);
    setOverlayVisible(true);
    setOverlayColor(color ?? 'transparent');
    fn();
    setOverlayVisible(false);
    setOverlayBlocks(false);
  }, []);

  return {
    saveAndApply,
    runWithOverlay,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
  };
}

export default useThemeSaver;

