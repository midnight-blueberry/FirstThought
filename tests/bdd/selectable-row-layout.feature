Feature: Selectable row layout

  Scenario: Checkmark container is vertically centered
    Given a selectable row is rendered
    Then the checkmark container spans the row height

  Scenario: Label uses default line height without explicit font size
    Given a selectable row is rendered without custom font size
    Then the label line height uses the default theme values
