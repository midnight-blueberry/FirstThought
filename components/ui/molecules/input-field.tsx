import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styledNative, { DefaultTheme, useTheme } from 'styled-components/native';

const Container = styledNative.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-left: 16px;
  padding-vertical: ${({ theme }: { theme: DefaultTheme }) =>
    theme.spacing.small + 2}px;
  padding-left: 12px;
  height: ${({ theme }: { theme: DefaultTheme }) =>
    theme.iconSize.small +
    (theme.spacing.small + 2) * 2 +
    theme.borderWidth * 2}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius}px;
  border-width: ${({ theme }: { theme: DefaultTheme }) => theme.borderWidth}px;
  border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
`;

const StyledInput = styledNative.TextInput.attrs(({ theme }: { theme: DefaultTheme }) => ({
  placeholderTextColor: theme.colors.disabled,
}))`
  flex: 1;
  font-family: 'MainFont';
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSize.medium}px;
  line-height: ${({ theme }: { theme: DefaultTheme }) => theme.fontSize.medium}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
  text-align-vertical: center;
  padding-vertical: 0px;
  padding-top: 3px;
`;

const SearchButton = styledNative.TouchableOpacity`
  padding-left: 8px;
  padding-right: 12px;
  justify-content: center;
  align-items: center;
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
