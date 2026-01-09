import {
  getOverlayPointerEvents,
  OVERLAY_POINTER_EVENTS_THRESHOLD,
} from '@/components/settings/overlay/transitionConfig';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  const registerOverlayTransitionConfigAvailable = (given: StepDefinitions['given']) => {
    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });
  };

  test('Opacity above threshold returns auto', ({ given, when, then }: StepDefinitions) => {
    let result: 'auto' | 'none';

    registerOverlayTransitionConfigAvailable(given);

    when('opacity is above the threshold', () => {
      result = getOverlayPointerEvents(OVERLAY_POINTER_EVENTS_THRESHOLD + 0.01);
    });

    then('pointer events are "auto"', () => {
      expect(result).toBe('auto');
    });
  });

  test('Opacity at threshold returns none', ({ given, when, then }: StepDefinitions) => {
    let result: 'auto' | 'none';

    registerOverlayTransitionConfigAvailable(given);

    when('opacity equals the threshold', () => {
      result = getOverlayPointerEvents(OVERLAY_POINTER_EVENTS_THRESHOLD);
    });

    then('pointer events are "none"', () => {
      expect(result).toBe('none');
    });
  });

  test('Opacity below threshold returns none', ({ given, when, then }: StepDefinitions) => {
    let result: 'auto' | 'none';

    registerOverlayTransitionConfigAvailable(given);

    when('opacity is below the threshold', () => {
      result = getOverlayPointerEvents(OVERLAY_POINTER_EVENTS_THRESHOLD - 0.01);
    });

    then('pointer events are "none"', () => {
      expect(result).toBe('none');
    });
  });
};
