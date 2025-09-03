import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top, // верхний отступ под статус-бар
        paddingBottom: insets.bottom, // нижний отступ под жесткую область/домой-бар
      }}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
