import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

type FontVariantsShape = Readonly<
  Record<string, Partial<Record<string, Partial<Record<'normal', string>>>>>
>;

export default (test: JestCucumberTestFn) => {
  const family = 'TestFamily';

  const loadFontVariants = async (): Promise<FontVariantsShape> => {
    jest.resetModules();
    jest.doMock('@constants/fonts/files', () => ({
      FONT_FILES: {
        [family]: {
          700: 'file700.ttf',
          400: 'file400.ttf',
        },
      },
    }));

    const { FONT_VARIANTS } = await import('@constants/fonts/variants');
    return FONT_VARIANTS as FontVariantsShape;
  };

  test('maps numeric weights to string weight keys', ({ given, when, then }: StepDefinitions) => {
    let fontVariants: FontVariantsShape | null = null;

    given('mocked font files for TestFamily with weights 700 and 400', () => {
      // mock is applied before import in the when step
    });

    when('I import font variants from constants', async () => {
      fontVariants = await loadFontVariants();
    });

    then("TestFamily has string weight keys ['400', '700']", () => {
      const keys = Object.keys(fontVariants?.[family] ?? {}).sort();
      expect(keys).toEqual(['400', '700']);
    });
  });

  test('maps each weight to the expected normal file', ({ given, when, then }: StepDefinitions) => {
    let fontVariants: FontVariantsShape | null = null;

    given('mocked font files for TestFamily with weights 700 and 400', () => {
      // mock is applied before import in the when step
    });

    when('I import font variants from constants', async () => {
      fontVariants = await loadFontVariants();
    });

    then('TestFamily maps weight 400 and 700 to their normal files', () => {
      expect(fontVariants?.[family]?.['400']?.normal).toBe('file400.ttf');
      expect(fontVariants?.[family]?.['700']?.normal).toBe('file700.ttf');
    });
  });

  test('exposes frozen font variants object', ({ given, when, then }: StepDefinitions) => {
    let fontVariants: FontVariantsShape | null = null;

    given('mocked font files for TestFamily with weights 700 and 400', () => {
      // mock is applied before import in the when step
    });

    when('I import font variants from constants', async () => {
      fontVariants = await loadFontVariants();
    });

    then('font variants object is frozen', () => {
      expect(Object.isFrozen(fontVariants)).toBe(true);
    });
  });
};
