Feature: Blink index hook
  Scenario: blinkAt triggers stop, updates index, and starts blink animation
    Given useBlinkIndex is rendered
    When blinkAt is called with index 3
    Then stop animation handler is called before index setter
    Then index setter is called with 3
    Then triggerBlink handler is called after index setter

  Scenario: stopBlink stops animation and clears index
    Given useBlinkIndex is rendered
    When stopBlink is invoked
    Then stop animation handler is called
    Then index setter is called with null

  Scenario: onEnd callback clears index
    Given useBlinkIndex is rendered
    When the captured onEnd callback is invoked
    Then index setter is called with null
