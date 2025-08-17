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
    const [leftChild, middleChild, rightChild] = childrenArray;
    return (
      <View style={[...baseStyle, styles.screenHeader]}>
        <View style={styles.fixed}>{leftChild}</View>
        <View style={styles.flexible}>{middleChild}</View>
        <View style={styles.fixed}>{rightChild}</View>
      </View>
    );
  }

  if (childrenArray.length === 2) {
    const [leftChild, rightChild] = childrenArray;
    return (
      <View style={[...baseStyle, styles.screenHeader]}>
        <View style={styles.fixed}>{leftChild}</View>
        <View style={styles.flexible}>{rightChild}</View>
      </View>
    );
  }

  return <View style={baseStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenHeader: {},
  fixed: {
    justifyContent: 'center',
  },
  flexible: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Header;

