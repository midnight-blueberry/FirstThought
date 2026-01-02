import React from 'react';
import { act } from 'react-test-renderer';
import usePrevious from '@/hooks/usePrevious';
import { setStickySelectionContext } from '@/features/sticky-position/StickySelectionContext';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

jest.mock(
  'react-test-renderer',
  () => jest.requireActual('react-test-renderer/cjs/react-test-renderer.development.js'),
);

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let recordedPrevious: number | undefined;
  let updateValue: React.Dispatch<React.SetStateAction<number>> | null = null;

  const TestComponent = ({ initialValue }: { initialValue: number }) => {
    const [value, setValue] = React.useState(initialValue);
    updateValue = setValue;
    recordedPrevious = usePrevious(value);
    return null;
  };

  const renderHook = async (initialValue: number) => {
    await act(async () => {
      tree = renderWithProviders(React.createElement(TestComponent, { initialValue }));
    });
  };

  afterEach(async () => {
    setStickySelectionContext(null);
    recordedPrevious = undefined;
    updateValue = null;
    tree = await unmountTree(tree);
  });

  test('returns undefined on first render', ({ given, when, then }: StepDefinitions) => {
    given('I render a component using usePrevious with initial value 1', async () => {
      await renderHook(1);
    });

    when('the component finishes the first render', () => {});

    then('the hook tracks the previous value as undefined', () => {
      expect(recordedPrevious).toBeUndefined();
    });
  });

  test('returns previous value after update', ({ given, when, then }: StepDefinitions) => {
    given('I render a component using usePrevious with initial value 1', async () => {
      await renderHook(1);
    });

    when('I update the value to 2', async () => {
      expect(updateValue).not.toBeNull();
      await act(async () => {
        updateValue!(2);
      });
    });

    then('the hook tracks the previous value as 1', () => {
      expect(recordedPrevious).toBe(1);
    });
  });
};
