Feature: Drawer routes
  Scenario: Builds drawer routes with expected configuration
    Given a drawer routes config
    When I build drawer routes
    Then it returns two routes named Home and Settings in order
    Then Home route renders correct options with header components
    Then Settings route renders correct options with header components
