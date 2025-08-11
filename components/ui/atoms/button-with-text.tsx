import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
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
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors[type],
        borderRadius: theme.borderRadius,
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.padding.medium,
      }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText color={`${type}Text`}>{title}</AppText>
    </TouchableOpacity>
  );
};

export default AppButton;
