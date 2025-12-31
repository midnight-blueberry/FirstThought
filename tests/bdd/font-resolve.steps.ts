import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

export default (test: JestCucumberTestFn) => {
  test('listAvailableWeights returns sorted weights', ({ given, when, then }: StepDefinitions) => {
    const family = 'TestFamily';
    let result: number[] = [];

    given('a font family with weights 700 and 400', () => {
      // font weights are defined in the mock
    });

    when('I list available weights', async () => {
      jest.resetModules();
      jest.doMock('@constants/fonts/files', () => ({
        FONT_FILES: { [family]: { 700: 'file700.ttf', 400: 'file400.ttf' } },
      }));

      const { listAvailableWeights } = await import('@constants/fonts/resolve');
      result = listAvailableWeights(family);
    });

    then('the result equals [400, 700]', () => {
      expect(result).toEqual([400, 700]);
    });
  });

  test('nearestAvailableWeight returns an exact match', ({ given, when, then }: StepDefinitions) => {
    const family = 'TestFamily';
    let result: number | null = null;

    given('a font family with weights 700 and 400', () => {
      // font weights are defined in the mock
    });

    when('I request nearest weight 700', async () => {
      jest.resetModules();
      jest.doMock('@constants/fonts/files', () => ({
        FONT_FILES: { [family]: { 700: 'file700.ttf', 400: 'file400.ttf' } },
      }));

      const { nearestAvailableWeight } = await import('@constants/fonts/resolve');
      result = nearestAvailableWeight(family, 700);
    });

    then('the nearest weight equals 700', () => {
      expect(result).toBe(700);
    });
  });

  test('nearestAvailableWeight returns the closest weight', ({ given, when, then }: StepDefinitions) => {
    const family = 'TestFamily';
    let result: number | null = null;

    given('a font family with weights 700 and 400', () => {
      // font weights are defined in the mock
    });

    when('I request nearest weight 600', async () => {
      jest.resetModules();
      jest.doMock('@constants/fonts/files', () => ({
        FONT_FILES: { [family]: { 700: 'file700.ttf', 400: 'file400.ttf' } },
      }));

      const { nearestAvailableWeight } = await import('@constants/fonts/resolve');
      result = nearestAvailableWeight(family, 600);
    });

    then('the nearest weight equals 700', () => {
      expect(result).toBe(700);
    });
  });

  test('nearestAvailableWeight prefers the lower weight on a tie', ({ given, when, then }: StepDefinitions) => {
    const family = 'TestFamily';
    let result: number | null = null;

    given('a font family with weights 700 and 400', () => {
      // font weights are defined in the mock
    });

    when('I request nearest weight 550', async () => {
      jest.resetModules();
      jest.doMock('@constants/fonts/files', () => ({
        FONT_FILES: { [family]: { 700: 'file700.ttf', 400: 'file400.ttf' } },
      }));

      const { nearestAvailableWeight } = await import('@constants/fonts/resolve');
      result = nearestAvailableWeight(family, 550);
    });

    then('the nearest weight equals 400', () => {
      expect(result).toBe(400);
    });
  });

  test('resolveFont returns the key, weight, and file for the nearest weight', ({ given, when, then }: StepDefinitions) => {
    const family = 'TestFamily';
    let result: { key: string; weight: number; file: string | undefined } | null = null;

    given('a font family with weights 700 and 400', () => {
      // font weights are defined in the mock
    });

    when('I resolve the font for weight 600', async () => {
      jest.resetModules();
      jest.doMock('@constants/fonts/files', () => ({
        FONT_FILES: { [family]: { 700: 'file700.ttf', 400: 'file400.ttf' } },
      }));

      const { resolveFont } = await import('@constants/fonts/resolve');
      result = resolveFont(family, 600);
    });

    then('the resolved font matches the 700 weight file', () => {
      expect(result).toEqual({ key: 'TestFamily-700', weight: 700, file: 'file700.ttf' });
    });
  });
};
