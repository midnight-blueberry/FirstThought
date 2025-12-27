Feature: Layout of selectable row
  Scenario: Checkmark is vertically centered
    Given SelectableRow component is rendered
    Then Checkmark container has top 0 and bottom 0

  Scenario: Text height stays consistent without fontSize
    Given SelectableRow component is rendered without fontSize
    Then Label line has lineHeight equal to font size plus padding
