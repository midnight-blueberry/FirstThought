import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

export function generateId(): string {
  return crypto.randomUUID();
}

export async function generateKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const key = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(bytes));
  await SecureStore.setItemAsync('enc_key', key, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
}

export async function getKey() {
  const base64Key = await SecureStore.getItemAsync('enc_key');
  return CryptoJS.enc.Base64.parse(base64Key!);
}

export async function encrypt(plain: string): Promise<string> {
  const key = await getKey();
  return CryptoJS.AES.encrypt(plain, key).toString();
}

export async function decrypt(cipher: string): Promise<string> {
  const key = await getKey();
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
