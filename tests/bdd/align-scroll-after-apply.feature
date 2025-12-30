Feature: Align scroll after apply
  Scenario: computeDelta returns positive delta
    Given previous center Y is 100
    Given page Y is 120
    Given height is 60
    When computeDelta is calculated
    Then the result equals 50

  Scenario: computeDelta returns negative delta
    Given previous center Y is 200
    Given page Y is 150
    Given height is 20
    When computeDelta is calculated
    Then the result equals -40

  Scenario: alignScrollAfterApply returns 0 when ref is missing
    Given previous center Y is 100
    When alignScrollAfterApply is called for missing id
    Then the result equals 0
