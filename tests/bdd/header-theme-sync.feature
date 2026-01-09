Feature: Header theme sync

  Scenario: applies light theme header options and status bar style
    Given a light theme with background "#ABCDEF"
    When the header theme sync component is rendered
    Then navigation options set header background to "#ABCDEF"
    Then header is not transparent
    Then header tint color is "#000"
    Then status bar barStyle is "dark-content"
    Then status bar is translucent

  Scenario: applies dark theme header options when transparent is true
    Given a dark theme with background "#111111"
    When the header theme sync component is rendered with transparent
    Then navigation options set header background to "transparent"
    Then header is transparent
    Then header tint color is "#fff"
    Then status bar barStyle is "light-content"
    Then status bar is translucent
