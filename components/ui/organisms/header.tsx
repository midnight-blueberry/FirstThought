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

  const shadowStyle = {
    shadowColor: showShadow ? theme.colors.basic : 'transparent',
    shadowOffset: { width: 0, height: showShadow ? theme.borderWidth.small : 0 },
    shadowOpacity: showShadow ? 0.5 : 0,
    shadowRadius: showShadow ? 3 : 0,
    elevation: showShadow ? 4 : 0,
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
