import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { resolveFont } from '@/constants/fonts/resolve';
import { useSettings } from '@/state/SettingsContext';

export type AppTextInputProps = TextInputProps;

const AppTextInput = forwardRef<TextInput, AppTextInputProps>((props, ref) => {
  const { settings } = useSettings();
  const { key } = resolveFont(settings.fontFamily, parseInt(String(settings.fontWeight), 10));
  const { style, ...rest } = props;
  return <TextInput ref={ref} {...rest} style={[{ fontFamily: key }, style]} />;
});
AppTextInput.displayName = 'AppTextInput';

export { AppTextInput };
export default AppTextInput;

