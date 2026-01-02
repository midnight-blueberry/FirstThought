Feature: usePrevious hook
  Scenario: returns undefined on first render
    Given I render a component using usePrevious with initial value 1
    When the component finishes the first render
    Then the hook tracks the previous value as undefined

  Scenario: returns previous value after update
    Given I render a component using usePrevious with initial value 1
    When I update the value to 2
    Then the hook tracks the previous value as 1
