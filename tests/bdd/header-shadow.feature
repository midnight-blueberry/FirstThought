Feature: Header shadow
  Scenario: sets header options without shadow at top
    Given a theme with header background "#123456"
    Given medium icon size 24 and large padding 8
    Given a top inset of 10
    When the scroll offset is 0
    Then the header shadow is not visible
    Then the header elevation is 0
    Then the header background color matches the theme
    Then the header height is 50

  Scenario: sets header options with shadow after scrolling
    Given a theme with header background "#123456"
    Given medium icon size 24 and large padding 8
    Given a top inset of 10
    When the scroll offset is 5
    Then the header shadow is visible
    Then the header elevation is 4
    Then the header background color matches the theme
    Then the header height is 50
