Feature: Save indicator hides correctly when animations overlap

  Scenario: Previous animation completion cannot hide indicator after a new show
    Given save indicator controller is initialized
    When save indicator is shown twice in a row
    And the first animation completes
    Then the indicator is still visible
    When the second animation completes
    Then the indicator becomes hidden
