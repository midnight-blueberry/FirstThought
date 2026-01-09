Feature: Overlay transition reduce motion
  Scenario: begin uses reduced motion behavior
    Given reduce motion is enabled for overlay transitions
    When begin is called
    Then opacity is set to maximum without calling show

  Scenario: end uses reduced motion behavior
    Given reduce motion is enabled for overlay transitions
    When end is called
    Then opacity is set to minimum without calling hide
