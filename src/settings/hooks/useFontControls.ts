import { useCallback, useEffect, useState } from 'react';
import type { DefaultTheme } from 'styled-components/native';
import type { Animated } from 'react-native';
import useBlinkAnimation from '@/hooks/useBlinkAnimation';
import { getFontByName, adjustWeight } from '@/src/settings/utils/fontHelpers';

export type FontInfo = {
  name: string;
  weights: string[];
  defaultWeight: string;
  defaultSize: number;
};

type InitialState = {
  fontName: string;
  fontWeight: DefaultTheme['fontWeight'];
  fontSizeLevel: number;
};

type Params = {
  fonts: FontInfo[];
  initial: InitialState;
  saveAndApply: (patch: {
    fontName?: string;
    fontWeight?: DefaultTheme['fontWeight'];
    fontSizeLevel?: number;
  }) => void;
  runWithOverlay: (action: () => void, color?: string) => void;
  clampLevel: (n: number, min?: number, max?: number) => number;
  maxLevel: number;
  minLevel: number;
};

type BlinkState = {
  size: { index: number | null; anim: Animated.Value };
  weight: { anim: Animated.Value };
};

export default function useFontControls({
  fonts,
  initial,
  saveAndApply,
  runWithOverlay,
  clampLevel,
  maxLevel,
  minLevel,
}: Params) {
  const [selectedFontName, setSelectedFontName] = useState(initial.fontName);
  const [fontWeight, setFontWeight] = useState<DefaultTheme['fontWeight']>(initial.fontWeight);
  const [fontSizeLevel, setFontSizeLevel] = useState(initial.fontSizeLevel);

  const [fontSizeBlinkIndex, setFontSizeBlinkIndex] = useState<number | null>(null);
  const {
    blinkAnim: fontSizeBlinkAnim,
    triggerBlink: triggerFontBlink,
    stopBlink: stopFontBlink,
  } = useBlinkAnimation({ onEnd: () => setFontSizeBlinkIndex(null) });
  const { blinkAnim: fontWeightBlinkAnim, triggerBlink: triggerWeightBlink, stopBlink: stopWeightBlink } = useBlinkAnimation();

  useEffect(() => {
    setSelectedFontName(initial.fontName);
    setFontWeight(initial.fontWeight);
    setFontSizeLevel(initial.fontSizeLevel);
  }, [initial.fontName, initial.fontWeight, initial.fontSizeLevel]);

  const selectFont = useCallback(
    (name: string) => {
      const font = getFontByName(fonts, name);
      const weight = font.defaultWeight as DefaultTheme['fontWeight'];
      runWithOverlay(() => {
        setSelectedFontName(name);
        setFontWeight(weight);
        saveAndApply({ fontName: name, fontWeight: weight });
      });
    },
    [fonts, runWithOverlay, saveAndApply],
  );

  const applyFontSizeLevel = useCallback(
    (level: number) => {
      const next = clampLevel(level, minLevel, maxLevel);
      runWithOverlay(() => {
        setFontSizeLevel(next);
        saveAndApply({ fontSizeLevel: next });
      });
    },
    [clampLevel, minLevel, maxLevel, runWithOverlay, saveAndApply],
  );

  const bumpFontSize = useCallback(
    (delta: number) => {
      if (fontSizeBlinkIndex !== null) stopFontBlink();
      if ((delta < 0 && fontSizeLevel <= minLevel) || (delta > 0 && fontSizeLevel >= maxLevel)) {
        setFontSizeBlinkIndex(delta < 0 ? 0 : maxLevel - 1);
        triggerFontBlink();
        return;
      }
      applyFontSizeLevel(fontSizeLevel + delta);
    },
    [fontSizeBlinkIndex, stopFontBlink, fontSizeLevel, minLevel, maxLevel, triggerFontBlink, applyFontSizeLevel],
  );

  const bumpFontWeight = useCallback(
    (delta: number) => {
      const font = getFontByName(fonts, selectedFontName);
      stopWeightBlink();
      const nextWeight = adjustWeight(font, fontWeight as string, delta) as
        | DefaultTheme['fontWeight']
        | undefined;
      if (nextWeight) {
        runWithOverlay(() => {
          setFontWeight(nextWeight);
          saveAndApply({ fontWeight: nextWeight });
        });
      } else {
        triggerWeightBlink();
      }
    },
    [fonts, selectedFontName, fontWeight, stopWeightBlink, triggerWeightBlink, runWithOverlay, saveAndApply],
  );

  const blinkState: BlinkState = {
    size: { index: fontSizeBlinkIndex, anim: fontSizeBlinkAnim },
    weight: { anim: fontWeightBlinkAnim },
  };

  return {
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    selectFont,
    bumpFontWeight,
    bumpFontSize,
    blinkState,
  };
}

