import { defineFeature, loadFeature } from 'jest-cucumber';

import { accentColors, defaultAccentColor } from '@/constants/AccentColors';

const feature = loadFeature('tests/bdd/constants/AccentColors.feature');

type StepDefinition = (matcher: string | RegExp, stepImplementation: (...args: unknown[]) => void) => void;

interface StepDefinitions {
  given: StepDefinition;
  then: StepDefinition;
  and?: StepDefinition;
}

type AccentColor = (typeof accentColors)[number];

defineFeature(feature, (test) => {
  test('Проверка accentColors и defaultAccentColor', ({ given, then, and }: StepDefinitions) => {
    let loadedAccentColors: readonly AccentColor[] | undefined;
    let loadedDefaultAccentColor: string | undefined;

    given('я загружаю accentColors и defaultAccentColor', () => {
      loadedAccentColors = accentColors;
      loadedDefaultAccentColor = defaultAccentColor;
    });

    then('длина accentColors равна 6', () => {
      if (!loadedAccentColors) {
        throw new Error('accentColors не загружены');
      }

      expect(loadedAccentColors.length).toBe(6);
    });

    const andStep = and ?? then;

    andStep('название цвета по hex из defaultAccentColor равно "Желтый"', () => {
      if (!loadedAccentColors) {
        throw new Error('accentColors не загружены');
      }

      if (!loadedDefaultAccentColor) {
        throw new Error('defaultAccentColor не загружен');
      }

      const colorByDefault = loadedAccentColors.find(
        (color) => color.hex === loadedDefaultAccentColor,
      );

      expect(colorByDefault?.name).toBe('Желтый');
    });
  });
});
