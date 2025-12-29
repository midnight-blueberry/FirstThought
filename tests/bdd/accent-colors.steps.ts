import { accentColors, defaultAccentColor } from '@/constants/AccentColors';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('Accent colors list has six unique items', ({ given, then }: StepDefinitions) => {
    given('the accent colors list', () => {
      expect(accentColors).toHaveLength(6);
    });

    then('it contains 6 unique items by name and hex', () => {
      const names = new Set<string>();
      const hexes = new Set<string>();

      accentColors.forEach((color) => {
        expect(names.has(color.name)).toBe(false);
        expect(hexes.has(color.hex)).toBe(false);

        names.add(color.name);
        hexes.add(color.hex);
      });
    });
  });

  test('Accent color entries have correct types and format', ({ given, then }: StepDefinitions) => {
    given('the accent colors list', () => {
      expect(accentColors.length).toBeGreaterThan(0);
    });

    then('each entry has string name and hex in #RRGGBB format', () => {
      accentColors.forEach((color) => {
        expect(typeof color.name).toBe('string');
        expect(typeof color.hex).toBe('string');
        expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  test('Accent colors include all expected names', ({ given, then }: StepDefinitions) => {
    given('the accent colors list', () => {
      expect(accentColors).toHaveLength(6);
    });

    then('it includes the expected color names', () => {
      const expectedColors = ['Красный', 'Оранжевый', 'Желтый', 'Зеленый', 'Синий', 'Фиолетовый'];

      expectedColors.forEach((color) => {
        expect(accentColors.find((element) => element.name === color)).toBeTruthy();
      });
    });
  });

  test('Default accent color is yellow', ({ given, then }: StepDefinitions) => {
    given('the accent colors list', () => {
      expect(accentColors).toHaveLength(6);
    });

    then('the default accent color corresponds to "Желтый"', () => {
      const def = accentColors.find((color) => color.hex === defaultAccentColor);
      expect(def).toBeDefined();
      expect(def!.name).toBe('Желтый');
    });
  });
};
