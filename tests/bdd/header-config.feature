Feature: Header config
  Scenario: calculates header height from theme and top inset
    Given a theme with medium icon size 24 and large padding 8
    Given a top inset of 10
    When I build the header config
    Then the header height is 50

  Scenario: returns header visual style from theme
    Given a theme header background "#123456"
    Given a theme basic color "#222222"
    Given a theme border width small 2
    When I build the header config
    Then the header background color is "#123456"
    Then the header border bottom color is "#222222"
    Then the header border bottom width is 2
    Then the header elevation is 0
    Then the header shadow opacity is 0

