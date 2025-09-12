import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';

interface OverlayProps {
  visible: boolean;
  color: string;
  blocks: boolean;
  anim: Animated.Value;
}

const Overlay: React.FC<OverlayProps> = ({ visible, color, anim }) => {
  const [pe, setPe] = React.useState<'auto' | 'none'>('none');

  React.useEffect(() => {
    const id = anim.addListener(({ value }) => {
      setPe(value > 0.01 ? 'auto' : 'none');
    });
    return () => anim.removeListener(id);
  }, [anim]);

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View
        pointerEvents={pe}
        style={[StyleSheet.absoluteFillObject, { opacity: anim, backgroundColor: color }]}
      />
    </Portal>
  );
};

export default Overlay;

