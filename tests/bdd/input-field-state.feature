Feature: Input field state
  Scenario: uncontrolled state updates value and clears
    Given the input field state is rendered uncontrolled with default value "abc"
    Then the field is uncontrolled
    Then the field value is "abc"
    When I set the input value to "hello"
    Then the field value is "hello"
    Then onChangeText is called with "hello"
    Given the input ref has a clear spy
    When I press the clear button
    Then onClear is called once
    Then the native clear is called once
    Then the field value is ""

  Scenario: controlled state calls onChangeText without changing value
    Given the input field state is rendered controlled with value "abc"
    Then the field is controlled
    Then the field value is "abc"
    When I set the input value to "zzz"
    Then onChangeText is called with "zzz"
    Then the field value remains "abc"

  Scenario: secure text entry toggles icon name
    Given the input field state is rendered with secure text entry enabled
    Then the secure toggle icon is "eye-off"
    When I toggle secure visibility
    Then secure visibility is true
    Then the secure toggle icon is "eye"
