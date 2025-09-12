import { computeDelta } from '@/features/sticky-position';

describe('computeDelta', () => {
  it('calculates delta from measurements', () => {
    expect(computeDelta(100, 120, 60)).toBe(50);
    expect(computeDelta(200, 150, 20)).toBe(-40);
  });
});
