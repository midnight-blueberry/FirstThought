import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

const InputField: React.FC = () => {
  const [value, setValue] = useState<string>('');

  return (
    <TextInput
        style={styles.searchInput}
        placeholder="Search diaries..."
        value={value}
        onChangeText={setValue}
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

export default InputField;