Feature: Divider
  Scenario: renders default divider styles
    Given the divider is rendered without custom style
    Then the divider style has height 2
    Then the divider style has background color "#111111"
    Then the divider style has alignSelf "stretch"
    Then the divider style has marginBottom 12
    Then the divider style has borderRadius 2

  Scenario: applies custom style overrides
    Given the divider is rendered with custom style
    Then the divider style has marginBottom 123
    Then the divider style has background color "#ABCDEF"
    Then the divider style keeps height 2
