Feature: Build section props
  Scenario: Disables font weight when font has a single weight
    Given selected font name is "Bad Script"
    When I build section props
    Then the font weight control is disabled

  Scenario: Enables font weight when font has multiple weights
    Given selected font name is "Comfortaa"
    When I build section props
    Then the font weight control is enabled
