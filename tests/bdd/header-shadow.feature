Feature: Header shadow

  Scenario: offset zero keeps header flat
    Given the header shadow hook is rendered
    When the scroll offset is 0
    Then navigation options disable the header shadow

  Scenario: offset ten enables header shadow
    Given the header shadow hook is rendered
    When the scroll offset is 10
    Then navigation options enable the header shadow
