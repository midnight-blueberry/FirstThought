import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type { SavedSettingsPatch } from '@types';

export interface UseThemeSaverArgs {
  setTheme: (patch: SavedSettingsPatch) => void;
}

export function useThemeSaver({ setTheme }: UseThemeSaverArgs) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState<string>('transparent');
  const [overlayBlocks, setOverlayBlocks] = useState(false);

  const saveAndApply = useCallback(
    (patch: SavedSettingsPatch) => {
      setTheme(patch);
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

