import { adjustWeight, getFontByName, hasMultipleWeights, type FontMeta } from '@utils/fontHelpers';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('getFontByName returns font by exact name', ({ given, when, then }: StepDefinitions) => {
    let fonts: FontMeta[] = [];
    let searchName = '';
    let result: FontMeta | undefined;

    given('fonts named "Alpha" and "Beta"', () => {
      fonts = [
        { name: 'Alpha', weights: ['400'] },
        { name: 'Beta', weights: ['300', '700'] },
      ];
    });

    given('I search for the font name "Beta"', () => {
      searchName = 'Beta';
    });

    when('I get a font by name', () => {
      result = getFontByName(fonts, searchName);
    });

    then('the returned font name is "Beta"', () => {
      expect(result?.name).toBe('Beta');
    });
  });

  test('getFontByName returns the first font when the name is not found', ({ given, when, then }: StepDefinitions) => {
    let fonts: FontMeta[] = [];
    let searchName = '';
    let result: FontMeta | undefined;

    given('fonts named "Alpha" and "Beta"', () => {
      fonts = [
        { name: 'Alpha', weights: ['400'] },
        { name: 'Beta', weights: ['300', '700'] },
      ];
    });

    given('I search for the font name "Gamma"', () => {
      searchName = 'Gamma';
    });

    when('I get a font by name', () => {
      result = getFontByName(fonts, searchName);
    });

    then('the returned font name is "Alpha"', () => {
      expect(result?.name).toBe('Alpha');
    });
  });

  test('adjustWeight returns the next weight within bounds', ({ given, when, then }: StepDefinitions) => {
    let font: FontMeta = { name: 'Alpha', weights: [] };
    let weight: FontMeta['weights'][number] = '400';
    let delta = 0;
    let result: FontMeta['weights'][number] | undefined;

    given('a font with weights "300" "500" "700"', () => {
      font = { name: 'Alpha', weights: ['300', '500', '700'] };
    });

    given('the current weight is "300" and the delta is 1', () => {
      weight = '300';
      delta = 1;
    });

    when('I adjust the weight', () => {
      result = adjustWeight(font, weight, delta);
    });

    then('the adjusted weight is "500"', () => {
      expect(result).toBe('500');
    });
  });

  test('adjustWeight returns the previous weight within bounds', ({ given, when, then }: StepDefinitions) => {
    let font: FontMeta = { name: 'Alpha', weights: [] };
    let weight: FontMeta['weights'][number] = '400';
    let delta = 0;
    let result: FontMeta['weights'][number] | undefined;

    given('a font with weights "300" "500" "700"', () => {
      font = { name: 'Alpha', weights: ['300', '500', '700'] };
    });

    given('the current weight is "700" and the delta is -1', () => {
      weight = '700';
      delta = -1;
    });

    when('I adjust the weight', () => {
      result = adjustWeight(font, weight, delta);
    });

    then('the adjusted weight is "500"', () => {
      expect(result).toBe('500');
    });
  });

  test('adjustWeight returns undefined when stepping outside the weights', ({ given, when, then }: StepDefinitions) => {
    let font: FontMeta = { name: 'Alpha', weights: [] };
    let weight: FontMeta['weights'][number] = '400';
    let delta = 0;
    let result: FontMeta['weights'][number] | undefined;

    given('a font with weights "300" "500"', () => {
      font = { name: 'Alpha', weights: ['300', '500'] };
    });

    given('the current weight is "500" and the delta is 1', () => {
      weight = '500';
      delta = 1;
    });

    when('I adjust the weight', () => {
      result = adjustWeight(font, weight, delta);
    });

    then('the adjusted weight is undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  test('adjustWeight returns undefined when the current weight is missing and delta is zero', ({ given, when, then }: StepDefinitions) => {
    let font: FontMeta = { name: 'Alpha', weights: [] };
    let weight: FontMeta['weights'][number] = '400';
    let delta = 0;
    let result: FontMeta['weights'][number] | undefined;

    given('a font with weights "300" "500"', () => {
      font = { name: 'Alpha', weights: ['300', '500'] };
    });

    given('the current weight is "900" and the delta is 0', () => {
      weight = '900';
      delta = 0;
    });

    when('I adjust the weight', () => {
      result = adjustWeight(font, weight, delta);
    });

    then('the adjusted weight is undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  test('hasMultipleWeights returns true when more than one weight exists', ({ given, when, then }: StepDefinitions) => {
    let font: FontMeta = { name: 'Alpha', weights: [] };
    let result = false;

    given('a font with weights "300" "500"', () => {
      font = { name: 'Alpha', weights: ['300', '500'] };
    });

    when('I check for multiple weights', () => {
      result = hasMultipleWeights(font);
    });

    then('the multiple weights result is true', () => {
      expect(result).toBe(true);
    });
  });

  test('hasMultipleWeights returns false when only one weight exists', ({ given, when, then }: StepDefinitions) => {
    let font: FontMeta = { name: 'Alpha', weights: [] };
    let result = false;

    given('a font with weights "400"', () => {
      font = { name: 'Alpha', weights: ['400'] };
    });

    when('I check for multiple weights', () => {
      result = hasMultipleWeights(font);
    });

    then('the multiple weights result is false', () => {
      expect(result).toBe(false);
    });
  });
};
