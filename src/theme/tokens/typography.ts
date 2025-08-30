export const headerTypography = {
  headerTitleFamily: '',
  headerTitleWeight: '500',
  headerTitleStyle: 'normal' as const,
  headerTitleSize: 18,
  headerTitleLetterSpacing: 0,
  headerTitleLineHeight: 24,
  headerLargeTitleSize: 32,
  headerLargeTitleWeight: '700',
  headerLargeTitleLetterSpacing: 0,
  headerLargeTitleLineHeight: 38,
} as const;

export type HeaderTypographyTokens = typeof headerTypography;
