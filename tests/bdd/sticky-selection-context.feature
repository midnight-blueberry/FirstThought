Feature: Sticky selection context

  Scenario: Sticky selection context stores and clears value
    Given sticky selection context is cleared
    When I set sticky selection context to a mock value
    Then getStickySelectionContext returns the same reference
    When I set sticky selection context to null
    Then getStickySelectionContext returns null

  Scenario: useStickySelection throws without provider
    Given sticky selection context is cleared
    When I render a component that uses useStickySelection outside the provider
    Then it throws an error that useStickySelection must be used within StickySelectionProvider
