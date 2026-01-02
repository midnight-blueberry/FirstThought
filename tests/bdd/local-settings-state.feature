Feature: Local settings state
  Scenario: returns initial selected theme and version
    Given local settings state is rendered with initial settings
    Then the selected theme name is "Dark"
    Then the settings version equals 0

  Scenario: updates theme and settings version
    Given local settings state is rendered with initial settings
    When I update selected theme name to "Cream"
    When I increment settings version
    Then the selected theme name is "Cream"
    Then the settings version equals 1
