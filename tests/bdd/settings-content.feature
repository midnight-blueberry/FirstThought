Feature: Settings content

Scenario: Scroll event is forwarded to sticky selection and external handler
Given sticky selection onScroll spy is reset
Given SettingsContent is rendered
When I trigger ScrollView onScroll with y 123
Then sticky selection onScroll is called with y 123
Then external onScroll is called with y 123

Scenario: Sections and overlay props are forwarded
Given SettingsContent is rendered with two sections
Then first section receives prop testProp "A"
Then second section receives prop testProp "B"
Then Overlay receives visible true
Then Overlay receives color "#ABCDEF"
Then Overlay receives blocks true
Then ScrollView has scrollIndicatorInsets right 30
Then ScrollView has scrollIndicatorInsets bottom 30
