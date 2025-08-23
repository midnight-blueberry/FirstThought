import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          height: theme.borderWidth.small,
          backgroundColor: theme.colors.basic,
          alignSelf: 'stretch',
          marginBottom: theme.margin.medium,
          borderRadius: theme.borderWidth.medium / 2,
        },
        style,
      ]}
    />
  );
};

const propsAreEqual = (prev: DividerProps, next: DividerProps) => prev.style === next.style;

export default React.memo(Divider, propsAreEqual);
