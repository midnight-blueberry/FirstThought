Feature: Input field state

Scenario: uncontrolled input builds left icon and clear button and clears value
Given a theme with icon sizes and colors
Given an uncontrolled input field with default value "hello" and left icon "star" and caption "cap"
When the input field state hook is rendered
Then the value equals "hello"
Then the helper equals "cap"
Then the left icon name is "star"
Then the clear button icon name is "close"
When I type "world" into the input
Then onChangeText is called with "world"
Then the value equals "world"
When I press the clear button
Then onClear is called once
Then the value equals ""

Scenario: controlled secure input toggles visibility icon
Given a theme with icon sizes and colors
Given a controlled input field with value "secret" and secure text entry enabled
When the input field state hook is rendered
Then the value equals "secret"
Then secureVisible is false
Then the secure toggle icon name is "eye-off"
When I toggle secure visibility
Then secureVisible is true
Then the secure toggle icon name is "eye"
When I type "new" into the input
Then onChangeText is called with "new"
Then the value equals "secret"
