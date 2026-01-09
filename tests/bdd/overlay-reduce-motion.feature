Feature: Overlay reduce motion
  Scenario: begin uses maximum opacity with reduce motion
    Given reduce motion is enabled for overlay transitions
    When begin is invoked on the overlay transition
    Then opacity is set to OVERLAY_MAX_OPACITY without showing the overlay

  Scenario: end uses minimum opacity with reduce motion
    Given reduce motion is enabled for overlay transitions
    When end is invoked on the overlay transition
    Then opacity is set to OVERLAY_MIN_OPACITY without hiding the overlay
