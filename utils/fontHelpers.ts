export type FontMeta = {
  name: string;
  weights: string[];
  [key: string]: unknown;
};

export function getFontByName<T extends FontMeta>(fonts: T[], name: string): T {
  return fonts.find(f => f.name === name) ?? fonts[0];
}

export function getWeightIndex(font: { weights: string[] }, weight: string): number {
  return font.weights.indexOf(weight);
}

export function adjustWeight<T extends { weights: string[] }>(
  font: T,
  weight: string,
  delta: number,
): string | undefined {
  const idx = getWeightIndex(font, weight);
  const nextIdx = idx + delta;
  return nextIdx >= 0 && nextIdx < font.weights.length ? font.weights[nextIdx] : undefined;
}

export function hasMultipleWeights(font: { weights: string[] }): boolean {
  return font.weights.length > 1;
}
