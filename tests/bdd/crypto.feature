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
