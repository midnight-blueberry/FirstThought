import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import useTheme from '@hooks/useTheme';
import type { DrawerParamList } from './types';

export default function DrawerContent(
  props: DrawerContentComponentProps<DrawerParamList>,
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
