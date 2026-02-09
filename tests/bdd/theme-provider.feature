Feature: Theme provider
  Scenario: Builds a theme from saved settings
    Given themeId is "cream"
    Given accent is "#123456"
    Given fontFamily is "Inter"
    Given fontWeight is 500
    Given fontSizeLevel is 4
    Given noteTextAlign is "center"
    When ThemeProvider is rendered
    Then buildTheme is called once with mapped saved settings
    Then StyledThemeProvider receives the theme returned by buildTheme
