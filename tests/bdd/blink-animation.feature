Feature: Blink animation hook
  Scenario: triggerBlink starts default animation
    Given useBlinkAnimation is rendered with default params
    When triggerBlink is invoked
    Then blinkAnim.setValue is called with 1
    Then Animated.timing is called twice for fading out and in with duration 150
    Then Animated.loop is called with iterations 5
    Then animation start is called with onEnd callback

  Scenario: stopBlink stops animation and resets
    Given useBlinkAnimation is rendered with default params
    When stopBlink is invoked
    Then blinkAnim.stopAnimation is called
    Then blinkAnim.setValue is called with 1
    Then onEnd callback is called
