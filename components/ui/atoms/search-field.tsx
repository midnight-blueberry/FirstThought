import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
} from 'react-native';

const SearchField: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  return (
    <TextInput
        style={styles.searchInput}
        placeholder="Search diaries..."
        value={search}
        onChangeText={setSearch}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    marginLeft: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8
  }
}); 

export default SearchField;