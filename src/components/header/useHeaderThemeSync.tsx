import React, { useLayoutEffect } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from 'expo-router';
import useTheme from '@hooks/useTheme';

interface Props {
  transparent?: boolean;
}

export default function useHeaderThemeSync({ transparent }: Props = {}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { isDark } = theme;
  const barStyle = isDark ? 'light-content' : 'dark-content';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: !!transparent,
      headerTintColor: isDark ? '#fff' : '#000',
      headerShadowVisible: false,
      headerShown: true,
      ...(transparent
        ? {
            headerStyle: {
              backgroundColor: 'transparent',
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }
        : null),
    });
  }, [navigation, isDark, transparent]);

  return <StatusBar translucent barStyle={barStyle} />;
}
