import { alignScrollAfterApply, computeDelta } from '@/features/sticky-position/alignScrollAfterApply';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  type CommonStepDefinitions = Pick<StepDefinitions, 'given' | 'and' | 'then'>;

  type CommonState = {
    prevCenterY: number;
    pageY: number;
    height: number;
    result: number;
  };

  const registerCommonSteps = (
    { given, and = () => {}, then }: CommonStepDefinitions,
    state: CommonState,
  ) => {
    given(/^previous center Y is (-?\d+)$/, (value: string) => {
      state.prevCenterY = Number(value);
    });

    and(/^page Y is (-?\d+)$/, (value: string) => {
      state.pageY = Number(value);
    });

    and(/^height is (-?\d+)$/, (value: string) => {
      state.height = Number(value);
    });

    then(/^the result equals (-?\d+)$/, (value: string) => {
      expect(state.result).toBe(Number(value));
    });
  };

  const registerScenario = (title: string) => {
    test(title, ({ given, and = () => {}, when, then }: StepDefinitions) => {
      const state: CommonState = {
        prevCenterY: 0,
        pageY: 0,
        height: 0,
        result: 0,
      };

      registerCommonSteps({ given, and, then }, state);

      when('computeDelta is calculated', () => {
        state.result = computeDelta(state.prevCenterY, state.pageY, state.height);
      });
    });
  };

  registerScenario('computeDelta returns positive delta');
  registerScenario('computeDelta returns negative delta');

  test('alignScrollAfterApply returns 0 when ref is missing', ({ given, and = () => {}, when, then }: StepDefinitions) => {
    const state: CommonState = {
      prevCenterY: 0,
      pageY: 0,
      height: 0,
      result: 0,
    };

    registerCommonSteps({ given, and, then }, state);

    when('alignScrollAfterApply is called for missing id', async () => {
      state.result = await alignScrollAfterApply({ id: 'missing', prevCenterY: state.prevCenterY });
    });
  });
};
