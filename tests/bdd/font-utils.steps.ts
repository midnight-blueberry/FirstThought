import { toFamilyKey } from '@/utils/font';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('toFamilyKey strips weight suffix and converts spaces to underscores', ({ given, when, then }: StepDefinitions) => {
    let fontName = '';
    let result = '';

    given('a font name "Bad Script-400-italic"', () => {
      fontName = 'Bad Script-400-italic';
    });

    when('I convert it to a family key', () => {
      result = toFamilyKey(fontName);
    });

    then('it equals "Bad_Script"', () => {
      expect(result).toBe('Bad_Script');
    });
  });
};
