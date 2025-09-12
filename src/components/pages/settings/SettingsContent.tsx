import React from 'react';
import type { ComponentProps } from 'react';
import {
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { Overlay } from '@components/ui/atoms';
import { sections } from '@settings/sections.config';
import type { SectionPropsMap } from '@types';
import { DefaultTheme } from 'styled-components/native';
import { useStickySelection } from '@/features/sticky-position';

interface SettingsContentProps {
  sectionProps: SectionPropsMap;
  theme: DefaultTheme;
  overlayVisible: boolean;
  overlayColor: string;
  overlayAnim: Animated.Value;
  overlayBlocks: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef: React.RefObject<ScrollView>;
}

function SettingsContent({
  sectionProps,
  theme,
  overlayVisible,
  overlayColor,
  overlayAnim,
  overlayBlocks,
  onScroll,
  scrollRef,
}: SettingsContentProps) {
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const { onScroll: stickyOnScroll } = useStickySelection();
  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      stickyOnScroll(e);
      onScroll(e);
    },
    [stickyOnScroll, onScroll],
  );
  const scrollIndicatorInsets = React.useMemo(
    () => ({ right: theme.padding.xlarge, bottom: theme.padding.xlarge }),
    [theme],
  );

  return (
    <>
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

const propsAreEqual = (prev: SettingsContentProps, next: SettingsContentProps) =>
  prev.sectionProps === next.sectionProps &&
  prev.theme === next.theme &&
  prev.overlayVisible === next.overlayVisible &&
  prev.overlayColor === next.overlayColor &&
  prev.overlayAnim === next.overlayAnim &&
  prev.overlayBlocks === next.overlayBlocks &&
  prev.onScroll === next.onScroll &&
  prev.scrollRef === next.scrollRef;

export default React.memo(SettingsContent, propsAreEqual);

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
