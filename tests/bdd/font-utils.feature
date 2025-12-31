Feature: Font utils
  Scenario: toFamilyKey strips weight suffix and converts spaces to underscores
    Given a font name "Bad Script-400-italic"
    When I convert it to a family key
    Then it equals "Bad_Script"

  Scenario: getBaseFontName strips weight suffix and converts underscores to spaces
    Given a theme font name "Bad_Script-400-italic"
    When I get the base font name
    Then it equals "Bad Script"

  Scenario: calcFontSizeLevel clamps to minimum 1
    Given theme small font size 0 and default font size 16
    When I calculate the font size level
    Then it equals 1

  Scenario: calcFontSizeLevel clamps to maximum 5
    Given theme small font size 100 and default font size 16
    When I calculate the font size level
    Then it equals 5

  Scenario: calcFontSizeLevel returns 3 at default font size
    Given theme small font size 12 and default font size 16
    When I calculate the font size level
    Then it equals 3

  Scenario: nextIconSize increases all icon sizes by 8 at level 5
    Given icon sizes xsmall 1 small 2 medium 3 large 4 xlarge 5
    When I apply icon size level 5
    Then icon sizes equal xsmall 9 small 10 medium 11 large 12 xlarge 13

  Scenario: nextIconSize decreases sizes by 1 at level 1
    Given icon sizes xsmall 9 small 10 medium 11 large 12 xlarge 13
    When I apply icon size level 1
    Then icon sizes equal xsmall 1 small 2 medium 3 large 4 xlarge 5
