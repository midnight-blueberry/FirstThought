import React from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from 'styled-components/native';

interface BarIndicatorProps {
  total: number;
  filledCount: number;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
  containerColor: string;
  fillColor: string;
}

const BarIndicator: React.FC<BarIndicatorProps> = ({
  total,
  filledCount,
  blinkIndex,
  blinkAnim,
  containerColor,
  fillColor,
}) => {
  const theme = useTheme();

  return (
    <>
      {Array.from({ length: total }).map((_, i) => {
        const containerStyle = {
          width: theme.iconSize.xsmall,
          height: theme.iconSize.small * (0.5 + i * 0.25),
          marginHorizontal: theme.spacing.small / 2,
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
        if (blinkIndex === i) {
          return (
            <View key={i} style={containerStyle}>
              {i < filledCount && <Animated.View style={[innerStyle, { opacity: blinkAnim }]} />}
            </View>
          );
        }
        return (
          <View key={i} style={containerStyle}>
            {i < filledCount && <View style={innerStyle} />}
          </View>
        );
      })}
    </>
  );
};

export default BarIndicator;
