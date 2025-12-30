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
