Feature: Crypto helpers

  Scenario: Encrypt and decrypt using AES-GCM
    Given a generated encryption key
    When I encrypt a plain message
    Then the encrypted text should be different and versioned
    And decrypting returns the original message

  Scenario: Encrypting the same message twice produces different ciphertexts
    Given a generated encryption key
    When I encrypt the same plain message twice
    Then the encrypted texts should be different and versioned
    And decrypting both returns the original message

  Scenario: Decrypting a malformed v2 payload throws a format error
    Given a generated encryption key
    When I try to decrypt an invalid encrypted payload "v2:AAA"
    Then decryption fails with message "Invalid encrypted payload format."

  Scenario: Decrypting a legacy payload throws an unsupported format error
    Given a generated encryption key
    When I try to decrypt an invalid encrypted payload "v1:AAA"
    Then decryption fails with message "Unsupported legacy encryption format. Please clear storage or reinstall the app."

  Scenario: Encrypting without a stored key generates and stores a new key
    Given no stored encryption key
    When I encrypt a plain message
    Then an encryption key is stored
    And decrypting returns the original message
