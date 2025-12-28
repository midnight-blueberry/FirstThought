import { OVERLAY_POINTER_EVENTS_THRESHOLD } from '@/components/settings/overlay/transitionConfig';

type StepDefinitions = { given: any; when: any; then: any; and?: any };

export default (test: any) => {
  test('Threshold value matches setting', ({ given, then }: StepDefinitions) => {
    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    then('pointer events block threshold equals 0.75', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBe(0.75);
    });
  });
};
