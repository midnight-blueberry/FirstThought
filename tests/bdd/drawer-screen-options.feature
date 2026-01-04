Feature: Drawer screen options
  Scenario: Builds drawer options with defaults and theme values
    Given a drawer width of 280
    Given a theme with drawer styling values
    Given a base header style object
    When I build drawer screen options
    Then it includes default drawer options
    Then it uses the drawer width and theme styles
    Then it applies the base header style and tint color
    Then it defines large title style for iOS
    Then headerTitle forwards props to the HeaderTitle component
