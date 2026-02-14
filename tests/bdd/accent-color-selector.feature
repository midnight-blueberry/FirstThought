Feature: Accent color selector behavior

Scenario: Pressing accent row waits for sticky registerPress and keeps registry lifecycle
Given selected accent color is "#00FF00"
When AccentColorSelector is rendered
Then registry register is called for "accent:#00FF00"
Then registry register is called for "accent:#FF0000"
When accent row "#FF0000" is pressed
Then registerPress is called with "accent:#FF0000"
Then onSelectAccent is not called yet
When registerPress promise resolves
Then onSelectAccent is called once with "#FF0000"
When AccentColorSelector is unmounted
Then registry unregister is called for "accent:#00FF00"
Then registry unregister is called for "accent:#FF0000"
