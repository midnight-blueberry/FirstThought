Feature: Anchor stable scroll adjustments
  Scenario: avoids cumulative drift across sequential layout diffs
    Given anchor stable scroll is mounted with initial scroll 150
    When the first capture and adjust cycle completes
    And the second capture and adjust cycle completes
    Then scroll offsets are corrected to 160 and then 150
