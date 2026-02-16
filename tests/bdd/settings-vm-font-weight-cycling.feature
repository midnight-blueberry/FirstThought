Feature: Settings VM font weight cycling

Scenario: Increase cycles from 400 to 500 for available weights 400, 500, 700
Given current font weight is "400"
Given settings VM is rendered
Given sticky press is registered for font weight
When font weight increase is triggered
Then updateSettings receives patch with fontWeight "500"

Scenario: Increase wraps from 700 to 400 for available weights 400, 500, 700
Given current font weight is "700"
Given settings VM is rendered
Given sticky press is registered for font weight
When font weight increase is triggered
Then updateSettings receives patch with fontWeight "400"

Scenario: Decrease wraps from 400 to 700 for available weights 400, 500, 700
Given current font weight is "400"
Given settings VM is rendered
Given sticky press is registered for font weight
When font weight decrease is triggered
Then updateSettings receives patch with fontWeight "700"
