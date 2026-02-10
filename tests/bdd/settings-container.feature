Feature: SettingsContainer
  Scenario: forwards scroll events to VM and anchor handlers
    Given SettingsContainer is rendered
    When I trigger onScroll with y 123
    Then settings VM handleScroll is called with y 123
    Then anchor stable scroll handleScroll is called with y 123

  Scenario: waits for opaque overlay before adjusting anchor layout
    Given SettingsContainer is rendered with pending overlay opaque wait
    Then anchor adjustAfterLayout is not called
    When overlay becomes opaque
    Then anchor adjustAfterLayout is called
