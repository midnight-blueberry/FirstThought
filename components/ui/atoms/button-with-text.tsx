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
const AppButton: React.FC<ButtonProps> = ({ title, type, onPress, style, ...props }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.colors[type],
          borderRadius: theme.borderRadius,
          paddingVertical: theme.spacing.medium,
          paddingHorizontal: theme.padding.medium,
          alignItems: 'center',
          width: '100%',
        },
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      {...props}
    >
      <AppText
        color={`${type}Text`}
        style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

export default AppButton;
