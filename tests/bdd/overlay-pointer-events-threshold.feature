Feature: Pointer events block threshold for overlay
  Scenario: Pointer events disabled below threshold
    Given overlay transition configuration is available
    When overlay opacity is 0.74
    Then overlay pointer events are "none"

  Scenario: Pointer events enabled above threshold
    Given overlay transition configuration is available
    When overlay opacity is 0.76
    Then overlay pointer events are "auto"

  Scenario: Pointer events disabled at threshold
    Given overlay transition configuration is available
    When overlay opacity is 0.75
    Then overlay pointer events are "none"

  Scenario: Threshold value matches setting
    Given overlay transition configuration is available
    Then pointer events block threshold equals 0.75
