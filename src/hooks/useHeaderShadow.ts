import { useNavigation } from 'expo-router';
import { useCallback } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useTheme } from 'styled-components/native';

export default function useHeaderShadow() {
  const navigation = useNavigation();
  const theme = useTheme();
  const headerHeight = theme.iconSize.medium + theme.padding.large * 2;

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const hasShadow = y > 0;
      navigation.setOptions({
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
          elevation: hasShadow ? 4 : 0,
          height: headerHeight,
        },
        headerShadowVisible: hasShadow,
      });
    },
    [navigation, theme, headerHeight]
  );
}
