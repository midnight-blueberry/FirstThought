import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';

export const Label: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <AppText variant="small" style={{ marginBottom: theme.margin.small }}>
      {text}
    </AppText>
  );
};

export const HelperText: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <AppText variant="small" color="disabled" style={{ marginTop: theme.margin.small }}>
      {text}
    </AppText>
  );
};

export const ErrorText: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <AppText
      variant="small"
      color="accent"
      style={{ marginTop: theme.margin.small }}
      {...({ accessibilityLiveRegion: 'polite' } as any)}
    >
      {text}
    </AppText>
  );
};

export const FieldContainer: React.FC<{ children: React.ReactNode; style?: any }>
  = ({ children, style }) => <View style={style}>{children}</View>;
