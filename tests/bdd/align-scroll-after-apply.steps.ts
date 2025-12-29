import { alignScrollAfterApply, computeDelta } from '@/features/sticky-position/alignScrollAfterApply';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  const registerPrevCenterYStep = (given: StepDefinitions['given'], state: { prevCenterY: number }) => {
    given(/^previous center Y is (-?\d+)$/, (value: string) => {
      state.prevCenterY = Number(value);
    });
  };

  const registerResultEqualsStep = (then: StepDefinitions['then'], state: { result: number }) => {
    then(/^the result equals (-?\d+)$/, (value: string) => {
      expect(state.result).toBe(Number(value));
    });
  };

  const registerComputeDeltaInputs = (
    and: NonNullable<StepDefinitions['and']>,
    state: { pageY: number; height: number },
  ) => {
    and(/^page Y is (-?\d+)$/, (value: string) => {
      state.pageY = Number(value);
    });

    and(/^height is (-?\d+)$/, (value: string) => {
      state.height = Number(value);
    });
  };

  const registerComputeDeltaScenario = (title: string) => {
    test(title, ({ given, and = () => {}, when, then }: StepDefinitions) => {
      const state = { prevCenterY: 0, pageY: 0, height: 0, result: 0 };

      registerPrevCenterYStep(given, state);
      registerComputeDeltaInputs(and, state);

      when('computeDelta is calculated', () => {
        state.result = computeDelta(state.prevCenterY, state.pageY, state.height);
      });

      registerResultEqualsStep(then, state);
    });
  };

  registerComputeDeltaScenario('computeDelta returns positive delta');
  registerComputeDeltaScenario('computeDelta returns negative delta');

  test('alignScrollAfterApply returns 0 when ref is missing', ({ given, when, then }: StepDefinitions) => {
    const state = { prevCenterY: 0, result: 0 };

    registerPrevCenterYStep(given, state);

    when('alignScrollAfterApply is called for missing id', async () => {
      state.result = await alignScrollAfterApply({ id: 'missing', prevCenterY: state.prevCenterY });
    });

    registerResultEqualsStep(then, state);
  });
};
