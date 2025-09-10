import React, { useLayoutEffect, useMemo, useRef } from 'react';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { Overlay } from '@components/ui/atoms';
import { sections } from '@settings/sections.config';
import type { SectionPropsMap } from '@types';
import { DefaultTheme } from 'styled-components/native';
import useAnchorStableScroll from '@features/scroll/useAnchorStableScroll';

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
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollIndicatorInsets = useMemo(
    () => ({ right: theme.padding.xlarge, bottom: theme.padding.xlarge }),
    [theme],
  );
  const scrollRef = useRef<ScrollView>(null);
  const { setAnchor, captureBeforeUpdate, adjustAfterLayout } =
    useAnchorStableScroll();

  const wrap = React.useCallback(
    (fn?: (...args: any[]) => void) =>
      (...args: any[]) => {
        captureBeforeUpdate(scrollRef.current);
        fn?.(...args);
      },
    [captureBeforeUpdate],
  );

  const wrappedProps = useMemo<SectionPropsMap>(() => ({
    ...sectionProps,
    theme: {
      ...sectionProps.theme,
      onSelectTheme: wrap(sectionProps.theme.onSelectTheme),
    },
    accent: {
      ...sectionProps.accent,
      onSelectAccent: wrap(sectionProps.accent.onSelectAccent),
    },
    font: {
      ...sectionProps.font,
      onSelectFont: wrap(sectionProps.font.onSelectFont),
    },
    fontSize: {
      ...sectionProps.fontSize,
      onIncrease: wrap(sectionProps.fontSize.onIncrease),
      onDecrease: wrap(sectionProps.fontSize.onDecrease),
    },
    fontWeight: {
      ...sectionProps.fontWeight,
      onIncrease: wrap(sectionProps.fontWeight.onIncrease),
      onDecrease: wrap(sectionProps.fontWeight.onDecrease),
      onSelect: wrap(sectionProps.fontWeight.onSelect),
    },
    align: {
      ...sectionProps.align,
      onChange: wrap(sectionProps.align.onChange),
    },
  }), [sectionProps, wrap]);

  useLayoutEffect(() => {
    adjustAfterLayout(scrollRef.current);
  }, [adjustAfterLayout, settingsVersion]);

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
        onTouchStart={(e) => setAnchor(e.nativeEvent.target as any)}
      >
        {sections.map((section) => {
          const Component = section.Component as React.ComponentType<
            ComponentProps<typeof section.Component>
          >;
          return <Component key={section.key} {...wrappedProps[section.key]} />;
        })}
      </ScrollView>

      <Overlay
        visible={overlayVisible}
        color={overlayColor}
        blocks={overlayBlocks}
        anim={overlayAnim}
      />
    </>
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
