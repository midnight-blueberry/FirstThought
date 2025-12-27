Feature: Save indicator debounce during overlay transactions
  Scenario: Save indicator is debounced across rapid overlay theme changes
    Given settings VM is rendered with fake timers
    When user quickly selects two themes through overlay transactions
    Then save indicator is shown once after overlay debounce
    And hide is called before overlay transaction begins
