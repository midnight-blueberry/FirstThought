import 'styled-components/native';
import { TextStyle } from 'react-native';
import type { ColorTokens, SizeTokens } from '@constants/theme';
import type { AppTheme } from '@theme/types';

declare module 'styled-components/native' {
  export interface DefaultTheme extends SizeTokens {
    name: string;
    colors: ColorTokens;
    fontName: string;
    fontWeight: TextStyle['fontWeight'];
    noteTextAlign: 'left' | 'justify';
    barStyle: 'light-content' | 'dark-content';
    isDark: boolean;
    headerShadowVisible: boolean;
    typography: AppTheme['typography'];
  }
}
