Feature: Save indicator does not flicker after overlay
  Scenario: Sequential show calls do not hide indicator from earlier completion
    Given a save indicator controller
    When show is triggered twice quickly
    And the first animation completes
    Then the indicator is still visible
    When the second animation completes
    Then the indicator is hidden
