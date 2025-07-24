import AppText from '@/components/ui/atoms/app-text';
import AppButton from '@/components/ui/atoms/button-with-text';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { themes } from '../theme';

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;

  const handleSave = () => {
    const chosenTheme = themes.find(t => t.name === selectedThemeName);
    if (chosenTheme) {
      setTheme(chosenTheme);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.color.background }]}>
      <AppText variant='large' style={styles.title}>Настройки</AppText>

      <AppText variant='medium' style={styles.label}>Тема:</AppText>
      {themes.map(theme => (
        <TouchableOpacity
          key={theme.name}
          style={styles.themeOption}
          onPress={() => setSelectedThemeName(theme.name)}
        >
          <AppText
            variant='medium'
            style={theme.name === selectedThemeName ? styles.selected : styles.unselected}
          >
            {theme.name}
          </AppText>
        </TouchableOpacity>
      ))}

      <AppButton title="Сохранить" type="primary" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginTop: 24,
    marginBottom: 8,
  },
  themeOption: {
    paddingVertical: 8,
  },
  selected: {
    fontWeight: 'bold',
  },
  unselected: {},
  saveButton: {
    marginTop: 24,
  },
});
