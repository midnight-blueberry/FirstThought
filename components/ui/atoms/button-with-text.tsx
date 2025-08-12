import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppText from './app-text';

interface ButtonProps extends TouchableOpacityProps {
  /**
   * Текст, отображаемый внутри кнопки
   */
  title: string;
  type: "primary" | "secondary";
  onPress: () => void;
  /**
   * Изменение ключа запускает анимацию блика
   */
  glintKey?: number;
}

/**
 * Кнопка с текстом и возможностью переопределить стили
 */
const AppButton: React.FC<ButtonProps> = ({ title, type, onPress, style, glintKey, ...props }) => {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [showGlint, setShowGlint] = useState(false);

  useEffect(() => {
    if (glintKey === undefined) return;
    const overlayWidth = 40;
    translateX.setValue(-overlayWidth);
    setShowGlint(true);
    Animated.timing(translateX, {
      toValue: width + overlayWidth,
      duration: 800,
      useNativeDriver: true,
    }).start(() => setShowGlint(false));
  }, [glintKey, width, translateX]);

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
          overflow: 'hidden',
        },
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      {...props}
    >
      <AppText
        color={`${type}Text`}
        style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}
      >
        {title}
      </AppText>
      {showGlint && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 40,
            backgroundColor: 'rgba(255,255,255,0.5)',
            transform: [{ translateX }],
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
