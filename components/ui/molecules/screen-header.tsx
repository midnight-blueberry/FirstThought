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

  return (
    <View style={styles.header}>
      {onBack !== null && (
        <IconButton icon="chevron-back" onPress={handleBack} size={theme.iconSize.xlarge} style={styles.left} />
      )}
      <AppText variant="large" style={{ fontWeight: 'bold' }}>{title}</AppText>
      {saveOpacity && (
        <Animated.View pointerEvents="none" style={[styles.right, { opacity: saveOpacity }]}>
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
    marginBottom: 8,
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
