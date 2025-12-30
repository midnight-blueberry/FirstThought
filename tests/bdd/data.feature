Feature: Data helpers

  Scenario: adding a diary saves it and it appears in the list
    Given a diary "My Diary" is created
    When the diary list is loaded
    Then the diary appears in the list

  Scenario: deleting a diary removes the diary and related entries
    Given a diary "Diary" with an entry is created
    When the diary is deleted
    Then the diary and related data are removed from storage

  Scenario: adding an entry saves it, indexes it, and it can be loaded
    Given a diary "Entry Diary" is created
    And an entry with text "Entry text" is added to the diary
    When the entry is loaded
    Then the loaded entry matches the added data
    And the diary entry index includes the entry id

  Scenario: modifying an entry updates stored data
    Given a diary with an entry to modify exists
    When the entry is modified with new text "Updated text" and mood "happy"
    Then the loaded entry contains the updated data and preserved fields

  Scenario: deleting an entry removes it and updates the index
    Given a diary with an entry to delete exists
    When the entry is deleted
    Then the entry cannot be loaded
    And the diary entry index no longer includes the entry id

  Scenario: moving an entry updates diary indices
    Given two diaries exist and one contains an entry
    When the entry is moved from the first diary to the second
    Then the source diary index no longer lists the entry
    And the destination diary index lists the entry

  Scenario: loading diaries fails on invalid stored data
    Given storage contains invalid diaries data
    When diaries are loaded
    Then an error is thrown with message "Invalid diaries data"
