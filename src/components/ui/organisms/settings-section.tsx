import { AppText } from '@components/ui/atoms';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export default function Section({ title, children }: SectionProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.section}>
      {title && (
        <AppText variant="large" style={styles.label}>
          {title}
        </AppText>
      )}
      {children}
    </View>
  );
}

const createStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    label: {
      marginTop: theme.padding.xlarge,
      marginBottom: theme.margin.medium,
      includeFontPadding: false,
    },
    section: {
      marginBottom: theme.margin.medium,
    }
  });
