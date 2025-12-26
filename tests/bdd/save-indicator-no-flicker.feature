Feature: Save indicator does not flicker when animations overlap
  Scenario: Previous animation completion does not hide indicator after a new show request
    Given a save indicator controller
    When showFor2s is called twice in a row
    And the first animation completes
    Then the indicator remains visible
    When the second animation completes
    Then the indicator is hidden
