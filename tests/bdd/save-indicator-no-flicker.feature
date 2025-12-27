Feature: Save indicator does not flicker on overlapping animations
  Scenario: Completing an older animation does not hide a newer save indicator
    Given the save indicator is rendered
    When showFor2s is called twice quickly
    And the first animation completes
    Then the save indicator remains visible
    And after the second animation completes the save indicator is hidden
