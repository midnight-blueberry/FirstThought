Feature: Align scroll after apply
  In order to keep sticky items aligned
  As a UI system
  I want to compute the scroll delta from touch measurements

  Scenario: Compute delta from measurements
    Given I have measurements <contentY>, <pressedY>, <pressedHeight>
    When I compute the delta
    Then the result equals <delta>

    Examples:
      | contentY | pressedY | pressedHeight | delta |
      | 100      | 120      | 60            | 50    |
      | 200      | 150      | 20            | -40   |
