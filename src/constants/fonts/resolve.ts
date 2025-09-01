import { FONT_WEIGHTS_BY_FAMILY } from './weights';
import type { FontFamily, FontWeight } from './types';

export const resolveFontFace = (family: FontFamily, weight: FontWeight): string => {
  const weights = FONT_WEIGHTS_BY_FAMILY[family];
  if (weights.includes(weight)) {
    return `${family}-${weight}`;
  }
  const nearest = weights.reduce(
    (prev, curr) =>
      Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev,
    weights[0],
  );
  return `${family}-${nearest}`;
};
