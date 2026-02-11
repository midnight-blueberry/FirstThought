Feature: Font size selector behavior

Scenario: Max font size disables increase button
Given font size level is 5
When FontSizeSelector is rendered
Then increase button is disabled
Then decrease button is enabled

Scenario: Pressing buttons registers sticky press before callbacks
Given font size level is 3
When FontSizeSelector is rendered
When increase button is pressed
Then registerPress is called once with id "fontSize"
Then onIncrease is called once after registerPress
When decrease button is pressed
Then registerPress is called twice with id "fontSize"
Then onDecrease is called once after registerPress
