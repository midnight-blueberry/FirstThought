import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const mockReactModule = (hasUseInsertionEffect: boolean) => {
  const baseReact = {
    useLayoutEffect: jest.fn(),
  } as Record<string, any>;

  if (hasUseInsertionEffect) {
    baseReact.useInsertionEffect = jest.fn();
  }

  return {
    __esModule: true,
    default: baseReact,
    ...baseReact,
  };
};

export default (test: JestCucumberTestFn) => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('with useInsertionEffect', ({ given, when, then }: StepDefinitions) => {
    let react: Record<string, any>;

    given('React provides useInsertionEffect', () => {
      jest.resetModules();
      jest.doMock('react', () => mockReactModule(true));
    });

    when('fixUseInsertionEffect is imported', async () => {
      await import('@utils/fixUseInsertionEffect');
      react = (await import('react') as any).default;
    });

    then('React.useInsertionEffect equals React.useLayoutEffect', () => {
      expect(react.useInsertionEffect).toBe(react.useLayoutEffect);
    });
  });

  test('without useInsertionEffect', ({ given, when, then }: StepDefinitions) => {
    let react: Record<string, any>;

    given('React does not provide useInsertionEffect', () => {
      jest.resetModules();
      jest.doMock('react', () => mockReactModule(false));
    });

    when('fixUseInsertionEffect is imported', async () => {
      await import('@utils/fixUseInsertionEffect');
      react = (await import('react') as any).default;
    });

    then('React.useInsertionEffect remains undefined', () => {
      expect(react.useInsertionEffect).toBeUndefined();
    });
  });
};
