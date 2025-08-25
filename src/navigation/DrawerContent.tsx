import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import useTheme from '@hooks/useTheme';

export default function DrawerContent(
  props: DrawerContentComponentProps,
) {
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
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
