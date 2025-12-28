import { defineFeature, loadFeature } from 'jest-cucumber';
import { OVERLAY_POINTER_EVENTS_THRESHOLD } from '@/components/settings/overlay/transitionConfig';

const feature = loadFeature('tests/bdd/overlay-pointer-events-threshold.feature');

defineFeature(feature, (test) => {
  test('Threshold value matches setting', ({ given, then }) => {
    given('overlay transition configuration is available', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    then('pointer events block threshold equals 0.75', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBe(0.75);
    });
  });
});
