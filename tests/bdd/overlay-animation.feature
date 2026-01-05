Feature: Overlay animation hook
  Scenario: initial opacity starts at minimum
    Given overlay animation hook is rendered
    Then overlay opacity equals OVERLAY_MIN_OPACITY

  Scenario: show starts animation to maximum opacity
    Given overlay animation hook is rendered
    When show is invoked
    Then Animated.timing is called to animate overlay to maximum opacity
    Then overlay animation starts immediately

  Scenario: hide starts animation to minimum opacity
    Given overlay animation hook is rendered
    When hide is invoked
    Then Animated.timing is called to animate overlay to minimum opacity
    Then overlay animation starts immediately after hide
