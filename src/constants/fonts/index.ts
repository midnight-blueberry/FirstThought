export * from './types';
export { FAMILIES } from './families';
export { FONT_WEIGHTS } from './metadata';
export { FONT_VARIANTS } from './variants';
export { FONT_ALIASES } from './aliases';

import type { FontFamily, FontWeight as InternalFontWeight, FontSource } from './types';
import type { TextStyle } from 'react-native';
import { FONT_VARIANTS } from './variants';
import { getFontByName, adjustWeight } from '@utils/fontHelpers';
import { toFamilyKey } from '@utils/font';
type FontWeight = TextStyle['fontWeight'];

const DEFAULT_FONT_SIZES = {
  Bad_Script: 22,
  Comfortaa: 18,
  Lora: 18,
  Montserrat: 18,
  Nata_Sans: 18,
  PT_Sans: 18,
  Raleway: 18,
  Roboto_Condensed: 18,
  Roboto_Slab: 18,
} as const satisfies Record<FontFamily, number>;

export const fonts = (Object.keys(FONT_VARIANTS) as FontFamily[]).map(family => {
  const variants = FONT_VARIANTS[family] as Record<InternalFontWeight, { normal?: FontSource }>;
  const weights = Object.keys(variants) as InternalFontWeight[];
  const defaultWeight = weights.includes('500' as InternalFontWeight)
    ? ('500' as InternalFontWeight)
    : weights[0];
  const pairs = weights
    .filter((w) => !!variants[w]?.normal)
    .map((w) => [w, variants[w]!.normal as FontSource]);
  return {
    name: family.replace(/_/g, ' '),
    family,
    weights: weights.sort() as FontWeight[],
    files: Object.fromEntries(pairs) as Record<InternalFontWeight, FontSource>,
    defaultSize: DEFAULT_FONT_SIZES[family],
    defaultWeight,
  };
});

export const defaultFontName: string = 'Comfortaa';

export const getFontFamily = (family: string, weight: string) => `${family}_${weight}`;

export const getNextFontWeight = (family: string, currentWeight: FontWeight) => {
  const name = family.replace(/_/g, ' ');
  const font = getFontByName(fonts, name);
  const next = adjustWeight(font, currentWeight, 1);
  return next ?? currentWeight;
};

export function resolveFontFace(
  familyName: string,
  weight: FontWeight,
  style: 'normal' | 'italic',
): { fontFamily: string; fontWeight: FontWeight; fontStyle: 'normal' | 'italic' } {
  const font = getFontByName(fonts, familyName);
  let chosen = weight;
  if (!font.weights.includes(weight)) {
    const adj = adjustWeight(font, weight, 0);
    chosen = (adj ?? font.defaultWeight) as FontWeight;
  }
  const fontFamily = getFontFamily(font.family, String(chosen));
  return { fontFamily, fontWeight: chosen, fontStyle: style };
}

const findFontByKey = (key: string) =>
  fonts.find(f => toFamilyKey(f.name) === key || toFamilyKey(f.family.replace(/_/g, ' ')) === key);

export const listAvailableWeights = (key: string): number[] => {
  const font = findFontByKey(key);
  return font ? font.weights.map(w => Number(w)) : [];
};

export const nearestAvailableWeight = (key: string, desired: number): number => {
  const weights = listAvailableWeights(key);
  if (!weights.length) return desired;
  return weights.reduce((prev, curr) =>
    Math.abs(curr - desired) < Math.abs(prev - desired) ? curr : prev,
  weights[0]);
};

export function resolveFont(key: string, weight: number) {
  const font = findFontByKey(key) ?? fonts[0];
  const clamped = nearestAvailableWeight(key, weight);
  const fontKey = getFontFamily(font.family, String(clamped));
  return {
    key: fontKey,
    weight: clamped,
    name: font.name,
    family: font.family,
    weights: font.weights.map(w => Number(w)),
  };
}
