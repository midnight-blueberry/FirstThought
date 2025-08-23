import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from '@utils/crypto';

const ENTRY_IDS_KEY_PREFIX = '__enc_entry_ids_';

export const entryIdsKey = (diaryId: string) => `${ENTRY_IDS_KEY_PREFIX}${diaryId}`;

export async function loadEntryIds(diaryId: string): Promise<string[]> {
  const key = entryIdsKey(diaryId);
  const cipher = await AsyncStorage.getItem(key);
  if (!cipher) return [];
  return JSON.parse(await decrypt(cipher)) as string[];
}

export async function saveEntryIds(diaryId: string, ids: string[]) {
  const key = entryIdsKey(diaryId);
  const json = JSON.stringify(ids);
  const cipher = await encrypt(json);
  await AsyncStorage.setItem(key, cipher);
}
