Feature: Sticky align scroll

  Scenario: returns delta for registered ref
    Given a ref is registered for theme dark at y 200 with height 20
    When alignScrollAfterApply runs with prevCenterY 190 for theme dark
    Then the alignScrollAfterApply result is 20

  Scenario: returns zero when ref is missing
    Given no ref is registered for theme missing
    When alignScrollAfterApply runs with prevCenterY 190 for theme missing
    Then the alignScrollAfterApply result is 0
