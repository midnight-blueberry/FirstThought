import buildSectionProps, { type BuildArgs } from '@components/pages/settings/buildSectionProps';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const createBuildArgs = (selectedFontName: string): BuildArgs => ({
  selectedThemeName: 'Light',
  selectedAccentColor: '#000000',
  selectedFontName,
  fontSizeLevel: 0,
  fontWeight: '400',
  noteTextAlign: 'left',
  sizeBlinkIndex: null,
  sizeBlinkAnim: {},
  weightBlinkAnim: {},
  onSelectTheme: jest.fn(),
  onSelectAccent: jest.fn(),
  onSelectFont: jest.fn(),
  onSelectWeight: jest.fn(),
  onIncFontSize: jest.fn(),
  onDecFontSize: jest.fn(),
  onIncWeight: jest.fn(),
  onDecWeight: jest.fn(),
  onAlign: jest.fn(),
});

export default (test: JestCucumberTestFn) => {
  test('Disables font weight when font has a single weight', ({ given, when, then }: StepDefinitions) => {
    let args: BuildArgs;
    let result: ReturnType<typeof buildSectionProps>;

    given('selected font name is "Bad Script"', () => {
      args = createBuildArgs('Bad Script');
    });

    when('I build section props', () => {
      result = buildSectionProps(args);
    });

    then('the font weight control is disabled', () => {
      expect(result.fontWeight.disabled).toBe(true);
    });
  });

  test('Enables font weight when font has multiple weights', ({ given, when, then }: StepDefinitions) => {
    let args: BuildArgs;
    let result: ReturnType<typeof buildSectionProps>;

    given('selected font name is "Comfortaa"', () => {
      args = createBuildArgs('Comfortaa');
    });

    when('I build section props', () => {
      result = buildSectionProps(args);
    });

    then('the font weight control is enabled', () => {
      expect(result.fontWeight.disabled).toBe(false);
    });
  });
};
