import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import IconButton from './icon-button';

interface SaveIconProps {
  visible?: boolean;
  fadeAnim?: Animated.Value;
}

const SaveIcon: React.FC<SaveIconProps> = ({ visible = false, fadeAnim }) => {
  const anim = fadeAnim ?? useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fadeAnim) return;
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, anim, fadeAnim]);

  return (
    <Animated.View pointerEvents="none" style={{ opacity: anim }}>
      <IconButton icon="save-outline" />
    </Animated.View>
  );
};

export default SaveIcon;
