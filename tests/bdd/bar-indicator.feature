Feature: Bar indicator
  Scenario: rendering plus blink without onPress
    Given total is 3
    Given filled count is 2
    Given blink index is 0
    When BarIndicator is rendered without onPress handler
    Then 3 bar containers are rendered as View
    Then bar container heights are 10, 15, 20
    Then blinking filled bar is rendered as Animated.View with fill color "#00FF00" and opacity equals blinkAnim

  Scenario: pressing with onPress and AnchorStableScrollContext
    Given total is 2
    Given filled count is 0
    When BarIndicator is rendered with onPress handler
    When user presses bar 1 with current target 777
    Then anchor stable scroll context setAnchor is called with 777
    Then anchor stable scroll context captureBeforeUpdate is called once
    Then onPress callback is called with index 1
    Then onPress callback is called after captureBeforeUpdate
