import { AVAILABLE_WEIGHTS } from './available-weights';
import type { FontFamily, FontWeight } from './types';

export function resolveAvailableWeight(family: FontFamily, requested: FontWeight): FontWeight {
  const list = [...AVAILABLE_WEIGHTS[family]] as FontWeight[];
  if (list.includes(requested)) return requested;
  return list.reduce((prev, curr) =>
    Math.abs(Number(curr) - Number(requested)) < Math.abs(Number(prev) - Number(requested)) ? curr : prev
  );
}
