Feature: Save indicator should not flicker when animations overlap
  Scenario: Later show cancels completion of previous animation
    Given save indicator is rendered
    When save indicator is shown twice quickly
    Then completing the first animation keeps it visible
    And completing the second animation hides it
