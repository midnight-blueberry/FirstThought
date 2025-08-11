import React, { PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';

type AppButtonProps = PropsWithChildren<{
  onPress: (event: GestureResponderEvent) => void;
  iconName: string;
}>;

const ButtonWithIcon: React.FC<AppButtonProps> = ({ onPress, iconName }: AppButtonProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          width: theme.buttonSizes.medium,
          height: theme.buttonSizes.medium,
          borderRadius: theme.buttonSizes.medium / 2,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={theme.iconSize.medium} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
});

export default ButtonWithIcon;
