// header.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
// берём навигацию из expo-router (он проксирует react-navigation)
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchField from '../molecules/input-field';

const Header: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={8}>
        <Ionicons name="menu" size={theme.iconSize.large} color={theme.colors.basic} />
      </TouchableOpacity>
      <SearchField placeholder="Поиск по всем дневникам..." />
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
