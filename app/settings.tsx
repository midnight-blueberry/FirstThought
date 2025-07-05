import AppText from '@/components/ui/atoms/app-text';
import React, { useContext, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ColorsContext, SizesContext, themes } from '../theme';

export default function Settings() {
  const { sizes, setSizes } = useContext(SizesContext);
  const { colors, setColors } = useContext(ColorsContext);
  const [selectedThemeName, setSelectedThemeName] = useState(colors.name);

  const handleSave = () => {
    const chosenTheme = themes.find(t => t.name === selectedThemeName);
    if (chosenTheme) {
      setColors(chosenTheme);
    }
  };

  const increaseFont = () => {
    setSizes({
      ...sizes,
      fontSizes: {
        small: sizes.fontSizes.small + 2,
        medium: sizes.fontSizes.medium + 2,
        large: sizes.fontSizes.large + 2,
        xlarge: sizes.fontSizes.xlarge + 2,
      },
    });
  };

  const decreaseFont = () => {
    setSizes({
      ...sizes,
      fontSizes: {
        small: sizes.fontSizes.small - 2,
        medium: sizes.fontSizes.medium - 2,
        large: sizes.fontSizes.large - 2,
        xlarge: sizes.fontSizes.xlarge - 2,
      },
    });
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.saveButton}>
        <Button title='Сохранить' onPress={handleSave} />
      </View>
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
