import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'styled-components/native';

interface HeaderProps {
  children: ReactNode;
  showShadow?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Header: React.FC<HeaderProps> = ({ children, showShadow = false, style }) => {
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

  return (
    <View
      style={[
        styles.header,
        {
          padding: theme.padding.small,
          backgroundColor: theme.colors.background,
          borderColor: 'transparent',
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
});

export default Header;
