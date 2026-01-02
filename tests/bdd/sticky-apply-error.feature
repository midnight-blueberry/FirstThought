Feature: Sticky apply error handling
  Scenario: resets selection when applyWithSticky fails
    Given a list is rendered with a scroll ref
    When the sticky selection context is obtained
    When a pressed item is registered at position 190
    When the scroll position is 150
    When applyWithSticky throws an error
    Then sticky selection resets without scrolling
