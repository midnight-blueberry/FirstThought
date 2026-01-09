Feature: Overlay transition reduce motion
  Scenario: begin uses max opacity without show when reduce motion is enabled
    Given the overlay transition provider is rendered with reduce motion enabled
    When begin is invoked after reduce motion is applied
    Then opacity is set to maximum and show is not called

  Scenario: end uses min opacity without hide when reduce motion is enabled
    Given the overlay transition provider is rendered with reduce motion enabled
    When end is invoked after reduce motion is applied
    Then opacity is set to minimum and hide is not called
