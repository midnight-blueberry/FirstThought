Feature: Sanity

  Scenario: basic arithmetic works
    Given I have numbers 2 and 2
    When I add them
    Then the result should be 4
