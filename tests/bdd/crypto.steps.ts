import { webcrypto } from 'crypto';
import { defineFeature, loadFeature } from 'jest-cucumber';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

const store = new Map<string, string>();

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
  setItemAsync: jest.fn((key: string, value: string) => {
    store.set(key, value);
    return Promise.resolve();
  }),
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'after_first_unlock',
}));

const feature = loadFeature('tests/bdd/crypto.feature');

defineFeature(feature, test => {
  test('Encrypt and decrypt using AES-GCM', ({ given, when, then, and }) => {
    const message = 'Secret message';
    let encrypted = '';
    let decrypted = '';

    given('a generated encryption key', async () => {
      store.clear();
      const { generateKey } = await import('@utils/crypto');
      await generateKey();
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
});
