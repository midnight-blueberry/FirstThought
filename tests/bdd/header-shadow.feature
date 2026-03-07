Feature: Header shadow
  Scenario: ignores scroll updates at top
    Given the header scroll handler hook is initialized
    When the scroll offset is 0
    Then no header options are changed

  Scenario: ignores scroll updates after scrolling
    Given the header scroll handler hook is initialized
    When the scroll offset is 5
    Then no header options are changed
