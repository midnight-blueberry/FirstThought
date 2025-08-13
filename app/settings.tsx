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

const interpolateColor = (from: string, to: string, t: number) => {
  const f = parseInt(from.slice(1), 16);
  const tVal = parseInt(to.slice(1), 16);

  const r1 = (f >> 16) & 0xff;
  const g1 = (f >> 8) & 0xff;
  const b1 = f & 0xff;

  const r2 = (tVal >> 16) & 0xff;
  const g2 = (tVal >> 8) & 0xff;
  const b2 = tVal & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

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
  const accentAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme.name, theme.fontSize.small])
  );

  const updateTheme = useCallback(
    (themeName: string, accentColor: string, level: number = fontSizeLevel) => {
      const chosenTheme = themeList.find(t => t.name === themeName);
      if (chosenTheme) {
        const updatedColors = {
          ...chosenTheme.colors,
          accent: accentColor,
        };
        if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
          updatedColors.basic = accentColor;
        }
        const delta = (level - 3) * 2;
        const updatedFontSize = {
          small: chosenTheme.fontSize.small + delta,
          medium: chosenTheme.fontSize.medium + delta,
          large: chosenTheme.fontSize.large + delta,
          xlarge: chosenTheme.fontSize.xlarge + delta,
        } as DefaultTheme['fontSize'];
        setTheme({ ...chosenTheme, colors: updatedColors, fontSize: updatedFontSize });
      }
    },
    [fontSizeLevel, setTheme]
  );

  const showSaveIndicator = useCallback(() => {
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
  }, [fadeAnim]);

  const saveWithFeedback = useCallback(() => {
    updateTheme(selectedThemeName, selectedAccentColor);
    saveSettings({ themeName: selectedThemeName, accentColor: selectedAccentColor, fontSizeLevel });
    showSaveIndicator();
  }, [selectedThemeName, selectedAccentColor, fontSizeLevel, updateTheme, showSaveIndicator]);

  const saveWithFeedbackRef = useRef(saveWithFeedback);
  useEffect(() => {
    saveWithFeedbackRef.current = saveWithFeedback;
  }, [saveWithFeedback]);

  const handleAccentChange = useCallback(
    (color: string) => {
      const from = selectedAccentColor;
      setSelectedAccentColor(color);
      accentAnim.stopAnimation();
      accentAnim.setValue(0);
      const id = accentAnim.addListener(({ value }) => {
        const c = interpolateColor(from, color, value);
        updateTheme(selectedThemeName, c);
      });
      Animated.timing(accentAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        accentAnim.removeListener(id);
        saveWithFeedbackRef.current();
      });
    },
    [accentAnim, selectedAccentColor, selectedThemeName, updateTheme]
  );

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
  const changeFontSize = useCallback(
    (newLevel: number) => {
      contentOpacity.stopAnimation();
      Animated.timing(contentOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setFontSizeLevel(newLevel);
        updateTheme(selectedThemeName, selectedAccentColor, newLevel);
        saveSettings({ themeName: selectedThemeName, accentColor: selectedAccentColor, fontSizeLevel: newLevel });
        Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start(() => {
          showSaveIndicator();
        });
      });
    },
    [contentOpacity, selectedThemeName, selectedAccentColor, updateTheme, showSaveIndicator]
  );

  const decreaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    if (fontSizeLevel <= 1) {
      triggerBlink(0);
      return;
    }
    changeFontSize(fontSizeLevel - 1);
  };

  const increaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    if (fontSizeLevel >= 6) {
      triggerBlink(5);
      return;
    }
    changeFontSize(fontSizeLevel + 1);
  };

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    saveWithFeedbackRef.current();
  }, [selectedThemeName]);

  return (
    <Animated.View style={{ flex: 1, backgroundColor: theme.colors.background, opacity: contentOpacity }}>
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
              onPress={() => handleAccentChange(color.hex)}
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
    </Animated.View>
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
