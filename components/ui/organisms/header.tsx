import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

interface HeaderProps {
  children?: ReactNode;
  showShadow?: boolean;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  children,
  showShadow = false,
  style,
}) => {
  const theme = useTheme();

  const shadowStyle = showShadow
    ? {
        shadowColor: theme.colors.basic,
        shadowOffset: { width: 0, height: theme.borderWidth.small },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 4,
      }
    : undefined;

  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length > 3) {
    console.warn('Header supports up to 3 children.');
  }

  const baseStyle = [
    styles.header,
    {
      padding: theme.padding.small,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.background,
      borderWidth: 0,
    },
    shadowStyle,
    style,
  ];

  if (childrenArray.length === 3) {
    const leftStyle = { left: theme.padding.small } as const;
    const rightStyle = { right: theme.padding.small } as const;
    const [leftChild, centerChild, rightChild] = childrenArray;
    return (
      <View style={[...baseStyle, styles.screenHeader]}>
        <View style={[styles.left, leftStyle]}>{leftChild}</View>
        {centerChild}
        <View style={[styles.right, rightStyle]}>{rightChild}</View>
      </View>
    );
  }

  if (childrenArray.length === 2) {
    const [leftChild, middleChild] = childrenArray;
    return (
      <View style={baseStyle}>
        <View>{leftChild}</View>
        <View style={{ flex: 1 }}>{middleChild}</View>
      </View>
    );
  }

  return <View style={baseStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  screenHeader: {
    justifyContent: 'center',
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

export default Header;

