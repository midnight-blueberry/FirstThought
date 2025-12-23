import { defineFeature, loadFeature } from 'jest-cucumber';
import { webcrypto } from 'crypto';

const feature = loadFeature('tests/bdd/crypto.feature');

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    setItemAsync: jest.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'after_first_unlock',
    __store: store,
  };
});

if (!globalThis.crypto?.subtle) {
  (globalThis as { crypto: Crypto }).crypto = webcrypto as Crypto;
}

let generateKey: typeof import('@/utils/crypto').generateKey;
let encrypt: typeof import('@/utils/crypto').encrypt;
let decrypt: typeof import('@/utils/crypto').decrypt;

defineFeature(feature, (test: any) => {
  beforeAll(async () => {
    const cryptoUtils = await import('@/utils/crypto');
    generateKey = cryptoUtils.generateKey;
    encrypt = cryptoUtils.encrypt;
    decrypt = cryptoUtils.decrypt;
  });

  test('Encrypt and decrypt with generated key', ({ given, when, then, and }: any) => {
    let plaintext = '';
    let ciphertext = '';

    given('I have a plaintext message', () => {
      plaintext = 'Hello secure world';
    });

    when('I encrypt the message', async () => {
      await generateKey();
      ciphertext = await encrypt(plaintext);
    });

    then('the ciphertext should be prefixed with v2', () => {
      expect(ciphertext.startsWith('v2:')).toBe(true);
    });

    and('the ciphertext should not equal the plaintext', () => {
      expect(ciphertext).not.toEqual(plaintext);
    });

    and('decrypting the ciphertext returns the original message', async () => {
      const decrypted = await decrypt(ciphertext);
      expect(decrypted).toBe(plaintext);
    });
  });
});
