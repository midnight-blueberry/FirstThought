import React from 'react';
import renderer from 'react-test-renderer';

import { useOverlayTransition } from '@/components/settings/overlay/OverlayTransition';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  test('useOverlayTransition throws without provider', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    let renderFn: () => void;

    given('the overlay transition provider is not rendered', () => {
      renderFn = () => undefined;
    });

    when('I render a component that calls useOverlayTransition outside the provider', () => {
      const TestComponent = () => {
        useOverlayTransition();
        return null;
      };

      renderFn = () => renderer.create(React.createElement(TestComponent));
    });

    then(
      'it throws an error that useOverlayTransition must be used within OverlayTransitionProvider',
      () => {
        expect(renderFn).toThrow(
          'useOverlayTransition must be used within OverlayTransitionProvider',
        );
      },
    );
  });
};
