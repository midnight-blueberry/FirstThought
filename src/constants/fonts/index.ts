export * from './types';
export { FAMILIES } from './families';
export { FONT_WEIGHTS } from './metadata';
export { FONT_VARIANTS, FONT_KEYS } from './variants';
export { FONT_ALIASES } from './aliases';

import type { FontFamily, FontWeight as InternalFontWeight, FontSource } from './types';
import type { TextStyle } from 'react-native';
import { FONT_VARIANTS, FONT_KEYS } from './variants';
import { FONT_FILES } from './files';
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

export const fonts = (Object.keys(FONT_FILES) as FontFamily[]).map(family => {
  const weightsNums = FONT_VARIANTS[family];
  const weights = weightsNums.map(w => String(w) as InternalFontWeight);
  const defaultWeight = weights.includes('500' as InternalFontWeight)
    ? ('500' as InternalFontWeight)
    : weights[0];
  const files = Object.fromEntries(
    weights.map(w => [w, (FONT_FILES as Record<string, Record<number, FontSource>>)[family][Number(w)]])
  ) as Record<InternalFontWeight, FontSource>;
  return {
    name: family.replace(/_/g, ' '),
    family,
    weights: weights.sort() as FontWeight[],
    files,
    defaultSize: DEFAULT_FONT_SIZES[family],
    defaultWeight,
  };
});

export const defaultFontName: string = 'Comfortaa';

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
  const fontFamily = FONT_KEYS[font.family][Number(chosen)];
  return { fontFamily, fontWeight: chosen, fontStyle: style };
}
