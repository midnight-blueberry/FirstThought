Feature: Header config
  Scenario: calculates header height from theme and top inset
    Given a theme with medium icon size 24 and large padding 8
    Given a top inset of 10
    When I build the header config
    Then the header height is 50

  Scenario: returns header background color from theme
    Given a theme header background "#123456"
    When I build the header config
    Then the header background color is "#123456"
