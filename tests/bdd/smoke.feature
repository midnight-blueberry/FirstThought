Feature: Sanity
  Scenario: buildSettingsPatch clamps font size level
    Given current settings with font size level 3
    When buildSettingsPatch receives local font size level 999
    Then it returns { fontSizeLevel: 5 }

  Scenario: buildSettingsPatch maps selected theme name to theme id
    Given current settings with theme id light
    When buildSettingsPatch receives local theme name "Темная"
    Then it returns { themeId: "dark" }

  Scenario: buildSettingsPatch returns empty patch when no fields change
    Given local settings are identical to current settings
    When buildSettingsPatch receives the identical settings
    Then it returns {}
