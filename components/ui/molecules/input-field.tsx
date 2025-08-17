/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-left: 16px;
  padding-left: ${({ theme }: { theme: DefaultTheme }) =>
    theme.spacing.large}px;
  height: ${({ theme }: { theme: DefaultTheme }) =>
    theme.iconSize.small + theme.spacing.large * 2 +
    theme.borderWidth.medium * 2}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius}px;
  border-width: ${({ theme }: { theme: DefaultTheme }) =>
    theme.borderWidth.medium}px;
  border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
`;

const StyledInput = styled.TextInput.attrs(({ theme }: { theme: DefaultTheme }) => ({
  placeholderTextColor: theme.colors.disabled,
}))`
  flex: 1;
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.fontName};
  font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeight};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSize.medium}px;
  height: 100%;
  line-height: ${({ theme }: { theme: DefaultTheme }) =>
    theme.iconSize.small + theme.spacing.large * 2}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
  text-align-vertical: center;
  padding-vertical: 0px;
`;

const SearchButton = styled.TouchableOpacity`
  padding-left: ${({ theme }: { theme: DefaultTheme }) =>
    theme.spacing.medium}px;
  padding-right: ${({ theme }: { theme: DefaultTheme }) =>
    theme.spacing.large}px;
  justify-content: center;
  align-items: center;
  height: 100%;
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
        <Ionicons name="search" size={theme.iconSize.small} color={theme.colors.basic} />
      </SearchButton>
    </Container>
  );
};

export default InputField;
