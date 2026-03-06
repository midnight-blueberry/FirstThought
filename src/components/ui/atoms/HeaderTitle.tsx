import React from 'react';
import type { HeaderTitleProps } from '@react-navigation/elements';
import AppText from '@/components/ui/atoms/AppText';
import useTheme from '@hooks/useTheme';

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children, tintColor }) => {
  const theme = useTheme();
  const shift = -theme.padding.small / 2 + 2;

  return (
    <AppText
      numberOfLines={1}
      style={{
        fontSize: theme.typography.header.headerTitleSize,
        color: tintColor ?? theme.colors.headerForeground,
        includeFontPadding: false,
        transform: [{ translateY: shift }],
      }}
    >
      {children}
    </AppText>
  );
};

export default HeaderTitle;
export { HeaderTitle };

