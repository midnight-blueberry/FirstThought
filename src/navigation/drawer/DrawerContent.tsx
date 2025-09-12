import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps as DrawerContentComponentPropsBase,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ParamListBase } from '@react-navigation/native';
import type { DrawerParamList } from './routes';

type DrawerContentComponentProps<ParamList extends ParamListBase> =
  DrawerContentComponentPropsBase;

export default function DrawerContent(
  props: DrawerContentComponentProps<DrawerParamList>,
) {
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
