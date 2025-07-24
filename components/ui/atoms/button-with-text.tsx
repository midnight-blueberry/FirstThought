import { ColorsContext, SizesContext } from '@/theme';
import React, { useContext } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import AppText from './app-text';

interface ButtonProps extends TouchableOpacityProps {
  /**
   * Текст, отображаемый внутри кнопки
   */
  title: string;
  type: "primary" | "secondary";
  onPress: () => void;
}

/**
 * Кнопка с текстом и возможностью переопределить стили
 */
const AppButton: React.FC<ButtonProps> = ({ title, type, onPress }) => {
  const { sizes, setSizes } = useContext(SizesContext);
  const { colors, setColors } = useContext(ColorsContext);
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors[type],
      }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText color={`${type}Text`}>{title}</AppText>
    </TouchableOpacity>
  );
};

export default AppButton;
