Feature: Accent colors default selection

  Scenario: Default accent color matches expected color
    Given я загружаю accentColors и defaultAccentColor
    Then длина accentColors равна 6
    And название цвета по hex из defaultAccentColor равно "Желтый"
