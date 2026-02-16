Feature: Font variants mapping
  Scenario: maps numeric weights to string weight keys
    Given mocked font files for TestFamily with weights 700 and 400
    When I import font variants from constants
    Then TestFamily has string weight keys ['400', '700']

  Scenario: maps each weight to the expected normal file
    Given mocked font files for TestFamily with weights 700 and 400
    When I import font variants from constants
    Then TestFamily maps weight 400 and 700 to their normal files

  Scenario: exposes frozen font variants object
    Given mocked font files for TestFamily with weights 700 and 400
    When I import font variants from constants
    Then font variants object is frozen
