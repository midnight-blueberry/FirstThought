// src/types/styled.d.ts
import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    name: string,
    color: {
        primary: string,
        primaryText: string,
        secondary: string,
        secondaryText: string,
        background: string,
        text: string,
        disabled: string,
        disabledText: string,
    };
    fontSize: {
        small: number
        medium: number
        large: number
        xlarge: number
    },
    iconSize: {
        small: number
        medium: number
        large: number
        xlarge: number
    },
    buttonSize: {
        small: number
        medium: number
        large: number
        xlarge: number
    },
    padding: {
        small: number
        medium: number
        large: number
        xlarge: number
    },
    spacing: {
        small: number
        medium: number
        large: number
        xlarge: number
    },
    borderRadius: number
  }
}
