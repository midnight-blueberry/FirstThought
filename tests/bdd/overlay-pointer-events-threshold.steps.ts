import {
  getOverlayPointerEvents,
  OVERLAY_POINTER_EVENTS_THRESHOLD,
} from '@/components/settings/overlay/transitionConfig';

type StepDefinitions = { given: any; when: any; then: any; and?: any };

export default (test: any) => {
  test('Pointer events disabled below threshold', ({ given, when, then }: StepDefinitions) => {
    let result: 'auto' | 'none';

    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    when(/^overlay opacity is (-?\d+(?:\.\d+)?)$/, (opacity: string) => {
      result = getOverlayPointerEvents(Number.parseFloat(opacity));
    });

    then(/^overlay pointer events are "(auto|none)"$/, (expected: 'auto' | 'none') => {
      expect(result).toBe(expected);
    });
  });

  test('Pointer events disabled at threshold', ({ given, when, then }: StepDefinitions) => {
    let result: 'auto' | 'none';

    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    when(/^overlay opacity is (-?\d+(?:\.\d+)?)$/, (opacity: string) => {
      result = getOverlayPointerEvents(Number.parseFloat(opacity));
    });

    then(/^overlay pointer events are "(auto|none)"$/, (expected: 'auto' | 'none') => {
      expect(result).toBe(expected);
    });
  });

  test('Pointer events enabled above threshold', ({ given, when, then }: StepDefinitions) => {
    let result: 'auto' | 'none';

    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    when(/^overlay opacity is (-?\d+(?:\.\d+)?)$/, (opacity: string) => {
      result = getOverlayPointerEvents(Number.parseFloat(opacity));
    });

    then(/^overlay pointer events are "(auto|none)"$/, (expected: 'auto' | 'none') => {
      expect(result).toBe(expected);
    });
  });

  test('Threshold value matches setting', ({ given, then }: StepDefinitions) => {
    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    then('pointer events block threshold equals 0.75', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBe(0.75);
    });
  });
};
