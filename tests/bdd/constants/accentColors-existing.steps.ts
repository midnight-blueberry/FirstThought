import { defineFeature, loadFeature } from 'jest-cucumber';

import { accentColors, defaultAccentColor } from '@/constants/AccentColors';

const feature = loadFeature('tests/bdd/constants/accentColors-existing.feature');

type StepDefinition = (matcher: string | RegExp, stepImplementation: (...args: unknown[]) => void) => void;

interface StepDefinitions {
  given: StepDefinition;
  when: StepDefinition;
  then: StepDefinition;
}

type Expectation = {
  toBe: (expected: unknown) => void;
};

type ExpectFn = (actual: unknown) => Expectation;

const { expect } = globalThis as unknown as { expect: ExpectFn };

type AccentColor = (typeof accentColors)[number];
type AccentColorList = readonly AccentColor[];

interface ScenarioContext {
  colors?: AccentColorList;
  checkedColors?: AccentColorList;
  foundNames?: string[];
  defaultColorName?: string;
}

const ensureColorsLoaded = (context: ScenarioContext): AccentColorList => {
  if (!context.colors) {
    throw new Error('Акцентные цвета не загружены');
  }

  return context.colors;
};

defineFeature(feature, (test) => {
  test('Список акцентных цветов состоит из 6 уникальных элементов', ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    given('загружены акцентные цвета', () => {
      context.colors = accentColors;
    });

    when('я проверяю список', () => {
      context.checkedColors = ensureColorsLoaded(context);
    });

    then('длина равна 6 и имена/hex уникальны', () => {
      const checkedColors = context.checkedColors ?? ensureColorsLoaded(context);

      expect(checkedColors.length).toBe(6);

      const seenNames: string[] = [];
      checkedColors.forEach((color) => {
        expect(seenNames.indexOf(color.name) !== -1).toBe(false);
        seenNames.push(color.name);
      });

      const seenHexes: string[] = [];
      checkedColors.forEach((color) => {
        expect(seenHexes.indexOf(color.hex) !== -1).toBe(false);
        seenHexes.push(color.hex);
      });
    });
  });

  test('Содержит заданные названия цветов', ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    given('загружены акцентные цвета', () => {
      context.colors = accentColors;
    });

    when('я ищу имена', () => {
      context.foundNames = ensureColorsLoaded(context).map((color) => color.name);
    });

    then('найдены: Красный, Оранжевый, Желтый, Зеленый, Синий, Фиолетовый', () => {
      const expectedNames = ['Красный', 'Оранжевый', 'Желтый', 'Зеленый', 'Синий', 'Фиолетовый'];
      const foundNames = context.foundNames ?? [];

      expectedNames.forEach((name) => {
        expect(foundNames.indexOf(name) !== -1).toBe(true);
      });
    });
  });

  test("Цвет по умолчанию соответствует 'Желтый'", ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    given('загружены акцентные цвета', () => {
      context.colors = accentColors;
    });

    when('я получаю цвет по умолчанию', () => {
      const colors = ensureColorsLoaded(context);

      for (const color of colors) {
        if (color.hex === defaultAccentColor) {
          context.defaultColorName = color.name;
          break;
        }
      }
    });

    then('его имя равно "Желтый"', () => {
      expect(context.defaultColorName).toBe('Желтый');
    });
  });
});
