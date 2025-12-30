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
    Given a diary "Diary" is created
    When an entry is added to the diary
    Then the entry can be loaded with its original data
    And the diary entry ids include the entry id
  Scenario: modifying an entry updates stored data
    Given a diary "Diary" with an entry is created
    When the entry is modified with new data
    Then the entry reflects the updated data while keeping other fields
  Scenario: deleting an entry removes it and updates index
    Given a diary "Diary" with an entry is created
    When the entry is deleted
    Then the entry is removed and the diary index is updated
  Scenario: moving an entry updates diary indices
    Given two diaries exist
    And the first diary has an entry
    When the entry is moved to the second diary
    Then the entry id is removed from the first diary index
    And the entry id is added to the second diary index
  Scenario: loading diaries fails on invalid stored data
    Given invalid data is stored for diaries
    When the diary list is loaded
    Then loading diaries fails with an invalid data error
