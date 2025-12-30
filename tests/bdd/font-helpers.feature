Feature: Font helpers
  Scenario: getFontByName returns font by exact name
    Given fonts named "Alpha" and "Beta"
    Given I search for the font name "Beta"
    When I get a font by name
    Then the returned font name is "Beta"

  Scenario: getFontByName returns the first font when the name is not found
    Given fonts named "Alpha" and "Beta"
    Given I search for the font name "Gamma"
    When I get a font by name
    Then the returned font name is "Alpha"

  Scenario: adjustWeight returns the next weight within bounds
    Given a font with weights "300" "500" "700"
    Given the current weight is "300" and the delta is 1
    When I adjust the weight
    Then the adjusted weight is "500"

  Scenario: adjustWeight returns the previous weight within bounds
    Given a font with weights "300" "500" "700"
    Given the current weight is "700" and the delta is -1
    When I adjust the weight
    Then the adjusted weight is "500"

  Scenario: adjustWeight returns undefined when stepping outside the weights
    Given a font with weights "300" "500"
    Given the current weight is "500" and the delta is 1
    When I adjust the weight
    Then the adjusted weight is undefined

  Scenario: adjustWeight returns undefined when the current weight is missing and delta is zero
    Given a font with weights "300" "500"
    Given the current weight is "900" and the delta is 0
    When I adjust the weight
    Then the adjusted weight is undefined

  Scenario: hasMultipleWeights returns true when more than one weight exists
    Given a font with weights "300" "500"
    When I check for multiple weights
    Then the multiple weights result is true

  Scenario: hasMultipleWeights returns false when only one weight exists
    Given a font with weights "400"
    When I check for multiple weights
    Then the multiple weights result is false
