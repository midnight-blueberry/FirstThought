Feature: Font resolve
  Scenario: listAvailableWeights returns sorted weights
    Given a font family with weights 700 and 400
    When I list available weights
    Then the result equals [400, 700]

  Scenario: nearestAvailableWeight returns an exact match
    Given a font family with weights 700 and 400
    When I request nearest weight 700
    Then the nearest weight equals 700

  Scenario: nearestAvailableWeight returns the closest weight
    Given a font family with weights 700 and 400
    When I request nearest weight 600
    Then the nearest weight equals 700

  Scenario: nearestAvailableWeight prefers the lower weight on a tie
    Given a font family with weights 700 and 400
    When I request nearest weight 550
    Then the nearest weight equals 400

  Scenario: resolveFont returns the key, weight, and file for the nearest weight
    Given a font family with weights 700 and 400
    When I resolve the font for weight 600
    Then the resolved font matches the 700 weight file
