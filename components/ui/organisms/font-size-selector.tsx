import React from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import IconButton from '../atoms/icon-button';

interface FontSizeSelectorProps {
  level: number;
  onIncrease: () => void;
  onDecrease: () => void;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
  labelFontSizeAnim?: Animated.AnimatedInterpolation<number> | Animated.Value;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  level,
  onIncrease,
  onDecrease,
  blinkIndex,
  blinkAnim,
  labelFontSizeAnim,
}) => {
  const theme = useTheme();

  return (
    <>
      <AppText
        variant='large'
        style={{ marginBottom: 8, fontWeight: 'bold', marginTop: 4 }}
        animatedFontSize={labelFontSizeAnim}
      >
        Размер шрифта
      </AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <IconButton icon='remove' onPress={onDecrease} size={theme.iconSize.large} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const containerStyle = {
              width: theme.iconSize.small,
              height: theme.iconSize.small * (0.5 + i * 0.25),
              marginHorizontal: theme.spacing.small / 2,
              borderColor: theme.colors.basic,
              borderWidth: theme.borderWidth.xsmall,
              borderRadius: theme.borderRadius / 2,
              overflow: 'hidden',
            } as const;
            const innerStyle = {
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors.accent,
            } as const;
            if (blinkIndex === i) {
              return (
                <View key={i} style={containerStyle}>
                  {i < level && <Animated.View style={[innerStyle, { opacity: blinkAnim }]} />}
                </View>
              );
            }
            return (
              <View key={i} style={containerStyle}>
                {i < level && <View style={innerStyle} />}
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <IconButton icon='add' onPress={onIncrease} size={theme.iconSize.large} />
        </View>
      </View>
    </>
  );
};

export default FontSizeSelector;
