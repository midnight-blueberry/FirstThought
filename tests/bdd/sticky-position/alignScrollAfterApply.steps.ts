import { defineFeature, loadFeature } from 'jest-cucumber';

import { computeDelta } from '@/features/sticky-position/alignScrollAfterApply';

const feature = loadFeature('tests/bdd/sticky-position/alignScrollAfterApply.feature');

type StepDefinitions = {
  given: any;
  when: any;
  then: any;
};

const registerSteps = ({ given, when, then }: StepDefinitions) => {
  let contentY = 0;
  let pressedY = 0;
  let pressedHeight = 0;
  let result = 0;

  given(/^у меня есть измерения (-?\d+), (-?\d+), (-?\d+)$/, (
    contentYValue: string,
    pressedYValue: string,
    pressedHeightValue: string,
  ) => {
    contentY = Number(contentYValue);
    pressedY = Number(pressedYValue);
    pressedHeight = Number(pressedHeightValue);
  });

  when('я вычисляю дельту', () => {
    result = computeDelta(contentY, pressedY, pressedHeight);
  });

  then(/^результат равен (-?\d+)$/, (expectedDelta: string) => {
    expect(result).toBe(Number(expectedDelta));
  });
};

defineFeature(feature, (test: any) => {
  test('Дельта для измерений 100, 120, 60', (stepDefinitions: StepDefinitions) => {
    registerSteps(stepDefinitions);
  });

  test('Дельта для измерений 200, 150, 20', (stepDefinitions: StepDefinitions) => {
    registerSteps(stepDefinitions);
  });
});
