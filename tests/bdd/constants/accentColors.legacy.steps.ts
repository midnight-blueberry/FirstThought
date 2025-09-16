import { defineFeature, loadFeature } from 'jest-cucumber';

import { accentColors, defaultAccentColor } from '@/constants/AccentColors';

const feature = loadFeature('tests/bdd/constants/accentColors.feature');

type StepDefinition = (matcher: string | RegExp, stepImplementation: (...args: any[]) => void) => void;

interface StepDefinitions {
  given: StepDefinition;
  when: StepDefinition;
  then: StepDefinition;
}

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

      expect(checkedColors).toHaveLength(6);

      const uniqueNames = new Set(checkedColors.map((color) => color.name));
      expect(uniqueNames.size).toBe(checkedColors.length);

      const uniqueHexes = new Set(checkedColors.map((color) => color.hex));
      expect(uniqueHexes.size).toBe(checkedColors.length);
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
        expect(foundNames).toContain(name);
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
      context.defaultColorName = colors.find((color) => color.hex === defaultAccentColor)?.name;
    });

    then('его имя равно "Желтый"', () => {
      expect(context.defaultColorName).toBe('Желтый');
    });
  });
});
