import React, { PropsWithChildren, useContext } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ColorsContext, SizesContext } from '../../../theme';

type AppButtonProps = PropsWithChildren<{
  onPress: (event: GestureResponderEvent) => void;
  iconName: string;
}>;

const ButtonWithIcon: React.FC<AppButtonProps> = ({ onPress, iconName }: AppButtonProps) => {
  const { colors } = useContext(ColorsContext);
  const { sizes } = useContext(SizesContext);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.primary,
          width: sizes.buttonSizes.medium,
          height: sizes.buttonSizes.medium,
          borderRadius: sizes.buttonSizes.medium / 2
        }]}
      onPress={onPress}>
      <Ionicons name={iconName} size={sizes.iconSizes.medium} color={colors.text} />
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