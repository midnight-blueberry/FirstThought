import { DefaultTheme } from 'styled-components/native';

export default function useHeaderConfig(theme: DefaultTheme, topInset: number) {
  const headerHeight = topInset + theme.iconSize.medium + theme.padding.large * 2;

  return {
    height: headerHeight,
    backgroundColor: theme.colors.headerBackground,
    borderBottomColor: theme.colors.basic,
    borderBottomWidth: theme.borderWidth.small,
    elevation: 0,
    shadowOpacity: 0,
  };
}

