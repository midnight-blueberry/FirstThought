Feature: Theme change does not trigger sticky scroll
  Scenario: Theme change bypasses sticky apply
    Given the settings view model is initialized
    When the user selects the cream theme
    Then sticky applyWithSticky is not called
    And settings update is called with the cream theme
