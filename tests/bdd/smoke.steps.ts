import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('tests/bdd/smoke.feature');

defineFeature(feature, (test: any) => {
  test('basic arithmetic works', ({ given, when, then }: any) => {
    let a = 0;
    let b = 0;
    let result = 0;

    given(/^I have numbers (\d+) and (\d+)$/, (x: string, y: string) => {
      a = Number(x);
      b = Number(y);
    });

    when('I add them', () => {
      result = a + b;
    });

    then(/^the result should be (\d+)$/, (expected: string) => {
      expect(result).toBe(Number(expected));
    });
  });
});
