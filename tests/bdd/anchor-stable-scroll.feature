Feature: Anchor stable scroll
  Scenario: Adjusts scroll without cumulative drift
    Given an anchor stable scroll hook with scroll position 150
    And anchor measurements queue is prepared
    When two adjustment cycles run
    Then scroll offsets are corrected without accumulation
