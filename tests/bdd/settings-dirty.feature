Feature: Settings dirty hook
  Scenario: returns clean state when local matches current
    Given matching local and current settings
    When the settings dirty hook is rendered
    Then the hook reports no dirty state
    Then no changed keys are returned

  Scenario: reports accent change
    Given local settings differ by accent color
    When the settings dirty hook is rendered
    Then the hook reports a dirty state
    Then the changed keys include only the accent
