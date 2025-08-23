import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId, encrypt, decrypt } from '@utils/crypto';
import { loadEntryIds, saveEntryIds, entryIdsKey } from '@utils/storage';

// Ключи для индексов
const DIARIES_KEY = '__encrypted_diaries__'; // список ваших дневников

// Тип мета-информации дневника
export interface DiaryMeta {
  id: string;
  title: string;
  createdAt: number;
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
    id: generateId(),
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
  const entryIds = await loadEntryIds(id);
  // удаляем сами записи
  await Promise.all(entryIds.map(eid => AsyncStorage.removeItem(`record_${eid}`)));
  // и удаляем список ID
  await AsyncStorage.removeItem(entryIdsKey(id));
}

/** Работа со списком записей конкретного дневника **/

// Чтение одной записи
export async function loadEntry(id: string): Promise<any|null> {
  const cipher = await AsyncStorage.getItem(`record_${id}`);
  if (!cipher) return null;
  return JSON.parse(await decrypt(cipher));
}

// Добавление новой записи в дневник
export async function addEntry(diaryId: string, data: object): Promise<string> {
  // 1. Генерируем ID и сохраняем данные
  const entryId = generateId();
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
