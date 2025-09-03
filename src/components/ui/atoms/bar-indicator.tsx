import React from 'react';
import { Animated, View, Pressable } from 'react-native';
import useTheme from '@hooks/useTheme';

interface BarIndicatorProps {
  total: number;
  filledCount: number;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
  containerColor: string;
  fillColor: string;
  onPress?: (index: number) => void;
}

const BarIndicator: React.FC<BarIndicatorProps> = ({
  total,
  filledCount,
  blinkIndex,
  blinkAnim,
  containerColor,
  fillColor,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <>
      {Array.from({ length: total }).map((_, i) => {
        const containerStyle = {
          width: theme.iconSize.xsmall,
          height: theme.iconSize.small * (0.5 + i * 0.25),
          marginHorizontal: theme.margin.small / 2,
          borderColor: containerColor,
          borderWidth: theme.borderWidth.xsmall,
          borderRadius: theme.borderRadius / 2,
          overflow: 'hidden',
        } as const;
        const innerStyle = {
          width: '100%',
          height: '100%',
          backgroundColor: fillColor,
        } as const;
        const Wrapper = onPress ? Pressable : View;
        if (blinkIndex === i) {
          return (
            <Wrapper
              key={i}
              style={containerStyle}
              onPress={onPress ? () => onPress(i) : undefined}
            >
              {i < filledCount && (
                <Animated.View style={[innerStyle, { opacity: blinkAnim }]} />
              )}
            </Wrapper>
          );
        }
        return (
          <Wrapper
            key={i}
            style={containerStyle}
            onPress={onPress ? () => onPress(i) : undefined}
          >
            {i < filledCount && <View style={innerStyle} />}
          </Wrapper>
        );
      })}
    </>
  );
};

export default BarIndicator;
