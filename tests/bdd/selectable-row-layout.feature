Feature: Selectable row layout alignment

  Scenario: Check icon container vertical alignment
    Given a rendered selectable row
    Then the absolute positioned container aligns vertically

  Scenario: Label line height uses default font size when not provided
    Given a rendered selectable row without custom font size
    Then the label uses the default line height value
