import React, { useLayoutEffect, useMemo, useRef } from 'react';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { Overlay } from '@components/ui/atoms';
import { sections } from '@settings/sections.config';
import type { SectionPropsMap } from '@types';
import { DefaultTheme } from 'styled-components/native';
import useAnchorStableScroll, { AnchorContext } from '@/features/scroll/useAnchorStableScroll';

interface SettingsContentProps {
  sectionProps: SectionPropsMap;
  theme: DefaultTheme;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  overlayVisible: boolean;
  overlayColor: string;
  overlayAnim: Animated.Value;
  overlayBlocks: boolean;
  settingsVersion: number;
}

export default function SettingsContent({
  sectionProps,
  theme,
  handleScroll,
  overlayVisible,
  overlayColor,
  overlayAnim,
  overlayBlocks,
  settingsVersion,
}: SettingsContentProps) {
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const scrollIndicatorInsets = React.useMemo(
    () => ({ right: theme.padding.xlarge, bottom: theme.padding.xlarge }),
    [theme],
  );
  const scrollRef = useRef<ScrollView | null>(null);
  const { setAnchor, captureBeforeUpdate, adjustAfterLayout } = useAnchorStableScroll();

  const wrappedProps = useMemo(() => {
    const capture = () => captureBeforeUpdate(scrollRef.current);
    return {
      ...sectionProps,
      theme: {
        ...sectionProps.theme,
        onSelectTheme: (n: string) => {
          capture();
          sectionProps.theme.onSelectTheme(n);
        },
      },
      accent: {
        ...sectionProps.accent,
        onSelectAccent: (c: string) => {
          capture();
          sectionProps.accent.onSelectAccent(c);
        },
      },
      font: {
        ...sectionProps.font,
        onSelectFont: (n: string) => {
          capture();
          sectionProps.font.onSelectFont(n);
        },
      },
      fontSize: {
        ...sectionProps.fontSize,
        onIncrease: () => {
          capture();
          sectionProps.fontSize.onIncrease();
        },
        onDecrease: () => {
          capture();
          sectionProps.fontSize.onDecrease();
        },
      },
      fontWeight: {
        ...sectionProps.fontWeight,
        onIncrease: () => {
          capture();
          sectionProps.fontWeight.onIncrease();
        },
        onDecrease: () => {
          capture();
          sectionProps.fontWeight.onDecrease();
        },
        onSelect: (w: DefaultTheme['fontWeight']) => {
          capture();
          sectionProps.fontWeight.onSelect(w);
        },
      },
      align: {
        ...sectionProps.align,
        onChange: (a: DefaultTheme['noteTextAlign']) => {
          capture();
          sectionProps.align.onChange(a);
        },
      },
    } as SectionPropsMap;
  }, [sectionProps, captureBeforeUpdate]);

  useLayoutEffect(() => {
    adjustAfterLayout(scrollRef.current);
  }, [settingsVersion, adjustAfterLayout]);

  return (
    <AnchorContext.Provider value={setAnchor}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
      >
        {sections.map((section) => {
          const Component = section.Component as React.ComponentType<
            ComponentProps<typeof section.Component>
          >;
          return <Component key={section.key} {...(wrappedProps as any)[section.key]} />;
        })}
      </ScrollView>

      <Overlay
        visible={overlayVisible}
        color={overlayColor}
        blocks={overlayBlocks}
        anim={overlayAnim}
      />
    </AnchorContext.Provider>
  );
}

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
    label: {
      marginBottom: theme.margin.medium,
    },
    section: {
      marginBottom: theme.margin.medium,
    },
  });
