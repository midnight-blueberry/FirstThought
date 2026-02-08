Feature: Text align button
  Scenario: Press in stores anchor in anchor stable scroll context
    Given text align button variant is left
    Given button is rendered with selected false
    When the button receives press in event with current target 123
    Then anchor stable scroll context setAnchor is called with 123
    Then button border color is "transparent"

  Scenario: Press calls captureBeforeUpdate and onPress
    Given text align button variant is justify
    Given button is rendered with selected true
    When the button is pressed
    Then anchor stable scroll context captureBeforeUpdate is called
    Then onPress callback is called once
    Then button border color is "#00FF00"
