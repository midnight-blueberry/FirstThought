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
import { fonts } from '@/constants/Fonts';
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
  const [ selectedFontName, setSelectedFontName ] = useState(theme.fontName);
  const [ fontSizeLevel, setFontSizeLevel ] = useState(3);
  const [ blinkIndex, setBlinkIndex ] = useState<number | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [ isSaved, setIsSaved ] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const accentAnim = useRef(new Animated.Value(0)).current;
  const [ overlayVisible, setOverlayVisible ] = useState(false);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
      setSelectedFontName(theme.fontName);
      const fontInfo = fonts.find(f => f.name === theme.fontName) ?? fonts[0];
      const base = fontInfo.defaultSize - 4;
      const level = Math.round((theme.fontSize.small - base) / 2) + 3;
      setFontSizeLevel(level);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme.name, theme.fontSize.small, theme.fontName])
  );

  const updateTheme = useCallback(
    (themeName: string, accentColor: string, fontName: string) => {
      const chosenTheme = themeList.find(t => t.name === themeName);
      const chosenFont = fonts.find(f => f.name === fontName) ?? fonts[0];
      if (chosenTheme) {
        const updatedColors = {
          ...chosenTheme.colors,
          accent: accentColor,
        };
        if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
          updatedColors.basic = accentColor;
        }
        const delta = (fontSizeLevel - 3) * 2;
        const medium = chosenFont.defaultSize + delta;
        const updatedFontSize = {
          small: medium - 4,
          medium,
          large: medium + 4,
          xlarge: medium + 8,
        } as DefaultTheme['fontSize'];
        setTheme({
          ...chosenTheme,
          colors: updatedColors,
          fontSize: updatedFontSize,
          fontName,
          fontWeight: chosenFont.defaultWeight,
        });
      }
    },
    [fontSizeLevel, setTheme]
  );

  const showSaveIcon = useCallback(() => {
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

  const hideSaveIcon = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    fadeAnim.stopAnimation();
    setIsSaved(false);
  }, [fadeAnim]);

  const saveWithFeedback = useCallback((withOverlay: boolean) => {
    const performSave = () => {
      updateTheme(selectedThemeName, selectedAccentColor, selectedFontName);
      saveSettings({ themeName: selectedThemeName, accentColor: selectedAccentColor, fontSizeLevel, fontName: selectedFontName });
    };

    if (withOverlay) {
      setOverlayVisible(true);
      overlayAnim.stopAnimation();
      overlayAnim.setValue(0);
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        hideSaveIcon();
        performSave();
        setTimeout(() => {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }).start(() => {
            setOverlayVisible(false);
            showSaveIcon();
          });
        }, 100);
      });
    } else {
      performSave();
      showSaveIcon();
    }
  }, [overlayAnim, selectedThemeName, selectedAccentColor, selectedFontName, fontSizeLevel, updateTheme, showSaveIcon, hideSaveIcon]);

  const saveWithFeedbackRef = useRef<(withOverlay: boolean) => void>(saveWithFeedback);
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
        updateTheme(selectedThemeName, c, selectedFontName);
      });
      Animated.timing(accentAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        accentAnim.removeListener(id);
        saveWithFeedbackRef.current(false);
      });
    },
    [accentAnim, selectedAccentColor, selectedThemeName, selectedFontName, updateTheme]
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
  const prevFontSizeRef = useRef(fontSizeLevel);
  const prevFontNameRef = useRef(selectedFontName);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevFontSizeRef.current = fontSizeLevel;
      prevFontNameRef.current = selectedFontName;
      return;
    }
    const isFontSizeChange = prevFontSizeRef.current !== fontSizeLevel;
    const isFontChange = prevFontNameRef.current !== selectedFontName;
    prevFontSizeRef.current = fontSizeLevel;
    prevFontNameRef.current = selectedFontName;
    saveWithFeedbackRef.current(isFontSizeChange || isFontChange);
  }, [selectedThemeName, fontSizeLevel, selectedFontName]);

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

        <AppText variant='large' style={[styles.label, styles.fontLabel]}>Шрифт</AppText>
        <View style={styles.themeList}>
          {fonts.map(f => (
            <SelectableRow
              key={f.name}
              label={f.name}
              selected={f.name === selectedFontName}
              onPress={() => setSelectedFontName(f.name)}
              fontFamily={f.name}
              fontWeight={f.defaultWeight}
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
      {overlayVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.background,
            opacity: overlayAnim,
          }}
        />
      )}
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
  fontLabel: {
    marginTop: 4,
  },
  themeList: {
    marginBottom: 4,
  },
});
