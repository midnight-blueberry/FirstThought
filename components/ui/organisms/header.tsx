import React, { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import IconButton from '../atoms/icon-button';

interface HeaderProps {
  children?: ReactNode;
  showShadow?: boolean;
  style?: ViewStyle;
  title?: string;
  onBack?: (() => void) | null;
  saveOpacity?: Animated.Value;
}

const Header: React.FC<HeaderProps> = ({
  children,
  showShadow = false,
  style,
  title,
  onBack,
  saveOpacity,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) onBack();
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

  const leftStyle = {
    left: theme.padding.small,
  } as const;

  const rightStyle = {
    right: theme.padding.small,
  } as const;

  const content =
    children ?? (
      <>
        {onBack !== null && (
          <IconButton
            icon="chevron-back"
            onPress={handleBack}
            size={theme.iconSize.xlarge}
            style={[styles.left, leftStyle]}
          />
        )}
        {title && <AppText variant="large">{title}</AppText>}
        {saveOpacity && (
          <Animated.View pointerEvents="none" style={[styles.right, rightStyle, { opacity: saveOpacity }]}>
            <IconButton icon="save-outline" size={theme.iconSize.large} />
          </Animated.View>
        )}
      </>
    );

  const paddingStyle = children
    ? { padding: theme.padding.small }
    : { paddingVertical: theme.padding.small, paddingHorizontal: 0 };

  return (
    <View
      style={[
        styles.header,
        paddingStyle,
        Platform.OS === 'android'
          ? {
              backgroundColor: theme.colors.background, // полностью непрозрачный
              height: 56, // целые dp
              flexDirection: 'row',
              alignItems: 'center',
            }
          : undefined,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.background,
          borderWidth: 0,
        },
        !children && styles.center,
        shadowStyle,
        style,
      ]}
      {...(Platform.OS === 'android'
        ? {
            needsOffscreenAlphaCompositing: true,
            renderToHardwareTextureAndroid: true,
          }
        : undefined)}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  center: {
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

