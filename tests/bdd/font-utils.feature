Feature: Font utils

  Scenario: toFamilyKey strips weight suffix and converts spaces to underscores
    Given a font name "Bad Script-400-italic"
    When I convert it to a family key
    Then it equals "Bad_Script"
