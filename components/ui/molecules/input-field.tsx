import React, { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styledNative from 'styled-components/native';
import AppText from '../atoms/app-text';

// Стилевой компонент, наследующий AppText, но рендерящийся как TextInput
const StyledInput = styledNative(AppText).attrs({ as: TextInput })`
  flex: 1;
  margin-left: 16px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  background-color: #fff;
  border-radius: 8px;
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
