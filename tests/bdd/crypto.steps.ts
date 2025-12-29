import { webcrypto } from 'crypto';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import * as SecureStore from 'expo-secure-store';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

const generateEncryptionKeyForTest = async () => {
  (SecureStore as unknown as { reset: () => void }).reset();
  const { generateKey } = await import('@utils/crypto');
  await generateKey();
};

jest.mock('expo-secure-store', () => require('../mocks/expoSecureStoreMock'));

export default (test: JestCucumberTestFn) => {
  test('Encrypt and decrypt using AES-GCM', ({ given, when, then, and = () => {} }: StepDefinitions) => {
    const message = 'Secret message';
    let encrypted = '';
    let decrypted = '';

    given('a generated encryption key', async () => {
      await generateEncryptionKeyForTest();
    });

    when('I encrypt a plain message', async () => {
      const { encrypt } = await import('@utils/crypto');
      encrypted = await encrypt(message);
    });

    then('the encrypted text should be different and versioned', () => {
      expect(encrypted).toMatch(/^v2:/);
      expect(encrypted).not.toBe(message);
    });

    and('decrypting returns the original message', async () => {
      const { decrypt } = await import('@utils/crypto');
      decrypted = await decrypt(encrypted);
      expect(decrypted).toBe(message);
    });
  });

  test('Encrypting the same message twice produces different ciphertexts', ({ given, when, then, and = () => {} }: StepDefinitions) => {
    const message = 'Secret message';
    let encrypted1 = '';
    let encrypted2 = '';

    given('a generated encryption key', async () => {
      await generateEncryptionKeyForTest();
    });

    when('I encrypt the same plain message twice', async () => {
      const { encrypt } = await import('@utils/crypto');
      encrypted1 = await encrypt(message);
      encrypted2 = await encrypt(message);
    });

    then('the encrypted texts should be different and versioned', () => {
      expect(encrypted1).toMatch(/^v2:/);
      expect(encrypted2).toMatch(/^v2:/);
      expect(encrypted1).not.toBe(encrypted2);
    });

    and('decrypting both returns the original message', async () => {
      const { decrypt } = await import('@utils/crypto');
      const decrypted1 = await decrypt(encrypted1);
      const decrypted2 = await decrypt(encrypted2);
      expect(decrypted1).toBe(message);
      expect(decrypted2).toBe(message);
    });
  });
};
