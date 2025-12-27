Feature: Save indicator debounce for overlay theme changes
  Scenario: Save indicator appears once after rapid overlay transactions
    Given settings VM with overlay save indicator debounce is rendered
    When user quickly selects two themes
    Then save indicator is not shown before debounce time
    And save indicator is shown once after debounce time
    And save indicator is hidden before overlay transaction starts
