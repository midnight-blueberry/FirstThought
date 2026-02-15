Feature: Font selector behavior

Scenario: FontSelector renders rows with computed props and applies sticky press before selection
Given selected font name is "Beta Serif"
When FontSelector is rendered with font size level 4
Then a row is rendered for each font
Then row "Alpha Sans" is not selected
Then row "Beta Serif" is selected
Then each row swatchColor equals "#111111"
Then row "Alpha Sans" has computed font size 20
Then row "Beta Serif" has computed font size 24
Then row "Alpha Sans" has labelStyle fontFamily from fontKey and nearest weight
Then row "Beta Serif" has labelStyle fontFamily from fontKey and nearest weight
Then registry register is called for "fontFamily:Alpha Sans"
Then registry register is called for "fontFamily:Beta Serif"
When row "Alpha Sans" is pressed
Then registerPress is called with "fontFamily:Alpha Sans"
Then onSelectFont is not called yet
When registerPress promise resolves
Then onSelectFont is called once with "Alpha Sans"
When FontSelector is unmounted
Then registry unregister is called for "fontFamily:Alpha Sans"
Then registry unregister is called for "fontFamily:Beta Serif"
