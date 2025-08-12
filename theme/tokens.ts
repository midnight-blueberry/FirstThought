export const sizes = {
  fontSize: {
    small: 14,
    medium: 18,
    large: 22,
    xlarge: 26,
  },
  iconSize: {
    small: 24,
    medium: 28,
    large: 32,
    xlarge: 36,
  },
  buttonSizes: {
    small: 48,
    medium: 56,
    large: 64,
    xlarge: 72,
  },
  padding: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
  },
  spacing: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
  },
  borderRadius: 8,
  borderWidth: 3,
} as const;

export type SizeTokens = typeof sizes;
