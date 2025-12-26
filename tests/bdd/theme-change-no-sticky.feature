Feature: Theme change uses overlay transaction without sticky scroll
  Scenario: Changing theme does not trigger sticky apply
    Given settings VM is rendered
    When user selects theme "Кремовая"
    Then sticky selection is not applied during theme change
    And settings are updated with theme "cream"
