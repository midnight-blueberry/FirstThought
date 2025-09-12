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
  const { background } = theme.colors;
  const { isDark } = theme;
  const barStyle = isDark ? 'light-content' : 'dark-content';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: transparent ? 'transparent' : background },
      headerTransparent: !!transparent,
      headerTintColor: isDark ? '#fff' : '#000',
    });
  }, [navigation, background, isDark, transparent]);

  return <StatusBar translucent barStyle={barStyle} />;
}

