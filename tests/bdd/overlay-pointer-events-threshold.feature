Feature: Pointer events block threshold for overlay
  Scenario: Threshold value matches setting
    Given overlay transition configuration is available
    Then pointer events block threshold equals 0.75
