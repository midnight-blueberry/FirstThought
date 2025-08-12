import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, ViewProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import AppText from './app-text';

interface SavedLabelProps extends ViewProps {
  /**
   * Текст уведомления
   */
  title: string;
  /**
   * Изменение ключа запускает анимацию блика
   */
  glintKey?: number;
}

/**
 * Надпись со стилем кнопки и анимацией блика
 */
const SavedLabel: React.FC<SavedLabelProps> = ({ title, style, glintKey, ...props }) => {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [showGlint, setShowGlint] = useState(false);

  useEffect(() => {
    if (glintKey === undefined || width === 0) return;
    translateX.setValue(0);
    setShowGlint(true);
    Animated.timing(translateX, {
      toValue: width,
      duration: 800,
      useNativeDriver: true,
    }).start(() => setShowGlint(false));
  }, [glintKey, width, translateX]);

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius,
          paddingVertical: theme.spacing.medium,
          paddingHorizontal: theme.padding.medium,
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden',
        },
        style,
      ]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons
          name="checkmark-sharp"
          size={theme.iconSize.large}
          color={theme.colors.primaryText}
          style={{ marginRight: theme.spacing.small }}
        />
        <AppText color="primaryText" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </AppText>
      </View>
      {showGlint && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 40,
            backgroundColor: 'rgba(255,255,255,0.5)',
            transform: [{ translateX }],
          }}
        />
      )}
    </View>
  );
};

export default SavedLabel;
