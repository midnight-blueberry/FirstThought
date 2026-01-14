Feature: Header shadow

  Scenario: hides shadow when scroll offset is zero
    Given a theme with header background "#112233", medium icon size 24, and large padding 8
    Given a top inset of 10
    Given a scroll offset of 0
    When the header shadow hook is rendered
    When the scroll handler is invoked
    Then header shadow is not visible
    Then header elevation is 0
    Then header height is 50
    Then header background color is "#112233"

  Scenario: shows shadow when scroll offset is positive
    Given a theme with header background "#112233", medium icon size 24, and large padding 8
    Given a top inset of 10
    Given a scroll offset of 5
    When the header shadow hook is rendered
    When the scroll handler is invoked
    Then header shadow is visible
    Then header elevation is 4
    Then header height is 50
    Then header background color is "#112233"
