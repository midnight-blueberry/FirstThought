import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import MenuIcon from '../atoms/menu-icon';
import SearchField from '../molecules/input-field';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
        <MenuIcon />
        <SearchField />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  }
}); 

export default Header;