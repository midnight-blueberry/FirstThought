Feature: fixUseInsertionEffect utility
  Scenario: with useInsertionEffect
    Given React provides useInsertionEffect
    When fixUseInsertionEffect is imported
    Then React.useInsertionEffect equals React.useLayoutEffect

  Scenario: without useInsertionEffect
    Given React does not provide useInsertionEffect
    When fixUseInsertionEffect is imported
    Then React.useInsertionEffect remains undefined
