import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

let errorSpy: jest.SpyInstance;

beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockClear();
});

afterAll(() => {
  errorSpy.mockRestore();
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map<string, string>();
  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage.get(key) ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      storage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      storage.delete(key);
      return Promise.resolve();
    }),
    __storage: storage,
  };
});

// Mock SecureStore
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

// Mock crypto helpers to bypass encryption in data tests
jest.mock('@utils/crypto', () => {
  let counter = 0;
  return {
    encrypt: jest.fn(async (plain: string) => plain),
    decrypt: jest.fn(async (cipher: string) => cipher),
    generateId: jest.fn(() => `id_${(counter += 1)}`),
    generateKey: jest.fn(async () => Promise.resolve()),
  };
});

import { addDiary, deleteDiary, loadDiaries, addEntry } from '@/scripts/data';

describe('data helpers', () => {
  beforeEach(async () => {
    // reset storages and seed encryption key
    (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage.clear();
    (SecureStore as unknown as { __store: Map<string, string> }).__store.clear();
    await SecureStore.setItemAsync('enc_key', 'dummy');
  });

  it('addDiary adds a new diary', async () => {
    const diary = await addDiary('My Diary');
    expect(diary.title).toBe('My Diary');

    const list = await loadDiaries();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(diary.id);
  });

  it('deleteDiary removes diary and related entries', async () => {
    const diary = await addDiary('Diary');
    const entryId = await addEntry(diary.id, { text: 'hello' });

    // ensure entry stored
    expect(await AsyncStorage.getItem(`record_${entryId}`)).not.toBeNull();

    await deleteDiary(diary.id);

    const list = await loadDiaries();
    expect(list).toHaveLength(0);
    expect(await AsyncStorage.getItem(`record_${entryId}`)).toBeNull();
    expect(await AsyncStorage.getItem(`__enc_entry_ids_${diary.id}`)).toBeNull();
  });
});
