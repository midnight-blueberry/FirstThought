Feature: Anchor stable scroll

  Scenario: keeps scroll position without accumulating error
    Given anchor stable scroll hook is rendered
    And the scroll position is 150
    When anchor position changes from 100 to 110
    And anchor position changes from 110 to 100
    Then the scroll is adjusted back to 150 without extra shift
