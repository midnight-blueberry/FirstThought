import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import IconButton from '../atoms/icon-button';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  saveOpacity?: Animated.Value;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, saveOpacity }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const containerStyle = {
    paddingVertical: theme.padding.small,
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.basic,
    shadowOffset: { width: 0, height: theme.borderWidth.small },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  } as const;

  const leftStyle = {
    left: theme.padding.small,
  } as const;

  const rightStyle = {
    right: theme.padding.small,
  } as const;

  return (
    <View style={[styles.header, containerStyle]}>
      {onBack !== null && (
        <IconButton
          icon="chevron-back"
          onPress={handleBack}
          size={theme.iconSize.xlarge}
          style={[styles.left, leftStyle]}
        />
      )}
      <AppText variant="large" style={{ fontWeight: 'bold' }}>{title}</AppText>
      {saveOpacity && (
        <Animated.View pointerEvents="none" style={[styles.right, rightStyle, { opacity: saveOpacity }]}> 
          <IconButton icon="save-outline" size={theme.iconSize.large} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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

export default ScreenHeader;
