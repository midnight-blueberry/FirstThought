export function clampLevel(n: number, min = 1, max = 5): number {
  return Math.min(Math.max(n, min), max);
}
