import React from 'react';
import { ScrollView, StyleSheet, View, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import Overlay from '@/components/ui/atoms/overlay';
import { sections, SectionKey } from './_sections.config';
import { DefaultTheme } from 'styled-components/native';

interface SettingsContentProps {
  sectionProps: Record<SectionKey, Record<string, unknown>>;
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sections.map(({ key, Component }) => {
          const Comp = Component as React.ComponentType<Record<string, unknown>>;
          return <Comp key={key} {...sectionProps[key]} />;
        })}
      </ScrollView>

      <Overlay
        visible={overlayVisible}
        color={overlayColor}
        blocks={overlayBlocks}
        anim={overlayAnim}
      />
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
    },
  });
