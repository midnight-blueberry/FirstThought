import React from 'react';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import useTheme from '@hooks/useTheme';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: theme.padding.medium,
        backgroundColor: theme.colors.background,
      }}
    >
      <DrawerItem
        label="Настройки"
        onPress={() => props.navigation.navigate('settings/index')}
        labelStyle={{
          fontFamily: theme.fontName,
          fontSize: theme.fontSize.medium,
          fontWeight: theme.fontWeight,
          color: theme.colors.basic,
        }}
        style={{
          borderRadius: theme.borderRadius,
          marginVertical: theme.margin.small,
        }}
      />
      {/* … */}
    </DrawerContentScrollView>
  );
}
