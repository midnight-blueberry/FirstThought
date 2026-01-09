Feature: Overlay pointer events
  Scenario: Opacity above threshold returns auto
    Given overlay transition configuration is available
    When opacity is above the threshold
    Then pointer events are "auto"

  Scenario: Opacity at threshold returns none
    Given overlay transition configuration is available
    When opacity equals the threshold
    Then pointer events are "none"

  Scenario: Opacity below threshold returns none
    Given overlay transition configuration is available
    When opacity is below the threshold
    Then pointer events are "none"
