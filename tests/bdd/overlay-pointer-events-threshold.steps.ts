import { defineFeature, loadFeature } from 'jest-cucumber';
import { OVERLAY_POINTER_EVENTS_THRESHOLD } from '@/components/settings/overlay/transitionConfig';

const feature = loadFeature('tests/bdd/overlay-pointer-events-threshold.feature');

defineFeature(feature, (test) => {
  test('Значение порога соответствует настройке', ({ given, then }) => {
    given('доступна конфигурация переходов оверлея', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBeDefined();
    });

    then('порог блокировки pointer events равен 0.75', () => {
      expect(OVERLAY_POINTER_EVENTS_THRESHOLD).toBe(0.75);
    });
  });
});
