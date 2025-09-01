// src/constants/fonts/resolve.ts
import { FONT_FILES } from "./files";

type Weight = 100|200|300|400|500|600|700|800|900;

export function listAvailableWeights(family: string): number[] {
  const map = (FONT_FILES as any)[family] as Record<number, any> | undefined;
  if (!map) return [];
  return Object.keys(map).map(Number).sort((a, b) => a - b);
}

export function nearestAvailableWeight(family: string, requested: number): Weight {
  const available = listAvailableWeights(family) as Weight[];
  if (!available.length) return 400; // дефолт
  if (available.includes(requested as Weight)) return requested as Weight;

  let best = available[0];
  let bestDiff = Math.abs(requested - best);
  for (const w of available) {
    const d = Math.abs(requested - w);
    if (d < bestDiff) { best = w; bestDiff = d; }
  }
  return best as Weight;
}

export function fontKey(family: string, weight: number): string {
  return `${family}-${weight}`;
}

export function resolveFont(family: string, requested: number) {
  const weight = nearestAvailableWeight(family, requested);
  const file = (FONT_FILES as any)?.[family]?.[weight];
  return { key: fontKey(family, weight), weight, file };
}
