import React, { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styledNative, { DefaultTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';

// Стилевой компонент, наследующий AppText, но рендерящийся как TextInput

const StyledInput = styledNative(AppText).attrs(({ theme }: { theme: DefaultTheme }) => ({
  as: TextInput,
  placeholderTextColor: theme.colors.disabled,
}))`
  flex: 1;
  margin-left: 16px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius}px;
  border-width: ${({ theme }: { theme: DefaultTheme }) => theme.borderWidth}px;
  border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
  font-family: 'MainFont';
`;

const InputField: React.FC<TextInputProps> = (props) => {
  const [value, setValue] = useState<string>('');

  return (
    <StyledInput
      variant="medium"
      value={value}
      onChangeText={setValue}
      {...props}
    />
  );
};

export default InputField;
