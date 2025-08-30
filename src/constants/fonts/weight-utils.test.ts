import { getFontKey, resolveAvailableWeight } from './weight-utils';
import type { FontFamily, FontWeight } from './types';

describe('resolveAvailableWeight', () => {
  it('Comfortaa + 900 => 700', () => {
    expect(resolveAvailableWeight('Comfortaa' as FontFamily, '900' as FontWeight)).toBe('700');
  });

  it('Lora + 350 => 400', () => {
    expect(resolveAvailableWeight('Lora' as FontFamily, '350' as unknown as FontWeight)).toBe('400');
  });

  it('Montserrat + 850 => 800 or 900', () => {
    const resolved = resolveAvailableWeight('Montserrat' as FontFamily, '850' as unknown as FontWeight);
    expect(['800', '900']).toContain(resolved);
  });

  it('PT_Sans + 500 => 400', () => {
    expect(resolveAvailableWeight('PT_Sans' as FontFamily, '500' as FontWeight)).toBe('400');
  });
});

describe('getFontKey', () => {
  it('returns family with resolved weight', () => {
    expect(getFontKey('Comfortaa' as FontFamily, '900' as FontWeight)).toBe('Comfortaa_700');
  });
});
