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
    : {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      };

  return (
    <View
      style={[
        styles.header,
        {
          padding: theme.padding.small,
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.background,
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        },
        shadowStyle,
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: -1,
          bottom: -1,
          backgroundColor: theme.colors.background,
        }}
      />
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
