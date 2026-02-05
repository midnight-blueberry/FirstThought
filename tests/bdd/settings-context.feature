Feature: Settings context
  Scenario: updateSettings persists new values
    Given settings context is rendered
    When I update settings with accent "#FF00FF" and font size level 5
    Then returned settings include accent "#FF00FF"
    Then returned settings include font size level 5
    Then settings are persisted to storage

  Scenario: setFontFamily clamps to the nearest available weight
    Given settings context is rendered
    When I set font family to "PT Sans"
    Then returned settings include font family "PT Sans"
    Then returned settings include font weight "400"
    Then settings are persisted to storage

  Scenario: setFontWeight clamps to the nearest available weight
    Given settings context is rendered
    When I set font weight to 650
    Then returned settings include font weight "600"
    Then settings are persisted to storage
