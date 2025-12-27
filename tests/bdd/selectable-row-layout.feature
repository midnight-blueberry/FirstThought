Feature: Selectable row layout consistency

  Scenario: Checkmark container is vertically centered
    Given a selectable row is rendered
    Then the absolute positioned checkmark container has top and bottom equal to zero

  Scenario: Label line height uses default font size when not provided
    Given a selectable row is rendered without custom font size
    Then the label style uses the medium font size and padding to compute line height
