import { computeDelta } from '@/features/sticky-position/alignScrollAfterApply';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('tests/bdd/align-scroll-after-apply.feature');

defineFeature(feature, (test) => {
  const registerScenario = (title: string) => {
    test(title, ({ given, and, when, then }) => {
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
});
