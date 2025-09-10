import React, { useContext, useRef } from 'react';
import { Animated, View, Pressable } from 'react-native';
import useTheme from '@hooks/useTheme';
import { StableAnchorContext } from '@/features/scroll/useStableAnchor';

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
  const anchorCtx = useContext(StableAnchorContext);
  const itemRefs = useRef<Record<number, View | null>>({});

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
        const pressProps = onPress
          ? {
              ref: (r: View) => {
                itemRefs.current[i] = r;
              },
              onPressIn: () => {
                const r = itemRefs.current[i];
                if (r) {
                  anchorCtx?.setAnchor(r);
                }
              },
              onPress: () => {
                anchorCtx?.captureBeforeUpdate();
                onPress(i);
              },
            }
          : {};
        if (blinkIndex === i) {
          return (
            <Wrapper key={i} style={containerStyle} {...pressProps}>
              {i < filledCount && (
                <Animated.View style={[innerStyle, { opacity: blinkAnim }]} />
              )}
            </Wrapper>
          );
        }
        return (
          <Wrapper key={i} style={containerStyle} {...pressProps}>
            {i < filledCount && <View style={innerStyle} />}
          </Wrapper>
        );
      })}
    </>
  );
};

export default BarIndicator;
