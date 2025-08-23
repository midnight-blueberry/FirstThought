import React from 'react';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { Overlay } from '@components/ui/atoms';
import { sections } from '@settings/sections.config';
import type { SectionPropsMap } from '@types';
import { DefaultTheme } from 'styled-components/native';

interface SettingsContentProps {
  sectionProps: SectionPropsMap;
  theme: DefaultTheme;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  overlayVisible: boolean;
  overlayColor: string;
  overlayAnim: Animated.Value;
  overlayBlocks: boolean;
}

export default function SettingsContent({
  sectionProps,
  theme,
  handleScroll,
  overlayVisible,
  overlayColor,
  overlayAnim,
  overlayBlocks,
}: SettingsContentProps) {
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const scrollIndicatorInsets = React.useMemo(
    () => ({ right: theme.padding.xlarge, bottom: theme.padding.xlarge }),
    [theme],
  );

  return (
    <>
      <ScrollView
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
          return <Component key={section.key} {...sectionProps[section.key]} />;
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
