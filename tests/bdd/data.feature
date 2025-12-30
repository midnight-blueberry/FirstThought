Feature: Data helpers
  Scenario: adding a diary saves it and it appears in the list
    Given a diary "My Diary" is created
    When the diary list is loaded
    Then the diary appears in the list

  Scenario: adding an entry saves it, indexes it, and it can be loaded
    Given a diary "Diary" is created
    When an entry with text "hello" is added to the diary
    Then the saved entry can be loaded
    Then the diary entry index includes the entry id

  Scenario: modifying an entry updates stored data and preserves other fields
    Given a diary "Diary" is created
    When an entry with text "hello" and mood "happy" is added to the diary
    When the entry text is changed to "bye"
    Then the loaded entry text is "bye"
    Then the loaded entry mood is "happy"
  Scenario: deleting a diary removes the diary and related entries
    Given a diary "Diary" with an entry is created
    When the diary is deleted
    Then the diary and related data are removed from storage
