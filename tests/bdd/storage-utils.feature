Feature: Storage utils
  Scenario: entryIdsKey returns prefixed key for diary id
    Given a diary id "diary1"
    When I build the entry ids key
    Then the key is "__enc_entry_ids_diary1"

  Scenario: loadEntryIds returns an empty array when storage is missing
    Given no entry ids are stored for diary "diary1"
    When I load the entry ids
    Then the result is an empty list
    Then decrypt is not called

  Scenario: loadEntryIds returns parsed entry ids when stored value exists
    Given encrypted entry ids "ciphertext" for diary "diary1" decrypting to "[\"id1\",\"id2\"]"
    When I load the entry ids
    Then the result matches the decrypted entry ids
    Then decrypt is called with the stored cipher text

  Scenario: saveEntryIds encrypts and stores entry ids
    Given entry ids "[\"id1\",\"id2\"]" for diary "diary1"
    When I save the entry ids
    Then encrypt is called with the JSON string
    Then AsyncStorage stores the cipher text under the entry ids key
