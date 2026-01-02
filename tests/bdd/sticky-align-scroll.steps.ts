import { alignScrollAfterApply } from '@/features/sticky-position/alignScrollAfterApply';
import { clearRegistry, register } from '@/features/sticky-position/registry';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  afterEach(() => {
    clearRegistry();
  });

  test('returns delta for registered ref', ({ given, when, then }: StepDefinitions) => {
    const state = { result: 0 };

    given(
      /^a ref is registered for theme dark at y (\d+) with height (\d+)$/,
      (y: string, height: string) => {
        const ref = {
          current: {
            measureInWindow: (cb: any) => cb(0, Number(y), 0, Number(height)),
          },
        } as any;

        register('theme:dark', ref);
      },
    );

    when(
      /^alignScrollAfterApply runs with prevCenterY (\d+) for theme dark$/,
      async (prevCenterY: string) => {
        state.result = await alignScrollAfterApply({
          id: 'theme:dark',
          prevCenterY: Number(prevCenterY),
        });
      },
    );

    then(/^the alignScrollAfterApply result is (-?\d+)$/, (value: string) => {
      expect(state.result).toBe(Number(value));
    });
  });

  test('returns zero when ref is missing', ({ given, when, then }: StepDefinitions) => {
    const state = { result: 0 };

    given(/^no ref is registered for theme missing$/, () => {
      clearRegistry();
    });

    when(
      /^alignScrollAfterApply runs with prevCenterY (\d+) for theme missing$/,
      async (prevCenterY: string) => {
        state.result = await alignScrollAfterApply({
          id: 'theme:missing',
          prevCenterY: Number(prevCenterY),
        });
      },
    );

    then(/^the alignScrollAfterApply result is (-?\d+)$/, (value: string) => {
      expect(state.result).toBe(Number(value));
    });
  });
};
