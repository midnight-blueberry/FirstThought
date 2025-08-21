import 'react-native-gesture-handler';
import 'react-native-reanimated';
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
import { Portal } from '@gorhom/portal';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';
import { InteractionManager } from 'react-native';

const TextAlignIcon = ({
  variant,
  color,
}: {
  variant: 'left' | 'justify';
  color: string;
}) => (
  <View style={{ width: 24, height: 24, justifyContent: 'space-between' }}>
    {[0, 1, 2].map(i => (
      <View
        key={i}
        style={{
          height: 2,
          width: variant === 'left' ? [16, 20, 12][i] : 24,
          backgroundColor: color,
          alignSelf: 'flex-start',
        }}
      />
    ))}
  </View>
);

const TextAlignButton = ({
  variant,
  onPress,
  selected,
}: {
  variant: 'left' | 'justify';
  onPress?: () => void;
  selected?: boolean;
}) => {
  const theme = useTheme();
  const color = selected ? theme.colors.accent : theme.colors.basic;
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8}>
      <TextAlignIcon variant={variant} color={color} />
    </TouchableOpacity>
  );
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
  const [ noteTextAlign, setNoteTextAlign ] = useState<DefaultTheme['noteTextAlign']>(theme.noteTextAlign);
  const [, setIsSaved ] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [ overlayVisible, setOverlayVisible ] = useState(false);
  const [ overlayColor, setOverlayColor ] = useState(theme.colors.background);
  const [overlayBlocks, setOverlayBlocks] = useState(false);
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
        fontSize: theme.fontSize.large,
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
      setFontSizeLevel(Math.min(Math.max(level, 1), 5));
      setNoteTextAlign(theme.noteTextAlign);
    }, [theme.name, theme.fontSize.small, theme.fontName, theme.fontWeight, theme.noteTextAlign])
  );

 const saveAndApply = useCallback((patch: {
  themeName?: string;
  accentColor?: string;
  fontName?: string;
  fontWeight?: DefaultTheme['fontWeight'];
  fontSizeLevel?: number;
  iconSize?: DefaultTheme['iconSize'];
  noteTextAlign?: DefaultTheme['noteTextAlign'];
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
    noteTextAlign:    patch.noteTextAlign    ?? noteTextAlign,
  };

  // применяем немедленно
  InteractionManager.runAfterInteractions(() => {
    setTheme(buildTheme(nextSaved));
  });
  // и сохраняем на диск
  void saveSettings(nextSaved);
}, [selectedThemeName, selectedAccentColor, selectedFontName, fontWeight, fontSizeLevel, noteTextAlign, setTheme]);

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
        noteTextAlign,
      };
      setTheme(buildTheme(nextSaved));
    },
    [setTheme, noteTextAlign]
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
      // 0) Подготовка состояния/таймеров
      setOverlayColor(color ?? theme.colors.background);

      if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); saveTimerRef.current = null; }
      if (overlayTimerRef.current) { clearTimeout(overlayTimerRef.current); overlayTimerRef.current = null; }

      overlayAnim.stopAnimation();
      fadeAnim.stopAnimation();

      // 1) Всегда показываем overlay и начинаем с 0
      setOverlayVisible(true);
      setOverlayBlocks(true);
      overlayAnim.setValue(0);

      const startFadeOut = () => {
        // 3) Сразу после применения темы разрешаем тапы
        setOverlayBlocks(false);

        // Дадим 100мс, чтобы глаз «принял» новое состояние
        overlayTimerRef.current = setTimeout(() => {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }).start(() => {
            setOverlayVisible(false);
            overlayTimerRef.current = null;
            showSaveIcon(); // показать иконку сохранения
          });
        }, 100);
      };

      // На время затемнения прячем/сбрасываем иконку «сохранено»
      hideSaveIcon();

      // 2) Плавный fade-in → применяем изменения → fade-out
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        action();       // применяем setTheme(buildTheme(...)) внутри твоего action
        startFadeOut(); // и уходим в fade-out
      });
    },
    [overlayAnim, fadeAnim, theme.colors.background, hideSaveIcon, showSaveIcon]
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
  }, [runWithOverlay, selectedThemeName, selectedAccentColor, selectedFontName, fontSizeLevel, fontWeight, noteTextAlign, updateTheme, showSaveIcon]);

  const saveWithFeedbackRef = useRef<(withOverlay: boolean, color?: string) => void>(saveWithFeedback);
  useEffect(() => {
    saveWithFeedbackRef.current = saveWithFeedback;
  }, [saveWithFeedback]);

  const handleAccentChange = useCallback((next: string) => {
    setSelectedAccentColor(next);
    // затемнение + один вызов setTheme внутри saveAndApply
    runWithOverlay(() => {
      saveAndApply({ accentColor: next }); // setTheme(buildTheme(...)) вызовется один раз
    }, /* overlay color*/ theme.colors.background);
  }, [runWithOverlay, saveAndApply, selectedAccentColor, theme.colors.background]);

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
    if (fontSizeLevel >= 5) {
      triggerBlink(4);
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

          <View
            style={{
              height: theme.borderWidth.small,
              backgroundColor: theme.colors.basic,
              alignSelf: 'stretch',
              marginBottom: theme.margin.medium,
              borderRadius: theme.borderWidth.medium / 2,
            }}
          />

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
              total={5}
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

        <Section title="Выравнивание текста в заметках">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              alignSelf: 'stretch',
              paddingTop: theme.padding.large,
            }}
          >
            <TextAlignButton
              variant="left"
              selected={noteTextAlign === 'left'}
              onPress={() => {
                setNoteTextAlign('left');
                saveAndApply({ noteTextAlign: 'left' });
                showSaveIcon();
              }}
            />
            <TextAlignButton
              variant="justify"
              selected={noteTextAlign === 'justify'}
              onPress={() => {
                setNoteTextAlign('justify');
                saveAndApply({ noteTextAlign: 'justify' });
                showSaveIcon();
              }}
            />
          </View>
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
                fontFamily={theme.fontName}
              >
              Так будет выглядеть ваша заметка в выбранном формате
            </AppText>
          </View>
        </Section>
      </ScrollView>

      {overlayVisible && (
        <Portal>
          <Animated.View
            pointerEvents={overlayBlocks ? 'auto' : 'none'}
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: overlayAnim, backgroundColor: overlayColor },
            ]}
          />
        </Portal>
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
