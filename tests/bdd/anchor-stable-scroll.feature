Feature: Anchor stable scroll

  Scenario: Adjusts scroll when anchor moves down
    Given anchor stable scroll hook is rendered
    When scroll position becomes 100
    When anchor layout before update reports y 50
    When anchor layout after update reports y 70
    When scroll adjustment runs
    Then scroll is called with y 120 without animation

  Scenario: Does not scroll when anchor position is stable
    Given anchor stable scroll hook is rendered
    When scroll position becomes 100
    When anchor layout before update reports y 50
    When anchor layout after update reports y 50
    When scroll adjustment runs
    Then scroll is not called
