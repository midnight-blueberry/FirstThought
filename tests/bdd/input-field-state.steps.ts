import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { useInputFieldState } from '@/components/ui/molecules/use-input-field';
import type { InputFieldProps } from '@/components/ui/molecules/input-field';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  iconSize: { small: 12 },
  colors: { basic: '#111111', disabled: '#999999' },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

export default (test: JestCucumberTestFn) => {
  let tree: renderer.ReactTestRenderer | null = null;
  let propsUnderTest: InputFieldProps | null = null;
  let hookState: ReturnType<typeof useInputFieldState> | null = null;
  let onChangeText: jest.Mock | null = null;
  let onClear: jest.Mock | null = null;
  let clearMock: jest.Mock | null = null;

  const TestComponent = () => {
    if (!propsUnderTest) {
      throw new Error('Props are not defined');
    }

    hookState = useInputFieldState(propsUnderTest);
    return null;
  };

  const renderState = async () => {
    await act(async () => {
      tree = renderer.create(React.createElement(TestComponent));
    });
  };

  afterEach(() => {
    tree?.unmount();
    tree = null;
    propsUnderTest = null;
    hookState = null;
    onChangeText = null;
    onClear = null;
    clearMock = null;
  });

  test('uncontrolled input builds left icon and clear button and clears value', ({ given, when, then }: StepDefinitions) => {
    given('a theme with icon sizes and colors', () => {
      expect(themeMock.iconSize.small).toBeDefined();
      expect(themeMock.colors.basic).toBeDefined();
      expect(themeMock.colors.disabled).toBeDefined();
    });

    given('an uncontrolled input field with default value "hello" and left icon "star" and caption "cap"', () => {
      onChangeText = jest.fn();
      onClear = jest.fn();
      propsUnderTest = {
        defaultValue: 'hello',
        leftIconName: 'star',
        caption: 'cap',
        onChangeText,
        onClear,
      };
    });

    when('the input field state hook is rendered', async () => {
      await renderState();
    });

    then('the value equals "hello"', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.value).toBe('hello');
    });

    then('the helper equals "cap"', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.helper).toBe('cap');
    });

    then('the left icon name is "star"', () => {
      expect(hookState).not.toBeNull();
      const icon = hookState!.leftNode as React.ReactElement;
      expect(icon.props.name).toBe('star');
    });

    then('the clear button icon name is "close"', () => {
      expect(hookState).not.toBeNull();
      const rightNode = hookState!.rightNode as React.ReactElement;
      const icon = rightNode.props.children as React.ReactElement;
      expect(icon.props.name).toBe('close');
    });

    when('I type "world" into the input', async () => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.setValue('world');
      });
    });

    then('onChangeText is called with "world"', () => {
      expect(onChangeText).not.toBeNull();
      expect(onChangeText!).toHaveBeenCalledWith('world');
    });

    then('the value equals "world"', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.value).toBe('world');
    });

    when('I press the clear button', async () => {
      expect(hookState).not.toBeNull();
      clearMock = jest.fn();
      hookState!.inputRef.current = { clear: clearMock } as any;
      await act(async () => {
        (hookState!.rightNode as any).props.onPress();
      });
    });

    then('onClear is called once', () => {
      expect(onClear).not.toBeNull();
      expect(onClear!).toHaveBeenCalledTimes(1);
    });

    then('the value equals ""', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.value).toBe('');
    });
  });

  test('controlled secure input toggles visibility icon', ({ given, when, then }: StepDefinitions) => {
    given('a theme with icon sizes and colors', () => {
      expect(themeMock.iconSize.small).toBeDefined();
      expect(themeMock.colors.basic).toBeDefined();
      expect(themeMock.colors.disabled).toBeDefined();
    });

    given('a controlled input field with value "secret" and secure text entry enabled', () => {
      onChangeText = jest.fn();
      propsUnderTest = {
        value: 'secret',
        secureTextEntry: true,
        onChangeText,
      };
    });

    when('the input field state hook is rendered', async () => {
      await renderState();
    });

    then('the value equals "secret"', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.value).toBe('secret');
    });

    then('secureVisible is false', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.secureVisible).toBe(false);
    });

    then('the secure toggle icon name is "eye-off"', () => {
      expect(hookState).not.toBeNull();
      const rightNode = hookState!.rightNode as React.ReactElement;
      const icon = rightNode.props.children as React.ReactElement;
      expect(icon.props.name).toBe('eye-off');
    });

    when('I toggle secure visibility', async () => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.toggleSecure();
      });
    });

    then('secureVisible is true', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.secureVisible).toBe(true);
    });

    then('the secure toggle icon name is "eye"', () => {
      expect(hookState).not.toBeNull();
      const rightNode = hookState!.rightNode as React.ReactElement;
      const icon = rightNode.props.children as React.ReactElement;
      expect(icon.props.name).toBe('eye');
    });

    when('I type "new" into the input', async () => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.setValue('new');
      });
    });

    then('onChangeText is called with "new"', () => {
      expect(onChangeText).not.toBeNull();
      expect(onChangeText!).toHaveBeenCalledWith('new');
    });

    then('the value equals "secret"', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.value).toBe('secret');
    });
  });
};
