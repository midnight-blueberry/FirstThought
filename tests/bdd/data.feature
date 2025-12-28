Feature: Data helpers

  Scenario: adding a diary saves it and it appears in the list
    Given a diary "My Diary" is created
    When the diary list is loaded
    Then the diary appears in the list

  Scenario: deleting a diary removes the diary and related entries
    Given a diary "Diary" with an entry is created
    When the diary is deleted
    Then the diary and related data are removed from storage
