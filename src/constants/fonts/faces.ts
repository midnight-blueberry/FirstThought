import { FONT_WEIGHTS_BY_FAMILY } from './weights';
import type { FontFamily, FontWeight } from './types';

// Map font family and weight to registered font face alias
export const FACE_BY_FAMILY_AND_WEIGHT: Record<FontFamily, Record<FontWeight, string>> =
  Object.fromEntries(
    Object.entries(FONT_WEIGHTS_BY_FAMILY).map(([family, weights]) => [
      family,
      Object.fromEntries(
        (weights as FontWeight[]).map(weight => [weight, `${family}-${weight}`])
      ),
    ])
  ) as Record<FontFamily, Record<FontWeight, string>>;

export const resolveFontFace = (family: FontFamily, weight: FontWeight): string => {
  const table = FACE_BY_FAMILY_AND_WEIGHT[family];
  if (table[weight]) return table[weight];

  const available = Object.keys(table)
    .map(n => Number(n))
    .sort((a, b) => a - b);
  const w = Number(weight);
  const nearest = available.reduce((p, c) =>
    Math.abs(c - w) < Math.abs(p - w) ? c : p,
  available[0]);
  return table[nearest as FontWeight];
};
