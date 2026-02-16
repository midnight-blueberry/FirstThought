Feature: Settings VM handles sticky transaction update errors
  Scenario: Changing accent rolls back settings and shows error toast when update fails
    Given settings VM is rendered with sticky context
    Given sticky press is registered
    When user selects accent "#00FF00"
    Then sticky apply is triggered
    Then updateSettings is called with accent patch
    Then updateSettings is called with rollback settings
    Then error toast is shown with message "boom"
