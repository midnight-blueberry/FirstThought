import type { TextStyle } from 'react-native';

export interface HeaderTypography {
  headerTitleFamily: string;
  headerTitleWeight: TextStyle['fontWeight'];
  headerTitleStyle: 'normal' | 'italic';
  headerTitleSize: number;
  headerTitleLetterSpacing: number;
  headerTitleLineHeight: number;
  headerLargeTitleSize: number;
  headerLargeTitleWeight: TextStyle['fontWeight'];
  headerLargeTitleLetterSpacing: number;
  headerLargeTitleLineHeight: number;
}

export interface AppTheme {
  typography: {
    header: HeaderTypography;
  };
}
