import React, { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styledNative, { DefaultTheme, useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';

// Стилевой компонент, наследующий AppText, но рендерящийся как TextInput

const Container = styledNative.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-left: 16px;
  padding-vertical: 0px;
  padding-left: 12px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius}px;
  border-width: ${({ theme }: { theme: DefaultTheme }) => theme.borderWidth}px;
  border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
`;

const StyledInput = styledNative(AppText).attrs(({ theme }: { theme: DefaultTheme }) => ({
  as: TextInput,
  placeholderTextColor: theme.colors.basic,
}))`
  flex: 1;
  font-family: 'MainFont';
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSize.medium}px;
`;

const SearchButton = styledNative.TouchableOpacity`
  padding-left: 8px;
  padding-right: 12px;
`;

const InputField: React.FC<TextInputProps> = (props) => {
  const [value, setValue] = useState<string>('');
  const theme = useTheme();

  return (
    <Container>
      <StyledInput
        value={value}
        onChangeText={setValue}
        {...props}
      />
      <SearchButton>
        <Ionicons name="search" size={theme.iconSize.medium} color={theme.colors.basic} />
      </SearchButton>
    </Container>
  );
};

export default InputField;
