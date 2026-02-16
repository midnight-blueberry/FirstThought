Feature: Theme change handles overlay transaction update errors
  Scenario: Changing theme rolls back settings and shows error toast when update fails
    Given settings VM is rendered
    When user selects theme "Кремовая"
    Then updateSettings is called twice during failed theme change
    Then first updateSettings call contains theme patch "cream"
    Then second updateSettings call contains rollback settings
    Then error toast is shown with message "boom"
