import AppText from '@/components/ui/atoms/app-text';
import ScreenHeader from '@/components/ui/molecules/screen-header';
import SelectableRow from '@/components/ui/molecules/selectable-row';
import FontSizeSelector from '@/components/ui/organisms/font-size-selector';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme, DefaultTheme } from 'styled-components/native';
import { themeList } from '@/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { accentColors } from '@/constants/AccentColors';
import { sizes } from '@/theme/tokens';
import { saveSettings } from '@/src/storage/settings';

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const [ fontSizeLevel, setFontSizeLevel ] = useState(3);
  const [ blinkIndex, setBlinkIndex ] = useState<number | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [ isSaved, setIsSaved ] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
      const base = sizes.fontSize.small;
      const level = Math.round((theme.fontSize.small - base) / 2) + 3;
      setFontSizeLevel(level);
    }, [theme.name, theme.colors.accent, theme.fontSize.small])
  );

  const handleSave = useCallback(() => {
    const chosenTheme = themeList.find(t => t.name === selectedThemeName);
    if (chosenTheme) {
      const updatedColors = {
        ...chosenTheme.colors,
        accent: selectedAccentColor,
      };
      if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
        updatedColors.basic = selectedAccentColor;
      }
      const delta = (fontSizeLevel - 3) * 2;
      const updatedFontSize = {
        small: chosenTheme.fontSize.small + delta,
        medium: chosenTheme.fontSize.medium + delta,
        large: chosenTheme.fontSize.large + delta,
        xlarge: chosenTheme.fontSize.xlarge + delta,
      } as DefaultTheme['fontSize'];
      setTheme({ ...chosenTheme, colors: updatedColors, fontSize: updatedFontSize });
    }
  }, [selectedThemeName, selectedAccentColor, fontSizeLevel, setTheme]);

  const saveWithFeedback = useCallback(() => {
    handleSave();
    saveSettings({ themeName: selectedThemeName, accentColor: selectedAccentColor, fontSizeLevel });
    setIsSaved(true);
    fadeAnim.stopAnimation();
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => setIsSaved(false));
    }, 3000);
  }, [handleSave, fadeAnim, selectedThemeName, selectedAccentColor, fontSizeLevel]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const triggerBlink = useCallback((index: number) => {
    blinkAnim.stopAnimation();
    setBlinkIndex(index);
    blinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      { iterations: 5 }
    ).start(() => setBlinkIndex(null));
  }, [blinkAnim]);

  const stopBlink = useCallback(() => {
    blinkAnim.stopAnimation();
    blinkAnim.setValue(1);
    setBlinkIndex(null);
  }, [blinkAnim]);

  const decreaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    setFontSizeLevel(l => {
      if (l <= 1) {
        triggerBlink(0);
        return l;
      }
      return l - 1;
    });
  };

  const increaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    setFontSizeLevel(l => {
      if (l >= 6) {
        triggerBlink(5);
        return l;
      }
      return l + 1;
    });
  };

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    saveWithFeedback();
  }, [selectedThemeName, selectedAccentColor, fontSizeLevel, saveWithFeedback]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenHeader
        title="Настройки"
        onBack={() => navigation.goBack()}
        saveOpacity={isSaved ? fadeAnim : undefined}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <AppText variant='large' style={[styles.label, styles.themeLabel]}>Тема</AppText>
        <View style={styles.themeList}>
          {themeList.map(themeItem => (
            <SelectableRow
              key={themeItem.name}
              label={themeItem.name}
              swatchColor={themeItem.colors.background}
              selectedBorderColor={themeItem.colors.accent}
              selected={themeItem.name === selectedThemeName}
              onPress={() => setSelectedThemeName(themeItem.name)}
            />
          ))}
        </View>

        <AppText variant='large' style={[styles.label, styles.accentLabel]}>Акцент</AppText>
        <View style={styles.themeList}>
          {accentColors.map(color => (
            <SelectableRow
              key={color.hex}
              label={color.name}
              swatchColor={color.hex}
              selected={color.hex === selectedAccentColor}
              onPress={() => setSelectedAccentColor(color.hex)}
            />
          ))}
        </View>

        <FontSizeSelector
          level={fontSizeLevel}
          onIncrease={increaseFontSize}
          onDecrease={decreaseFontSize}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  themeLabel: {
    marginTop: 8,
  },
  accentLabel: {
    marginTop: 4,
  },
  themeList: {
    marginBottom: 4,
  },
});
