// header.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
// берём навигацию из expo-router (он проксирует react-navigation)
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import MenuIcon from '../atoms/menu-icon';
import SearchField from '../molecules/input-field';

const Header: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={8}>
        <MenuIcon />
      </TouchableOpacity>
      <SearchField placeholder="Искать по всем дневникам..." />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
});

export default Header;
