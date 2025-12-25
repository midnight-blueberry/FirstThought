Feature: Sticky scroll maintains offset after theme change

  Scenario: keeps scroll offset after theme change
    Given a list is rendered with a scroll ref
    And a sticky selection context is available
    When a pressed item is registered at position 190
    And the scroll position is 150
    And the theme dark item is registered at position 210
    And sticky selection is applied
    Then the scroll offset is adjusted to 170 without animation
