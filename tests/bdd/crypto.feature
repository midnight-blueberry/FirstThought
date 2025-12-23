Feature: Crypto utilities
  Scenario: Encrypt and decrypt with generated key
    Given I have a plaintext message
    When I encrypt the message
    Then the ciphertext should be prefixed with v2
    And the ciphertext should not equal the plaintext
    And decrypting the ciphertext returns the original message
