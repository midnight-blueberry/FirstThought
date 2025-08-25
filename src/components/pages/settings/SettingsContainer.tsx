import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ComponentProps } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText, Overlay, SaveIcon } from '@components/ui/atoms';
import { fonts } from '@constants/Fonts';
import useHeaderShadow from '@hooks/useHeaderShadow';
import { ThemeContext } from '@store/ThemeContext';
import { themeList } from '@theme/buildTheme';
import useThemeSaver from '@hooks/useThemeSaver';
import useSyncThemeToLocalState from '@hooks/useSyncThemeToLocalState';
import useFontControls from '@hooks/useFontControls';
import useHeaderTitleSync from '@hooks/useHeaderTitleSync';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { getBaseFontName, calcFontSizeLevel } from '@utils/font';
import { getFontByName, hasMultipleWeights } from '@utils/fontHelpers';
import { clampLevel, resolveOverlayColor } from '@utils/theme';
import type { SectionPropsMap } from '@types';
import { sections } from '@settings/sections.config';

export interface SettingsItem {
  key: keyof SectionPropsMap;
}

export interface SettingsVm {
  sectionProps: SectionPropsMap;
  theme: DefaultTheme;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  overlayVisible: boolean;
  overlayColor: string;
  overlayAnim: Animated.Value;
  overlayBlocks: boolean;
}

interface SectionComponentProps {
  title?: string;
  children: React.ReactNode;
}

interface RowProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function useSettingsContainer(): SettingsVm {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const context = useContext(ThemeContext);
  const [selectedThemeName, setSelectedThemeName] = useState(theme.name);
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    theme.colors.accent,
  );
  const initialFontName = getBaseFontName(theme.fontName);
  const initialFontInfo = getFontByName(fonts, initialFontName);
  const initialFontSizeLevel = calcFontSizeLevel(
    theme.fontSize.small,
    initialFontInfo.defaultSize,
  );

  const {
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    selectFont,
    bumpFontWeight,
    bumpFontSize,
    blinkState,
  } = useFontControls({
    fonts,
    initial: {
      fontName: initialFontName,
      fontWeight: theme.fontWeight,
      fontSizeLevel: initialFontSizeLevel,
    },
    clampLevel,
    maxLevel: 5,
    minLevel: 1,
  });

  const [noteTextAlign, setNoteTextAlign] = useState<
    DefaultTheme['noteTextAlign']
  >(theme.noteTextAlign);
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const {
    saveAndApply,
    runWithOverlay,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
  } = useThemeSaver({
    selectedThemeName,
    selectedAccentColor,
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    noteTextAlign,
    setTheme,
  });

  const [prevFont, setPrevFont] = useState({
    name: selectedFontName,
    weight: fontWeight,
  });
  useEffect(() => {
    if (prevFont.name !== selectedFontName || prevFont.weight !== fontWeight) {
      runWithOverlay(() => {
        saveAndApply({ fontName: selectedFontName, fontWeight });
      });
      setPrevFont({ name: selectedFontName, weight: fontWeight });
    }
  }, [selectedFontName, fontWeight, runWithOverlay, saveAndApply, prevFont]);

  const [prevFontSize, setPrevFontSize] = useState(fontSizeLevel);
  useEffect(() => {
    if (prevFontSize !== fontSizeLevel) {
      runWithOverlay(() => {
        saveAndApply({ fontSizeLevel });
      });
      setPrevFontSize(fontSizeLevel);
    }
  }, [fontSizeLevel, runWithOverlay, saveAndApply, prevFontSize]);

  useHeaderTitleSync(theme, () => <SaveIcon fadeAnim={fadeAnim} />);

  useSyncThemeToLocalState(theme, {
    setSelectedThemeName,
    setSelectedAccentColor,
    setNoteTextAlign,
  });

  const handleAccentChange = useCallback(
    (next: string) => {
      runWithOverlay(() => {
        setSelectedAccentColor(next);
        saveAndApply({ accentColor: next });
      }, theme.colors.background);
    },
    [runWithOverlay, saveAndApply, theme.colors.background],
  );

  const handleThemeChange = useCallback(
    (name: string) => {
      const overlayColor = resolveOverlayColor(name, themeList);
      runWithOverlay(() => {
        setSelectedThemeName(name);
        saveAndApply({ themeName: name });
      }, overlayColor);
    },
    [runWithOverlay, saveAndApply],
  );

  const selectedFont = getFontByName(fonts, selectedFontName);
  const hasMultiple = hasMultipleWeights(selectedFont);

  const noopSelectWeight = useCallback(() => {}, []);
  const handleIncreaseFontSize = useCallback(() => bumpFontSize(1), [
    bumpFontSize,
  ]);
  const handleDecreaseFontSize = useCallback(() => bumpFontSize(-1), [
    bumpFontSize,
  ]);
  const handleIncreaseFontWeight = useCallback(() => bumpFontWeight(1), [
    bumpFontWeight,
  ]);
  const handleDecreaseFontWeight = useCallback(() => bumpFontWeight(-1), [
    bumpFontWeight,
  ]);
  const handleAlignChange = useCallback(
    (align: DefaultTheme['noteTextAlign']) => {
      runWithOverlay(() => {
        setNoteTextAlign(align);
        saveAndApply({ noteTextAlign: align });
      });
    },
    [runWithOverlay, saveAndApply],
  );

  const sectionProps: SectionPropsMap = useMemo(
    () => ({
      theme: {
        selectedThemeName,
        onSelectTheme: handleThemeChange,
      },
      accent: {
        selectedAccentColor,
        onSelectAccent: handleAccentChange,
      },
      divider: {},
      font: {
        selectedFontName,
        onSelectFont: selectFont,
        onSelectWeight: noopSelectWeight,
        fontSizeLevel,
      },
      fontSize: {
        fontSizeLevel,
        onIncrease: handleIncreaseFontSize,
        onDecrease: handleDecreaseFontSize,
        blinkIndex: blinkState.size.index,
        blinkAnim: blinkState.size.anim,
      },
      fontWeight: {
        fontWeight,
        onIncrease: handleIncreaseFontWeight,
        onDecrease: handleDecreaseFontWeight,
        blinkAnim: blinkState.weight.anim,
        disabled: !hasMultiple,
      },
      align: {
        noteTextAlign,
        onChange: handleAlignChange,
      },
      preview: {
        noteTextAlign,
        fontName: theme.fontName,
        colors: theme.colors,
      },
    }),
    [
      selectedThemeName,
      handleThemeChange,
      selectedAccentColor,
      handleAccentChange,
      selectedFontName,
      selectFont,
      noopSelectWeight,
      fontSizeLevel,
      handleIncreaseFontSize,
      handleDecreaseFontSize,
      blinkState.size.index,
      blinkState.size.anim,
      fontWeight,
      handleIncreaseFontWeight,
      handleDecreaseFontWeight,
      blinkState.weight.anim,
      hasMultiple,
      noteTextAlign,
      handleAlignChange,
      theme.fontName,
      theme.colors,
    ],
  );

  return {
    sectionProps,
    theme,
    handleScroll,
    overlayVisible,
    overlayColor,
    overlayAnim,
    overlayBlocks,
  };
}

