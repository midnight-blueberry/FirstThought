import React, { PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import AppText from './app-text';

type AppButtonProps = PropsWithChildren<{
  onPress: (event: GestureResponderEvent) => void;
  styles?: {
    button?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
  };
}>;

const AppButton: React.FC<AppButtonProps> = ({ onPress, styles, children }: AppButtonProps) => {
  return (
    <TouchableOpacity style={styles?.button} onPress={onPress}>
        <AppText style={styles?.text}>{ children }</AppText>
    </TouchableOpacity>
  );
};

export default AppButton;