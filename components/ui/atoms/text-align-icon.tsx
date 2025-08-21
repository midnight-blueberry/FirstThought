import React from 'react';
import { View } from 'react-native';

interface TextAlignIconProps {
  variant: 'left' | 'justify';
  color: string;
}

const TextAlignIcon: React.FC<TextAlignIconProps> = ({ variant, color }) => (
  <View style={{ width: 24, height: 24, justifyContent: 'space-between' }}>
    {[0, 1, 2].map(i => (
      <View
        key={i}
        style={{
          height: 2,
          width: variant === 'left' ? [16, 20, 12][i] : 24,
          backgroundColor: color,
          alignSelf: 'flex-start',
        }}
      />
    ))}
  </View>
);

export default TextAlignIcon;
