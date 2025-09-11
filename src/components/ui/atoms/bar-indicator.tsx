import React, { useContext } from 'react';
import { Animated, View, Pressable } from 'react-native';
import useTheme from '@hooks/useTheme';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import useStickySelection from '@/features/sticky-position/useStickySelection';

interface BarIndicatorProps {
  total: number;
  filledCount: number;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
  containerColor: string;
  fillColor: string;
  onPress?: (index: number) => void;
  getItemId?: (index: number) => string;
}

const BarIndicator: React.FC<BarIndicatorProps> = ({
  total,
  filledCount,
  blinkIndex,
  blinkAnim,
  containerColor,
  fillColor,
  onPress,
  getItemId,
}) => {
  const theme = useTheme();
  const anchorCtx = useContext(AnchorStableScrollContext);
  const { registerPress } = useStickySelection();

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
        const ref = React.createRef<View>();
        const pressProps = onPress
          ? {
              ref,
              onPressIn: (e: any) => anchorCtx?.setAnchor(e.currentTarget),
              onPress: async () => {
                anchorCtx?.captureBeforeUpdate();
                if (getItemId) {
                  await registerPress(getItemId(i), ref);
                }
                onPress(i);
              },
            }
          : { ref };
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
