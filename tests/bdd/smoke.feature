Feature: Sanity
  Scenario: buildSettingsPatch clamps font size level
    Given current settings with font size level 3
    When buildSettingsPatch receives local font size level 999
    Then it returns { fontSizeLevel: 5 }

  Scenario: buildSettingsPatch maps selected theme name to theme id
    Given current settings with theme id light
    When buildSettingsPatch receives local theme name "Темная"
    Then it returns { themeId: "dark" }

  Scenario: buildSettingsPatch updates accent when selectedAccentColor changes
    Given current settings with accent "#FFD700"
    When buildSettingsPatch receives local accent "#00FF00"
    Then it returns { accent: "#00FF00" }

  Scenario: buildSettingsPatch normalizes font weight after font family change
    Given current settings with font family "Inter" and weight "400"
    When buildSettingsPatch receives local font family "Roboto" with weight "400"
    Then it returns { fontFamily: "Roboto", fontWeight: "700" }

  Scenario: buildSettingsPatch updates note text align
    Given current settings with note text align "left"
    When buildSettingsPatch receives local note text align "justify"
    Then it returns { noteTextAlign: "justify" }

  Scenario: buildSettingsPatch returns empty patch when no fields change
    Given local settings are identical to current settings
    When buildSettingsPatch receives the identical settings
    Then it returns {}

  Scenario: buildSettingsPatch clamps lower font size level
    Given current settings with font size level 3
    When buildSettingsPatch receives local font size level 0
    Then it returns { fontSizeLevel: 1 }
