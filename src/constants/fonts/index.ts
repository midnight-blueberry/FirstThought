export * from './types';
export { FONT_FAMILIES } from './families';
export { FONT_WEIGHTS_BY_FAMILY } from './weights';
export { FONT_SOURCES } from './variants';

import type { FontFamily, FontWeight } from './types';
import { FONT_FAMILIES } from './families';
import { FONT_WEIGHTS_BY_FAMILY } from './weights';

export const VARIABLE_FAMILIES: Partial<Record<FontFamily, true>> = {
  Comfortaa: true,
  Lora: true,
  Montserrat: true,
  Nata_Sans: true,
  Raleway: true,
  Roboto_Condensed: true,
  Roboto_Slab: true,
} as const;

export const isVariableFamily = (f: FontFamily): boolean => !!VARIABLE_FAMILIES[f];

export const closestAvailableWeight = (
  f: FontFamily,
  w: FontWeight,
): FontWeight => getNearestAllowedWeight(f, w);

const DEFAULT_FONT_SIZES: Record<FontFamily, number> = {
  Bad_Script: 22,
  Comfortaa: 18,
  Lora: 18,
  Montserrat: 18,
  Nata_Sans: 18,
  PT_Sans: 18,
  Raleway: 18,
  Roboto_Condensed: 18,
  Roboto_Slab: 18,
} as const;

export const fonts = (Object.keys(FONT_FAMILIES) as FontFamily[]).map(family => {
  const weights = [...FONT_WEIGHTS_BY_FAMILY[family]] as FontWeight[];
  const defaultWeight = (weights.includes(500) ? 500 : weights[0]) as FontWeight;
  return {
    name: FONT_FAMILIES[family],
    family,
    weights,
    defaultSize: DEFAULT_FONT_SIZES[family],
    defaultWeight,
  };
});

export const defaultFontName: string = FONT_FAMILIES.Comfortaa;

export function getNearestAllowedWeight(
  family: FontFamily,
  weight: FontWeight,
): FontWeight {
  const allowed = FONT_WEIGHTS_BY_FAMILY[family];
  if (allowed.includes(weight)) return weight;
  return allowed.reduce(
    (prev, curr) => (Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev),
    allowed[0],
  );
}

export const getNextFontWeight = (
  family: FontFamily,
  currentWeight: FontWeight,
): FontWeight => {
  const weights = FONT_WEIGHTS_BY_FAMILY[family];
  const idx = weights.indexOf(currentWeight);
  return idx >= 0 && idx < weights.length - 1 ? weights[idx + 1] : currentWeight;
};
