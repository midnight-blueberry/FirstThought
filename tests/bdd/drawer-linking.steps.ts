import { drawerLinking } from '@/navigation/drawer/linking';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('Validates drawer linking prefixes and screen paths', ({ given, when, then }: StepDefinitions) => {
    let prefixes: string[] | undefined;
    let screens: typeof drawerLinking.config.screens;

    given('the drawer linking configuration', () => {
      prefixes = drawerLinking.prefixes as string[] | undefined;
      screens = drawerLinking.config?.screens;
    });

    when('I inspect its prefixes and screens', () => {
      expect(prefixes).toBeDefined();
      expect(screens).toBeDefined();
    });

    then('the prefixes include the firstthought scheme', () => {
      expect(prefixes).toContain('firstthought://');
    });

    then('the home and settings screen paths are configured correctly', () => {
      expect(screens?.Home).toBe('');
      expect(screens?.Settings).toBe('settings');
    });
  });
};
