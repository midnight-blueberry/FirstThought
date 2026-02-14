Feature: Theme selector behavior

Scenario: Pressing theme row waits for sticky registerPress and keeps registry lifecycle
Given selected theme name is "Light"
When ThemeSelector is rendered
Then registry register is called for "theme:Light"
Then registry register is called for "theme:Dark"
When theme row "Dark" is pressed
Then registerPress is called with "theme:Dark"
Then onSelectTheme is not called yet
When registerPress promise resolves
Then onSelectTheme is called once with "Dark"
When ThemeSelector is unmounted
Then registry unregister is called for "theme:Light"
Then registry unregister is called for "theme:Dark"
