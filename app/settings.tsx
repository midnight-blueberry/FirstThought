import AppText from '@/components/ui/atoms/app-text';
import BarIndicator from '@/components/ui/atoms/bar-indicator';
import IconButton from '@/components/ui/atoms/icon-button';
import SelectorRow from '@/components/ui/atoms/selector-row';
import SelectableRow from '@/components/ui/molecules/selectable-row';
import Section from '@/components/ui/organisms/settings-section';
import { accentColors } from '@/constants/AccentColors';
import { fonts, getFontFamily } from '@/constants/Fonts';
import useHeaderShadow from '@/hooks/useHeaderShadow';
import { saveSettings } from '@/src/storage/settings';
import { buildTheme } from '@/src/theme/buildTheme';
import { ThemeContext } from '@/src/theme/ThemeContext';
import { themeList } from '@/theme';
import { sizes } from '@/theme/tokens';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';

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
  const navigation = useNavigation();
  const handleScroll = useHeaderShadow();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const initialFontName = theme.fontName.replace(/_\d+$/, '').replace(/_/g, ' ');
  const [ selectedFontName, setSelectedFontName ] = useState(initialFontName);
  const [ fontWeight, setFontWeight ] = useState<DefaultTheme['fontWeight']>(theme.fontWeight);
  const [ fontSizeLevel, setFontSizeLevel ] = useState(3);
  const [ fontSizeBlinkIndex, setFontSizeBlinkIndex ] = useState<number | null>(null);
  const fontSizeBlinkAnim = useRef(new Animated.Value(1)).current;
  const [ fontWeightBlinkIndex, setFontWeightBlinkIndex ] = useState<number | null>(null);
  const fontWeightBlinkAnim = useRef(new Animated.Value(1)).current;
  const [, setIsSaved ] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const accentAnim = useRef(new Animated.Value(0)).current;
  const [ overlayVisible, setOverlayVisible ] = useState(false);
  const [ overlayColor, setOverlayColor ] = useState(theme.colors.background);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.basic,
      headerTitleStyle: {
        color: theme.colors.basic,
        fontFamily: theme.fontName,
        fontWeight: theme.fontWeight, // ← берём из темы
      },
      headerRight: () => (
        <Animated.View pointerEvents="none" style={{ opacity: fadeAnim }}>
          <IconButton icon="save-outline" />
        </Animated.View>
      ),
    });
  }, [navigation, fadeAnim, theme]);

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
      const baseName = theme.fontName.replace(/_\d+$/, '').replace(/_/g, ' ');
      setSelectedFontName(baseName);
      setFontWeight(theme.fontWeight);
      const fontInfo = fonts.find(f => f.name === baseName) ?? fonts[0];
      const base = fontInfo.defaultSize - 4;
      const level = Math.round((theme.fontSize.small - base) / 2) + 3;
      setFontSizeLevel(level);
    }, [theme.name, theme.fontSize.small, theme.fontName, theme.fontWeight])
  );

 const saveAndApply = useCallback((patch: {
  themeName?: string;
  accentColor?: string;
  fontName?: string;
  fontWeight?: DefaultTheme['fontWeight'];
  fontSizeLevel?: number;
  iconSize?: DefaultTheme['iconSize'];
}) => {
  const nextSaved = {
    themeName:        patch.themeName        ?? selectedThemeName,
    accentColor:      patch.accentColor      ?? selectedAccentColor,
    fontName:         patch.fontName         ?? selectedFontName,
    fontWeight:       patch.fontWeight       ?? fontWeight,
    fontSizeLevel:    patch.fontSizeLevel    ?? fontSizeLevel,
    iconSize:         patch.iconSize         ?? ((): DefaultTheme['iconSize'] => {
      const level = patch.fontSizeLevel ?? fontSizeLevel;
      const iconDelta = (level - 3) * 4;
      return {
        xsmall: sizes.iconSize.xsmall + iconDelta,
        small:  sizes.iconSize.small  + iconDelta,
        medium: sizes.iconSize.medium + iconDelta,
        large:  sizes.iconSize.large  + iconDelta,
        xlarge: sizes.iconSize.xlarge + iconDelta,
      };
    })(),
  };

  // применяем немедленно
  setTheme(buildTheme(nextSaved));
  // и сохраняем на диск
  void saveSettings(nextSaved);
}, [selectedThemeName, selectedAccentColor, selectedFontName, fontWeight, fontSizeLevel, setTheme]);

  // вместо ручной сборки темы
    const updateTheme = useCallback(
      (
        themeName: string,
        accentColor: string,
        fontName: string,
        weight: DefaultTheme['fontWeight'],
        level: number,
      ) => {
      const nextSaved = {
        themeName,
        accentColor,
        fontName,
          fontWeight: weight,
        fontSizeLevel: level,
        // если хочешь — продолжай сохранять иконки явно (или доверь это buildTheme'у,
        // он сам считает iconSize от level, если этого поля нет)
        iconSize: (() => {
          const iconDelta = (level - 3) * 4;
          return {
            xsmall: sizes.iconSize.xsmall + iconDelta,
            small:  sizes.iconSize.small  + iconDelta,
            medium: sizes.iconSize.medium + iconDelta,
            large:  sizes.iconSize.large  + iconDelta,
            xlarge: sizes.iconSize.xlarge + iconDelta,
          };
        })(),
      };
      setTheme(buildTheme(nextSaved));
    },
    [setTheme]
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
    fadeAnim.setValue(0);
    setIsSaved(false);
  }, [fadeAnim]);

  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runWithOverlay = useCallback(
    (action: () => void, color?: string) => {
      setOverlayColor(color ?? theme.colors.background);
      overlayAnim.stopAnimation();
      fadeAnim.stopAnimation();
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
        overlayTimerRef.current = null;
      }

      const startFadeOut = () => {
        hideSaveIcon();
        overlayTimerRef.current = setTimeout(() => {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }).start(() => {
            setOverlayVisible(false);
            overlayTimerRef.current = null;
            showSaveIcon();
          });
        }, 100);
      };

      if (!overlayVisible) {
        setOverlayVisible(true);
        overlayAnim.setValue(0);
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start(() => {
          action();
          startFadeOut();
        });
      } else {
        overlayAnim.setValue(1);
        action();
        startFadeOut();
      }
    },
    [overlayAnim, fadeAnim, hideSaveIcon, overlayVisible, showSaveIcon, theme.colors.background]
  );

  const saveWithFeedback = useCallback((withOverlay: boolean, color?: string) => {
    const performSave = () => {
      saveAndApply({});
    };

    if (withOverlay) {
      runWithOverlay(performSave, color);
    } else {
      performSave();
      showSaveIcon();
    }
  }, [runWithOverlay, selectedThemeName, selectedAccentColor, selectedFontName, fontSizeLevel, fontWeight, updateTheme, showSaveIcon]);

  const saveWithFeedbackRef = useRef<(withOverlay: boolean, color?: string) => void>(saveWithFeedback);
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
          updateTheme(selectedThemeName, c, selectedFontName, fontWeight, fontSizeLevel);
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
    [accentAnim, selectedAccentColor, selectedThemeName, selectedFontName, fontWeight, fontSizeLevel, updateTheme]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
    };
  }, []);

  const triggerBlink = useCallback((index: number) => {
    fontSizeBlinkAnim.stopAnimation();
    setFontSizeBlinkIndex(index);
    fontSizeBlinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(fontSizeBlinkAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fontSizeBlinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      { iterations: 5 }
    ).start(() => setFontSizeBlinkIndex(null));
  }, [fontSizeBlinkAnim]);

  const stopBlink = useCallback(() => {
    fontSizeBlinkAnim.stopAnimation();
    fontSizeBlinkAnim.setValue(1);
    setFontSizeBlinkIndex(null);
  }, [fontSizeBlinkAnim]);

  const applyFontSizeLevel = (level: number) => {
    runWithOverlay(() => {
      setFontSizeLevel(level);
      saveAndApply({ fontSizeLevel: level });
    });
  };

  const decreaseFontSize = () => {
    if (fontSizeBlinkIndex !== null) stopBlink();
    if (fontSizeLevel <= 1) {
      triggerBlink(0);
      return;
    }
    applyFontSizeLevel(fontSizeLevel - 1);
  };

  const increaseFontSize = () => {
    if (fontSizeBlinkIndex !== null) stopBlink();
    if (fontSizeLevel >= 6) {
      triggerBlink(5);
      return;
    }
    applyFontSizeLevel(fontSizeLevel + 1);
  };

  const triggerWeightBlink = useCallback((index: number) => {
    fontWeightBlinkAnim.stopAnimation();
    setFontWeightBlinkIndex(index);
    fontWeightBlinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(fontWeightBlinkAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fontWeightBlinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      { iterations: 5 }
    ).start(() => setFontWeightBlinkIndex(null));
  }, [fontWeightBlinkAnim]);

  const stopWeightBlink = useCallback(() => {
    fontWeightBlinkAnim.stopAnimation();
    fontWeightBlinkAnim.setValue(1);
    setFontWeightBlinkIndex(null);
  }, [fontWeightBlinkAnim]);

  const decreaseFontWeight = () => {
    const font = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
      const idx = font.weights.indexOf(fontWeight as string);
    if (fontWeightBlinkIndex !== null) stopWeightBlink();
    if (idx > 0) {
        setFontWeight(font.weights[idx - 1] as DefaultTheme['fontWeight']);
    } else {
      triggerWeightBlink(0);
    }
  };

  const increaseFontWeight = () => {
    const font = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
      const idx = font.weights.indexOf(fontWeight as string);
    if (fontWeightBlinkIndex !== null) stopWeightBlink();
    if (idx < font.weights.length - 1) {
        setFontWeight(font.weights[idx + 1] as DefaultTheme['fontWeight']);
    } else {
      triggerWeightBlink(font.weights.length - 1);
    }
  };

  const isInitialRender = useRef(true);
  const prevFontNameRef = useRef(selectedFontName);
  const prevFontWeightRef = useRef(fontWeight);
  const prevThemeNameRef = useRef(selectedThemeName);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevFontNameRef.current = selectedFontName;
      prevFontWeightRef.current = fontWeight;
      prevThemeNameRef.current = selectedThemeName;
      return;
    }
    const isFontChange = prevFontNameRef.current !== selectedFontName;
    const isWeightChange = prevFontWeightRef.current !== fontWeight;
    const isThemeChange = prevThemeNameRef.current !== selectedThemeName;
    prevFontNameRef.current = selectedFontName;
    prevFontWeightRef.current = fontWeight;
    prevThemeNameRef.current = selectedThemeName;
    const newOverlayColor = isThemeChange
      ? themeList.find(t => t.name === selectedThemeName)?.colors.background
      : undefined;
    saveWithFeedbackRef.current(isFontChange || isWeightChange || isThemeChange, newOverlayColor);
  }, [selectedThemeName, selectedFontName, fontWeight]);

  const selectedFont = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
  const hasMultiple = selectedFont.weights.length > 1;
  const columns = hasMultiple ? selectedFont.weights.length : 5;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Section title="Тема">
          <View>
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
        </Section>
        
        <Section title="Акцент">
          <View>
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
        </Section>
        
        <Section title="Шрифт">
          <View>
            {fonts.map(f => {
              const delta = (fontSizeLevel - 3) * 2;
              const medium = f.defaultSize + delta;
              return (
                <SelectableRow
                  key={f.name}
                  label={f.name}
                  swatchColor={theme.colors.basic}
                  selected={f.name === selectedFontName}
                    onPress={() => {
                      setSelectedFontName(f.name);
                      setFontWeight(f.defaultWeight as DefaultTheme['fontWeight']);
                    }}
                  fontFamily={getFontFamily(f.family, f.defaultWeight)}
                  fontWeight='normal'
                  fontSize={medium}
                />
              );
            })}
          </View>
        </Section>
        
        <Section title="Размер шрифта">
          <SelectorRow onIncrease={increaseFontSize} onDecrease={decreaseFontSize}>
            <BarIndicator
              total={6}
              filledCount={fontSizeLevel}
              blinkIndex={fontSizeBlinkIndex}
              blinkAnim={fontSizeBlinkAnim}
              containerColor={theme.colors.basic}
              fillColor={theme.colors.accent}
            />
          </SelectorRow>
        </Section>
        
        <Section title="Жирность шрифта">
          <SelectorRow
            onIncrease={hasMultiple ? increaseFontWeight : undefined}
            onDecrease={hasMultiple ? decreaseFontWeight : undefined}
            increaseColor={hasMultiple ? 'basic' : 'disabled'}
            decreaseColor={hasMultiple ? 'basic' : 'disabled'}
            opacity={hasMultiple ? 1 : 0.5}
          >
              <BarIndicator
                total={columns}
                filledCount={
                  hasMultiple ? selectedFont.weights.indexOf(fontWeight as string) + 1 : 0
                }
                blinkIndex={fontWeightBlinkIndex}
                blinkAnim={fontWeightBlinkAnim}
                containerColor={theme.colors[hasMultiple ? 'basic' : 'disabled']}
                fillColor={theme.colors[hasMultiple ? 'accent' : 'disabled']}
              />
          </SelectorRow>
          {!hasMultiple && (
            <AppText variant='small' color='disabled' style={{ textAlign: 'center' }}>
              Недоступно для данного шрифта
            </AppText>
          )}
        </Section>
        
        <Section>
          <View
            style={{
              marginTop: theme.margin.large,
              borderColor: theme.colors.accent,
              borderWidth: theme.borderWidth.medium,
              borderRadius: theme.borderRadius,
              padding: theme.padding.medium,
              alignSelf: 'stretch',
            }}
          >
              <AppText
                color='basic'
                fontFamily={getFontFamily(selectedFont.family, fontWeight as string)}
              >
              Так будет выглядеть ваша заметка в выбранном формате
            </AppText>
          </View>
        </Section>
      </ScrollView>

      {overlayVisible && (
        <Modal transparent statusBarTranslucent animationType="none">
          <StatusBar translucent backgroundColor="transparent" />
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: overlayColor,
                opacity: overlayAnim,
              },
            ]}
          />
        </Modal>
      )}
    </View>
  );
}

const createStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: theme.padding.xlarge,
      paddingBottom: theme.padding.xlarge,
    },
    label: {
      marginBottom: theme.margin.medium,
    },
    section: {
      marginBottom: theme.margin.medium,
    }
  });
