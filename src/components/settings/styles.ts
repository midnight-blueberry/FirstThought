import { Platform, TextStyle } from 'react-native';

export const settingsOptionLabelText: TextStyle = {
  includeFontPadding: false,
  transform: [{ translateY: Platform.OS === 'android' ? 2 : 0 }],
};

