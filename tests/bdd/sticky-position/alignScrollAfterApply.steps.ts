import { defineFeature, loadFeature } from 'jest-cucumber';

import { computeDelta } from '@/features/sticky-position/alignScrollAfterApply';

const feature = loadFeature('tests/bdd/sticky-position/alignScrollAfterApply.feature');

defineFeature(feature, (test: any) => {
  test('Compute delta from measurements', ({ given, when, then }: any) => {
    let contentY = 0;
    let pressedY = 0;
    let pressedHeight = 0;
    let result = 0;

    given(/^I have measurements (\d+), (\d+), (\d+)$/, (contentYValue: string, pressedYValue: string, pressedHeightValue: string) => {
      contentY = Number(contentYValue);
      pressedY = Number(pressedYValue);
      pressedHeight = Number(pressedHeightValue);
    });

    when('I compute the delta', () => {
      result = computeDelta(contentY, pressedY, pressedHeight);
    });

    then(/^the result equals (-?\d+)$/, (expectedDelta: string) => {
      expect(result).toBe(Number(expectedDelta));
    });
  });
});
