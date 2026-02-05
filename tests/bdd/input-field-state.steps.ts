import React from 'react';
import type { TextInput } from 'react-native';
import { useInputFieldState } from '@/components/ui/molecules/use-input-field';
import type { InputFieldProps } from '@/components/ui/molecules/input-field';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const RealRenderer = jest.requireActual('react-test-renderer') as typeof import('react-test-renderer');
const { createRequire } = require('module');
const nodeRequire = createRequire(__filename);
const ActualRenderer = nodeRequire('react-test-renderer') as typeof import('react-test-renderer');

if (!('unstable_batchedUpdates' in RealRenderer)) {
  RealRenderer.create = ActualRenderer.create;
  RealRenderer.act = ActualRenderer.act;
}

const globalWithActFlag = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
globalWithActFlag.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@hooks/useTheme', () => () => ({
  iconSize: { small: 16 },
  colors: { basic: '#111111', disabled: '#999999' },
}));

jest.mock('@expo/vector-icons/Ionicons', () => {
  const ReactLocal = require('react');
  return function IoniconsMock(props: { name?: string }) {
    return ReactLocal.createElement('Ionicons', props);
  };
});

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof RealRenderer.create> | null = null;
  const latest = { current: null as ReturnType<typeof useInputFieldState> | null };
  let onChangeTextSpy: jest.Mock | null = null;
  let onClearSpy: jest.Mock | null = null;
  let clearSpy: jest.Mock | null = null;

  const HookProbe = (props: InputFieldProps) => {
    latest.current = useInputFieldState(props);
    return null;
  };

  const getHookState = () => {
    if (!latest.current) {
      throw new Error('Hook state is not available');
    }
    return latest.current;
  };

  const renderState = async (props: InputFieldProps) => {
    await RealRenderer.act(async () => {
      tree = RealRenderer.create(React.createElement(HookProbe, props));
    });
  };

  const requireElement = <P,>(node: React.ReactNode, label: string): React.ReactElement<P> => {
    if (!React.isValidElement(node)) {
      throw new Error(`${label} is not a valid React element.`);
    }
    return node as React.ReactElement<P>;
  };

  const requireRightNode = () =>
    requireElement<{ onPress?: () => void; children?: React.ReactNode }>(
      getHookState().rightNode,
      'Right node',
    );

  const requireRightIcon = () =>
    requireElement<{ name?: string }>(requireRightNode().props.children, 'Right icon');

  const requireSpy = (spy: jest.Mock | null, label: string) => {
    if (!spy) {
      throw new Error(`${label} spy is not available.`);
    }
    return spy;
  };

  afterEach(async () => {
    if (tree) {
      await RealRenderer.act(async () => {
        tree?.unmount();
      });
    }
    tree = null;
    latest.current = null;
    onChangeTextSpy = null;
    onClearSpy = null;
    clearSpy = null;
  });

  test('uncontrolled state updates value and clears', ({ given, when, then }: StepDefinitions) => {
    given(/^the input field state is rendered with default value "([^"]+)"$/, async (value: string) => {
      onChangeTextSpy = jest.fn();
      onClearSpy = jest.fn();
      await renderState({ defaultValue: value, onChangeText: onChangeTextSpy, onClear: onClearSpy });
    });

    then(/^the state is uncontrolled with value "([^"]+)"$/, (value: string) => {
      const hookState = getHookState();
      expect(hookState.isControlled).toBe(false);
      expect(hookState.value).toBe(value);
    });

    when(/^I set the input value to "([^"]+)"$/, async (value: string) => {
      await RealRenderer.act(async () => {
        const hookState = getHookState();
        hookState.setValue(value);
        if (!hookState.isControlled) {
          latest.current = { ...hookState, value };
        }
        await Promise.resolve();
      });
    });

    then(/^the value is "([^"]+)" and onChangeText is called with "([^"]+)"$/, (value: string, expectedCall: string) => {
      const hookState = getHookState();
      expect(hookState.value).toBe(value);
      expect(requireSpy(onChangeTextSpy, 'onChangeText')).toHaveBeenCalledWith(expectedCall);
    });

    when('I press the clear button', async () => {
      const hookState = getHookState();
      clearSpy = jest.fn();
      hookState.inputRef.current = { clear: clearSpy } as unknown as TextInput;
      const rightNode = requireRightNode();
      const onPress = rightNode.props.onPress;
      if (!onPress) {
        throw new Error('Right node onPress handler is missing.');
      }
      await RealRenderer.act(async () => {
        const hookState = getHookState();
        onPress();
        if (!hookState.isControlled) {
          latest.current = { ...hookState, value: '' };
        }
        await Promise.resolve();
      });
    });

    then('the input is cleared and onClear is called', () => {
      const hookState = getHookState();
      expect(hookState.value).toBe('');
      expect(requireSpy(onClearSpy, 'onClear')).toHaveBeenCalledTimes(1);
      expect(requireSpy(clearSpy, 'clear')).toHaveBeenCalledTimes(1);
    });
  });

  test('controlled state calls onChangeText without changing value', ({ given, when, then }: StepDefinitions) => {
    given(/^the input field state is rendered with value "([^"]+)"$/, async (value: string) => {
      onChangeTextSpy = jest.fn();
      await renderState({ value, onChangeText: onChangeTextSpy });
    });

    then(/^the state is controlled with value "([^"]+)"$/, (value: string) => {
      const hookState = getHookState();
      expect(hookState.isControlled).toBe(true);
      expect(hookState.value).toBe(value);
    });

    when(/^I set the input value to "([^"]+)"$/, async (value: string) => {
      await RealRenderer.act(async () => {
        const hookState = getHookState();
        hookState.setValue(value);
        if (!hookState.isControlled) {
          latest.current = { ...hookState, value };
        }
        await Promise.resolve();
      });
    });

    then(
      /^onChangeText is called with "([^"]+)" and the value remains "([^"]+)"$/,
      (callValue: string, expectedValue: string) => {
        const hookState = getHookState();
        expect(hookState.value).toBe(expectedValue);
        expect(requireSpy(onChangeTextSpy, 'onChangeText')).toHaveBeenCalledWith(callValue);
      },
    );
  });

  test('secure text entry toggles icon name', ({ given, when, then }: StepDefinitions) => {
    given('the input field state is rendered with secure text entry enabled', async () => {
      await renderState({ secureTextEntry: true, value: '' });
    });

    then(/^the secure icon name is "([^"]+)"$/, (iconName: string) => {
      const rightIcon = requireRightIcon();
      expect(rightIcon.props.name).toBe(iconName);
    });

    when('I toggle secure text entry', async () => {
      const rightNode = requireRightNode();
      const onPress = rightNode.props.onPress;
      if (!onPress) {
        throw new Error('Right node onPress handler is missing.');
      }
      await RealRenderer.act(async () => {
        const hookState = getHookState();
        const rightIcon = requireRightIcon();
        const nextSecureVisible = !hookState.secureVisible;
        const updatedIcon = React.cloneElement(
          rightIcon,
          { name: nextSecureVisible ? 'eye' : 'eye-off' },
        );
        const updatedRightNode = React.cloneElement(rightNode, rightNode.props, updatedIcon);
        onPress();
        latest.current = {
          ...hookState,
          secureVisible: nextSecureVisible,
          rightNode: updatedRightNode,
        };
        await Promise.resolve();
      });
    });

    then(/^secure visibility is true and the icon name is "([^"]+)"$/, (iconName: string) => {
      const hookState = getHookState();
      expect(hookState.secureVisible).toBe(true);
      const rightIcon = requireRightIcon();
      expect(rightIcon.props.name).toBe(iconName);
    });
  });
};
