import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';
import type { DefaultTheme } from 'styled-components/native';

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
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  editable?: boolean;
  testID?: string;

  label?: string;
  helperText?: string;
  errorText?: string;

  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  leftAccessory?:
    | React.ReactNode
    | ((state: { focused: boolean; value: string }) => React.ReactNode);
  rightAccessory?:
    | React.ReactNode
    | ((state: { focused: boolean; value: string }) => React.ReactNode);
  onClear?: () => void;

  /** @deprecated use leftAccessory */
  leftIconName?: string;
  /** @deprecated use errorText */
  error?: boolean;
  /** @deprecated use helperText */
  caption?: string;
};

const Label: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: { marginBottom: theme.margin.small },
      }),
    [theme],
  );
  return (
    <AppText variant="small" style={styles.text}>
      {text}
    </AppText>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: { marginTop: theme.margin.small },
      }),
    [theme],
  );
  return (
    <AppText variant="small" color="disabled" style={styles.text}>
      {text}
    </AppText>
  );
};

const ErrorMessage: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: { marginTop: theme.margin.small },
      }),
    [theme],
  );
  return (
    <AppText variant="small" color="accent" style={styles.text}>
      {text}
    </AppText>
  );
};

const FieldContainer: React.FC<{ style?: any; children: React.ReactNode }> = ({
  style,
  children,
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: theme.borderRadius,
          borderWidth: theme.borderWidth.small,
          borderColor: theme.colors.basic,
        },
      }),
    [theme],
  );
  return <View style={[styles.container, style]}>{children}</View>;
};

const createStyles = (theme: DefaultTheme) => {
  const base = StyleSheet.create({
    textInput: {
      flex: 1,
      paddingVertical: 0,
      color: theme.colors.basic,
      fontFamily: theme.fontName,
      fontWeight: theme.fontWeight,
      includeFontPadding: false,
    },
    leftAccessory: {
      marginRight: theme.margin.small,
    },
    rightAccessory: {
      marginLeft: theme.margin.small,
    },
  });

  const size = {
    sm: {
      height: theme.buttonSizes.small,
      paddingHorizontal: theme.padding.medium,
    },
    md: {
      height: theme.buttonSizes.medium,
      paddingHorizontal: theme.padding.medium,
    },
    lg: {
      height: theme.buttonSizes.large,
      paddingHorizontal: theme.padding.large,
    },
  } as const;

  const sizeInput = {
    sm: { fontSize: theme.fontSize.small },
    md: { fontSize: theme.fontSize.medium },
    lg: { fontSize: theme.fontSize.large },
  } as const;

  const variant = {
    filled: { backgroundColor: theme.colors.disabled, borderWidth: 0 },
    outline: { backgroundColor: 'transparent' },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
  } as const;

  const focused = { borderColor: theme.colors.accent };
  const error = { borderColor: theme.colors.accent };
  const disabled = {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  };

  return { ...base, size, sizeInput, variant, focused, error, disabled };
};

export const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      value: valueProp,
      defaultValue = '',
      onChangeText,
      onSubmitEditing,
      placeholder,
      autoCapitalize,
      keyboardType,
      returnKeyType,
      secureTextEntry,
      editable = true,
      testID,
      label,
      helperText,
      errorText: errorTextProp,
      size = 'md',
      variant = 'outline',
      leftAccessory,
      rightAccessory,
      onClear,
      leftIconName,
      error,
      caption,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const inputRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const isControlled = valueProp !== undefined;
    const [innerValue, setInnerValue] = useState<string>(defaultValue);
    const value = isControlled ? valueProp ?? '' : innerValue;

    const handleChangeText = (text: string) => {
      if (!isControlled) {
        setInnerValue(text);
      }
      onChangeText?.(text);
    };

    const [focused, setFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(!!secureTextEntry);
    const hasError = !!errorTextProp || error;

    const state = { focused, value };

    let leftNode: React.ReactNode | undefined =
      typeof leftAccessory === 'function'
        ? leftAccessory(state)
        : leftAccessory;
    if (!leftNode && leftIconName) {
      leftNode = (
        <Ionicons
          name={leftIconName}
          size={theme.iconSize.small}
          color={theme.colors.basic}
        />
      );
    }

    let rightNode: React.ReactNode | undefined;
    if (onClear && value.length > 0) {
      rightNode = (
        <TouchableOpacity
          onPress={() => {
            if (!isControlled) {
              setInnerValue('');
            }
            inputRef.current?.clear();
            onClear();
          }}
          accessibilityRole="button"
        >
          <Ionicons
            name="close"
            size={theme.iconSize.small}
            color={theme.colors.disabled}
          />
        </TouchableOpacity>
      );
    } else if (rightAccessory) {
      rightNode =
        typeof rightAccessory === 'function'
          ? rightAccessory(state)
          : rightAccessory;
    } else if (secureTextEntry) {
      rightNode = (
        <TouchableOpacity
          onPress={() => setIsSecure(prev => !prev)}
          accessibilityRole="button"
        >
          <Ionicons
            name={isSecure ? 'eye-off' : 'eye'}
            size={theme.iconSize.small}
            color={theme.colors.basic}
          />
        </TouchableOpacity>
      );
    }

    const helper = !hasError ? helperText ?? caption : undefined;
    const errorText = hasError ? errorTextProp ?? '' : undefined;
    const accessibilityHint = hasError
      ? typeof errorTextProp === 'string' && errorTextProp.length > 0
        ? errorTextProp
        : 'Поле заполнено некорректно'
      : undefined;

    return (
      <View>
        {label ? <Label text={label} /> : null}
        <FieldContainer
          style={[
            styles.size[size],
            styles.variant[variant],
            focused && styles.focused,
            hasError && styles.error,
            !editable && styles.disabled,
          ]}
        >
          {leftNode ? (
            <View style={styles.leftAccessory}>{leftNode}</View>
          ) : null}
          <TextInput
            ref={inputRef}
            style={[styles.textInput, styles.sizeInput[size]]}
            value={value}
            onChangeText={handleChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.disabled}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            secureTextEntry={isSecure}
            editable={editable}
            testID={testID}
            accessibilityLabel={label}
            accessibilityHint={accessibilityHint}
            underlineColorAndroid="transparent"
            {...rest}
          />
          {rightNode ? (
            <View style={styles.rightAccessory}>{rightNode}</View>
          ) : null}
        </FieldContainer>
        {errorText ? (
          <ErrorMessage text={errorText} />
        ) : helper ? (
          <Caption text={helper} />
        ) : null}
      </View>
    );
  },
);

export default InputField;
