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
  Scenario: deleting an entry removes it from storage and diary index
    Given a diary "Diary" is created
    When an entry with text "hello" is added to the diary
    When the entry is deleted from the diary
    Then the entry record is removed from storage
    Then the diary entry index does not include the entry id
    Then the entry cannot be loaded

  Scenario: deleting one of multiple entries preserves the other entry
    Given a diary "Diary" is created
    When an entry with text "first" is added to the diary
    When an entry with text "second" is added to the diary
    When the first entry is deleted from the diary
    Then the diary entry index does not include the first entry id
    Then the diary entry index includes the second entry id
    Then the second saved entry can be loaded
  Scenario: modifying a missing entry fails with a diary-specific error
    Given a diary "Diary" is created
    When modifying entry "missing_entry" in the diary
    Then modifying the entry fails with message "Entry \"missing_entry\" not found in diary \"<diaryId>\""
  Scenario: deleting a diary removes the diary and related entries
    Given a diary "Diary" with an entry is created
    When the diary is deleted
    Then the diary and related data are removed from storage

  Scenario: deleting one diary does not remove other diaries
    Given diaries "First Diary" and "Second Diary" are created
    When the first diary is deleted
    Then the second diary still appears in the diary list
    Then the first diary does not appear in the diary list

  Scenario: moving an entry between diaries updates indices
    Given diaries "First Diary" and "Second Diary" are created
    Given an entry with text "hello" is added to the first diary
    When the entry is moved to the second diary
    Then the first diary index does not include the entry id
    Then the second diary index includes the entry id
    Then the saved entry data can still be loaded

  Scenario: moving a missing entry between diaries fails with a diary-specific error
    Given diaries "First Diary" and "Second Diary" are created
    When moving entry "missing_entry" from the first diary to the second diary
    Then moving the entry fails with message "Entry \"missing_entry\" not found in diary \"<fromDiaryId>\""

  Scenario: moving an already-present entry to a diary fails with a diary-specific error
    Given diaries "First Diary" and "Second Diary" are created
    Given entry "shared_entry" exists in both diary indices
    When moving entry "shared_entry" from the first diary to the second diary
    Then moving the entry fails with message "Entry \"shared_entry\" already exists in diary \"<toDiaryId>\""

  Scenario: moving an already-present entry does not change diary indices
    Given diaries "First Diary" and "Second Diary" are created
    Given entry "shared_entry" exists in both diary indices
    When moving entry "shared_entry" from the first diary to the second diary
    Then moving the entry fails with message "Entry \"shared_entry\" already exists in diary \"<toDiaryId>\""
    Then the first diary index still includes entry "shared_entry"
    Then the second diary index still includes entry "shared_entry"

  Scenario: modifying an entry without a stored record fails
    Given a diary "Diary" is created
    When the diary contains an indexed entry without a record
    When modifying entry "ghost_entry" in the diary
    Then modifying the entry fails with message "Record \"ghost_entry\" not found"

  Scenario: loading diaries throws when stored data is invalid
    Given invalid diary data is stored
    When the diary list is loaded
    Then loading diaries fails with message "Invalid diaries data"

  Scenario: loading an entry throws when stored data is invalid
    Given invalid entry data is stored for entry "bad_entry"
    When the entry "bad_entry" is loaded
    Then loading the entry fails with message "Invalid entry data for id \"bad_entry\""
