Feature: Font utils
  Scenario: toFamilyKey strips weight suffix and converts spaces to underscores
    Given a font name "Bad Script-400-italic"
    When I convert it to a family key
    Then it equals "Bad_Script"

  Scenario: nextIconSize increases all icon sizes by 8 at level 5
    Given icon sizes xsmall 1 small 2 medium 3 large 4 xlarge 5
    When I apply icon size level 5
    Then icon sizes equal xsmall 9 small 10 medium 11 large 12 xlarge 13

  Scenario: nextIconSize decreases sizes by 1 at level 1
    Given icon sizes xsmall 9 small 10 medium 11 large 12 xlarge 13
    When I apply icon size level 1
    Then icon sizes equal xsmall 1 small 2 medium 3 large 4 xlarge 5
