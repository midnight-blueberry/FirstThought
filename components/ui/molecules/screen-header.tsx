import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import IconButton from '../atoms/icon-button';
import Header from '../organisms/header';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  saveOpacity?: Animated.Value;
  showShadow?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, saveOpacity, showShadow = false }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const leftStyle = {
    left: theme.padding.small,
  } as const;

  const rightStyle = {
    right: theme.padding.small,
  } as const;

  return (
    <Header showShadow={showShadow} style={[styles.header, { paddingHorizontal: 0, paddingVertical: theme.padding.small }]}>
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
        <Animated.View pointerEvents="none" style={[styles.right, rightStyle, { opacity: saveOpacity }]}> 
          <IconButton icon="save-outline" size={theme.iconSize.large} />
        </Animated.View>
      )}
    </Header>
  );
};

const styles = StyleSheet.create({
  header: {
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
