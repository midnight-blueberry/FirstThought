import React, { useLayoutEffect } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '@hooks/useTheme';

interface Props {
  transparent?: boolean;
}

export default function useHeaderThemeSync({ transparent }: Props = {}) {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { background, basic } = theme.colors;
  const { isDark } = theme;
  const barStyle = isDark ? 'light-content' : 'dark-content';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: transparent ? 'transparent' : background },
      headerTransparent: !!transparent,
      headerTintColor: basic,
    });
  }, [navigation, background, basic, isDark, transparent]);

  return <StatusBar translucent barStyle={barStyle} />;
}

