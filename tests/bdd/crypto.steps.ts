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
  const registerGeneratedEncryptionKeyStep = (given: StepDefinitions['given']) => {
    given('a generated encryption key', async () => {
      await generateEncryptionKeyForTest();
    });
  };

  const registerEncryptedTextVersionCheck = (
    then: StepDefinitions['then'],
    state: { encrypted: string; message: string },
  ) => {
    then('the encrypted text should be different and versioned', () => {
      expect(state.encrypted).toMatch(/^v2:/);
      expect(state.encrypted).not.toBe(state.message);
    });
  };

  const registerEncryptedTextsVersionCheck = (
    then: StepDefinitions['then'],
    state: { encrypted1: string; encrypted2: string },
  ) => {
    then('the encrypted texts should be different and versioned', () => {
      expect(state.encrypted1).toMatch(/^v2:/);
      expect(state.encrypted2).toMatch(/^v2:/);
      expect(state.encrypted1).not.toBe(state.encrypted2);
    });
  };

  test('Encrypt and decrypt using AES-GCM', ({ given, when, then, and = () => {} }: StepDefinitions) => {
    const state = { message: 'Secret message', encrypted: '', decrypted: '' };

    registerGeneratedEncryptionKeyStep(given);

    when('I encrypt a plain message', async () => {
      const { encrypt } = await import('@utils/crypto');
      state.encrypted = await encrypt(state.message);
    });

    registerEncryptedTextVersionCheck(then, state);

    and('decrypting returns the original message', async () => {
      const { decrypt } = await import('@utils/crypto');
      state.decrypted = await decrypt(state.encrypted);
      expect(state.decrypted).toBe(state.message);
    });
  });

  test('Encrypting the same message twice produces different ciphertexts', ({ given, when, then, and = () => {} }: StepDefinitions) => {
    const state = { message: 'Secret message', encrypted1: '', encrypted2: '' };

    registerGeneratedEncryptionKeyStep(given);

    when('I encrypt the same plain message twice', async () => {
      const { encrypt } = await import('@utils/crypto');
      state.encrypted1 = await encrypt(state.message);
      state.encrypted2 = await encrypt(state.message);
    });

    registerEncryptedTextsVersionCheck(then, state);

    and('decrypting both returns the original message', async () => {
      const { decrypt } = await import('@utils/crypto');
      const decrypted1 = await decrypt(state.encrypted1);
      const decrypted2 = await decrypt(state.encrypted2);
      expect(decrypted1).toBe(state.message);
      expect(decrypted2).toBe(state.message);
    });
  });

  test('Decrypting a malformed v2 payload throws a format error', ({ given, when, then }: StepDefinitions) => {
    const state: { error: unknown } = { error: null };

    registerGeneratedEncryptionKeyStep(given);

    when('I try to decrypt an invalid encrypted payload "v2:AAA"', async () => {
      try {
        const { decrypt } = await import('@utils/crypto');
        await decrypt('v2:AAA');
      } catch (error) {
        state.error = error;
      }
    });

    then('decryption fails with message "Invalid encrypted payload format."', () => {
      expect(state.error).toBeInstanceOf(Error);
      const error = state.error as Error;
      expect(error.message).toBe('Invalid encrypted payload format.');
    });
  });
};
