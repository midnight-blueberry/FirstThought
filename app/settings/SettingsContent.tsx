import React from 'react';
import { ScrollView, StyleSheet, View, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import Overlay from '@/components/ui/atoms/overlay';
import { sections } from '@/src/settings/sections.config';
import type { SectionPropsMap } from '@/src/settings/SectionPropsMap';
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sections.map(({ key, Component }) => (
          <Component key={key} {...(sectionProps[key] as any)} />
        ))}
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
