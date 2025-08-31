import { FONT_SOURCES } from './variants';
import { FONT_WEIGHTS_BY_FAMILY } from './weights';
import type { FontFamily, FontWeight } from './types';

// Map font family and weight to registered font face alias
export const FACE_BY_FAMILY_AND_WEIGHT: Record<FontFamily, Record<FontWeight, string>> =
  Object.fromEntries(
    Object.entries(FONT_WEIGHTS_BY_FAMILY).map(([family, weights]) => {
      const src = FONT_SOURCES[family as FontFamily];
      const mapping = Object.fromEntries(
        (weights as FontWeight[]).map(weight => [
          weight,
          'variable' in src ? family : `${family}-${weight}`,
        ]),
      );
      return [family, mapping];
    }),
  ) as Record<FontFamily, Record<FontWeight, string>>;

export const resolveFontFace = (family: FontFamily, weight: FontWeight): string => {
  const src = FONT_SOURCES[family];
  if ('variable' in src) return family;
  const table = FACE_BY_FAMILY_AND_WEIGHT[family];
  if (table[weight]) return table[weight];
  const avail = Object.keys(table).map(Number).sort((a, b) => a - b);
  const nearest = avail.reduce(
    (p, c) =>
      Math.abs(c - Number(weight)) < Math.abs(p - Number(weight)) ? c : p,
    avail[0],
  );
  return table[nearest as FontWeight];
};
