Feature: Accent colors
  Scenario: Accent colors list has six unique items
    Given the accent colors list
    Then it contains 6 unique items by name and hex

  Scenario: Accent color entries have correct types and format
    Given the accent colors list
    Then each entry has string name and hex in #RRGGBB format

  Scenario: Accent colors include all expected names
    Given the accent colors list
    Then it includes the expected color names

  Scenario: Default accent color is yellow
    Given the accent colors list
    Then the default accent color corresponds to "Желтый"
