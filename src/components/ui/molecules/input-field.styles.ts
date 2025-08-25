import { StyleSheet } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

interface BuildOptions {
  size: 'sm' | 'md' | 'lg';
  variant: 'filled' | 'outline' | 'ghost';
  focused: boolean;
  hasError: boolean;
  editable: boolean;
}

export const buildInputFieldStyles = (
  theme: DefaultTheme,
  { size, variant, focused, hasError, editable }: BuildOptions,
) => {
  const base = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius,
      borderWidth: theme.borderWidth.small,
      borderColor: theme.colors.basic,
    },
    input: {
      flex: 1,
      paddingVertical: 0,
      color: theme.colors.basic,
      fontFamily: theme.fontName,
      fontWeight: theme.fontWeight,
      includeFontPadding: false,
    },
    leftAccessory: { marginRight: theme.margin.small },
    rightAccessory: { marginLeft: theme.margin.small },
  });

  const sizeMap = {
    sm: { height: theme.buttonSizes.small, paddingHorizontal: theme.padding.medium },
    md: { height: theme.buttonSizes.medium, paddingHorizontal: theme.padding.medium },
    lg: { height: theme.buttonSizes.large, paddingHorizontal: theme.padding.large },
  } as const;

  const inputSize = {
    sm: { fontSize: theme.fontSize.small },
    md: { fontSize: theme.fontSize.medium },
    lg: { fontSize: theme.fontSize.large },
  } as const;

  const variantMap = {
    filled: { backgroundColor: theme.colors.disabled, borderWidth: 0 },
    outline: { backgroundColor: 'transparent' },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
  } as const;

  const focusedStyle = focused ? { borderColor: theme.colors.accent } : null;
  const errorStyle = hasError ? { borderColor: theme.colors.accent } : null;
  const disabledStyle =
    editable === false
      ? { backgroundColor: theme.colors.disabled, borderColor: theme.colors.disabled }
      : null;

  return {
    container: [
      base.container,
      sizeMap[size],
      variantMap[variant],
      focusedStyle,
      errorStyle,
      disabledStyle,
    ],
    input: [base.input, inputSize[size]],
    leftAccessory: base.leftAccessory,
    rightAccessory: base.rightAccessory,
  };
};

export type InputFieldStyles = ReturnType<typeof buildInputFieldStyles>;
