import { useCallback, useEffect, useState } from 'react';
import type { DefaultTheme } from 'styled-components/native';
import type { Animated } from 'react-native';
import useBlinkAnimation from '@hooks/useBlinkAnimation';
import useBlinkIndex from '@hooks/useBlinkIndex';
import { getFontByName, adjustWeight } from '@utils/fontHelpers';

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
  clampLevel,
  maxLevel,
  minLevel,
}: Params) {
  const [selectedFontName, setSelectedFontName] = useState(initial.fontName);
  const [fontWeight, setFontWeight] = useState<DefaultTheme['fontWeight']>(initial.fontWeight);
  const [fontSizeLevel, setFontSizeLevel] = useState(initial.fontSizeLevel);

  const {
    index: fontSizeBlinkIndex,
    blinkAnim: fontSizeBlinkAnim,
    blinkAt: blinkFontSizeAt,
    stopBlink: stopFontBlink,
  } = useBlinkIndex();
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
      setSelectedFontName(name);
      setFontWeight(weight);
    },
    [fonts],
  );

  const applyFontSizeLevel = useCallback(
    (level: number) => {
      const next = clampLevel(level, minLevel, maxLevel);
      setFontSizeLevel(next);
    },
    [clampLevel, minLevel, maxLevel],
  );

  const bumpFontSize = useCallback(
    (delta: number) => {
      stopFontBlink();
      if ((delta < 0 && fontSizeLevel <= minLevel) || (delta > 0 && fontSizeLevel >= maxLevel)) {
        blinkFontSizeAt(delta < 0 ? 0 : maxLevel - 1);
        return;
      }
      applyFontSizeLevel(fontSizeLevel + delta);
    },
    [stopFontBlink, fontSizeLevel, minLevel, maxLevel, blinkFontSizeAt, applyFontSizeLevel],
  );

  const bumpFontWeight = useCallback(
    (delta: number) => {
      const font = getFontByName(fonts, selectedFontName);
      stopWeightBlink();
      const nextWeight = adjustWeight(font, fontWeight as string, delta) as
        | DefaultTheme['fontWeight']
        | undefined;
      if (nextWeight) {
        setFontWeight(nextWeight);
      } else {
        triggerWeightBlink();
      }
    },
    [fonts, selectedFontName, fontWeight, stopWeightBlink, triggerWeightBlink],
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

