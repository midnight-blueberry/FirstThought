import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingsScreen from './index';
import { IconButton } from '@components/ui/atoms';
import useTheme from '@hooks/useTheme';
import useHeaderConfig from '@hooks/useHeaderConfig';

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const baseHeaderStyle = useHeaderConfig(theme, top);

  const screenOptions = useMemo(
    () => ({
      headerStyle: { ...baseHeaderStyle, elevation: 0, zIndex: 2000 },
      headerTintColor: theme.colors.headerForeground,
      headerShadowVisible: theme.headerShadowVisible,
    }),
    [baseHeaderStyle, theme.colors.headerForeground, theme.headerShadowVisible],
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: 'Настройки',
          headerLeft: () => (
            <IconButton
              icon="chevron-back"
              onPress={() => navigation.goBack()}
            />
          ),
          headerRightContainerStyle: { marginRight: 12 },
        })}
      />
    </Stack.Navigator>
  );
}
