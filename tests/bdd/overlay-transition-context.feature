Feature: Overlay transition context
  Scenario: useOverlayTransition throws without provider
    Given the overlay transition provider is not rendered
    When I render a component that calls useOverlayTransition outside the provider
    Then it throws an error that useOverlayTransition must be used within OverlayTransitionProvider
