Feature: TextAlignSelector interactions

  Scenario: Left alignment press updates value after sticky registerPress resolves
    Given note text align is "justify"
    When TextAlignSelector is rendered
    Then registry register is called for "align:left"
    Then registry register is called for "align:justify"
    When left align button is pressed
    Then registerPress is called with "align:left"
    Then onChange is not called yet
    When registerPress resolves
    Then onChange is called with "left"
    When TextAlignSelector is unmounted
    Then registry unregister is called with "align:left"
    Then registry unregister is called with "align:justify"

  Scenario: Justify alignment press updates value after sticky registerPress resolves
    Given note text align is "left"
    When TextAlignSelector is rendered
    Then registry register is called for "align:left"
    Then registry register is called for "align:justify"
    When justify align button is pressed
    Then registerPress is called with "align:justify"
    Then onChange is not called yet
    When registerPress resolves
    Then onChange is called with "justify"
    When TextAlignSelector is unmounted
    Then registry unregister is called with "align:left"
    Then registry unregister is called with "align:justify"
