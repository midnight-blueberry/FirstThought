Feature: Status bar background
  Scenario: hides when safe area top is zero
    Given safe area top inset is 0
    When StatusBarBackground is rendered
    Then no View is rendered

  Scenario: renders when safe area top is positive
    Given safe area top inset is 24
    When StatusBarBackground is rendered
    Then a View is rendered
    Then the View style has height 24
    Then the View style has backgroundColor "#123456"
    Then the View style has position "absolute"
    Then the View style has top 0
    Then the View style has left 0
    Then the View style has right 0
    Then the View style has zIndex 1
