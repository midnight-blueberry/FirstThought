Feature: Input field state
  Scenario: uncontrolled state updates value and clears
    Given the input field state is rendered with default value "abc"
    Then the state is uncontrolled with value "abc"
    When I set the input value to "hello"
    Then the value is "hello" and onChangeText is called with "hello"
    When I press the clear button
    Then the input is cleared and onClear is called

  Scenario: controlled state calls onChangeText without changing value
    Given the input field state is rendered with value "abc"
    Then the state is controlled with value "abc"
    When I set the input value to "zzz"
    Then onChangeText is called with "zzz" and the value remains "abc"

  Scenario: secure text entry toggles icon name
    Given the input field state is rendered with secure text entry enabled
    Then the secure icon name is "eye-off"
    When I toggle secure text entry
    Then secure visibility is true and the icon name is "eye"
