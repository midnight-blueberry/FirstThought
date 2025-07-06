import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

// Ключи для индексов
const DIARIES_KEY      = '__encrypted_diaries__';    // список ваших дневников
const ENTRIES_KEY_PREF = '__enc_entry_ids_';         // префикс для списка ID записей конкретного дневника

// Тип мета-информации дневника
export interface DiaryMeta {
  id: string;
  title: string;
  createdAt: number;
} 

async function generateId(): Promise<string> {
  return crypto.randomUUID();
}

// Генерируем 256-битный ключ (Base64)
async function generateKey() {
  const key = await generateId();
  await SecureStore.setItemAsync('enc_key', key, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
}

// Получаем ключ из SecureStore
async function getKey() {
  const base64Key = await SecureStore.getItemAsync('enc_key');
  return CryptoJS.enc.Base64.parse(base64Key!);
}

// Шифруем строку
async function encrypt(plain: string): Promise<string> {
  const key = await getKey();
  return CryptoJS.AES.encrypt(plain, key).toString();
}

// Дешифруем
async function decrypt(cipher: string): Promise<string> {
  const key = await getKey();
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/** Работа со списком дневников **/

export async function loadDiaries(): Promise<DiaryMeta[]> {
  const cipher = await AsyncStorage.getItem(DIARIES_KEY);
  if (!cipher) return [];
  return JSON.parse(await decrypt(cipher));
}

export async function saveDiaries(list: DiaryMeta[]) {
  const json = JSON.stringify(list);
  const cipher = await encrypt(json);
  await AsyncStorage.setItem(DIARIES_KEY, cipher);
}

export async function addDiary(title: string): Promise<DiaryMeta> {
  const list = await loadDiaries();
  const newDiary: DiaryMeta = {
    id: await generateId(),
    title,
    createdAt: Date.now(),
  };
  list.push(newDiary);
  await saveDiaries(list);
  return newDiary;
}

export async function deleteDiary(id: string) {
  // 1) удаляем из списка дневников
  let list = await loadDiaries();
  list = list.filter(d => d.id !== id);
  await saveDiaries(list);
  // 2) удаляем связанные записи и их индекс
  const key = ENTRIES_KEY_PREF + id;
  const entryIds = await loadEntryIds(id);
  // удаляем сами записи
  await Promise.all(entryIds.map(eid => AsyncStorage.removeItem(`record_${eid}`)));
  // и удаляем список ID
  await AsyncStorage.removeItem(key);
}

/** Работа со списком записей конкретного дневника **/

async function loadEntryIds(diaryId: string): Promise<string[]> {
  const key = ENTRIES_KEY_PREF + diaryId;
  const cipher = await AsyncStorage.getItem(key);
  if (!cipher) return [];
  return JSON.parse(await decrypt(cipher));
}

async function saveEntryIds(diaryId: string, ids: string[]) {
  const key = ENTRIES_KEY_PREF + diaryId;
  const json = JSON.stringify(ids);
  const cipher = await encrypt(json);
  await AsyncStorage.setItem(key, cipher);
}

// Чтение одной записи
export async function loadEntry(id: string): Promise<any|null> {
  const cipher = await AsyncStorage.getItem(`record_${id}`);
  if (!cipher) return null;
  return JSON.parse(await decrypt(cipher));
}

// Добавление новой записи в дневник
export async function addEntry(diaryId: string, data: object): Promise<string> {
  // 1. Генерируем ID и сохраняем данные
  const entryId = await generateId();
  await saveEntry(entryId, data);

  // 2. Обновляем индекс записей этого дневника
  const ids = await loadEntryIds(diaryId);
  ids.push(entryId);
  await saveEntryIds(diaryId, ids);

  return entryId;
}

// Модификация существующей записи
export async function modifyEntry(
  diaryId: string,
  entryId: string,
  updates: Record<string, any>
) {
  // проверяем, что такая запись есть в индексе
  const ids = await loadEntryIds(diaryId);
  if (!ids.includes(entryId)) {
    throw new Error(`Entry "${entryId}" not found in diary "${diaryId}"`);
  }
  const existing = await loadEntry(entryId);
  if (!existing) throw new Error(`Record "${entryId}" not found`);
  const merged = { ...existing, ...updates };
  await saveEntry(entryId, merged);
}

// Удаление записи из дневника
export async function deleteEntry(diaryId: string, entryId: string) {
  // 1) удаляем данные записи
  await AsyncStorage.removeItem(`record_${entryId}`);
  // 2) удаляем из индекса этого дневника
  const ids = await loadEntryIds(diaryId);
  const filtered = ids.filter(id => id !== entryId);
  await saveEntryIds(diaryId, filtered);
}

// Сохранение/перезапись записи (уже есть)
export async function saveEntry(id: string, data: object): Promise<void> {
  const json = JSON.stringify(data);
  const cipher = await encrypt(json);
  await AsyncStorage.setItem(`record_${id}`, cipher);
}

/** Перенос записи между дневниками **/
export async function moveEntry(
  fromDiaryId: string,
  toDiaryId: string,
  entryId: string
): Promise<void> {
  // Проверяем наличие в исходном дневнике
  const fromIds = await loadEntryIds(fromDiaryId);
  if (!fromIds.includes(entryId)) {
    throw new Error(`Entry "${entryId}" not found in diary "${fromDiaryId}"`);
  }

  // Удаляем из исходного
  const updatedFrom = fromIds.filter(id => id !== entryId);
  await saveEntryIds(fromDiaryId, updatedFrom);

  // Добавляем в целевой дневник
  const toIds = await loadEntryIds(toDiaryId);
  if (toIds.includes(entryId)) {
    throw new Error(`Entry "${entryId}" already exists in diary "${toDiaryId}"`);
  }
  toIds.push(entryId);
  await saveEntryIds(toDiaryId, toIds);
}
