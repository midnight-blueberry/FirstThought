import React from 'react';
import renderer, { act } from 'react-test-renderer';
import type { InputFieldProps } from '@/components/ui/molecules/input-field';
import { useInputFieldState } from '@/components/ui/molecules/use-input-field';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  iconSize: { small: 12 },
  colors: { basic: '#111111', disabled: '#888888' },
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

type HookState = ReturnType<typeof useInputFieldState>;

export default (test: JestCucumberTestFn) => {
  let propsUnderTest: InputFieldProps | null = null;
  let hookState: HookState | null = null;
  let tree: renderer.ReactTestRenderer | null = null;
  let onChangeText: jest.Mock | null = null;
  let onClear: jest.Mock | null = null;

  const TestComponent = () => {
    if (!propsUnderTest) {
      throw new Error('Props are not defined');
    }

    hookState = useInputFieldState(propsUnderTest);
    return null;
  };

  const renderHook = async () => {
    await act(async () => {
      tree = renderer.create(React.createElement(TestComponent));
    });
  };

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree?.unmount();
      });
    }

    tree = null;
    hookState = null;
    propsUnderTest = null;
    onChangeText = null;
    onClear = null;
  });

  const registerThemeGiven = (given: StepDefinitions['given']) => {
    given('a theme with icon sizes and colors', () => {
      expect(themeMock.iconSize.small).toBe(12);
    });
  };

  const registerUncontrolledGiven = (given: StepDefinitions['given']) => {
    given(
      'an uncontrolled input field with default value "hello" and left icon "star" and caption "cap"',
      () => {
        onChangeText = jest.fn();
        onClear = jest.fn();
        propsUnderTest = {
          defaultValue: 'hello',
          leftIconName: 'star',
          caption: 'cap',
          onChangeText,
          onClear,
        };
      },
    );
  };

  const registerControlledGiven = (given: StepDefinitions['given']) => {
    given('a controlled input field with value "secret" and secure text entry enabled', () => {
      onChangeText = jest.fn();
      propsUnderTest = {
        value: 'secret',
        secureTextEntry: true,
        onChangeText,
      };
    });
  };

  const registerRenderWhen = (when: StepDefinitions['when']) => {
    when('the input field state hook is rendered', async () => {
      await renderHook();
    });
  };

  const registerValueThen = (then: StepDefinitions['then']) => {
    then(/^the value equals "([^"]*)"$/, (value: string) => {
      expect(hookState).not.toBeNull();
      expect(hookState!.value).toBe(value);
    });
  };

  const registerHelperThen = (then: StepDefinitions['then']) => {
    then('the helper equals "cap"', () => {
      expect(hookState).not.toBeNull();
      expect(hookState!.helper).toBe('cap');
    });
  };

  const registerLeftIconThen = (then: StepDefinitions['then']) => {
    then('the left icon name is "star"', () => {
      expect(hookState).not.toBeNull();
      const leftNode = hookState!.leftNode as React.ReactElement;
      expect(leftNode.props.name).toBe('star');
    });
  };

  const registerClearIconThen = (then: StepDefinitions['then']) => {
    then('the clear button icon name is "close"', () => {
      expect(hookState).not.toBeNull();
      const rightNode = hookState!.rightNode as React.ReactElement;
      const iconNode = rightNode.props.children as React.ReactElement;
      expect(iconNode.props.name).toBe('close');
    });
  };

  const registerTypeWhen = (when: StepDefinitions['when']) => {
    when(/^I type "([^"]+)" into the input$/, async (value: string) => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.setValue(value);
      });
    });
  };

  const registerOnChangeThen = (then: StepDefinitions['then']) => {
    then(/^onChangeText is called with "([^"]+)"$/, (value: string) => {
      expect(onChangeText).not.toBeNull();
      expect(onChangeText).toHaveBeenCalledWith(value);
    });
  };

  const registerClearWhen = (when: StepDefinitions['when']) => {
    when('I press the clear button', async () => {
      expect(hookState).not.toBeNull();
      const clearMock = jest.fn();
      hookState!.inputRef.current = { clear: clearMock } as any;
      await act(async () => {
        (hookState!.rightNode as React.ReactElement).props.onPress();
      });
      expect(clearMock).toHaveBeenCalledTimes(1);
    });
  };

  const registerOnClearThen = (then: StepDefinitions['then']) => {
    then('onClear is called once', () => {
      expect(onClear).not.toBeNull();
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  };

  const registerSecureVisibleThen = (then: StepDefinitions['then']) => {
    then(/^secureVisible is (true|false)$/, (value: string) => {
      expect(hookState).not.toBeNull();
      expect(hookState!.secureVisible).toBe(value === 'true');
    });
  };

  const registerSecureIconThen = (then: StepDefinitions['then']) => {
    then(/^the secure toggle icon name is "([^"]+)"$/, (iconName: string) => {
      expect(hookState).not.toBeNull();
      const rightNode = hookState!.rightNode as React.ReactElement;
      const iconNode = rightNode.props.children as React.ReactElement;
      expect(iconNode.props.name).toBe(iconName);
    });
  };

  const registerToggleSecureWhen = (when: StepDefinitions['when']) => {
    when('I toggle secure visibility', async () => {
      expect(hookState).not.toBeNull();
      await act(async () => {
        hookState!.toggleSecure();
      });
    });
  };

  test(
    'uncontrolled input builds left icon and clear button and clears value',
    ({ given, when, then }: StepDefinitions) => {
      registerThemeGiven(given);
      registerUncontrolledGiven(given);
      registerRenderWhen(when);
      registerValueThen(then);
      registerHelperThen(then);
      registerLeftIconThen(then);
      registerClearIconThen(then);
      registerTypeWhen(when);
      registerOnChangeThen(then);
      registerClearWhen(when);
      registerOnClearThen(then);
    },
  );

  test(
    'controlled secure input toggles visibility icon',
    ({ given, when, then }: StepDefinitions) => {
      registerThemeGiven(given);
      registerControlledGiven(given);
      registerRenderWhen(when);
      registerValueThen(then);
      registerSecureVisibleThen(then);
      registerSecureIconThen(then);
      registerToggleSecureWhen(when);
      registerTypeWhen(when);
      registerOnChangeThen(then);
    },
  );
};
