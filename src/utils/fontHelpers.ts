import type { TextStyle } from 'react-native';
type FontWeight = TextStyle['fontWeight'];

export type FontMeta = {
  name: string;
  weights: FontWeight[];
  [key: string]: unknown;
};

export function getFontByName<T extends FontMeta>(fonts: T[], name: string): T {
  return fonts.find(f => f.name === name) ?? fonts[0];
}

export function getWeightIndex(font: { weights: FontWeight[] }, weight: FontWeight): number {
  return font.weights.indexOf(weight);
}

export function adjustWeight<T extends { weights: FontWeight[] }>(
  font: T,
  weight: FontWeight,
  delta: number,
): FontWeight | undefined {
  const idx = getWeightIndex(font, weight);
  const nextIdx = idx + delta;
  return nextIdx >= 0 && nextIdx < font.weights.length ? font.weights[nextIdx] : undefined;
}

export function hasMultipleWeights(font: { weights: FontWeight[] }): boolean {
  return font.weights.length > 1;
}
