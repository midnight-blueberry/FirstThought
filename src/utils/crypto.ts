import * as SecureStore from 'expo-secure-store';

declare const Buffer: {
  from: (data: Uint8Array | string, encoding?: string) => { toString: (encoding: string) => string };
};

export function generateId(): string {
  return crypto.randomUUID();
}

const KEY_STORAGE = 'enc_key';
const IV_LENGTH = 12;

function encodeBase64(bytes: Uint8Array): string {
  if (typeof globalThis.btoa === 'function') {
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return globalThis.btoa(binary);
  }

  return Buffer.from(bytes).toString('base64');
}

function decodeBase64(value: string): Uint8Array {
  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  return new Uint8Array(Buffer.from(value, 'base64'));
}

async function getRawKey(): Promise<Uint8Array> {
  const stored = await SecureStore.getItemAsync(KEY_STORAGE);
  if (stored) {
    return decodeBase64(stored);
  }

  const bytes = crypto.getRandomValues(new Uint8Array(32));
  await SecureStore.setItemAsync(KEY_STORAGE, encodeBase64(bytes), {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
  return bytes;
}

async function importKey(rawKey: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function generateKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  await SecureStore.setItemAsync(KEY_STORAGE, encodeBase64(bytes), {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
}

export async function getKey() {
  return getRawKey();
}

export async function encrypt(plain: string): Promise<string> {
  const rawKey = await getRawKey();
  const key = await importKey(rawKey);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plain);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const cipherBytes = new Uint8Array(cipherBuffer);
  return `v2:${encodeBase64(iv)}:${encodeBase64(cipherBytes)}`;
}

export async function decrypt(cipher: string): Promise<string> {
  if (!cipher.startsWith('v2:')) {
    throw new Error(
      'Legacy encryption format detected. Please clear stored data or reinstall the app.',
    );
  }

  const [, ivBase64, cipherBase64] = cipher.split(':');
  if (!ivBase64 || !cipherBase64) {
    throw new Error('Invalid encrypted payload format.');
  }

  const rawKey = await getRawKey();
  const key = await importKey(rawKey);
  const iv = decodeBase64(ivBase64);
  const cipherBytes = decodeBase64(cipherBase64);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherBytes,
  );
  return new TextDecoder().decode(new Uint8Array(plainBuffer));
}
