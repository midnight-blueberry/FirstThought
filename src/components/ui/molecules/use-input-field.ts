import React, { useRef, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';
import type { InputFieldProps } from './input-field';

export const useInputFieldState = (props: InputFieldProps) => {
  const {
    value: valueProp,
    defaultValue = '',
    onChangeText,
    secureTextEntry,
    leftAccessory,
    rightAccessory,
    onClear,
    leftIconName,
    helperText,
    caption,
  } = props;

  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const isControlled = valueProp !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const value = isControlled ? valueProp ?? '' : innerValue;

  const setValue = (text: string) => {
    if (!isControlled) {
      setInnerValue(text);
    }
    onChangeText?.(text);
  };

  const [focused, setFocused] = useState(false);
  const [secureVisible, setSecureVisible] = useState(false);
  const toggleSecure = () => setSecureVisible(prev => !prev);

  const state = { focused, value };

  let leftNode = typeof leftAccessory === 'function' ? leftAccessory(state) : leftAccessory;
  if (!leftNode && leftIconName) {
    leftNode = React.createElement(Ionicons, {
      name: leftIconName,
      size: theme.iconSize.small,
      color: theme.colors.basic,
    });
  }

  let rightNode: React.ReactNode | undefined;
  if (onClear && value.length > 0) {
    rightNode = React.createElement(
      TouchableOpacity,
      {
        onPress: () => {
          if (!isControlled) {
            setInnerValue('');
          }
          inputRef.current?.clear();
          onClear();
        },
        accessibilityRole: 'button',
      },
      React.createElement(Ionicons, {
        name: 'close',
        size: theme.iconSize.small,
        color: theme.colors.disabled,
      }),
    );
  } else if (rightAccessory) {
    rightNode =
      typeof rightAccessory === 'function'
        ? rightAccessory(state)
        : rightAccessory;
  } else if (secureTextEntry) {
    rightNode = React.createElement(
      TouchableOpacity,
      { onPress: toggleSecure, accessibilityRole: 'button' },
      React.createElement(Ionicons, {
        name: secureVisible ? 'eye' : 'eye-off',
        size: theme.iconSize.small,
        color: theme.colors.basic,
      }),
    );
  }

  const helper = helperText ?? caption;

  return {
    value,
    setValue,
    isControlled,
    secureVisible,
    toggleSecure,
    inputRef,
    leftNode,
    rightNode,
    helper,
    focused,
    setFocused,
  };
};
