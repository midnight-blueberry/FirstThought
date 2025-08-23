import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Portal } from '@gorhom/portal';

interface OverlayProps {
  visible: boolean;
  color: string;
  blocks: boolean;
  anim: Animated.Value;
}

const Overlay: React.FC<OverlayProps> = ({ visible, color, blocks, anim }) => {
  if (!visible) return null;

  return (
    <Portal>
      <Animated.View
        pointerEvents={blocks ? 'auto' : 'none'}
        style={[ StyleSheet.absoluteFillObject, { opacity: anim, backgroundColor: color } ]}
      />
    </Portal>
  );
};

export default Overlay;

