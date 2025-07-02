export interface DefaultTheme {
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  fontSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

export const defaultTheme: DefaultTheme = {
  colors: {
    primary: "#4a90e2",
    background: "#ffffff",
    text: "#333333",
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
};