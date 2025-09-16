Feature: AccentColors

  Scenario: Проверка accentColors и defaultAccentColor
    Given я загружаю accentColors и defaultAccentColor
    Then длина accentColors равна 6
    And название цвета по hex из defaultAccentColor равно "Желтый"
