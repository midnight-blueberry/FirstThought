import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

export default function useHeaderShadow() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const headerHeight = top + theme.iconSize.medium + theme.padding.large * 2;

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
