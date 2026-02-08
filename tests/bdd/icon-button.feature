Feature: Icon button interactions

Scenario: Press in stores anchor in anchor stable scroll context
Given icon button is rendered with disabled false
When the icon button receives press in event with current target 123
Then anchor stable scroll context setAnchor is called with 123
Then onPressIn callback is called once
Then onPressIn callback is called after setAnchor

Scenario: Press calls captureBeforeUpdate before onPress callback
Given icon button is rendered with disabled false
When the icon button is pressed
Then anchor stable scroll context captureBeforeUpdate is called
Then onPress callback is called once
Then onPress callback is called after captureBeforeUpdate
