import React, { PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

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
        <Text style={styles?.text}>{ children }</Text>
    </TouchableOpacity>
  );
};

export default AppButton;