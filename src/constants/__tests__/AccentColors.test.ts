import { accentColors, defaultAccentColor } from '@/constants/AccentColors';

describe('AccentColors constants', () => {
  it('accentColors has length 6 and unique valid entries', () => {
    expect(accentColors).toHaveLength(6);

    const names = new Set<string>();
    const hexes = new Set<string>();

    accentColors.forEach((color) => {
      expect(typeof color.name).toBe('string');
      expect(typeof color.hex).toBe('string');
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);

      expect(names.has(color.name)).toBe(false);
      expect(hexes.has(color.hex)).toBe(false);

      names.add(color.name);
      hexes.add(color.hex);
    });
  });

  it('defaultAccentColor matches accentColors[2] and #FFCD00', () => {
    expect(defaultAccentColor).toBe(accentColors[2].hex);
    expect(defaultAccentColor).toBe('#FFCD00');
  });
});

