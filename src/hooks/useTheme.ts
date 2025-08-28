import { useContext } from 'react';
import { useTheme as useStyledTheme, type DefaultTheme } from 'styled-components/native';
import { ThemeContext, type ThemeContextType } from '@store/ThemeContext';

type Combined = DefaultTheme & ThemeContextType;

export default function useTheme(): Combined {
  const theme = useStyledTheme();
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeContext is missing');
  }
  return { ...theme, ...context } as Combined;
}
