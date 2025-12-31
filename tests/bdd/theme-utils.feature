Feature: Theme utils
  Scenario: resolveOverlayColor returns colors.background for an exact themeName match
    Given a theme list with a theme named "dark" and background "#000000"
    When I resolve overlay color for theme "dark"
    Then the resolved color equals "#000000"

  Scenario: resolveOverlayColor returns undefined when the theme is not found
    Given a theme list with a theme named "light" and background "#ffffff"
    When I resolve overlay color for theme "unknown"
    Then the resolved color is undefined

  Scenario: clampLevel returns min when the number is below the default minimum
    Given a number "-3"
    When I clamp the level with defaults
    Then the clamped level equals "1"

  Scenario: clampLevel returns max when the number is above the default maximum
    Given a number "8"
    When I clamp the level with defaults
    Then the clamped level equals "5"

  Scenario: clampLevel returns the original number when it is within the default range
    Given a number "3"
    When I clamp the level with defaults
    Then the clamped level equals "3"

  Scenario: clampLevel respects custom min and max bounds
    Given a number "5"
    When I clamp the level with custom bounds min "10" and max "20"
    Then the clamped level equals "10"
