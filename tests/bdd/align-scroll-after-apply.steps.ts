import { alignScrollAfterApply, computeDelta } from '@/features/sticky-position/alignScrollAfterApply';

type StepDefinitions = { given: any; when: any; then: any; and?: any };

export default (test: any) => {
  const registerScenario = (title: string) => {
    test(title, ({ given, and, when, then }: StepDefinitions) => {
      let prevCenterY = 0;
      let pageY = 0;
      let height = 0;
      let result = 0;

      given(/^previous center Y is (-?\d+)$/, (value: string) => {
        prevCenterY = Number(value);
      });

      and(/^page Y is (-?\d+)$/, (value: string) => {
        pageY = Number(value);
      });

      and(/^height is (-?\d+)$/, (value: string) => {
        height = Number(value);
      });

      when('computeDelta is calculated', () => {
        result = computeDelta(prevCenterY, pageY, height);
      });

      then(/^the result equals (-?\d+)$/, (value: string) => {
        expect(result).toBe(Number(value));
      });
    });
  };

  registerScenario('computeDelta returns positive delta');
  registerScenario('computeDelta returns negative delta');

  test('alignScrollAfterApply returns 0 when ref is missing', ({ given, when, then }: StepDefinitions) => {
    let prevCenterY = 0;
    let result = 0;

    given(/^previous center Y is (-?\d+)$/, (value: string) => {
      prevCenterY = Number(value);
    });

    when('alignScrollAfterApply is called for missing id', async () => {
      result = await alignScrollAfterApply({ id: 'missing', prevCenterY });
    });

    then(/^the result equals (-?\d+)$/, (value: string) => {
      expect(result).toBe(Number(value));
    });
  });
};
