import { useCallback } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useNavigation } from 'expo-router';
import { useTheme } from 'styled-components/native';

export default function useHeaderShadow() {
  const navigation = useNavigation();
  const theme = useTheme();

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const hasShadow = y > 0;
      navigation.setOptions({
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: hasShadow ? 4 : 0,
        },
        headerShadowVisible: hasShadow,
      });
    },
    [navigation, theme]
  );
}
