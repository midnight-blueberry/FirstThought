Feature: Settings handlers
  Scenario: selecting a theme increments settings version when updater exists
    Given settings handlers are rendered with a settings version updater
    When I select the theme "dark"
    Then setSelectedThemeName is called with "dark"
    Then the settings version updater increases the value by one

  Scenario: selecting accent skips version bump when updater is missing
    Given settings handlers are rendered without a settings version updater
    When I select the accent "#00FF00"
    Then setSelectedAccentColor is called with "#00FF00"
    Then setSettingsVersion is not invoked
