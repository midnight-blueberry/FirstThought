Feature: Save indicator does not flicker after overlay
  Scenario: Old animation completions cannot hide the indicator after a new show
    Given a save indicator controller
    When the indicator is shown twice quickly
    And the first animation completes
    Then the indicator stays visible
    And the second animation completes
    Then the indicator hides