const SettingsView = React.memo(function SettingsView({
  sectionProps,
  theme,
  handleScroll,
  overlayVisible,
  overlayColor,
  overlayAnim,
  overlayBlocks,
}: SettingsVm) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollIndicatorInsets = useMemo(
    () => ({ right: theme.padding.xlarge, bottom: theme.padding.xlarge }),
    [theme],
  );

  const renderedSections = useMemo(() => {
    return sections.map((section) => {
      const Component = section.Component as React.ComponentType<
        ComponentProps<typeof section.Component>
      >;
      return (
        <Section key={section.key}>
          <Component {...sectionProps[section.key]} />
        </Section>
      );
    });
  }, [sectionProps]);

  const noop = useCallback(() => {}, []);
  const hidden = false;

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
      >
        {renderedSections}
        {hidden && (
          <ToggleRow label="" value={false} onValueChange={noop} />
        )}
      </ScrollView>
      <Overlay
        visible={overlayVisible}
        color={overlayColor}
        blocks={overlayBlocks}
        anim={overlayAnim}
      />
    </>
  );
});

const Section = React.memo(function Section({
  title,
  children,
}: SectionComponentProps) {
  const theme = useTheme();
  const styles = useMemo(() => createSectionStyles(theme), [theme]);
  return (
    <View style={styles.section}>
      {title ? (
        <AppText variant="large" style={styles.label}>
          {title}
        </AppText>
      ) : null}
      <Row left={children} />
    </View>
  );
});

const Row = React.memo(function Row({ left, right, onPress }: RowProps) {
  const theme = useTheme();
  const styles = useMemo(() => createRowStyles(theme), [theme]);
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} style={styles.row}>
      <View style={styles.left}>{left}</View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Wrapper>
  );
});

const ToggleRow = React.memo(function ToggleRow({
  label,
  value,
  onValueChange,
}: ToggleRowProps) {
  return (
    <Row
      left={<AppText variant="medium">{label}</AppText>}
      right={<Switch value={value} onValueChange={onValueChange} />}
    />
  );
});

const createStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: theme.padding.xlarge,
      paddingBottom: theme.padding.xlarge,
    },
  });

const createSectionStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    section: {
      marginBottom: theme.margin.medium,
    },
    label: {
      marginBottom: theme.margin.medium,
    },
  });

const createRowStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.margin.small,
    },
    left: {
      flex: 1,
    },
    right: {},
  });

export default function SettingsContainer() {
  const vm = useSettingsContainer();
  return <SettingsView {...vm} />;
}

