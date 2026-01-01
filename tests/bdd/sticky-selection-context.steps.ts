import React from 'react';
import renderer from 'react-test-renderer';
import type { ScrollView } from 'react-native';
import {
  getStickySelectionContext,
  setStickySelectionContext,
  useStickySelection,
} from '@/features/sticky-position/StickySelectionContext';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  afterEach(() => {
    setStickySelectionContext(null);
  });

  test('Sticky selection context stores and clears value', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    let mockContext: ReturnType<typeof getStickySelectionContext>;

    given('sticky selection context is cleared', () => {
      setStickySelectionContext(null);
      expect(getStickySelectionContext()).toBeNull();
    });

    when('I set sticky selection context to a mock value', () => {
      mockContext = {
        state: {} as any,
        status: { current: 'idle' },
        registerPress: jest.fn(),
        applyWithSticky: jest.fn(),
        reset: jest.fn(),
        onScroll: jest.fn(),
        scrollRef: { current: null as unknown as ScrollView },
        overlay: {} as any,
      };

      setStickySelectionContext(mockContext as any);
    });

    then('getStickySelectionContext returns the same reference', () => {
      expect(getStickySelectionContext()).toBe(mockContext);
    });

    when('I set sticky selection context to null', () => {
      setStickySelectionContext(null);
    });

    then('getStickySelectionContext returns null', () => {
      expect(getStickySelectionContext()).toBeNull();
    });
  });

  test('useStickySelection throws without provider', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    let renderOutsideProvider: () => void;

    given('sticky selection context is cleared', () => {
      setStickySelectionContext(null);
      expect(getStickySelectionContext()).toBeNull();
    });

    when(
      'I render a component that uses useStickySelection outside the provider',
      () => {
        const TestComponent = () => {
          useStickySelection();
          return null;
        };

        renderOutsideProvider = () => renderer.create(React.createElement(TestComponent));
      },
    );

    then(
      'it throws an error that useStickySelection must be used within StickySelectionProvider',
      () => {
        expect(renderOutsideProvider).toThrow(
          'useStickySelection must be used within StickySelectionProvider',
        );
      },
    );
  });
};
