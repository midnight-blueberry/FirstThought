Feature: Blink index hook
  Scenario: blinkAt updates index and triggers blink
    Given useBlinkIndex is rendered
    When blinkAt is called with 3
    Then stopAnim is called before index is set to 3
    Then index setter is called with 3 before triggerBlink is called
    Then triggerBlink is called

  Scenario: stopBlink stops animation and clears index
    Given useBlinkIndex is rendered
    When stopBlink is called
    Then stopAnim is called before index is set to null
    Then index setter is called with null

  Scenario: onEnd clears the index
    Given useBlinkIndex is rendered
    When onEnd callback is invoked
    Then index setter is called with null
