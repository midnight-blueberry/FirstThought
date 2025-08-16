import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../atoms/app-text';
import IconButton from '../atoms/icon-button';

interface HeaderProps {
  children?: ReactNode;
  title?: string;
  onBack?: (() => void) | null;
  saveOpacity?: Animated.Value;
  showShadow?: boolean;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  children,
  title,
  onBack,
  saveOpacity,
  showShadow = false,
  style,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (typeof onBack === 'function') onBack();
    else navigation.goBack();
  };

  const shadowStyle = showShadow
    ? {
        shadowColor: theme.colors.basic,
        shadowOffset: { width: 0, height: theme.borderWidth.small },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 4,
      }
    : undefined;

  const leftStyle = { left: theme.padding.small } as const;
  const rightStyle = { right: theme.padding.small } as const;

  return (
    <View
      style={[
        styles.header,
        title && styles.screenHeader,
        {
          padding: theme.padding.small,
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.background,
          borderWidth: 0,
        },
        shadowStyle,
        style,
      ]}
    >
      {title ? (
        <>
          {onBack !== null && (
            <IconButton
              icon="chevron-back"
              onPress={handleBack}
              size={theme.iconSize.xlarge}
              style={[styles.left, leftStyle]}
            />
          )}
          <AppText variant="large">{title}</AppText>
          {saveOpacity && (
            <Animated.View
              pointerEvents="none"
              style={[styles.right, rightStyle, { opacity: saveOpacity }]}
            >
              <IconButton icon="save-outline" size={theme.iconSize.large} />
            </Animated.View>
          )}
        </>
      ) : (
        children
      )}
    </View>
  );
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

