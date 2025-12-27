Feature: Anchor stable scroll
  Scenario: prevents cumulative scroll drift across successive adjustments
    Given anchor stable scroll is rendered with a scroll view
    And the current scroll position is 150
    And measureLayout returns anchor offsets from the queue
    When layout is recalculated twice with opposite diffs
    Then the scroll positions are adjusted to 160 then 150
