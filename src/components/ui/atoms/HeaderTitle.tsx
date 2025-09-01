import React from 'react';
import { Text } from 'react-native';
import type { HeaderTitleProps } from '@react-navigation/elements';
import { resolveFont } from '@/constants/fonts/resolve';
import { useSettings } from '@/state/SettingsContext';
import useTheme from '@hooks/useTheme';

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children, tintColor }) => {
  const { settings } = useSettings();
  const theme = useTheme();
  const { key } = resolveFont(settings.fontFamily, parseInt(String(settings.fontWeight), 10));
  return (
    <Text
      numberOfLines={1}
      style={{
        fontFamily: key,
        fontSize: theme.typography.header.headerTitleSize,
        color: tintColor ?? theme.colors.headerForeground,
      }}
    >
      {children}
    </Text>
  );
};

export default HeaderTitle;
export { HeaderTitle };
