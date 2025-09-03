import React from 'react';
import type { HeaderTitleProps } from '@react-navigation/elements';
import AppText from '@/components/ui/atoms/AppText';
import useTheme from '@hooks/useTheme';

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children, tintColor }) => {
  const theme = useTheme();
  return (
    <AppText
      numberOfLines={1}
      style={{
        fontSize: theme.typography.header.headerTitleSize,
        color: tintColor ?? theme.colors.headerForeground,
      }}
    >
      {children}
    </AppText>
  );
};

export default HeaderTitle;
export { HeaderTitle };
