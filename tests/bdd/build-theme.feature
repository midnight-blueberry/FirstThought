Feature: Build theme
  Scenario: Falls back to light theme for unknown saved theme
    Given saved settings with unknown theme name
    When I build the theme
    Then the theme name equals "Светлая"

  Scenario: Applies saved accent color
    Given saved settings with accent color "#123456"
    When I build the theme
    Then the theme accent color equals "#123456"

  Scenario: Clamps font size level to maximum and applies deltas
    Given saved settings with font size level 999
    When I build the theme
    Then the theme has medium font size 22
    Then the theme has medium padding 10
    Then the theme has medium margin 10
