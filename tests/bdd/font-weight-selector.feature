Feature: Font weight selector behavior

Scenario: Increase waits for sticky registerPress before calling onSelect
Given available font weights are [400, 500, 700]
Given settings font family is "Roboto Slab"
Given settings font weight is "500"
When FontWeightSelector is rendered
Then increase button is enabled
Then decrease button is enabled
When increase button is pressed
Then registerPress is called with id "fontWeight"
Then onSelect is not called yet
When registerPress resolves
Then onSelect is called with font weight "700"

Scenario: Decrease waits for sticky registerPress before calling onSelect
Given available font weights are [400, 500, 700]
Given settings font family is "Roboto Slab"
Given settings font weight is "500"
When FontWeightSelector is rendered
When decrease button is pressed
Then registerPress is called with id "fontWeight"
Then onSelect is not called yet
When registerPress resolves
Then onSelect is called with font weight "400"

Scenario: Single available weight disables both buttons and shows helper text
Given available font weights are [500]
Given settings font family is "Roboto Slab"
Given settings font weight is "500"
When FontWeightSelector is rendered
Then increase button is disabled
Then decrease button is disabled
Then helper text "Недоступно для данного шрифта" is rendered
