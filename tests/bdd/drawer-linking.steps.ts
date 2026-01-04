import { drawerLinking } from '@/navigation/drawer/linking';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('Exposes correct prefixes and screen paths', ({ given, when, then }: StepDefinitions) => {
    let prefixes: string[];
    let screens: Record<string, string>;

    given('drawer linking configuration is available', () => {
      // no setup needed beyond importing drawerLinking
    });

    when('I read the drawer linking data', () => {
      prefixes = drawerLinking.prefixes as string[];
      screens = drawerLinking.config?.screens as Record<string, string>;
    });

    then('the prefixes include "firstthought://"', () => {
      expect(prefixes).toContain('firstthought://');
    });

    then('the Home screen path is empty', () => {
      expect(screens.Home).toBe('');
    });

    then('the Settings screen path is "settings"', () => {
      expect(screens.Settings).toBe('settings');
    });
  });
};
