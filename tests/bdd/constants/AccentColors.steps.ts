import { defineFeature, loadFeature } from 'jest-cucumber';

import { accentColors, defaultAccentColor } from '@/constants/AccentColors';

type StepDefinition = (matcher: string | RegExp, stepImplementation: (...args: unknown[]) => void) => void;

interface StepDefinitions {
  given: StepDefinition;
  then: StepDefinition;
  and: StepDefinition;
}

type Expectation = {
  toBe: (expected: unknown) => void;
  toBeDefined: () => void;
};

type ExpectFn = (actual: unknown) => Expectation;

const { expect } = globalThis as unknown as { expect: ExpectFn };

const feature = loadFeature('tests/bdd/constants/AccentColors.feature');

defineFeature(feature, (test) => {
  test('Default accent color matches expected color', ({ given, then, and }: StepDefinitions) => {
    let loadedAccentColors: typeof accentColors | undefined;
    let loadedDefaultAccentColor: typeof defaultAccentColor | undefined;

    given('я загружаю accentColors и defaultAccentColor', () => {
      loadedAccentColors = accentColors;
      loadedDefaultAccentColor = defaultAccentColor;
    });

    then('длина accentColors равна 6', () => {
      if (!loadedAccentColors) {
        throw new Error('accentColors not loaded');
      }

      expect(loadedAccentColors.length).toBe(6);
    });

    and('название цвета по hex из defaultAccentColor равно "Желтый"', () => {
      if (!loadedAccentColors || !loadedDefaultAccentColor) {
        throw new Error('accentColors or defaultAccentColor not loaded');
      }

      let colorName: string | undefined;

      for (const color of loadedAccentColors) {
        if (color.hex === loadedDefaultAccentColor) {
          colorName = color.name;
          break;
        }
      }

      expect(colorName).toBe('Желтый');
    });
  });
});
