import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { defineFeature, loadFeature } from 'jest-cucumber';

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
import type { DiaryMeta } from '@/types/data';

const feature = loadFeature('tests/bdd/data.feature');

defineFeature(feature, (test) => {
  beforeEach(async () => {
    (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage.clear();
    (SecureStore as unknown as { __store: Map<string, string> }).__store.clear();
    await SecureStore.setItemAsync('enc_key', 'dummy');
  });

  test('добавление дневника сохраняет его и он появляется в списке', ({ given, when, then }) => {
    let diary: DiaryMeta | null = null;
    let list: DiaryMeta[] = [];

    given(/^создан дневник "(.+)"$/, async (title: string) => {
      diary = await addDiary(title);
    });

    when('загружен список дневников', async () => {
      list = await loadDiaries();
    });

    then('дневник появляется в списке', () => {
      expect(diary).not.toBeNull();
      expect(diary!.title).toBe('My Diary');
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(diary!.id);
    });
  });

  test('удаление дневника удаляет дневник и связанные записи', ({ given, when, then }) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';

    given(/^создан дневник "(.+)" с записью$/, async (title: string) => {
      diary = await addDiary(title);
      entryId = await addEntry(diary.id, { text: 'hello' });
      expect(await AsyncStorage.getItem(`record_${entryId}`)).not.toBeNull();
    });

    when('дневник удален', async () => {
      await deleteDiary(diary!.id);
    });

    then('дневник и связанные данные удалены из хранилища', async () => {
      const list = await loadDiaries();
      expect(list).toHaveLength(0);
      expect(await AsyncStorage.getItem(`record_${entryId}`)).toBeNull();
      expect(await AsyncStorage.getItem(`__enc_entry_ids_${diary!.id}`)).toBeNull();
    });
  });
});
