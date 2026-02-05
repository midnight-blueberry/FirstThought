import React from 'react';
import { act } from 'react-test-renderer';
import { useInputFieldState } from '@/components/ui/molecules/use-input-field';
import type { InputFieldProps } from '@/components/ui/molecules/input-field';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

jest.mock('@hooks/useTheme', () => () => ({
  iconSize: { small: 16 },
  colors: { basic: '#000000', disabled: '#999999' },
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

type HookState = ReturnType<typeof useInputFieldState> | null;

type Tree = ReturnType<typeof renderWithProviders> | null;

export default (test: JestCucumberTestFn) => {
  let tree: Tree = null;
  let propsUnderTest: InputFieldProps | null = null;
  let hookState: HookState = null;
  let onChangeText: jest.Mock | null = null;
  let onClear: jest.Mock | null = null;
  let clearSpy: jest.Mock | null = null;

  const TestComponent = () => {
    if (!propsUnderTest) {
      throw new Error('Props are not defined');
    }

    hookState = useInputFieldState(propsUnderTest);
    return null;
  };

  const renderState = async () => {
    await act(async () => {
      tree = renderWithProviders(React.createElement(TestComponent));
    });
  };

  const getHookState = () => {
    if (!hookState) {
      throw new Error('Hook state is not available');
    }
    return hookState;
  };

  const getRightNode = (): React.ReactElement<{ onPress?: () => void; children?: React.ReactNode }> => {
    const state = getHookState();
    if (!state.rightNode || !React.isValidElement(state.rightNode)) {
      throw new Error('Right node is not available');
    }
    return state.rightNode as React.ReactElement<{ onPress?: () => void; children?: React.ReactNode }>;
  };

  const getRightIconName = () => {
    const rightNode = getRightNode();
    const iconChild = React.Children.toArray(rightNode.props.children).find((child) =>
      React.isValidElement(child),
    );
    if (!iconChild || !React.isValidElement(iconChild)) {
      throw new Error('Icon element is not available');
    }
    const iconElement = iconChild as React.ReactElement<{ name?: string }>;
    return iconElement.props.name as string;
  };

  afterEach(async () => {
    tree = await unmountTree(tree);
    propsUnderTest = null;
    hookState = null;
    onChangeText = null;
    onClear = null;
    clearSpy = null;
  });

  test('uncontrolled state updates value and clears', ({ given, when, then }: StepDefinitions) => {
    given('the input field state is rendered uncontrolled with default value "abc"', async () => {
      onChangeText = jest.fn();
      onClear = jest.fn();
      propsUnderTest = {
        defaultValue: 'abc',
        onChangeText,
        onClear,
      };
      await renderState();
    });

    then('the field is uncontrolled', () => {
      expect(getHookState().isControlled).toBe(false);
    });

    then('the field value is "abc"', () => {
      expect(getHookState().value).toBe('abc');
    });

    when('I set the input value to "hello"', async () => {
      await act(async () => {
        getHookState().setValue('hello');
      });
    });

    then('the field value is "hello"', () => {
      expect(getHookState().value).toBe('hello');
    });

    then('onChangeText is called with "hello"', () => {
      expect(onChangeText).not.toBeNull();
      expect(onChangeText!).toHaveBeenCalledWith('hello');
    });

    given('the input ref has a clear spy', () => {
      clearSpy = jest.fn();
      getHookState().inputRef.current = { clear: clearSpy } as any;
    });

    when('I press the clear button', async () => {
      const onPress = getRightNode().props.onPress;
      if (typeof onPress !== 'function') {
        throw new Error('Right node onPress is not available');
      }
      await act(async () => {
        onPress();
      });
    });

    then('onClear is called once', () => {
      expect(onClear).not.toBeNull();
      expect(onClear!).toHaveBeenCalledTimes(1);
    });

    then('the native clear is called once', () => {
      expect(clearSpy).not.toBeNull();
      expect(clearSpy!).toHaveBeenCalledTimes(1);
    });

    then('the field value is ""', () => {
      expect(getHookState().value).toBe('');
    });
  });

  test('controlled state calls onChangeText without changing value', ({ given, when, then }: StepDefinitions) => {
    given('the input field state is rendered controlled with value "abc"', async () => {
      onChangeText = jest.fn();
      propsUnderTest = {
        value: 'abc',
        onChangeText,
      };
      await renderState();
    });

    then('the field is controlled', () => {
      expect(getHookState().isControlled).toBe(true);
    });

    then('the field value is "abc"', () => {
      expect(getHookState().value).toBe('abc');
    });

    when('I set the input value to "zzz"', async () => {
      await act(async () => {
        getHookState().setValue('zzz');
      });
    });

    then('onChangeText is called with "zzz"', () => {
      expect(onChangeText).not.toBeNull();
      expect(onChangeText!).toHaveBeenCalledWith('zzz');
    });

    then('the field value remains "abc"', () => {
      expect(getHookState().value).toBe('abc');
    });
  });

  test('secure text entry toggles icon name', ({ given, when, then }: StepDefinitions) => {
    given('the input field state is rendered with secure text entry enabled', async () => {
      propsUnderTest = {
        value: '',
        secureTextEntry: true,
      };
      await renderState();
    });

    then('the secure toggle icon is "eye-off"', () => {
      expect(getRightIconName()).toBe('eye-off');
    });

    when('I toggle secure visibility', async () => {
      const onPress = getRightNode().props.onPress;
      if (typeof onPress !== 'function') {
        throw new Error('Right node onPress is not available');
      }
      await act(async () => {
        onPress();
      });
    });

    then('secure visibility is true', () => {
      expect(getHookState().secureVisible).toBe(true);
    });

    then('the secure toggle icon is "eye"', () => {
      expect(getRightIconName()).toBe('eye');
    });
  });
};
