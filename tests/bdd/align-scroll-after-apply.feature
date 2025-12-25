Feature: Align scroll after apply
  Scenario: computeDelta returns positive delta
    Given previous center Y is 100
    And page Y is 120
    And height is 60
    When computeDelta is calculated
    Then the result equals 50

  Scenario: computeDelta returns negative delta
    Given previous center Y is 200
    And page Y is 150
    And height is 20
    When computeDelta is calculated
    Then the result equals -40
