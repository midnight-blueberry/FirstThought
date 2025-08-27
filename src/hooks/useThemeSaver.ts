import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Animated } from 'react-native';
import type { SavedSettingsPatch } from '@types';
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
      setTheme(prev => ({ ...prev, ...patch }));
    },
    [setTheme],
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

