Feature: Input field styles
  Scenario: Filled variant uses disabled background and no border
    Given a default theme
    Given the input field variant is "filled"
    When I build the input field styles
    Then the container background color equals the theme disabled color
    Then the container border width equals 0

  Scenario: Outline focused state uses accent border and transparent background
    Given a default theme
    Given the input field variant is "outline"
    Given the input field is focused
    When I build the input field styles
    Then the container border color equals the theme accent color
    Then the container background color equals transparent

  Scenario: Outline non-editable state uses disabled colors
    Given a default theme
    Given the input field variant is "outline"
    Given the input field is not editable
    When I build the input field styles
    Then the container background color equals the theme disabled color
    Then the container border color equals the theme disabled color

  Scenario: Small size uses small metrics
    Given a default theme
    Given the input field size is "sm"
    When I build the input field styles
    Then the container height equals the theme small button size
    Then the container horizontal padding equals the theme medium padding
    Then the input font size equals the theme small font size
