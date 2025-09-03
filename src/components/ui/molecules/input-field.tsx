import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import type {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInputProps,
  TextInput,
} from 'react-native';
import { AppTextInput } from '@components/ui/atoms';
import useTheme from '@hooks/useTheme';
import { Label, HelperText, ErrorText, FieldContainer } from './input-field.parts';
import { buildInputFieldStyles } from './input-field.styles';
import { useInputFieldState } from './use-input-field';

export type InputFieldProps = Omit<
  TextInputProps,
  | 'onChangeText'
  | 'value'
  | 'defaultValue'
  | 'onSubmitEditing'
  | 'placeholder'
  | 'autoCapitalize'
  | 'keyboardType'
  | 'returnKeyType'
  | 'secureTextEntry'
  | 'editable'
  | 'testID'
> & {
  value?: string; defaultValue?: string;
  onChangeText?: (text: string) => void; onSubmitEditing?: () => void;
  placeholder?: string; autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions; returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean; editable?: boolean; testID?: string;
  label?: string; helperText?: string; errorText?: string;
  size?: 'sm' | 'md' | 'lg'; variant?: 'filled' | 'outline' | 'ghost';
  leftAccessory?: React.ReactNode | ((s: { focused: boolean; value: string }) => React.ReactNode);
  rightAccessory?: React.ReactNode | ((s: { focused: boolean; value: string }) => React.ReactNode);
  onClear?: () => void;
  /** @deprecated use leftAccessory */ leftIconName?: string;
  /** @deprecated use errorText */ error?: boolean;
  /** @deprecated use helperText */ caption?: string;
};

export const InputField = forwardRef<TextInput, InputFieldProps>((props, ref) => {
  const { label, size = 'md', variant = 'outline', editable = true, secureTextEntry, errorText: errorTextProp, ...rest } = props;
  const { value, setValue, secureVisible, inputRef, leftNode, rightNode, helper, focused, setFocused } = useInputFieldState(props);

  useImperativeHandle(ref, () => inputRef.current as TextInput);

  const theme = useTheme();
  const hasError = Boolean(errorTextProp || props.error);
  const errorText = hasError ? errorTextProp ?? '' : undefined;
  const styles = buildInputFieldStyles(theme, {
    size,
    variant,
    focused,
    hasError,
    editable,
  });

  return (
    <View>
      {label && <Label text={label} />}
      <FieldContainer style={styles.container}>
        {leftNode && <View style={styles.leftAccessory}>{leftNode}</View>}
        <AppTextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry && !secureVisible}
          editable={editable}
          accessibilityLabel={label}
          accessibilityState={{ disabled: editable === false }}
          accessibilityHint={errorText ? 'Есть ошибка ввода' : undefined}
          testID={props.testID}
          underlineColorAndroid="transparent"
          {...rest}
        />
        {rightNode && <View style={styles.rightAccessory}>{rightNode}</View>}
      </FieldContainer>
      {errorText ? (
        <ErrorText text={errorText} />
      ) : helper ? (
        <HelperText text={helper} />
      ) : null}
    </View>
  );
});

export default InputField;
