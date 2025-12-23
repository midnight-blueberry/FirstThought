import * as SecureStore from 'expo-secure-store';

const KEY_STORAGE_KEY = 'enc_key';
const KEY_LENGTH_BYTES = 32;
const IV_LENGTH_BYTES = 12;
const ENCRYPTION_VERSION_PREFIX = 'v2';

export function generateId(): string {
  return crypto.randomUUID();
}

export async function generateKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(KEY_LENGTH_BYTES));
  const key = bytesToBase64(bytes);
  await SecureStore.setItemAsync(KEY_STORAGE_KEY, key, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
}

async function getKeyBytes() {
  const base64Key = await SecureStore.getItemAsync(KEY_STORAGE_KEY);
  if (!base64Key) {
    await generateKey();
    const storedKey = await SecureStore.getItemAsync(KEY_STORAGE_KEY);
    if (!storedKey) {
      throw new Error('Failed to generate encryption key.');
    }
    return base64ToBytes(storedKey);
  }
  return base64ToBytes(base64Key);
}

export async function getKey(): Promise<Uint8Array> {
  return getKeyBytes();
}

async function importKey(keyBytes: Uint8Array) {
  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encrypt(plain: string): Promise<string> {
  const keyBytes = await getKeyBytes();
  const key = await importKey(keyBytes);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
  const plainBytes = new TextEncoder().encode(plain);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plainBytes);
  const cipherBytes = new Uint8Array(cipherBuffer);
  return [
    ENCRYPTION_VERSION_PREFIX,
    bytesToBase64(iv),
    bytesToBase64(cipherBytes),
  ].join(':');
}

export async function decrypt(cipher: string): Promise<string> {
  if (!cipher.startsWith(`${ENCRYPTION_VERSION_PREFIX}:`)) {
    throw new Error(
      'Unsupported legacy encryption format. Please clear storage or reinstall the app.'
    );
  }
  const parts = cipher.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format.');
  }
  const [, ivBase64, dataBase64] = parts;
  const keyBytes = await getKeyBytes();
  const key = await importKey(keyBytes);
  const iv = base64ToBytes(ivBase64);
  const data = base64ToBytes(dataBase64);
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(plainBuffer);
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof globalThis.btoa === 'function') {
    let binary = '';
    bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return globalThis.btoa(binary);
  }
  const buffer = (globalThis as { Buffer?: { from: (data: Uint8Array) => { toString: (encoding: string) => string } } })
    .Buffer;
  if (!buffer) {
    throw new Error('Base64 encoding is not available in this environment.');
  }
  return buffer.from(bytes).toString('base64');
}

function base64ToBytes(base64: string): Uint8Array {
  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  const buffer = (globalThis as {
    Buffer?: { from: (data: string, encoding: string) => { toString: (encoding: string) => string } };
  }).Buffer;
  if (!buffer) {
    throw new Error('Base64 decoding is not available in this environment.');
  }
  const data = buffer.from(base64, 'base64') as unknown as Uint8Array;
  return new Uint8Array(data);
}
