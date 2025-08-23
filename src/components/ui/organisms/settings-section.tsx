import { AppText } from '@components/ui/atoms';
import { ThemeContext } from '@theme/ThemeContext';
import React, { ReactNode, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export default function Section({ title, children }: SectionProps) {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemeContext is missing');

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
      marginBottom: theme.margin.medium,
    },
    section: {
      marginBottom: theme.margin.medium,
    }
  });
