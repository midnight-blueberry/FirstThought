// app/settings.tsx
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../theme';

export default function Settings() {  
  const { theme, setTheme } = useContext(ThemeContext);

  const increaseFont = () => {
    setTheme({
      ...theme,
      fontSizes: {
        small: theme.fontSizes.small + 2,
        medium: theme.fontSizes.medium + 2,
        large: theme.fontSizes.large + 2,
        xlarge: theme.fontSizes.xlarge + 2,
      },
    });
  };

  const decreaseFont = () => {
    setTheme({
      ...theme,
      fontSizes: {
        small: theme.fontSizes.small - 2,
        medium: theme.fontSizes.medium - 2,
        large: theme.fontSizes.large - 2,
        xlarge: theme.fontSizes.xlarge - 2,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
