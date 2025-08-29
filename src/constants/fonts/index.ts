export * from './types';
export { FAMILIES } from './families';
export { FONT_WEIGHTS } from './metadata';
export { FONT_VARIANTS } from './variants';
export { FONT_ALIASES } from './aliases';

import type { FontFamily, FontWeight as InternalFontWeight, FontSource } from './types';
import type { TextStyle } from 'react-native';
import { FONT_VARIANTS } from './variants';
import { getFontByName, adjustWeight } from '@utils/fontHelpers';
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
